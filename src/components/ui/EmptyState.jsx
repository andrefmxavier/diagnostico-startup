import React from 'react';
import { Inbox } from 'lucide-react';

export default function EmptyState({ icon: Icon = Inbox, title, description }) {
  return (
    <div className="border border-dashed border-slate-700 rounded-2xl p-8 text-center space-y-2">
      <Icon className="h-6 w-6 text-slate-500 mx-auto" />
      <p className="text-sm font-bold text-slate-200">{title}</p>
      {description && <p className="text-xs text-slate-400 max-w-md mx-auto">{description}</p>}
    </div>
  );
}
