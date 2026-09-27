import React, { useState } from 'react';
import AppShell from './components/layout/AppShell.jsx';
import { MODULES, DEFAULT_MODULE_ID } from './config/modules.js';

export default function App() {
  const [activeModuleId, setActiveModuleId] = useState(DEFAULT_MODULE_ID);
  const activeModule = MODULES.find(m => m.id === activeModuleId) || MODULES[0];
  const Page = activeModule.component;

  return (
    <AppShell modules={MODULES} activeModuleId={activeModule.id} onNavigate={setActiveModuleId}>
      <Page modules={MODULES} onNavigate={setActiveModuleId} />
    </AppShell>
  );
}
