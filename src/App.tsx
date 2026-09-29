import React from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { KpiCards } from './components/KpiCards';
import { RiskMap } from './components/RiskMap';
import { DeformationTrend } from './components/DeformationTrend';
import { SensorNetwork } from './components/SensorNetwork';
import { ProgressionIntelligence } from './components/ProgressionIntelligence';
import { AlertTimeline } from './components/AlertTimeline';
import { SimulationControls } from './components/SimulationControls';
import { EarlyWarningCard } from './components/EarlyWarningCard';
import { useSimulationStore } from './store/useSimulationStore';

function App() {
  const { isJudgeMode } = useSimulationStore();

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      <Sidebar />
      
      <div className="flex flex-col flex-1 min-w-0 relative">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-20">
          <KpiCards />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 mb-4 md:mb-6 h-[500px]">
            {/* Map gets more space in judge mode */}
            <div className={`${isJudgeMode ? 'lg:col-span-8' : 'lg:col-span-6'} h-full flex flex-col`}>
              <RiskMap />
            </div>
            
            <div className={`${isJudgeMode ? 'lg:col-span-4' : 'lg:col-span-6'} h-full flex flex-col`}>
              <DeformationTrend />
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 h-[400px]">
            <div className={`${isJudgeMode ? 'lg:col-span-3' : 'lg:col-span-4'} h-full flex flex-col`}>
              <SensorNetwork />
            </div>
            
            <div className={`${isJudgeMode ? 'lg:col-span-6' : 'lg:col-span-4'} h-full flex flex-col`}>
              <ProgressionIntelligence />
            </div>
            
            <div className={`${isJudgeMode ? 'lg:col-span-3' : 'lg:col-span-4'} h-full flex flex-col`}>
              <AlertTimeline />
            </div>
          </div>
        </main>
      </div>

      <EarlyWarningCard />
      <SimulationControls />
    </div>
  );
}

export default App;
