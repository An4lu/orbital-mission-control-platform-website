import { SensorItem, MissionEvent, Operator } from './types';

export const INITIAL_SENSORS: SensorItem[] = [
  {
    id: 't-1',
    name: 'Sensor de Temperatura',
    category: 'temperature',
    value: 22.4,
    unit: '°C',
    status: 'nominal',
    trend: 'stable',
    trendLabel: 'Estável',
    lastRead: '2ms atrás',
    location: 'THERMAL ARRAY A'
  },
  {
    id: 'p-1',
    name: 'Sensor de Pressão',
    category: 'pressure',
    value: 101.3,
    unit: 'kPa',
    status: 'nominal',
    trend: 'up',
    trendLabel: '+0.2% / hr',
    lastRead: '5ms atrás',
    location: 'CABIN INTERNAL'
  },
  {
    id: 'e-1',
    name: 'Sensor de Energia',
    category: 'energy',
    value: 88.5,
    unit: '%',
    status: 'warning',
    trend: 'fluctuating',
    trendLabel: 'Ruptura detectada',
    lastRead: '1ms atrás',
    location: 'MAIN GRID LOAD'
  },
  {
    id: 'c-1',
    name: 'Sensor de Comunicação',
    category: 'comms',
    value: 2.4,
    unit: 'Gbps',
    status: 'nominal',
    trend: 'stable',
    trendLabel: 'Conexão estável',
    lastRead: '12ms atrás',
    location: 'UPLINK BANDWIDTH'
  },
  {
    id: 'r-1',
    name: 'Sensor de Radiação',
    category: 'radiation',
    value: 0.14,
    unit: 'mSv/h',
    status: 'nominal',
    trend: 'down',
    trendLabel: 'Decrescente',
    lastRead: '8ms atrás',
    location: 'EXTERNAL SHIELDING'
  }
];

export const MISSION_EVENTS: MissionEvent[] = [
  {
    id: 'e-101',
    timestamp: '2026-06-09T08:14:02Z',
    event: 'Anomalia Térmica no Radiador Principal',
    system: 'TCS',
    severity: 'critical',
    operator: 'SYS_AUTO'
  },
  {
    id: 'e-102',
    timestamp: '2026-06-09T08:12:33Z',
    event: 'Taxa de descarga elevada no banco de baterias C',
    system: 'EPS',
    severity: 'warning',
    operator: 'OPR_04 (Silva)'
  },
  {
    id: 'e-103',
    timestamp: '2026-06-09T08:05:00Z',
    event: 'Autenticação de telemetria concluída com sucesso',
    system: 'C&DH',
    severity: 'nominal',
    operator: 'SYS_AUTO'
  },
  {
    id: 'e-104',
    timestamp: '2026-06-09T07:58:12Z',
    event: 'Ajuste de apontamento de antena de alto ganho',
    system: 'Comms',
    severity: 'nominal',
    operator: 'OPR_02 (Chen)'
  },
  {
    id: 'e-105',
    timestamp: '2026-06-09T07:42:45Z',
    event: 'Ruptura menor detectada no atuador solar',
    system: 'EPS',
    severity: 'warning',
    operator: 'SYS_AUTO'
  },
  {
    id: 'e-106',
    timestamp: '2026-06-09T07:15:00Z',
    event: 'Calibração rotineira de sensores ECLSS terminada',
    system: 'ECLSS',
    severity: 'nominal',
    operator: 'OPR_01 (Gomez)'
  },
  {
    id: 'e-107',
    timestamp: '2026-06-09T06:30:10Z',
    event: 'Ajuste orbital de altitude do propulsor RCS',
    system: 'ADCS',
    severity: 'nominal',
    operator: 'OPR_03 (Kovalev)'
  }
];

export const INITIAL_OPERATORS: Operator[] = [
  {
    id: 'op-1',
    name: 'Ana Silva',
    email: 'agent.name@omcp.gov',
    role: 'Diretora de Operações',
    clearance: 4,
    status: 'active',
    mfaEnabled: true
  },
  {
    id: 'op-2',
    name: 'Sarah Chen',
    email: 's.chen@omcp.gov',
    role: 'Engenheira de Comunicação',
    clearance: 3,
    status: 'active',
    mfaEnabled: true
  },
  {
    id: 'op-3',
    name: 'Dimitri Kovalev',
    email: 'd.kovalev@omcp.gov',
    role: 'Especialista de Propulsão',
    clearance: 3,
    status: 'offline',
    mfaEnabled: true
  },
  {
    id: 'op-4',
    name: 'Carlos Gomez',
    email: 'c.gomez@omcp.gov',
    role: 'Suporte de Vida (ECLSS)',
    clearance: 2,
    status: 'active',
    mfaEnabled: false
  }
];
