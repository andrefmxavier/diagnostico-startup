import { Home, Sparkles, LayoutDashboard } from 'lucide-react';
import HomePage from '../modules/home/HomePage.jsx';
import SkillsPage from '../modules/skills-consultivas/SkillsPage.jsx';
import DashboardPage from '../modules/dashboard-executivo/DashboardPage.jsx';

// Registro central de módulos. Para adicionar uma nova área à aplicação:
// 1. crie a pasta em src/modules/<nome-do-modulo>/ com o componente da página;
// 2. registre o módulo abaixo (id único, rótulo, ícone e componente).
export const MODULES = [
  {
    id: 'inicio',
    label: 'Início',
    description: 'Visão geral da Mentoria 2',
    icon: Home,
    component: HomePage,
  },
  {
    id: 'skills',
    label: 'Skills consultivas',
    description: 'Catálogo de skills e frameworks consultivos',
    icon: Sparkles,
    component: SkillsPage,
  },
  {
    id: 'dashboard',
    label: 'Dashboard executivo',
    description: 'Indicadores e visão executiva',
    icon: LayoutDashboard,
    component: DashboardPage,
  },
];

export const DEFAULT_MODULE_ID = MODULES[0].id;
