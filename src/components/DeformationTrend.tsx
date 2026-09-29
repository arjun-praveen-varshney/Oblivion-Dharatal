import React from 'react';
import { useSimulationStore } from '../store/useSimulationStore';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Badge } from './ui/Badge';

export function DeformationTrend() {
  const { historicalDeformation, historicalVelocity, currentScenarioState } = useSimulationStore();
  
  const isAccelerating = currentScenarioState === 'ACCELERATING' || currentScenarioState === 'WARNING' || currentScenarioState === 'HIGH_RISK' || currentScenarioState === 'EARLY_WARNING';

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="py-4 pb-0 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-bold text-slate-700 uppercase tracking-wider">Deformation vs Time</CardTitle>
        <div className="flex gap-2">
          <Badge variant="outline" className="text-xs text-muted font-normal cursor-pointer">7D</Badge>
          <Badge variant="outline" className="text-xs bg-slate-100 font-semibold cursor-pointer">30D</Badge>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-4 pt-2">
        <div className="flex-1 min-h-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={historicalDeformation} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                labelStyle={{ fontWeight: 'bold', color: '#0f172a' }}
              />
              <ReferenceLine y={10} stroke="#f59e0b" strokeDasharray="3 3" />
              <ReferenceLine y={20} stroke="#ef4444" strokeDasharray="3 3" />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#0d9488" 
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6, fill: '#0d9488', stroke: '#fff', strokeWidth: 2 }} 
                animationDuration={500}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 pt-4 border-t border-border/50">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Velocity Trend</h4>
            {isAccelerating && (
              <Badge variant="critical" className="animate-pulse">ACCELERATING</Badge>
            )}
            {!isAccelerating && <Badge variant="stable">STABLE</Badge>}
          </div>
          
          <div className="h-20">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historicalVelocity} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <YAxis hide domain={[0, 'auto']} />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke={isAccelerating ? "#f97316" : "#10b981"} 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
