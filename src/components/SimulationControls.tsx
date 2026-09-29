import React, { useState } from 'react';
import { useSimulationStore } from '../store/useSimulationStore';
import { startSimulation, stopSimulation } from '../simulation/simulationEngine';
import { Play, Square, Settings2, Info } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';

export function SimulationControls() {
  const { activeScenario, setScenario, isJudgeMode, toggleJudgeMode, toggleOffline } = useSimulationStore();
  const [isRunning, setIsRunning] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // Collapsible state

  const handlePlay = (scenario: any) => {
    setScenario(scenario);
    startSimulation();
    setIsRunning(true);
  };

  const handleStop = () => {
    stopSimulation();
    setScenario('NORMAL');
    setIsRunning(false);
    window.location.reload(); // Simple reset for prototype demo
  };

  return (
    <div className="fixed bottom-4 left-4 z-[2000] w-80">
      <Card className="border-primary/30 shadow-lg bg-card/95 backdrop-blur-xl">
        <CardHeader 
          className="py-3 px-4 flex flex-row items-center justify-between cursor-pointer border-b border-border/50"
          onClick={() => setIsOpen(!isOpen)}
        >
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <Settings2 className="w-4 h-4 text-primary" />
            DEMO SCENARIOS
          </CardTitle>
          <div className="text-xs text-muted font-medium bg-slate-100 px-2 py-1 rounded">
            {isRunning ? 'RUNNING' : 'STOPPED'}
          </div>
        </CardHeader>
        
        {isOpen && (
          <CardContent className="p-4 space-y-3">
            <div className="text-xs text-slate-500 mb-2 flex items-start gap-2 bg-blue-50/50 p-2 rounded">
              <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <p>These controls drive the deterministic simulation engine for demonstration purposes.</p>
            </div>
            
            <div className="space-y-2">
              <ScenarioButton 
                label="Full Subsidence Scenario" 
                active={activeScenario === 'FULL_SUBSIDENCE'} 
                onClick={() => handlePlay('FULL_SUBSIDENCE')} 
                primary
              />
              <div className="grid grid-cols-2 gap-2">
                <ScenarioButton label="Normal Monitoring" active={activeScenario === 'NORMAL'} onClick={() => handlePlay('NORMAL')} />
                <ScenarioButton label="Judge Mode" active={isJudgeMode} onClick={toggleJudgeMode} toggle />
                <ScenarioButton label="Offline Degradation" active={false} onClick={toggleOffline} toggle />
              </div>
            </div>

            {isRunning && (
              <button 
                onClick={handleStop}
                className="w-full mt-4 flex items-center justify-center gap-2 py-2 bg-slate-100 hover:bg-red-50 text-red-600 rounded-md text-sm font-bold transition-colors border border-slate-200 hover:border-red-200"
              >
                <Square className="w-4 h-4" fill="currentColor" />
                RESET DEMO
              </button>
            )}
          </CardContent>
        )}
      </Card>
    </div>
  );
}

function ScenarioButton({ label, active, onClick, primary, toggle }: any) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-2 rounded text-xs font-semibold flex items-center justify-between border transition-all ${
        active && primary ? 'bg-primary text-primary-foreground border-primary shadow-sm' :
        active && !primary ? 'bg-slate-200 text-slate-800 border-slate-300' :
        primary ? 'bg-slate-800 text-slate-100 border-slate-700 hover:bg-slate-700' :
        'bg-card text-slate-600 border-border hover:bg-slate-50'
      }`}
    >
      <span>{label}</span>
      {(!active && !toggle) && <Play className="w-3 h-3" />}
      {active && <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>}
    </button>
  );
}
