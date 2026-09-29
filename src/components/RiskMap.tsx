import React from 'react';
import { useSimulationStore } from '../store/useSimulationStore';
import { MapContainer, TileLayer, CircleMarker, Popup, Polygon, Circle, LayersControl, Tooltip as LeafletTooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Card } from './ui/Card';

export function RiskMap() {
  const { sensors, riskZones, minePanels, infrastructure } = useSimulationStore();
  
  // Center of the fictional Jharia map
  const position: [number, number] = [23.75, 86.42];

  return (
    <Card className="h-full w-full overflow-hidden relative shadow-md border-border/50">
      <div className="absolute top-4 left-4 z-[1000] bg-card/90 backdrop-blur text-cardForeground px-3 py-2 rounded-lg shadow-sm border border-border/50 font-semibold text-sm">
        Surface & Underground GIS
      </div>
      
      <MapContainer center={position} zoom={14} style={{ height: '100%', width: '100%' }} zoomControl={false}>
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="Terrain">
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            />
          </LayersControl.BaseLayer>
          
          <LayersControl.Overlay checked name="Mine Panels">
            {minePanels.map(panel => (
              <Polygon 
                key={panel.id} 
                positions={panel.coords as [number, number][]} 
                pathOptions={{ color: '#1e293b', weight: 2, fillOpacity: 0.1, dashArray: '5, 5' }}
              >
                <LeafletTooltip direction="center" permanent className="bg-transparent border-none shadow-none text-slate-800 font-bold opacity-50">
                  {panel.name}
                </LeafletTooltip>
              </Polygon>
            ))}
          </LayersControl.Overlay>
          
          <LayersControl.Overlay checked name="Risk Zones">
            {riskZones.map(zone => (
              <Circle
                key={zone.id}
                center={[zone.lat, zone.lng]}
                radius={zone.radius}
                pathOptions={{ 
                  color: zone.severity === 'CRITICAL' ? '#ef4444' : zone.severity === 'WARNING' ? '#f97316' : '#f59e0b',
                  fillColor: zone.severity === 'CRITICAL' ? '#ef4444' : zone.severity === 'WARNING' ? '#f97316' : '#f59e0b',
                  fillOpacity: 0.2,
                  weight: 2
                }}
              >
                <Popup className="rounded-xl">
                  <div className="p-1 min-w-[200px]">
                    <h3 className="font-bold text-lg border-b pb-1 mb-2">ZONE {zone.id}</h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between"><span className="text-slate-500">Risk:</span> <span className="font-bold text-red-600">{zone.severity}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Deformation:</span> <span>{zone.deformation.toFixed(1)} mm</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Velocity:</span> <span>+{zone.velocity.toFixed(2)} mm/day</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Trend:</span> <span>ACCELERATING</span></div>
                      <div className="mt-2 pt-2 border-t">
                        <p className="font-semibold text-xs text-slate-500 uppercase">Action</p>
                        <p className="text-red-600 font-bold text-xs">FIELD INSPECTION RECOMMENDED</p>
                      </div>
                    </div>
                  </div>
                </Popup>
              </Circle>
            ))}
          </LayersControl.Overlay>
          
          <LayersControl.Overlay checked name="Infrastructure">
            {infrastructure.map(asset => {
              const color = asset.impactStatus === 'Impacted' ? '#ef4444' : asset.impactStatus === 'Watch' ? '#f97316' : '#64748b';
              return (
                <CircleMarker
                  key={asset.id}
                  center={[asset.lat, asset.lng]}
                  radius={6}
                  pathOptions={{ color: '#fff', fillColor: color, fillOpacity: 0.8, weight: 1 }}
                >
                  <Popup>
                    <div className="font-semibold">{asset.name}</div>
                    <div className="text-xs text-slate-500">{asset.type}</div>
                    <div className="text-xs font-bold mt-1" style={{ color }}>Status: {asset.impactStatus.toUpperCase()}</div>
                  </Popup>
                </CircleMarker>
              );
            })}
          </LayersControl.Overlay>

          <LayersControl.Overlay checked name="Sensor Network">
            {sensors.map(sensor => {
              const color = sensor.status === 'Healthy' ? '#10b981' : sensor.status === 'Watch' ? '#f59e0b' : sensor.status === 'Warning' ? '#ef4444' : '#94a3b8';
              return (
                <CircleMarker 
                  key={sensor.id} 
                  center={[sensor.lat, sensor.lng]} 
                  radius={5}
                  pathOptions={{ color: '#fff', weight: 1.5, fillColor: color, fillOpacity: 1 }}
                >
                  <Popup>
                    <div className="p-1 min-w-[180px]">
                      <h3 className="font-bold text-md border-b pb-1 mb-2">NODE {sensor.id}</h3>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between"><span className="text-slate-500">Tilt:</span> <span>+{sensor.tilt.toFixed(2)}°</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">Displacement:</span> <span>+{sensor.displacement.toFixed(1)} mm</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">Vibration:</span> <span>{sensor.vibration}</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">Battery:</span> <span>{sensor.battery.toFixed(0)}%</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">Status:</span> <span className="font-bold" style={{ color }}>{sensor.status.toUpperCase()}</span></div>
                      </div>
                    </div>
                  </Popup>
                </CircleMarker>
              );
            })}
          </LayersControl.Overlay>
        </LayersControl>
        
        {/* Map Legend */}
        <div className="absolute bottom-4 right-4 z-[1000] bg-white/95 backdrop-blur p-3 rounded-lg shadow-md border border-slate-200 text-xs">
          <h4 className="font-bold mb-2 uppercase tracking-wide text-slate-700">Legend</h4>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#10b981] border border-white"></span> Sensor (Normal)</div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#ef4444] border border-white"></span> Sensor (Alert)</div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#64748b] border border-white"></span> Infrastructure</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#f97316]/30 border border-[#f97316]"></div> Risk Zone</div>
            <div className="flex items-center gap-2 col-span-2"><div className="w-4 h-2 border-t-2 border-dashed border-[#1e293b]"></div> Underground Panel</div>
          </div>
        </div>
      </MapContainer>
    </Card>
  );
}
