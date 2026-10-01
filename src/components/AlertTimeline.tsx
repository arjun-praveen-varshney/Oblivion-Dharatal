import { useStore } from '../store';
import { formatTime } from '../lib/utils';
import { BellRing, ShieldAlert, AlertCircle, Info, Satellite, Network, Radio } from 'lucide-react';
import type { Alert } from '../types';

function AlertIcon({ a }: { a: Alert }) {
  if (a.category === 'insar') return <Satellite size={12} />;
  if (a.category === 'network') return <Network size={12} />;
  if (a.category === 'sensor') return <Radio size={12} />;
  if (a.severity === 'CRITICAL') return <ShieldAlert size={12} />;
  if (a.severity === 'WARNING' || a.severity === 'WATCH') return <AlertCircle size={12} />;
  return <Info size={12} />;
}

const SEV_COLORS: Record<string, string> = {
  CRITICAL: '#ef4444',
  WARNING: '#f97316',
  WATCH: '#f59e0b',
  INFO: '#3b82f6',
  SYSTEM: '#94a3b8',
};

export function AlertTimeline() {
  const { alerts, acknowledgeAlert } = useStore();

  return (
    <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.65rem 0.875rem', borderBottom: '1px solid var(--color-border)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <BellRing size={13} color="var(--color-warning)" />
          <span className="section-label">Alert Timeline</span>
        </div>
        <span style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>
          {alerts.filter(a => !a.acknowledged).length} unread
        </span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {alerts.length === 0 && (
          <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.78rem' }}>
            No alerts — system nominal
          </div>
        )}
        {alerts.map(a => {
          const color = SEV_COLORS[a.severity] || '#94a3b8';
          return (
            <div
              key={a.id}
              onClick={() => acknowledgeAlert(a.id)}
              style={{
                display: 'flex',
                gap: '0.6rem',
                padding: '0.55rem 0.875rem',
                borderBottom: '1px solid var(--color-border-muted)',
                borderLeft: a.acknowledged ? 'none' : `3px solid ${color}`,
                background: a.acknowledged ? 'transparent' : `${color}06`,
                cursor: 'pointer',
                transition: 'background 0.2s',
                alignItems: 'flex-start',
              }}
            >
              <div style={{
                width: 22, height: 22, borderRadius: '50%',
                background: `${color}18`, border: `1.5px solid ${color}40`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color, flexShrink: 0, marginTop: 1,
              }}>
                <AlertIcon a={a} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.1rem' }}>
                  <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--color-text-muted)', fontVariantNumeric: 'tabular-nums' }}>
                    {formatTime(a.timestamp)}
                  </span>
                  {a.zoneId && (
                    <span style={{ fontSize: '0.58rem', fontWeight: 700, color: 'var(--color-text-muted)', background: 'var(--color-bg-muted)', padding: '0.1rem 0.3rem', borderRadius: '0.25rem', border: '1px solid var(--color-border)' }}>
                      {a.zoneId}
                    </span>
                  )}
                </div>
                <p style={{ fontSize: '0.72rem', color: a.acknowledged ? 'var(--color-text-muted)' : 'var(--color-text-secondary)', lineHeight: 1.4 }}>
                  {a.message}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
