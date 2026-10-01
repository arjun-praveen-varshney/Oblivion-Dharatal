// Sensor Network full page
import { SensorNetwork } from '../components/SensorNetwork';
import { useStore } from '../store';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';

export function SensorNetworkPage() {
  const { sensors, networkLinks } = useStore();

  // LoRa mesh diagram
  const meshNodes = ['S-05','S-06','S-07','S-08','S-09','S-10','GATEWAY'];

  return (
    <div style={{ display: 'flex', gap: '0.75rem', height: '100%', padding: '0.875rem', overflow: 'hidden' }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <SensorNetwork />
      </div>
      {/* LoRa mesh viz + stats */}
      <div style={{ width: '22rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', overflowY: 'auto' }}>
        {/* Self-Healing LoRa Mesh */}
        <div className="card" style={{ padding: '0.875rem' }}>
          <div className="section-label" style={{ marginBottom: '0.625rem' }}>Self-Healing LoRa Mesh</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', alignItems: 'center', padding: '0.5rem' }}>
            {meshNodes.map((id, i) => {
              const link = networkLinks.find(l => l.to === id || l.from === id);
              const isGateway = id === 'GATEWAY';
              const sensor = sensors.find(s => s.id === id);
              const isOffline = sensor?.status === 'Offline' || sensor?.status === 'Tampered';
              const color = isGateway ? 'var(--color-primary)' : isOffline ? 'var(--color-critical)' : 'var(--color-stable)';
              const linkColor = link?.health === 'Good' ? 'var(--color-stable)' : link?.health === 'Degraded' ? 'var(--color-warning)' : 'var(--color-critical)';

              return (
                <div key={id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
                  <div style={{
                    width: isGateway ? 60 : 44, height: isGateway ? 60 : 44,
                    borderRadius: '50%', border: `2px solid ${color}`,
                    background: `${color}12`,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span style={{ fontSize: '0.6rem', fontWeight: 700, color }}>{isGateway ? 'GW' : id}</span>
                    {!isGateway && <span style={{ fontSize: '0.5rem', color: 'var(--color-text-muted)' }}>
                      {isOffline ? 'OFFLINE' : sensor?.rssi.toFixed(0) + ' dBm'}
                    </span>}
                  </div>
                  {i < meshNodes.length - 1 && (
                    <div style={{
                      width: 2, height: 24,
                      background: `linear-gradient(to bottom, ${color}, ${linkColor})`,
                      position: 'relative',
                    }}>
                      <div style={{ position: 'absolute', right: 4, top: '50%', transform: 'translateY(-50%)', fontSize: '0.5rem', color: linkColor, fontWeight: 700, whiteSpace: 'nowrap' }}>
                        {link?.health || ''}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: '0.5rem', padding: '0.3rem 0.5rem', background: 'rgba(13,148,136,0.06)', borderRadius: '0.35rem', fontSize: '0.68rem', color: 'var(--color-primary)', fontWeight: 600, textAlign: 'center' }}>
            Auto-rerouting active when node fails
          </div>
        </div>

        {/* Edge processing */}
        <div className="card" style={{ padding: '0.875rem' }}>
          <div className="section-label" style={{ marginBottom: '0.5rem' }}>Edge Processing — S-07</div>
          {[
            ['Raw reading', '8.1 mm'],
            ['Kalman filtered', '7.4 mm'],
            ['Fusion valid', 'YES'],
          ].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.3rem 0', borderBottom: '1px solid var(--color-border-muted)', fontSize: '0.75rem' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>{k}</span>
              <span style={{ fontWeight: 700 }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
