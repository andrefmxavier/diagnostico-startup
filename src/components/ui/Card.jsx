import React from 'react';

export default function Card({ className = '', children }) {
  return (
    <div className={`bg-slate-900 border border-slate-800 rounded-2xl p-5 ${className}`}>
      {children}
    </div>
  );
}
