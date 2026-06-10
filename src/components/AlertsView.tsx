import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, CheckCircle, ShieldAlert, Cpu, Bell, VolumeX } from 'lucide-react';

interface AlertItem {
  id: string;
  source: string;
  anomaly: string;
  system: string;
  time: string;
  severity: 'critical' | 'warning';
}

export default function AlertsView() {
  const [alerts, setAlerts] = useState<AlertItem[]>([
    { id: 'al-1', source: 'Radiador de Dissipação Térmica', anomaly: 'Temperatura de pico excede margem de tolerância (+88.5°C)', system: 'TCS', time: '12s atrás', severity: 'critical' },
    { id: 'al-2', source: 'Barramento de Baterias Principal C', anomaly: 'Flutuação de amperagem de dreno fora do padrão de flutuação', system: 'EPS', time: '5m atrás', severity: 'warning' },
    { id: 'al-3', source: 'Antena de Alto Ganho B2', anomaly: 'Queda na atenuação de sinal de uplink orbital (Beta angle lag)', system: 'Comms', time: '14m atrás', severity: 'warning' }
  ]);

  const [muteSound, setMuteSound] = useState(false);

  const resolveAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="border-b border-outline-variant pb-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h2 className="font-display font-bold text-lg text-white">Centro de Alertas de Anomalia</h2>
          <p className="text-xs text-on-surface-variant font-sans">
            Central de priorização de anomalias detectadas em sistemas críticos da estação orbital.
          </p>
        </div>

        <button
          onClick={() => {
            setMuteSound(!muteSound);
            alert(muteSound ? 'Alarmes audíveis habilitados.' : 'Alarmes audíveis do terminal silenciados.');
          }}
          className={`flex items-center gap-2 px-4 py-2 border rounded font-mono text-xs font-bold uppercase transition ${
            muteSound 
              ? 'border-error/50 bg-[#93000a]/10 text-error' 
              : 'border-outline-variant hover:text-white'
          }`}
        >
          <VolumeX className="w-4 h-4" />
          <span>{muteSound ? 'Alarmes Silenciados' : 'Silenciar Alarmes'}</span>
        </button>
      </div>

      <div className="space-y-4">
        <AnimatePresence initial={false}>
          {alerts.length > 0 ? (
            alerts.map((a) => {
              const rectGlow = a.severity === 'critical' ? 'border-error bg-[#93000a]/10' : 'border-[#ffb4ab]/40 bg-[#ffb4ab]/5';
              return (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 100 }}
                  className={`glass-panel border rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden ${rectGlow}`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl ${
                      a.severity === 'critical' ? 'bg-[#93000a]/20 text-error' : 'bg-[#ffb4ab]/10 text-[#ffb4ab]'
                    }`}>
                      <AlertTriangle className="w-6 h-6 animate-pulse" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-mono tracking-wider font-extrabold uppercase px-1.5 py-0.5 rounded bg-surface-dim/70 text-white">
                          SISTEMA: {a.system}
                        </span>
                        <span className="text-xs font-mono text-on-surface-variant">• Detectado: {a.time}</span>
                      </div>
                      
                      <h4 className="text-sm font-semibold text-white leading-tight">
                        {a.source}
                      </h4>
                      <p className="text-xs text-on-surface-variant font-sans leading-relaxed">
                        {a.anomaly}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      resolveAlert(a.id);
                      alert(`Anomalia [${a.system}] declarada como resolvida e descartada.`);
                    }}
                    className="box-border px-4 py-2 bg-surface-dim hover:bg-surface-variant border border-outline-variant rounded font-mono text-xs font-bold text-white uppercase hover:text-primary transition shrink-0 cursor-pointer text-center"
                  >
                    Marcar como Resolvido
                  </button>
                </motion.div>
              );
            })
          ) : (
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="glass-panel border border-outline-variant/30 rounded-xl p-12 text-center text-on-surface-variant space-y-3"
            >
              <div className="inline-flex p-4 rounded-full bg-primary-container/10 border border-primary-container/20 text-primary-container mb-2">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h3 className="font-display font-medium text-white text-md uppercase">Nenhum Alerta Ativo</h3>
              <p className="text-xs font-sans max-w-sm mx-auto">
                Todos os subsistemas de telemetria analógica e barramentos de energia encontram-se operantes sob margens aceitáveis.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
