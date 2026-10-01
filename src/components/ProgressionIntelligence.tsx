import { useStore } from '../store';
import { BrainCircuit, CheckCircle2, AlertOctagon, TrendingUp, Clock, Maximize2, Satellite } from 'lucide-react';
import { riskBadgeClass } from '../lib/utils';

const PROGRESSION_STEPS = ['STABLE', 'EMERGING', 'PERSISTENT', 'ACCELERATING', 'WARNING'] as const;

export function ProgressionIntelligence() {
  const { riskZones, scenarioState, insar } = useStore();
  const zone = riskZones[0];
  const activeInSAR = insar.find(o => o.active);

  const progressIdx = (
    scenarioState === 'NORMAL' || scenarioState === 'SENSOR_NOISE' ? 0 :
    scenarioState === 'ANOMALY_DETECTED' ? 1 :
    scenarioState === 'PERSISTENT_ANOMALY' ? 2 :
    scenarioState === 'ACCELERATING' ? 3 : 4
  );

  if (!zone) {
    return (
      <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', opacity: 0.5 }}>
        <BrainCircuit size={28} color="var(--color-text-muted)" />
        <div style={{ fontWeight: 700, color: 'var(--color-text-muted)', marginTop: '0.75rem', fontSize: '0.8rem', textAlign: 'center' }}>
          AI-Assisted Analysis
        </div>
        <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: '0.3rem', textAlign: 'center' }}>
          Monitoring nominal. No anomaly detected.
        </div>
      </div>
    );
  }

  return (
    <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 0.875rem', borderBottom: '1px solid var(--color-border)', flexShrink: 0 }}>
        <BrainCircuit size={13} color="var(--color-primary)" />
        <span className="section-label">Progression Intelligence</span>
        <span style={{ marginLeft: 'auto', fontSize: '0.65rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>SIMULATED MODEL OUTPUT</span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0.75rem' }}>
        {/* Zone ID & Risk */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text)' }}>Zone {zone.id}</div>
            <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>Active subsidence risk area</div>
          </div>
          <span className={riskBadgeClass(zone.severity)}>{zone.severity}</span>
        </div>

        {/* Progression steps */}
        <div style={{ display: 'flex', gap: '0.15rem', marginBottom: '0.875rem', alignItems: 'center' }}>
          {PROGRESSION_STEPS.map((step, i) => (
            <div key={step} style={{ display: 'flex', alignItems: 'center', flex: i < 4 ? undefined : 1 }}>
              <div style={{
                padding: '0.25rem 0.5rem',
                borderRadius: '0.3rem',
                fontSize: '0.6rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                background: i <= progressIdx ? 'var(--color-critical)' : 'var(--color-bg-muted)',
                color: i <= progressIdx ? 'white' : 'var(--color-text-muted)',
                border: `1px solid ${i <= progressIdx ? 'var(--color-critical)' : 'var(--color-border)'}`,
                transition: 'all 0.4s ease',
                whiteSpace: 'nowrap',
              }}>
                {step}
              </div>
              {i < 4 && <div style={{ width: '0.4rem', height: 1.5, background: i < progressIdx ? 'var(--color-critical)' : 'var(--color-border)' }} />}
            </div>
          ))}
        </div>

        {/* Metrics grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.75rem' }}>
          {[
            { label: 'Magnitude', value: `${zone.deformation.toFixed(1)} mm`, icon: <AlertOctagon size={11} />, highlight: zone.deformation > 10 },
            { label: 'Velocity', value: `+${zone.velocity.toFixed(2)} mm/day`, icon: <TrendingUp size={11} />, highlight: zone.velocity > 1 },
            { label: 'Persistence', value: `${zone.persistence} days`, icon: <Clock size={11} />, highlight: zone.persistence > 14 },
            { label: 'Spatial Spread', value: zone.spatialSpread, icon: <Maximize2 size={11} />, highlight: zone.spatialSpread !== 'Stable' },
          ].map(({ label, value, icon, highlight }) => (
            <div key={label} style={{
              padding: '0.4rem 0.6rem',
              borderRadius: '0.4rem',
              background: highlight ? 'rgba(249,115,22,0.06)' : 'var(--color-bg-muted)',
              border: `1px solid ${highlight ? 'rgba(249,115,22,0.2)' : 'var(--color-border)'}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--color-text-muted)', marginBottom: '0.2rem', fontSize: '0.65rem' }}>
                {icon}{label}
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.85rem', color: highlight ? 'var(--color-warning)' : 'var(--color-text)' }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Evidence */}
        <div style={{ background: 'var(--color-bg-muted)', borderRadius: '0.4rem', padding: '0.5rem 0.6rem', marginBottom: '0.5rem', border: '1px solid var(--color-border)' }}>
          <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.3rem' }}>Evidence Basis</div>
          {zone.reasons.map(r => (
            <div key={r} className="evidence-item" style={{ marginBottom: '0.2rem' }}>
              <CheckCircle2 size={11} color="var(--color-stable)" style={{ flexShrink: 0, marginTop: 1 }} />
              <span>{r}</span>
            </div>
          ))}
        </div>

        {/* Fusion agreement */}
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          <FusionMeter label="Sensor Agmt." value={zone.sensorAgreement} max={100} unit="%" />
          {activeInSAR && <FusionMeter label="InSAR Agmt." value={zone.insarAgreement} max={100} unit="%" color="var(--color-insar)" />}
        </div>

        {zone.confidence === 'HIGH' && (
          <div style={{ marginTop: '0.5rem', padding: '0.4rem 0.6rem', background: 'rgba(13,148,136,0.06)', borderRadius: '0.4rem', border: '1px solid rgba(13,148,136,0.2)', fontSize: '0.72rem', color: 'var(--color-primary)', fontWeight: 600 }}>
            ✦ Independent evidence supports deformation pattern.
          </div>
        )}
      </div>
    </div>
  );
}

function FusionMeter({ label, value, max, unit, color = 'var(--color-primary)' }: { label: string; value: number; max: number; unit: string; color?: string }) {
  return (
    <div style={{ flex: 1, padding: '0.4rem 0.5rem', background: 'var(--color-surface)', borderRadius: '0.4rem', border: '1px solid var(--color-border)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
        <span style={{ fontSize: '0.62rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>{label}</span>
        <span style={{ fontSize: '0.72rem', fontWeight: 700, color }}>{value}{unit}</span>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${(value / max) * 100}%`, background: color }} />
      </div>
    </div>
  );
}
