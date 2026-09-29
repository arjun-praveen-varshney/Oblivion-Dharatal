import React from 'react';
import { useSimulationStore } from '../store/useSimulationStore';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { BrainCircuit, CheckCircle2, AlertOctagon, TrendingUp, Maximize, Clock } from 'lucide-react';
import { Badge } from './ui/Badge';

export function ProgressionIntelligence() {
  const { riskZones, currentScenarioState, satelliteObservation } = useSimulationStore();
  
  const activeZone = riskZones[0];
  const isWarningOrCritical = currentScenarioState === 'WARNING' || currentScenarioState === 'HIGH_RISK' || currentScenarioState === 'EARLY_WARNING';

  if (!activeZone && currentScenarioState === 'NORMAL') {
    return (
      <Card className="h-full bg-slate-50 border-dashed border-2">
        <CardContent className="h-full flex flex-col items-center justify-center text-center p-6 opacity-60">
          <BrainCircuit className="w-12 h-12 text-slate-400 mb-4" />
          <h3 className="font-bold text-lg text-slate-600 mb-2">AI-ASSISTED DEFORMATION ANALYSIS</h3>
          <p className="text-sm text-slate-500">Monitoring incoming data. No significant anomalies detected in current active zones.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full border-primary/20 shadow-md">
      <CardHeader className="py-4 pb-2 border-b border-border/50 bg-slate-50/50">
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm font-bold text-slate-700 flex items-center gap-2 uppercase tracking-wider">
            <BrainCircuit className="w-4 h-4 text-primary" />
            Progression Intelligence
          </CardTitle>
          {isWarningOrCritical && (
            <Badge variant="critical" className="animate-pulse">HIGH CONFIDENCE</Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-4 pt-4">
        {activeZone && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <IntelligenceItem 
                label="Magnitude" 
                value={`${activeZone.deformation.toFixed(1)} mm`}
                status={activeZone.severity}
                icon={<AlertOctagon className="w-4 h-4" />}
              />
              <IntelligenceItem 
                label="Velocity" 
                value={`+${activeZone.velocity.toFixed(2)} mm/day`}
                status={activeZone.velocity > 1.0 ? 'CRITICAL' : 'WARNING'}
                icon={<TrendingUp className="w-4 h-4" />}
              />
              <IntelligenceItem 
                label="Persistence" 
                value={`${activeZone.persistence} days`}
                status={activeZone.persistence > 14 ? 'CRITICAL' : 'WARNING'}
                icon={<Clock className="w-4 h-4" />}
              />
              <IntelligenceItem 
                label="Spatial Spread" 
                value={`${activeZone.affectedSensors.length} Nodes`}
                status={activeZone.affectedSensors.length > 2 ? 'CRITICAL' : 'WATCH'}
                icon={<Maximize className="w-4 h-4" />}
              />
            </div>

            {/* Fusion Section */}
            <div className="mt-4 p-3 bg-slate-100 rounded-lg border border-slate-200">
              <h4 className="text-xs font-bold text-slate-700 uppercase mb-2">Multi-Source Fusion Evidence</h4>
              <ul className="space-y-2 text-sm">
                {activeZone.reasons.map((reason, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                    <span className="font-medium text-slate-700">
                      {reason.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </li>
                ))}
              </ul>
              
              {satelliteObservation && activeZone.reasons.includes('SATELLITE_CONFIRMED') && (
                <div className="mt-3 pt-3 border-t border-slate-300 flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-600">Fusion Agreement:</span>
                  <Badge variant="default" className="bg-fuchsia-600 hover:bg-fuchsia-700">InSAR Confirmed</Badge>
                </div>
              )}
            </div>

            {/* Overall Assessment */}
            <div className={`p-3 rounded-lg border-l-4 ${isWarningOrCritical ? 'bg-red-50 border-red-500 text-red-900' : 'bg-amber-50 border-amber-500 text-amber-900'}`}>
              <h4 className="text-xs font-bold uppercase mb-1">Overall Assessment</h4>
              <p className="font-semibold">{currentScenarioState.replace(/_/g, ' ')}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function IntelligenceItem({ label, value, status, icon }: { label: string, value: string, status: string, icon: React.ReactNode }) {
  const getStatusColor = () => {
    switch(status) {
      case 'CRITICAL': return 'text-red-600';
      case 'WARNING': return 'text-orange-500';
      case 'WATCH': return 'text-amber-500';
      default: return 'text-emerald-500';
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-1.5 text-xs text-muted mb-1 font-semibold uppercase tracking-wider">
        {icon}
        <span>{label}</span>
      </div>
      <div className={`text-lg font-bold ${getStatusColor()}`}>
        {value}
      </div>
    </div>
  );
}
