import { SensorNode, InfrastructureAsset, RiskZone, SystemHealth } from '../types';

// Map center around 23.75, 86.42 (fictional Jharia coalfield area)
const CENTER_LAT = 23.75;
const CENTER_LNG = 86.42;

export const INITIAL_SYSTEM_HEALTH: SystemHealth = {
  nodesOnline: 20,
  totalNodes: 20,
  gateway: 'ONLINE',
  dataPipeline: 'HEALTHY',
  storage: 78,
  power: 'GOOD',
  lastSync: new Date().toISOString(),
  satelliteLastUpdate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
};

// Generate 20 sensor nodes
export const INITIAL_SENSORS: SensorNode[] = Array.from({ length: 20 }).map((_, i) => ({
  id: `S-${(i + 1).toString().padStart(2, '0')}`,
  lat: CENTER_LAT + (Math.random() - 0.5) * 0.04,
  lng: CENTER_LNG + (Math.random() - 0.5) * 0.04,
  tilt: Math.random() * 0.2, // normal baseline
  displacement: Math.random() * 1.5, // normal baseline
  vibration: 'Normal',
  temperature: 25 + Math.random() * 10,
  battery: 80 + Math.random() * 20,
  rssi: -50 - Math.random() * 30,
  timestamp: new Date().toISOString(),
  status: 'Healthy',
}));

// Manually position S-05, S-06, S-07, S-08 close to each other for the anomaly cluster
INITIAL_SENSORS[4].lat = CENTER_LAT + 0.01; INITIAL_SENSORS[4].lng = CENTER_LNG + 0.01;
INITIAL_SENSORS[5].lat = CENTER_LAT + 0.012; INITIAL_SENSORS[5].lng = CENTER_LNG + 0.008;
INITIAL_SENSORS[6].lat = CENTER_LAT + 0.008; INITIAL_SENSORS[6].lng = CENTER_LNG + 0.011;
INITIAL_SENSORS[7].lat = CENTER_LAT + 0.011; INITIAL_SENSORS[7].lng = CENTER_LNG + 0.013;


export const INFRASTRUCTURE: InfrastructureAsset[] = [
  { id: 'INF-1', type: 'Settlement', name: 'Village A', lat: CENTER_LAT + 0.015, lng: CENTER_LNG + 0.015, distanceToRiskZone: 0, impactStatus: 'Safe' },
  { id: 'INF-2', type: 'Settlement', name: 'Colony B', lat: CENTER_LAT - 0.015, lng: CENTER_LNG - 0.01, distanceToRiskZone: 0, impactStatus: 'Safe' },
  { id: 'INF-3', type: 'Settlement', name: 'Workers Quarters', lat: CENTER_LAT + 0.005, lng: CENTER_LNG + 0.02, distanceToRiskZone: 0, impactStatus: 'Safe' },
  { id: 'INF-4', type: 'Road', name: 'Main Haul Road', lat: CENTER_LAT + 0.008, lng: CENTER_LNG + 0.005, distanceToRiskZone: 0, impactStatus: 'Safe' },
  { id: 'INF-5', type: 'Road', name: 'State Highway', lat: CENTER_LAT - 0.02, lng: CENTER_LNG + 0.02, distanceToRiskZone: 0, impactStatus: 'Safe' },
  { id: 'INF-6', type: 'Railway', name: 'Coal Siding', lat: CENTER_LAT - 0.01, lng: CENTER_LNG + 0.005, distanceToRiskZone: 0, impactStatus: 'Safe' },
  { id: 'INF-7', type: 'Utility', name: 'Power Line Corridor', lat: CENTER_LAT + 0.01, lng: CENTER_LNG + 0.01, distanceToRiskZone: 0, impactStatus: 'Safe' },
  { id: 'INF-8', type: 'Utility', name: 'Water Pipeline', lat: CENTER_LAT + 0.012, lng: CENTER_LNG + 0.005, distanceToRiskZone: 0, impactStatus: 'Safe' },
  { id: 'INF-9', type: 'Mine Infrastructure', name: 'Ventilation Shaft 3', lat: CENTER_LAT + 0.002, lng: CENTER_LNG - 0.005, distanceToRiskZone: 0, impactStatus: 'Safe' },
  { id: 'INF-10', type: 'Mine Infrastructure', name: 'Incline Portal', lat: CENTER_LAT - 0.005, lng: CENTER_LNG - 0.015, distanceToRiskZone: 0, impactStatus: 'Safe' },
];

export const MINE_PANELS = [
  { id: 'P-1', name: 'Panel 10A (Active)', coords: [[CENTER_LAT + 0.005, CENTER_LNG + 0.005], [CENTER_LAT + 0.015, CENTER_LNG + 0.005], [CENTER_LAT + 0.015, CENTER_LNG + 0.015], [CENTER_LAT + 0.005, CENTER_LNG + 0.015]] },
  { id: 'P-2', name: 'Panel 11B (Old Workings)', coords: [[CENTER_LAT - 0.015, CENTER_LNG - 0.015], [CENTER_LAT - 0.005, CENTER_LNG - 0.015], [CENTER_LAT - 0.005, CENTER_LNG - 0.005], [CENTER_LAT - 0.015, CENTER_LNG - 0.005]] },
];
