// Full-page Risk Map view
import { RiskMap } from '../components/RiskMap';
import { ProgressionIntelligence } from '../components/ProgressionIntelligence';
import { EarlyWarningCard } from '../components/EarlyWarningCard';
import { useStore } from '../store';
import { riskBadgeClass } from '../lib/utils';

export function RiskMapPage() {
  const { riskZones, infrastructure } = useStore();
  const topZone = riskZones[0];

  return (
    <div style={{ display: 'flex', gap: '0.75rem', height: '100%', padding: '0.875rem', overflow: 'hidden' }}>
      {/* Large map */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <RiskMap />
      </div>

      {/* Side panel */}
      <div style={{ width: '18rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', overflow: 'hidden' }}>
        <ProgressionIntelligence />

        {/* Infrastructure Impact */}
        <div className="card" style={{ padding: '0.75rem', flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div className="section-label" style={{ marginBottom: '0.5rem' }}>Infrastructure Impact</div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {infrastructure.map(a => (
              <div key={a.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.35rem 0', borderBottom: '1px solid var(--color-border-muted)', fontSize: '0.75rem' }}>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--color-text)' }}>{a.name}</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>{a.type}</div>
                </div>
                <span className={`badge badge-${a.impactStatus === 'Impacted' ? 'critical' : a.impactStatus === 'Watch' ? 'warning' : 'stable'}`}>{a.impactStatus}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <EarlyWarningCard />
    </div>
  );
}
