import React, { useState, useEffect } from 'react';
import { 
  Rocket, CheckCircle2, LayoutDashboard, FileText, Users, 
  Award, TrendingUp, Lock, ShieldAlert, Filter, Search, 
  ChevronRight, RefreshCw, LogOut, ArrowRight, Star, ChevronLeft,
  Building2, Activity, Zap, Layers, BarChart3, HelpCircle
} from 'lucide-react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid 
} from 'recharts';

const DIMENSION_QUESTIONS = [
  {
    id: 'modelo',
    name: 'Modelo de Negócio',
    description: 'Validação de problema, proposta de valor e monetização',
    questions: [
      { id: 'p1', text: 'O problema do cliente está validado com métricas claras de dor?', weight: 5 },
      { id: 'p2', text: 'A proposta de valor e a forma de monetização já geram receita recorrente?', weight: 5 }
    ]
  },
  {
    id: 'tecnologia',
    name: 'Tecnologia & IA',
    description: 'Arquitetura de produto, escalabilidade e diferenciação',
    questions: [
      { id: 'p3', text: 'A startup utiliza IA Generativa ou automações para ganhar escala no produto/operação?', weight: 5 },
      { id: 'p4', text: 'Possui arquitetura própria e controle sobre a Propriedade Intelectual (IP)?', weight: 5 }
    ]
  },
  {
    id: 'vendas',
    name: 'Marketing & Go-To-Market',
    description: 'Canais de tração, métricas de aquisição e retenção',
    questions: [
      { id: 'p5', text: 'O funil de aquisição possui métricas claras (CAC, LTV e Churn acompanhados)?', weight: 5 },
      { id: 'p6', text: 'Possui estratégia ativa de atração de clientes (Inbound, Outbound ou PLG)?', weight: 5 }
    ]
  },
  {
    id: 'financeiro',
    name: 'Financeiro & Unit Economics',
    description: 'Planejamento de caixa, margens e governança financeira',
    questions: [
      { id: 'p7', text: 'O tempo de sobrevida financeira (Runway) atual é superior a 12 meses?', weight: 5 },
      { id: 'p8', text: 'A startup possui DRE gerencial atualizada e margem de contribuição positiva?', weight: 5 }
    ]
  },
  {
    id: 'pessoas',
    name: 'Pessoas & Liderança',
    description: 'Dedicação do time fundador e complementaridade técnica',
    questions: [
      { id: 'p9', text: 'Os fundadores possuem dedicação 100% exclusiva ao negócio?', weight: 5 },
      { id: 'p10', text: 'A equipe técnica e de negócios possui competências complementares?', weight: 5 }
    ]
  },
  {
    id: 'juridico',
    name: 'Jurídico & Regulação',
    description: 'Formalização societária, cap table e compliance LGPD',
    questions: [
      { id: 'p11', text: 'O acordo de sócios (Vesting/Cap Table) e contrato social estão formalizados?', weight: 5 },
      { id: 'p12', text: 'A empresa está em conformidade com as diretrizes da LGPD e proteção de dados?', weight: 5 }
    ]
  }
];

const INITIAL_MOCK_DATA = [
  { 
    id: '1', 
    startupName: 'TechFlow AI', 
    founder: 'Carlos Eduardo', 
    email: 'carlos@techflow.ai', 
    stage: 'Tração', 
    score: 82, 
    date: '2026-02-10',
    dimensions: { 'Modelo de Negócio': 85, 'Tecnologia & IA': 90, 'Marketing & Go-To-Market': 80, 'Financeiro & Unit Economics': 75, 'Pessoas & Liderança': 85, 'Jurídico & Regulação': 75 } 
  },
  { 
    id: '2', 
    startupName: 'AgroData Systems', 
    founder: 'Mariana Silva', 
    email: 'mariana@agrodata.com', 
    stage: 'Operação', 
    score: 58, 
    date: '2026-02-12',
    dimensions: { 'Modelo de Negócio': 60, 'Tecnologia & IA': 70, 'Marketing & Go-To-Market': 50, 'Financeiro & Unit Economics': 50, 'Pessoas & Liderança': 60, 'Jurídico & Regulação': 60 } 
  },
  { 
    id: '3', 
    startupName: 'HealthSync Bio', 
    founder: 'Lucas Mendes', 
    email: 'lucas@healthsync.io', 
    stage: 'Ideação', 
    score: 28, 
    date: '2026-02-15',
    dimensions: { 'Modelo de Negócio': 30, 'Tecnologia & IA': 40, 'Marketing & Go-To-Market': 20, 'Financeiro & Unit Economics': 20, 'Pessoas & Liderança': 30, 'Jurídico & Regulação': 30 } 
  }
];

export default function App() {
  const [role, setRole] = useState(null); // 'startup' | 'admin' | null
  const [adminAuth, setAdminAuth] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState(false);

  const [submissions, setSubmissions] = useState(() => {
    const saved = localStorage.getItem('hub_submissions');
    return saved ? JSON.parse(saved) : INITIAL_MOCK_DATA;
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    startupName: '',
    founder: '',
    email: '',
    segment: 'SaaS B2B',
    responses: {}
  });
  const [submitted, setSubmitted] = useState(false);
  const [lastSubmission, setLastSubmission] = useState(null);
  const [selectedStartup, setSelectedStartup] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStageFilter, setSelectedStageFilter] = useState('Todos');

  useEffect(() => {
    localStorage.setItem('hub_submissions', JSON.stringify(submissions));
  }, [submissions]);

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (passwordInput === 'admin123') {
      setAdminAuth(true);
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const dimScores = {};
    DIMENSION_QUESTIONS.forEach(dim => {
      let dimTotal = 0;
      let count = 0;
      dim.questions.forEach(q => {
        const val = formData.responses[q.id] || 0;
        dimTotal += val;
        count += 1;
      });
      dimScores[dim.name] = Math.round((dimTotal / (count * 5)) * 100);
    });

    const totalVal = Object.values(formData.responses).reduce((a, b) => a + b, 0);
    const maxVal = DIMENSION_QUESTIONS.length * 2 * 5;
    const finalScore = Math.round((totalVal / maxVal) * 100);

    let stage = 'Ideação';
    if (finalScore > 30 && finalScore <= 60) stage = 'Operação';
    if (finalScore > 60 && finalScore <= 85) stage = 'Tração';
    if (finalScore > 85) stage = 'Escala';

    const newEntry = {
      id: Date.now().toString(),
      startupName: formData.startupName,
      founder: formData.founder,
      email: formData.email,
      segment: formData.segment,
      stage,
      score: finalScore,
      date: new Date().toISOString().split('T')[0],
      dimensions: dimScores
    };

    setSubmissions(prev => [newEntry, ...prev]);
    setLastSubmission(newEntry);
    setSubmitted(true);
  };

  const getStageBadge = (stage) => {
    switch (stage) {
      case 'Ideação': return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      case 'Operação': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'Tração': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
      case 'Escala': return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
      default: return 'bg-slate-500/10 text-slate-600 border-slate-500/20';
    }
  };

  // -------------------------------------------------------------
  // TELA INICIAL: SELETOR DE PERFIL
  // -------------------------------------------------------------
  if (!role) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-6 relative overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <header className="max-w-6xl mx-auto w-full flex justify-between items-center py-4 border-b border-slate-800/60 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-tr from-teal-500 to-emerald-400 rounded-xl text-slate-950 font-black">
              <Rocket className="h-5 w-5" />
            </div>
            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              Hub Incubadora
            </span>
          </div>
          <span className="text-xs font-semibold px-3 py-1 bg-slate-900 border border-slate-800 rounded-full text-slate-400">
            Programa Safra 2026
          </span>
        </header>

        <main className="max-w-4xl mx-auto w-full my-auto py-12 text-center space-y-10 z-10">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-teal-500/10 border border-teal-500/20 rounded-full text-teal-400 font-medium text-xs">
              <Zap className="h-3.5 w-3.5" /> Diagnóstico de Maturidade Estratégica
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white max-w-2xl mx-auto leading-tight">
              Acelere a evolução da sua startup com dados precisos
            </h1>
            <p className="text-slate-400 text-sm md:text-base max-w-xl mx-auto">
              Plataforma integrada de avaliação de governança, tecnologia, tração e unit economics para o ecossistema de inovação.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto text-left">
            <button
              onClick={() => setRole('startup')}
              className="bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-teal-500/50 rounded-2xl p-6 transition-all duration-300 group flex flex-col justify-between shadow-2xl hover:shadow-teal-500/5 relative overflow-hidden"
            >
              <div className="space-y-4">
                <div className="p-3 bg-teal-500/10 text-teal-400 rounded-xl w-fit group-hover:scale-110 transition-transform">
                  <Rocket className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white group-hover:text-teal-400 transition-colors">Sou Startup / Fundador</h2>
                  <p className="text-xs text-slate-400 leading-relaxed mt-1">
                    Preencha a autoavaliação guiada para receber sua pontuação de maturidade e mapear gargalos de tração.
                  </p>
                </div>
              </div>
              <div className="mt-8 flex items-center text-xs font-bold text-teal-400 gap-2 group-hover:translate-x-1 transition-transform">
                Iniciar Diagnóstico <ArrowRight className="h-4 w-4" />
              </div>
            </button>

            <button
              onClick={() => setRole('admin')}
              className="bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-purple-500/50 rounded-2xl p-6 transition-all duration-300 group flex flex-col justify-between shadow-2xl hover:shadow-purple-500/5 relative overflow-hidden"
            >
              <div className="space-y-4">
                <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl w-fit group-hover:scale-110 transition-transform">
                  <ShieldAlert className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors">Avaliadores & Mentores</h2>
                  <p className="text-xs text-slate-400 leading-relaxed mt-1">
                    Painel administrativo restrito para análise comparativa de radares de maturidade e seleção de projetos.
                  </p>
                </div>
              </div>
              <div className="mt-8 flex items-center text-xs font-bold text-purple-400 gap-2 group-hover:translate-x-1 transition-transform">
                Acessar Dashboard Interno <Lock className="h-3.5 w-3.5" />
              </div>
            </button>
          </div>
        </main>

        <footer className="max-w-6xl mx-auto w-full text-center py-4 border-t border-slate-800/60 text-xs text-slate-600 z-10">
          © 2026 Hub de Inovação & Incubação. Todos os direitos reservados.
        </footer>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VISÃO DO FUNDADOR (FORMULÁRIO PASSO A PASSO)
  // -------------------------------------------------------------
  if (role === 'startup') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 py-4 px-8 flex justify-between items-center sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <Rocket className="h-5 w-5 text-teal-400" />
            <span className="font-bold text-sm tracking-wide text-white">Hub Diagnóstico — Startup</span>
          </div>
          <button 
            onClick={() => { setRole(null); setSubmitted(false); setCurrentStep(0); }}
            className="text-xs font-medium text-slate-400 hover:text-white flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 transition"
          >
            <LogOut className="h-3.5 w-3.5" /> Encerrar
          </button>
        </header>

        <main className="max-w-3xl mx-auto w-full flex-1 py-10 px-4">
          {submitted ? (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 text-center space-y-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
              
              <div className="p-4 bg-emerald-500/10 text-emerald-400 rounded-2xl w-fit mx-auto border border-emerald-500/20">
                <CheckCircle2 className="h-10 w-10" />
              </div>

              <div className="space-y-2">
                <h1 className="text-2xl font-black text-white">Diagnóstico Registrado!</h1>
                <p className="text-slate-400 text-xs max-w-md mx-auto">
                  A autoavaliação da startup <strong className="text-white">{lastSubmission?.startupName}</strong> foi adicionada à base da incubadora.
                </p>
              </div>

              <div className="bg-slate-950/80 rounded-2xl p-6 border border-slate-800/80 max-w-sm mx-auto grid grid-cols-2 gap-4 text-left">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Score Geral</span>
                  <p className="text-3xl font-black text-teal-400 mt-1">{lastSubmission?.score}<span className="text-xs text-slate-500 font-normal">/100</span></p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Estágio</span>
                  <div className="mt-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStageBadge(lastSubmission?.stage)}`}>
                      {lastSubmission?.stage}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setSubmitted(false);
                  setCurrentStep(0);
                  setFormData({ startupName: '', founder: '', email: '', segment: 'SaaS B2B', responses: {} });
                }}
                className="px-6 py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs transition shadow-lg shadow-teal-500/10"
              >
                Preencher Novo Formulário
              </button>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-8">
              {/* Stepper Progress Header */}
              <div className="space-y-3 border-b border-slate-800 pb-6">
                <div className="flex justify-between items-center text-xs font-semibold text-slate-400">
                  <span>Passo {currentStep + 1} de {DIMENSION_QUESTIONS.length + 1}</span>
                  <span className="text-teal-400">{Math.round(((currentStep + 1) / (DIMENSION_QUESTIONS.length + 1)) * 100)}% concluído</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all duration-300" 
                    style={{ width: `${((currentStep + 1) / (DIMENSION_QUESTIONS.length + 1)) * 100}%` }}
                  />
                </div>
              </div>

              {/* Etapa 0: Dados Iniciais */}
              {currentStep === 0 ? (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-white">Informações da Startup</h2>
                    <p className="text-xs text-slate-400 mt-1">Identifique o seu negócio antes de responder ao questionário.</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Nome da Startup *</label>
                      <input 
                        type="text" required
                        value={formData.startupName}
                        onChange={e => setFormData({...formData, startupName: e.target.value})}
                        placeholder="Ex: AgroData Systems"
                        className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm outline-none focus:border-teal-500 text-white"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Nome do Fundador *</label>
                        <input 
                          type="text" required
                          value={formData.founder}
                          onChange={e => setFormData({...formData, founder: e.target.value})}
                          placeholder="Ex: Mariana Silva"
                          className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm outline-none focus:border-teal-500 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">E-mail de Contato *</label>
                        <input 
                          type="email" required
                          value={formData.email}
                          onChange={e => setFormData({...formData, email: e.target.value})}
                          placeholder="mariana@agrodata.com"
                          className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm outline-none focus:border-teal-500 text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Segmento de Atuação</label>
                      <select
                        value={formData.segment}
                        onChange={e => setFormData({...formData, segment: e.target.value})}
                        className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm outline-none focus:border-teal-500 text-white"
                      >
                        <option value="SaaS B2B">SaaS B2B</option>
                        <option value="Agtech">Agtech</option>
                        <option value="Healthtech">Healthtech</option>
                        <option value="Fintech">Fintech</option>
                        <option value="Edtech">Edtech</option>
                        <option value="Outro">Outro</option>
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (formData.startupName && formData.founder && formData.email) {
                        setCurrentStep(1);
                      } else {
                        alert('Preencha os campos obrigatórios para continuar.');
                      }
                    }}
                    className="w-full py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs transition flex items-center justify-center gap-2"
                  >
                    Iniciar Perguntas de Maturidade <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                /* Etapas de Pergunta por Dimensão */
                <div className="space-y-6">
                  {(() => {
                    const dim = DIMENSION_QUESTIONS[currentStep - 1];
                    return (
                      <>
                        <div>
                          <span className="text-[10px] font-bold text-teal-400 uppercase tracking-widest block mb-1">
                            Dimensão {currentStep} de {DIMENSION_QUESTIONS.length}
                          </span>
                          <h2 className="text-xl font-bold text-white">{dim.name}</h2>
                          <p className="text-xs text-slate-400 mt-1">{dim.description}</p>
                        </div>

                        <div className="space-y-6">
                          {dim.questions.map(q => (
                            <div key={q.id} className="p-5 bg-slate-950/60 border border-slate-800/80 rounded-2xl space-y-4">
                              <p className="text-sm font-medium text-slate-200">{q.text}</p>
                              
                              <div className="flex items-center justify-between gap-2 max-w-md mx-auto">
                                <span className="text-[10px] text-slate-500 font-semibold">1 - Inexistente</span>
                                <div className="flex gap-4">
                                  {[1, 2, 3, 4, 5].map(score => (
                                    <label key={score} className="flex flex-col items-center gap-1.5 cursor-pointer group">
                                      <input 
                                        type="radio" 
                                        name={q.id} 
                                        value={score}
                                        checked={formData.responses[q.id] === score}
                                        onChange={() => setFormData(prev => ({
                                          ...prev,
                                          responses: { ...prev.responses, [q.id]: score }
                                        }))}
                                        className="accent-teal-500 h-4 w-4"
                                      />
                                      <span className="text-xs font-bold text-slate-400 group-hover:text-teal-400 transition">
                                        {score}
                                      </span>
                                    </label>
                                  ))}
                                </div>
                                <span className="text-[10px] text-slate-500 font-semibold">5 - Avançado</span>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="flex justify-between items-center pt-4">
                          <button
                            onClick={() => setCurrentStep(prev => prev - 1)}
                            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs flex items-center gap-1.5"
                          >
                            <ChevronLeft className="h-4 w-4" /> Voltar
                          </button>

                          {currentStep < DIMENSION_QUESTIONS.length ? (
                            <button
                              onClick={() => {
                                const currentDimQuestions = dim.questions;
                                const answered = currentDimQuestions.every(q => formData.responses[q.id]);
                                if (!answered) {
                                  alert('Por favor, responda a todas as perguntas dessa dimensão.');
                                  return;
                                }
                                setCurrentStep(prev => prev + 1);
                              }}
                              className="px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5"
                            >
                              Próxima Dimensão <ChevronRight className="h-4 w-4" />
                            </button>
                          ) : (
                            <button
                              onClick={handleFormSubmit}
                              className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20"
                            >
                              Finalizar & Enviar Diagnóstico <CheckCircle2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    );
  }

  // -------------------------------------------------------------
  // AUTENTICAÇÃO DO ADMIN
  // -------------------------------------------------------------
  if (role === 'admin' && !adminAuth) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-white relative">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md w-full space-y-6 shadow-2xl relative z-10">
          <div className="text-center space-y-2">
            <div className="p-3 bg-purple-500/10 text-purple-400 rounded-2xl w-fit mx-auto border border-purple-500/20">
              <Lock className="h-6 w-6" />
            </div>
            <h1 className="text-xl font-bold">Acesso Restrito ao Painel</h1>
            <p className="text-slate-400 text-xs">Digite o PIN da incubadora para acessar o dashboard de avaliadores.</p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">PIN de Segurança</label>
              <input 
                type="password" 
                value={passwordInput}
                onChange={e => setPasswordInput(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm outline-none focus:border-purple-500 text-white"
              />
              <span className="text-[10px] text-slate-500 mt-1.5 block">Senha padrão de testes: <strong className="text-purple-400">admin123</strong></span>
            </div>

            {authError && (
              <p className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-xl text-center">
                PIN incorreto. Tente novamente.
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs transition"
            >
              Autenticar Acesso
            </button>
          </form>

          <button 
            onClick={() => setRole(null)}
            className="w-full text-xs text-slate-500 hover:text-slate-300 text-center block"
          >
            ← Voltar à página inicial
          </button>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // DASHBOARD DA INCUBADORA (ADMIN)
  // -------------------------------------------------------------
  const filteredSubmissions = submissions.filter(s => {
    const matchesSearch = s.startupName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.founder.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = selectedStageFilter === 'Todos' || s.stage === selectedStageFilter;
    return matchesSearch && matchesStage;
  });

  const avgScore = submissions.length > 0
    ? Math.round(submissions.reduce((acc, curr) => acc + curr.score, 0) / submissions.length)
    : 0;

  return (
    <div className="flex h-screen bg-slate-950 font-sans text-slate-100 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800/80 flex flex-col justify-between p-5">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/10 text-purple-400 rounded-xl border border-purple-500/20">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <span className="font-extrabold text-sm block">Hub Admin</span>
              <span className="text-[10px] text-slate-400">Avaliadores</span>
            </div>
          </div>

          <nav className="space-y-1">
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold bg-purple-600 text-white">
              <LayoutDashboard className="h-4 w-4" /> Visão Geral Safra
            </button>
          </nav>
        </div>

        <button 
          onClick={() => { setRole(null); setAdminAuth(false); }}
          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
        >
          <LogOut className="h-4 w-4" /> Sair do Painel
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Monitor de Maturidade das Startups</h1>
            <p className="text-slate-400 text-xs mt-0.5">Visão unificada das inscrições e radares de desempenho.</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                if (window.confirm('Deseja resetar a base para os dados de teste padrão?')) {
                  localStorage.removeItem('hub_submissions');
                  setSubmissions(INITIAL_MOCK_DATA);
                }
              }}
              className="text-xs flex items-center gap-1.5 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 px-3.5 py-2 rounded-xl font-medium transition"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Resetar Dados
            </button>
            <span className="px-3.5 py-2 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-xl text-xs font-bold">
              Safra 2026
            </span>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-xl">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Mapeado</span>
            <p className="text-3xl font-black text-white mt-2">{submissions.length}</p>
          </div>
          <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-xl">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Média de Maturidade</span>
            <p className="text-3xl font-black text-teal-400 mt-2">{avgScore} <span className="text-xs text-slate-500 font-normal">/100</span></p>
          </div>
          <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-xl">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tração & Escala</span>
            <p className="text-3xl font-black text-emerald-400 mt-2">
              {submissions.filter(s => s.stage === 'Tração' || s.stage === 'Escala').length}
            </p>
          </div>
          <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-xl">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Necessitam Mentoria</span>
            <p className="text-3xl font-black text-amber-400 mt-2">
              {submissions.filter(s => s.score < 50).length}
            </p>
          </div>
        </div>

        {/* Tabela de Startups */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-5 border-b border-slate-800 flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-900/50">
            <h3 className="font-bold text-white text-sm">Startups Avaliadas</h3>
            
            <div className="flex gap-3 w-full md:w-auto">
              <select
                value={selectedStageFilter}
                onChange={e => setSelectedStageFilter(e.target.value)}
                className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 outline-none"
              >
                <option value="Todos">Todos os Estágios</option>
                <option value="Ideação">Ideação</option>
                <option value="Operação">Operação</option>
                <option value="Tração">Tração</option>
                <option value="Escala">Escala</option>
              </select>

              <div className="relative flex-1 md:w-64">
                <Search className="h-3.5 w-3.5 absolute left-3 top-2.5 text-slate-500" />
                <input 
                  type="text"
                  placeholder="Buscar startup ou fundador..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-xl outline-none focus:border-purple-500 text-white"
                />
              </div>
            </div>
          </div>

          <table className="w-full text-left text-xs text-slate-400">
            <thead className="bg-slate-950 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-6 py-3.5">Startup</th>
                <th className="px-6 py-3.5">Fundador</th>
                <th className="px-6 py-3.5">Estágio</th>
                <th className="px-6 py-3.5">Score</th>
                <th className="px-6 py-3.5">Data</th>
                <th className="px-6 py-3.5">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredSubmissions.map((s) => (
                <tr key={s.id} className="hover:bg-slate-800/40 transition">
                  <td className="px-6 py-4 font-bold text-white">{s.startupName}</td>
                  <td className="px-6 py-4">{s.founder}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStageBadge(s.stage)}`}>
                      {s.stage}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-black text-slate-200">{s.score}/100</td>
                  <td className="px-6 py-4 text-slate-500">{s.date}</td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => setSelectedStartup(s)}
                      className="text-xs font-bold text-purple-400 hover:text-purple-300 hover:underline flex items-center gap-1"
                    >
                      Análise Radar <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal de Detalhes com Radar Chart */}
        {selectedStartup && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 space-y-6 shadow-2xl">
              <div className="flex justify-between items-start border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-white">{selectedStartup.startupName}</h2>
                  <p className="text-xs text-slate-400">Fundador: {selectedStartup.founder} ({selectedStartup.email})</p>
                </div>
                <button 
                  onClick={() => setSelectedStartup(null)}
                  className="text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-xl transition"
                >
                  Fechar
                </button>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={Object.entries(selectedStartup.dimensions).map(([key, val]) => ({ subject: key, A: val }))}>
                    <PolarGrid stroke="#334155" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" />
                    <Radar name="Startup" dataKey="A" stroke="#a855f7" fill="#a855f7" fillOpacity={0.4} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-3 gap-2.5 pt-2">
                {Object.entries(selectedStartup.dimensions).map(([key, val]) => (
                  <div key={key} className="bg-slate-950 p-3 rounded-2xl border border-slate-800/80 text-center">
                    <span className="text-[10px] text-slate-500 font-bold block truncate">{key}</span>
                    <span className="text-sm font-black text-white mt-0.5 block">{val}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
