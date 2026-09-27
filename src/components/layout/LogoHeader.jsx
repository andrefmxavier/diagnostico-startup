import React from 'react';
import { APP_CONFIG } from '../../config/app.js';

export default function LogoHeader() {
  return (
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-teal-400 via-teal-500 to-emerald-600 flex items-center justify-center font-black text-slate-950 shadow-lg shadow-teal-500/25 border border-teal-300/40 shrink-0">
        {APP_CONFIG.name.charAt(0)}
      </div>
      <div>
        <span className="font-black tracking-tight text-white block text-sm">
          {APP_CONFIG.name.toUpperCase()}
        </span>
        <span className="text-[10px] text-teal-300 font-bold tracking-widest uppercase block">
          {APP_CONFIG.product}
        </span>
      </div>
    </div>
  );
}
