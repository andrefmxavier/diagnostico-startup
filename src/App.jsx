import React, { useState } from 'react';
import { 
  BarChart2, Shield, Rocket, CheckCircle2, LayoutDashboard, 
  FileText, Users, Award, TrendingUp, HelpCircle, ExternalLink 
} from 'lucide-react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid 
} from 'recharts';

const DIMENSION_QUESTIONS = [
  {
    id: 'modelo',
    name: 'Modelo de Negócio',
    questions: [
      { id: 'p1', text: 'O problema do cliente está validado com métricas claras de dor?', weight: 5 },
      { id: 'p2', text: 'A proposta de valor e a forma de monetização já geram receita recorrente?', weight: 5 }
    ]
  },
  {
    id: 'tecnologia',
    name: 'Tecnologia & IA',
    questions: [
      { id: 'p3', text: 'A startup utiliza IA Generativa ou automações para ganhar escala no produto/operação?', weight: 5 },
      { id: 'p4', text: 'Possui arquitetura própria e controle sobre a Propriedade Intelectual (IP)?', weight: 5 }
    ]
  },
  {
    id: 'vendas',
    name: 'Marketing & Vendas',
    questions: [
      { id: 'p5', text: 'O funil de aquisição possui métricas claras (CAC, LTV e Churn acompanhados)?', weight: 5 },
      { id: 'p6', text: 'Possui estratégia ativa de atração de clientes (Inbound, Outbound ou PLG)?', weight: 5 }
    ]
  },
  {
    id: 'financeiro',
    name: 'Financeiro & Unit Economics',
    questions: [
      { id: 'p7', text: 'O tempo de sobrevida financeira (Runway) atual é superior a 12 meses?', weight: 5 },
      { id: 'p8', text: 'A startup possui DRE gerencial atualizada e margem de contribuição positiva?', weight: 5 }
    ]
  },
  {
    id: 'pessoas',
    name: 'Pessoas & Gestão',
    questions: [
      { id: 'p9', text: 'Os fundadores possuem dedicação 100% exclusiva ao negócio?', weight: 5 },
      { id: 'p10', text: 'A equipe técnica e de negócios possui competências complementares?', weight: 5 }
    ]
  },
  {
    id: 'juridico',
    name: 'Jurídico & LGPD',
    questions: [
      { id: 'p11', text: 'O acordo de sócios (Vesting/Cap Table) e contrato social estão formalizados?', weight: 5 },
      { id: 'p12', text: 'A empresa está em conformidade com as diretrizes da LGPD e proteção de dados?', weight: 5 }
    ]
  }
];

const MOCK_STARTUPS = [
  { name: 'TechFlow AI', stage: 'Tração', score: 82, modelo: 85, tecnologia: 90, vendas: 80, financeiro: 75, pessoas: 85, juridico: 75 },
  { name: 'AgroData', stage: 'Operação', score: 58, modelo: 60, tecnologia: 65, vendas: 50, financeiro: 55, pessoas: 60, juridico: 50 },
  { name: 'HealthSync', stage: 'Ideação', score: 28, modelo: 30, tecnologia: 35, vendas: 20, financeiro: 25, pessoas: 30, juridico: 25 }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('form');
  const [formData, setFormData] = useState({ startupName: '', founder: '', email: '', responses: {} });
  const [completed, setCompleted] = useState(false);

  const handleOptionChange = (questionId, value) => {
    setFormData(prev => ({
      ...prev,
      responses: { ...prev.responses, [questionId]: Number(value) }
    }));
  };

  const calculateScore = () => {
    const values = Object.values(formData.responses);
    if (values.length === 0) return 0;
    const total = values.reduce((acc, curr) => acc + curr, 0);
    return Math.round((total / (DIMENSION_QUESTIONS.length * 2 * 5)) * 100);
  };

  const getStage = (score) => {
    if (score <= 30) return { label: 'Ideação', color: 'bg-amber-100 text-amber-800' };
    if (score <= 60) return { label: 'Operação', color: 'bg-blue-100 text-blue-800' };
    if (score <= 85) return { label: 'Tração', color: 'bg-emerald-100 text-emerald-800' };
    return { label: 'Escala', color: 'bg-purple-100 text-purple-800' };
  };

  const currentScore = calculateScore();
  const currentStage = getStage(currentScore);

  return (
    <div className="flex h-screen bg-slate-100 font-sans">
      <div className="w-64 bg-slate-900 text-white flex flex-col justify-between p-4">
        <div>
          <div className="flex items-center gap-3 mb-8 px-2">
            <Rocket className="h-7 w-7 text-teal-400" />
            <span className="font-bold text-lg tracking-wide">Incubadora Hub</span>
          </div>

          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('form')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                activeTab === 'form' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              <FileText className="h-4 w-4" /> Formulário Startup
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                activeTab === 'dashboard' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              <LayoutDashboard className="h-4 w-4" /> Dashboard Bastidores
            </button>
          </nav>
        </div>

        <div className="text-xs text-slate-500 border-t border-slate-800 pt-4 px-2">
          Diagnóstico de Maturidade 2026
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8">
        {activeTab === 'form' ? (
          <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Diagnóstico de Maturidade da Startup</h1>
            <p className="text-slate-600 text-sm mb-6">Preencha as informações para receber a classificação automática de estágio.</p>

            {completed ? (
              <div className="text-center py-12 space-y-4">
                <CheckCircle2 className="h-16 w-16 text-emerald-500 mx-auto" />
                <h2 className="text-2xl font-bold text-slate-800">Diagnóstico Concluído!</h2>
                <div className="inline-block px-4 py-2 rounded-full text-sm font-bold bg-teal-50 text-teal-700">
                  Pontuação: {currentScore}/100
                </div>
                <div className="block">
                  Estágio Mapeado: <span className={`px-3 py-1 rounded-full text-xs font-bold ${currentStage.color}`}>{currentStage.label}</span>
                </div>
                <button 
                  onClick={() => { setCompleted(false); setFormData({ startupName: '', founder: '', email: '', responses: {} }); }} 
                  className="mt-6 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium"
                >
                  Novo Preenchimento
                </button>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setCompleted(true); }} className="space-y-8">
                <div className="grid grid-cols-2 gap-4 pb-6 border-b border-slate-200">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Nome da Startup</label>
                    <input 
                      type="text" required 
                      value={formData.startupName} 
                      onChange={e => setFormData({...formData, startupName: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-teal-500 outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Nome do Fundador</label>
                    <input 
                      type="text" required 
                      value={formData.founder} 
                      onChange={e => setFormData({...formData, founder: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-teal-500 outline-none" 
                    />
                  </div>
                </div>

                {DIMENSION_QUESTIONS.map(dim => (
                  <div key={dim.id} className="space-y-4">
                    <h3 className="font-bold text-slate-800 text-md border-b pb-1">{dim.name}</h3>
                    {dim.questions.map(q => (
                      <div key={q.id} className="bg-slate-50 p-4 rounded-lg space-y-2">
                        <p className="text-sm font-medium text-slate-700">{q.text}</p>
                        <div className="flex gap-4">
                          {[1, 2, 3, 4, 5].map(score => (
                            <label key={score} className="flex items-center gap-1 text-xs text-slate-600 cursor-pointer">
                              <input 
                                type="radio" 
                                name={q.id} 
                                value={score} 
                                required
                                onChange={(e) => handleOptionChange(q.id, e.target.value)}
                              />
                              Nível {score}
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}

                <button type="submit" className="w-full py-3 bg-teal-600 text-white rounded-lg font-bold hover:bg-teal-700 transition">
                  Enviar Diagnóstico
                </button>
              </form>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Visão Geral dos Bastidores</h1>
                <p className="text-slate-500 text-sm">Acompanhamento consolidado de todas as startups diagnosticadas.</p>
              </div>
              <span className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-xs font-bold">Safra 2026</span>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <span className="text-xs font-semibold text-slate-400">Total de Startups</span>
                <p className="text-2xl font-bold text-slate-800 mt-1">{MOCK_STARTUPS.length}</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <span className="text-xs font-semibold text-slate-400">Média Geral</span>
                <p className="text-2xl font-bold text-teal-600 mt-1">56 pts</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <span className="text-xs font-semibold text-slate-400">Dimensão Mais Forte</span>
                <p className="text-2xl font-bold text-emerald-600 mt-1">Tecnologia</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <span className="text-xs font-semibold text-slate-400">Maior Gaps</span>
                <p className="text-2xl font-bold text-amber-600 mt-1">Financeiro</p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200">
                <h3 className="font-bold text-slate-800">Startups Inscritas</h3>
              </div>
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-xs font-semibold text-slate-400 uppercase border-b">
                  <tr>
                    <th className="px-6 py-3">Startup</th>
                    <th className="px-6 py-3">Estágio</th>
                    <th className="px-6 py-3">Pontuação</th>
                    <th className="px-6 py-3">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {MOCK_STARTUPS.map((s, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-semibold text-slate-800">{s.name}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStage(s.score).color}`}>
                          {s.stage}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-700">{s.score}/100</td>
                      <td className="px-6 py-4">
                        <button className="text-teal-600 font-semibold hover:underline">Ver Detalhes</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
