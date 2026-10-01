import { useState } from 'react';
import { useStore } from '../store';
import { statusBadgeClass } from '../lib/utils';
import { Radio, Activity, Battery, Wifi, Filter, ChevronRight } from 'lucide-react';
import type { SensorNode, NodeStatus } from '../types';

type FilterType = 'All' | NodeStatus;

export function SensorNetwork() {
  const { sensors, adaptiveSamplingActive } = useStore();
  const [filter, setFilter] = useState<FilterType>('All');
  const [selected, setSelected] = useState<SensorNode | null>(null);

  const filtered = filter === 'All' ? sensors : sensors.filter(s => s.status === filter);

  const counts: Record<string, number> = {
    All: sensors.length,
    Healthy: sensors.filter(s => s.status === 'Healthy').length,
    Watch: sensors.filter(s => s.status === 'Watch').length,
    Warning: sensors.filter(s => s.status === 'Warning').length,
    Offline: sensors.filter(s => s.status === 'Offline' || s.status === 'Tampered').length,
  };

  return (
    <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.65rem 0.875rem', borderBottom: '1px solid var(--color-border)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Radio size={13} color="var(--color-primary)" />
          <span className="section-label">Sensor Network</span>
          {adaptiveSamplingActive && (
            <span className="badge badge-warning" style={{ fontSize: '0.58rem' }}>ADAPTIVE MODE</span>
          )}
        </div>
        <div style={{ display: 'flex', gap: '0.2rem' }}>
          {(['All', 'Healthy', 'Watch', 'Warning', 'Offline'] as FilterType[]).map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '0.18rem 0.45rem',
              fontSize: '0.62rem',
              fontWeight: 600,
              border: '1px solid var(--color-border)',
              borderRadius: '0.3rem',
              cursor: 'pointer',
              background: filter === f ? 'var(--color-bg-muted)' : 'transparent',
              color: filter === f ? 'var(--color-text)' : 'var(--color-text-muted)',
            }}>
              {f} {f !== 'All' ? <span style={{ opacity: 0.7 }}>{counts[f]}</span> : ''}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Node</th>
              <th>Tilt</th>
              <th>Disp.</th>
              <th>Vibr.</th>
              <th>Battery</th>
              <th>Interval</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => {
              const isAdaptive = adaptiveSamplingActive && ['S-05','S-06','S-07','S-09','S-10'].includes(s.id);
              return (
                <tr
                  key={s.id}
                  onClick={() => setSelected(s === selected ? null : s)}
                  style={{
                    cursor: 'pointer',
                    background: selected?.id === s.id ? 'rgba(13,148,136,0.05)' : undefined,
                    borderLeft: selected?.id === s.id ? '2px solid var(--color-primary)' : '2px solid transparent',
                  }}
                >
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.8rem' }}>{s.id}</span>
                      {isAdaptive && <Activity size={10} color="var(--color-warning)" className="animate-pulse-slow" />}
                    </div>
                  </td>
                  <td style={{ color: s.tilt > 0.5 ? 'var(--color-warning)' : 'var(--color-text-secondary)' }}>{s.tilt.toFixed(2)}°</td>
                  <td style={{ color: s.displacement > 5 ? 'var(--color-warning)' : 'var(--color-text-secondary)' }}>{s.displacement.toFixed(1)} mm</td>
                  <td>
                    <span style={{ fontSize: '0.72rem', fontWeight: 500, color: s.vibration === 'Elevated' ? 'var(--color-warning)' : s.vibration === 'High' ? 'var(--color-critical)' : 'var(--color-text-muted)' }}>
                      {s.vibration}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.72rem' }}>
                      <Battery size={10} color={s.battery < 30 ? 'var(--color-critical)' : 'var(--color-text-muted)'} />
                      {s.battery.toFixed(0)}%
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.68rem', color: s.samplingInterval <= 15 ? 'var(--color-warning)' : 'var(--color-text-muted)' }}>
                      {s.samplingInterval}s
                    </span>
                  </td>
                  <td><span className={statusBadgeClass(s.status)}>{s.status}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Selected detail mini-panel */}
      {selected && (
        <div style={{ borderTop: '1px solid var(--color-border)', padding: '0.6rem 0.875rem', background: 'var(--color-bg-muted)', flexShrink: 0, fontSize: '0.72rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
            <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{selected.id} — Detail</span>
            <button onClick={() => setSelected(null)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>✕</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.3rem' }}>
            {[
              ['RSSI', `${selected.rssi.toFixed(0)} dBm`],
              ['SNR', `${selected.snr.toFixed(1)} dB`],
              ['Pkt', `${selected.packetDelivery.toFixed(0)}%`],
              ['Temp', `${selected.temperature.toFixed(1)}°C`],
            ].map(([k, v]) => (
              <div key={k} style={{ textAlign: 'center', padding: '0.3rem', background: 'white', borderRadius: '0.3rem', border: '1px solid var(--color-border)' }}>
                <div style={{ fontSize: '0.6rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{k}</div>
                <div style={{ fontWeight: 700, color: 'var(--color-text)' }}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '0.35rem', display: 'flex', gap: '0.35rem' }}>
            <span style={{ padding: '0.2rem 0.5rem', background: 'rgba(13,148,136,0.08)', color: 'var(--color-primary)', border: '1px solid rgba(13,148,136,0.2)', borderRadius: '0.3rem', fontSize: '0.65rem', fontWeight: 700 }}>✦ Kalman Filter: ON</span>
            <span style={{ padding: '0.2rem 0.5rem', background: 'rgba(13,148,136,0.08)', color: 'var(--color-primary)', border: '1px solid rgba(13,148,136,0.2)', borderRadius: '0.3rem', fontSize: '0.65rem', fontWeight: 700 }}>✦ Fusion: ACTIVE</span>
            <span style={{ padding: '0.2rem 0.5rem', background: 'rgba(13,148,136,0.08)', color: 'var(--color-primary)', border: '1px solid rgba(13,148,136,0.2)', borderRadius: '0.3rem', fontSize: '0.65rem', fontWeight: 700 }}>Zone: {selected.zone}</span>
          </div>
        </div>
      )}
    </div>
  );
}
