import React, { useState } from 'react';
import { useSimulationStore } from '../store/useSimulationStore';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { RadioTower, Wifi, Battery, Activity } from 'lucide-react';

export function SensorNetwork() {
  const { sensors, adaptiveSamplingActive, adaptiveNodeId } = useSimulationStore();
  const [filter, setFilter] = useState<'All' | 'Healthy' | 'Watch' | 'Warning' | 'Offline'>('All');

  const filteredSensors = filter === 'All' ? sensors : sensors.filter(s => s.status === filter);

  return (
    <Card className="h-full flex flex-col overflow-hidden">
      <CardHeader className="py-4 pb-2 border-b border-border/50">
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm font-bold text-slate-700 flex items-center gap-2 uppercase tracking-wider">
            <RadioTower className="w-4 h-4" />
            Sensor Network
          </CardTitle>
          <div className="flex gap-1 text-xs">
            {['All', 'Healthy', 'Watch', 'Warning', 'Offline'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={`px-2 py-1 rounded-md transition-colors ${filter === f ? 'bg-slate-200 font-bold text-slate-800' : 'text-slate-500 hover:bg-slate-100'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-auto p-0">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted uppercase bg-slate-50 sticky top-0 z-10">
            <tr>
              <th className="px-4 py-3 font-semibold">Node</th>
              <th className="px-4 py-3 font-semibold">Tilt</th>
              <th className="px-4 py-3 font-semibold">Disp.</th>
              <th className="px-4 py-3 font-semibold">Battery</th>
              <th className="px-4 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredSensors.map(sensor => {
              const isAdaptive = adaptiveSamplingActive && adaptiveNodeId === sensor.id;
              
              return (
                <tr key={sensor.id} className={`border-b border-border/30 hover:bg-slate-50/50 transition-colors ${isAdaptive ? 'bg-amber-50/50' : ''}`}>
                  <td className="px-4 py-2 font-medium flex items-center gap-2">
                    <span className="text-slate-700">{sensor.id}</span>
                    {isAdaptive && <Activity className="w-3 h-3 text-amber-500 animate-pulse" />}
                  </td>
                  <td className="px-4 py-2 text-slate-600">
                    {sensor.tilt > 0 ? '+' : ''}{sensor.tilt.toFixed(2)}°
                  </td>
                  <td className="px-4 py-2 text-slate-600">
                    {sensor.displacement > 0 ? '+' : ''}{sensor.displacement.toFixed(1)} mm
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-1 text-slate-600">
                      <Battery className="w-3 h-3" />
                      {sensor.battery.toFixed(0)}%
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      sensor.status === 'Healthy' ? 'bg-emerald-100 text-emerald-700' :
                      sensor.status === 'Watch' ? 'bg-amber-100 text-amber-700' :
                      sensor.status === 'Warning' ? 'bg-red-100 text-red-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {sensor.status}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
