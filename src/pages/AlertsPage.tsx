// Alerts Page — full alert center + notifications
import { useStore } from '../store';
import { AlertTimeline } from '../components/AlertTimeline';
import { formatTime } from '../lib/utils';
import { MessageSquare, Smartphone } from 'lucide-react';

export function AlertsPage() {
  const { notifications, alerts } = useStore();
  return (
    <div style={{ display: 'flex', gap: '0.75rem', height: '100%', padding: '0.875rem', overflow: 'hidden' }}>
      {/* Alert timeline — full height */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <AlertTimeline />
      </div>
      {/* Notification drawer */}
      <div style={{ width: '20rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div className="card" style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', padding: 0 }}>
          <div style={{ padding: '0.65rem 0.875rem', borderBottom: '1px solid var(--color-border)', flexShrink: 0 }}>
            <div className="section-label">Notifications Dispatched</div>
            <div style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', marginTop: '0.15rem' }}>SMS &amp; App alerts — Simulation only</div>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '0.5rem 0.75rem' }}>
            {notifications.length === 0 && (
              <div style={{ color: 'var(--color-text-muted)', fontSize: '0.78rem', padding: '1rem 0', textAlign: 'center' }}>
                No notifications dispatched yet
              </div>
            )}
            {notifications.map(n => (
              <div key={n.id} style={{ marginBottom: '0.75rem', padding: '0.6rem 0.75rem', borderRadius: '0.5rem', border: '1px solid var(--color-border)', background: 'var(--color-bg-muted)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                  {n.type === 'SMS' ? <MessageSquare size={13} color="var(--color-stable)" /> : <Smartphone size={13} color="#3b82f6" />}
                  <span style={{ fontWeight: 700, fontSize: '0.75rem', color: n.type === 'SMS' ? 'var(--color-stable)' : '#3b82f6' }}>{n.type}</span>
                  <span style={{ marginLeft: 'auto', fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>{formatTime(n.sentAt)}</span>
                </div>
                <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.2rem' }}>{n.recipient}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', lineHeight: 1.4 }}>{n.message}</div>
                {n.delivered && (
                  <div style={{ marginTop: '0.3rem', fontSize: '0.65rem', color: 'var(--color-stable)', fontWeight: 700 }}>✓ Delivered</div>
                )}
              </div>
            ))}
          </div>
        </div>
        {/* Alert stats */}
        <div className="card" style={{ padding: '0.75rem' }}>
          <div className="section-label" style={{ marginBottom: '0.5rem' }}>Alert Summary</div>
          {[
            { label: 'Total Alerts', value: alerts.length, color: 'var(--color-text)' },
            { label: 'Unacknowledged', value: alerts.filter(a => !a.acknowledged).length, color: 'var(--color-warning)' },
            { label: 'Critical', value: alerts.filter(a => a.severity === 'CRITICAL').length, color: 'var(--color-critical)' },
            { label: 'Warning', value: alerts.filter(a => a.severity === 'WARNING').length, color: 'var(--color-warning)' },
          ].map(s => (
            <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.3rem 0', borderBottom: '1px solid var(--color-border-muted)', fontSize: '0.78rem' }}>
              <span style={{ color: 'var(--color-text-secondary)' }}>{s.label}</span>
              <span style={{ fontWeight: 700, color: s.color }}>{s.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
