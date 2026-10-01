import { useState } from 'react';
import { useStore } from '../store';
import {
  AreaChart, Area, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend
} from 'recharts';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const WINDOWS = ['7D', '30D', '90D'] as const;

export function DeformationTrend() {
  const { historicalDeformation, riskZones, scenarioState } = useStore();
  const [window, setWindow] = useState<typeof WINDOWS[number]>('30D');
  const topZone = riskZones[0];

  const isAccel = ['ACCELERATING', 'INSAR_CONFIRMED', 'IMPACT_IDENTIFIED', 'EARLY_WARNING'].includes(scenarioState);
  const trendColor = isAccel ? 'var(--color-critical)' : topZone ? 'var(--color-warning)' : 'var(--color-primary)';
  const trendLabel = isAccel ? 'ACCELERATING' : topZone ? 'PERSISTENT' : 'STABLE';

  const windowDays = window === '7D' ? 7 : window === '30D' ? 30 : 90;
  const data = historicalDeformation.slice(-windowDays);

  return (
    <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', borderBottom: '1px solid var(--color-border)', flexShrink: 0 }}>
        <div style={{ display: 'flex', align: 'center', gap: '0.5rem' }}>
          <span className="section-label">Deformation vs Time</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className={`badge badge-${isAccel ? 'critical' : topZone ? 'warning' : 'stable'}`}>{trendLabel}</span>
          <div style={{ display: 'flex', gap: '0.25rem' }}>
            {WINDOWS.map(w => (
              <button key={w} onClick={() => setWindow(w)} style={{
                padding: '0.2rem 0.45rem', fontSize: '0.65rem', fontWeight: 600, borderRadius: '0.3rem',
                border: '1px solid var(--color-border)',
                background: window === w ? 'var(--color-bg-muted)' : 'transparent',
                color: window === w ? 'var(--color-text)' : 'var(--color-text-muted)',
                cursor: 'pointer',
              }}>
                {w}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main chart */}
      <div style={{ flex: 1, padding: '0.5rem 0.5rem 0' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
            <defs>
              <linearGradient id="defGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={trendColor} stopOpacity={0.15} />
                <stop offset="95%" stopColor={trendColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
            <XAxis dataKey="day" tick={{ fontSize: 9, fill: 'var(--color-text-muted)' }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 9, fill: 'var(--color-text-muted)' }} tickLine={false} axisLine={false} unit=" mm" />
            <Tooltip
              contentStyle={{ borderRadius: '0.5rem', border: '1px solid var(--color-border)', fontSize: '0.75rem', padding: '0.4rem 0.6rem' }}
              labelStyle={{ fontWeight: 700 }}
              formatter={(v: number) => [`${v.toFixed(2)} mm`, 'Deformation']}
            />
            <ReferenceLine y={10} stroke="var(--color-watch)" strokeDasharray="4 3" label={{ value: 'Watch', fill: 'var(--color-watch)', fontSize: 9, position: 'insideTopRight' }} />
            <ReferenceLine y={20} stroke="var(--color-critical)" strokeDasharray="4 3" label={{ value: 'Critical', fill: 'var(--color-critical)', fontSize: 9, position: 'insideTopRight' }} />
            <Area
              type="monotone"
              dataKey="value"
              stroke={trendColor}
              strokeWidth={2.5}
              fill="url(#defGradient)"
              dot={false}
              activeDot={{ r: 4, fill: trendColor, stroke: 'white', strokeWidth: 2 }}
              animationDuration={600}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Velocity sub-chart */}
      <div style={{ padding: '0 0.5rem 0', borderTop: '1px dashed var(--color-border)', flexShrink: 0 }}>
        <div style={{ padding: '0.4rem 0 0.2rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span className="section-label">Velocity (mm/day)</span>
          {isAccel && <span style={{ fontSize: '0.65rem', color: 'var(--color-critical)', fontWeight: 700 }}>⬆ Accelerating</span>}
        </div>
        <div style={{ height: 60 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 2, right: 8, left: -18, bottom: 4 }}>
              <XAxis dataKey="day" hide />
              <YAxis hide domain={[0, 'auto']} />
              <Line
                type="monotone"
                dataKey="velocity"
                stroke={isAccel ? 'var(--color-critical)' : 'var(--color-primary)'}
                strokeWidth={2}
                dot={false}
                animationDuration={600}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
