import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SensorItem } from '../types';
import { INITIAL_SENSORS } from '../data';
import { 
  Thermometer, 
  Gauge, 
  Zap, 
  Satellite, 
  ShieldAlert, 
  Plus, 
  Compass, 
  Loader2, 
  Trash2,
  ListRestart
} from 'lucide-react';

export default function SensorsView() {
  const [sensors, setSensors] = useState<SensorItem[]>(INITIAL_SENSORS);
  const [isDiagnosticsLoading, setIsDiagnosticsLoading] = useState(false);
  const [showDeployModal, setShowDeployModal] = useState(false);
  
  // Deploy State
  const [newSensorName, setNewSensorName] = useState('');
  const [newSensorType, setNewSensorType] = useState<SensorItem['category']>('temperature');
  const [newSensorVal, setNewSensorVal] = useState('');
  const [newSensorLocation, setNewSensorLocation] = useState('');

  // Diagnostic process simulator
  const handleRunDiagnostics = () => {
    setIsDiagnosticsLoading(true);
    setTimeout(() => {
      setIsDiagnosticsLoading(false);
      setSensors((prev) => 
        prev.map((s) => {
          let randomInc = (Math.random() - 0.5) * (s.category === 'temperature' ? 1.5 : s.category === 'pressure' ? 3 : 0.05);
          let newVal = Number((s.value + randomInc).toFixed(2));
          let newStatus: SensorItem['status'] = 'nominal';
          
          if (s.category === 'energy' && newVal > 85) newStatus = 'warning';
          if (s.id === 'e-1') newVal = 88.5; // lock warning value from mockup unless adjusted
          
          return {
            ...s,
            value: newVal,
            lastRead: 'Recém lido',
            status: newStatus
          };
        })
      );
    }, 1200);
  };

  // Deploy newly entered sensor card
  const submitNewSensor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSensorName || !newSensorVal) return;

    const valNum = parseFloat(newSensorVal) || 0;
    const unitMap = {
      temperature: '°C',
      pressure: 'kPa',
      energy: '%',
      comms: 'Gbps',
      radiation: 'mSv/h',
      custom: 'pts'
    };

    const newSensor: SensorItem = {
      id: `custom-${Date.now()}`,
      name: newSensorName,
      category: newSensorType,
      value: valNum,
      unit: unitMap[newSensorType],
      status: valNum > 90 ? 'critical' : valNum > 70 ? 'warning' : 'nominal',
      trend: 'stable',
      trendLabel: 'Estável',
      lastRead: '2ms atrás',
      location: newSensorLocation.toUpperCase() || 'AUX_MODULE_F'
    };

    setSensors((prev) => [...prev, newSensor]);
    setShowDeployModal(false);
    
    // Clear State
    setNewSensorName('');
    setNewSensorVal('');
    setNewSensorLocation('');
  };

  // Remove deployed sensor
  const removeSensor = (id: string) => {
    setSensors((prev) => prev.filter((s) => s.id !== id));
  };

  // Slider change to dynamically change sensor parameters
  const updateSensorVal = (id: string, newVal: number) => {
    setSensors((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        let finalStatus: SensorItem['status'] = 'nominal';
        if (s.category === 'energy') {
          if (newVal > 90) finalStatus = 'critical';
          else if (newVal > 80) finalStatus = 'warning';
        } else {
          if (newVal > s.value * 1.5) finalStatus = 'critical';
          else if (newVal > s.value * 1.25) finalStatus = 'warning';
        }
        return {
          ...s,
          value: Number(newVal.toFixed(1)),
          status: finalStatus
        };
      })
    );
  };

  // Icon picking utility
  const getCategoryIcon = (cat: SensorItem['category']) => {
    switch (cat) {
      case 'temperature': return <Thermometer className="w-5 h-5 text-primary" />;
      case 'pressure': return <Gauge className="w-5 h-5 text-secondary" />;
      case 'energy': return <Zap className="w-5 h-5 text-error" />;
      case 'comms': return <Satellite className="w-5 h-5 text-[#68d3ff]" />;
      case 'radiation': return <ShieldAlert className="w-5 h-5 text-[#ffdad6]" />;
      default: return <Compass className="w-5 h-5 text-white" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in relative">
      {/* Sensors Header details */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h2 className="font-display font-bold text-lg text-white">Sensor Telemetry Array</h2>
          <p className="text-xs text-on-surface-variant font-sans">
            Real-time monitoring of critical mission hardware.
          </p>
        </div>

        {/* Buttons trigger */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleRunDiagnostics}
            disabled={isDiagnosticsLoading}
            className="box-border bg-[#161c20] hover:bg-[#1a2024] text-white hover:text-primary font-mono tracking-wider font-bold text-[11px] uppercase border border-[#3c484f] rounded px-4 py-2.5 flex items-center gap-2 cursor-pointer disabled:opacity-55"
          >
            {isDiagnosticsLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                <span>Diagnosticando...</span>
              </>
            ) : (
              <>
                <ListRestart className="w-3.5 h-3.5" />
                <span>Run Diagnostics</span>
              </>
            )}
          </button>

          <button
            onClick={() => setShowDeployModal(true)}
            className="box-border bg-primary-container hover:bg-primary text-black font-mono tracking-wider font-bold text-[11px] uppercase rounded px-4 py-2.5 flex items-center gap-2 cursor-pointer shadow-md shadow-primary-container/10"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3px]" />
            <span>Deploy New Sensor</span>
          </button>
        </div>
      </div>

      {/* Grid containing cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence initial={false}>
          {sensors.map((s) => {
            const isCritical = s.status === 'critical';
            const isWarning = s.status === 'warning';
            
            return (
              <motion.div
                key={s.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, y: 15 }}
                className={`glass-panel rounded-xl p-5 border relative overflow-hidden flex flex-col justify-between group transition-all duration-300 ${
                  isCritical 
                    ? 'border-error bg-[#93000a]/10 critical-pulse' 
                    : isWarning 
                      ? 'border-error/50 bg-[#93000a]/5' 
                      : 'border-outline-variant/30 hover:border-primary/40'
                }`}
              >
                {/* Upper banner: Name & Status Chip */}
                <div>
                  <div className="flex items-start justify-between gap-2 mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-lg border ${
                        isCritical 
                          ? 'bg-[#93000a]/20 border-error/50' 
                          : 'bg-surface-dim/70 border-outline-variant/20'
                      }`}>
                        {getCategoryIcon(s.category)}
                      </div>
                      
                      <div>
                        <h4 className="text-xs font-semibold text-white tracking-wide block leading-tight">
                          {s.name}
                        </h4>
                        <span className="text-[10px] font-mono text-on-surface-variant block uppercase tracking-wider">
                          {s.location}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`px-2 py-0.5 rounded-sm font-mono text-[9px] font-bold uppercase ${
                        isCritical 
                          ? 'bg-error/20 text-error border border-error/30' 
                          : isWarning 
                            ? 'bg-error/15 text-error border border-error/25' 
                            : 'bg-primary-container/10 text-primary-container border border-primary-container/20'
                      }`}>
                        {s.status === 'nominal' ? 'NOMINAL' : s.status === 'warning' ? 'AVISO' : 'CRÍTICO'}
                      </span>

                      {/* Manual delete for customizable cards */}
                      {s.id.startsWith('custom-') && (
                        <button 
                          onClick={() => removeSensor(s.id)}
                          className="p-1 rounded text-outline hover:text-error hover:bg-error-container/20 transition-colors"
                          title="Remover sensor"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* High Density Metric visualizer */}
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className={`text-[36px] font-display font-extrabold tracking-tight ${
                      isCritical ? 'text-error' : 'text-white'
                    }`}>
                      {s.value}
                    </span>
                    <span className="text-sm font-mono text-on-surface-variant font-medium">
                      {s.unit}
                    </span>
                  </div>
                </div>

                {/* Lower indicators - Interactive Slider element to allow changing parameters live */}
                <div className="space-y-4 pt-3 border-t border-outline-variant/30">
                  {/* Slider adjuster */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[10px] font-mono text-on-surface-variant">
                      <span>Simulador de Entrada (Mudar valor)</span>
                      <span>Max</span>
                    </div>
                    <input 
                      type="range"
                      min={s.value > 100 ? 50 : 0}
                      max={s.value > 100 ? 250 : 120}
                      value={s.value}
                      step={s.category === 'radiation' ? '0.01' : '1'}
                      onChange={(e) => updateSensorVal(s.id, parseFloat(e.target.value))}
                      className="w-full accent-primary h-1 bg-surface-dim rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  <div className="flex justify-between items-center text-[10px] font-mono text-on-surface-variant">
                    <span className="flex items-center gap-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${s.trend === 'up' ? 'bg-[#ffb4ab]' : 'bg-primary'}`} />
                      {s.trendLabel}
                    </span>
                    <span>Última leitura: {s.lastRead}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}

          {/* Prompt deployment button outline card */}
          <motion.button
            layout
            onClick={() => setShowDeployModal(true)}
            className="border-2 border-dashed border-outline-variant/40 hover:border-primary/50 bg-transparent rounded-xl p-6 flex flex-col justify-center items-center gap-3 text-on-surface-variant hover:text-white transition-all cursor-pointer min-h-[190px]"
          >
            <div className="p-3 rounded-full bg-surface-container border border-outline-variant/35 text-on-surface-variant">
              <Plus className="w-6 h-6" />
            </div>
            <span className="text-xs font-mono font-bold tracking-wider uppercase">Deploy New Sensor</span>
          </motion.button>
        </AnimatePresence>
      </div>

      {/* Deploy popup modal */}
      {showDeployModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-surface-container rounded-xl p-6 border border-outline-variant shadow-2xl glass-panel relative"
          >
            <h3 className="font-display font-bold text-md text-white mb-4 uppercase tracking-wide">
              Deploy Mission telemetry sensor
            </h3>

            <form onSubmit={submitNewSensor} className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono tracking-wider text-on-surface-variant uppercase mb-1">
                  Nome do Sensor
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="ex: Sensor de O2, Tubulador Térmico" 
                  value={newSensorName}
                  onChange={(e) => setNewSensorName(e.target.value)}
                  className="w-full bg-surface-dim border border-outline-variant rounded px-3 py-2 text-sm text-white font-sans focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono tracking-wider text-on-surface-variant uppercase mb-1">
                    Categoria
                  </label>
                  <select
                    value={newSensorType}
                    onChange={(e) => setNewSensorType(e.target.value as any)}
                    className="w-full bg-surface-dim border border-outline-variant rounded px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  >
                    <option value="temperature">Temperatura (°C)</option>
                    <option value="pressure">Pressão (kPa)</option>
                    <option value="energy">Consumo (%)</option>
                    <option value="comms">Comunicação (Gbps)</option>
                    <option value="radiation">Radiação (mSv/h)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-mono tracking-wider text-on-surface-variant uppercase mb-1">
                    Valor Inicial
                  </label>
                  <input 
                    type="number" 
                    required
                    step="0.1"
                    placeholder="ex: 22.4" 
                    value={newSensorVal}
                    onChange={(e) => setNewSensorVal(e.target.value)}
                    className="w-full bg-surface-dim border border-outline-variant rounded px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono tracking-wider text-on-surface-variant uppercase mb-1">
                  Mapeamento de Localização (Seção)
                </label>
                <input 
                  type="text" 
                  placeholder="ex: TCS-GRID-B, CABIN INTERNAL" 
                  value={newSensorLocation}
                  onChange={(e) => setNewSensorLocation(e.target.value)}
                  className="w-full bg-surface-dim border border-outline-variant rounded px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant/30">
                <button
                  type="button"
                  onClick={() => setShowDeployModal(false)}
                  className="px-4 py-2 border border-outline-variant rounded text-xs font-mono text-on-surface hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-container text-black font-mono font-bold text-xs rounded hover:bg-primary"
                >
                  Confirmar Deployment
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
