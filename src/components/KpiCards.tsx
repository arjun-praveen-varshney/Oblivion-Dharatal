import { useStore } from '../store';
import { RadioTower, ArrowUpRight, TrendingUp, AlertTriangle, Building2, ArrowUp, Minus } from 'lucide-react';

export function KpiCards() {
  const { sensors, riskZones, infrastructure, systemHealth, historicalDeformation } = useStore();

  const activeNodes = sensors.filter(s => s.status !== 'Offline' && s.status !== 'Tampered').length;
  const topZone = riskZones[0];
  const maxDef = topZone ? topZone.deformation : 0;
  const maxVel = topZone ? topZone.velocity : 0;
  const highRiskCount = riskZones.filter(z => z.severity === 'WARNING' || z.severity === 'CRITICAL').length;
  const assetsAtRisk = infrastructure.filter(a => a.impactStatus !== 'Safe').length;
  const defHistory = historicalDeformation;
  const trend = defHistory.length > 1
    ? defHistory[defHistory.length - 1].value - defHistory[defHistory.length - 2].value
    : 0;

  const cards = [
    {
      id: 'nodes',
      title: 'Active Sensor Nodes',
      value: `${activeNodes} / ${systemHealth.totalNodes}`,
      sub: `${Math.round((activeNodes / systemHealth.totalNodes) * 100)}% online`,
      icon: <RadioTower size={16} color="var(--color-stable)" />,
      color: 'var(--color-stable)',
      alert: activeNodes < systemHealth.totalNodes,
    },
    {
      id: 'deformation',
      title: 'Max Deformation',
      value: `${maxDef.toFixed(1)} mm`,
      sub: trend > 0 ? `↑ ${trend.toFixed(1)} mm since prev` : 'Latest 7 days',
      icon: <ArrowUpRight size={16} color="var(--color-watch)" />,
      color: maxDef > 10 ? 'var(--color-critical)' : maxDef > 5 ? 'var(--color-warning)' : 'var(--color-text)',
      alert: maxDef > 10,
    },
    {
      id: 'velocity',
      title: 'Deformation Velocity',
      value: maxVel > 0 ? `+${maxVel.toFixed(2)} mm/day` : '< 0.1 mm/day',
      sub: maxVel > 1 ? 'Increasing ↑' : 'Stable',
      icon: <TrendingUp size={16} color="var(--color-warning)" />,
      color: maxVel > 1.5 ? 'var(--color-critical)' : maxVel > 0.5 ? 'var(--color-warning)' : 'var(--color-text)',
      alert: maxVel > 1.0,
    },
    {
      id: 'zones',
      title: 'High-Risk Zones',
      value: highRiskCount.toString(),
      sub: highRiskCount > 0 ? 'Requires attention' : 'All stable',
      icon: <AlertTriangle size={16} color={highRiskCount > 0 ? 'var(--color-critical)' : 'var(--color-stable)'} />,
      color: highRiskCount > 0 ? 'var(--color-critical)' : 'var(--color-text)',
      alert: highRiskCount > 0,
    },
    {
      id: 'assets',
      title: 'Assets at Risk',
      value: assetsAtRisk.toString(),
      sub: assetsAtRisk > 0 ? 'Potentially affected' : 'No current impact',
      icon: <Building2 size={16} color={assetsAtRisk > 0 ? 'var(--color-insar)' : 'var(--color-text-muted)'} />,
      color: assetsAtRisk > 0 ? 'var(--color-insar)' : 'var(--color-text)',
      alert: assetsAtRisk > 0,
    },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.75rem', flexShrink: 0 }}>
      {cards.map(card => (
        <div key={card.id} className="card" style={{
          padding: '0.9rem 1rem',
          borderLeft: card.alert ? `3px solid ${card.color}` : '3px solid transparent',
          transition: 'box-shadow 0.2s ease',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
            <span className="section-label">{card.title}</span>
            {card.icon}
          </div>
          <div className="kpi-value" style={{ color: card.color, marginBottom: '0.2rem' }}>{card.value}</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>{card.sub}</div>
        </div>
      ))}
    </div>
  );
}
