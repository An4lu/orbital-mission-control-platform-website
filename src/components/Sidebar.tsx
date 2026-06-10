import { PageId } from '../types';
import { 
  LayoutDashboard, 
  Activity, 
  Cpu, 
  AlertTriangle, 
  BrainCircuit, 
  History, 
  FileText, 
  Users, 
  Settings,
  X,
  Orbit
} from 'lucide-react';
import { motion } from 'motion/react';

interface SidebarProps {
  activePage: PageId;
  onPageChange: (pageId: PageId) => void;
  onLogout: () => void;
  onCloseMobile?: () => void;
  operatorEmail: string;
}

export default function Sidebar({ activePage, onPageChange, onLogout, onCloseMobile, operatorEmail }: SidebarProps) {
  interface MenuItem {
    id: PageId;
    label: string;
    icon: any;
    badge?: number;
    priority?: boolean;
  }

  const menuItems: MenuItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'telemetry', label: 'Telemetry', icon: Activity },
    { id: 'sensors', label: 'Sensors', icon: Cpu },
    { id: 'alerts', label: 'Alerts', icon: AlertTriangle, badge: 3 },
    { id: 'prediction', label: 'Prediction', icon: BrainCircuit, priority: true },
    { id: 'history', label: 'History', icon: History },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'users', label: 'Users', icon: Users },
  ];

  return (
    <aside className="w-[280px] bg-surface-container border-r border-outline-variant flex flex-col h-full py-6 select-none relative z-50">
      {/* Header Brand */}
      <div className="px-6 pb-6 border-b border-outline-variant mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Orbit className="w-6 h-6 text-primary animate-spin" style={{ animationDuration: '10s' }} />
          <div>
            <h1 className="font-display text-lg font-bold text-white tracking-widest leading-none">OMCP</h1>
            <span className="text-[10px] font-mono text-primary/80 uppercase">v2.4 SECURE</span>
          </div>
        </div>

        {onCloseMobile && (
          <button 
            onClick={onCloseMobile}
            className="md:hidden p-1 rounded-md text-on-surface-variant hover:text-white hover:bg-surface-variant/40"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Main Navigation Menu */}
      <nav className="flex-1 overflow-y-auto px-2 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                onPageChange(item.id);
                if (onCloseMobile) onCloseMobile();
              }}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-lg transition-all focus:outline-none relative group cursor-pointer ${
                isActive 
                  ? 'text-primary bg-secondary-container/20 border-l-4 border-primary scale-[0.98]' 
                  : 'text-on-surface-variant hover:text-white hover:bg-surface-variant/30'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? 'text-primary' : 'text-on-surface-variant group-hover:text-white'}`} />
                <span className={`text-[13px] font-medium tracking-wide ${isActive ? 'font-semibold' : ''}`}>
                  {item.label}
                </span>
              </div>

              {/* Status Notifications or Badges */}
              {item.badge && (
                <span className="bg-error-container text-error text-[10px] font-mono px-1.5 py-0.5 rounded border border-error/20 font-bold">
                  {item.badge}
                </span>
              )}

              {item.id === 'prediction' && (
                <span className="w-1.5 h-1.5 rounded-full bg-error animate-ping mr-1" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Settings & User operator panel */}
      <div className="mt-auto px-4 pt-4 border-t border-outline-variant/60 space-y-3">
        <button
          onClick={() => {
            onPageChange('settings');
            if (onCloseMobile) onCloseMobile();
          }}
          className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-lg transition-all focus:outline-none ${
            activePage === 'settings'
              ? 'text-primary bg-secondary-container/20 border-l-4 border-primary'
              : 'text-on-surface-variant hover:text-white hover:bg-surface-variant/30'
          }`}
        >
          <Settings className="w-5 h-5" />
          <span className="text-[13px] font-medium tracking-wide">Settings</span>
        </button>

        {/* User identification */}
        <div className="p-3 bg-surface-container-low border border-outline-variant/30 rounded-lg flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-white truncate">Diretora Ana Silva</p>
            <p className="text-[9px] font-mono text-on-surface-variant truncate">{operatorEmail}</p>
          </div>
          <button 
            onClick={onLogout}
            title="Sair do terminal"
            className="p-1 rounded text-outline hover:text-error hover:bg-error-container/15 transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
}
