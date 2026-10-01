// System Health Page
import { useStore } from '../store';
import { RadioTower, Wifi, Server, Database, Cpu, Battery, Cloud, Satellite, HardDrive } from 'lucide-react';

export function SystemHealthPage() {
  const { systemHealth, gateway, networkLinks } = useStore();

  const items = [
    { icon: <RadioTower size={15} />, label: 'Sensor Nodes', value: `${systemHealth.nodesOnline} / ${systemHealth.totalNodes}`, status: systemHealth.nodesOnline === systemHealth.totalNodes ? 'ok' : 'warn' },
    { icon: <Wifi size={15} />, label: 'LoRa Mesh', value: systemHealth.loraHealth, status: systemHealth.loraHealth === 'Healthy' ? 'ok' : 'warn' },
    { icon: <Server size={15} />, label: 'Gateway', value: gateway.online ? 'ONLINE' : 'OFFLINE', status: gateway.online ? 'ok' : 'crit' },
    { icon: <Cloud size={15} />, label: 'Cloud Link', value: systemHealth.cloudLink ? 'Connected' : 'Disconnected', status: systemHealth.cloudLink ? 'ok' : 'warn' },
    { icon: <Database size={15} />, label: 'Data Pipeline', value: systemHealth.dataPipeline, status: systemHealth.dataPipeline === 'Healthy' ? 'ok' : 'warn' },
    { icon: <Cpu size={15} />, label: 'AI Engine', value: systemHealth.aiEngine, status: systemHealth.aiEngine === 'Running' ? 'ok' : 'warn' },
    { icon: <HardDrive size={15} />, label: 'Storage', value: `${systemHealth.storage}%`, status: systemHealth.storage > 90 ? 'warn' : 'ok' },
    { icon: <Battery size={15} />, label: 'Power', value: systemHealth.power, status: systemHealth.power === 'Good' ? 'ok' : 'warn' },
    { icon: <Satellite size={15} />, label: 'InSAR Last Update', value: new Date(systemHealth.insarLastUpdate).toLocaleDateString('en-IN'), status: 'ok' },
  ];

  const statusColor = (s: string) => s === 'ok' ? 'var(--color-stable)' : s === 'crit' ? 'var(--color-critical)' : 'var(--color-warning)';

  return (
    <div style={{ padding: '0.875rem', height: '100%', overflowY: 'auto' }}>
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '0.25rem' }}>System Health</div>
        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>DHARATAL infrastructure and monitoring pipeline status</div>
      </div>

      {/* Health grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1rem' }}>
        {items.map(item => (
          <div key={item.label} className="card" style={{ padding: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.75rem', borderLeft: `3px solid ${statusColor(item.status)}` }}>
            <div style={{ color: statusColor(item.status), flexShrink: 0 }}>{item.icon}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.15rem' }}>{item.label}</div>
              <div style={{ fontWeight: 700, color: statusColor(item.status) }}>{item.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Network links table */}
      <div className="card" style={{ padding: '0.875rem' }}>
        <div className="section-label" style={{ marginBottom: '0.5rem' }}>LoRa Mesh Link Table</div>
        <table className="data-table">
          <thead>
            <tr><th>Link</th><th>RSSI</th><th>SNR</th><th>Pkt Loss</th><th>Health</th></tr>
          </thead>
          <tbody>
            {networkLinks.map(l => (
              <tr key={`${l.from}-${l.to}`}>
                <td style={{ fontWeight: 600 }}>{l.from} → {l.to}</td>
                <td style={{ color: 'var(--color-text-secondary)' }}>{l.rssi} dBm</td>
                <td style={{ color: 'var(--color-text-secondary)' }}>{l.snr} dB</td>
                <td style={{ color: 'var(--color-text-secondary)' }}>{l.packetLoss}%</td>
                <td>
                  <span style={{ fontWeight: 700, color: l.health === 'Good' ? 'var(--color-stable)' : l.health === 'Degraded' ? 'var(--color-warning)' : 'var(--color-critical)', fontSize: '0.72rem' }}>
                    {l.health}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {gateway.bufferedPackets > 0 && (
        <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: '0.5rem', fontSize: '0.8rem', color: 'var(--color-warning)' }}>
          ⚠ Cloud link offline — {gateway.bufferedPackets} packets in local buffer. Monitoring continues locally.
        </div>
      )}
    </div>
  );
}
