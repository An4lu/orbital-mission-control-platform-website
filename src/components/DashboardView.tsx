import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Orbit, Compass, Activity, Globe, Zap, AlertCircle, Signal } from 'lucide-react';

export default function DashboardView() {
  const [orbitAngle, setOrbitAngle] = useState(0);
  const [coordinates, setCoordinates] = useState({ lat: '34.05N', lon: '118.24W', alt: '408.2 km' });
  const [signalStrength, setSignalStrength] = useState(94);
  const [cpuUsage, setCpuUsage] = useState(38);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Animate orbit angle and coordinates
  useEffect(() => {
    const interval = setInterval(() => {
      setOrbitAngle((prev) => (prev + 0.5) % 360);
      
      // Calculate realistic coordinates based on physics model
      const rawLat = (Math.sin(Date.now() / 60000) * 51.6).toFixed(4);
      const rawLon = ((Date.now() / 15000) % 360 - 180).toFixed(4);
      const latDir = parseFloat(rawLat) >= 0 ? 'N' : 'S';
      const lonDir = parseFloat(rawLon) >= 0 ? 'E' : 'W';
      
      setCoordinates({
        lat: `${Math.abs(parseFloat(rawLat)).toFixed(2)}°${latDir}`,
        lon: `${Math.abs(parseFloat(rawLon)).toFixed(2)}°${lonDir}`,
        alt: `${(407.5 + Math.sin(Date.now() / 100000) * 1.5).toFixed(1)} km`
      });

      // Simulated noise for telemetry
      setSignalStrength((prev) => Math.min(100, Math.max(85, prev + (Math.random() > 0.5 ? 1 : -1))));
      setCpuUsage((prev) => Math.min(65, Math.max(25, prev + (Math.random() > 0.5 ? 2 : -2))));
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // Draw animated Orbital Projection
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let rotation = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const radius = 62;

      // Draw Grid / Radar-like rings
      ctx.strokeStyle = 'rgba(0, 200, 255, 0.08)';
      ctx.lineWidth = 1;
      for (let r = 80; r <= 140; r += 30) {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw horizontal & vertical grid lines
      ctx.beginPath();
      ctx.moveTo(cx - 150, cy);
      ctx.lineTo(cx + 150, cy);
      ctx.moveTo(cx, cy - 150);
      ctx.lineTo(cx, cy + 150);
      ctx.stroke();

      // Earth Globe (Vector representation)
      ctx.fillStyle = '#161c20';
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#3c484f';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Draw custom dynamic continent vectors inside sphere with rotation
      rotation += 0.003;
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.clip(); // Mask map drawing inside sphere

      ctx.strokeStyle = 'rgba(0, 200, 255, 0.25)';
      ctx.lineWidth = 1;

      // Meridiens
      for (let i = -3; i <= 3; i++) {
        const xOffset = i * 20 + (rotation * 60) % 40 - 20;
        ctx.beginPath();
        ctx.ellipse(cx + xOffset, cy, Math.abs(xOffset) * 0.4, radius, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      
      // Equator
      ctx.beginPath();
      ctx.moveTo(cx - radius, cy);
      ctx.lineTo(cx + radius, cy);
      ctx.stroke();

      ctx.restore();

      // Draw Ellipse Orbit Track (angled)
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(-Math.PI / 8);
      ctx.strokeStyle = '#00c8ff';
      ctx.lineWidth = 1.2;
      ctx.setLineDash([4, 4]);
      
      ctx.beginPath();
      ctx.ellipse(0, 0, 130, 48, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Satellite position on ellipse
      const theta = (rotation * 4) % (Math.PI * 2);
      const satX = 130 * Math.cos(theta);
      const satY = 48 * Math.sin(theta);

      // Draw Satellite node glow
      ctx.restore();
      
      // Translate sat coords back to global space to draw glowing point
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(-Math.PI / 8);
      
      // Glow
      ctx.fillStyle = '#00c8ff';
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#00c8ff';
      ctx.beginPath();
      ctx.arc(satX, satY, 5, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Metrics Overview Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-surface-container/60 border border-outline-variant/30 rounded-xl p-5 flex items-center justify-between shadow-sm relative overflow-hidden group hover:border-[#00c8ff]/40 transition-all">
          <div className="space-y-1">
            <span className="text-[10px] font-mono tracking-wider text-on-surface-variant uppercase">Status da Missão</span>
            <p className="text-2xl font-display font-bold text-white">OPERANTE</p>
          </div>
          <div className="p-3 bg-primary-container/10 border border-primary-container/20 rounded-lg text-primary-container">
            <Orbit className="w-5 h-5 animate-pulse" />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-surface-container/60 border border-outline-variant/30 rounded-xl p-5 flex items-center justify-between shadow-sm relative overflow-hidden group hover:border-[#00c8ff]/40 transition-all">
          <div className="space-y-1">
            <span className="text-[10px] font-mono tracking-wider text-on-surface-variant uppercase">Sinal de Telemetria</span>
            <p className="text-2xl font-mono font-bold text-white">{signalStrength}%</p>
          </div>
          <div className="p-3 bg-[#00c8ff]/10 border border-[#00c8ff]/20 rounded-lg text-primary">
            <Signal className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-surface-container/60 border border-outline-variant/30 rounded-xl p-5 flex items-center justify-between shadow-sm relative overflow-hidden group hover:border-[#00c8ff]/40 transition-all">
          <div className="space-y-1">
            <span className="text-[10px] font-mono tracking-wider text-on-surface-variant uppercase">Altitude Orbital</span>
            <p className="text-2xl font-mono font-bold text-white">{coordinates.alt}</p>
          </div>
          <div className="p-3 bg-secondary-container/15 border border-outline-variant/30 rounded-lg text-secondary">
            <Globe className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-surface-container/60 border border-outline-variant/30 rounded-xl p-5 flex items-center justify-between shadow-sm relative overflow-hidden group hover:border-[#ffb4ab]/40 transition-all">
          <div className="space-y-1">
            <span className="text-[10px] font-mono tracking-wider text-on-surface-variant uppercase">Alertas Ativos</span>
            <p className="text-2xl font-mono font-bold text-error">1 CRÍTICO</p>
          </div>
          <div className="p-3 bg-error/10 border border-error/20 rounded-lg text-error">
            <AlertCircle className="w-5 h-5 animate-bounce" />
          </div>
        </div>
      </div>

      {/* Main Grid: Orbital Projection & Mission Telemetry */}
      <div className="grid grid-cols-12 gap-6">
        {/* Orbital Projection Map Card */}
        <div className="col-span-12 lg:col-span-7 bg-surface-container/50 border border-outline-variant/30 rounded-xl p-6 flex flex-col justify-between glass-panel relative overflow-hidden min-h-[380px]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none" />
          
          <div className="flex items-center justify-between border-b border-outline-variant pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-primary animate-spin" style={{ animationDuration: '6s' }} />
              <h3 className="text-xs font-mono tracking-wider uppercase text-white font-bold">Rastreamento de Posição Orbital (Orbit Tracker)</h3>
            </div>
            
            <div className="flex items-center gap-2 bg-[#161c20] px-3 py-1 rounded border border-[#3c484f] text-[10px] font-mono text-on-surface-variant uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse" />
              Sincronização Ao Vivo
            </div>
          </div>

          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
            {/* Projector Canvas */}
            <div className="flex justify-center items-center">
              <canvas 
                ref={canvasRef} 
                width={300} 
                height={260} 
                className="max-w-full rounded-lg bg-surface-dim/40 border border-outline-variant/20 shadow-inner"
              />
            </div>

            {/* Position details */}
            <div className="space-y-4">
              <div className="bg-surface-dim/60 border border-outline-variant/30 p-4 rounded-lg space-y-3">
                <h4 className="text-[10px] font-mono tracking-wider uppercase text-on-surface-variant font-bold">Coordenadas Atuais</h4>
                <div className="grid grid-cols-2 gap-y-3 font-mono text-xs">
                  <div>
                    <span className="text-on-surface-variant block text-[10px] uppercase">Latitude</span>
                    <span className="text-white text-md font-bold">{coordinates.lat}</span>
                  </div>
                  <div>
                    <span className="text-on-surface-variant block text-[10px] uppercase">Longitude</span>
                    <span className="text-white text-md font-bold">{coordinates.lon}</span>
                  </div>
                  <div>
                    <span className="text-on-surface-variant block text-[10px] uppercase">Altitude</span>
                    <span className="text-[#68d3ff] text-md font-bold">{coordinates.alt}</span>
                  </div>
                  <div>
                    <span className="text-on-surface-variant block text-[10px] uppercase">Velocidade</span>
                    <span className="text-white text-md font-bold">7.66 km/s</span>
                  </div>
                </div>
              </div>

              {/* Status checklist */}
              <div className="space-y-2 text-[11px] font-mono">
                <div className="flex items-center justify-between text-on-surface-variant">
                  <span>Satélite Identificador:</span>
                  <span className="text-white font-bold">OMCP-SAT-B2</span>
                </div>
                <div className="flex items-center justify-between text-on-surface-variant">
                  <span>Próximo Apogeu:</span>
                  <span className="text-white">T+ 24m 12s</span>
                </div>
                <div className="flex items-center justify-between text-on-surface-variant">
                  <span>Ângulo de Passagem (Beta):</span>
                  <span className="text-white">{orbitAngle.toFixed(1)}°</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Systems Core Diagnostics inside Dashboard */}
        <div className="col-span-12 lg:col-span-5 bg-surface-container/50 border border-outline-variant/30 rounded-xl p-6 glass-panel flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-outline-variant pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" />
                <h3 className="text-xs font-mono tracking-wider uppercase text-white font-bold">Diagnóstico de Hardware da Estação</h3>
              </div>
            </div>

            {/* Simulated Live System Bars */}
            <div className="space-y-4">
              {/* CPU */}
              <div className="space-y-1.5">
                <div className="flex justify-between font-mono text-[11px]">
                  <span className="text-on-surface-variant uppercase">Servidor Principal CPU (Processamento)</span>
                  <span className="text-white font-bold">{cpuUsage.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-surface-dim h-1.5 rounded-full overflow-hidden border border-outline-variant/20">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${cpuUsage}%` }}
                    className="bg-primary h-full rounded-full"
                  />
                </div>
              </div>

              {/* Solar Array Power Buffer */}
              <div className="space-y-1.5">
                <div className="flex justify-between font-mono text-[11px]">
                  <span className="text-on-surface-variant uppercase">Resonância do Array Solar (Buff)</span>
                  <span className="text-white font-bold">94.2%</span>
                </div>
                <div className="w-full bg-surface-dim h-1.5 rounded-full overflow-hidden border border-outline-variant/20">
                  <div className="bg-primary-container h-full rounded-full" style={{ width: '94.2%' }} />
                </div>
              </div>

              {/* ECLSS Oxygen Concentration */}
              <div className="space-y-1.5">
                <div className="flex justify-between font-mono text-[11px]">
                  <span className="text-on-surface-variant uppercase">Concentração O2 (Cabine Interna)</span>
                  <span className="text-white font-bold">20.9%</span>
                </div>
                <div className="w-full bg-surface-dim h-1.5 rounded-full overflow-hidden border border-outline-variant/20">
                  <div className="bg-primary-container h-full rounded-full" style={{ width: '82%' }} />
                </div>
              </div>

              {/* Radiator Thermal Dissipation */}
              <div className="space-y-1.5">
                <div className="flex justify-between font-mono text-[11px]">
                  <span className="text-[#ffb4ab] uppercase">Dissipação Térmica do Radiador</span>
                  <span className="text-error font-bold">88.5% (Crítico)</span>
                </div>
                <div className="w-full bg-surface-dim h-1.5 rounded-full overflow-hidden border border-outline-variant/20">
                  <div className="bg-error h-full rounded-full animate-pulse" style={{ width: '88.5%' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-outline-variant/30 mt-6 pt-4 text-xs space-y-2 text-on-surface-variant font-mono">
            <div className="flex items-center gap-2 text-primary">
              <Zap className="w-3.5 h-3.5" />
              <span>Drenagem Total Solar: +14.6 kW</span>
            </div>
            <p className="text-[10px] leading-relaxed">
              O subsistema de suporte de vida (ECLSS) e o payload de comunicações mantêm taxas normativas. O módulo de regulação indica aquecimento localizado no link dissipador.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
