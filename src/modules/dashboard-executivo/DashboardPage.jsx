import React from 'react';
import { LayoutDashboard } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader.jsx';
import StatCard from '../../components/ui/StatCard.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import { KPIS } from './kpis.js';

export default function DashboardPage() {
  return (
    <>
      <PageHeader title="Dashboard executivo" subtitle="Indicadores-chave para a tomada de decisão" />
      {KPIS.length === 0 ? (
        <EmptyState
          icon={LayoutDashboard}
          title="Nenhum indicador configurado ainda"
          description="Defina os KPIs em src/modules/dashboard-executivo/kpis.js ou conecte uma fonte de dados."
        />
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {KPIS.map(kpi => <StatCard key={kpi.id} label={kpi.label} value={kpi.value} hint={kpi.hint} />)}
        </div>
      )}
    </>
  );
}
