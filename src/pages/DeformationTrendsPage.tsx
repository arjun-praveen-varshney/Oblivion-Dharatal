// Deformation Trends Page — full charts + Kalman filter viz
import { DeformationTrend } from '../components/DeformationTrend';
import { useStore } from '../store';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export function DeformationTrendsPage() {
  const { kalmanData, riskZones } = useStore();
  const zone = riskZones[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', height: '100%', padding: '0.875rem', overflow: 'auto' }}>
      {/* Main trend chart */}
      <div style={{ flex: '0 0 300px' }}>
        <DeformationTrend />
      </div>

      {/* Kalman Filter visualization */}
      <div className="card" style={{ padding: '0.875rem', flex: '0 0 220px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.625rem' }}>
          <div>
            <div className="section-label">Edge Kalman Filtering</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: '0.15rem' }}>
              Raw sensor signal vs filtered deformation estimate — Simulated demonstration
            </div>
          </div>
          <span className="badge badge-stable" style={{ marginLeft: 'auto', flexShrink: 0 }}>ACTIVE</span>
        </div>
        <div style={{ height: 150 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={kalmanData} margin={{ top: 5, right: 8, left: -18, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
              <XAxis dataKey="t" hide />
              <YAxis tick={{ fontSize: 9, fill: 'var(--color-text-muted)' }} tickLine={false} axisLine={false} unit=" mm" />
              <Tooltip
                contentStyle={{ borderRadius: '0.5rem', border: '1px solid var(--color-border)', fontSize: '0.72rem' }}
                formatter={(v: number, name: string) => [`${v.toFixed(2)} mm`, name === 'raw' ? 'Raw Signal' : 'Filtered (Kalman)']}
              />
              <Legend wrapperStyle={{ fontSize: '0.7rem' }} />
              <Line type="monotone" dataKey="raw" stroke="#94a3b8" strokeWidth={1} dot={false} name="Raw Signal" strokeDasharray="3 2" />
              <Line type="monotone" dataKey="filtered" stroke="var(--color-primary)" strokeWidth={2.5} dot={false} name="Filtered (Kalman)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
          <div style={{ flex: 1, padding: '0.35rem 0.5rem', background: 'var(--color-bg-muted)', borderRadius: '0.35rem', fontSize: '0.68rem' }}>
            <span style={{ color: 'var(--color-text-muted)' }}>Noise reduction:</span> <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>~92%</span>
          </div>
          <div style={{ flex: 1, padding: '0.35rem 0.5rem', background: 'var(--color-bg-muted)', borderRadius: '0.35rem', fontSize: '0.68rem' }}>
            <span style={{ color: 'var(--color-text-muted)' }}>Process noise (Q):</span> <span style={{ fontWeight: 700 }}>0.001</span>
          </div>
          <div style={{ flex: 1, padding: '0.35rem 0.5rem', background: 'var(--color-bg-muted)', borderRadius: '0.35rem', fontSize: '0.68rem' }}>
            <span style={{ color: 'var(--color-text-muted)' }}>Measurement noise (R):</span> <span style={{ fontWeight: 700 }}>0.1</span>
          </div>
        </div>
      </div>

      {/* AI Prediction panel */}
      {zone && (
        <div className="card" style={{ padding: '0.875rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.625rem' }}>
            <div className="section-label">AI Subsidence Engine — LSTM Forecast</div>
            <span className="badge badge-system" style={{ marginLeft: 'auto' }}>SIMULATED MODEL OUTPUT</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
            <InfoBox label="Current Deformation" value={`${zone.deformation.toFixed(1)} mm`} />
            <InfoBox label="Projected (30d)" value={`${(zone.deformation * 1.3).toFixed(1)}–${(zone.deformation * 1.8).toFixed(1)} mm`} />
            <InfoBox label="Confidence" value="MODERATE" />
          </div>
          <p style={{ marginTop: '0.75rem', fontSize: '0.72rem', color: 'var(--color-text-muted)', background: 'var(--color-bg-muted)', padding: '0.5rem 0.75rem', borderRadius: '0.4rem', borderLeft: '3px solid var(--color-primary)' }}>
            The LSTM model indicates continued acceleration over the next 7–14 days if current patterns persist. Isolation Forest anomaly detection indicates persistent deviation from baseline (score: {(zone.sensorAgreement / 100).toFixed(2)}). This is a simulated model output for demonstration only.
          </p>
        </div>
      )}
    </div>
  );
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ padding: '0.5rem 0.75rem', background: 'var(--color-bg-muted)', borderRadius: '0.4rem', border: '1px solid var(--color-border)' }}>
      <div style={{ fontSize: '0.62rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.25rem' }}>{label}</div>
      <div style={{ fontWeight: 700, color: 'var(--color-text)', fontSize: '0.9rem' }}>{value}</div>
    </div>
  );
}
