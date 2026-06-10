import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MISSION_EVENTS } from '../data';
import { MissionEvent } from '../types';
import { FileText, Download, Calendar, Search, SlidersHorizontal, Loader2, AlertTriangle, CheckCircle, Info } from 'lucide-react';

export default function ReportsView() {
  const [events, setEvents] = useState<MissionEvent[]>(MISSION_EVENTS);
  const [search, setSearch] = useState('');
  const [systemFilter, setSystemFilter] = useState<string>('Todos');
  const [severityFilter, setSeverityFilter] = useState<string>('Todas');
  const [periodFilter, setPeriodFilter] = useState<string>('Últimos 7d');
  
  // Export feedback indicators
  const [exportLoading, setExportLoading] = useState<'pdf' | 'csv' | 'excel' | null>(null);

  // Filter computations
  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      const matchSearch = e.event.toLowerCase().includes(search.toLowerCase()) || 
                          e.operator.toLowerCase().includes(search.toLowerCase());
      
      const matchSystem = systemFilter === 'Todos' || e.system === systemFilter;
      const matchSeverity = severityFilter === 'Todas' || e.severity === severityFilter;

      return matchSearch && matchSystem && matchSeverity;
    });
  }, [events, search, systemFilter, severityFilter]);

  // Export action handler
  const handleExport = (format: 'pdf' | 'csv' | 'excel') => {
    setExportLoading(format);
    setTimeout(() => {
      setExportLoading(null);
      alert(`Exportador Operacional OMCP: Relatório contendo ${filteredEvents.length} eventos baixado em formato .${format === 'excel' ? 'xlsx' : format}.`);
    }, 1500);
  };

  // Severity indicator renderer helper
  const renderSeverityBadge = (severity: MissionEvent['severity']) => {
    switch (severity) {
      case 'critical':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-error/15 text-error font-mono text-[10px] font-bold uppercase border border-error/30">
            <AlertTriangle className="w-3 h-3 shrink-0" /> Crítico
          </span>
        );
      case 'warning':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#ffb4ab]/15 text-[#ffb4ab] font-mono text-[10px] font-bold uppercase border border-[#ffb4ab]/30">
            <AlertTriangle className="w-3 h-3 shrink-0" /> Aviso
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-primary-container/10 text-primary-container font-mono text-[10px] font-bold uppercase border border-primary-container/20">
            <CheckCircle className="w-3 h-3 shrink-0" /> Nominal
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-fade-in relative pb-12">
      {/* Breadcrumb path */}
      <div className="flex items-center gap-2 text-on-surface-variant font-mono text-[10px] uppercase">
        <span className="hover:text-primary cursor-pointer">Home</span>
        <span>/</span>
        <span className="text-white">Relatórios</span>
      </div>

      {/* Page header and descriptive lines */}
      <div className="border-b border-outline-variant pb-5">
        <h2 className="font-display font-bold text-lg text-white">Relatórios e Histórico</h2>
        <p className="text-xs text-on-surface-variant font-sans mt-0.5">
          Consulta e exportação de dados históricos de missões.
        </p>
      </div>

      {/* Historical Statistics Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel rounded-xl p-5 border border-outline-variant/30 flex flex-col justify-between h-28 relative overflow-hidden group hover:border-[#00c8ff]/30 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl -mr-12 -mt-12 group-hover:bg-primary/10 transition-colors" />
          <span className="text-[10px] font-mono tracking-wider text-on-surface-variant uppercase">Total de Eventos</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-display font-extrabold text-white">14,293</span>
            <span className="text-[10px] font-mono text-on-surface-variant uppercase">últimos 30d</span>
          </div>
        </div>

        <div className="glass-panel rounded-xl p-5 border border-outline-variant/30 flex flex-col justify-between h-28 relative overflow-hidden group hover:border-error/30 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-error/5 rounded-full blur-2xl -mr-12 -mt-12 group-hover:bg-[#93000a]/10 transition-colors" />
          <span className="text-[10px] font-mono tracking-wider text-on-surface-variant uppercase">Alertas Críticos (Mês)</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-display font-extrabold text-error">12</span>
            <span className="text-[10px] font-mono text-error flex items-center gap-0.5 uppercase">
              ↓ -2%
            </span>
          </div>
        </div>

        <div className="glass-panel rounded-xl p-5 border border-outline-variant/30 flex flex-col justify-between h-28 relative overflow-hidden group hover:border-primary/30 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl -mr-12 -mt-12 group-hover:bg-primary/10 transition-colors" />
          <span className="text-[10px] font-mono tracking-wider text-on-surface-variant uppercase">Tempo de Resposta Médio</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-display font-extrabold text-secondary">1.2s</span>
            <span className="text-[10px] font-mono text-on-surface-variant uppercase">nominal</span>
          </div>
        </div>
      </div>

      {/* Filters bar & Action cluster */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 bg-surface-container/30 border border-outline-variant/20 p-4 rounded-xl">
        <div className="flex flex-wrap items-center gap-4">
          {/* Period selector */}
          <div className="space-y-1.5 flex flex-col">
            <label className="text-[10px] font-mono tracking-wider text-on-surface-variant uppercase font-bold">Período</label>
            <select
              value={periodFilter}
              onChange={(e) => setPeriodFilter(e.target.value)}
              className="bg-surface-dim text-white border border-outline-variant/60 rounded px-3 py-1.5 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option>Últimas 24h</option>
              <option>Últimos 7d</option>
              <option>Últimos 30d</option>
              <option>Personalizado</option>
            </select>
          </div>

          {/* System filter */}
          <div className="space-y-1.5 flex flex-col">
            <label className="text-[10px] font-mono tracking-wider text-on-surface-variant uppercase font-bold">Sistema</label>
            <select
              value={systemFilter}
              onChange={(e) => setSystemFilter(e.target.value)}
              className="bg-surface-dim text-white border border-outline-variant/60 rounded px-3 py-1.5 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="Todos">Todos os Sistemas</option>
              <option value="TCS">Thermal (TCS)</option>
              <option value="EPS">Power (EPS)</option>
              <option value="C&DH">Comms (C&DH)</option>
              <option value="ECLSS">Life Support (ECLSS)</option>
              <option value="ADCS">Navigation (ADCS)</option>
            </select>
          </div>

          {/* Severity filter */}
          <div className="space-y-1.5 flex flex-col">
            <label className="text-[10px] font-mono tracking-wider text-on-surface-variant uppercase font-bold">Severidade</label>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="bg-surface-dim text-white border border-outline-variant/60 rounded px-3 py-1.5 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="Todas">Todas</option>
              <option value="critical">Crítico</option>
              <option value="warning">Aviso</option>
              <option value="nominal">Nominal</option>
            </select>
          </div>

          {/* Search name filter */}
          <div className="space-y-1.5 flex flex-col min-w-[160px] sm:min-w-[200px]">
            <label className="text-[10px] font-mono tracking-wider text-on-surface-variant uppercase font-bold">Pesquisar por descrição</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center text-outline">
                <Search className="w-3.5 h-3.5" />
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ex: Radiador, Silva"
                className="w-full bg-surface-dim border border-outline-variant/60 rounded pl-8 pr-2 py-1.5 text-xs text-white font-sans placeholder-outline focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Action downloads cluster */}
        <div className="flex items-center gap-2 pt-2 lg:pt-0">
          <button
            onClick={() => handleExport('pdf')}
            disabled={!!exportLoading}
            className="flex items-center gap-2 px-3 py-1.5 border border-outline-variant hover:border-primary rounded bg-surface-dim text-xs font-mono tracking-wider uppercase font-bold transition-colors cursor-pointer"
          >
            {exportLoading === 'pdf' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileText className="w-3.5 h-3.5" />}
            <span>PDF</span>
          </button>

          <button
            onClick={() => handleExport('csv')}
            disabled={!!exportLoading}
            className="flex items-center gap-2 px-3 py-1.5 border border-outline-variant hover:border-primary rounded bg-surface-dim text-xs font-mono tracking-wider uppercase font-bold transition-colors cursor-pointer"
          >
            {exportLoading === 'csv' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
            <span>CSV</span>
          </button>

          <button
            onClick={() => handleExport('excel')}
            disabled={!!exportLoading}
            className="flex items-center gap-2 px-4 py-1.5 bg-primary-container hover:bg-primary rounded text-black text-xs font-mono tracking-wider uppercase font-bold transition-colors cursor-pointer"
          >
            {exportLoading === 'excel' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5 stroke-[2.5px]" />}
            <span>Excel</span>
          </button>
        </div>
      </div>

      {/* Main Data Table */}
      <div className="glass-panel rounded-xl border border-outline-variant/30 flex flex-col overflow-hidden">
        {/* Table summary sub-bar */}
        <div className="border-b border-outline-variant/40 px-6 py-4 flex items-center justify-between bg-surface-container-low/60">
          <h3 className="font-display font-bold text-sm text-white uppercase tracking-wider">Log de Eventos</h3>
          
          <div className="flex items-center gap-2 font-mono text-[11px] text-on-surface-variant">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-container opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-container"></span>
            </span>
            <span>Live Sync Ativo</span>
          </div>
        </div>

        {/* Responsive Table overflow */}
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse border-0 select-text">
            <thead>
              <tr className="border-b border-outline-variant/40 bg-surface-container/20 text-[10px] font-mono text-on-surface-variant uppercase tracking-wider">
                <th className="px-6 py-3.5 font-bold">Timestamp (UTC)</th>
                <th className="px-6 py-3.5 font-bold">Evento</th>
                <th className="px-6 py-3.5 font-bold">Sistema</th>
                <th className="px-6 py-3.5 font-bold">Severidade</th>
                <th className="px-6 py-3.5 font-bold">Operador</th>
              </tr>
            </thead>
            <tbody className="font-mono text-xs divide-y divide-outline-variant/25">
              <AnimatePresence initial={false}>
                {filteredEvents.length > 0 ? (
                  filteredEvents.map((e) => (
                    <tr 
                      key={e.id}
                      className="hover:bg-surface-variant/20 transition-all group"
                    >
                      <td className="px-6 py-4 text-on-surface-variant text-[11px] font-medium whitespace-nowrap">
                        {e.timestamp.replace('T', ' ').replace('Z', '')}
                      </td>
                      <td className="px-6 py-4 text-white font-medium min-w-[280px]">
                        {e.event}
                      </td>
                      <td className="px-6 py-4 text-secondary uppercase font-bold whitespace-nowrap">
                        {e.system}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {renderSeverityBadge(e.severity)}
                      </td>
                      <td className="px-6 py-4 text-on-surface-variant text-[11px] whitespace-nowrap">
                        {e.operator}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-on-surface-variant font-mono text-xs">
                      [ NENHUM EVENTO CORRESPONDENTE ENCONTRADO ]
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Pagination bar */}
        <div className="border-t border-outline-variant/40 px-6 py-3 bg-surface-container/20 flex justify-between items-center text-[11px] font-mono text-on-surface-variant text-right">
          <span>Mostrando 1-{filteredEvents.length} de {filteredEvents.length} eventos históricos</span>
          <div className="flex gap-1.5">
            <button 
              disabled 
              className="p-1 rounded bg-surface-dim hover:text-white border border-outline-variant/20 disabled:opacity-40 transition-colors"
            >
              ← Anterior
            </button>
            <button 
              disabled 
              className="p-1 rounded bg-surface-dim hover:text-white border border-outline-variant/20 disabled:opacity-40 transition-colors"
            >
              Próximo →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
