import React from 'react';
import { Sparkles } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader.jsx';
import Card from '../../components/ui/Card.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import { SKILLS } from './skills.js';

export default function SkillsPage() {
  return (
    <>
      <PageHeader title="Skills consultivas" subtitle="Catálogo de skills e frameworks aplicados na mentoria" />
      {SKILLS.length === 0 ? (
        <EmptyState
          icon={Sparkles}
          title="Nenhuma skill cadastrada ainda"
          description="Adicione as skills em src/modules/skills-consultivas/skills.js para que apareçam aqui."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SKILLS.map(skill => (
            <Card key={skill.id}>
              <span className="text-[10px] uppercase tracking-widest font-bold text-teal-300">{skill.category}</span>
              <h2 className="text-base font-bold text-white mt-1">{skill.name}</h2>
              <p className="text-xs text-slate-400 mt-1">{skill.summary}</p>
              {skill.steps?.length > 0 && (
                <ol className="list-decimal list-inside text-xs text-slate-300 mt-3 space-y-1">
                  {skill.steps.map((step, i) => <li key={i}>{step}</li>)}
                </ol>
              )}
              {skill.deliverable && (
                <p className="text-xs text-slate-300 mt-3">
                  <span className="font-bold text-slate-200">Entregável:</span> {skill.deliverable}
                </p>
              )}
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
