export type PageId = 'dashboard' | 'telemetry' | 'sensors' | 'alerts' | 'prediction' | 'history' | 'reports' | 'users' | 'settings';

export interface SensorItem {
  id: string;
  name: string;
  category: 'temperature' | 'pressure' | 'energy' | 'comms' | 'radiation' | 'custom';
  value: number;
  unit: string;
  status: 'nominal' | 'warning' | 'critical';
  trend: 'stable' | 'up' | 'down' | 'fluctuating';
  trendLabel: string;
  lastRead: string;
  location: string;
}

export interface MissionEvent {
  id: string;
  timestamp: string;
  event: string;
  system: 'TCS' | 'EPS' | 'C&DH' | 'Comms' | 'ECLSS' | 'ADCS';
  severity: 'nominal' | 'warning' | 'critical';
  operator: string;
}

export interface Operator {
  id: string;
  name: string;
  email: string;
  role: string;
  clearance: number;
  status: 'active' | 'offline' | 'suspended';
  mfaEnabled: boolean;
}
