import React from 'react';
import { useSimulationStore } from '../store/useSimulationStore';
import { AlertOctagon, ShieldAlert, Navigation } from 'lucide-react';

export function EarlyWarningCard() {
  const { currentScenarioState, riskZones } = useSimulationStore();
  const activeZone = riskZones[0];

  if (currentScenarioState !== 'EARLY_WARNING' || !activeZone) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[3000] w-[600px] max-w-[90vw] animate-in fade-in slide-in-from-top-10 duration-500">
      <div className="bg-white border-2 border-red-500 rounded-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-red-600 text-white p-4 flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-full animate-pulse">
            <ShieldAlert className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-widest uppercase">🚨 EARLY WARNING</h2>
            <p className="font-semibold text-red-100 uppercase tracking-wider text-sm">Zone {activeZone.id} — High-Risk Subsidence</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 grid grid-cols-2 gap-6 bg-red-50/50">
          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-bold text-red-800 uppercase tracking-wider mb-1">Risk Level</h3>
              <div className="text-xl font-black text-red-600 uppercase">{activeZone.severity}</div>
            </div>
            <div>
              <h3 className="text-xs font-bold text-red-800 uppercase tracking-wider mb-1">Cause</h3>
              <div className="font-bold text-slate-800">Accelerating deformation</div>
              <div className="text-sm text-slate-600">Velocity: +{activeZone.velocity.toFixed(1)} mm/day</div>
            </div>
            <div>
              <h3 className="text-xs font-bold text-red-800 uppercase tracking-wider mb-1">Evidence Foundation</h3>
              <div className="text-sm font-bold text-slate-700 flex flex-col gap-1">
                <span>✓ Ground Sensor Network</span>
                <span>✓ Sentinel-1 InSAR Trend</span>
                <span>✓ Historical Correlation</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="bg-white p-3 rounded-lg border border-red-200 shadow-sm">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Potential Impact</h3>
              <ul className="text-sm font-bold text-slate-800 space-y-1">
                {activeZone.affectedAssets.map(assetId => {
                  if(assetId === 'INF-1') return <li key={assetId}>🏠 Settlement A</li>;
                  if(assetId === 'INF-4') return <li key={assetId}>🛣️ Main Haul Road</li>;
                  if(assetId === 'INF-7') return <li key={assetId}>⚡ Power Line Corridor</li>;
                  return null;
                })}
              </ul>
            </div>
            <div className="bg-red-600 p-3 rounded-lg text-white shadow-inner">
              <h3 className="text-xs font-bold text-red-200 uppercase tracking-wider mb-1">Recommended Action</h3>
              <div className="font-black text-lg">FIELD INSPECTION</div>
              <div className="text-xs font-medium text-red-100 mt-1 flex items-center gap-1">
                <Navigation className="w-3 h-3" />
                Dispatch team to coordinates {activeZone.lat}, {activeZone.lng}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
