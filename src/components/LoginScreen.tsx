import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, Key, Eye, EyeOff, Loader2, Sparkles, Orbit } from 'lucide-react';

interface LoginScreenProps {
  onLoginSuccess: (email: string) => void;
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [email, setEmail] = useState('agent.name@omcp.gov');
  const [password, setPassword] = useState('•••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [requireMFA, setRequireMFA] = useState(true);
  const [loading, setLoading] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setAccessDenied(false);

    // Operational loading effect
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess(email);
    }, 1500);
  };

  return (
    <div className="min-h-screen w-screen bg-surface-dim flex flex-col justify-center items-center p-4 relative overflow-hidden data-grid-bg">
      {/* Absolute Decorative Tech Lines */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary-container to-transparent opacity-60" />
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-error/5 blur-3xl" />

      {/* Status Bar */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8 flex items-center gap-2 bg-surface-container/40 border border-outline-variant/30 px-4 py-2 rounded-full backdrop-blur-md"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00c8ff] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00c8ff]"></span>
        </span>
        <span className="text-[11px] font-mono tracking-[0.2em] uppercase text-primary font-bold">
          STATUS DA PLATAFORMA: TODOS OS SISTEMAS NOMINAIS
        </span>
      </motion.div>

      {/* Main Login Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', damping: 20 }}
        className="w-full max-w-[460px] bg-surface-container-low/95 rounded-2xl p-8 border border-outline-variant/40 glass-panel shadow-2xl relative"
      >
        {/* Subtle Sat / Space graphic */}
        <div className="absolute top-4 right-4 flex items-center justify-center text-primary-container/20">
          <Orbit className="w-10 h-10 animate-spin" style={{ animationDuration: '24s' }} />
        </div>

        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-3">
            <svg className="w-10 h-10 text-primary animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-.778.099-1.533.284-2.253" />
            </svg>
            <span className="font-display text-4xl font-black text-white tracking-widest">OMCP</span>
          </div>
          <h2 className="font-display font-bold text-xs tracking-[0.3em] text-primary uppercase mb-2">
            Orbital Mission Control Platform
          </h2>
          <p className="text-sm text-on-surface-variant font-sans px-4">
            Monitorando o presente. Prevendo o futuro das missões.
          </p>
        </div>

        {/* Input Fields Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email / Operative ID input */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-mono tracking-wider text-on-surface-variant uppercase">
              Operative ID / Email
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-outline-variant">
                <Shield className="w-5 h-5" />
              </span>
              <input
                id="login-id"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nome.agente@omcp.gov"
                className="w-full bg-surface-dim border border-outline-variant/60 rounded-lg pl-10 pr-3 py-3 text-sm text-white font-mono placeholder-outline focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all"
                disabled={loading}
              />
            </div>
          </div>

          {/* Security Clearance Code */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-mono tracking-wider text-on-surface-variant uppercase">
              Código de Liberação de Segurança
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-outline-variant">
                <Key className="w-5 h-5" />
              </span>
              <input
                id="login-pass"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Insira o código"
                className="w-full bg-surface-dim border border-outline-variant/60 rounded-lg pl-10 pr-10 py-3 text-sm text-white font-mono placeholder-outline focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-outline-variant hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* MFA Checkbox & Reset */}
          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer group text-xs text-on-surface-variant">
              <input
                id="check-mfa"
                type="checkbox"
                checked={requireMFA}
                onChange={(e) => setRequireMFA(e.target.checked)}
                className="rounded border-outline-variant bg-surface-dim text-primary focus:ring-0 focus:ring-offset-0 w-4 h-4 cursor-pointer"
                disabled={loading}
              />
              <span className="font-mono uppercase tracking-wider group-hover:text-white transition-colors text-[11px]">
                Exigir Token MFA
              </span>
            </label>

            <button
              type="button"
              onClick={() => {
                alert('Solicitação de redefinição de acesso enviada ao administrador de comando da OMCP.');
              }}
              className="text-primary-container hover:text-primary tracking-wider uppercase font-mono font-bold text-[11px] transition-colors"
              disabled={loading}
            >
              Resetar Acesso
            </button>
          </div>

          {/* Login Button */}
          <button
            id="login-btn"
            type="submit"
            disabled={loading}
            className="w-full bg-primary-container hover:bg-primary text-black font-mono font-bold text-sm tracking-widest py-3 px-4 rounded-lg flex items-center justify-center gap-2 border border-primary-container hover:border-primary cursor-pointer active:scale-95 transition-all shadow-lg shadow-primary-container/20 mt-6"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>AUTENTICANDO...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                <span>Entrar</span>
              </>
            )}
          </button>
        </form>

        {/* Unauthorized access label */}
        <div className="border-t border-outline-variant/30 mt-8 pt-6 text-center">
          <p className="text-[10px] font-mono tracking-widest text-[#ffb4ab] uppercase font-semibold leading-relaxed">
            O ACESSO NÃO AUTORIZADO É ESTREITAMENTE PROIBIDO.
            <br />
            EXIGE-SE LIBERAÇÃO DE CREDENCIAS DO NÍVEL 4.
          </p>
        </div>
      </motion.div>

      {/* Decorative Command Footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 0.8 }}
        className="mt-8 text-[11px] font-mono text-on-surface-variant text-center"
      >
        ORBITAL MISSION CONTROL PLATFORM v2.4 • ESTAÇÃO DE TRABALHO SEGURA
      </motion.p>
    </div>
  );
}
