// ============================================================
// DHARATAL — MINE SUBSIDENCE INTELLIGENCE & EARLY WARNING NETWORK
// Data Types & Interfaces
// ============================================================

export type RiskLevel = 'STABLE' | 'WATCH' | 'WARNING' | 'CRITICAL';
export type NodeStatus = 'Healthy' | 'Watch' | 'Warning' | 'Offline' | 'Tampered';
export type VibrationLevel = 'Normal' | 'Elevated' | 'High';
export type LinkHealth = 'Good' | 'Degraded' | 'Failed';
export type ScenarioState =
  | 'NORMAL'
  | 'SENSOR_NOISE'
  | 'ANOMALY_DETECTED'
  | 'PERSISTENT_ANOMALY'
  | 'ACCELERATING'
  | 'INSAR_CONFIRMED'
  | 'IMPACT_IDENTIFIED'
  | 'EARLY_WARNING'
  | 'NODE_FAILURE'
  | 'RECOVERY';

export type NavigationPage =
  | 'overview'
  | 'risk-map'
  | 'sensor-network'
  | 'deformation-trends'
  | 'insar'
  | 'alerts'
  | 'system-health';

export type SimulationScenario =
  | 'NORMAL'
  | 'DEFORMATION_EVENT'
  | 'SENSOR_NOISE'
  | 'PERSISTENT_ANOMALY'
  | 'ACCELERATING'
  | 'INSAR_CONFIRMATION'
  | 'NODE_FAILURE'
  | 'NETWORK_FAILURE'
  | 'EARLY_WARNING'
  | 'FULL_SCENARIO';

// ---- Sensor ----
export interface SensorReading {
  timestamp: string;
  tilt: number;
  displacement: number;
  vibration: number;
  temperature: number;
}

export interface SensorNode {
  id: string;
  lat: number;
  lng: number;
  type: 'Tilt+Vibration+Displacement' | 'Tilt' | 'Displacement';
  tilt: number;             // degrees
  displacement: number;     // mm
  vibration: VibrationLevel;
  vibrationRaw: number;     // m/s² raw
  temperature: number;      // °C
  battery: number;          // %
  rssi: number;             // dBm (LoRa)
  snr: number;              // dB
  packetDelivery: number;   // %
  status: NodeStatus;
  lastUpdate: string;       // ISO string
  samplingInterval: number; // seconds
  rawReadings: SensorReading[];      // last N raw readings
  filteredReadings: SensorReading[]; // Kalman-filtered
  zone: string;
  installDate: string;
}

// ---- Network ----
export interface NetworkLink {
  from: string;
  to: string;
  health: LinkHealth;
  rssi: number;
  snr: number;
  packetLoss: number; // %
}

export interface GatewayStatus {
  id: string;
  online: boolean;
  cloudLink: boolean;
  bufferedPackets: number;
  lastSync: string;
}

// ---- Deformation / Risk ----
export interface RiskZone {
  id: string;
  severity: RiskLevel;
  deformation: number;     // mm
  velocity: number;        // mm/day
  acceleration: number;    // mm/day²
  persistence: number;     // days
  spatialSpread: 'Stable' | 'Expanding' | 'Rapid';
  confidence: 'LOW' | 'MEDIUM' | 'HIGH';
  affectedSensors: string[];
  affectedAssets: string[];
  lat: number;
  lng: number;
  radius: number;          // meters
  reasons: string[];
  sensorAgreement: number; // %
  insarAgreement: number;  // %
  tiltEvidence: RiskLevel;
  displacementEvidence: RiskLevel;
  vibrationEvidence: VibrationLevel;
}

// ---- Infrastructure ----
export interface InfrastructureAsset {
  id: string;
  type: 'Settlement' | 'Road' | 'Railway' | 'Utility' | 'Mine Infrastructure';
  name: string;
  lat: number;
  lng: number;
  impactStatus: 'Safe' | 'Watch' | 'Impacted';
}

// ---- InSAR ----
export interface InSARObservation {
  id: string;
  satellite: string;
  acquisitionDate: string;
  minDeformation: number;
  maxDeformation: number;
  coverage: number;      // %
  zone: string;
  confidence: 'LOW' | 'MEDIUM' | 'HIGH';
  active: boolean;
}

// ---- Alerts ----
export interface Alert {
  id: string;
  timestamp: string;
  severity: RiskLevel | 'INFO' | 'SYSTEM';
  zoneId?: string;
  sensorId?: string;
  message: string;
  category: 'deformation' | 'network' | 'sensor' | 'insar' | 'warning' | 'system' | 'impact';
  acknowledged: boolean;
}

// ---- Notification ----
export interface Notification {
  id: string;
  type: 'SMS' | 'APP';
  recipient: string;
  message: string;
  sentAt: string;
  delivered: boolean;
}

// ---- AI / Model ----
export interface ModelOutput {
  anomalyDetected: boolean;
  anomalyScore: number; // 0-1
  lstmForecast: { day: number; lower: number; upper: number; median: number }[];
  predictionHorizonDays: number;
  currentDeformation: number;
  projectedMin: number;
  projectedMax: number;
  confidence: 'LOW' | 'MODERATE' | 'HIGH';
  active: boolean;
}

// ---- Historical data for charts ----
export interface TimeSeriesPoint {
  day: number;
  timestamp: string;
  raw?: number;
  filtered?: number;
  value?: number;
  velocity?: number;
}

// ---- System Health ----
export interface SystemHealth {
  nodesOnline: number;
  totalNodes: number;
  loraHealth: 'Healthy' | 'Degraded' | 'Down';
  gatewayOnline: boolean;
  cloudLink: boolean;
  dataPipeline: 'Healthy' | 'Degraded' | 'Down';
  aiEngine: 'Running' | 'Stopped';
  storage: number;        // %
  power: 'Good' | 'Fair' | 'Critical';
  lastSync: string;
  insarLastUpdate: string;
  bufferedPackets: number;
}

// ---- Global State ----
export interface GlobalState {
  currentPage: NavigationPage;
  isDemoMode: boolean;
  isJudgeMode: boolean;
  isOffline: boolean;
  activeScenario: SimulationScenario;
  scenarioState: ScenarioState;
  scenarioDay: number;
  adaptiveSamplingActive: boolean;

  sensors: SensorNode[];
  riskZones: RiskZone[];
  infrastructure: InfrastructureAsset[];
  networkLinks: NetworkLink[];
  gateway: GatewayStatus;
  insar: InSARObservation[];
  alerts: Alert[];
  notifications: Notification[];
  modelOutput: ModelOutput;
  systemHealth: SystemHealth;
  historicalDeformation: TimeSeriesPoint[];
  historicalVelocity: TimeSeriesPoint[];
  kalmanData: { t: number; raw: number; filtered: number }[];
}
