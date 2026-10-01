import { useEffect, useRef, useState } from 'react';
import { useStore } from '../store';
import { MapContainer, TileLayer, CircleMarker, Circle, Popup, Polygon, LayersControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { MINE_PANELS } from '../simulation/mockData';
import type { SensorNode, InfrastructureAsset, RiskZone } from '../types';

const ASSET_ICON: Record<string, string> = {
  Settlement: '🏠',
  Road: '🛣️',
  Railway: '🚆',
  Utility: '⚡',
  'Mine Infrastructure': '⛏️',
};

function SensorPopup({ s }: { s: SensorNode }) {
  const samplingLabel = s.samplingInterval <= 15 ? 'Adaptive (15s)' : s.samplingInterval <= 30 ? 'Elevated (30s)' : 'Normal (60s)';
  return (
    <div style={{ padding: '0.75rem', minWidth: 200, fontFamily: 'Inter, sans-serif' }}>
      <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.5rem', paddingBottom: '0.4rem', borderBottom: '1px solid #e2e8f0' }}>
        NODE {s.id}
        <span className={`badge ${s.status === 'Healthy' ? 'badge-stable' : s.status === 'Watch' ? 'badge-watch' : s.status === 'Warning' ? 'badge-warning' : 'badge-critical'}`} style={{ marginLeft: '0.5rem', verticalAlign: 'middle' }}>
          {s.status}
        </span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.25rem 0.75rem', fontSize: '0.75rem' }}>
        {[
          ['Tilt', `${s.tilt.toFixed(2)}°`],
          ['Displacement', `${s.displacement.toFixed(1)} mm`],
          ['Vibration', s.vibration],
          ['Battery', `${s.battery.toFixed(0)}%`],
          ['RSSI', `${s.rssi.toFixed(0)} dBm`],
          ['Interval', samplingLabel],
        ].map(([k, v]) => (
          <div key={k}>
            <span style={{ color: '#94a3b8', fontSize: '0.68rem' }}>{k}</span>
            <div style={{ fontWeight: 600, color: '#0f172a' }}>{v}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: '0.5rem', fontSize: '0.65rem', color: '#94a3b8' }}>
        LoRa SNR: {s.snr.toFixed(1)} dB &nbsp;|&nbsp; PKT: {s.packetDelivery.toFixed(0)}%
      </div>
      <div style={{ marginTop: '0.4rem', padding: '0.3rem 0.5rem', background: 'rgba(13,148,136,0.06)', borderRadius: '0.35rem', fontSize: '0.65rem', color: '#0d9488', fontWeight: 600 }}>
        ✦ Kalman Filter: ACTIVE &nbsp;&nbsp; ✦ Fusion: ACTIVE
      </div>
    </div>
  );
}

function ZonePopup({ z }: { z: RiskZone }) {
  const color = z.severity === 'CRITICAL' ? '#ef4444' : z.severity === 'WARNING' ? '#f97316' : '#f59e0b';
  return (
    <div style={{ padding: '0.75rem', minWidth: 220, fontFamily: 'Inter, sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', paddingBottom: '0.4rem', borderBottom: '1px solid #e2e8f0' }}>
        <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>ZONE {z.id}</span>
        <span className={`badge badge-${z.severity.toLowerCase()}`}>{z.severity}</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.25rem 0.75rem', fontSize: '0.75rem', marginBottom: '0.5rem' }}>
        {[
          ['Deformation', `${z.deformation.toFixed(1)} mm`],
          ['Velocity', `+${z.velocity.toFixed(2)} mm/day`],
          ['Acceleration', `+${z.acceleration.toFixed(2)} mm/day²`],
          ['Persistence', `${z.persistence} days`],
          ['Agreement', `${z.sensorAgreement}%`],
          ['Confidence', z.confidence],
        ].map(([k, v]) => (
          <div key={k}>
            <span style={{ color: '#94a3b8', fontSize: '0.68rem' }}>{k}</span>
            <div style={{ fontWeight: 600, color: '#0f172a' }}>{v}</div>
          </div>
        ))}
      </div>
      <div style={{ fontSize: '0.7rem' }}>
        <div style={{ fontWeight: 700, color: '#475569', marginBottom: '0.2rem' }}>Evidence:</div>
        {z.reasons.slice(0, 4).map(r => (
          <div key={r} style={{ display: 'flex', gap: '0.25rem', alignItems: 'baseline' }}>
            <span style={{ color: '#10b981' }}>✓</span>
            <span style={{ color: '#475569' }}>{r}</span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: '0.5rem', padding: '0.3rem 0.5rem', background: `${color}12`, border: `1px solid ${color}30`, borderRadius: '0.35rem', fontSize: '0.68rem', color, fontWeight: 700 }}>
        ⚠ FIELD INSPECTION RECOMMENDED
      </div>
    </div>
  );
}

export function RiskMap() {
  const { sensors, riskZones, infrastructure, insar } = useStore();
  const center: [number, number] = [23.75, 86.42];
  const activeInSAR = insar.find(o => o.active);

  const getSensorColor = (s: SensorNode) => {
    switch (s.status) {
      case 'Healthy': return '#10b981';
      case 'Watch':   return '#f59e0b';
      case 'Warning': return '#f97316';
      case 'Tampered':
      case 'Offline': return '#94a3b8';
      default:        return '#10b981';
    }
  };

  const getZoneColor = (z: RiskZone) => {
    switch (z.severity) {
      case 'CRITICAL': return '#ef4444';
      case 'WARNING':  return '#f97316';
      case 'WATCH':    return '#f59e0b';
      default:         return '#10b981';
    }
  };

  return (
    <div className="card" style={{ height: '100%', position: 'relative', overflow: 'hidden', padding: 0 }}>
      {/* Map header */}
      <div style={{
        position: 'absolute', top: 10, left: 10, zIndex: 1000,
        background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)',
        borderRadius: '0.5rem', border: '1px solid var(--color-border)',
        padding: '0.4rem 0.75rem', fontSize: '0.72rem', fontWeight: 700,
        color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: '0.4rem',
        boxShadow: 'var(--shadow-card)',
      }}>
        <span style={{ color: 'var(--color-primary)' }}>◉</span>
        GIS Surface Monitoring — Zone Overview
        {activeInSAR && (
          <span className="badge badge-insar" style={{ marginLeft: '0.5rem' }}>InSAR ACTIVE</span>
        )}
      </div>

      {/* Legend */}
      <div style={{
        position: 'absolute', bottom: 28, right: 10, zIndex: 1000,
        background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)',
        borderRadius: '0.5rem', border: '1px solid var(--color-border)',
        padding: '0.6rem 0.75rem', fontSize: '0.65rem',
        boxShadow: 'var(--shadow-card)',
      }}>
        <div style={{ fontWeight: 700, marginBottom: '0.4rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.6rem' }}>Legend</div>
        {[
          ['#10b981', 'Sensor — Healthy'],
          ['#f59e0b', 'Sensor — Watch'],
          ['#ef4444', 'Sensor — Warning'],
          ['#94a3b8', 'Sensor — Offline'],
        ].map(([color, label]) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, display: 'inline-block', border: '1.5px solid white', boxShadow: '0 0 0 1px #e2e8f0' }} />
            <span style={{ color: 'var(--color-text-secondary)' }}>{label}</span>
          </div>
        ))}
        <div style={{ marginTop: '0.35rem', paddingTop: '0.35rem', borderTop: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
            <span style={{ width: 12, height: 8, background: 'rgba(249,115,22,0.25)', border: '1.5px solid #f97316', display: 'inline-block', borderRadius: '2px' }} />
            <span style={{ color: 'var(--color-text-secondary)' }}>Risk Zone</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: 12, height: 4, background: 'transparent', borderTop: '2px dashed #1e293b', display: 'inline-block' }} />
            <span style={{ color: 'var(--color-text-secondary)' }}>Mine Panel</span>
          </div>
        </div>
      </div>

      <MapContainer
        center={center}
        zoom={14}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com">CARTO</a>'
          maxZoom={19}
        />

        {/* Mine Panels */}
        {MINE_PANELS.map(p => (
          <Polygon
            key={p.id}
            positions={p.coords}
            pathOptions={{ color: '#1e293b', weight: 1.5, dashArray: '6 4', fillOpacity: 0.06, fillColor: '#1e293b' }}
          >
            <Popup>
              <div style={{ padding: '0.5rem', fontFamily: 'Inter, sans-serif', fontSize: '0.8rem' }}>
                <b>{p.name}</b>
                <div style={{ color: '#94a3b8', fontSize: '0.7rem', marginTop: '0.25rem' }}>{p.active ? '🔴 Active Workings' : '⬛ Old Workings'}</div>
              </div>
            </Popup>
          </Polygon>
        ))}

        {/* InSAR simulated overlay — purple heatmap-style circles */}
        {activeInSAR && (
          <>
            <Circle center={[23.760, 86.431]} radius={500} pathOptions={{ color: '#d946ef', fillColor: '#d946ef', fillOpacity: 0.12, weight: 1.5, dashArray: '4 4' }} />
            <Circle center={[23.758, 86.429]} radius={300} pathOptions={{ color: '#d946ef', fillColor: '#d946ef', fillOpacity: 0.18, weight: 1 }} />
          </>
        )}

        {/* Risk Zones */}
        {riskZones.map(z => (
          <Circle
            key={z.id}
            center={[z.lat, z.lng]}
            radius={z.radius}
            pathOptions={{
              color: getZoneColor(z),
              fillColor: getZoneColor(z),
              fillOpacity: 0.15,
              weight: 2.5,
            }}
          >
            <Popup><ZonePopup z={z} /></Popup>
          </Circle>
        ))}

        {/* Infrastructure */}
        {infrastructure.map(asset => {
          const c = asset.impactStatus === 'Impacted' ? '#ef4444' : asset.impactStatus === 'Watch' ? '#f97316' : '#64748b';
          return (
            <CircleMarker
              key={asset.id}
              center={[asset.lat, asset.lng]}
              radius={5}
              pathOptions={{ color: 'white', weight: 1.5, fillColor: c, fillOpacity: 0.9 }}
            >
              <Popup>
                <div style={{ padding: '0.5rem', fontFamily: 'Inter, sans-serif' }}>
                  <b style={{ fontSize: '0.8rem' }}>{ASSET_ICON[asset.type]} {asset.name}</b>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.2rem' }}>{asset.type}</div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: c, marginTop: '0.25rem' }}>
                    Status: {asset.impactStatus.toUpperCase()}
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}

        {/* Sensor Nodes */}
        {sensors.map(s => (
          <CircleMarker
            key={s.id}
            center={[s.lat, s.lng]}
            radius={s.status === 'Tampered' ? 7 : 5}
            pathOptions={{
              color: 'white',
              weight: 1.5,
              fillColor: getSensorColor(s),
              fillOpacity: 1,
            }}
          >
            <Popup><SensorPopup s={s} /></Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
