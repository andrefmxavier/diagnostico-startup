import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import LogoHeader from './LogoHeader.jsx';
import { APP_CONFIG } from '../../config/app.js';

export default function AppShell({ modules, activeModuleId, onNavigate, children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavigate = (id) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  const nav = (
    <nav className="space-y-1">
      {modules.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => handleNavigate(id)}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-semibold transition ${
            activeModuleId === id ? 'bg-teal-500 text-slate-950' : 'text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Icon className="h-4 w-4 shrink-0" /> {label}
        </button>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row font-sans">
      {/* Barra superior (mobile) */}
      <header className="md:hidden bg-slate-900 border-b border-slate-800 py-3 px-4 flex justify-between items-center sticky top-0 z-30">
        <LogoHeader />
        <button
          onClick={() => setMobileMenuOpen(open => !open)}
          className="p-2 rounded-xl bg-slate-800 border border-slate-700"
          aria-label="Abrir menu"
        >
          {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </header>
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 p-3">{nav}</div>
      )}

      {/* Barra lateral (desktop) */}
      <aside className="hidden md:flex w-64 shrink-0 bg-slate-900 border-r border-slate-800 flex-col p-4 gap-6 sticky top-0 h-screen">
        <LogoHeader />
        {nav}
        <p className="mt-auto text-[11px] text-slate-500">{APP_CONFIG.footer}</p>
      </aside>

      <main className="flex-1 min-w-0 p-4 md:p-8">
        <div className="max-w-6xl mx-auto space-y-6">{children}</div>
      </main>
    </div>
  );
}
