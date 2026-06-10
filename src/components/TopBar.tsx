import { useState, useEffect } from 'react';
import { Menu, Signal, Terminal, ShieldAlert, Cpu } from 'lucide-react';

interface TopBarProps {
  onMenuToggle: () => void;
  title: string;
}

export default function TopBar({ onMenuToggle, title }: TopBarProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatUTC = (date: Date) => {
    return date.toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
  };

  return (
    <header className="fixed top-0 right-0 w-full md:w-[calc(100%-280px)] h-16 bg-surface-dim/80 backdrop-blur-xl border-b border-outline-variant z-40 flex items-center justify-between px-6 select-none shadow-md">
      {/* Search / Section indicator info */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuToggle}
          className="md:hidden p-2 -ml-2 rounded-lg text-on-surface-variant hover:text-white hover:bg-surface-variant/40 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-primary" />
          <h2 className="font-display font-medium text-white tracking-wide text-md hidden sm:inline-block">
            {title}
          </h2>
          <h2 className="font-display font-medium text-white tracking-wide text-sm sm:hidden">
            OMCP Terminal
          </h2>
        </div>
      </div>

      {/* Control Actions & Info Tills */}
      <div className="flex items-center gap-4">
        {/* Connection Status tag */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-[#1a2024] border border-[#3c484f] rounded-full text-xs font-mono text-primary font-medium">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary"></span>
          </span>
          UPLINK ESTÁVEL
        </div>

        {/* Live Date-Time feed */}
        <div className="hidden sm:inline-flex bg-surface-container-low px-4 py-1.5 border border-outline-variant/30 rounded-md font-mono text-xs text-on-surface-variant font-medium text-right">
          <span className="text-[#68d3ff]">{formatUTC(time)}</span>
        </div>

        {/* Operator Profile Circle */}
        <div className="w-8 h-8 rounded-full bg-[#1a2024] cursor-pointer border border-[#3c484f] hover:border-primary-container transition-all flex items-center justify-center text-on-surface hover:text-white overflow-hidden shadow">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
      </div>
    </header>
  );
}
