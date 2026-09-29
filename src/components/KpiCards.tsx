import React from 'react';
import { useSimulationStore } from '../store/useSimulationStore';
import { Card, CardContent } from './ui/Card';
import { RadioTower, ArrowUpRight, TrendingUp, AlertTriangle, Building2 } from 'lucide-react';

export function KpiCards() {
  const { sensors, riskZones, infrastructure, systemHealth } = useSimulationStore();

  const activeNodes = sensors.filter(s => s.status !== 'Offline').length;
  const maxDeformation = riskZones.length > 0 ? Math.max(...riskZones.map(z => z.deformation)) : 0;
  const maxVelocity = riskZones.length > 0 ? Math.max(...riskZones.map(z => z.velocity)) : 0;
  
  const highRiskZones = riskZones.filter(z => z.severity === 'WARNING' || z.severity === 'CRITICAL').length;
  const assetsAtRisk = infrastructure.filter(a => a.impactStatus !== 'Safe').length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
      <KpiCard
        title="ACTIVE SENSOR NODES"
        value={`${activeNodes} / ${systemHealth.totalNodes}`}
        subvalue={activeNodes === systemHealth.totalNodes ? 'Healthy' : 'Degraded'}
        icon={<RadioTower className="w-5 h-5 text-status-stable" />}
      />
      <KpiCard
        title="MAX DEFORMATION"
        value={`${maxDeformation.toFixed(1)} mm`}
        subvalue="Latest 30 days"
        icon={<ArrowUpRight className="w-5 h-5 text-status-watch" />}
        highlight={maxDeformation > 10}
      />
      <KpiCard
        title="DEFORMATION VELOCITY"
        value={`+${maxVelocity.toFixed(1)} mm/day`}
        subvalue={maxVelocity > 0.5 ? 'Increasing' : 'Stable'}
        icon={<TrendingUp className="w-5 h-5 text-status-warning" />}
        highlight={maxVelocity > 1.0}
      />
      <KpiCard
        title="HIGH-RISK ZONES"
        value={highRiskZones.toString()}
        subvalue={highRiskZones > 0 ? 'Requires attention' : 'All clear'}
        icon={<AlertTriangle className="w-5 h-5 text-status-critical" />}
        highlight={highRiskZones > 0}
      />
      <KpiCard
        title="INFRASTRUCTURE AT RISK"
        value={assetsAtRisk.toString()}
        subvalue={assetsAtRisk > 0 ? 'Potentially affected assets' : 'No current risk'}
        icon={<Building2 className="w-5 h-5 text-status-satellite" />}
        highlight={assetsAtRisk > 0}
      />
    </div>
  );
}

function KpiCard({ title, value, subvalue, icon, highlight = false }: { title: string, value: string, subvalue: string, icon: React.ReactNode, highlight?: boolean }) {
  return (
    <Card className={`overflow-hidden transition-all duration-300 ${highlight ? 'border-primary/50 shadow-md ring-1 ring-primary/20' : ''}`}>
      <CardContent className="p-4 flex flex-col justify-between h-full">
        <div className="flex justify-between items-start mb-2">
          <p className="text-[10px] font-bold text-muted uppercase tracking-wider">{title}</p>
          {icon}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">{value}</h2>
          <p className="text-xs text-muted font-medium mt-1">{subvalue}</p>
        </div>
      </CardContent>
    </Card>
  );
}
