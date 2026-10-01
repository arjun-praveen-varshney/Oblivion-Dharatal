import './index.css';
import { useStore } from './store';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { SimulationControls } from './components/SimulationControls';
import { OverviewPage } from './pages/OverviewPage';
import { RiskMapPage } from './pages/RiskMapPage';
import { SensorNetworkPage } from './pages/SensorNetworkPage';
import { DeformationTrendsPage } from './pages/DeformationTrendsPage';
import { InSARPage } from './pages/InSARPage';
import { AlertsPage } from './pages/AlertsPage';
import { SystemHealthPage } from './pages/SystemHealthPage';

function App() {
  const { currentPage } = useStore();

  const renderPage = () => {
    switch (currentPage) {
      case 'overview':          return <OverviewPage />;
      case 'risk-map':          return <RiskMapPage />;
      case 'sensor-network':    return <SensorNetworkPage />;
      case 'deformation-trends':return <DeformationTrendsPage />;
      case 'insar':             return <InSARPage />;
      case 'alerts':            return <AlertsPage />;
      case 'system-health':     return <SystemHealthPage />;
      default:                  return <OverviewPage />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <Header />
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        <Sidebar />
        <main style={{ flex: 1, minWidth: 0, overflow: 'hidden', background: 'var(--color-bg)' }}>
          {renderPage()}
        </main>
      </div>
      <SimulationControls />
    </div>
  );
}

export default App;
