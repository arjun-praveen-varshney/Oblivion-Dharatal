// InSAR Page
import { useStore } from '../store';
import { RiskMap } from '../components/RiskMap';
import { Satellite } from 'lucide-react';

export function InSARPage() {
  const { insar, riskZones } = useStore();
  const activeObs = insar.find(o => o.active);
  const zone = riskZones[0];

  return (
    <div style={{ display: 'flex', gap: '0.75rem', height: '100%', padding: '0.875rem', overflow: 'hidden' }}>
      {/* Map with InSAR overlay */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <RiskMap />
      </div>

      {/* InSAR data panel */}
      <div style={{ width: '20rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', overflowY: 'auto' }}>
        <div className="card" style={{ padding: '0.875rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--color-border)' }}>
            <Satellite size={14} color="var(--color-insar)" />
            <div className="section-label">Satellite / InSAR</div>
            <span className="badge badge-system" style={{ marginLeft: 'auto' }}>SIMULATED</span>
          </div>

          {insar.map(obs => (
            <div key={obs.id} style={{
              padding: '0.75rem',
              borderRadius: '0.5rem',
              border: `1px solid ${obs.active ? 'var(--color-insar-border)' : 'var(--color-border)'}`,
              background: obs.active ? 'var(--color-insar-bg)' : 'var(--color-bg-muted)',
              marginBottom: '0.5rem',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <span style={{ fontWeight: 700, fontSize: '0.8rem' }}>{obs.satellite}</span>
                {obs.active
                  ? <span className="badge badge-insar">ACTIVE</span>
                  : <span className="badge badge-system">HISTORICAL</span>
                }
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.3rem 0.75rem', fontSize: '0.72rem' }}>
                {[
                  ['Acquisition', obs.acquisitionDate],
                  ['Zone', obs.zone],
                  ['Deformation', `${obs.minDeformation} to +${obs.maxDeformation} mm`],
                  ['Coverage', `${obs.coverage}%`],
                  ['Confidence', obs.confidence],
                ].map(([k, v]) => (
                  <div key={k}>
                    <div style={{ fontSize: '0.62rem', color: 'var(--color-text-muted)' }}>{k}</div>
                    <div style={{ fontWeight: 600, color: 'var(--color-text)' }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Fusion card */}
        {activeObs && zone && (
          <div className="card" style={{ padding: '0.875rem' }}>
            <div className="section-label" style={{ marginBottom: '0.625rem' }}>Ground + InSAR Fusion</div>
            <FusionRow label="Ground Sensor Evidence" status="HIGH" />
            <FusionRow label="InSAR Evidence" status="HIGH" />
            <FusionRow label="Mine Panel Context" status="MATCH" />
            <div style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 700, color: 'var(--color-text-secondary)', fontSize: '0.8rem' }}>Fusion Status</span>
              <span className="badge badge-stable" style={{ fontSize: '0.72rem', padding: '0.25rem 0.75rem' }}>HIGH CONFIDENCE</span>
            </div>
            <p style={{ marginTop: '0.5rem', fontSize: '0.7rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
              "Independent evidence supports persistent deformation."
            </p>
          </div>
        )}

        {/* Description */}
        <div className="card" style={{ padding: '0.875rem', background: 'rgba(217,70,239,0.04)', borderColor: 'var(--color-insar-border)' }}>
          <div className="section-label" style={{ color: 'var(--color-insar)', marginBottom: '0.4rem' }}>About InSAR Integration</div>
          <p style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
            DHARATAL integrates multi-temporal Sentinel-1 SAR data to provide independent satellite-derived deformation context. InSAR data is processed and imported on a 6–12 day repeat cycle. Fused with ground truth for HIGH CONFIDENCE zone assessment.
          </p>
          <div style={{ marginTop: '0.5rem', padding: '0.3rem 0.5rem', background: 'rgba(217,70,239,0.06)', borderRadius: '0.3rem', fontSize: '0.65rem', color: 'var(--color-insar)', fontWeight: 600 }}>
            Sentinel-1A / InSAR — Simulated Demonstration Layer
          </div>
        </div>
      </div>
    </div>
  );
}

function FusionRow({ label, status }: { label: string; status: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.3rem 0', borderBottom: '1px solid var(--color-border-muted)', fontSize: '0.75rem' }}>
      <span style={{ color: 'var(--color-text-secondary)' }}>{label}</span>
      <span style={{ fontWeight: 700, color: 'var(--color-stable)' }}>{status}</span>
    </div>
  );
}
