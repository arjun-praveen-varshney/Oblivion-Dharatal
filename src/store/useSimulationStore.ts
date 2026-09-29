import { create } from 'zustand';
import { 
  SensorNode, 
  RiskZone, 
  SatelliteObservation, 
  InfrastructureAsset, 
  Alert, 
  SystemHealth,
  ScenarioState,
  SimulationScenario
} from '../types';
import { INITIAL_SENSORS, INFRASTRUCTURE, INITIAL_SYSTEM_HEALTH, MINE_PANELS } from '../simulation/mockData';

interface SimulationState {
  // Config
  isDemoMode: boolean;
  isJudgeMode: boolean;
  isOffline: boolean;
  
  // Data
  sensors: SensorNode[];
  riskZones: RiskZone[];
  infrastructure: InfrastructureAsset[];
  alerts: Alert[];
  systemHealth: SystemHealth;
  satelliteObservation: SatelliteObservation | null;
  minePanels: typeof MINE_PANELS;
  
  // Simulation Control
  currentScenarioState: ScenarioState;
  activeScenario: SimulationScenario;
  scenarioTimeElapsed: number; // in days for simulation
  adaptiveSamplingActive: boolean;
  adaptiveNodeId: string | null;
  
  // Historical data for charts
  historicalDeformation: { day: number; value: number }[];
  historicalVelocity: { day: number; value: number }[];
  
  // Actions
  toggleDemoMode: () => void;
  toggleJudgeMode: () => void;
  toggleOffline: () => void;
  setScenario: (scenario: SimulationScenario) => void;
  tickSimulation: () => void;
  addAlert: (alert: Omit<Alert, 'id' | 'timestamp'>) => void;
  
  // Specialized setters for engine
  updateSensors: (sensors: SensorNode[]) => void;
  updateRiskZones: (zones: RiskZone[]) => void;
  updateInfrastructure: (infra: InfrastructureAsset[]) => void;
  setAdaptiveSampling: (active: boolean, nodeId?: string) => void;
  setSatelliteObservation: (obs: SatelliteObservation | null) => void;
  setScenarioState: (state: ScenarioState) => void;
  addHistoricalData: (day: number, deformation: number, velocity: number) => void;
}

export const useSimulationStore = create<SimulationState>((set) => ({
  isDemoMode: true,
  isJudgeMode: false,
  isOffline: false,
  
  sensors: INITIAL_SENSORS,
  riskZones: [],
  infrastructure: INFRASTRUCTURE,
  alerts: [],
  systemHealth: INITIAL_SYSTEM_HEALTH,
  satelliteObservation: null,
  minePanels: MINE_PANELS,
  
  currentScenarioState: 'NORMAL',
  activeScenario: 'NORMAL',
  scenarioTimeElapsed: 0,
  adaptiveSamplingActive: false,
  adaptiveNodeId: null,
  
  historicalDeformation: [{ day: 0, value: 0 }],
  historicalVelocity: [{ day: 0, value: 0 }],
  
  toggleDemoMode: () => set((state) => ({ isDemoMode: !state.isDemoMode })),
  toggleJudgeMode: () => set((state) => ({ isJudgeMode: !state.isJudgeMode })),
  toggleOffline: () => set((state) => ({ isOffline: !state.isOffline })),
  
  setScenario: (scenario) => set({ activeScenario: scenario, scenarioTimeElapsed: 0 }),
  
  tickSimulation: () => set((state) => ({ scenarioTimeElapsed: state.scenarioTimeElapsed + 1 })),
  
  addAlert: (alert) => set((state) => ({
    alerts: [
      {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString(),
        ...alert
      },
      ...state.alerts
    ].slice(0, 50) // Keep last 50
  })),
  
  updateSensors: (sensors) => set({ sensors }),
  updateRiskZones: (riskZones) => set({ riskZones }),
  updateInfrastructure: (infrastructure) => set({ infrastructure }),
  
  setAdaptiveSampling: (active, nodeId) => set({ adaptiveSamplingActive: active, adaptiveNodeId: nodeId || null }),
  setSatelliteObservation: (obs) => set({ satelliteObservation: obs }),
  setScenarioState: (state) => set({ currentScenarioState: state }),
  
  addHistoricalData: (day, deformation, velocity) => set((state) => ({
    historicalDeformation: [...state.historicalDeformation, { day, value: deformation }],
    historicalVelocity: [...state.historicalVelocity, { day, value: velocity }]
  }))
}));
