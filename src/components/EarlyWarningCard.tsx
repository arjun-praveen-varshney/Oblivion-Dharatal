import { useStore } from '../store';
import { ShieldAlert, Navigation, Eye, CheckCheck, Building2, Satellite } from 'lucide-react';

export function EarlyWarningCard() {
  const { scenarioState, riskZones, infrastructure, insar, notifications } = useStore();
  const zone = riskZones[0];
  const isActive = scenarioState === 'EARLY_WARNING' || scenarioState === 'RECOVERY';
  if (!isActive || !zone) return null;

  const impactedAssets = infrastructure.filter(a => a.impactStatus !== 'Safe');
  const activeInSAR = insar.find(o => o.active);

  const settlements = impactedAssets.filter(a => a.type === 'Settlement').length;
  const roads = impactedAssets.filter(a => a.type === 'Road').length;
  const utilities = impactedAssets.filter(a => a.type === 'Utility').length;

  return (
    <div className="animate-slide-down" style={{
      position: 'fixed', top: '60px', left: '50%', transform: 'translateX(-50%)',
      zIndex: 9000, width: '680px', maxWidth: '95vw',
      background: 'white', borderRadius: '0.875rem',
      border: '2px solid var(--color-critical)',
      boxShadow: '0 24px 48px -8px rgba(239,68,68,0.3)',
      overflow: 'hidden',
    }}>
      {/* Critical header */}
      <div style={{ background: 'var(--color-critical)', padding: '0.75rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '50%', padding: '0.4rem', animation: 'pulse 1s ease-in-out infinite' }}>
          <ShieldAlert size={20} color="white" />
        </div>
        <div>
          <div style={{ color: 'white', fontWeight: 900, fontSize: '1rem', letterSpacing: '0.05em' }}>🚨 EARLY WARNING ISSUED</div>
          <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.72rem', fontWeight: 600 }}>Zone {zone.id} — High Subsidence Risk — Simulated Alert</div>
        </div>
        <span style={{ marginLeft: 'auto', background: 'rgba(255,255,255,0.15)', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.65rem', color: 'white', fontWeight: 700 }}>
          {zone.severity}
        </span>
      </div>

      <div style={{ padding: '1rem 1.25rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          {/* Left */}
          <div>
            <div style={{ marginBottom: '0.75rem' }}>
              <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.25rem' }}>Primary Evidence</div>
              <div style={{ fontWeight: 700, color: 'var(--color-critical)' }}>Accelerating Deformation</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>+{zone.velocity.toFixed(1)} mm/day &nbsp;|&nbsp; {zone.persistence} days persistent</div>
            </div>

            <div style={{ marginBottom: '0.75rem' }}>
              <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.25rem' }}>Supporting Evidence</div>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                <span className="badge badge-stable">Ground Sensors ✓</span>
                {activeInSAR && <span className="badge badge-insar">InSAR ✓</span>}
                <span className="badge badge-stable">Historical ✓</span>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.25rem' }}>AI Assessment</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', background: 'var(--color-bg-muted)', padding: '0.4rem 0.6rem', borderRadius: '0.4rem' }}>
                LSTM model indicates sustained acceleration. Isolation Forest anomaly confidence: HIGH.
              </div>
            </div>
          </div>

          {/* Right: Impact */}
          <div>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.35rem' }}>Potential Impact Zone</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', marginBottom: '0.75rem' }}>
              {settlements > 0 && <ImpactRow icon="🏠" label="Settlements" count={settlements} />}
              {roads > 0 && <ImpactRow icon="🛣️" label="Roads" count={roads} />}
              {utilities > 0 && <ImpactRow icon="⚡" label="Utilities" count={utilities} />}
            </div>

            {/* Notifications */}
            {notifications.length > 0 && (
              <div style={{ marginBottom: '0.75rem' }}>
                <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.3rem' }}>Notifications Dispatched</div>
                {notifications.map(n => (
                  <div key={n.id} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.7rem', padding: '0.25rem 0', color: 'var(--color-text-secondary)' }}>
                    <span style={{ fontWeight: 700, background: n.type === 'SMS' ? 'rgba(16,185,129,0.1)' : 'rgba(59,130,246,0.1)', color: n.type === 'SMS' ? 'var(--color-stable)' : '#3b82f6', borderRadius: '0.25rem', padding: '0.1rem 0.3rem', fontSize: '0.6rem' }}>{n.type}</span>
                    <span>{n.recipient}</span>
                    <span style={{ marginLeft: 'auto', color: 'var(--color-stable)' }}>✓ Sent</span>
                  </div>
                ))}
              </div>
            )}

            {/* CTA */}
            <div style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '0.5rem', padding: '0.5rem 0.75rem' }}>
              <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--color-critical)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Recommended Action</div>
              <div style={{ fontWeight: 800, color: 'var(--color-critical)', fontSize: '0.9rem' }}>FIELD INSPECTION</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', marginTop: '0.1rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Navigation size={10} />Dispatch team to {zone.lat.toFixed(4)}, {zone.lng.toFixed(4)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ImpactRow({ icon, label, count }: { icon: string; label: string; count: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', padding: '0.3rem 0.5rem', background: 'rgba(239,68,68,0.04)', borderRadius: '0.3rem', border: '1px solid rgba(239,68,68,0.15)' }}>
      <span style={{ fontSize: '0.9rem' }}>{icon}</span>
      <span style={{ color: 'var(--color-text-secondary)' }}>{label}</span>
      <span style={{ marginLeft: 'auto', fontWeight: 700, color: 'var(--color-critical)' }}>{count}</span>
    </div>
  );
}
