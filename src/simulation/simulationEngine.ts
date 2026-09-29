import { useSimulationStore } from '../store/useSimulationStore';
import { RiskZone, Alert } from '../types';

let simulationInterval: number | null = null;
const TICK_RATE_MS = 2000; // 2 seconds real time = 1 simulation day

export const startSimulation = () => {
  if (simulationInterval) clearInterval(simulationInterval);
  
  simulationInterval = window.setInterval(() => {
    runSimulationStep();
  }, TICK_RATE_MS);
};

export const stopSimulation = () => {
  if (simulationInterval) {
    clearInterval(simulationInterval);
    simulationInterval = null;
  }
};

export const runSimulationStep = () => {
  const store = useSimulationStore.getState();
  
  if (store.activeScenario === 'NORMAL') {
    // Just maintain baseline
    store.tickSimulation();
    return;
  }
  
  if (store.activeScenario === 'FULL_SUBSIDENCE') {
    runFullSubsidenceScenario(store);
  }
};

function runFullSubsidenceScenario(store: ReturnType<typeof useSimulationStore.getState>) {
  const day = store.scenarioTimeElapsed;
  store.tickSimulation();
  
  // Base configuration for the anomaly
  const anomalyCenter = { lat: 23.76, lng: 86.43 };
  let newDeformation = 0;
  let newVelocity = 0;
  
  if (day === 1) {
    store.setScenarioState('NORMAL');
    store.addAlert({ severity: 'INFO', message: 'Monitoring started. Baseline stable.' });
  } 
  else if (day > 1 && day <= 7) {
    store.setScenarioState('ANOMALY_DETECTED');
    newDeformation = 1.2 + (day * 0.1);
    newVelocity = 0.1;
    if (day === 3) store.addAlert({ severity: 'WATCH', message: '🟡 Emerging anomaly detected in Zone Z-03' });
    
    updateRiskZone(store, 'WATCH', newDeformation, newVelocity, day, 'MEDIUM');
  }
  else if (day > 7 && day <= 14) {
    store.setScenarioState('PERSISTENT_ANOMALY');
    newDeformation = 2.0 + ((day - 7) * 0.3);
    newVelocity = 0.3;
    if (day === 8) store.addAlert({ severity: 'WATCH', message: '🟡 Spatial correlation detected across neighboring sensors' });
    if (day === 12) store.addAlert({ severity: 'WATCH', message: '🟡 Persistent deformation pattern' });
    
    updateRiskZone(store, 'WATCH', newDeformation, newVelocity, day, 'MEDIUM');
  }
  else if (day > 14 && day <= 21) {
    store.setScenarioState('ACCELERATING');
    newDeformation = 4.1 + Math.pow(day - 14, 1.2) * 0.5;
    newVelocity = 0.5 + ((day - 14) * 0.1);
    if (day === 15) store.addAlert({ severity: 'WARNING', message: '🟠 Acceleration detected' });
    
    updateRiskZone(store, 'WARNING', newDeformation, newVelocity, day, 'HIGH');
  }
  else if (day > 21 && day <= 30) {
    store.setScenarioState('WARNING');
    newDeformation = 9.0 + Math.pow(day - 21, 1.3) * 0.8;
    newVelocity = 1.2 + ((day - 21) * 0.2);
    
    updateRiskZone(store, 'WARNING', newDeformation, newVelocity, day, 'HIGH');
  }
  else if (day === 31) {
    store.setScenarioState('HIGH_RISK');
    newDeformation = 22.5;
    newVelocity = 3.0;
    store.addAlert({ severity: 'CRITICAL', message: '🟠 Satellite confirmation: Sentinel-1 InSAR confirms displacement' });
    store.setSatelliteObservation({
      date: new Date().toISOString(),
      minDeformation: -2,
      maxDeformation: 25,
      coverage: 95,
      confidence: 'HIGH'
    });
    
    updateRiskZone(store, 'CRITICAL', newDeformation, newVelocity, day, 'HIGH');
  }
  else if (day === 32) {
    store.setScenarioState('EARLY_WARNING');
    store.addAlert({ severity: 'CRITICAL', message: '🔴 HIGH-RISK ZONE ESTABLISHED' });
    store.addAlert({ severity: 'CRITICAL', message: '🚨 3 nearby assets entered potential impact zone' });
    store.addAlert({ severity: 'INFO', zoneId: 'Z-03', message: '📡 Adaptive monitoring activated (15s interval)' });
    store.setAdaptiveSampling(true, 'S-05');
    
    // Update infrastructure status
    const infra = [...store.infrastructure];
    infra[0].impactStatus = 'Impacted'; // Settlement A
    infra[3].impactStatus = 'Watch';    // Haul road
    infra[6].impactStatus = 'Watch';    // Power line
    store.updateInfrastructure(infra);
    
    updateRiskZone(store, 'CRITICAL', 25.0, 3.5, day, 'HIGH');
  }
  else if (day > 32) {
    // Maintain critical state
    newDeformation = 25.0 + ((day - 32) * 1.0);
    newVelocity = 1.0;
    updateRiskZone(store, 'CRITICAL', newDeformation, newVelocity, day, 'HIGH');
  }

  // Update history
  if (day > 0) {
    store.addHistoricalData(day, newDeformation, newVelocity);
  }
}

function updateRiskZone(
  store: ReturnType<typeof useSimulationStore.getState>, 
  severity: RiskZone['severity'], 
  deformation: number, 
  velocity: number, 
  day: number,
  confidence: 'HIGH'|'MEDIUM'|'LOW'
) {
  const centerLat = 23.76;
  const centerLng = 86.43;
  
  const zone: RiskZone = {
    id: 'Z-03',
    severity,
    deformation: parseFloat(deformation.toFixed(2)),
    velocity: parseFloat(velocity.toFixed(2)),
    acceleration: parseFloat((velocity * 0.1).toFixed(2)), // mock acceleration
    persistence: day,
    confidence,
    affectedSensors: ['S-05', 'S-06', 'S-07', 'S-08'],
    affectedAssets: ['INF-1', 'INF-4', 'INF-7'],
    lat: centerLat,
    lng: centerLng,
    radius: 500, // 500m radius
    reasons: [
      'DEFORMATION_INCREASING',
      ...(velocity > 1.0 ? ['VELOCITY_ACCELERATING'] : []),
      ...(day > 7 ? ['PERSISTENT_PATTERN'] : []),
      'SPATIAL_CLUSTER',
      ...(day >= 31 ? ['SATELLITE_CONFIRMED'] : []),
      'ACTIVE_PANEL_OVERLAY'
    ]
  };
  
  store.updateRiskZones([zone]);
  
  // Correlate sensor data
  const sensors = [...store.sensors];
  sensors.forEach(s => {
    if (zone.affectedSensors.includes(s.id)) {
      s.displacement = deformation * (0.8 + Math.random() * 0.4);
      s.tilt = (deformation / 10) * (0.8 + Math.random() * 0.4);
      s.status = severity === 'CRITICAL' ? 'Warning' : severity === 'WARNING' ? 'Watch' : 'Healthy';
    }
  });
  store.updateSensors(sensors);
}
