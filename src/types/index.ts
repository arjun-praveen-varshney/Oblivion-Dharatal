export type RiskLevel = 'STABLE' | 'WATCH' | 'WARNING' | 'CRITICAL';

export interface SensorNode {
  id: string;
  lat: number;
  lng: number;
  tilt: number;
  displacement: number;
  vibration: 'Normal' | 'Elevated' | 'High';
  temperature: number;
  battery: number;
  rssi: number;
  timestamp: string;
  status: 'Healthy' | 'Watch' | 'Warning' | 'Offline';
}

export interface RiskZone {
  id: string;
  severity: RiskLevel;
  deformation: number;
  velocity: number;
  acceleration: number;
  persistence: number; // days
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  affectedSensors: string[]; // Sensor IDs
  affectedAssets: string[]; // Asset IDs
  lat: number;
  lng: number;
  radius: number; // meters
  reasons: string[];
}

export interface SatelliteObservation {
  date: string;
  minDeformation: number;
  maxDeformation: number;
  coverage: number;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface InfrastructureAsset {
  id: string;
  type: 'Settlement' | 'Road' | 'Railway' | 'Utility' | 'Mine Infrastructure';
  name: string;
  lat: number;
  lng: number;
  distanceToRiskZone: number;
  impactStatus: 'Safe' | 'Watch' | 'Impacted';
}

export interface Alert {
  id: string;
  timestamp: string;
  severity: RiskLevel | 'INFO';
  zoneId?: string;
  message: string;
}

export interface SystemHealth {
  nodesOnline: number;
  totalNodes: number;
  gateway: 'ONLINE' | 'OFFLINE';
  dataPipeline: 'HEALTHY' | 'DEGRADED' | 'DOWN';
  storage: number;
  power: 'GOOD' | 'FAIR' | 'CRITICAL';
  lastSync: string;
  satelliteLastUpdate: string;
}

export type ScenarioState = 
  | 'NORMAL'
  | 'ANOMALY_DETECTED'
  | 'PERSISTENT_ANOMALY'
  | 'ACCELERATING'
  | 'WARNING'
  | 'HIGH_RISK'
  | 'EARLY_WARNING'
  | 'MITIGATION_MONITORING'
  | 'RECOVERY';

export type SimulationScenario = 
  | 'NORMAL'
  | 'SENSOR_ANOMALY'
  | 'PERSISTENT_DEFORMATION'
  | 'ACCELERATING_DEFORMATION'
  | 'SATELLITE_CONFIRMATION'
  | 'INFRASTRUCTURE_IMPACT'
  | 'NODE_FAILURE'
  | 'NETWORK_DEGRADATION'
  | 'FULL_SUBSIDENCE';
