import React, { useState, useEffect } from 'react';
import { 
  Rocket, CheckCircle2, LayoutDashboard, FileText, Users, 
  Award, TrendingUp, Lock, ShieldAlert, Filter, Search, 
  ChevronRight, RefreshCw, LogOut, ArrowRight, Star, ChevronLeft,
  Building2, Activity, Zap, Layers, BarChart3, HelpCircle, Phone, 
  Printer, Share2, Scale, Target, BrainCircuit, Key, Download, Trash2,
  BookOpen, Calendar, CheckSquare, Link as LinkIcon, Cpu
} from 'lucide-react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend
} from 'recharts';

// ============================================================================
// 1. CONFIGURAÇÃO DAS 8 DIMENSÕES COM TECNOLOGIA (5 PERGUNTAS CADA = 40 TOTAL)
// ============================================================================
const GOVTECH_DIMENSIONS = [
  {
    id: 'estrategia',
    name: 'Estratégia & Tese de Mercado',
    description: 'Alinhamento com dores do cliente, tese de mercado e modelo de valor',
    questions: [
      { id: 'e1', text: 'O problema abordado é uma dor prioritária e validada diretamente com clientes reais?' },
      { id: 'e2', text: 'A proposta de valor demonstra economia de recursos ou ganho direto de eficiência?' },
      { id: 'e3', text: 'A startup possui clareza do modelo de contratualização e vendas (SaaS, B2B ou B2G)?' },
      { id: 'e4', text: 'Existe um planejamento claro de diferenciação perante soluções tradicionais/legadas?' },
      { id: 'e5', text: 'O mercado endereçável (TAM/SAM/SOM) foi quantificado de forma realista e fundamentada?' }
    ]
  },
  {
    id: 'lideranca',
    name: 'Liderança & Time',
    description: 'Dedicação dos fundadores, governança e complementaridade',
    questions: [
      { id: 'l1', text: 'Os fundadores possuem dedicação exclusiva (100% do tempo) ao negócio?' },
      { id: 'l2', text: 'A equipe possui habilidades complementares em Negócios, Tecnologia e Operações?' },
      { id: 'l3', text: 'A liderança possui rede de contatos ou conhecimento profundo do setor de atuação?' },
      { id: 'l4', text: 'Existe um alinhamento claro de longo prazo entre os sócios (Vesting e Cap Table formalizados)?' },
      { id: 'l5', text: 'A liderança toma decisões baseadas em dados e métricas de desempenho semanais?' }
    ]
  },
  {
    id: 'tecnologia',
    name: 'Tecnologia, IA & Propriedade Intelectual',
    description: 'Arquitetura de software, automação, IA Generativa e controle de IP',
    questions: [
      { id: 't1', text: 'A startup possui arquitetura própria de software e controle total sobre a propriedade intelectual (IP)?' },
      { id: 't2', text: 'Utiliza IA Generativa, Machine Learning ou automações para ganhar escala no produto?' },
      { id: 't3', text: 'A plataforma possui APIs abertas e facilidade de integração com sistemas legados?' },
      { id: 't4', text: 'A infraestrutura em nuvem é escalável, segura e possui redundância/backup automatizado?' },
      { id: 't5', text: 'O desenvolvimento segue boas práticas de segurança cibernética e conformidade LGPD?' }
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
      { id: 'c4', text: 'A equipe se atualiza continuamente sobre tendências tecnológicas do mercado?' },
      { id: 'c5', text: 'Os aprendizados das entrevistas e testes são documentados sistematicamente?' }
    ]
  },
  {
    id: 'pessoas',
    name: 'Pessoas & Competências',
    description: 'Capacidade de execução técnica, design de experiência e suporte',
    questions: [
      { id: 'p1', text: 'A startup possui capacidade interna de desenvolvimento e evolução do produto?' },
      { id: 'p2', text: 'O time possui competências em UX/UI com foco na simplicidade para o usuário final?' },
      { id: 'p3', text: 'Existem papéis bem definidos para atendimento, suporte e Customer Success?' },
      { id: 'p4', text: 'A startup investe na capacitação continuada dos seus colaboradores?' },
      { id: 'p5', text: 'A equipe técnica consegue escalar o código com agilidade e qualidade?' }
    ]
  },
  {
    id: 'estrutura',
    name: 'Estrutura, Produto & Validação',
    description: 'Qualidade do MVP, tração inicial e provas de conceito (PoC)',
    questions: [
      { id: 'st1', text: 'A startup possui um MVP funcional em operação ou em testes piloto?' },
      { id: 'st2', text: 'Foram realizadas entrevistas estruturadas com pelo menos 20 potenciais clientes?' },
      { id: 'st3', text: 'Existe comprovação de uso ativo (métricas de engajamento diário/semanal)?' },
      { id: 'st4', text: 'A solução possui validação jurídica e contratual do modelo de negócio?' },
      { id: 'st5', text: 'O produto resolve a dor principal de forma significativamente mais rápida que os concorrentes?' }
    ]
  },
  {
    id: 'processos',
    name: 'Processos & Agilidade',
    description: 'Metodologias de desenvolvimento, vendas e gestão interna',
    questions: [
      { id: 'pr1', text: 'A startup utiliza metodologias ágeis (Scrum/Kanban) no desenvolvimento do produto?' },
      { id: 'pr2', text: 'O funil de vendas (Inbound/Outbound) está estruturado com etapas e métricas de conversão?' },
      { id: 'pr3', text: 'Existem rotinas de acompanhamento financeiro e DRE gerencial atualizada mensalmente?' },
      { id: 'pr4', text: 'Os processos de suporte e atendimento possuem SLA (tempo de resposta) definido?' },
      { id: 'pr5', text: 'Existe um roteiro formal de Onboarding para novos clientes contratantes?' }
    ]
  },
  {
    id: 'recursos',
    name: 'Recursos, Runway & B2G',
    description: 'Saúde financeira, tempo de sobrevida e captação de recursos',
    questions: [
      { id: 'r1', text: 'O tempo de sobrevida financeira (Runway) atual da startup é superior a 12 meses?' },
      { id: 'r2', text: 'A startup possui margem de contribuição positiva ou caminho claro para o breakeven?' },
      { id: 'r3', text: 'A equipe possui experiência na captação de editas de fomento (FINEP, Sebrae, CNPq) ou investimento?' },
      { id: 'r4', text: 'A precificação do produto cobre custos operacionais com margem de lucro sustentável?' },
      { id: 'r5', text: 'A startup possui planejamento de alocação de capital para expansão de vendas?' }
    ]
  }
];

// Lista de 30 Módulos de Conteúdo da Trilha Anual Recomendada
const ANNUAL_CURRICULUM = [
  // Q1 - Módulos Prioridade Alta (1 a 8)
  { id: 1, quarter: 'Q1', title: 'Validação de Problema e Entrevistas com Clientes', dim: 'Estrutura, Produto & Validação', priority: 'Alta' },
  { id: 2, quarter: 'Q1', title: 'Modelagem de Proposta de Valor e Tese B2B/B2G', dim: 'Estratégia & Tese de Mercado', priority: 'Alta' },
  { id: 3, quarter: 'Q1', title: 'Construção de MVP Funcional de Baixo Custo', dim: 'Estrutura, Produto & Validação', priority: 'Alta' },
  { id: 4, quarter: 'Q1', title: 'Arquitetura de Software e Segurança LGPD', dim: 'Tecnologia, IA & Propriedade Intelectual', priority: 'Alta' },
  { id: 5, quarter: 'Q1', title: 'Vesting, Cap Table e Acordo de Sócios', dim: 'Liderança & Time', priority: 'Alta' },
  { id: 6, quarter: 'Q1', title: 'Introdução à Contratação e Marco Legal de Startups', dim: 'Estratégia & Tese de Mercado', priority: 'Alta' },
  { id: 7, quarter: 'Q1', title: 'DRE Gerencial e Controle de Cash Burn', dim: 'Recursos, Runway & B2G', priority: 'Alta' },
  { id: 8, quarter: 'Q1', title: 'UX/UI: Design de Interfaces para Usuário Final', dim: 'Pessoas & Competências', priority: 'Média' },

  // Q2 - Módulos Prioridade Alta / Média (9 a 16)
  { id: 9, quarter: 'Q2', title: 'Implementação de IA Generativa no Produto', dim: 'Tecnologia, IA & Propriedade Intelectual', priority: 'Alta' },
  { id: 10, quarter: 'Q2', title: 'Funil de Vendas B2B e Métricas de Conversão', dim: 'Processos & Agilidade', priority: 'Alta' },
  { id: 11, quarter: 'Q2', title: 'Captação de Fomento Aberto (FINEP / Sebrae / CNPq)', dim: 'Recursos, Runway & B2G', priority: 'Alta' },
  { id: 12, quarter: 'Q2', title: 'Gestão Ágil de Projetos com Scrum e Kanban', dim: 'Processos & Agilidade', priority: 'Média' },
  { id: 13, quarter: 'Q2', title: 'Documentação e Proteção da Propriedade Intelectual', dim: 'Tecnologia, IA & Propriedade Intelectual', priority: 'Média' },
  { id: 14, quarter: 'Q2', title: 'Atendimento ao Cliente e Onboarding Estruturado', dim: 'Processos & Agilidade', priority: 'Média' },
  { id: 15, quarter: 'Q2', title: 'Cultura de Experimentação e Testes A/B', dim: 'Cultura de Inovação', priority: 'Média' },
  { id: 16, quarter: 'Q2', title: 'Estratégia de Marketing de Conteúdo e Outbound', dim: 'Processos & Agilidade', priority: 'Média' },

  // Q3 - Módulos Prioridade Média (17 a 23)
  { id: 17, quarter: 'Q3', title: 'Métricas Avançadas: CAC, LTV, Churn e LTV/CAC', dim: 'Recursos, Runway & B2G', priority: 'Média' },
  { id: 18, quarter: 'Q3', title: 'Modelos de Licitação, Dispensa e Pregão Eletrônico', dim: 'Estratégia & Tese de Mercado', priority: 'Média' },
  { id: 19, quarter: 'Q3', title: 'Integração de APIs e Interoperabilidade de Dados', dim: 'Tecnologia, IA & Propriedade Intelectual', priority: 'Média' },
  { id: 20, quarter: 'Q3', title: 'SLA de Atendimento e Retenção de Clientes', dim: 'Pessoas & Competências', priority: 'Média' },
  { id: 21, quarter: 'Q3', title: 'Gestão de Pessoas e Retenção de Talentos Dev', dim: 'Pessoas & Competências', priority: 'Média' },
  { id: 22, quarter: 'Q3', title: 'Provas de Conceito (PoC) com Órgãos e Empresas', dim: 'Estrutura, Produto & Validação', priority: 'Média' },
  { id: 23, quarter: 'Q3', title: 'Governança Corporativa e Conselho Consultivo', dim: 'Liderança & Time', priority: 'Média' },

  // Q4 - Módulos Prioridade Avançada (24 a 30)
  { id: 24, quarter: 'Q4', title: 'Preparação para Rodadas de Investimento Anjo e VC', dim: 'Recursos, Runway & B2G', priority: 'Média' },
  { id: 25, quarter: 'Q4', title: 'Escalabilidade de Servidores em Nuvem e DevOps', dim: 'Tecnologia, IA & Propriedade Intelectual', priority: 'Baixa' },
  { id: 26, quarter: 'Q4', title: 'Estratégias de Expansão Nacional e Franquias', dim: 'Estratégia & Tese de Mercado', priority: 'Baixa' },
  { id: 27, quarter: 'Q4', title: 'Construção de Casos de Sucesso e Depoimentos', dim: 'Estrutura, Produto & Validação', priority: 'Baixa' },
  { id: 28, quarter: 'Q4', title: 'Participação em Eventos e Feiras do Setor', dim: 'Cultura de Inovação', priority: 'Baixa' },
  { id: 29, quarter: 'Q4', title: 'Auditoria de Código e Segurança da Informação', dim: 'Tecnologia, IA & Propriedade Intelectual', priority: 'Baixa' },
  { id: 30, quarter: 'Q4', title: 'Planejamento Estratégico para o Ciclo Seguinte', dim: 'Liderança & Time', priority: 'Baixa' }
];

// Dados Iniciais de Teste
const INITIAL_STARTUPS = [
  {
    id: '1',
    startupName: 'AchaBuraco GovTech',
    founder: 'Carlos Xavier',
    email: 'carlos@achaburaco.com.br',
    whatsapp: '(41) 99876-5432',
    segment: 'GovTech / Cidades Inteligentes',
    stage: 'Tração',
    score: 158,
    date: '2026-02-10',
    dimensions: {
      'Estratégia & Tese de Mercado': 22,
      'Liderança & Time': 21,
      'Tecnologia, IA & Propriedade Intelectual': 20,
      'Cultura de Inovação': 18,
      'Pessoas & Competências': 19,
      'Estrutura, Produto & Validação': 20,
      'Processos & Agilidade': 18,
      'Recursos, Runway & B2G': 20
    }
  },
  {
    id: '2',
    startupName: 'HealthSync Bio',
    founder: 'Mariana Santos',
    email: 'mariana@healthsync.io',
    whatsapp: '(42) 99123-4567',
    segment: 'Healthtech / Saúde',
    stage: 'Operação',
    score: 124,
    date: '2026-02-12',
    dimensions: {
      'Estratégia & Tese de Mercado': 18,
      'Liderança & Time': 16,
      'Tecnologia, IA & Propriedade Intelectual': 17,
      'Cultura de Inovação': 15,
      'Pessoas & Competências': 14,
      'Estrutura, Produto & Validação': 16,
      'Processos & Agilidade': 15,
      'Recursos, Runway & B2G': 13
    }
  },
  {
    id: '3',
    startupName: 'WhatsAlvará',
    founder: 'Lucas Mendes',
    email: 'lucas@whatsalvara.com',
    whatsapp: '(43) 98877-6655',
    segment: 'SaaS B2B / Governança',
    stage: 'Ideação',
    score: 88,
    date: '2026-02-15',
    dimensions: {
      'Estratégia & Tese de Mercado': 14,
      'Liderança & Time': 12,
      'Tecnologia, IA & Propriedade Intelectual': 11,
      'Cultura de Inovação': 11,
      'Pessoas & Competências': 10,
      'Estrutura, Produto & Validação': 10,
      'Processos & Agilidade': 9,
      'Recursos, Runway & B2G': 11
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
    const saved = localStorage.getItem('hub_v2_submissions');
    return saved ? JSON.parse(saved) : INITIAL_STARTUPS;
  });

  // Filtro de Visualização no Dashboard Admin ('todas' ou id da startup)
  const [dashboardSelection, setDashboardSelection] = useState('todas');

  // Estado do Formulário da Startup
  const [currentStep, setCurrentStep] = useState(0); // 0: Dados, 1 a 8: Dimensões
  const [formData, setFormData] = useState({
    startupName: '',
    founder: '',
    email: '',
    whatsapp: '',
    segment: 'SaaS B2B',
    responses: {}
  });
  const [submitted, setSubmitted] = useState(false);
  const [lastSubmission, setLastSubmission] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Estados do Dashboard do Admin
  const [activeAdminTab, setActiveAdminTab] = useState('dashboard'); // 'dashboard', 'plano_startup', 'trilha_anual', 'benchmarking', 'config'
  const [selectedStartup, setSelectedStartup] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStageFilter, setSelectedStageFilter] = useState('Todos');
  const [benchmarkingSelected, setBenchmarkingSelected] = useState(['1', '2']);

  useEffect(() => {
    localStorage.setItem('hub_v2_submissions', JSON.stringify(submissions));
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

  const handleDeleteStartup = (id) => {
    if (window.confirm('Tem certeza que deseja apagar os dados desta startup?')) {
      setSubmissions(prev => prev.filter(s => s.id !== id));
      if (selectedStartup && selectedStartup.id === id) {
        setSelectedStartup(null);
      }
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
      case 'Ideação': return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Operação': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Tração': return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Escala': return 'bg-purple-100 text-purple-800 border-purple-300';
      default: return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  // Trilha de Recomendações por Dimensão
  const getActionPlanForDimension = (dimName, score) => {
    const percentage = (score / 25) * 100;
    if (percentage >= 80) {
      return { level: 'Avançado', meta: 'Referência', color: 'text-emerald-600', actions: ['Consolidar parcerias estratégicas nacionais e expansão de mercado', 'Documentar cases de sucesso para republicação e atração de investimento', 'Servir como mentora de referência para outras startups do ecossistema'] };
    } else if (percentage >= 50) {
      return { level: 'Médio', meta: 'Avançar para Referência', color: 'text-blue-600', actions: ['Estruturar métricas claras de ROI e economia gerada para os clientes', 'Aprimorar o processo de onboarding para redução do tempo de implementação', 'Fortalecer a segurança da informação e documentação de IP/contratos'] };
    } else {
      return { level: 'A Desenvolver', meta: 'Nível Médio', color: 'text-amber-600', actions: ['Realizar no mínimo 15 entrevistas presenciais/remotas estruturadas com clientes', 'Refinar a proposta de valor focando na dor principal e no ganho de eficiência', 'Buscar mentoria técnica especializada nas reuniões do Hub'] };
    }
  };

  // Dados Exibidos no Dashboard (Calculados com base na Seleção do Usuário)
  const displayedSubmissions = dashboardSelection === 'todas'
    ? submissions
    : submissions.filter(s => s.id === dashboardSelection);

  const avgOverallScore = displayedSubmissions.length > 0
    ? (displayedSubmissions.reduce((acc, curr) => acc + curr.score, 0) / displayedSubmissions.length).toFixed(1)
    : 0;

  // Médias ou Notas do Item Selecionado
  const activeDimValues = {};
  GOVTECH_DIMENSIONS.forEach(dim => {
    if (dashboardSelection === 'todas') {
      const totalDimScore = submissions.reduce((acc, curr) => acc + (curr.dimensions[dim.name] || 0), 0);
      activeDimValues[dim.name] = submissions.length > 0 ? (totalDimScore / submissions.length).toFixed(1) : 0;
    } else {
      const single = submissions.find(s => s.id === dashboardSelection);
      activeDimValues[dim.name] = single ? (single.dimensions[dim.name] || 0) : 0;
    }
  });

  const sortedActiveDim = Object.entries(activeDimValues).sort((a, b) => b[1] - a[1]);
  const bestDimension = sortedActiveDim[0] || ['N/A', 0];
  const worstDimension = sortedActiveDim[sortedActiveDim.length - 1] || ['N/A', 0];

  // ---------------------------------------------------------------------------
  // TELA 1: LANDING E SELETOR DE PERFIL
  // ---------------------------------------------------------------------------
  if (!role) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between p-6 relative overflow-hidden font-sans">
        <header className="max-w-6xl mx-auto w-full flex justify-between items-center py-4 border-b border-slate-800 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center font-black text-slate-950 text-xl shadow-lg shadow-teal-500/20">
              H
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-white block">HUB DE DIAGNÓSTICO</span>
              <span className="text-[10px] text-teal-400 font-bold tracking-widest uppercase">Maturidade de Startups 2026</span>
            </div>
          </div>
          <span className="text-xs font-semibold px-3.5 py-1.5 bg-teal-500/10 border border-teal-500/20 rounded-full text-teal-400">
            Programa de Aceleração & Inovação
          </span>
        </header>

        <main className="max-w-4xl mx-auto w-full my-auto py-12 text-center space-y-10 z-10">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-teal-500/10 border border-teal-500/25 rounded-full text-teal-400 font-bold text-xs uppercase tracking-wider">
              <Zap className="h-3.5 w-3.5" /> Avaliação em 8 Dimensões Estratégicas
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white max-w-3xl mx-auto leading-tight">
              Acelere a evolução da sua startup com <span className="text-teal-400">dados reais</span>
            </h1>
            <p className="text-slate-300 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
              Mapeamento de governança, tecnologia, tração e planejamento de conhecimento para aceleradoras e programas de inovação.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto text-left">
            <button
              onClick={() => setRole('startup')}
              className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-teal-500/50 rounded-2xl p-6 transition-all duration-300 group flex flex-col justify-between shadow-2xl relative overflow-hidden"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 bg-teal-500/10 text-teal-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform border border-teal-500/20">
                  <Rocket className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white group-hover:text-teal-400 transition-colors">Área da Startup</h2>
                  <p className="text-xs text-slate-400 leading-relaxed mt-1">
                    Preencha o diagnóstico com 40 perguntas e receba seu gráfico de radar e relatório de maturidade.
                  </p>
                </div>
              </div>
              <div className="mt-8 flex items-center text-xs font-bold text-teal-400 gap-2 group-hover:translate-x-1 transition-transform">
                Iniciar Diagnóstico <ArrowRight className="h-4 w-4" />
              </div>
            </button>

            <button
              onClick={() => setRole('admin')}
              className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-purple-500/50 rounded-2xl p-6 transition-all duration-300 group flex flex-col justify-between shadow-2xl relative overflow-hidden"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 bg-purple-500/10 text-purple-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform border border-purple-500/20">
                  <ShieldAlert className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors">Painel do Administrador</h2>
                  <p className="text-xs text-slate-400 leading-relaxed mt-1">
                    Painel clean para análise individual/coletiva, trilha de conhecimento anual e benchmarking entre startups.
                  </p>
                </div>
              </div>
              <div className="mt-8 flex items-center text-xs font-bold text-purple-400 gap-2 group-hover:translate-x-1 transition-transform">
                Acessar Área Restrita <Lock className="h-3.5 w-3.5" />
              </div>
            </button>
          </div>
        </main>

        <footer className="max-w-6xl mx-auto w-full text-center py-4 border-t border-slate-800 text-xs text-slate-500 z-10">
          Hub de Inovação & Incubação · Safra 2026
        </footer>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // TELA 2: VISÃO DA STARTUP (FORMULÁRIO PASSO A PASSO + ENCERRAMENTO CLEAN)
  // ---------------------------------------------------------------------------
  if (role === 'startup') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
        <header className="bg-slate-900 border-b border-slate-800 py-4 px-8 flex justify-between items-center sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-500 text-slate-950 font-black flex items-center justify-center text-sm">H</div>
            <span className="font-bold text-sm tracking-wide text-white">Hub Diagnóstico — Startup</span>
          </div>
          <button 
            onClick={() => { setRole(null); setSubmitted(false); setCurrentStep(0); }}
            className="text-xs font-medium text-slate-400 hover:text-white flex items-center gap-2 bg-slate-800 px-3.5 py-2 rounded-xl border border-slate-700 transition"
          >
            <LogOut className="h-3.5 w-3.5" /> Voltar ao Início
          </button>
        </header>

        <main className="max-w-4xl mx-auto w-full flex-1 py-10 px-4">
          {submitted ? (
            /* ENCERRAMENTO COM DESIGN LEGÍVEL, LINK E IMPRESSÃO PDF */
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-8 relative overflow-hidden">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-bold border border-emerald-500/20 mb-2">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Diagnóstico Concluído
                  </div>
                  <h1 className="text-2xl font-black text-white">{lastSubmission?.startupName}</h1>
                  <p className="text-xs text-slate-300 mt-1">Fundador: {lastSubmission?.founder} · Segmento: {lastSubmission?.segment}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-center min-w-[120px]">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Score Total</span>
                    <span className="text-2xl font-black text-teal-400">{lastSubmission?.score} <span className="text-xs text-slate-500 font-normal">/200</span></span>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-center min-w-[120px]">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Estágio</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border inline-block mt-1 ${getStageBadge(lastSubmission?.stage)}`}>
                      {lastSubmission?.stage}
                    </span>
                  </div>
                </div>
              </div>

              {/* Gráfico de Radar da Startup */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 h-80">
                  <h3 className="text-xs font-bold text-slate-300 uppercase mb-2 text-center">Radar de Maturidade (8 Dimensões)</h3>
                  <ResponsiveContainer width="100%" height="88%">
                    <RadarChart data={Object.entries(lastSubmission.dimensions).map(([key, val]) => ({ subject: key.split(' ')[0], A: val }))}>
                      <PolarGrid stroke="#334155" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#CBD5E1', fontSize: 11, fontWeight: 'bold' }} />
                      <PolarRadiusAxis angle={30} domain={[0, 25]} stroke="#475569" />
                      <Radar name="Maturidade" dataKey="A" stroke="#10B981" fill="#10B981" fillOpacity={0.5} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-slate-300 uppercase mb-2">Pontuação Detalhada por Dimensão</h3>
                  <div className="grid grid-cols-1 gap-2 text-xs">
                    {Object.entries(lastSubmission.dimensions).map(([dim, val]) => (
                      <div key={dim} className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex justify-between items-center">
                        <span className="text-slate-200 font-medium truncate max-w-[220px]">{dim}</span>
                        <span className="font-extrabold text-teal-400 bg-teal-500/10 px-2.5 py-1 rounded-lg border border-teal-500/20">{val} / 25 pts</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      setCopiedLink(true);
                      setTimeout(() => setCopiedLink(false), 3000);
                    }}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs flex items-center gap-2 border border-slate-700"
                  >
                    <LinkIcon className="h-3.5 w-3.5" /> {copiedLink ? 'Link Copiado!' : 'Copiar Link do Resultado'}
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs flex items-center gap-2 border border-slate-700"
                  >
                    <Printer className="h-3.5 w-3.5" /> Imprimir / PDF
                  </button>
                </div>

                <button
                  onClick={() => {
                    setSubmitted(false);
                    setCurrentStep(0);
                    setFormData({ startupName: '', founder: '', email: '', whatsapp: '', segment: 'SaaS B2B', responses: {} });
                  }}
                  className="px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs transition"
                >
                  Preencher Novo Diagnóstico
                </button>
              </div>
            </div>
          ) : (
            /* FORMULÁRIO PASSO A PASSO */
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-8">
              {/* Stepper Header */}
              <div className="space-y-3 border-b border-slate-800 pb-6">
                <div className="flex justify-between items-center text-xs font-semibold text-slate-400">
                  <span>Passo {currentStep + 1} de {GOVTECH_DIMENSIONS.length + 1}</span>
                  <span className="text-teal-400">{Math.round(((currentStep + 1) / (GOVTECH_DIMENSIONS.length + 1)) * 100)}% concluído</span>
                </div>
                <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div 
                    className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all duration-300" 
                    style={{ width: `${((currentStep + 1) / (GOVTECH_DIMENSIONS.length + 1)) * 100}%` }}
                  />
                </div>
              </div>

              {/* ETAPA 0: DADOS DE CONTATO */}
              {currentStep === 0 ? (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-white">Identificação da Startup</h2>
                    <p className="text-xs text-slate-400 mt-1">Preencha os dados de contato do fundador para registro no programa.</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Nome da Startup *</label>
                      <input 
                        type="text" required
                        value={formData.startupName}
                        onChange={e => setFormData({...formData, startupName: e.target.value})}
                        placeholder="Ex: SaaS Flow Systems"
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
                          placeholder="Ex: Carlos Xavier"
                          className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm outline-none focus:border-teal-500 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">WhatsApp do Fundador *</label>
                        <input 
                          type="text" required
                          value={formData.whatsapp}
                          onChange={e => setFormData({...formData, whatsapp: e.target.value})}
                          placeholder="(41) 99999-8888"
                          className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm outline-none focus:border-teal-500 text-white"
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
                        className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm outline-none focus:border-teal-500 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Segmento de Atuação</label>
                      <select
                        value={formData.segment}
                        onChange={e => setFormData({...formData, segment: e.target.value})}
                        className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm outline-none focus:border-teal-500 text-white"
                      >
                        <option value="SaaS B2B">SaaS B2B</option>
                        <option value="GovTech / Cidades Inteligentes">GovTech / Cidades Inteligentes</option>
                        <option value="Healthtech / Saúde">Healthtech / Saúde</option>
                        <option value="Fintech / Serviços Financeiros">Fintech / Serviços Financeiros</option>
                        <option value="Agtech / Agronegócio">Agtech / Agronegócio</option>
                        <option value="Edtech / Educação">Edtech / Educação</option>
                        <option value="Deeptech / IA & Hardware">Deeptech / IA & Hardware</option>
                        <option value="E-commerce / Marketplace">E-commerce / Marketplace</option>
                        <option value="Outro Segmento">Outro Segmento</option>
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
                    className="w-full py-3.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20"
                  >
                    Iniciar Pergunta 1 de 40 <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                /* ETAPAS 1 A 8: DIMENSÕES */
                <div className="space-y-6">
                  {(() => {
                    const dim = GOVTECH_DIMENSIONS[currentStep - 1];
                    return (
                      <>
                        <div>
                          <span className="text-[10px] font-bold text-teal-400 uppercase tracking-widest block mb-1">
                            Dimensão {currentStep} de {GOVTECH_DIMENSIONS.length}
                          </span>
                          <h2 className="text-xl font-bold text-white">{dim.name}</h2>
                          <p className="text-xs text-slate-400 mt-1">{dim.description}</p>
                        </div>

                        <div className="space-y-5">
                          {dim.questions.map((q, idx) => (
                            <div key={q.id} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                              <p className="text-xs font-semibold text-slate-200">
                                <span className="text-teal-400 font-bold mr-2">Q{idx + 1}.</span>
                                {q.text}
                              </p>
                              
                              <div className="flex items-center justify-between gap-2 max-w-md mx-auto pt-1">
                                <span className="text-[10px] text-slate-500 font-semibold">1 - Discordo</span>
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
                                        className="accent-teal-500 h-4 w-4"
                                      />
                                      <span className="text-xs font-bold text-slate-400 group-hover:text-teal-400 transition">
                                        {score}
                                      </span>
                                    </label>
                                  ))}
                                </div>
                                <span className="text-[10px] text-slate-500 font-semibold">5 - Concordo</span>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="flex justify-between items-center pt-4">
                          <button
                            onClick={() => setCurrentStep(prev => prev - 1)}
                            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs flex items-center gap-1.5"
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
                              className="px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5"
                            >
                              Próxima Dimensão <ChevronRight className="h-4 w-4" />
                            </button>
                          ) : (
                            <button
                              onClick={handleFormSubmit}
                              className="px-6 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-teal-500/20"
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
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-white font-sans">
        <div className="bg-slate-800 border border-slate-700 rounded-3xl p-8 max-w-md w-full space-y-6 shadow-2xl relative">
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
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm outline-none focus:border-purple-500 text-white"
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
  // TELA 4: DASHBOARD DO ADMINISTRADOR (PAINEL CLEAN / FUNDO CLARO LEGÍVEL)
  // ---------------------------------------------------------------------------
  return (
    <div className="flex h-screen bg-slate-100 font-sans text-slate-800 overflow-hidden">
      {/* SIDEBAR DO ADMINISTRADOR (CLEAN DARK) */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col justify-between p-5 border-r border-slate-800">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-500 flex items-center justify-center font-black text-slate-950 text-base">
              H
            </div>
            <div>
              <span className="font-extrabold text-sm block text-white">Hub Diagnóstico</span>
              <span className="text-[10px] text-teal-400 font-bold uppercase">Painel de Mentoria</span>
            </div>
          </div>

          <nav className="space-y-1">
            <button 
              onClick={() => setActiveAdminTab('dashboard')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                activeAdminTab === 'dashboard' ? 'bg-teal-500 text-slate-950 shadow-md' : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              <LayoutDashboard className="h-4 w-4" /> Visão Geral
            </button>
            <button 
              onClick={() => setActiveAdminTab('plano_startup')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                activeAdminTab === 'plano_startup' ? 'bg-teal-500 text-slate-950 shadow-md' : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              <Target className="h-4 w-4" /> Plano por Startup
            </button>
            <button 
              onClick={() => setActiveAdminTab('trilha_anual')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                activeAdminTab === 'trilha_anual' ? 'bg-teal-500 text-slate-950 shadow-md' : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              <BookOpen className="h-4 w-4" /> Trilha Anual (30 Módulos)
            </button>
            <button 
              onClick={() => setActiveAdminTab('benchmarking')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                activeAdminTab === 'benchmarking' ? 'bg-teal-500 text-slate-950 shadow-md' : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              <Scale className="h-4 w-4" /> Benchmarking
            </button>
            <button 
              onClick={() => setActiveAdminTab('config')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                activeAdminTab === 'config' ? 'bg-teal-500 text-slate-950 shadow-md' : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              <Key className="h-4 w-4" /> Configurar PIN
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

      {/* ÁREA PRINCIPAL LIMPA E CLARA */}
      <main className="flex-1 overflow-y-auto p-8 space-y-6">
        
        {/* ==================================================================== */}
        {/* ABA 1: VISÃO GERAL (DASHBOARD) */}
        {/* ==================================================================== */}
        {activeAdminTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div>
                <h1 className="text-xl font-bold text-slate-900">Dashboard de Maturidade da Safra</h1>
                <p className="text-xs text-slate-500">Métricas consolidadas e análise individual por startup.</p>
              </div>

              {/* SELETOR SUPERIOR: TODAS OU UMA STARTUP ESPECÍFICA */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
                  <Filter className="h-3.5 w-3.5 text-slate-500" />
                  <span className="text-xs font-bold text-slate-700">Analisar:</span>
                  <select
                    value={dashboardSelection}
                    onChange={e => setDashboardSelection(e.target.value)}
                    className="bg-transparent text-xs font-bold text-teal-600 outline-none cursor-pointer"
                  >
                    <option value="todas">Média de Todas as Startups ({submissions.length})</option>
                    {submissions.map(s => (
                      <option key={s.id} value={s.id}>{s.startupName} ({s.stage})</option>
                    ))}
                  </select>
                </div>

                <button 
                  onClick={() => {
                    if (window.confirm('Resetar dados para os iniciais de teste?')) {
                      localStorage.removeItem('hub_v2_submissions');
                      setSubmissions(INITIAL_STARTUPS);
                      setDashboardSelection('todas');
                    }
                  }}
                  className="text-xs flex items-center gap-1.5 text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-2 rounded-xl shadow-sm"
                >
                  <RefreshCw className="h-3.5 w-3.5" /> Resetar
                </button>
              </div>
            </div>

            {/* CARDS DE MÉTRICAS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pontuação Média</span>
                <p className="text-3xl font-black text-slate-900 mt-1">{(avgOverallScore / 8).toFixed(1)} <span className="text-xs text-slate-400 font-normal">/25 pts</span></p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Destaque Principal</span>
                <p className="text-lg font-bold text-teal-600 mt-1 truncate">{bestDimension[0]}</p>
                <span className="text-[10px] text-slate-400">{bestDimension[1]} / 25 pts</span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Maior Oportunidade</span>
                <p className="text-lg font-bold text-amber-600 mt-1 truncate">{worstDimension[0]}</p>
                <span className="text-[10px] text-slate-400">{worstDimension[1]} / 25 pts</span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Organizações Mapeadas</span>
                <p className="text-3xl font-black text-purple-600 mt-1">{displayedSubmissions.length}</p>
              </div>
            </div>

            {/* GRÁFICOS REALMENTE IGUAIS AO FORMULÁRIO */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm h-88">
                <h3 className="text-xs font-bold text-slate-500 uppercase mb-3">Radar de Maturidade ({dashboardSelection === 'todas' ? 'Média Geral' : 'Individual'})</h3>
                <ResponsiveContainer width="100%" height="88%">
                  <RadarChart data={Object.entries(activeDimValues).map(([key, val]) => ({ subject: key.split(' ')[0], A: Number(val) }))}>
                    <PolarGrid stroke="#E2E8F0" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 11, fontWeight: 'bold' }} />
                    <PolarRadiusAxis angle={30} domain={[0, 25]} stroke="#94A3B8" />
                    <Radar name="Pontuação" dataKey="A" stroke="#0D9488" fill="#0D9488" fillOpacity={0.4} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm h-88">
                <h3 className="text-xs font-bold text-slate-500 uppercase mb-3">Evolução por Dimensão (Pontos / 25)</h3>
                <ResponsiveContainer width="100%" height="88%">
                  <BarChart data={Object.entries(activeDimValues).map(([key, val]) => ({ name: key.split(' ')[0], Score: Number(val) }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis dataKey="name" tick={{ fill: '#475569', fontSize: 10, fontWeight: 'bold' }} />
                    <YAxis domain={[0, 25]} tick={{ fill: '#64748B', fontSize: 10 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '8px' }} />
                    <Bar dataKey="Score" fill="#0D9488" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* TABELA DE STARTUPS COM BOTAO DE LIXEIRA */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                <h3 className="font-bold text-slate-800 text-sm">Startups Cadastradas</h3>
                <div className="flex gap-3">
                  <select
                    value={selectedStageFilter}
                    onChange={e => setSelectedStageFilter(e.target.value)}
                    className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 outline-none"
                  >
                    <option value="Todos">Todos os Estágios</option>
                    <option value="Ideação">Ideação</option>
                    <option value="Operação">Operação</option>
                    <option value="Tração">Tração</option>
                    <option value="Escala">Escala</option>
                  </select>
                  <div className="relative w-64">
                    <Search className="h-3.5 w-3.5 absolute left-3 top-2.5 text-slate-400" />
                    <input 
                      type="text"
                      placeholder="Buscar startup ou fundador..."
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl outline-none text-slate-800"
                    />
                  </div>
                </div>
              </div>

              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-100 text-[10px] font-bold text-slate-500 uppercase border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3">Startup</th>
                    <th className="px-5 py-3">Fundador & WhatsApp</th>
                    <th className="px-5 py-3">Estágio</th>
                    <th className="px-5 py-3">Score Total</th>
                    <th className="px-5 py-3">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredSubmissions.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50 transition">
                      <td className="px-5 py-3.5 font-bold text-slate-900">
                        {s.startupName}
                        <span className="block text-[10px] text-slate-400 font-normal">{s.segment}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="font-semibold text-slate-700 block">{s.founder}</span>
                        <span className="text-teal-600 text-[10px] flex items-center gap-1 font-medium">
                          <Phone className="h-3 w-3" /> {s.whatsapp}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStageBadge(s.stage)}`}>
                          {s.stage}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 font-black text-slate-800">{s.score} / 200</td>
                      <td className="px-5 py-3.5 flex items-center gap-3">
                        <button 
                          onClick={() => {
                            setSelectedStartup(s);
                            setActiveAdminTab('plano_startup');
                          }}
                          className="text-xs font-bold text-teal-600 hover:underline flex items-center gap-1"
                        >
                          Ver Plano <ChevronRight className="h-3.5 w-3.5" />
                        </button>
                        <button 
                          onClick={() => handleDeleteStartup(s.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          title="Excluir Startup"
                        >
                          <Trash2 className="h-4 w-4" />
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
        {/* ABA 2: PLANO DE AÇÃO INDIVIDUAL POR STARTUP */}
        {/* ==================================================================== */}
        {activeAdminTab === 'plano_startup' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-xl font-bold text-slate-900">Plano de Ação por Startup</h1>
                <p className="text-xs text-slate-500">Recomendações técnicas individualizadas para desenvolvimento das dimensões.</p>
              </div>
              <div className="w-64">
                <select
                  value={selectedStartup ? selectedStartup.id : ''}
                  onChange={e => {
                    const found = submissions.find(s => s.id === e.target.value);
                    setSelectedStartup(found || null);
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
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
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-center">
                  <div>
                    <span className="text-[10px] font-bold text-teal-600 uppercase">Plano Personalizado</span>
                    <h2 className="text-lg font-bold text-slate-900">{selectedStartup.startupName}</h2>
                    <p className="text-xs text-slate-500">Fundador: {selectedStartup.founder} ({selectedStartup.whatsapp})</p>
                  </div>
                  <button 
                    onClick={() => window.print()}
                    className="px-4 py-2 bg-slate-900 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm"
                  >
                    <Printer className="h-4 w-4" /> Exportar Relatório PDF
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(selectedStartup.dimensions).map(([dimName, score]) => {
                    const plan = getActionPlanForDimension(dimName, score);
                    return (
                      <div key={dimName} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                        <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                          <div>
                            <h3 className="font-bold text-slate-900 text-sm">{dimName}</h3>
                            <span className={`text-xs font-bold ${plan.color}`}>{score} / 25 pts ({plan.level})</span>
                          </div>
                          <span className="text-[10px] bg-slate-100 px-2.5 py-1 rounded-full text-slate-600 border border-slate-200 font-semibold">
                            Meta: {plan.meta}
                          </span>
                        </div>
                        <ul className="space-y-2">
                          {plan.actions.map((act, i) => (
                            <li key={i} className="text-xs text-slate-600 flex items-start gap-2">
                              <CheckCircle2 className="h-3.5 w-3.5 text-teal-600 flex-shrink-0 mt-0.5" />
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
              <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3 shadow-sm">
                <Target className="h-10 w-10 text-slate-400 mx-auto" />
                <h3 className="font-bold text-slate-800">Nenhuma startup selecionada</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">Escolha uma startup no menu suspenso acima para visualizar o plano de ação individual.</p>
              </div>
            )}
          </div>
        )}

        {/* ==================================================================== */}
        {/* ABA 3: TRILHA RECOMENDADA ANUAL (30 CONTEÚDOS PRIORIZADOS) */}
        {/* ==================================================================== */}
        {activeAdminTab === 'trilha_anual' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-xl font-bold text-slate-900">Trilha de Conhecimento Anual (30 Módulos)</h1>
                  <p className="text-xs text-slate-500">Programação estratégica de capacitação para aceleradoras e programas de suporte.</p>
                </div>
                <span className="px-3.5 py-1.5 bg-teal-50 text-teal-700 border border-teal-200 rounded-xl text-xs font-bold">
                  30 Módulos Priorizados
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {['Q1', 'Q2', 'Q3', 'Q4'].map((quarter, qIdx) => (
                <div key={quarter} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-teal-600" />
                      <h2 className="font-bold text-slate-900 text-sm">Trimestre {qIdx + 1} ({quarter})</h2>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full">
                      {ANNUAL_CURRICULUM.filter(m => m.quarter === quarter).length} Módulos
                    </span>
                  </div>

                  <div className="space-y-2">
                    {ANNUAL_CURRICULUM.filter(m => m.quarter === quarter).map((item) => (
                      <div key={item.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-start gap-3">
                        <span className="w-5 h-5 rounded-full bg-teal-600 text-white font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                          {item.id}
                        </span>
                        <div className="flex-1">
                          <h4 className="text-xs font-bold text-slate-800">{item.title}</h4>
                          <span className="text-[10px] text-slate-500 font-medium block mt-0.5">{item.dim}</span>
                        </div>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                          item.priority === 'Alta' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                          item.priority === 'Média' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                          'bg-slate-100 text-slate-600 border-slate-200'
                        }`}>
                          {item.priority}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* ABA 4: BENCHMARKING COMPARATIVO */}
        {/* ==================================================================== */}
        {activeAdminTab === 'benchmarking' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <h1 className="text-xl font-bold text-slate-900">Benchmarking entre Startups</h1>
              <p className="text-xs text-slate-500">Selecione até 3 startups registradas para comparar os resultados reais do diagnóstico.</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <span className="text-xs font-bold text-slate-500 uppercase">Selecione para Comparar:</span>
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
                          ? 'bg-teal-50 text-teal-700 border-teal-500 shadow-sm' 
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {s.startupName}
                    </button>
                  );
                })}
              </div>
            </div>

            {benchmarkingSelected.length > 0 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {benchmarkingSelected.map(id => {
                    const s = submissions.find(item => item.id === id);
                    if (!s) return null;
                    return (
                      <div key={s.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                        <h3 className="font-bold text-slate-900 text-base">{s.startupName}</h3>
                        <p className="text-2xl font-black text-teal-600">{s.score} <span className="text-xs font-normal text-slate-400">/200</span></p>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border inline-block ${getStageBadge(s.stage)}`}>
                          {s.stage}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm h-96">
                  <h3 className="text-xs font-bold text-slate-500 uppercase mb-4">Comparativo Direto pelas 8 Dimensões Reais</h3>
                  <ResponsiveContainer width="100%" height="85%">
                    <BarChart data={GOVTECH_DIMENSIONS.map(d => {
                      const entry = { name: d.name.split(' ')[0] };
                      benchmarkingSelected.forEach(id => {
                        const s = submissions.find(item => item.id === id);
                        if (s) entry[s.startupName] = s.dimensions[d.name] || 0;
                      });
                      return entry;
                    })}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                      <XAxis dataKey="name" tick={{ fill: '#475569', fontSize: 10, fontWeight: 'bold' }} />
                      <YAxis domain={[0, 25]} tick={{ fill: '#64748B', fontSize: 10 }} />
                      <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '8px' }} />
                      <Legend />
                      <Bar dataKey={submissions.find(s => s.id === benchmarkingSelected[0])?.startupName} fill="#0D9488" radius={[4, 4, 0, 0]} />
                      {benchmarkingSelected[1] && <Bar dataKey={submissions.find(s => s.id === benchmarkingSelected[1])?.startupName} fill="#2563EB" radius={[4, 4, 0, 0]} />}
                      {benchmarkingSelected[2] && <Bar dataKey={submissions.find(s => s.id === benchmarkingSelected[2])?.startupName} fill="#9333EA" radius={[4, 4, 0, 0]} />}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================================================================== */}
        {/* ABA 5: CONFIGURAÇÃO DE PIN */}
        {/* ==================================================================== */}
        {activeAdminTab === 'config' && (
          <div className="max-w-md bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Alterar Senha do Administrador</h2>
              <p className="text-xs text-slate-500 mt-0.5">Defina uma nova senha para acesso ao painel de mentoria.</p>
            </div>

            <form onSubmit={handleChangePin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Nova Senha / PIN</label>
                <input 
                  type="text" required
                  value={newPinInput}
                  onChange={e => setNewPinInput(e.target.value)}
                  placeholder="Mínimo 4 caracteres"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none text-slate-800 focus:border-teal-500"
                />
              </div>

              {pinChangeSuccess && (
                <p className="text-xs text-teal-700 bg-teal-50 border border-teal-200 p-2.5 rounded-xl text-center font-semibold">
                  Senha alterada com sucesso!
                </p>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl text-xs transition"
              >
                Salvar Nova Senha
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
