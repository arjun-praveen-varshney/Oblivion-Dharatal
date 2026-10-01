// ============================================================
// DHARATAL — Mock Data
// Fictional Jharia Coalfield demonstration area
// CENTER: 23.7500° N, 86.4200° E
// ============================================================
import type {
  SensorNode,
  InfrastructureAsset,
  NetworkLink,
  GatewayStatus,
  InSARObservation,
  SystemHealth,
  ModelOutput,
} from '../types';

const C = { lat: 23.75, lng: 86.42 };
const d = (dlat: number, dlng: number) => ({ lat: C.lat + dlat, lng: C.lng + dlng });

// Deterministic noise helper (no Math.random in hot path)
const pseudo = (seed: number) => ((seed * 16807 + 0) % 2147483647) / 2147483647;

// ---- Sensor Nodes (20 total) ----
export function buildInitialSensors(): SensorNode[] {
  const positions: { dlat: number; dlng: number }[] = [
    // Cluster A — normal zone
    { dlat: -0.018, dlng: -0.015 }, // S-01
    { dlat: -0.012, dlng: -0.018 }, // S-02
    { dlat: -0.015, dlng: -0.008 }, // S-03
    { dlat: -0.020, dlng: -0.005 }, // S-04
    // Cluster B — anomaly zone (S-05 to S-10)
    { dlat: 0.010,  dlng: 0.010  }, // S-05
    { dlat: 0.012,  dlng: 0.007  }, // S-06
    { dlat: 0.008,  dlng: 0.013  }, // S-07
    { dlat: 0.014,  dlng: 0.011  }, // S-08
    { dlat: 0.006,  dlng: 0.016  }, // S-09
    { dlat: 0.016,  dlng: 0.015  }, // S-10
    // Cluster C — eastern zone
    { dlat: 0.005,  dlng: -0.010 }, // S-11
    { dlat: 0.010,  dlng: -0.015 }, // S-12
    { dlat: 0.002,  dlng: -0.018 }, // S-13
    { dlat: -0.005, dlng: -0.012 }, // S-14
    // Cluster D — northern zone
    { dlat: 0.020,  dlng: -0.002 }, // S-15
    { dlat: 0.022,  dlng: 0.005  }, // S-16
    { dlat: 0.018,  dlng: 0.000  }, // S-17
    { dlat: 0.025,  dlng: -0.008 }, // S-18
    // Sparse nodes
    { dlat: -0.008, dlng: 0.020  }, // S-19
    { dlat: -0.015, dlng: 0.015  }, // S-20
  ];

  const now = new Date().toISOString();

  return positions.map((pos, i) => {
    const id = `S-${String(i + 1).padStart(2, '0')}`;
    const seed = (i + 1) * 37;
    const baseTilt = 0.05 + pseudo(seed) * 0.15;
    const baseDisp = 0.5 + pseudo(seed + 1) * 1.0;
    const battery = 80 + pseudo(seed + 3) * 20;

    // Build 20 historical raw & filtered readings
    const rawReadings = Array.from({ length: 20 }, (_, t) => ({
      timestamp: new Date(Date.now() - (20 - t) * 60000).toISOString(),
      tilt: baseTilt + (pseudo(seed + t + 10) - 0.5) * 0.05,
      displacement: baseDisp + (pseudo(seed + t + 20) - 0.5) * 0.3,
      vibration: 0.01 + pseudo(seed + t + 30) * 0.02,
      temperature: 28 + pseudo(seed + t + 40) * 5,
    }));

    // Kalman filter sim: smooth the raw
    const filteredReadings = rawReadings.map((r, t) => ({
      ...r,
      tilt: baseTilt + (pseudo(seed + t + 50) - 0.5) * 0.01,
      displacement: baseDisp + (pseudo(seed + t + 60) - 0.5) * 0.05,
    }));

    const zone = i < 4 ? 'Z-01' : i < 10 ? 'Z-03' : i < 14 ? 'Z-02' : 'Z-04';

    return {
      id,
      lat: C.lat + pos.dlat,
      lng: C.lng + pos.dlng,
      type: 'Tilt+Vibration+Displacement',
      tilt: baseTilt,
      displacement: baseDisp,
      vibration: 'Normal',
      vibrationRaw: 0.01 + pseudo(seed + 5) * 0.02,
      temperature: 28 + pseudo(seed + 6) * 5,
      battery,
      rssi: -(50 + pseudo(seed + 7) * 30),
      snr: 8 + pseudo(seed + 8) * 7,
      packetDelivery: 95 + pseudo(seed + 9) * 5,
      status: 'Healthy' as const,
      lastUpdate: now,
      samplingInterval: 60,
      rawReadings,
      filteredReadings,
      zone,
      installDate: '2026-06-15',
    };
  });
}

// ---- Infrastructure ----
export const INFRASTRUCTURE: InfrastructureAsset[] = [
  { id: 'INF-01', type: 'Settlement',        name: 'Village Dharampur',   ...d(0.018, 0.014),  impactStatus: 'Safe' },
  { id: 'INF-02', type: 'Settlement',        name: 'Colony Block-C',     ...d(-0.012, 0.016), impactStatus: 'Safe' },
  { id: 'INF-03', type: 'Settlement',        name: "Workers' Quarters A", ...d(0.007, 0.020),  impactStatus: 'Safe' },
  { id: 'INF-04', type: 'Road',              name: 'Main Haul Road NH-32', ...d(0.009, 0.004), impactStatus: 'Safe' },
  { id: 'INF-05', type: 'Road',              name: 'State Highway SH-19', ...d(-0.020, 0.018), impactStatus: 'Safe' },
  { id: 'INF-06', type: 'Railway',           name: 'ECR Coal Siding',     ...d(-0.010, 0.005), impactStatus: 'Safe' },
  { id: 'INF-07', type: 'Utility',           name: 'HT Power Corridor',   ...d(0.011, 0.009),  impactStatus: 'Safe' },
  { id: 'INF-08', type: 'Utility',           name: 'Water Pipeline RN-7', ...d(0.013, 0.004),  impactStatus: 'Safe' },
  { id: 'INF-09', type: 'Mine Infrastructure', name: 'Vent Shaft 3',      ...d(0.002, -0.005), impactStatus: 'Safe' },
  { id: 'INF-10', type: 'Mine Infrastructure', name: 'Incline Portal B',  ...d(-0.005, -0.015),impactStatus: 'Safe' },
];

// ---- Mine Panels ----
export const MINE_PANELS = [
  {
    id: 'MP-10A', name: 'Panel 10A (Active)', active: true,
    coords: [
      [C.lat + 0.005, C.lng + 0.005],
      [C.lat + 0.018, C.lng + 0.005],
      [C.lat + 0.018, C.lng + 0.018],
      [C.lat + 0.005, C.lng + 0.018],
    ] as [number, number][],
  },
  {
    id: 'MP-11B', name: 'Panel 11B (Old Workings)', active: false,
    coords: [
      [C.lat - 0.020, C.lng - 0.020],
      [C.lat - 0.005, C.lng - 0.020],
      [C.lat - 0.005, C.lng - 0.005],
      [C.lat - 0.020, C.lng - 0.005],
    ] as [number, number][],
  },
];

// ---- Network Links ----
export function buildInitialLinks(): NetworkLink[] {
  return [
    { from: 'S-05', to: 'S-06',     health: 'Good',     rssi: -62, snr: 9.2, packetLoss: 0.8 },
    { from: 'S-06', to: 'S-07',     health: 'Good',     rssi: -58, snr: 10.1, packetLoss: 0.5 },
    { from: 'S-07', to: 'S-08',     health: 'Good',     rssi: -65, snr: 8.4, packetLoss: 1.2 },
    { from: 'S-08', to: 'S-09',     health: 'Good',     rssi: -60, snr: 9.8, packetLoss: 0.6 },
    { from: 'S-09', to: 'GATEWAY',  health: 'Good',     rssi: -70, snr: 7.5, packetLoss: 1.5 },
    { from: 'S-01', to: 'S-05',     health: 'Good',     rssi: -72, snr: 6.8, packetLoss: 2.1 },
    { from: 'S-10', to: 'GATEWAY',  health: 'Good',     rssi: -68, snr: 8.0, packetLoss: 1.0 },
    { from: 'S-15', to: 'S-16',     health: 'Good',     rssi: -55, snr: 11.2, packetLoss: 0.3 },
    { from: 'S-16', to: 'GATEWAY',  health: 'Good',     rssi: -61, snr: 9.5, packetLoss: 0.9 },
  ];
}

// ---- Gateway ----
export const INITIAL_GATEWAY: GatewayStatus = {
  id: 'GW-01',
  online: true,
  cloudLink: true,
  bufferedPackets: 0,
  lastSync: new Date().toISOString(),
};

// ---- InSAR ----
export const INSAR_OBSERVATIONS: InSARObservation[] = [
  {
    id: 'INSAR-01',
    satellite: 'Sentinel-1A',
    acquisitionDate: '2026-09-12',
    minDeformation: -2.1,
    maxDeformation: 8.4,
    coverage: 94,
    zone: 'Z-03',
    confidence: 'MEDIUM',
    active: false,
  },
  {
    id: 'INSAR-02',
    satellite: 'Sentinel-1A',
    acquisitionDate: '2026-09-24',
    minDeformation: -1.8,
    maxDeformation: 15.2,
    coverage: 96,
    zone: 'Z-03',
    confidence: 'HIGH',
    active: false,
  },
];

// ---- Initial System Health ----
export const INITIAL_SYSTEM_HEALTH: SystemHealth = {
  nodesOnline: 20,
  totalNodes: 20,
  loraHealth: 'Healthy',
  gatewayOnline: true,
  cloudLink: true,
  dataPipeline: 'Healthy',
  aiEngine: 'Running',
  storage: 78,
  power: 'Good',
  lastSync: new Date().toISOString(),
  insarLastUpdate: '2026-09-24T08:00:00Z',
  bufferedPackets: 0,
};

// ---- Initial Model Output ----
export const INITIAL_MODEL: ModelOutput = {
  anomalyDetected: false,
  anomalyScore: 0.12,
  lstmForecast: Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    lower: 1.0 + i * 0.02,
    median: 1.5 + i * 0.03,
    upper: 2.0 + i * 0.05,
  })),
  predictionHorizonDays: 30,
  currentDeformation: 1.2,
  projectedMin: 1.8,
  projectedMax: 2.4,
  confidence: 'LOW',
  active: true,
};

// ---- Build initial kalman data ----
export function buildInitialKalman() {
  return Array.from({ length: 40 }, (_, t) => {
    const base = 1.2 + t * 0.02;
    const noise = (pseudo(t * 13 + 7) - 0.5) * 0.8;
    return { t, raw: base + noise, filtered: base + noise * 0.08 };
  });
}

// ---- Build initial historical data ----
export function buildInitialHistory() {
  const now = Date.now();
  const deformation: { day: number; timestamp: string; value: number; velocity: number }[] = [];
  for (let i = 0; i < 7; i++) {
    const val = 1.0 + i * 0.05;
    deformation.push({
      day: i + 1,
      timestamp: new Date(now - (7 - i) * 86400000).toISOString(),
      value: val,
      velocity: 0.05,
    });
  }
  return deformation;
}
