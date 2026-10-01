import { useState } from 'react';
import { useStore } from '../store';
import { startSimulation, stopSimulation } from '../simulation/simulationEngine';
import { Play, Square, Settings2, RotateCcw, Info, Telescope } from 'lucide-react';
import type { SimulationScenario } from '../types';

const SCENARIOS: { key: SimulationScenario; label: string; desc: string }[] = [
  { key: 'NORMAL',               label: 'Normal Monitoring',      desc: 'Baseline stable operation' },
  { key: 'SENSOR_NOISE',         label: 'Sensor Noise',           desc: 'Kalman filtering demo' },
  { key: 'PERSISTENT_ANOMALY',   label: 'Persistent Anomaly',     desc: 'Sustained movement pattern' },
  { key: 'ACCELERATING',         label: 'Accelerating',           desc: 'Increasing velocity' },
  { key: 'INSAR_CONFIRMATION',   label: 'InSAR Confirmation',     desc: 'Satellite data integration' },
  { key: 'NODE_FAILURE',         label: 'Node Failure',           desc: 'Self-healing mesh demo' },
  { key: 'EARLY_WARNING',        label: 'Early Warning',          desc: 'Impact analysis + alert' },
  { key: 'FULL_SCENARIO',        label: '▶ Full Scenario',        desc: 'Complete 11-stage event (~60s)' },
];

export function SimulationControls() {
  const { activeScenario, setScenario, resetSimulation, toggleJudgeMode, isJudgeMode, toggleOffline, isOffline } = useStore();
  const [isRunning, setIsRunning] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  const handleRun = (key: SimulationScenario) => {
    resetSimulation();
    setScenario(key);
    startSimulation();
    setIsRunning(true);
  };

  const handleReset = () => {
    stopSimulation();
    resetSimulation();
    setIsRunning(false);
  };

  return (
    <div style={{
      position: 'fixed', bottom: '1rem', left: '1rem', zIndex: 5000,
      width: '13.5rem',
    }}>
      <div className="card" style={{ overflow: 'hidden', boxShadow: 'var(--shadow-overlay)', border: '1px solid rgba(13,148,136,0.25)' }}>
        {/* Header */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 0.75rem', background: 'var(--color-sidebar-bg)', border: 'none', cursor: 'pointer', color: 'white' }}
        >
          <Settings2 size={13} color="var(--color-primary-light)" />
          <span style={{ fontSize: '0.72rem', fontWeight: 700, flex: 1, textAlign: 'left', letterSpacing: '0.04em' }}>DEMO CONTROLS</span>
          {isRunning && <span style={{ fontSize: '0.6rem', fontWeight: 700, color: '#4ade80', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#4ade80', animation: 'pulse 1s infinite' }} />
            LIVE
          </span>}
        </button>

        {isOpen && (
          <div style={{ padding: '0.5rem' }}>
            {/* Info */}
            <div style={{ fontSize: '0.62rem', color: 'var(--color-text-muted)', background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)', borderRadius: '0.35rem', padding: '0.3rem 0.5rem', marginBottom: '0.5rem', lineHeight: 1.5 }}>
              Deterministic simulation. Each tick = 1 simulated day (1.8s real time).
            </div>

            {/* Scenario list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', marginBottom: '0.5rem' }}>
              {SCENARIOS.map(s => (
                <button key={s.key} onClick={() => handleRun(s.key)} style={{
                  display: 'flex', alignItems: 'center', gap: '0.4rem',
                  padding: '0.35rem 0.5rem',
                  border: `1px solid ${activeScenario === s.key && isRunning ? 'var(--color-primary)' : 'var(--color-border)'}`,
                  borderRadius: '0.35rem',
                  background: activeScenario === s.key && isRunning ? 'rgba(13,148,136,0.08)' : 'transparent',
                  cursor: 'pointer', textAlign: 'left', width: '100%',
                }}>
                  <Play size={9} color={activeScenario === s.key && isRunning ? 'var(--color-primary)' : 'var(--color-text-muted)'} />
                  <div>
                    <div style={{ fontSize: '0.7rem', fontWeight: 600, color: activeScenario === s.key && isRunning ? 'var(--color-primary)' : 'var(--color-text)', lineHeight: 1.2 }}>{s.label}</div>
                    <div style={{ fontSize: '0.58rem', color: 'var(--color-text-muted)' }}>{s.desc}</div>
                  </div>
                  {activeScenario === s.key && isRunning && (
                    <span style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: 'var(--color-primary)', animation: 'pulse 1.5s infinite' }} />
                  )}
                </button>
              ))}
            </div>

            {/* Mode toggles */}
            <div style={{ display: 'flex', gap: '0.3rem', marginBottom: '0.4rem' }}>
              <ToggleBtn label="Judge Mode" active={isJudgeMode} onClick={toggleJudgeMode} color="var(--color-primary)" />
              <ToggleBtn label="Offline" active={isOffline} onClick={toggleOffline} color="var(--color-warning)" />
            </div>

            {/* Reset */}
            {isRunning && (
              <button onClick={handleReset} style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                padding: '0.35rem', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '0.35rem',
                background: 'rgba(239,68,68,0.05)', color: 'var(--color-critical)', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 700,
              }}>
                <RotateCcw size={11} />RESET DEMO
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ToggleBtn({ label, active, onClick, color }: { label: string; active: boolean; onClick: () => void; color: string }) {
  return (
    <button onClick={onClick} style={{
      flex: 1, padding: '0.3rem 0.4rem', fontSize: '0.65rem', fontWeight: 700,
      border: `1px solid ${active ? color : 'var(--color-border)'}`,
      borderRadius: '0.35rem', cursor: 'pointer',
      background: active ? `${color}14` : 'transparent',
      color: active ? color : 'var(--color-text-muted)',
    }}>
      {active ? '● ' : '○ '}{label}
    </button>
  );
}
