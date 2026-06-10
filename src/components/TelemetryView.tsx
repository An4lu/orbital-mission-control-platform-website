import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, RefreshCw, Layers, Database, Radio } from 'lucide-react';

interface TelemetryPoint {
  time: string;
  voltage: number;
  temperature: number;
  bandwidth: number;
}

export default function TelemetryView() {
  const [dataPoints, setDataPoints] = useState<TelemetryPoint[]>([]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeParameter, setActiveParameter] = useState<'voltage' | 'temperature' | 'bandwidth'>('temperature');
  const [streamLog, setStreamLog] = useState<{ id: string; msg: string; tag: string }[]>([]);

  // Generate initial wave history
  useEffect(() => {
    const initial: TelemetryPoint[] = [];
    const now = Date.now();
    for (let i = 24; i >= 0; i--) {
      const t = new Date(now - i * 3000);
      const phase = i * 0.4;
      initial.push({
        time: t.toISOString().substring(14, 19),
        voltage: 120 + Math.sin(phase) * 5 + Math.random() * 1.5,
        temperature: 22 + Math.cos(phase * 0.8) * 3 + Math.random() * 0.4,
        bandwidth: 2.2 + Math.sin(phase * 2) * 0.3 + Math.random() * 0.1
      });
    }
    setDataPoints(initial);

    // Initial logs
    setStreamLog([
      { id: '1', msg: 'RX FRAME: [0x7FF01AA] - COMM BANDWIDTH OK', tag: 'COMMS' },
      { id: '2', msg: 'RX FRAME: [0x1FA23EE] - THERMAL SENSOR STABLE', tag: 'THERMAL' },
      { id: '3', msg: 'RX FRAME: [0x55B09CD] - EPS VOLTAGE: 121.4V', tag: 'POWER' },
    ]);
  }, []);

  // Update real-time feed if playing
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setDataPoints((prev) => {
        const nextTime = new Date();
        const phase = Date.now() / 4000;
        const nextPoint: TelemetryPoint = {
          time: nextTime.toISOString().substring(14, 19),
          voltage: 120 + Math.sin(phase) * 4.5 + Math.random() * 1.2,
          temperature: 22.4 + Math.sin(phase * 0.6) * 2.8 + Math.random() * 0.3,
          bandwidth: 2.4 + Math.cos(phase * 1.8) * 0.4 + Math.random() * 0.12
        };
        return [...prev.slice(1), nextPoint];
      });

      // Insert fresh stream entries
      setStreamLog((prev) => {
        const id = Date.now().toString();
        const paramLabel = activeParameter.toUpperCase();
        const randHex = Math.floor(Math.random() * 0xFFFFFFF).toString(16).toUpperCase();
        let valueStr = '';
        if (activeParameter === 'temperature') valueStr = `${(22 + Math.random() * 4).toFixed(1)}°C`;
        if (activeParameter === 'voltage') valueStr = `${(118 + Math.random() * 5).toFixed(1)}V`;
        if (activeParameter === 'bandwidth') valueStr = `${(2.1 + Math.random() * 0.8).toFixed(2)}Gbps`;

        const newLog = {
          id,
          msg: `RX FRAME: [0x${randHex}] - LATEST ${paramLabel} VALUE RECEIPT: ${valueStr}`,
          tag: paramLabel
        };
        return [newLog, ...prev.slice(0, 14)];
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isPlaying, activeParameter]);

  // Clean data arrays helper
  const maxVal = {
    voltage: 130,
    temperature: 30,
    bandwidth: 3.5
  }[activeParameter];

  const minVal = {
    voltage: 110,
    temperature: 15,
    bandwidth: 1.5
  }[activeParameter];

  const points = dataPoints.map((dp, i) => {
    const val = dp[activeParameter];
    const x = (i / 24) * 480 + 10;
    const y = 140 - ((val - minVal) / (maxVal - minVal)) * 110;
    return { x, y, val };
  });

  const dPath = points.length > 0 
    ? `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ') 
    : '';

  const dArea = points.length > 0
    ? `${dPath} L ${points[points.length-1].x} 150 L ${points[0].x} 150 Z`
    : '';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Upper Telemetry controller strip */}
      <div className="bg-surface-container/60 border border-outline-variant/30 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel">
        <div className="space-y-1">
          <h3 className="text-sm font-mono tracking-wider text-white uppercase font-bold flex items-center gap-2">
            <Radio className="w-4 h-4 text-primary" />
            Controlador de Fluxo de Telemetria
          </h3>
          <p className="text-xs text-on-surface-variant font-sans">
            Sintonização de ondas portadoras e buffers hexadecimais em tempo real.
          </p>
        </div>

        {/* Buttons layout */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-surface-dim border border-outline-variant/40 rounded-lg p-1 flex">
            {(['temperature', 'voltage', 'bandwidth'] as const).map((param) => (
              <button
                key={param}
                onClick={() => setActiveParameter(param)}
                className={`px-3 py-1.5 rounded text-xs font-mono font-bold uppercase transition px-3 cursor-pointer ${
                  activeParameter === param 
                    ? 'bg-[#00c8ff] text-black' 
                    : 'text-on-surface-variant hover:text-white'
                }`}
              >
                {param === 'temperature' ? 'Temperatura' : param === 'voltage' ? 'Voltagem' : 'Banda'}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 rounded bg-surface-dim border border-outline-variant/40 hover:text-white hover:border-primary-container transition-all cursor-pointer"
              title={isPlaying ? 'Pausar recepção' : 'Retomar recepção'}
            >
              {isPlaying ? <Pause className="w-4 h-4 text-error" /> : <Play className="w-4 h-4 text-primary-container" />}
            </button>

            <button
              onClick={() => {
                // Shake arrays
                setDataPoints((prev) => prev.map(dp => ({
                  ...dp,
                  voltage: dp.voltage + (Math.random() - 0.5) * 5,
                  temperature: dp.temperature + (Math.random() - 0.5) * 2,
                  bandwidth: dp.bandwidth + (Math.random() - 0.5) * 0.3
                })));
              }}
              className="p-2 rounded bg-surface-dim border border-outline-variant/40 hover:text-white hover:border-primary-container transition-all cursor-pointer"
              title="Forçar recalibração"
            >
              <RefreshCw className="w-4 h-4 text-[#68d3ff]" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Render Graph view */}
        <div className="col-span-12 lg:col-span-8 bg-surface-container/50 border border-outline-variant/30 rounded-xl p-6 glass-panel flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-outline-variant pb-3 mb-4">
            <h4 className="text-xs font-mono tracking-wider uppercase text-white font-bold">
              Análise de Onda: {activeParameter.toUpperCase()}
            </h4>
            <div className="flex items-center gap-2 font-mono text-[11px] text-on-surface-variant">
              <span>Máximo: <b className="text-white">{maxVal}</b></span>
              <span>•</span>
              <span>Mínimo: <b className="text-white">{minVal}</b></span>
            </div>
          </div>

          {/* SVG Vector Plot Area */}
          <div className="my-4 bg-surface-dim/40 rounded-lg border border-outline-variant/20 p-4 flex items-center justify-center relative overflow-hidden h-64">
            <svg viewBox="0 0 500 160" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="gradient-wave" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00c8ff" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#00c8ff" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Guide Lines */}
              <line x1="10" y1="20" x2="490" y2="20" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              <line x1="10" y1="80" x2="490" y2="80" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="10" y1="140" x2="490" y2="140" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />

              {/* Area filled */}
              {dArea && <path d={dArea} fill="url(#gradient-wave)" />}

              {/* Outline wave path */}
              {dPath && (
                <path 
                  d={dPath} 
                  fill="none" 
                  stroke="#00c8ff" 
                  strokeWidth="2" 
                  strokeLinecap="round"
                  className="transition-all"
                />
              )}

              {/* Glowing Interactive point on last element */}
              {points.length > 0 && (
                <g>
                  <circle 
                    cx={points[points.length - 1].x} 
                    cy={points[points.length - 1].y} 
                    r="5" 
                    fill="#00c8ff" 
                    className="animate-ping"
                  />
                  <circle 
                    cx={points[points.length - 1].x} 
                    cy={points[points.length - 1].y} 
                    r="3.5" 
                    fill="#ffffff" 
                  />
                </g>
              )}
            </svg>

            {/* Displaying state if paused */}
            {!isPlaying && (
              <div className="absolute inset-0 bg-surface-dim/40 backdrop-blur-xs flex items-center justify-center font-mono text-xs text-on-surface-variant font-bold">
                [ TELEMETRIA EM PAUSA ]
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-outline-variant/30 text-center font-mono">
            <div className="p-2 bg-surface-dim/50 rounded border border-outline-variant/10">
              <span className="text-[10px] text-on-surface-variant block uppercase">Frequência</span>
              <span className="text-white text-md font-bold">1420 MHz</span>
            </div>
            <div className="p-2 bg-surface-dim/50 rounded border border-outline-variant/10">
              <span className="text-[10px] text-on-surface-variant block uppercase">Atraso de Link</span>
              <span className="text-primary-container text-md font-bold">14.2 ms</span>
            </div>
            <div className="p-2 bg-surface-dim/50 rounded border border-outline-variant/10">
              <span className="text-[10px] text-on-surface-variant block uppercase">Estação Terrestre</span>
              <span className="text-white text-md font-bold">STATION_B4</span>
            </div>
            <div className="p-2 bg-surface-dim/50 rounded border border-outline-variant/10">
              <span className="text-[10px] text-[#ffb4ab] block uppercase">Erros de Pacote</span>
              <span className="text-error text-md font-bold">0.05%</span>
            </div>
          </div>
        </div>

        {/* Live Hex Ticker */}
        <div className="col-span-12 lg:col-span-4 bg-surface-container/50 border border-outline-variant/30 rounded-xl p-6 glass-panel flex flex-col justify-between h-[420px] lg:h-auto">
          <div className="flex items-center justify-between border-b border-outline-variant pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-primary" />
              <h4 className="text-xs font-mono tracking-wider uppercase text-white font-bold">Stream de Frames Brutos (Hex Log)</h4>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 font-mono text-[10px] pr-2 scrollbar-thin">
            <AnimatePresence initial={false}>
              {streamLog.map((log) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -15, height: 0 }}
                  animate={{ opacity: 1, x: 0, height: 'auto' }}
                  exit={{ opacity: 0 }}
                  className="p-2 bg-surface-container border border-outline-variant/20 rounded flex items-center justify-between gap-1.5"
                >
                  <span className="text-on-surface font-semibold text-[9px] block leading-normal break-all">
                    {log.msg}
                  </span>
                  <span className="px-1.5 py-0.5 bg-secondary-container/30 border border-outline-variant/30 rounded text-[9px] font-bold text-primary shrink-0 uppercase">
                    {log.tag}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="border-t border-outline-variant/30 mt-4 pt-3 text-[11px] font-mono text-on-surface-variant flex justify-between items-center">
            <span>Sincronizando com frame buffer...</span>
            <span className="text-primary-container animate-pulse">● LIVE CONNETION</span>
          </div>
        </div>
      </div>
    </div>
  );
}
