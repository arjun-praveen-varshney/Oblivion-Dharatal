import React from 'react';
import { useSimulationStore } from '../store/useSimulationStore';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { BellRing, ShieldAlert, AlertCircle, Info, Satellite } from 'lucide-react';
import { format } from 'date-fns';

export function AlertTimeline() {
  const { alerts } = useSimulationStore();

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="py-4 pb-2 border-b border-border/50">
        <CardTitle className="text-sm font-bold text-slate-700 flex items-center gap-2 uppercase tracking-wider">
          <BellRing className="w-4 h-4" />
          Alert Center
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-0">
        <div className="flex flex-col relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
          {alerts.length === 0 ? (
            <div className="p-6 text-center text-muted text-sm font-medium">No recent alerts</div>
          ) : (
            alerts.map((alert, i) => (
              <div key={alert.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active p-4 border-b border-border/20 last:border-0">
                {/* Icon marker */}
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 border-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 ${getIconBgClass(alert.severity)}`}>
                  {getAlertIcon(alert.severity, alert.message)}
                </div>
                
                {/* Content */}
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2rem)] p-3 rounded-lg border border-border/50 bg-card shadow-sm group-hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-1">
                    <time className="text-[10px] font-bold text-muted uppercase tracking-wider">{format(new Date(alert.timestamp), 'HH:mm:ss')}</time>
                    {alert.zoneId && <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">{alert.zoneId}</span>}
                  </div>
                  <div className="text-sm font-medium text-slate-700 leading-snug">
                    {alert.message}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function getIconBgClass(severity: string) {
  switch(severity) {
    case 'CRITICAL': return 'bg-red-500 text-white';
    case 'WARNING': return 'bg-orange-500 text-white';
    case 'WATCH': return 'bg-amber-500 text-white';
    default: return 'bg-blue-500 text-white';
  }
}

function getAlertIcon(severity: string, message: string) {
  if (message.includes('Satellite') || message.includes('Sentinel')) return <Satellite className="w-4 h-4" />;
  switch(severity) {
    case 'CRITICAL': return <ShieldAlert className="w-4 h-4" />;
    case 'WARNING': return <AlertCircle className="w-4 h-4" />;
    case 'WATCH': return <AlertCircle className="w-4 h-4" />;
    default: return <Info className="w-4 h-4" />;
  }
}
