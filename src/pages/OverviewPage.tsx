// Overview Page — main judge-facing dashboard
import { KpiCards } from '../components/KpiCards';
import { RiskMap } from '../components/RiskMap';
import { DeformationTrend } from '../components/DeformationTrend';
import { SensorNetwork } from '../components/SensorNetwork';
import { ProgressionIntelligence } from '../components/ProgressionIntelligence';
import { AlertTimeline } from '../components/AlertTimeline';
import { EarlyWarningCard } from '../components/EarlyWarningCard';
import { useStore } from '../store';
import { Network, Satellite } from 'lucide-react';

export function OverviewPage() {
  const { isJudgeMode, scenarioState, systemHealth, riskZones, adaptiveSamplingActive } = useStore();
  const topZone = riskZones[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '0.75rem', overflow: 'hidden', padding: '0.875rem' }}>
      {/* KPIs */}
      <KpiCards />

      {/* Status ribbon */}
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexShrink: 0 }}>
        <StatusChip icon={<Network size={11} />} label={`LoRa Mesh: ${systemHealth.loraHealth}`} ok={systemHealth.loraHealth === 'Healthy'} />
        <StatusChip icon={<Satellite size={11} />} label="InSAR: Sentinel-1" ok />
        {adaptiveSamplingActive && <StatusChip label="Adaptive Sampling: ACTIVE (15s)" ok={false} warn />}
        {topZone && <StatusChip label={`Zone ${topZone.id}: ${topZone.severity} — ${topZone.deformation.toFixed(1)} mm`} ok={false} critical />}
        <span style={{ marginLeft: 'auto', fontSize: '0.65rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
          All data is simulated for SIH 2026 prototype demonstration
        </span>
      </div>

      {/* Main row: Map + Trend */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isJudgeMode ? '3fr 1.5fr' : '55% 1fr',
        gap: '0.75rem',
        flex: '0 0 400px',
        minHeight: 0,
      }}>
        <RiskMap />
        <DeformationTrend />
      </div>

      {/* Bottom row: Sensor | Progression | Alerts */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isJudgeMode ? '1.2fr 1.4fr 1fr' : '1.2fr 1.4fr 1fr',
        gap: '0.75rem',
        flex: '1 1 0',
        minHeight: 0,
      }}>
        <SensorNetwork />
        <ProgressionIntelligence />
        <AlertTimeline />
      </div>

      {/* Early warning overlay */}
      <EarlyWarningCard />
    </div>
  );
}

function StatusChip({ icon, label, ok, warn = false, critical = false }: { icon?: React.ReactNode; label: string; ok: boolean; warn?: boolean; critical?: boolean }) {
  const color = critical ? 'var(--color-critical)' : warn ? 'var(--color-warning)' : ok ? 'var(--color-stable)' : 'var(--color-text-muted)';
  const bg = critical ? 'rgba(239,68,68,0.06)' : warn ? 'rgba(249,115,22,0.06)' : ok ? 'rgba(16,185,129,0.06)' : 'transparent';
  const border = critical ? 'rgba(239,68,68,0.25)' : warn ? 'rgba(249,115,22,0.25)' : ok ? 'rgba(16,185,129,0.25)' : 'var(--color-border)';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.68rem', fontWeight: 600, color, background: bg, border: `1px solid ${border}`, borderRadius: '0.4rem', padding: '0.22rem 0.6rem', flexShrink: 0 }}>
      {icon}{label}
    </div>
  );
}
