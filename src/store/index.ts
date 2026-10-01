// ============================================================
// DHARATAL — Zustand Store
// ============================================================
import { create } from 'zustand';
import type {
  SensorNode,
  RiskZone,
  InfrastructureAsset,
  NetworkLink,
  GatewayStatus,
  InSARObservation,
  Alert,
  Notification,
  ModelOutput,
  SystemHealth,
  ScenarioState,
  SimulationScenario,
  NavigationPage,
  GlobalState,
} from '../types';
import {
  buildInitialSensors,
  INFRASTRUCTURE,
  buildInitialLinks,
  INITIAL_GATEWAY,
  INSAR_OBSERVATIONS,
  INITIAL_SYSTEM_HEALTH,
  INITIAL_MODEL,
  buildInitialKalman,
  buildInitialHistory,
} from '../simulation/mockData';

interface StoreActions {
  // navigation
  setPage: (page: NavigationPage) => void;
  // display modes
  toggleJudgeMode: () => void;
  toggleOffline: () => void;
  // scenario control
  setScenario: (s: SimulationScenario) => void;
  setScenarioState: (s: ScenarioState) => void;
  tickDay: () => void;
  resetSimulation: () => void;
  // data setters
  setSensors: (sensors: SensorNode[]) => void;
  setRiskZones: (zones: RiskZone[]) => void;
  setNetworkLinks: (links: NetworkLink[]) => void;
  setKalmanData: (data: { t: number; raw: number; filtered: number }[]) => void;
  appendHistory: (day: number, value: number, velocity: number) => void;
  // alerts
  pushAlert: (a: Omit<Alert, 'id' | 'timestamp' | 'acknowledged'>) => void;
  acknowledgeAlert: (id: string) => void;
  // specific simulation actions
  activateInSAR: () => void;
  markImpactedAssets: () => void;
  killNode: (id: string) => void;
  healNetwork: (id: string) => void;
  setAdaptiveSampling: (active: boolean, highPriority?: boolean) => void;
  dispatchNotifications: () => void;
}

type Store = Omit<GlobalState, 'historicalDeformation' | 'historicalVelocity' | 'kalmanData'> & {
  historicalDeformation: { day: number; timestamp: string; value: number; velocity: number }[];
  kalmanData: { t: number; raw: number; filtered: number }[];
} & StoreActions;

export const useStore = create<Store>((set, get) => ({
  currentPage: 'overview',
  isDemoMode: true,
  isJudgeMode: false,
  isOffline: false,
  activeScenario: 'NORMAL',
  scenarioState: 'NORMAL',
  scenarioDay: 0,
  adaptiveSamplingActive: false,

  sensors: buildInitialSensors(),
  riskZones: [],
  infrastructure: [...INFRASTRUCTURE],
  networkLinks: buildInitialLinks(),
  gateway: { ...INITIAL_GATEWAY },
  insar: [...INSAR_OBSERVATIONS],
  alerts: [],
  notifications: [],
  modelOutput: { ...INITIAL_MODEL },
  systemHealth: { ...INITIAL_SYSTEM_HEALTH },
  historicalDeformation: buildInitialHistory(),
  kalmanData: buildInitialKalman(),

  // ---- Navigation ----
  setPage: (page) => set({ currentPage: page }),

  // ---- Display ----
  toggleJudgeMode: () => set((s) => ({ isJudgeMode: !s.isJudgeMode })),
  toggleOffline: () => set((s) => {
    const offline = !s.isOffline;
    return {
      isOffline: offline,
      gateway: { ...s.gateway, cloudLink: !offline },
      systemHealth: { ...s.systemHealth, cloudLink: !offline, bufferedPackets: offline ? 128 : 0 },
    };
  }),

  // ---- Scenario ----
  setScenario: (s) => set({ activeScenario: s, scenarioDay: 0, riskZones: [], alerts: [],
    sensors: buildInitialSensors(),
    infrastructure: [...INFRASTRUCTURE],
    insar: [...INSAR_OBSERVATIONS],
    systemHealth: { ...INITIAL_SYSTEM_HEALTH },
    historicalDeformation: buildInitialHistory(),
    kalmanData: buildInitialKalman(),
    adaptiveSamplingActive: false,
    notifications: [],
  }),
  setScenarioState: (s) => set({ scenarioState: s }),
  tickDay: () => set((s) => ({ scenarioDay: s.scenarioDay + 1 })),
  resetSimulation: () => {
    set({
      activeScenario: 'NORMAL',
      scenarioState: 'NORMAL',
      scenarioDay: 0,
      riskZones: [],
      alerts: [],
      sensors: buildInitialSensors(),
      infrastructure: [...INFRASTRUCTURE],
      insar: [...INSAR_OBSERVATIONS],
      systemHealth: { ...INITIAL_SYSTEM_HEALTH },
      historicalDeformation: buildInitialHistory(),
      kalmanData: buildInitialKalman(),
      adaptiveSamplingActive: false,
      notifications: [],
    });
  },

  // ---- Data setters ----
  setSensors: (sensors) => {
    const online = sensors.filter(s => s.status !== 'Offline' && s.status !== 'Tampered').length;
    set((s) => ({
      sensors,
      systemHealth: { ...s.systemHealth, nodesOnline: online },
    }));
  },
  setRiskZones: (riskZones) => set({ riskZones }),
  setNetworkLinks: (networkLinks) => set({ networkLinks }),
  setKalmanData: (kalmanData) => set({ kalmanData }),
  appendHistory: (day, value, velocity) => set((s) => ({
    historicalDeformation: [...s.historicalDeformation, {
      day, value, velocity, timestamp: new Date().toISOString(),
    }],
  })),

  // ---- Alerts ----
  pushAlert: (a) => set((s) => ({
    alerts: [{
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      acknowledged: false,
      ...a,
    }, ...s.alerts].slice(0, 80),
  })),
  acknowledgeAlert: (id) => set((s) => ({
    alerts: s.alerts.map(a => a.id === id ? { ...a, acknowledged: true } : a),
  })),

  // ---- Specialized actions ----
  activateInSAR: () => set((s) => ({
    insar: s.insar.map(obs => obs.id === 'INSAR-02' ? { ...obs, active: true } : obs),
  })),

  markImpactedAssets: () => set((s) => ({
    infrastructure: s.infrastructure.map(a => {
      if (['INF-01', 'INF-03'].includes(a.id)) return { ...a, impactStatus: 'Impacted' as const };
      if (['INF-04', 'INF-07', 'INF-08'].includes(a.id)) return { ...a, impactStatus: 'Watch' as const };
      return a;
    }),
  })),

  killNode: (id) => set((s) => {
    const sensors = s.sensors.map(n => n.id === id ? { ...n, status: 'Tampered' as const } : n);
    const links = s.networkLinks.map(l =>
      (l.from === id || l.to === id) ? { ...l, health: 'Failed' as const } : l
    );
    const online = sensors.filter(n => n.status !== 'Offline' && n.status !== 'Tampered').length;
    return {
      sensors,
      networkLinks: links,
      systemHealth: { ...s.systemHealth, nodesOnline: online, loraHealth: 'Degraded' },
    };
  }),

  healNetwork: (id) => set((s) => {
    // reroute — mark affected links as 'Degraded' not failed (bypassed)
    const links = s.networkLinks.map(l =>
      (l.from === id || l.to === id)
        ? { ...l, health: 'Degraded' as const }
        : l
    );
    return {
      networkLinks: links,
      systemHealth: { ...s.systemHealth, loraHealth: 'Healthy' },
    };
  }),

  setAdaptiveSampling: (active, highPriority = false) => set((s) => {
    const interval = highPriority ? 15 : 30;
    const clusterIds = ['S-05', 'S-06', 'S-07', 'S-09', 'S-10'];
    return {
      adaptiveSamplingActive: active,
      sensors: s.sensors.map(n =>
        clusterIds.includes(n.id) ? { ...n, samplingInterval: active ? interval : 60 } : n
      ),
    };
  }),

  dispatchNotifications: () => set((s) => ({
    notifications: [
      ...s.notifications,
      {
        id: crypto.randomUUID(),
        type: 'SMS' as const,
        recipient: 'Mine Control Operator',
        message: '🚨 EARLY WARNING: Zone Z-03 — High subsidence risk. Field inspection required.',
        sentAt: new Date().toISOString(),
        delivered: true,
      },
      {
        id: crypto.randomUUID(),
        type: 'APP' as const,
        recipient: 'Regional Safety Authority',
        message: '⚠️ DHARATAL ALERT: Accelerating deformation detected at Zone Z-03. Verify immediately.',
        sentAt: new Date().toISOString(),
        delivered: true,
      },
    ],
  })),
}));
