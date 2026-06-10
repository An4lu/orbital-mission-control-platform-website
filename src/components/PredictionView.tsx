import { useState } from 'react';
import { motion } from 'motion/react';
import { Bot, HelpCircle, ShieldAlert, Cpu, Calendar, CheckSquare } from 'lucide-react';

export default function PredictionView() {
  const [scheduledMaintenance, setScheduledMaintenance] = useState(false);

  const modules = [
    { title: 'Power Module', prob: 82, status: 'critical', desc: 'Degradação acelerada no regulador', color: 'text-error', border: 'border-error' },
    { title: 'Comm Module', prob: 15, status: 'nominal', desc: 'Instabilidade de link resolvida', color: 'text-primary-container', border: 'border-primary-container' },
    { title: 'Thermal Module', prob: 35, status: 'warning', desc: 'Acúmulo térmico no radiador C', color: 'text-[#ffb4ab]', border: 'border-[#ffb4ab]' },
    { title: 'Life Support', prob: 12, status: 'nominal', desc: 'Arrefecimento de oxigênio OK', color: 'text-primary-container', border: 'border-primary-container' },
  ] as const;

  return (
    <div className="space-y-6 animate-fade-in relative">
      {/* Upper header section */}
      <div className="border-b border-outline-variant pb-5 mb-3">
        <h2 className="font-display font-bold text-lg text-white">Análise Preditiva (IA)</h2>
        <p className="text-xs text-on-surface-variant font-sans max-w-3xl leading-relaxed">
          Probabilidades de falha e recomendações de manutenção preventiva baseadas em modelos de Machine Learning.
        </p>
      </div>

      {/* Probabilities Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {modules.map((m) => {
          const isCritical = m.status === 'critical';
          const isWarning = m.status === 'warning';
          
          return (
            <motion.div
              key={m.title}
              whileHover={{ y: -3 }}
              className={`glass-panel rounded-xl p-5 border relative overflow-hidden flex flex-col justify-between h-44 ${
                isCritical 
                  ? 'border-error bg-[#93000a]/10 critical-pulse' 
                  : isWarning 
                    ? 'border-error/40 bg-[#ffb4ab]/5' 
                    : 'border-outline-variant/30 hover:border-primary/30'
              }`}
            >
              <div className="flex justify-between items-start">
                <span className={`text-[10px] font-mono tracking-wider uppercase font-bold ${m.color}`}>
                  {m.title}
                </span>
                <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                  isCritical 
                    ? 'bg-error/20 text-error' 
                    : isWarning 
                      ? 'bg-error/10 text-[#ffb4ab]' 
                      : 'bg-primary-container/10 text-primary-container'
                }`}>
                  {m.status === 'nominal' ? 'Nominal' : m.status === 'warning' ? 'Aviso' : 'Crítico'}
                </span>
              </div>

              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className={`text-4xl font-display font-extrabold ${isCritical ? 'text-error' : 'text-white'}`}>
                    {m.prob}%
                  </span>
                  <span className="text-[10px] font-mono text-on-surface-variant uppercase">Prob. Falha</span>
                </div>
                
                {/* Visual bar progress */}
                <div className="mt-2 w-full bg-surface-dim h-1 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${isCritical ? 'bg-error' : isWarning ? 'bg-[#ffb4ab]' : 'bg-primary-container'}`} 
                    style={{ width: `${m.prob}%` }}
                  />
                </div>
              </div>

              <div className="text-[10px] font-mono text-on-surface-variant line-clamp-1">
                {m.desc}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Highlight recommendations banner */}
      <div className="glass-panel border border-error bg-[#93000a]/10 rounded-xl p-6 relative overflow-hidden flex flex-col md:flex-row items-start gap-6">
        <div className="absolute inset-0 bg-gradient-to-r from-error/15 to-transparent pointer-events-none" />
        
        {/* Animated robot smart toy icon container */}
        <div className="flex-shrink-0 w-14 h-14 rounded-full bg-error/20 border border-error/50 flex items-center justify-center relative z-10 text-error">
          <Bot className="w-8 h-8 animate-bounce" />
        </div>

        <div className="relative z-10 flex-1 space-y-4">
          <div>
            <span className="bg-error text-on-error font-mono text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider">
              Ação Requerida
            </span>
            <h3 className="font-display font-bold text-md text-error mt-2">
              Alerta Crítico: Degradação Acelerada
            </h3>
            <p className="text-sm text-on-surface-variant font-sans leading-relaxed mt-1">
              A análise preditiva indica uma falha iminente no subsistema de regulação de tensão. Substituição preventiva recomendada para o módulo de energia nas próximas 12 horas <span className="font-mono text-error font-bold">(T-12h)</span>.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {scheduledMaintenance ? (
              <div className="bg-primary-container/20 border border-primary-container text-primary-container font-mono font-bold text-xs px-5 py-2.5 rounded-lg flex items-center gap-2">
                <CheckSquare className="w-4 h-4" />
                <span>MANUTENÇÃO AGENDADA (T-12h SLOT)</span>
              </div>
            ) : (
              <button
                onClick={() => {
                  setScheduledMaintenance(true);
                  alert('Agendamento confirmado para às 14:00 UTC (T-12h slot).');
                }}
                className="bg-primary-container hover:bg-primary text-black font-mono font-bold text-xs px-5 py-2.5 rounded-lg cursor-pointer flex items-center gap-2 shadow-lg shadow-primary-container/10 transition-colors"
              >
                <Calendar className="w-4 h-4" />
                <span>AGENDAR MANUTENÇÃO</span>
              </button>
            )}

            <button
              onClick={() => alert('Model Details: Logistic Regression & XGBoost Ensambled classifier accuracy = 97.4%')}
              className="border border-outline-variant/60 text-on-surface hover:text-white hover:bg-surface-variant px-5 py-2.5 rounded-lg font-mono text-xs cursor-pointer transition-colors"
            >
              VER DETALHES DO MODELO
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Charts Row representing predictions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">
        {/* Risk Matrix Chart SVG */}
        <div className="glass-panel rounded-xl flex flex-col h-80 border border-outline-variant/30">
          <div className="px-5 py-3.5 border-b border-outline-variant flex justify-between items-center bg-surface-container/30">
            <h4 className="text-xs font-mono tracking-wider uppercase text-white font-bold">Matriz de Risco (Probabilidade vs Impacto)</h4>
            <HelpCircle className="w-4 h-4 text-on-surface-variant cursor-help" />
          </div>

          <div className="flex-1 p-6 relative flex items-center justify-center bg-surface-dim/40 relative">
            {/* Custom 2x3 grid lines for scatter risk plotting */}
            <div className="absolute inset-x-12 inset-y-8 border-l border-b border-outline-sm border-outline-variant/50 flex flex-col justify-between">
              {/* Horizontal rows representative lines */}
              <div className="border-t border-dashed border-outline-variant/20 w-full flex justify-end pr-2 text-[9px] font-mono text-on-surface-variant uppercase">Extremo</div>
              <div className="border-t border-dashed border-outline-variant/20 w-full flex justify-end pr-2 text-[9px] font-mono text-on-surface-variant uppercase">Moderado</div>
              <div className="w-full flex justify-end pr-2 text-[9px] font-mono text-on-surface-variant uppercase">Mínimo</div>
            </div>

            {/* Scatter nodes representing target modules */}
            <div className="relative w-full h-full">
              {/* Power Module Node (Top Right - High Risk extreme) */}
              <motion.div 
                animate={{ scale: [1, 1.1, 1] }} 
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute top-10 right-16 flex flex-col items-center"
              >
                <div className="w-4.5 h-4.5 rounded-full bg-error border border-white flex items-center justify-center shadow-lg shadow-error/40 cursor-help" title="Power Grid Terminal" />
                <span className="text-[10px] font-mono text-error font-bold mt-1 bg-surface-dim/80 px-1.5 py-0.5 rounded border border-error/20">Power (82%)</span>
              </motion.div>

              {/* Thermal Module Node (Center Warning impact) */}
              <div className="absolute top-28 left-48 flex flex-col items-center">
                <div className="w-4 h-4 rounded-full bg-[#ffb4ab] border border-white cursor-help" />
                <span className="text-[10px] font-mono text-[#ffb4ab] mt-1 bg-surface-dim/80 px-1.5 py-0.5 rounded border border-outline-variant/20">Thermal (35%)</span>
              </div>

              {/* Comms link Node (Bottom Left - Nominal low impact) */}
              <div className="absolute bottom-16 left-20 flex flex-col items-center">
                <div className="w-3.5 h-3.5 rounded-full bg-primary-container border border-white cursor-help" />
                <span className="text-[10px] font-mono text-primary-container mt-1 bg-surface-dim/80 px-1.5 py-0.5 rounded border border-outline-variant/20">Comms (15%)</span>
              </div>
            </div>

            {/* Labels of Axes */}
            <div className="absolute bottom-1.5 left-1/2 transform -translate-x-1/2 text-[9px] font-mono text-on-surface-variant uppercase tracking-widest">
              Probabilidade de Ocorrência →
            </div>
            <div className="absolute left-1.5 top-1/2 transform -translate-y-1/2 rotate-270 text-[9px] font-mono text-on-surface-variant uppercase tracking-widest">
              Nível do Impacto →
            </div>
          </div>
        </div>

        {/* Degradation Trendline Forecast SVG */}
        <div className="glass-panel rounded-xl flex flex-col h-80 border border-outline-variant/30">
          <div className="px-5 py-3.5 border-b border-outline-variant flex justify-between items-center bg-surface-container/30">
            <h4 className="text-xs font-mono tracking-wider uppercase text-white font-bold">Trendline de Degradação (Previsão +72h)</h4>
            <div className="flex gap-2 items-center text-[10px] font-mono">
              <span className="w-2.5 h-2.5 rounded-full bg-error" />
              <span className="text-white">Alvo: Power Module</span>
            </div>
          </div>

          <div className="flex-1 p-6 relative flex items-center justify-center bg-surface-dim/40">
            <svg viewBox="0 0 400 160" className="w-full h-full overflow-visible">
              {/* Mesh grid */}
              <line x1="10" y1="20" x2="390" y2="20" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
              <line x1="10" y1="60" x2="390" y2="60" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
              <line x1="10" y1="100" x2="390" y2="100" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
              <line x1="10" y1="140" x2="390" y2="140" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />

              {/* Threshold line represents failure warning */}
              <line x1="10" y1="40" x2="390" y2="40" stroke="#ffb4ab" strokeWidth="1" strokeDasharray="4 4" />
              <text x="320" y="35" fill="#ffb4ab" fontSize="8" fontFamily="monospace">LIMIAR DE CRÍTICO</text>

              {/* Forecast slope curve */}
              <path 
                d="M 10 130 Q 150 110 240 60 T 390 15" 
                fill="none" 
                stroke="#ffb4ab" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
              />
              
              {/* Shading representing certainty band */}
              <path 
                d="M 10 140 Q 150 120 240 70 T 390 25 L 390 5 Q 240 50 150 100 T 10 120 Z" 
                fill="rgba(255, 180, 171, 0.08)" 
              />

              {/* Current slot separator (Line T-0) */}
              <line x1="140" y1="10" x2="140" y2="150" stroke="rgba(0, 200, 255, 0.3)" strokeWidth="1" />
              <text x="145" y="145" fill="#00c8ff" fontSize="8" fontFamily="monospace">AGORA (T-0)</text>
              
              {/* T-12h slot point */}
              <circle cx="205" cy="80" r="4" fill="#ffb4ab" />
              <text x="212" y="83" fill="#ffb4ab" fontSize="8" fontFamily="monospace">FALHA IMINENTE (T-12h)</text>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
