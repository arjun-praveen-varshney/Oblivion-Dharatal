import React from 'react';
import { useSimulationStore } from '../store/useSimulationStore';
import { Badge } from './ui/Badge';
import { Activity, Wifi, ShieldAlert, WifiOff } from 'lucide-react';

export function Header() {
  const { isDemoMode, isOffline, systemHealth, currentScenarioState, riskZones } = useSimulationStore();
  
  const activeAlerts = riskZones.length > 0;
  
  return (
    <header className="bg-sidebar text-sidebarForeground border-b border-border/10 flex items-center justify-between px-6 h-16 shadow-sm z-50 relative">
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2 text-primary font-bold text-xl tracking-tight">
          <Activity className="h-6 w-6" />
          <span>DHARATAL</span>
        </div>
        
        <div className="hidden md:flex items-center space-x-4 text-sm">
          <div className="flex flex-col">
            <span className="text-muted text-xs uppercase font-semibold tracking-wider">Monitoring Zone</span>
            <span className="font-medium text-slate-200">Jharia Coalfield — Demo Area</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        {isDemoMode && (
          <Badge variant="info" className="bg-blue-500/20 animate-pulse border-blue-500/50">
            SIMULATION MODE
          </Badge>
        )}
        
        <div className="flex items-center space-x-4 text-sm font-medium">
          <div className="flex items-center space-x-2">
            <span className="text-muted text-xs uppercase">Status</span>
            <span className={activeAlerts ? 'text-status-warning' : 'text-status-stable'}>
              {currentScenarioState.replace('_', ' ')}
            </span>
          </div>
          
          <div className="h-4 w-px bg-border/20"></div>
          
          <div className="flex items-center space-x-2">
            <span className="text-muted text-xs uppercase">Data</span>
            <span className="text-slate-300">SIMULATED</span>
          </div>
          
          <div className="h-4 w-px bg-border/20"></div>
          
          <div className="flex items-center space-x-2">
            {isOffline ? (
              <>
                <WifiOff className="h-4 w-4 text-status-critical" />
                <span className="text-status-critical">OFFLINE</span>
              </>
            ) : (
              <>
                <Wifi className="h-4 w-4 text-status-stable" />
                <span className="text-status-stable">CONNECTED</span>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
