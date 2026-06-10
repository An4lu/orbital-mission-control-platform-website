import { useState } from 'react';
import { motion } from 'motion/react';
import { Settings, ShieldAlert, Cpu, Database, Save, Activity, RefreshCw } from 'lucide-react';

export default function SettingsView() {
  const [telemetryFrequency, setTelemetryFrequency] = useState(2);
  const [recalibrationActive, setRecalibrationActive] = useState(false);
  const [securityOverride, setSecurityOverride] = useState(false);

  const triggerSolarFlareSim = () => {
    setRecalibrationActive(true);
    setTimeout(() => {
      setRecalibrationActive(false);
      alert('SIMULAÇÃO REGISTRADA: Tempestade estelar artificial injetada no barramento secundário. Verifique os painéis de Alertas e Sensores para conferir a flutuação!');
    }, 1200);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="border-b border-outline-variant pb-5">
        <h2 className="font-display font-bold text-lg text-white">Configurações de Controle</h2>
        <p className="text-xs text-on-surface-variant font-sans">
          Administração de limiares de alarme analógico e parâmetros de sincronização orbital da OMCP.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          {/* Section 1: Telemetry sampling */}
          <div className="glass-panel border border-outline-variant/30 rounded-xl p-5 space-y-4">
            <h3 className="text-xs font-mono tracking-wider text-white uppercase font-bold flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              Taxa de Varredura de Telemetria
            </h3>
            
            <div className="space-y-4 font-mono text-xs text-on-surface-variant">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Sincronização de ondas (Frequência local)</span>
                  <span className="text-white font-bold">{telemetryFrequency}s</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="10" 
                  value={telemetryFrequency}
                  onChange={(e) => setTelemetryFrequency(parseInt(e.target.value))}
                  className="w-full accent-primary h-1 bg-surface-dim rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <p className="text-[10px] leading-relaxed">
                Varreduras mais velozes demandam largura de banda cumulativa, porém conferem menor latência aos modelos de IA preditiva ao estimar anomalias na matriz de risco.
              </p>
            </div>
          </div>

          {/* Section 2: Command Overrides */}
          <div className="glass-panel border border-outline-variant/30 rounded-xl p-5 space-y-4">
            <h3 className="text-xs font-mono tracking-wider text-white uppercase font-bold flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-error" />
              Liberação de Vetor de Segurança
            </h3>
            
            <div className="space-y-4 font-sans text-xs text-on-surface-variant">
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <h4 className="text-white font-semibold">Desvio Operacional Manual (Override)</h4>
                  <p className="text-[10px] text-on-surface-variant leading-relaxed">
                    Habilita ajuste direto em campo para sensores nominais fora do perímetro da rede de controle.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setSecurityOverride(!securityOverride);
                    alert(securityOverride ? 'Override desabilitado.' : 'Override de segurança habilitado.');
                  }}
                  className={`px-3 py-1.5 rounded font-mono text-[10px] tracking-wider font-extrabold uppercase border ${
                    securityOverride 
                      ? 'bg-error/15 border-error text-error' 
                      : 'border-outline-variant/60 text-on-surface hover:text-white'
                  }`}
                >
                  {securityOverride ? 'Habilitado' : 'Desabilitado'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Diagnostic side injector panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-panel border border-error bg-[#93000a]/10 rounded-xl p-5 space-y-4">
            <h3 className="text-xs font-mono tracking-wider text-error uppercase font-bold flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 animate-pulse" />
              Injetor de Anomalias (Simulador)
            </h3>

            <p className="text-xs font-sans text-on-surface-variant leading-relaxed">
              Inicie um evento de tempestade magnética solar ou radiação para validar a assertividade de descarte automotivo e os alarmes de prioridade preditiva do sistema.
            </p>

            <button
              onClick={triggerSolarFlareSim}
              disabled={recalibrationActive}
              className="w-full py-2.5 bg-error text-on-error font-mono font-bold text-xs rounded hover:bg-opacity-90 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {recalibrationActive ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Gerando radiação...</span>
                </>
              ) : (
                <>
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Simular Tempestade Solar</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
