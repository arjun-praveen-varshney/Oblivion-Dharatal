import { useStore } from '../store';
import {
  LayoutDashboard, Map, RadioTower, TrendingUp,
  Satellite, Bell, Server, Cpu, Network, ChevronRight
} from 'lucide-react';
import type { NavigationPage } from '../types';

const NAV_ITEMS: { page: NavigationPage; icon: React.ReactNode; label: string }[] = [
  { page: 'overview',          icon: <LayoutDashboard size={15} />, label: 'Overview' },
  { page: 'risk-map',          icon: <Map size={15} />,            label: 'Risk Map' },
  { page: 'sensor-network',    icon: <RadioTower size={15} />,     label: 'Sensor Network' },
  { page: 'deformation-trends',icon: <TrendingUp size={15} />,     label: 'Deformation Trends' },
  { page: 'insar',             icon: <Satellite size={15} />,      label: 'InSAR' },
  { page: 'alerts',            icon: <Bell size={15} />,           label: 'Alerts' },
  { page: 'system-health',     icon: <Server size={15} />,         label: 'System Health' },
];

export function Sidebar() {
  const { currentPage, setPage, riskZones, alerts, systemHealth } = useStore();
  const criticalAlerts = alerts.filter(a => !a.acknowledged && a.severity === 'CRITICAL').length;
  const topZone = riskZones[0];

  return (
    <aside style={{
      width: '13rem',
      background: 'var(--color-sidebar-bg)',
      borderRight: '1px solid rgba(255,255,255,0.06)',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      height: '100%',
      overflow: 'hidden',
    }}>
      {/* Logo */}
      <div style={{ padding: '1rem 0.75rem 0.75rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ fontSize: '0.6rem', fontWeight: 700, color: 'var(--color-sidebar-muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
          DHARATAL v1.0
        </div>
        <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)', lineHeight: 1.5 }}>
          Mine Subsidence Intelligence<br />& Early Warning Network
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '0.5rem 0.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1px' }}>
        <div style={{ fontSize: '0.58rem', fontWeight: 700, color: 'var(--color-sidebar-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.5rem 0.5rem 0.25rem' }}>Navigation</div>
        {NAV_ITEMS.map(({ page, icon, label }) => {
          const isActive = currentPage === page;
          const showBadge = page === 'alerts' && criticalAlerts > 0;
          return (
            <button
              key={page}
              className={`nav-item${isActive ? ' active' : ''}`}
              onClick={() => setPage(page)}
            >
              <span style={{ opacity: isActive ? 1 : 0.7 }}>{icon}</span>
              <span style={{ flex: 1 }}>{label}</span>
              {showBadge && (
                <span style={{
                  background: 'var(--color-critical)',
                  color: 'white',
                  borderRadius: '9999px',
                  fontSize: '0.6rem',
                  fontWeight: 700,
                  padding: '0 0.35rem',
                  minWidth: '1.1rem',
                  textAlign: 'center',
                }}>
                  {criticalAlerts}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom status */}
      <div style={{ padding: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ fontSize: '0.6rem', color: 'var(--color-sidebar-muted)', marginBottom: '0.4rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Network</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
          <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)' }}>Sensors</span>
          <span style={{ fontSize: '0.65rem', color: 'white', fontWeight: 600 }}>{systemHealth.nodesOnline}/{systemHealth.totalNodes}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
          <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)' }}>LoRa Mesh</span>
          <span style={{ fontSize: '0.65rem', color: 'var(--color-stable)', fontWeight: 600 }}>{systemHealth.loraHealth}</span>
        </div>
        {topZone && (
          <div style={{ marginTop: '0.5rem', padding: '0.4rem 0.5rem', background: 'rgba(239,68,68,0.12)', borderRadius: '0.4rem', border: '1px solid rgba(239,68,68,0.25)' }}>
            <div style={{ fontSize: '0.6rem', color: 'var(--color-critical)', fontWeight: 700, letterSpacing: '0.06em' }}>ACTIVE RISK</div>
            <div style={{ fontSize: '0.65rem', color: 'white', marginTop: '0.1rem' }}>Zone {topZone.id} — {topZone.severity}</div>
          </div>
        )}
        <div style={{ marginTop: '0.5rem', fontSize: '0.55rem', color: 'rgba(255,255,255,0.2)', textAlign: 'center', lineHeight: 1.5 }}>
          SIMULATION MODE ONLY<br />Not for operational use
        </div>
      </div>
    </aside>
  );
}
