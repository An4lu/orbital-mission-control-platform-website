import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { INITIAL_OPERATORS } from '../data';
import { Operator } from '../types';
import { Users, Shield, Compass, ToggleLeft, ToggleRight, Search, Plus } from 'lucide-react';

export default function UsersView() {
  const [operators, setOperators] = useState<Operator[]>(INITIAL_OPERATORS);
  const [search, setSearch] = useState('');

  const toggleStatus = (id: string) => {
    setOperators((prev) => 
      prev.map((op) => {
        if (op.id !== id) return op;
        return {
          ...op,
          status: op.status === 'active' ? 'offline' : 'active'
        };
      })
    );
  };

  const filtered = operators.filter(o => 
    o.name.toLowerCase().includes(search.toLowerCase()) || 
    o.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="border-b border-outline-variant pb-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h2 className="font-display font-bold text-lg text-white font-display">Operadores do Terminal</h2>
          <p className="text-xs text-on-surface-variant font-sans">
            Gerenciamento de credenciais de liberação de segurança e escalação de plantões operacionais.
          </p>
        </div>

        <button
          onClick={() => {
            const name = prompt('Nome do novo operador:');
            const role = prompt('Função operacional (ex: Engenheiro Eletrônico):');
            if (!name || !role) return;

            const newOp: Operator = {
              id: `op-${Date.now()}`,
              name,
              email: `${name.toLowerCase().replace(' ', '.')}@omcp.gov`,
              role,
              clearance: 3,
              status: 'active',
              mfaEnabled: true
            };
            setOperators(prev => [...prev, newOp]);
          }}
          className="box-border bg-primary-container hover:bg-primary text-black font-mono tracking-wider font-bold text-[11px] uppercase rounded px-4 py-2.5 flex items-center gap-2 cursor-pointer transition-colors"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3px]" />
          <span>Cadastrar Operador</span>
        </button>
      </div>

      {/* Control toolbelt bar */}
      <div className="flex flex-col sm:flex-row gap-4 bg-surface-container/30 border border-outline-variant/20 p-4 rounded-xl">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-outline">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Pesquisar por nome ou função do plantão..."
            className="w-full bg-surface-dim border border-outline-variant/60 rounded-md pl-10 pr-3 py-2 text-xs text-white placeholder-outline focus:outline-none"
          />
        </div>
      </div>

      {/* Grid container of operators cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence initial={false}>
          {filtered.map((op) => {
            const isActive = op.status === 'active';
            return (
              <motion.div
                key={op.id}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className={`glass-panel border rounded-xl p-5 relative overflow-hidden flex flex-col justify-between ${
                  isActive ? 'border-outline-variant/30' : 'border-outline-variant/25 opacity-70'
                }`}
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <h4 className="font-semibold text-white text-sm">{op.name}</h4>
                    <p className="text-xs text-primary font-medium">{op.role}</p>
                    <p className="text-[10px] font-mono text-on-surface-variant">{op.email}</p>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                    isActive 
                      ? 'bg-primary-container/10 text-primary-container border border-primary-container/20' 
                      : 'bg-surface-variant text-on-surface-variant'
                  }`}>
                    {isActive ? 'EM PLANTÃO' : 'OFFLINE'}
                  </span>
                </div>

                <div className="border-t border-outline-variant/30 mt-5 pt-4 flex justify-between items-center text-[11px] font-mono text-on-surface-variant">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-primary" />
                      <span>Level {op.clearance}</span>
                    </div>

                    <div className="flex items-center gap-1.5" title="MFA Authorization status">
                      <Compass className="w-3.5 h-3.5 text-secondary" />
                      <span>{op.mfaEnabled ? 'MFA: Habilitado' : 'MFA: Pendente'}</span>
                    </div>
                  </div>

                  {/* Toggle toggle switch */}
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] uppercase font-bold text-on-surface-variant">Mudar Escala</span>
                    <button 
                      onClick={() => toggleStatus(op.id)}
                      className="text-on-surface hover:text-white transition cursor-pointer"
                    >
                      {isActive ? (
                        <ToggleRight className="w-7 h-7 text-primary-container" />
                      ) : (
                        <ToggleLeft className="w-7 h-7 text-outline" />
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
