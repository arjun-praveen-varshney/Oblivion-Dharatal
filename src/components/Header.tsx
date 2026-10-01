import { useStore } from '../store';
import { formatTime } from '../lib/utils';
import {
  Activity, Wifi, WifiOff, ShieldAlert, AlertTriangle,
  Radio, Clock, Database
} from 'lucide-react';

export function Header() {
  const { isOffline, isDemoMode, scenarioState, riskZones, systemHealth, activeScenario } = useStore();

  const topZone = riskZones[0];
  const alertLevel = topZone ? topZone.severity : 'STABLE';
  const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });

  const alertColors: Record<string, string> = {
    STABLE: 'var(--color-stable)',
    WATCH: 'var(--color-watch)',
    WARNING: 'var(--color-warning)',
    CRITICAL: 'var(--color-critical)',
  };

  return (
    <header style={{
      background: 'var(--color-sidebar-bg)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      height: '52px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 1.25rem',
      flexShrink: 0,
      zIndex: 50,
      position: 'relative',
    }}>
      {/* Left: Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Activity size={18} color="var(--color-primary-light)" />
          <span style={{ color: 'white', fontWeight: 700, fontSize: '0.95rem', letterSpacing: '-0.01em' }}>DHARATAL</span>
        </div>
        <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.1)' }} />
        <span style={{ color: 'var(--color-sidebar-muted)', fontSize: '0.72rem', fontWeight: 500 }}>
          Mine Subsidence Intelligence & Early Warning
        </span>
      </div>

      {/* Center: Zone info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '0.72rem' }}>
        <StatusItem icon={<Radio size={12} />} label="Zone" value="Jharia Coalfield — Demo" />
        <StatusItem icon={<Activity size={12} />} label="Status" value={scenarioState.replace(/_/g, ' ')} valueColor={alertColors[alertLevel] || 'white'} />
        <StatusItem icon={<Database size={12} />} label="Nodes" value={`${systemHealth.nodesOnline}/${systemHealth.totalNodes}`} />
        <StatusItem icon={<Clock size={12} />} label="Updated" value={now} />
      </div>

      {/* Right: Modes */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {isDemoMode && (
          <span className="badge badge-info" style={{ fontSize: '0.65rem' }}>
            SIMULATION MODE
          </span>
        )}
        <span className="badge" style={{
          color: alertColors[alertLevel],
          background: `${alertColors[alertLevel]}18`,
          borderColor: `${alertColors[alertLevel]}40`,
          fontSize: '0.65rem',
        }}>
          <span className={`status-dot dot-${alertLevel.toLowerCase()}`} />
          {alertLevel}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.7rem' }}>
          {isOffline
            ? <><WifiOff size={12} color="var(--color-critical)" /><span style={{ color: 'var(--color-critical)' }}>OFFLINE</span></>
            : <><Wifi size={12} color="var(--color-stable)" /><span style={{ color: 'var(--color-stable)' }}>CONNECTED</span></>
          }
        </div>
      </div>
    </header>
  );
}

function StatusItem({ icon, label, value, valueColor = 'rgba(255,255,255,0.9)' }: {
  icon: React.ReactNode; label: string; value: string; valueColor?: string;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
      <span style={{ color: 'var(--color-sidebar-muted)' }}>{icon}</span>
      <span style={{ color: 'var(--color-sidebar-muted)' }}>{label}:</span>
      <span style={{ color: valueColor, fontWeight: 600 }}>{value}</span>
    </div>
  );
}
