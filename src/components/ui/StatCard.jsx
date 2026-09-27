import React from 'react';
import Card from './Card.jsx';

export default function StatCard({ label, value, hint }) {
  return (
    <Card>
      <p className="text-[11px] uppercase tracking-widest font-bold text-slate-400">{label}</p>
      <p className="text-2xl font-black text-white mt-1">{value}</p>
      {hint && <p className="text-xs text-slate-500 mt-1">{hint}</p>}
    </Card>
  );
}
