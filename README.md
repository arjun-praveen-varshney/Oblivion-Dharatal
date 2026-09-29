# DHARATAL — Mine Subsidence Intelligence & Early Warning Network

**SIH26025 — Software Simulation & POC**

This project is a high-fidelity software prototype demonstrating how a low-cost distributed surface sensor network can continuously monitor deformation above underground coal-mining areas. It combines ground observations with satellite-derived deformation trends and mine/GIS context to detect anomalies, estimate progression, identify potentially affected infrastructure, and generate early warnings.

## Product Value Proposition

"Don't wait for the ground to fail. Detect how it is changing."

DHARATAL transforms scattered ground observations into location-specific subsidence intelligence. The three major differentiators are:
1. **Multi-Source Fusion:** Ground sensors + satellite deformation (InSAR) + mine/GIS context.
2. **Progression Intelligence:** Tracks magnitude, velocity, acceleration, persistence, and spatial spread.
3. **Impact-Aware Warning:** Determines which infrastructure or populated areas may be affected.

## Technology Stack

- **Frontend:** React, TypeScript, Vite
- **UI Framework:** Tailwind CSS, custom shadcn-like components
- **Map / GIS:** React Leaflet (MapLibre alternative)
- **Charts:** Recharts
- **State Management:** Zustand
- **Icons:** Lucide React

*Note: No backend is required for this prototype. It uses a deterministic simulation engine.*

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation & Setup

1. Clone or navigate to the repository directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:5173`.

## Architecture & Simulation Engine

This prototype uses a deterministic state machine rather than randomized or black-box AI models, ensuring that demonstrations are repeatable, explainable, and realistic.

### Core Modules:

- **`src/simulation/simulationEngine.ts`**: The core loop that steps through simulation days.
- **`src/simulation/mockData.ts`**: Initial mock states for fictional Jharia coalfield geometry, sensors, and infrastructure.
- **`src/store/useSimulationStore.ts`**: The Zustand store managing global application state, handling time ticks, alerts, and historical data.

### Demo Scenarios

The dashboard includes a **DEMO SCENARIOS** collapsible panel (bottom left).
The main scripted sequence is the **"Full Subsidence Scenario"**, which takes the network through the following states:

1. `NORMAL` - Stable baseline monitoring.
2. `ANOMALY_DETECTED` - Minor early deformation begins.
3. `PERSISTENT_ANOMALY` - Movement continues, neighboring sensors show correlation.
4. `ACCELERATING` - Deformation velocity increases.
5. `WARNING` - High risk zone established.
6. `HIGH_RISK` (Satellite Confirmation) - Sentinel-1 InSAR confirms displacement.
7. `EARLY_WARNING` - Infrastructure impact analysis triggers field inspection alerts, and adaptive sensor sampling is activated.

### Judge Mode

Enable **Judge Mode** via the Demo Scenarios panel to optimize the layout for evaluation. This mode enlarges the primary risk map and progression intelligence panels, making the core multi-source fusion and spatial risk data easier to present on screen without narration.

## Future Path to Production

This architecture is designed so that the simulation modules can later be replaced by real IoT APIs and WebSockets.
- Replace `simulationEngine.ts` with WebSocket subscriptions to a LoRa Gateway / MQTT broker.
- Replace `mockData.ts` with dynamic GeoJSON fetched from a backend spatial database (e.g., PostGIS).
- Keep the `Progression Intelligence` logic, but wire it to live Python/NumPy analytical backend services for real threshold calculations.
