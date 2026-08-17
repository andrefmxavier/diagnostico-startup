import React, { useState, useEffect } from 'react';
import { 
  Rocket, CheckCircle2, LayoutDashboard, FileText, Users, 
  Award, TrendingUp, Lock, ShieldAlert, Filter, Search, 
  ChevronRight, RefreshCw, LogOut, ArrowRight, Star, ChevronLeft,
  Building2, Activity, Zap, Layers, BarChart3, HelpCircle, Phone, 
  Printer, Share2, Scale, Target, BrainCircuit, Key, Download
} from 'lucide-react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend
} from 'recharts';

// ============================================================================
// 1. CONFIGURAÇÃO DAS 8 DIMENSÕES COM 5 PERGUNTAS CADA (TOTAL: 40 PERGUNTAS)
// ============================================================================
const GOVTECH_DIMENSIONS = [
  {
    id: 'estrategia',
    name: 'Estratégia & GovTech',
    description: 'Alinhamento com dores públicas, tese B2G e modelo de valor',
    questions: [
      { id: 'e1', text: 'O problema público abordado é uma dor prioritária e validada com gestores?' },
      { id: 'e2', text: 'A proposta de valor demonstra economia de recursos ou ganho de eficiência no setor público?' },
      { id: 'e3', text: 'A startup possui clareza do modelo de contratualização e vendas B2G (SaaS/Marco Legal)?' },
      { id: 'e4', text: 'Existe um planejamento claro de diferenciação perante soluções tradicionais/legadas?' },
      { id: 'e5', text: 'O mercado endereçável municipal/estadual foi quantificado de forma realista?' }
    ]
  },
  {
    id: 'lideranca',
    name: 'Liderança & Time',
    description: 'Dedicação dos fundadores, governança e complementaridade',
    questions: [
      { id: 'l1', text: 'Os fundadores possuem dedicação exclusiva (100% do tempo) ao negócio?' },
      { id: 'l2', text: 'A equipe possui habilidades complementares em Negócios, Tecnologia e Governo?' },
      { id: 'l3', text: 'A liderança possui rede de contatos ou conhecimento profundo da dinâmica pública?' },
      { id: 'l4', text: 'Existe um alinhamento claro de longo prazo entre os sócios (Vesting/Cap Table)?' },
      { id: 'l5', text: 'A liderança toma decisões baseadas em dados e métricas de desempenho?' }
    ]
  },
  {
    id: 'cultura',
    name: 'Cultura de Inovação',
    description: 'Apetite a testes, aprendizado rápido e capacidade de adaptação',
    questions: [
      { id: 'c1', text: 'A startup realiza experimentos rápidos para testar hipóteses com usuários reais?' },
      { id: 'c2', text: 'Existe tolerância a erros e capacidade comprovada de pivotagem quando necessário?' },
      { id: 'c3', text: 'O time promove diversidade e escuta ativa na construção das soluções?' },
      { id: 'c4', text: 'A equipe se atualiza continuamente sobre tendências GovTech e novas tecnologias?' },
      { id: 'c5', text: 'Os aprendizados das entrevistas e testes são documentados sistematicamente?' }
    ]
  },
  {
    id: 'pessoas',
    name: 'Pessoas & Competências',
    description: 'Capacidade de execução técnica, design e operações',
    questions: [
      { id: 'p1', text: 'A startup possui capacidade interna de desenvolvimento e evolução do produto?' },
      { id: 'p2', text: 'O time possui competências em UX/UI com foco na simplicidade para o cidadão/servidor?' },
      { id: 'p3', text: 'Existem papéis bem definidos para atendimento, suporte e pós-venda?' },
      { id: 'p4', text: 'A startup investe na capacitação continuada dos seus colaboradores?' },
      { id: 'p5', text: 'A equipe técnica consegue escalar o código com arquitetura moderna e segura?' }
    ]
  },
  {
    id: 'estrutura',
    name: 'Estrutura & Validação',
    description: 'Qualidade do MVP, tração inicial e provas de conceito (PoC)',
    questions: [
      { id: 'st1', text: 'A startup possui um MVP funcional em operação ou em testes piloto?' },
      { id: 'st2', text: 'Foram realizadas entrevistas estruturadas com pelo menos 15 atores do setor público?' },
      { id: 'st3', text: 'Existe comprovação de uso ativo (métricas de engajamento diário/semanal)?' },
      { id: 'st4', text: 'A solução possui validação de segurança da informação e LGPD?' },
      { id: 'st5', text: 'A arquitetura do software permite integração via APIs abertas com sistemas públicos?' }
    ]
  },
  {
    id: 'processos',
    name: 'Processos & Agilidade',
    description: 'Metodologias de desenvolvimento, vendas e gestão interna',
    questions: [
      { id: 'pr1', text: 'A startup utiliza metodologias ágeis (Scrum/Kanban) no desenvolvimento do produto?' },
      { id: 'pr2', text: 'O funil de vendas B2G está estruturado com etapas e critérios de avanço?' },
      { id: 'pr3', text: 'Existem rotinas de acompanhamento financeiro e DRE gerencial atualizada?' },
      { id: 'pr4', text: 'Os processos de suporte e atendimento possuem SLA (tempo de resposta) definido?' },
      { id: 'pr5', text: 'Existe um roteiro formal de Onboarding para novas prefeituras/órgãos clientes?' }
    ]
  },
  {
    id: 'recursos',
    name: 'Recursos & Runway',
    description: 'Saúde financeira, capacidade de captação e sustentabilidade',
    questions: [
      { id: 'r1', text: 'O tempo de sobrevida financeira (Runway) atual da startup é superior a 12 meses?' },
      { id: 'r2', text: 'A startup possui margem de contribuição positiva ou caminho claro para o breakeven?' },
      { id: 'r3', text: 'A equipe possui experiência na captação de editais de fomento (FINEP, Sebrae, CNPq)?' },
      { id: 'r4', text: 'O precificação do produto cobre custos operacionais com margem sustentável?' },
      { id: 'r5', text: 'A startup possui planejamento de alocação de capital para expansão de vendas?' }
    ]
  },
  {
    id: 'relacionamento',
    name: 'Relacionamento & Ecossistema',
    description: 'Parcerias estratégicas, ecossistema e relacionamento com clientes',
    questions: [
      { id: 're1', text: 'A startup participa ativamente de hubs de inovação, ecossistemas ou redes GovTech?' },
      { id: 're2', text: 'Existem parcerias formais com associações de municípios ou entidades de classe?' },
      { id: 're3', text: 'A startup possui case público de sucesso com depoimento/chancela de gestor?' },
      { id: 're4', text: 'Existe um canal aberto e contínuo para coleta de feedbacks dos usuários?' },
      { id: 're5', text: 'A empresa realiza ações de liderança de pensamento (artigos, webinars, eventos)?' }
    ]
  }
];

// Dados Iniciais de Teste
const INITIAL_STARTUPS = [
  {
    id: '1',
    startupName: 'AchaBuraco Gov',
    founder: 'Carlos Xavier',
    email: 'carlos@achaburaco.com.br',
    whatsapp: '(41) 99876-5432',
    segment: 'Cidades Inteligentes / Obras',
    stage: 'Tração',
    score: 154,
    date: '2026-02-10',
    dimensions: {
      'Estratégia & GovTech': 22,
      'Liderança & Time': 21,
      'Cultura de Inovação': 18,
      'Pessoas & Competências': 19,
      'Estrutura & Validação': 20,
      'Processos & Agilidade': 18,
      'Recursos & Runway': 16,
      'Relacionamento & Ecossistema': 20
    }
  },
  {
    id: '2',
    startupName: 'FilaZero Saúde',
    founder: 'Mariana Santos',
    email: 'mariana@filazero.gov.br',
    whatsapp: '(42) 99123-4567',
    segment: 'Saúde Pública / SUS',
    stage: 'Operação',
    score: 122,
    date: '2026-02-12',
    dimensions: {
      'Estratégia & GovTech': 18,
      'Liderança & Time': 16,
      'Cultura de Inovação': 15,
      'Pessoas & Competências': 14,
      'Estrutura & Validação': 16,
      'Processos & Agilidade': 15,
      'Recursos & Runway': 12,
      'Relacionamento & Ecossistema': 16
    }
  },
  {
    id: '3',
    startupName: 'WhatsAlvará',
    founder: 'Lucas Mendes',
    email: 'lucas@whatsalvara.io',
    whatsapp: '(43) 98877-6655',
    segment: 'Governança & Desburocratização',
    stage: 'Ideação',
    score: 86,
    date: '2026-02-15',
    dimensions: {
      'Estratégia & GovTech': 14,
      'Liderança & Time': 12,
      'Cultura de Inovação': 11,
      'Pessoas & Competências': 10,
      'Estrutura & Validação': 10,
      'Processos & Agilidade': 9,
      'Recursos & Runway': 8,
      'Relacionamento & Ecossistema': 12
    }
  }
];

export default function App() {
  // Controle de Perfis e Autenticação
  const [role, setRole] = useState(null); // 'startup' | 'admin' | null
  const [adminAuth, setAdminAuth] = useState(false);
  const [adminPin, setAdminPin] = useState(() => localStorage.getItem('hub_admin_pin') || 'admin123');
  const [passwordInput, setPasswordInput] = useState('');
  const [newPinInput, setNewPinInput] = useState('');
  const [pinChangeSuccess, setPinChangeSuccess] = useState(false);
  const [authError, setAuthError] = useState(false);

  // Submissões e Persistência
  const [submissions, setSubmissions] = useState(() => {
    const saved = localStorage.getItem('hub_govtech_submissions');
    return saved ? JSON.parse(saved) : INITIAL_STARTUPS;
  });

  // Estado do Formulário
  const [currentStep, setCurrentStep] = useState(0); // 0: Dados Iniciais, 1 a 8: Dimensões
  const [formData, setFormData] = useState({
    startupName: '',
    founder: '',
    email: '',
    whatsapp: '',
    segment: 'Cidades Inteligentes / Obras',
    responses: {}
  });
  const [submitted, setSubmitted] = useState(false);
  const [lastSubmission, setLastSubmission] = useState(null);

  // Estados do Dashboard do Admin
  const [activeAdminTab, setActiveAdminTab] = useState('dashboard'); // 'dashboard', 'plano_acao', 'benchmarking', 'config'
  const [selectedStartup, setSelectedStartup] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStageFilter, setSelectedStageFilter] = useState('Todos');
  const [benchmarkingSelected, setBenchmarkingSelected] = useState(['1', '2']);

  useEffect(() => {
    localStorage.setItem('hub_govtech_submissions', JSON.stringify(submissions));
  }, [submissions]);

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (passwordInput === adminPin) {
      setAdminAuth(true);
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  const handleChangePin = (e) => {
    e.preventDefault();
    if (newPinInput.length >= 4) {
      setAdminPin(newPinInput);
      localStorage.setItem('hub_admin_pin', newPinInput);
      setNewPinInput('');
      setPinChangeSuccess(true);
      setTimeout(() => setPinChangeSuccess(false), 3000);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const dimScores = {};
    let grandTotal = 0;

    GOVTECH_DIMENSIONS.forEach(dim => {
      let dimTotal = 0;
      dim.questions.forEach(q => {
        const score = formData.responses[q.id] || 0;
        dimTotal += score;
      });
      dimScores[dim.name] = dimTotal; // Máximo 25 pontos por dimensão
      grandTotal += dimTotal;
    });

    let stage = 'Ideação';
    if (grandTotal > 70 && grandTotal <= 120) stage = 'Operação';
    if (grandTotal > 120 && grandTotal <= 170) stage = 'Tração';
    if (grandTotal > 170) stage = 'Escala';

    const newEntry = {
      id: Date.now().toString(),
      startupName: formData.startupName,
      founder: formData.founder,
      email: formData.email,
      whatsapp: formData.whatsapp,
      segment: formData.segment,
      stage,
      score: grandTotal,
      date: new Date().toISOString().split('T')[0],
      dimensions: dimScores
    };

    setSubmissions(prev => [newEntry, ...prev]);
    setLastSubmission(newEntry);
    setSubmitted(true);
  };

  const getStageBadge = (stage) => {
    switch (stage) {
      case 'Ideação': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Operação': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Tração': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Escala': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  // Trilha de Recomendações por Dimensão
  const getActionPlanForDimension = (dimName, score) => {
    const percentage = (score / 25) * 100;
    if (percentage >= 80) {
      return { level: 'Avançado', meta: 'Referência / Escala', color: 'text-emerald-400', actions: ['Consolidar parcerias estratégicas B2G em nível estadual', 'Documentar cases de sucesso para republicação de editais', 'Apoiar outras startups do ecossistema como mentora de referência'] };
    } else if (percentage >= 50) {
      return { level: 'Médio', meta: 'Avançar para Referência', color: 'text-blue-400', actions: ['Estruturar métricas claras de economia gerada para o município', 'Aprimorar o processo de onboarding para servidores públicos', 'Adequar documentação técnica às normas do Marco Legal de Startups'] };
    } else {
      return { level: 'A Desenvolver', meta: 'Nível Médio', color: 'text-amber-400', actions: ['Realizar no mínimo 10 entrevistas presenciais com gestores públicos', 'Refinar a proposta de valor focando na dor direta do ordenador de despesa', 'Buscar mentoria técnica especializada no Hub GovTech'] };
    }
  };

  // ---------------------------------------------------------------------------
  // TELA 1: SELETOR DE PERFIL (LANDING COM ESTILO HUB GOVTECH PARANÁ)
  // ---------------------------------------------------------------------------
  if (!role) {
    return (
      <div className="min-h-screen bg-[#050F1A] text-slate-100 flex flex-col justify-between p-6 relative overflow-hidden font-sans">
        {/* Ambient Glows */}
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

        <header className="max-w-6xl mx-auto w-full flex justify-between items-center py-4 border-b border-slate-800/80 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center font-black text-slate-950 text-xl shadow-[0_0_20px_rgba(34,197,94,0.3)]">
              H
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-white block">HUB GOVTECH</span>
              <span className="text-[10px] text-emerald-400 font-bold tracking-widest uppercase">Paraná · PSE</span>
            </div>
          </div>
          <span className="text-xs font-semibold px-3.5 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400">
            Edital Nº 001/2026 · Ciclo 1
          </span>
        </header>

        <main className="max-w-4xl mx-auto w-full my-auto py-12 text-center space-y-10 z-10">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/25 rounded-full text-emerald-400 font-bold text-xs uppercase tracking-wider">
              <Zap className="h-3.5 w-3.5" /> Diagnóstico de Maturidade GovTech 2026
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white max-w-3xl mx-auto leading-tight">
              Transforme a dor do setor público em <span className="text-emerald-400 underline decoration-emerald-500/30">solução de impacto</span>
            </h1>
            <p className="text-slate-300 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
              Avaliação estratégica em 8 dimensões essenciais para startups que atuam ou desejam fornecer tecnologia para estados e municípios.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto text-left">
            <button
              onClick={() => setRole('startup')}
              className="bg-[#0A2035]/80 hover:bg-[#0D2D4A] border border-slate-700/80 hover:border-emerald-500/50 rounded-2xl p-6 transition-all duration-300 group flex flex-col justify-between shadow-2xl relative overflow-hidden"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform border border-emerald-500/20">
                  <Rocket className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">Área da Startup</h2>
                  <p className="text-xs text-slate-400 leading-relaxed mt-1">
                    Preencha o diagnóstico com 40 perguntas e receba instantaneamente o seu gráfico de radar e estágio de maturidade.
                  </p>
                </div>
              </div>
              <div className="mt-8 flex items-center text-xs font-bold text-emerald-400 gap-2 group-hover:translate-x-1 transition-transform">
                Iniciar Diagnóstico <ArrowRight className="h-4 w-4" />
              </div>
            </button>

            <button
              onClick={() => setRole('admin')}
              className="bg-[#0A2035]/80 hover:bg-[#0D2D4A] border border-slate-700/80 hover:border-purple-500/50 rounded-2xl p-6 transition-all duration-300 group flex flex-col justify-between shadow-2xl relative overflow-hidden"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 bg-purple-500/10 text-purple-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform border border-purple-500/20">
                  <ShieldAlert className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors">Painel do Administrador</h2>
                  <p className="text-xs text-slate-400 leading-relaxed mt-1">
                    Acesse os dashboards de safra, mapas de gaps, benchmarking entre startups e trilhas de conhecimento para mentoria.
                  </p>
                </div>
              </div>
              <div className="mt-8 flex items-center text-xs font-bold text-purple-400 gap-2 group-hover:translate-x-1 transition-transform">
                Acessar Área Restrita <Lock className="h-3.5 w-3.5" />
              </div>
            </button>
          </div>
        </main>

        <footer className="max-w-6xl mx-auto w-full text-center py-4 border-t border-slate-800/80 text-xs text-slate-500 z-10">
          Hub GovTech Paraná · PqTI · Sistema FIEP · Edital Nº 001/2026
        </footer>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // TELA 2: VISÃO DA STARTUP (FORMULÁRIO PASSO A PASSO COM RADAR FINAL)
  // ---------------------------------------------------------------------------
  if (role === 'startup') {
    return (
      <div className="min-h-screen bg-[#050F1A] text-slate-100 flex flex-col font-sans">
        <header className="bg-[#071828]/90 backdrop-blur-md border-b border-slate-800/80 py-4 px-8 flex justify-between items-center sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 text-slate-950 font-black flex items-center justify-center text-sm">H</div>
            <span className="font-bold text-sm tracking-wide text-white">Hub GovTech Paraná — Diagnóstico da Startup</span>
          </div>
          <button 
            onClick={() => { setRole(null); setSubmitted(false); setCurrentStep(0); }}
            className="text-xs font-medium text-slate-400 hover:text-white flex items-center gap-2 bg-[#0A2035] px-3.5 py-2 rounded-xl border border-slate-700 transition"
          >
            <LogOut className="h-3.5 w-3.5" /> Voltar ao Início
          </button>
        </header>

        <main className="max-w-4xl mx-auto w-full flex-1 py-10 px-4">
          {submitted ? (
            /* VISUALIZAÇÃO DO DIAGNÓSTICO FINAL DA STARTUP COM GRAFICO RADAR */
            <div className="bg-[#071828] border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-8 relative overflow-hidden">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-bold border border-emerald-500/20 mb-2">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Diagnóstico Concluído
                  </div>
                  <h1 className="text-2xl font-black text-white">{lastSubmission?.startupName}</h1>
                  <p className="text-xs text-slate-400 mt-0.5">Fundador: {lastSubmission?.founder} · Segmento: {lastSubmission?.segment}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-[#0A2035] p-3 rounded-2xl border border-slate-700 text-center min-w-[120px]">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Score Total</span>
                    <span className="text-2xl font-black text-emerald-400">{lastSubmission?.score} <span className="text-xs text-slate-500 font-normal">/200</span></span>
                  </div>
                  <div className="bg-[#0A2035] p-3 rounded-2xl border border-slate-700 text-center min-w-[120px]">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Estágio</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border inline-block mt-1 ${getStageBadge(lastSubmission?.stage)}`}>
                      {lastSubmission?.stage}
                    </span>
                  </div>
                </div>
              </div>

              {/* Gráfico de Radar da Startup */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="bg-[#050F1A] p-4 rounded-2xl border border-slate-800 h-72">
                  <h3 className="text-xs font-bold text-slate-400 uppercase mb-2 text-center">Radar de Maturidade (8 Dimensões)</h3>
                  <ResponsiveContainer width="100%" height="90%">
                    <RadarChart data={Object.entries(lastSubmission.dimensions).map(([key, val]) => ({ subject: key.split(' ')[0], A: val }))}>
                      <PolarGrid stroke="#1E293B" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#94A3B8', fontSize: 10 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 25]} stroke="#334155" />
                      <Radar name="Maturidade" dataKey="A" stroke="#22C55E" fill="#22C55E" fillOpacity={0.4} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-white mb-2">Pontuação Detalhada por Dimensão</h3>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {Object.entries(lastSubmission.dimensions).map(([dim, val]) => (
                      <div key={dim} className="bg-[#0A2035] p-2.5 rounded-xl border border-slate-800 flex justify-between items-center">
                        <span className="text-slate-300 font-medium truncate max-w-[130px]">{dim}</span>
                        <span className="font-extrabold text-emerald-400">{val} / 25 pts</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
                <p className="text-xs text-slate-400">As respostas foram salvas. A equipe de mentoria entrará em contato via WhatsApp.</p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setCurrentStep(0);
                    setFormData({ startupName: '', founder: '', email: '', whatsapp: '', segment: 'Cidades Inteligentes / Obras', responses: {} });
                  }}
                  className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition"
                >
                  Novo Preenchimento
                </button>
              </div>
            </div>
          ) : (
            /* FORMULÁRIO PASSO A PASSO */
            <div className="bg-[#071828] border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-8">
              {/* Stepper Header */}
              <div className="space-y-3 border-b border-slate-800 pb-6">
                <div className="flex justify-between items-center text-xs font-semibold text-slate-400">
                  <span>Passo {currentStep + 1} de {GOVTECH_DIMENSIONS.length + 1}</span>
                  <span className="text-emerald-400">{Math.round(((currentStep + 1) / (GOVTECH_DIMENSIONS.length + 1)) * 100)}% concluído</span>
                </div>
                <div className="h-2 w-full bg-[#050F1A] rounded-full overflow-hidden border border-slate-800">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300" 
                    style={{ width: `${((currentStep + 1) / (GOVTECH_DIMENSIONS.length + 1)) * 100}%` }}
                  />
                </div>
              </div>

              {/* ETAPA 0: DADOS DE CONTATO E WHATSAPP */}
              {currentStep === 0 ? (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-white">Identificação da Startup GovTech</h2>
                    <p className="text-xs text-slate-400 mt-1">Preencha os dados de contato do fundador para registro na safra 2026.</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Nome da Startup *</label>
                      <input 
                        type="text" required
                        value={formData.startupName}
                        onChange={e => setFormData({...formData, startupName: e.target.value})}
                        placeholder="Ex: AchaBuraco GovTech"
                        className="w-full px-4 py-2.5 bg-[#050F1A] border border-slate-800 rounded-xl text-sm outline-none focus:border-emerald-500 text-white"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Nome do Fundador *</label>
                        <input 
                          type="text" required
                          value={formData.founder}
                          onChange={e => setFormData({...formData, founder: e.target.value})}
                          placeholder="Ex: Carlos Xavier"
                          className="w-full px-4 py-2.5 bg-[#050F1A] border border-slate-800 rounded-xl text-sm outline-none focus:border-emerald-500 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">WhatsApp do Fundador *</label>
                        <input 
                          type="text" required
                          value={formData.whatsapp}
                          onChange={e => setFormData({...formData, whatsapp: e.target.value})}
                          placeholder="(41) 99999-8888"
                          className="w-full px-4 py-2.5 bg-[#050F1A] border border-slate-800 rounded-xl text-sm outline-none focus:border-emerald-500 text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">E-mail de Contato *</label>
                      <input 
                        type="email" required
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        placeholder="contato@startup.com.br"
                        className="w-full px-4 py-2.5 bg-[#050F1A] border border-slate-800 rounded-xl text-sm outline-none focus:border-emerald-500 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Segmento de Atuação Pública</label>
                      <select
                        value={formData.segment}
                        onChange={e => setFormData({...formData, segment: e.target.value})}
                        className="w-full px-4 py-2.5 bg-[#050F1A] border border-slate-800 rounded-xl text-sm outline-none focus:border-emerald-500 text-white"
                      >
                        <option value="Cidades Inteligentes / Obras">Cidades Inteligentes / Obras</option>
                        <option value="Saúde Pública / SUS">Saúde Pública / SUS</option>
                        <option value="Governança & Desburocratização">Governança & Desburocratização</option>
                        <option value="Educação Pública">Educação Pública</option>
                        <option value="Finanças & Arrecadação">Finanças & Arrecadação</option>
                        <option value="Segurança & Defesa Civil">Segurança & Defesa Civil</option>
                        <option value="Meio Ambiente & Sustentabilidade">Meio Ambiente & Sustentabilidade</option>
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (formData.startupName && formData.founder && formData.whatsapp && formData.email) {
                        setCurrentStep(1);
                      } else {
                        alert('Preencha todos os campos obrigatórios.');
                      }
                    }}
                    className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                  >
                    Iniciar Pergunta 1 de 40 <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                /* ETAPAS 1 A 8: DIMENSÕES COM 5 PERGUNTAS CADA */
                <div className="space-y-6">
                  {(() => {
                    const dim = GOVTECH_DIMENSIONS[currentStep - 1];
                    return (
                      <>
                        <div>
                          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block mb-1">
                            Dimensão {currentStep} de {GOVTECH_DIMENSIONS.length}
                          </span>
                          <h2 className="text-xl font-bold text-white">{dim.name}</h2>
                          <p className="text-xs text-slate-400 mt-1">{dim.description}</p>
                        </div>

                        <div className="space-y-5">
                          {dim.questions.map((q, idx) => (
                            <div key={q.id} className="p-4 bg-[#050F1A] border border-slate-800 rounded-2xl space-y-3">
                              <p className="text-xs font-semibold text-slate-200">
                                <span className="text-emerald-400 font-bold mr-2">Q{idx + 1}.</span>
                                {q.text}
                              </p>
                              
                              <div className="flex items-center justify-between gap-2 max-w-md mx-auto pt-1">
                                <span className="text-[10px] text-slate-500 font-semibold">1 - Discordo Totalmente</span>
                                <div className="flex gap-3">
                                  {[1, 2, 3, 4, 5].map(score => (
                                    <label key={score} className="flex flex-col items-center gap-1 cursor-pointer group">
                                      <input 
                                        type="radio" 
                                        name={q.id} 
                                        value={score}
                                        checked={formData.responses[q.id] === score}
                                        onChange={() => setFormData(prev => ({
                                          ...prev,
                                          responses: { ...prev.responses, [q.id]: score }
                                        }))}
                                        className="accent-emerald-500 h-4 w-4"
                                      />
                                      <span className="text-xs font-bold text-slate-400 group-hover:text-emerald-400 transition">
                                        {score}
                                      </span>
                                    </label>
                                  ))}
                                </div>
                                <span className="text-[10px] text-slate-500 font-semibold">5 - Concordo Totalmente</span>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="flex justify-between items-center pt-4">
                          <button
                            onClick={() => setCurrentStep(prev => prev - 1)}
                            className="px-4 py-2.5 bg-[#0A2035] hover:bg-slate-800 text-slate-300 font-bold rounded-xl text-xs flex items-center gap-1.5"
                          >
                            <ChevronLeft className="h-4 w-4" /> Anterior
                          </button>

                          {currentStep < GOVTECH_DIMENSIONS.length ? (
                            <button
                              onClick={() => {
                                const currentDimQuestions = dim.questions;
                                const answered = currentDimQuestions.every(q => formData.responses[q.id]);
                                if (!answered) {
                                  alert('Responda as 5 perguntas desta dimensão antes de avançar.');
                                  return;
                                }
                                setCurrentStep(prev => prev + 1);
                              }}
                              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5"
                            >
                              Próxima Dimensão <ChevronRight className="h-4 w-4" />
                            </button>
                          ) : (
                            <button
                              onClick={handleFormSubmit}
                              className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20"
                            >
                              Concluir & Ver Diagnóstico <CheckCircle2 className="h-4 w-4" />
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

  // ---------------------------------------------------------------------------
  // TELA 3: AUTENTICAÇÃO DO ADMINISTRADOR
  // ---------------------------------------------------------------------------
  if (role === 'admin' && !adminAuth) {
    return (
      <div className="min-h-screen bg-[#050F1A] flex items-center justify-center p-6 text-white font-sans">
        <div className="bg-[#071828] border border-slate-800 rounded-3xl p-8 max-w-md w-full space-y-6 shadow-2xl relative">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-purple-500/10 text-purple-400 rounded-2xl flex items-center justify-center mx-auto border border-purple-500/20">
              <Lock className="h-6 w-6" />
            </div>
            <h1 className="text-xl font-bold">Acesso Restrito — Avaliadores</h1>
            <p className="text-slate-400 text-xs">Digite a senha do painel para continuar.</p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Senha de Acesso</label>
              <input 
                type="password" 
                value={passwordInput}
                onChange={e => setPasswordInput(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-[#050F1A] border border-slate-800 rounded-xl text-sm outline-none focus:border-purple-500 text-white"
              />
            </div>

            {authError && (
              <p className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-xl text-center">
                Senha incorreta. Tente novamente.
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs transition"
            >
              Autenticar Painel
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

  // ---------------------------------------------------------------------------
  // TELA 4: DASHBOARD COMPLETO DO ADMINISTRADOR (IGUAL AOS PRINTS DE REFERÊNCIA)
  // ---------------------------------------------------------------------------
  const filteredSubmissions = submissions.filter(s => {
    const matchesSearch = s.startupName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.founder.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = selectedStageFilter === 'Todos' || s.stage === selectedStageFilter;
    return matchesSearch && matchesStage;
  });

  // Cálculos Consolidados para o Dashboard
  const avgOverallScore = submissions.length > 0
    ? (submissions.reduce((acc, curr) => acc + curr.score, 0) / submissions.length).toFixed(1)
    : 0;

  // Médias por Dimensão de Toda a Safra
  const dimAverages = {};
  GOVTECH_DIMENSIONS.forEach(dim => {
    const totalDimScore = submissions.reduce((acc, curr) => acc + (curr.dimensions[dim.name] || 0), 0);
    dimAverages[dim.name] = submissions.length > 0 ? (totalDimScore / submissions.length).toFixed(1) : 0;
  });

  // Melhor Dimensão & Dimensão a Desenvolver
  const sortedDimAverages = Object.entries(dimAverages).sort((a, b) => b[1] - a[1]);
  const bestDimension = sortedDimAverages[0] || ['N/A', 0];
  const worstDimension = sortedDimAverages[sortedDimAverages.length - 1] || ['N/A', 0];

  return (
    <div className="flex h-screen bg-[#050F1A] font-sans text-slate-100 overflow-hidden">
      {/* SIDEBAR DO ADMINISTRADOR (COM IDENTIDADE DO MATERIAL) */}
      <aside className="w-64 bg-[#071828] border-r border-slate-800 flex flex-col justify-between p-5">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center font-black text-slate-950 text-base">
              H
            </div>
            <div>
              <span className="font-extrabold text-sm block">Hub GovTech</span>
              <span className="text-[10px] text-emerald-400 font-bold uppercase">Painel de Mentoria</span>
            </div>
          </div>

          <nav className="space-y-1">
            <button 
              onClick={() => setActiveAdminTab('dashboard')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                activeAdminTab === 'dashboard' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:bg-[#0A2035]'
              }`}
            >
              <LayoutDashboard className="h-4 w-4" /> Visão Geral
            </button>
            <button 
              onClick={() => setActiveAdminTab('plano_acao')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                activeAdminTab === 'plano_acao' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:bg-[#0A2035]'
              }`}
            >
              <Target className="h-4 w-4" /> Trilha Recomendada
            </button>
            <button 
              onClick={() => setActiveAdminTab('benchmarking')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                activeAdminTab === 'benchmarking' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:bg-[#0A2035]'
              }`}
            >
              <Scale className="h-4 w-4" /> Benchmarking
            </button>
            <button 
              onClick={() => setActiveAdminTab('config')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                activeAdminTab === 'config' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:bg-[#0A2035]'
              }`}
            >
              <Key className="h-4 w-4" /> Configurar PIN
            </button>
          </nav>
        </div>

        <button 
          onClick={() => { setRole(null); setAdminAuth(false); }}
          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-xl hover:bg-[#0A2035] transition"
        >
          <LogOut className="h-4 w-4" /> Sair do Painel
        </button>
      </aside>

      {/* ÁREA PRINCIPAL DAS ABAS */}
      <main className="flex-1 overflow-y-auto p-8 space-y-6">
        
        {/* ==================================================================== */}
        {/* ABA 1: VISÃO GERAL (IGUAL AO PRINT 1) */}
        {/* ==================================================================== */}
        {activeAdminTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-[#071828] p-5 rounded-2xl border border-slate-800">
              <div>
                <h1 className="text-xl font-bold text-white">Dashboard de Maturidade GovTech</h1>
                <p className="text-xs text-slate-400">Hub GovTech Paraná · Ciclo de Aceleração 2026</p>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => {
                    if (window.confirm('Resetar dados para os iniciais de teste?')) {
                      localStorage.removeItem('hub_govtech_submissions');
                      setSubmissions(INITIAL_STARTUPS);
                    }
                  }}
                  className="text-xs flex items-center gap-1.5 text-slate-400 hover:text-white bg-[#0A2035] border border-slate-700 px-3 py-2 rounded-xl"
                >
                  <RefreshCw className="h-3.5 w-3.5" /> Resetar
                </button>
                <span className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl text-xs font-bold">
                  {submissions.length} Startups Ativas
                </span>
              </div>
            </div>

            {/* CARDS DE METRICAS PRINCIPAIS (IGUAL AO PRINT) */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-[#071828] p-4 rounded-2xl border border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Média Por Dimensão</span>
                <p className="text-2xl font-black text-white mt-1">{(avgOverallScore / 8).toFixed(1)} <span className="text-xs text-slate-500 font-normal">/25 pts</span></p>
              </div>
              <div className="bg-[#071828] p-4 rounded-2xl border border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Melhor Dimensão</span>
                <p className="text-xl font-black text-emerald-400 mt-1 truncate">{bestDimension[0]}</p>
                <span className="text-[10px] text-slate-500">{bestDimension[1]} / 25 pts média</span>
              </div>
              <div className="bg-[#071828] p-4 rounded-2xl border border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase">A Desenvolver</span>
                <p className="text-xl font-black text-amber-400 mt-1 truncate">{worstDimension[0]}</p>
                <span className="text-[10px] text-slate-500">{worstDimension[1]} / 25 pts média</span>
              </div>
              <div className="bg-[#071828] p-4 rounded-2xl border border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Organizações Mapeadas</span>
                <p className="text-2xl font-black text-purple-400 mt-1">{submissions.length}</p>
              </div>
            </div>

            {/* GRÁFICOS: RADAR DA SAFRA + COMPARATIVO BARRAS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#071828] p-5 rounded-2xl border border-slate-800 h-80">
                <h3 className="text-xs font-bold text-slate-400 uppercase mb-3">Radar de Maturidade da Safra</h3>
                <ResponsiveContainer width="100%" height="85%">
                  <RadarChart data={Object.entries(dimAverages).map(([key, val]) => ({ subject: key.split(' ')[0], A: Number(val) }))}>
                    <PolarGrid stroke="#1E293B" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#94A3B8', fontSize: 10 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 25]} stroke="#334155" />
                    <Radar name="Média Safra" dataKey="A" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.4} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-[#071828] p-5 rounded-2xl border border-slate-800 h-80">
                <h3 className="text-xs font-bold text-slate-400 uppercase mb-3">Comparativo por Dimensão (Média / 25)</h3>
                <ResponsiveContainer width="100%" height="85%">
                  <BarChart data={Object.entries(dimAverages).map(([key, val]) => ({ name: key.split(' ')[0], Score: Number(val) }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                    <XAxis dataKey="name" tick={{ fill: '#94A3B8', fontSize: 9 }} />
                    <YAxis domain={[0, 25]} tick={{ fill: '#94A3B8', fontSize: 10 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#0A2035', borderColor: '#334155', borderRadius: '8px' }} />
                    <Bar dataKey="Score" fill="#22C55E" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* TABELA DE STARTUPS */}
            <div className="bg-[#071828] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
              <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                <h3 className="font-bold text-white text-sm">Startups Inscritas</h3>
                <div className="flex gap-3">
                  <select
                    value={selectedStageFilter}
                    onChange={e => setSelectedStageFilter(e.target.value)}
                    className="px-3 py-1.5 bg-[#050F1A] border border-slate-800 rounded-xl text-xs text-slate-300 outline-none"
                  >
                    <option value="Todos">Todos os Estágios</option>
                    <option value="Ideação">Ideação</option>
                    <option value="Operação">Operação</option>
                    <option value="Tração">Tração</option>
                    <option value="Escala">Escala</option>
                  </select>
                  <div className="relative w-64">
                    <Search className="h-3.5 w-3.5 absolute left-3 top-2.5 text-slate-500" />
                    <input 
                      type="text"
                      placeholder="Buscar por nome ou fundador..."
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#050F1A] border border-slate-800 rounded-xl outline-none text-white"
                    />
                  </div>
                </div>
              </div>

              <table className="w-full text-left text-xs text-slate-400">
                <thead className="bg-[#050F1A] text-[10px] font-bold text-slate-500 uppercase border-b border-slate-800">
                  <tr>
                    <th className="px-5 py-3">Startup</th>
                    <th className="px-5 py-3">Fundador & WhatsApp</th>
                    <th className="px-5 py-3">Estágio</th>
                    <th className="px-5 py-3">Score Total</th>
                    <th className="px-5 py-3">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filteredSubmissions.map((s) => (
                    <tr key={s.id} className="hover:bg-[#0A2035] transition">
                      <td className="px-5 py-3.5 font-bold text-white">
                        {s.startupName}
                        <span className="block text-[10px] text-slate-500 font-normal">{s.segment}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="font-semibold text-slate-200 block">{s.founder}</span>
                        <span className="text-emerald-400 text-[10px] flex items-center gap-1">
                          <Phone className="h-3 w-3" /> {s.whatsapp}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStageBadge(s.stage)}`}>
                          {s.stage}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 font-black text-white">{s.score} / 200</td>
                      <td className="px-5 py-3.5">
                        <button 
                          onClick={() => setSelectedStartup(s)}
                          className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1"
                        >
                          Ver Detalhes <ChevronRight className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* ABA 2: TRILHA RECOMENDADA & PLANO DE AÇÃO (IGUAL AO PRINT 2) */}
        {/* ==================================================================== */}
        {activeAdminTab === 'plano_acao' && (
          <div className="space-y-6">
            <div className="bg-[#071828] p-5 rounded-2xl border border-slate-800 flex justify-between items-center">
              <div>
                <h1 className="text-xl font-bold text-white">Trilha Recomendada & Plano de Ação</h1>
                <p className="text-xs text-slate-400">Selecione uma startup para visualizar as recomendações individuais ou o plano da incubadora.</p>
              </div>
              <div className="w-64">
                <select
                  onChange={e => {
                    const found = submissions.find(s => s.id === e.target.value);
                    setSelectedStartup(found || null);
                  }}
                  className="w-full px-3 py-2 bg-[#050F1A] border border-slate-800 rounded-xl text-xs text-white"
                >
                  <option value="">Selecione uma Startup...</option>
                  {submissions.map(s => (
                    <option key={s.id} value={s.id}>{s.startupName} ({s.stage})</option>
                  ))}
                </select>
              </div>
            </div>

            {selectedStartup ? (
              <div className="space-y-6">
                <div className="bg-[#0A2035] p-4 rounded-2xl border border-slate-700 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-400 uppercase">Trilha Individual</span>
                    <h2 className="text-lg font-bold text-white">{selectedStartup.startupName}</h2>
                  </div>
                  <button 
                    onClick={() => window.print()}
                    className="px-4 py-2 bg-emerald-500 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5"
                  >
                    <Printer className="h-4 w-4" /> Imprimir Relatório PDF
                  </button>
                </div>

                {/* GRID DE CARDS POR DIMENSÃO (ESTILO DO PRINT 2) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(selectedStartup.dimensions).map(([dimName, score]) => {
                    const plan = getActionPlanForDimension(dimName, score);
                    return (
                      <div key={dimName} className="bg-[#071828] p-5 rounded-2xl border border-slate-800 space-y-3">
                        <div className="flex justify-between items-start border-b border-slate-800 pb-3">
                          <div>
                            <h3 className="font-bold text-white text-sm">{dimName}</h3>
                            <span className={`text-xs font-bold ${plan.color}`}>{score} / 25 pts ({plan.level})</span>
                          </div>
                          <span className="text-[10px] bg-[#0A2035] px-2.5 py-1 rounded-full text-slate-400 border border-slate-700">
                            Meta: {plan.meta}
                          </span>
                        </div>
                        <ul className="space-y-2">
                          {plan.actions.map((act, i) => (
                            <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                              <span>{act}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* PLANO COLETIVO DE CONHECIMENTO DA INCUBADORA */
              <div className="bg-[#071828] p-6 rounded-2xl border border-slate-800 space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-white">Mapeamento de Conhecimento da Incubadora (Safra 2026)</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Trilha de workshops coletivos recomendados com base nas maiores dificuldades da safra.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-[#0A2035] p-4 rounded-xl border border-slate-700 space-y-2">
                    <span className="text-[10px] font-bold text-amber-400 uppercase">Maior Gargalo Coletivo</span>
                    <h3 className="font-bold text-white text-sm">{worstDimension[0]}</h3>
                    <p className="text-xs text-slate-400">Recomendado: Workshop intensivo sobre o Marco Legal de Startups e contratação pública B2G.</p>
                  </div>
                  <div className="bg-[#0A2035] p-4 rounded-xl border border-slate-700 space-y-2">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase">Fortaleza da Safra</span>
                    <h3 className="font-bold text-white text-sm">{bestDimension[0]}</h3>
                    <p className="text-xs text-slate-400">Aproveitar a maturidade das startups líderes para mentoria cruzada entre pares.</p>
                  </div>
                  <div className="bg-[#0A2035] p-4 rounded-xl border border-slate-700 space-y-2">
                    <span className="text-[10px] font-bold text-purple-400 uppercase">Ação Geral da Incubadora</span>
                    <h3 className="font-bold text-white text-sm">Sessão de Bancas Mapeadas</h3>
                    <p className="text-xs text-slate-400">Organizar rodadas de pitch com prefeitos e secretários municipais convidados.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================================================================== */}
        {/* ABA 3: BENCHMARKING COMPARATIVO (IGUAL AO PRINT 3) */}
        {/* ==================================================================== */}
        {activeAdminTab === 'benchmarking' && (
          <div className="space-y-6">
            <div className="bg-[#071828] p-5 rounded-2xl border border-slate-800">
              <h1 className="text-xl font-bold text-white">Benchmarking entre Startups</h1>
              <p className="text-xs text-slate-400">Selecione até 3 startups para comparar seus radares e dimensões lado a lado.</p>
            </div>

            {/* SELEÇÃO DAS STARTUPS (IGUAL AO PRINT 3) */}
            <div className="bg-[#071828] p-5 rounded-2xl border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase">Selecione para Comparar:</span>
              <div className="flex flex-wrap gap-2">
                {submissions.map(s => {
                  const isSelected = benchmarkingSelected.includes(s.id);
                  return (
                    <button
                      key={s.id}
                      onClick={() => {
                        if (isSelected) {
                          setBenchmarkingSelected(benchmarkingSelected.filter(id => id !== s.id));
                        } else if (benchmarkingSelected.length < 3) {
                          setBenchmarkingSelected([...benchmarkingSelected, s.id]);
                        } else {
                          alert('Selecione no máximo 3 startups por vez.');
                        }
                      }}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition ${
                        isSelected 
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500' 
                          : 'bg-[#050F1A] text-slate-400 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {s.startupName}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CARDS COMPARATIVOS E GRÁFICO BARRAS DUPLO */}
            {benchmarkingSelected.length > 0 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {benchmarkingSelected.map(id => {
                    const s = submissions.find(item => item.id === id);
                    if (!s) return null;
                    return (
                      <div key={s.id} className="bg-[#071828] p-4 rounded-2xl border border-slate-800 space-y-2">
                        <h3 className="font-bold text-white text-base">{s.startupName}</h3>
                        <p className="text-2xl font-black text-emerald-400">{s.score} <span className="text-xs font-normal text-slate-500">/200</span></p>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border inline-block ${getStageBadge(s.stage)}`}>
                          {s.stage}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="bg-[#071828] p-5 rounded-2xl border border-slate-800 h-96">
                  <h3 className="text-xs font-bold text-slate-400 uppercase mb-4">Comparativo Direto por Dimensão</h3>
                  <ResponsiveContainer width="100%" height="85%">
                    <BarChart data={GOVTECH_DIMENSIONS.map(d => {
                      const entry = { name: d.name.split(' ')[0] };
                      benchmarkingSelected.forEach(id => {
                        const s = submissions.find(item => item.id === id);
                        if (s) entry[s.startupName] = s.dimensions[d.name] || 0;
                      });
                      return entry;
                    })}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                      <XAxis dataKey="name" tick={{ fill: '#94A3B8', fontSize: 9 }} />
                      <YAxis domain={[0, 25]} tick={{ fill: '#94A3B8', fontSize: 10 }} />
                      <Tooltip contentStyle={{ backgroundColor: '#0A2035', borderColor: '#334155', borderRadius: '8px' }} />
                      <Legend />
                      <Bar dataKey={submissions.find(s => s.id === benchmarkingSelected[0])?.startupName} fill="#22C55E" radius={[4, 4, 0, 0]} />
                      {benchmarkingSelected[1] && <Bar dataKey={submissions.find(s => s.id === benchmarkingSelected[1])?.startupName} fill="#3B82F6" radius={[4, 4, 0, 0]} />}
                      {benchmarkingSelected[2] && <Bar dataKey={submissions.find(s => s.id === benchmarkingSelected[2])?.startupName} fill="#A855F7" radius={[4, 4, 0, 0]} />}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================================================================== */}
        {/* ABA 4: CONFIGURAR PIN / ALTERAR SENHA */}
        {/* ==================================================================== */}
        {activeAdminTab === 'config' && (
          <div className="max-w-md bg-[#071828] p-6 rounded-2xl border border-slate-800 space-y-4">
            <div>
              <h2 className="text-lg font-bold text-white">Alterar Senha do Administrador</h2>
              <p className="text-xs text-slate-400 mt-0.5">Defina uma nova senha de acesso ao painel interno da incubadora.</p>
            </div>

            <form onSubmit={handleChangePin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Nova Senha / PIN</label>
                <input 
                  type="text" required
                  value={newPinInput}
                  onChange={e => setNewPinInput(e.target.value)}
                  placeholder="Mínimo 4 caracteres"
                  className="w-full px-4 py-2.5 bg-[#050F1A] border border-slate-800 rounded-xl text-sm outline-none text-white focus:border-emerald-500"
                />
              </div>

              {pinChangeSuccess && (
                <p className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-xl text-center">
                  Senha alterada com sucesso!
                </p>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition"
              >
                Salvar Nova Senha
              </button>
            </form>
          </div>
        )}

        {/* MODAL DE DETALHES DE UMA STARTUP SELECIONADA */}
        {selectedStartup && activeAdminTab === 'dashboard' && (
          <div className="fixed inset-0 bg-[#050F1A]/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div className="bg-[#071828] border border-slate-800 rounded-3xl max-w-2xl w-full p-6 space-y-6 shadow-2xl">
              <div className="flex justify-between items-start border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-white">{selectedStartup.startupName}</h2>
                  <p className="text-xs text-slate-400">Fundador: {selectedStartup.founder} · WhatsApp: {selectedStartup.whatsapp}</p>
                </div>
                <button 
                  onClick={() => setSelectedStartup(null)}
                  className="text-xs font-bold bg-[#0A2035] hover:bg-slate-800 text-slate-300 px-3 py-1.5 rounded-xl"
                >
                  Fechar
                </button>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={Object.entries(selectedStartup.dimensions).map(([key, val]) => ({ subject: key.split(' ')[0], A: val }))}>
                    <PolarGrid stroke="#1E293B" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#94A3B8', fontSize: 10 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 25]} stroke="#334155" />
                    <Radar name="Maturidade" dataKey="A" stroke="#22C55E" fill="#22C55E" fillOpacity={0.4} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-4 gap-2 text-center">
                {Object.entries(selectedStartup.dimensions).map(([key, val]) => (
                  <div key={key} className="bg-[#050F1A] p-2.5 rounded-xl border border-slate-800">
                    <span className="text-[9px] text-slate-500 font-bold block truncate">{key}</span>
                    <span className="text-xs font-extrabold text-emerald-400 mt-0.5 block">{val} / 25</span>
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
