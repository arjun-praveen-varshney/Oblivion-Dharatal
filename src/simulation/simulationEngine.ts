// ============================================================
// DHARATAL — Simulation Engine
// Deterministic scenario state machine
// ============================================================
import { useStore } from '../store';
import type { RiskZone, SensorNode, Alert, NetworkLink } from '../types';

let _interval: ReturnType<typeof setInterval> | null = null;
const TICK_MS = 1800; // each tick = 1 simulation day

export function startSimulation() {
  if (_interval) clearInterval(_interval);
  _interval = setInterval(tick, TICK_MS);
}

export function stopSimulation() {
  if (_interval) { clearInterval(_interval); _interval = null; }
}

function tick() {
  const store = useStore.getState();
  if (store.activeScenario === 'NORMAL') { store.tickDay(); return; }
  if (store.activeScenario === 'FULL_SCENARIO') runFullScenario();
}

function runFullScenario() {
  const store = useStore.getState();
  const day = store.scenarioDay;
  store.tickDay();

  // ---- Day 1: Normal ----
  if (day === 1) {
    store.setScenarioState('NORMAL');
    emit('INFO', 'system', 'Monitoring started. All sensors nominal. Baseline stable.');
  }

  // ---- Day 2–5: Sensor Noise ----
  if (day >= 2 && day <= 5) {
    store.setScenarioState('SENSOR_NOISE');
    injectKalmanNoise(day);
    if (day === 2) emit('INFO', 'sensor', 'Edge Kalman filtering active. Noise smoothing in progress.');
  }

  // ---- Day 6–10: Anomaly Detected ----
  if (day >= 6 && day <= 10) {
    store.setScenarioState('ANOMALY_DETECTED');
    const deformation = 1.2 + (day - 5) * 0.4;
    updateZone('WATCH', deformation, 0.4, 0, day - 5, 'MEDIUM');
    injectSensorDeformation(deformation, false);
    if (day === 6) emit('WATCH', 'deformation', '🟡 Tilt anomaly detected — Zone Z-03. Isolation Forest flagged.');
    if (day === 8) emit('WATCH', 'deformation', '🟡 Multi-sensor correlation detected across S-05, S-06, S-07, S-08.');
    store.appendHistory(day, deformation, 0.4);
  }

  // ---- Day 11–18: Persistent Anomaly ----
  if (day >= 11 && day <= 18) {
    store.setScenarioState('PERSISTENT_ANOMALY');
    const deformation = 3.2 + (day - 10) * 0.6;
    const velocity = 0.6 + (day - 10) * 0.05;
    updateZone('WATCH', deformation, velocity, 0.05, day - 5, 'MEDIUM');
    injectSensorDeformation(deformation, false);
    if (day === 11) emit('WATCH', 'deformation', '🟡 Persistent deformation pattern. Movement for 6+ days.');
    if (day === 14) emit('WATCH', 'deformation', '🟡 Spatial spread widening. S-09, S-10 now elevated.');
    store.appendHistory(day, deformation, velocity);
  }

  // ---- Day 19–25: Accelerating ----
  if (day >= 19 && day <= 25) {
    store.setScenarioState('ACCELERATING');
    const deformation = 8.0 + Math.pow(day - 18, 1.3) * 0.9;
    const velocity = 1.2 + (day - 18) * 0.15;
    const accel = 0.15;
    updateZone('WARNING', deformation, velocity, accel, day - 5, 'HIGH');
    injectSensorDeformation(deformation, true);
    if (day === 19) emit('WARNING', 'deformation', '🟠 Deformation velocity increasing — ACCELERATING state.');
    if (day === 21) emit('WARNING', 'deformation', '🟠 Adaptive monitoring activated. Sampling: 60s → 30s.');
    if (day === 21) store.setAdaptiveSampling(true);
    store.appendHistory(day, deformation, velocity);
  }

  // ---- Day 26: InSAR Confirmation ----
  if (day === 26) {
    store.setScenarioState('INSAR_CONFIRMED');
    const deformation = 18.2;
    updateZone('WARNING', deformation, 2.1, 0.4, 21, 'HIGH');
    injectSensorDeformation(deformation, true);
    store.activateInSAR();
    emit('WARNING', 'insar', '📡 Sentinel-1 InSAR acquisition processed. Deformation: –1.8 mm to +15.2 mm. CONFIRMED.');
    store.appendHistory(day, deformation, 2.1);
  }

  // ---- Day 27: Impact Identified ----
  if (day === 27) {
    store.setScenarioState('IMPACT_IDENTIFIED');
    const deformation = 20.5;
    updateZone('CRITICAL', deformation, 2.6, 0.5, 22, 'HIGH');
    injectSensorDeformation(deformation, true);
    store.markImpactedAssets();
    emit('CRITICAL', 'impact', '🔴 Impact Analysis: 3 settlements, 1 road, 2 utilities within risk radius.');
    store.appendHistory(day, deformation, 2.6);
  }

  // ---- Day 28: Early Warning ----
  if (day === 28) {
    store.setScenarioState('EARLY_WARNING');
    updateZone('CRITICAL', 22.5, 2.8, 0.5, 23, 'HIGH');
    injectSensorDeformation(22.5, true);
    store.setAdaptiveSampling(true, true); // 15s mode
    emit('CRITICAL', 'warning', '🚨 EARLY WARNING ISSUED — Zone Z-03. FIELD INSPECTION RECOMMENDED.');
    emit('CRITICAL', 'warning', '📱 SMS dispatched to Mine Control Operator. APP alert to Safety Authority.');
    store.dispatchNotifications();
    store.appendHistory(28, 22.5, 2.8);
  }

  // ---- Day 29: Node Failure ----
  if (day === 29) {
    store.setScenarioState('NODE_FAILURE');
    store.killNode('S-08');
    emit('CRITICAL', 'network', '❌ NODE S-08 OFFLINE — Tamper/Damage detected. Last valid reading: logged.');
    setTimeout(() => {
      store.healNetwork('S-08');
      emit('INFO', 'network', '✅ Mesh route reconfigured. S-08 bypassed via S-07 → S-09. Telemetry RESTORED.');
    }, 3500);
    store.appendHistory(29, 23.0, 2.8);
  }

  // ---- Day 30+: Recovery / Monitoring ----
  if (day >= 30) {
    store.setScenarioState('RECOVERY');
    store.appendHistory(day, 23.0 + (day - 30) * 0.5, 2.0);
    if (day === 30) emit('INFO', 'system', '✅ EARLY WARNING ACTIVE. ADAPTIVE MONITORING CONTINUES. 18/20 nodes online.');
  }
}

// ---- Helpers ----
function emit(
  severity: Alert['severity'],
  category: Alert['category'],
  message: string,
  zoneId = 'Z-03'
) {
  useStore.getState().pushAlert({ severity, category, message, zoneId });
}

function updateZone(
  severity: RiskZone['severity'],
  deformation: number,
  velocity: number,
  acceleration: number,
  persistence: number,
  confidence: RiskZone['confidence']
) {
  const reasons: string[] = [
    'Deformation increasing',
    ...(velocity > 1.0 ? ['Velocity accelerating'] : []),
    ...(persistence > 7 ? ['Persistent for ' + persistence + ' days'] : []),
    'Neighboring sensors correlated',
    ...(confidence === 'HIGH' ? ['InSAR trend agrees'] : []),
    'Located above active mine panel',
  ];

  const zone: RiskZone = {
    id: 'Z-03',
    severity,
    deformation: parseFloat(deformation.toFixed(2)),
    velocity: parseFloat(velocity.toFixed(2)),
    acceleration: parseFloat(acceleration.toFixed(3)),
    persistence,
    spatialSpread: persistence > 10 ? 'Expanding' : 'Stable',
    confidence,
    affectedSensors: ['S-05', 'S-06', 'S-07', 'S-08', 'S-09', 'S-10'],
    affectedAssets: ['INF-01', 'INF-03', 'INF-04', 'INF-07', 'INF-08'],
    lat: 23.7600,
    lng: 86.4310,
    radius: 600,
    reasons,
    sensorAgreement: confidence === 'HIGH' ? 91 : 76,
    insarAgreement: confidence === 'HIGH' ? 87 : 0,
    tiltEvidence: severity,
    displacementEvidence: severity,
    vibrationEvidence: deformation > 10 ? 'Elevated' : 'Normal',
  };
  useStore.getState().setRiskZones([zone]);
}

function injectSensorDeformation(deformation: number, elevated: boolean) {
  const store = useStore.getState();
  const clusterIds = ['S-05', 'S-06', 'S-07', 'S-08', 'S-09', 'S-10'];
  const updated = store.sensors.map((s: SensorNode) => {
    if (!clusterIds.includes(s.id)) return s;
    const factor = 0.7 + (clusterIds.indexOf(s.id)) * 0.06;
    const d = parseFloat((deformation * factor).toFixed(2));
    const t = parseFloat((d / 12).toFixed(3));
    return {
      ...s,
      displacement: d,
      tilt: t,
      vibration: (elevated && d > 8 ? 'Elevated' : 'Normal') as SensorNode['vibration'],
      status: (d > 15 ? 'Warning' : d > 6 ? 'Watch' : 'Healthy') as SensorNode['status'],
      samplingInterval: store.adaptiveSamplingActive ? 15 : 60,
    };
  });
  store.setSensors(updated);
}

function injectKalmanNoise(day: number) {
  const store = useStore.getState();
  const newKalman = Array.from({ length: 40 + day * 2 }, (_, t) => {
    const base = 1.2 + t * 0.02;
    const p = ((t * 16807 + day * 1031) % 2147483647) / 2147483647;
    const noise = (p - 0.5) * 1.2;
    return { t, raw: base + noise, filtered: base + noise * 0.08 };
  });
  store.setKalmanData(newKalman);
}
