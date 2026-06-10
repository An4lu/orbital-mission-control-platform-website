import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PageId } from './types';

// Page Views
import LoginScreen from './components/LoginScreen';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import DashboardView from './components/DashboardView';
import TelemetryView from './components/TelemetryView';
import SensorsView from './components/SensorsView';
import PredictionView from './components/PredictionView';
import ReportsView from './components/ReportsView';
import AlertsView from './components/AlertsView';
import UsersView from './components/UsersView';
import SettingsView from './components/SettingsView';

export default function App() {
  const [operatorEmail, setOperatorEmail] = useState<string | null>(null);
  const [activePage, setActivePage] = useState<PageId>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [footerTime, setFooterTime] = useState('14:22:05');

  // Sync the footer clocks in real time
  useEffect(() => {
    const clockTimer = setInterval(() => {
      const now = new Date();
      setFooterTime(now.toISOString().substring(11, 19));
    }, 1000);
    return () => clearInterval(clockTimer);
  }, []);

  const handleLogout = () => {
    setOperatorEmail(null);
    setActivePage('dashboard');
  };

  // Switcher for section header names
  const getSectionTitle = () => {
    switch (activePage) {
      case 'dashboard': return 'Mission Control Operations - Overview';
      case 'telemetry': return 'Mission Control Operations - Telemetry Channels';
      case 'sensors': return 'Mission Control Operations - Sensors Array';
      case 'alerts': return 'Mission Control Operations - Active Alerts';
      case 'prediction': return 'Mission Control Operations - Predictive Modeling (AI)';
      case 'reports': return 'Mission Control Operations - Reports & History Log';
      case 'users': return 'Mission Control Operations - Operator Management';
      case 'settings': return 'Mission Control Operations - Station Decalibrations';
      default: return 'Mission Control Operations';
    }
  };

  const renderActiveView = () => {
    switch (activePage) {
      case 'dashboard': return <DashboardView />;
      case 'telemetry': return <TelemetryView />;
      case 'sensors': return <SensorsView />;
      case 'alerts': return <AlertsView />;
      case 'prediction': return <PredictionView />;
      case 'reports': return <ReportsView />;
      case 'users': return <UsersView />;
      case 'settings': return <SettingsView />;
      default: return <DashboardView />;
    }
  };

  // If not logged in, render the login portal
  if (!operatorEmail) {
    return <LoginScreen onLoginSuccess={(email) => setOperatorEmail(email)} />;
  }

  return (
    <div className="min-h-screen w-screen bg-surface-dim text-on-surface flex font-sans overflow-hidden">
      
      {/* Sidebar - Desktop Layout style */}
      <div className="hidden md:block shrink-0">
        <Sidebar 
          activePage={activePage} 
          onPageChange={setActivePage} 
          onLogout={handleLogout}
          operatorEmail={operatorEmail}
        />
      </div>

      {/* Sidebar Drawer - Mobile Responsive overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Backdrop layer with blur */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 md:hidden"
            />
            
            {/* Sliding navigation side panel */}
            <motion.div 
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed inset-y-0 left-0 z-50 md:hidden"
            >
              <Sidebar 
                activePage={activePage} 
                onPageChange={setActivePage} 
                onLogout={handleLogout}
                onCloseMobile={() => setSidebarOpen(false)}
                operatorEmail={operatorEmail}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Terminal Frame Layout */}
      <div className="flex-1 flex flex-col min-h-screen relative overflow-hidden">
        {/* Navigation Headboard */}
        <TopBar 
          onMenuToggle={() => setSidebarOpen(true)} 
          title={getSectionTitle()} 
        />

        {/* Dashboard workspace Container */}
        <main className="flex-1 mt-16 mb-8 p-6 overflow-y-auto bg-surface-dim data-grid-bg">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePage}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="w-full max-w-7xl mx-auto h-full"
            >
              {renderActiveView()}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Dynamic Space Force Status Footer */}
        <footer className="fixed bottom-0 right-0 w-full md:w-[calc(100%-280px)] h-8 bg-[#090f12] border-t border-outline-variant flex items-center justify-between px-6 uppercase tracking-wider z-40 select-none text-[8.5px] sm:text-[10px] font-mono text-on-surface-variant">
          <div className="flex items-center gap-1.5 font-bold">
            <span className="text-primary tracking-widest">Orbital Mission Control Platform</span>
            <span>|</span>
            <span className="text-on-surface-variant font-medium">System Health:</span>
            <span className="text-primary-container">Operational</span>
          </div>
          
          <div className="flex items-center gap-4 sm:gap-6 font-semibold">
            <span>UTC: <b className="text-white">{footerTime}</b></span>
            <span className="hidden sm:inline">Telemetry: <b className="text-primary-container">Nominal</b></span>
            <span>Signal: <b className="text-[#68d3ff]">Strong</b></span>
          </div>
        </footer>
      </div>

    </div>
  );
}

