import React from 'react';
import { ArrowRight } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader.jsx';
import Card from '../../components/ui/Card.jsx';
import { APP_CONFIG } from '../../config/app.js';

export default function HomePage({ modules, onNavigate }) {
  const areas = modules.filter(m => m.id !== 'inicio');

  return (
    <>
      <PageHeader title={`${APP_CONFIG.name} · ${APP_CONFIG.product}`} subtitle={APP_CONFIG.tagline} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {areas.map(({ id, label, description, icon: Icon }) => (
          <button key={id} onClick={() => onNavigate(id)} className="text-left">
            <Card className="hover:border-teal-500/60 transition h-full">
              <div className="w-10 h-10 bg-teal-500/15 text-teal-300 rounded-xl flex items-center justify-center border border-teal-500/25">
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="text-base font-bold text-white mt-3">{label}</h2>
              <p className="text-xs text-slate-400 mt-1">{description}</p>
              <span className="mt-4 flex items-center text-xs font-bold text-teal-300 gap-2">
                Acessar <ArrowRight className="h-4 w-4" />
              </span>
            </Card>
          </button>
        ))}
      </div>
    </>
  );
}
