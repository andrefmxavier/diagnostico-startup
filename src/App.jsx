import React, { useState, useEffect } from 'react';
import {
  Rocket, CheckCircle2, LayoutDashboard, Lock, ShieldAlert, Filter, Search,
  ChevronRight, RefreshCw, LogOut, ArrowRight, ChevronLeft,
  Zap, Phone, Mail, Printer, Scale, Target, Key, Trash2,
  BookOpen, Calendar, Link as LinkIcon, MessageSquare
} from 'lucide-react';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend
} from 'recharts';

// ============================================================================
// 1. ESTRUTURA DAS 8 DIMENSÕES (40 PERGUNTAS + OBSERVAÇÕES OPCIONAIS)
//    "short" = rótulo curto e legível usado nos gráficos (sem cortes)
// ============================================================================
const GOVTECH_DIMENSIONS = [
  {
    id: 'estrategia',
    name: 'Estratégia & Tese de Mercado',
    short: 'Estratégia & Tese',
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
    short: 'Liderança & Time',
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
    short: 'Tecnologia & IA',
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
    short: 'Cultura de Inovação',
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
    short: 'Pessoas & Competências',
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
    short: 'Produto & Validação',
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
    short: 'Processos & Agilidade',
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
    short: 'Recursos & Runway',
    description: 'Saúde financeira, tempo de sobrevida e captação de recursos',
    questions: [
      { id: 'r1', text: 'O tempo de sobrevida financeira (Runway) atual da startup é superior a 12 meses?' },
      { id: 'r2', text: 'A startup possui margem de contribuição positiva ou caminho claro para o breakeven?' },
      { id: 'r3', text: 'A equipe possui experiência na captação de editais de fomento (FINEP, Sebrae, CNPq) ou investimento?' },
      { id: 'r4', text: 'A precificação do produto cobre custos operacionais com margem de lucro sustentável?' },
      { id: 'r5', text: 'A startup possui planejamento de alocação de capital para expansão de vendas?' }
    ]
  }
];

// Mapa nome completo -> rótulo curto (para os gráficos)
const SHORT_LABELS = GOVTECH_DIMENSIONS.reduce((acc, d) => {
  acc[d.name] = d.short;
  return acc;
}, {});

const getShortLabel = (fullName) => SHORT_LABELS?.[fullName] || fullName || '';

// Quebra um rótulo em várias linhas para nunca cortar o texto nos gráficos
const wrapLabel = (text, maxChars) => {
  const words = String(text || '').split(' ');
  const lines = [];
  let current = '';
  words.forEach(word => {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length > maxChars && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  });
  if (current) lines.push(current);
  return lines;
};

// Tick customizado do Radar: texto completo, em várias linhas, sempre legível
const RadarTick = (props) => {
  const { x = 0, y = 0, textAnchor, payload, color = '#334155' } = props;
  const lines = wrapLabel(payload?.value, 13);
  const offsetY = -((lines.length - 1) * 11) / 2;
  return (
    <text
      x={x}
      y={y + offsetY}
      textAnchor={textAnchor}
      fill={color}
      fontSize={11}
      fontWeight={700}
      dominantBaseline="central"
    >
      {lines.map((line, i) => (
        <tspan key={i} x={x} dy={i === 0 ? 0 : 12}>{line}</tspan>
      ))}
    </text>
  );
};

// Tick customizado do eixo X das barras: sem truncar, sempre em duas linhas
const BarTick = (props) => {
  const { x = 0, y = 0, payload, color = '#334155' } = props;
  const lines = wrapLabel(payload?.value, 11);
  return (
    <text x={x} y={y + 12} textAnchor="middle" fill={color} fontSize={10} fontWeight={700}>
      {lines.map((line, i) => (
        <tspan key={i} x={x} dy={i === 0 ? 0 : 11}>{line}</tspan>
      ))}
    </text>
  );
};

// 30 Módulos de Conteúdo da Trilha Anual Recomendada
const ANNUAL_CURRICULUM = [
  { id: 1, quarter: 'Q1', title: 'Validação de Problema e Entrevistas com Clientes', dim: 'Estrutura, Produto & Validação', priority: 'Alta' },
  { id: 2, quarter: 'Q1', title: 'Modelagem de Proposta de Valor e Tese B2B/B2G', dim: 'Estratégia & Tese de Mercado', priority: 'Alta' },
  { id: 3, quarter: 'Q1', title: 'Construção de MVP Funcional de Baixo Custo', dim: 'Estrutura, Produto & Validação', priority: 'Alta' },
  { id: 4, quarter: 'Q1', title: 'Arquitetura de Software e Segurança LGPD', dim: 'Tecnologia, IA & Propriedade Intelectual', priority: 'Alta' },
  { id: 5, quarter: 'Q1', title: 'Vesting, Cap Table e Acordo de Sócios', dim: 'Liderança & Time', priority: 'Alta' },
  { id: 6, quarter: 'Q1', title: 'Introdução à Contratação e Marco Legal de Startups', dim: 'Estratégia & Tese de Mercado', priority: 'Alta' },
  { id: 7, quarter: 'Q1', title: 'DRE Gerencial e Controle de Cash Burn', dim: 'Recursos, Runway & B2G', priority: 'Alta' },
  { id: 8, quarter: 'Q1', title: 'UX/UI: Design de Interfaces para Usuário Final', dim: 'Pessoas & Competências', priority: 'Média' },

  { id: 9, quarter: 'Q2', title: 'Implementação de IA Generativa no Produto', dim: 'Tecnologia, IA & Propriedade Intelectual', priority: 'Alta' },
  { id: 10, quarter: 'Q2', title: 'Funil de Vendas B2B e Métricas de Conversão', dim: 'Processos & Agilidade', priority: 'Alta' },
  { id: 11, quarter: 'Q2', title: 'Captação de Fomento Aberto (FINEP / Sebrae / CNPq)', dim: 'Recursos, Runway & B2G', priority: 'Alta' },
  { id: 12, quarter: 'Q2', title: 'Gestão Ágil de Projetos com Scrum e Kanban', dim: 'Processos & Agilidade', priority: 'Média' },
  { id: 13, quarter: 'Q2', title: 'Documentação e Proteção da Propriedade Intelectual', dim: 'Tecnologia, IA & Propriedade Intelectual', priority: 'Média' },
  { id: 14, quarter: 'Q2', title: 'Atendimento ao Cliente e Onboarding Estruturado', dim: 'Processos & Agilidade', priority: 'Média' },
  { id: 15, quarter: 'Q2', title: 'Cultura de Experimentação e Testes A/B', dim: 'Cultura de Inovação', priority: 'Média' },
  { id: 16, quarter: 'Q2', title: 'Estratégia de Marketing de Conteúdo e Outbound', dim: 'Processos & Agilidade', priority: 'Média' },

  { id: 17, quarter: 'Q3', title: 'Métricas Avançadas: CAC, LTV, Churn e LTV/CAC', dim: 'Recursos, Runway & B2G', priority: 'Média' },
  { id: 18, quarter: 'Q3', title: 'Modelos de Licitação, Dispensa e Pregão Eletrônico', dim: 'Estratégia & Tese de Mercado', priority: 'Média' },
  { id: 19, quarter: 'Q3', title: 'Integração de APIs e Interoperabilidade de Dados', dim: 'Tecnologia, IA & Propriedade Intelectual', priority: 'Média' },
  { id: 20, quarter: 'Q3', title: 'SLA de Atendimento e Retenção de Clientes', dim: 'Pessoas & Competências', priority: 'Média' },
  { id: 21, quarter: 'Q3', title: 'Gestão de Pessoas e Retenção de Talentos Dev', dim: 'Pessoas & Competências', priority: 'Média' },
  { id: 22, quarter: 'Q3', title: 'Provas de Conceito (PoC) com Órgãos e Empresas', dim: 'Estrutura, Produto & Validação', priority: 'Média' },
  { id: 23, quarter: 'Q3', title: 'Governança Corporativa e Conselho Consultivo', dim: 'Liderança & Time', priority: 'Média' },

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
    },
    notes: {
      estrategia: 'Atuamos fortemente em prefeituras do interior do PR.',
      tecnologia: 'Usamos modelo de IA para detectar rachaduras via câmera de celular.'
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
    },
    notes: {}
  }
];

export default function App() {
  // Controle de Perfis e Autenticação
  const [role, setRole] = useState(null); // 'startup' | 'admin' | null
  const [adminAuth, setAdminAuth] = useState(false);
  const [adminPin, setAdminPin] = useState(() => {
    try {
      return localStorage.getItem('hub_admin_pin') || 'admin123';
    } catch (e) {
      return 'admin123';
    }
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [newPinInput, setNewPinInput] = useState('');
  const [pinChangeSuccess, setPinChangeSuccess] = useState(false);
  const [authError, setAuthError] = useState(false);

  // Submissões com validação defensiva contra dados corrompidos
  const [submissions, setSubmissions] = useState(() => {
    try {
      const saved = localStorage.getItem('hub_v3_submissions');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Erro ao carregar do localStorage', e);
    }
    return INITIAL_STARTUPS;
  });

  const [dashboardSelection, setDashboardSelection] = useState('todas');

  // Estado do Formulário da Startup
  const [currentStep, setCurrentStep] = useState(0); // 0: Dados, 1 a 8: Dimensões
  const [formData, setFormData] = useState({
    startupName: '',
    founder: '',
    email: '',
    whatsapp: '',
    segment: 'SaaS B2B',
    responses: {},
    notes: {}
  });
  const [submitted, setSubmitted] = useState(false);
  const [lastSubmission, setLastSubmission] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Estados do Painel do Administrador
  const [activeAdminTab, setActiveAdminTab] = useState('dashboard');
  const [selectedStartup, setSelectedStartup] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStageFilter, setSelectedStageFilter] = useState('Todos');
  const [benchmarkingSelected, setBenchmarkingSelected] = useState(['1', '2']);

  // Detecta se a URL contém resultado compartilhado
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const sharedData = params.get('result');
      if (sharedData) {
        const decoded = JSON.parse(decodeURIComponent(escape(atob(sharedData))));
        setLastSubmission(decoded);
        setSubmitted(true);
        setRole('startup');
      }
    } catch (e) {
      console.error('Erro ao ler resultado do link', e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('hub_v3_submissions', JSON.stringify(submissions));
    } catch (e) {
      console.error('Erro ao salvar no localStorage', e);
    }
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
      try {
        localStorage.setItem('hub_admin_pin', newPinInput);
      } catch (err) {
        console.error('Erro ao salvar o PIN', err);
      }
      setNewPinInput('');
      setPinChangeSuccess(true);
      setTimeout(() => setPinChangeSuccess(false), 3000);
    }
  };

  const handleDeleteStartup = (id) => {
    if (window.confirm('Tem certeza que deseja apagar os dados desta startup?')) {
      setSubmissions(prev => prev.filter(s => s?.id !== id));
      if (selectedStartup && selectedStartup.id === id) setSelectedStartup(null);
      if (dashboardSelection === id) setDashboardSelection('todas');
      setBenchmarkingSelected(prev => prev.filter(item => item !== id));
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const dimScores = {};
    let grandTotal = 0;

    GOVTECH_DIMENSIONS.forEach(dim => {
      let dimTotal = 0;
      (dim.questions || []).forEach(q => {
        dimTotal += formData.responses?.[q.id] || 0;
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
      dimensions: dimScores,
      notes: formData.notes || {}
    };

    setSubmissions(prev => [newEntry, ...(Array.isArray(prev) ? prev : [])]);
    setLastSubmission(newEntry);
    setSubmitted(true);
  };

  const generateShareableLink = (submission) => {
    if (!submission) return window.location.origin;
    try {
      const jsonString = JSON.stringify(submission);
      const encoded = btoa(unescape(encodeURIComponent(jsonString)));
      return `${window.location.origin}${window.location.pathname}?result=${encoded}`;
    } catch (e) {
      return window.location.href;
    }
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

  const getActionPlanForDimension = (dimName, score) => {
    const percentage = ((score || 0) / 25) * 100;
    if (percentage >= 80) {
      return {
        level: 'Avançado',
        meta: 'Referência',
        color: 'text-emerald-600',
        actions: [
          'Consolidar parcerias estratégicas nacionais e expansão de mercado',
          'Documentar cases de sucesso para republicação e atração de investimento',
          'Servir como mentora de referência para outras startups do ecossistema'
        ]
      };
    }
    if (percentage >= 50) {
      return {
        level: 'Médio',
        meta: 'Avançar para Referência',
        color: 'text-blue-600',
        actions: [
          'Estruturar métricas claras de ROI e economia gerada para os clientes',
          'Aprimorar o processo de onboarding para redução do tempo de implementação',
          'Fortalecer a segurança da informação e documentação de IP/contratos'
        ]
      };
    }
    return {
      level: 'A Desenvolver',
      meta: 'Nível Médio',
      color: 'text-amber-600',
      actions: [
        'Realizar no mínimo 15 entrevistas estruturadas com clientes reais',
        'Refinar a proposta de valor focando na dor principal e no ganho de eficiência',
        'Buscar mentoria técnica especializada nas reuniões do Hub'
      ]
    };
  };

  // CÁLCULOS DEFENSIVOS DO PAINEL
  const safeSubmissions = Array.isArray(submissions) ? submissions : [];

  const filteredSubmissions = safeSubmissions.filter(s => {
    if (!s) return false;
    const term = (searchTerm || '').toLowerCase();
    const matchesSearch =
      (s.startupName || '').toLowerCase().includes(term) ||
      (s.founder || '').toLowerCase().includes(term) ||
      (s.email || '').toLowerCase().includes(term);
    const matchesStage = selectedStageFilter === 'Todos' || s.stage === selectedStageFilter;
    return matchesSearch && matchesStage;
  });

  const displayedSubmissions = dashboardSelection === 'todas'
    ? safeSubmissions
    : safeSubmissions.filter(s => s && s.id === dashboardSelection);

  const avgOverallScore = displayedSubmissions.length > 0
    ? (displayedSubmissions.reduce((acc, curr) => acc + (curr?.score || 0), 0) / displayedSubmissions.length)
    : 0;

  const activeDimValues = {};
  GOVTECH_DIMENSIONS.forEach(dim => {
    if (dashboardSelection === 'todas') {
      const totalDimScore = safeSubmissions.reduce((acc, curr) => acc + (curr?.dimensions?.[dim.name] || 0), 0);
      activeDimValues[dim.name] = safeSubmissions.length > 0
        ? Number((totalDimScore / safeSubmissions.length).toFixed(1))
        : 0;
    } else {
      const single = safeSubmissions.find(s => s?.id === dashboardSelection);
      activeDimValues[dim.name] = single?.dimensions?.[dim.name] || 0;
    }
  });

  const sortedActiveDim = Object.entries(activeDimValues).sort((a, b) => Number(b[1]) - Number(a[1]));
  const bestDimension = sortedActiveDim[0] || ['N/A', 0];
  const worstDimension = sortedActiveDim[sortedActiveDim.length - 1] || ['N/A', 0];

  const chartData = Object.entries(activeDimValues).map(([key, val]) => ({
    subject: getShortLabel(key),
    fullName: key,
    A: Number(val) || 0
  }));

  // ---------------------------------------------------------------------------
  // TELA 1: LANDING E SELETOR DE PERFIL
  // ---------------------------------------------------------------------------
  if (!role) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between p-6 relative overflow-hidden font-sans">
        <header className="max-w-6xl mx-auto w-full flex flex-wrap gap-4 justify-between items-center py-4 border-b border-slate-800 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center font-black text-slate-950 text-xl shadow-lg shadow-teal-500/20">
              H
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-white block">HUB DE DIAGNÓSTICO</span>
              <span className="text-[10px] text-teal-300 font-bold tracking-widest uppercase">Maturidade de Startups 2026</span>
            </div>
          </div>
          <span className="text-xs font-semibold px-3.5 py-1.5 bg-teal-500/10 border border-teal-500/25 rounded-full text-teal-300">
            Programa de Aceleração & Inovação
          </span>
        </header>

        <main className="max-w-4xl mx-auto w-full my-auto py-12 text-center space-y-10 z-10">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-teal-500/10 border border-teal-500/25 rounded-full text-teal-300 font-bold text-xs uppercase tracking-wider">
              <Zap className="h-3.5 w-3.5" /> Avaliação em 8 Dimensões Estratégicas
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white max-w-3xl mx-auto leading-tight">
              Acelere a evolução da sua startup com <span className="text-teal-300">dados reais</span>
            </h1>
            <p className="text-slate-200 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
              Mapeamento de governança, tecnologia, tração e planejamento de conhecimento para aceleradoras e programas de inovação.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto text-left">
            <button
              onClick={() => setRole('startup')}
              className="bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-teal-500/60 rounded-2xl p-6 transition-all duration-300 group flex flex-col justify-between shadow-2xl"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 bg-teal-500/15 text-teal-300 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform border border-teal-500/25">
                  <Rocket className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white group-hover:text-teal-300 transition-colors">Área da Startup</h2>
                  <p className="text-xs text-slate-300 leading-relaxed mt-1">
                    Preencha o diagnóstico com 40 perguntas e receba seu gráfico de radar e relatório de maturidade.
                  </p>
                </div>
              </div>
              <div className="mt-8 flex items-center text-xs font-bold text-teal-300 gap-2 group-hover:translate-x-1 transition-transform">
                Iniciar diagnóstico <ArrowRight className="h-4 w-4" />
              </div>
            </button>

            <button
              onClick={() => setRole('admin')}
              className="bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-purple-500/60 rounded-2xl p-6 transition-all duration-300 group flex flex-col justify-between shadow-2xl"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 bg-purple-500/15 text-purple-300 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform border border-purple-500/25">
                  <ShieldAlert className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">Painel do Administrador</h2>
                  <p className="text-xs text-slate-300 leading-relaxed mt-1">
                    Análise individual e coletiva, trilha de conhecimento anual e benchmarking entre startups.
                  </p>
                </div>
              </div>
              <div className="mt-8 flex items-center text-xs font-bold text-purple-300 gap-2 group-hover:translate-x-1 transition-transform">
                Acessar área restrita <Lock className="h-3.5 w-3.5" />
              </div>
            </button>
          </div>
        </main>

        <footer className="max-w-6xl mx-auto w-full text-center py-4 border-t border-slate-800 text-xs text-slate-400 z-10">
          Hub de Inovação & Incubação · 2026
        </footer>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // TELA 2: VISÃO DA STARTUP (FORMULÁRIO + RESULTADO)
  // ---------------------------------------------------------------------------
  if (role === 'startup') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
        <style>{`
          @media print {
            body { background: #ffffff !important; color: #0f172a !important; }
            header, button, .no-print { display: none !important; }
            .print-area {
              border: none !important;
              background: #ffffff !important;
              color: #0f172a !important;
              box-shadow: none !important;
              padding: 0 !important;
            }
            .print-card {
              background: #f8fafc !important;
              border: 1px solid #cbd5e1 !important;
              color: #0f172a !important;
            }
            .print-text, .print-card * { color: #0f172a !important; }
            @page { size: A4 portrait; margin: 14mm; }
          }
        `}</style>

        <header className="bg-slate-900 border-b border-slate-800 py-4 px-6 md:px-8 flex justify-between items-center sticky top-0 z-30 no-print">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-500 text-slate-950 font-black flex items-center justify-center text-sm">H</div>
            <span className="font-bold text-sm tracking-wide text-white">Hub Diagnóstico — Startup</span>
          </div>
          <button
            onClick={() => {
              window.history.pushState({}, document.title, window.location.pathname);
              setRole(null);
              setSubmitted(false);
              setCurrentStep(0);
            }}
            className="text-xs font-medium text-slate-200 hover:text-white flex items-center gap-2 bg-slate-800 px-3.5 py-2 rounded-xl border border-slate-700 transition"
          >
            <LogOut className="h-3.5 w-3.5" /> Voltar ao início
          </button>
        </header>

        <main className="max-w-4xl mx-auto w-full flex-1 py-10 px-4">
          {submitted ? (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-8 print-area">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/15 text-emerald-300 rounded-full text-xs font-bold border border-emerald-500/25 mb-2 no-print">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Diagnóstico concluído
                  </div>
                  <h1 className="text-2xl font-black text-white print-text">{lastSubmission?.startupName}</h1>
                  <p className="text-xs text-slate-200 mt-1 print-text">
                    Fundador: {lastSubmission?.founder} · Segmento: {lastSubmission?.segment}
                  </p>
                  <p className="text-xs text-slate-200 mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 print-text">
                    <span className="inline-flex items-center gap-1.5">
                      <Phone className="h-3 w-3 text-teal-300" /> {lastSubmission?.whatsapp || '—'}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Mail className="h-3 w-3 text-teal-300" /> {lastSubmission?.email || '—'}
                    </span>
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-center min-w-[120px] print-card">
                    <span className="text-[10px] font-bold text-slate-300 uppercase block print-text">Score total</span>
                    <span className="text-2xl font-black text-teal-300">
                      {lastSubmission?.score} <span className="text-xs text-slate-400 font-normal">/200</span>
                    </span>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-center min-w-[120px] print-card">
                    <span className="text-[10px] font-bold text-slate-300 uppercase block print-text">Estágio</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border inline-block mt-1 ${getStageBadge(lastSubmission?.stage)}`}>
                      {lastSubmission?.stage}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 h-[420px] print-card">
                  <h3 className="text-xs font-bold text-slate-200 uppercase mb-2 text-center print-text">
                    Radar de maturidade (8 dimensões)
                  </h3>
                  <ResponsiveContainer width="100%" height="90%">
                    <RadarChart
                      outerRadius="62%"
                      margin={{ top: 20, right: 40, bottom: 20, left: 40 }}
                      data={Object.entries(lastSubmission?.dimensions || {}).map(([key, val]) => ({
                        subject: getShortLabel(key),
                        A: Number(val) || 0
                      }))}
                    >
                      <PolarGrid stroke="#475569" />
                      <PolarAngleAxis dataKey="subject" tick={<RadarTick color="#E2E8F0" />} />
                      <PolarRadiusAxis angle={90} domain={[0, 25]} tick={false} axisLine={false} />
                      <Radar name="Maturidade" dataKey="A" stroke="#10B981" fill="#10B981" fillOpacity={0.45} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '10px', color: '#F1F5F9' }}
                        formatter={(value) => [`${value} / 25 pts`, 'Pontuação']}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-slate-200 uppercase mb-2 print-text">Pontuação detalhada por dimensão</h3>
                  <div className="grid grid-cols-1 gap-2 text-xs">
                    {Object.entries(lastSubmission?.dimensions || {}).map(([dim, val]) => (
                      <div key={dim} className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex justify-between items-center gap-3 print-card">
                        <span className="text-slate-100 font-medium leading-snug print-text">{dim}</span>
                        <span className="font-extrabold text-teal-300 bg-teal-500/15 px-2.5 py-1 rounded-lg border border-teal-500/25 whitespace-nowrap">
                          {val} / 25
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {lastSubmission?.notes && Object.values(lastSubmission.notes).some(Boolean) && (
                <div className="space-y-3 pt-4 border-t border-slate-800">
                  <h3 className="text-xs font-bold text-slate-200 uppercase print-text">Observações da startup por dimensão</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    {Object.entries(lastSubmission.notes).map(([dimId, text]) => {
                      if (!text) return null;
                      const dimObj = GOVTECH_DIMENSIONS.find(d => d.id === dimId);
                      return (
                        <div key={dimId} className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1 print-card">
                          <span className="font-bold text-teal-300 block text-[11px] print-text">{dimObj?.name || dimId}</span>
                          <p className="text-slate-200 leading-relaxed print-text">{text}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 no-print">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => {
                      const shareUrl = generateShareableLink(lastSubmission);
                      try {
                        navigator.clipboard.writeText(shareUrl);
                      } catch (e) {
                        window.prompt('Copie o link do resultado:', shareUrl);
                      }
                      setCopiedLink(true);
                      setTimeout(() => setCopiedLink(false), 3000);
                    }}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold rounded-xl text-xs flex items-center gap-2 border border-slate-700"
                  >
                    <LinkIcon className="h-3.5 w-3.5" /> {copiedLink ? 'Link copiado' : 'Copiar link do resultado'}
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold rounded-xl text-xs flex items-center gap-2 border border-slate-700"
                  >
                    <Printer className="h-3.5 w-3.5" /> Exportar PDF / Imprimir
                  </button>
                </div>

                <button
                  onClick={() => {
                    window.history.pushState({}, document.title, window.location.pathname);
                    setSubmitted(false);
                    setCurrentStep(0);
                    setFormData({ startupName: '', founder: '', email: '', whatsapp: '', segment: 'SaaS B2B', responses: {}, notes: {} });
                  }}
                  className="px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs transition"
                >
                  Preencher novo diagnóstico
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-8">
              <div className="space-y-3 border-b border-slate-800 pb-6">
                <div className="flex justify-between items-center text-xs font-semibold text-slate-300">
                  <span>Passo {currentStep + 1} de {GOVTECH_DIMENSIONS.length + 1}</span>
                  <span className="text-teal-300">
                    {Math.round(((currentStep + 1) / (GOVTECH_DIMENSIONS.length + 1)) * 100)}% concluído
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all duration-300"
                    style={{ width: `${((currentStep + 1) / (GOVTECH_DIMENSIONS.length + 1)) * 100}%` }}
                  />
                </div>
              </div>

              {currentStep === 0 ? (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-white">Identificação da startup</h2>
                    <p className="text-xs text-slate-300 mt-1">Preencha os dados de contato do fundador para registro no programa.</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Nome da startup *</label>
                      <input
                        type="text" required
                        value={formData.startupName}
                        onChange={e => setFormData({ ...formData, startupName: e.target.value })}
                        placeholder="Ex: SaaS Flow Systems"
                        className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm outline-none focus:border-teal-400 text-white placeholder:text-slate-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Nome do fundador *</label>
                        <input
                          type="text" required
                          value={formData.founder}
                          onChange={e => setFormData({ ...formData, founder: e.target.value })}
                          placeholder="Ex: Carlos Xavier"
                          className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm outline-none focus:border-teal-400 text-white placeholder:text-slate-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">WhatsApp do fundador *</label>
                        <input
                          type="text" required
                          value={formData.whatsapp}
                          onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                          placeholder="(41) 99999-8888"
                          className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm outline-none focus:border-teal-400 text-white placeholder:text-slate-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">E-mail de contato *</label>
                      <input
                        type="email" required
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        placeholder="contato@startup.com.br"
                        className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm outline-none focus:border-teal-400 text-white placeholder:text-slate-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Segmento de atuação</label>
                      <select
                        value={formData.segment}
                        onChange={e => setFormData({ ...formData, segment: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm outline-none focus:border-teal-400 text-white"
                      >
                        <option value="SaaS B2B">SaaS B2B</option>
                        <option value="GovTech / Cidades Inteligentes">GovTech / Cidades Inteligentes</option>
                        <option value="Healthtech / Saúde">Healthtech / Saúde</option>
                        <option value="Fintech / Serviços Financeiros">Fintech / Serviços Financeiros</option>
                        <option value="Agtech / Agronegócio">Agtech / Agronegócio</option>
                        <option value="Edtech / Educação">Edtech / Educação</option>
                        <option value="Deeptech / IA & Hardware">Deeptech / IA & Hardware</option>
                        <option value="E-commerce / Marketplace">E-commerce / Marketplace</option>
                        <option value="Outro Segmento">Outro segmento</option>
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (formData.startupName && formData.founder && formData.whatsapp && formData.email) {
                        setCurrentStep(1);
                      } else {
                        alert('Preencha todos os campos obrigatórios para continuar.');
                      }
                    }}
                    className="w-full py-3.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20"
                  >
                    Iniciar pergunta 1 de 40 <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {(() => {
                    const dim = GOVTECH_DIMENSIONS[currentStep - 1];
                    if (!dim) return null;
                    return (
                      <>
                        <div>
                          <span className="text-[10px] font-bold text-teal-300 uppercase tracking-widest block mb-1">
                            Dimensão {currentStep} de {GOVTECH_DIMENSIONS.length}
                          </span>
                          <h2 className="text-xl font-bold text-white">{dim.name}</h2>
                          <p className="text-xs text-slate-300 mt-1">{dim.description}</p>
                        </div>

                        <div className="space-y-5">
                          {(dim.questions || []).map((q, idx) => (
                            <div key={q.id} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                              <p className="text-xs font-semibold text-slate-100 leading-relaxed">
                                <span className="text-teal-300 font-bold mr-2">Q{idx + 1}.</span>
                                {q.text}
                              </p>

                              <div className="flex items-center justify-between gap-2 max-w-md mx-auto pt-1">
                                <span className="text-[10px] text-slate-300 font-semibold">1 · Discordo</span>
                                <div className="flex gap-3">
                                  {[1, 2, 3, 4, 5].map(score => (
                                    <label key={score} className="flex flex-col items-center gap-1 cursor-pointer group">
                                      <input
                                        type="radio"
                                        name={q.id}
                                        value={score}
                                        checked={formData.responses?.[q.id] === score}
                                        onChange={() => setFormData(prev => ({
                                          ...prev,
                                          responses: { ...(prev.responses || {}), [q.id]: score }
                                        }))}
                                        className="accent-teal-500 h-4 w-4"
                                      />
                                      <span className="text-xs font-bold text-slate-200 group-hover:text-teal-300 transition">
                                        {score}
                                      </span>
                                    </label>
                                  ))}
                                </div>
                                <span className="text-[10px] text-slate-300 font-semibold">5 · Concordo</span>
                              </div>
                            </div>
                          ))}

                          <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                            <label className="text-xs font-bold text-slate-200 flex items-center gap-2">
                              <MessageSquare className="h-3.5 w-3.5 text-teal-300" />
                              Observações sobre esta dimensão
                              <span className="text-[10px] text-slate-400 font-normal">(opcional)</span>
                            </label>
                            <textarea
                              rows={3}
                              value={formData.notes?.[dim.id] || ''}
                              onChange={e => {
                                const val = e.target.value;
                                setFormData(prev => ({
                                  ...prev,
                                  notes: { ...(prev.notes || {}), [dim.id]: val }
                                }));
                              }}
                              placeholder="Escreva livremente sobre desafios, projetos em andamento ou detalhes dessa área..."
                              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-100 outline-none focus:border-teal-400 placeholder:text-slate-500"
                            />
                          </div>
                        </div>

                        <div className="flex justify-between items-center pt-4">
                          <button
                            onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
                            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold rounded-xl text-xs flex items-center gap-1.5"
                          >
                            <ChevronLeft className="h-4 w-4" /> Anterior
                          </button>

                          {currentStep < GOVTECH_DIMENSIONS.length ? (
                            <button
                              onClick={() => {
                                const answered = (dim.questions || []).every(q => formData.responses?.[q.id]);
                                if (!answered) {
                                  alert('Responda as 5 perguntas desta dimensão antes de avançar.');
                                  return;
                                }
                                setCurrentStep(prev => prev + 1);
                              }}
                              className="px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5"
                            >
                              Próxima dimensão <ChevronRight className="h-4 w-4" />
                            </button>
                          ) : (
                            <button
                              onClick={(e) => {
                                const answered = (dim.questions || []).every(q => formData.responses?.[q.id]);
                                if (!answered) {
                                  alert('Responda as 5 perguntas desta dimensão antes de concluir.');
                                  return;
                                }
                                handleFormSubmit(e);
                              }}
                              className="px-6 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-teal-500/20"
                            >
                              Concluir e ver diagnóstico <CheckCircle2 className="h-4 w-4" />
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
        <div className="bg-slate-800 border border-slate-700 rounded-3xl p-8 max-w-md w-full space-y-6 shadow-2xl">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-purple-500/15 text-purple-300 rounded-2xl flex items-center justify-center mx-auto border border-purple-500/25">
              <Lock className="h-6 w-6" />
            </div>
            <h1 className="text-xl font-bold">Acesso restrito — avaliadores</h1>
            <p className="text-slate-300 text-xs">Digite a senha do painel para continuar.</p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Senha de acesso</label>
              <input
                type="password"
                value={passwordInput}
                onChange={e => setPasswordInput(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm outline-none focus:border-purple-400 text-white placeholder:text-slate-500"
              />
            </div>

            {authError && (
              <p className="text-xs text-rose-300 bg-rose-500/10 border border-rose-500/25 p-2.5 rounded-xl text-center">
                Senha incorreta. Verifique e tente novamente.
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs transition"
            >
              Entrar no painel
            </button>
          </form>

          <button
            onClick={() => setRole(null)}
            className="w-full text-xs text-slate-300 hover:text-white text-center block"
          >
            ← Voltar à página inicial
          </button>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // TELA 4: PAINEL DO ADMINISTRADOR
  // ---------------------------------------------------------------------------
  return (
    <div className="flex h-screen bg-slate-100 font-sans text-slate-800 overflow-hidden">
      <style>{`
        @media print {
          aside, button, .no-print { display: none !important; }
          main { overflow: visible !important; padding: 0 !important; }
          @page { size: A4 portrait; margin: 12mm; }
        }
      `}</style>

      <aside className="w-64 bg-slate-900 text-white flex flex-col justify-between p-5 border-r border-slate-800 shrink-0">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-500 flex items-center justify-center font-black text-slate-950 text-base">
              H
            </div>
            <div>
              <span className="font-extrabold text-sm block text-white">Hub Diagnóstico</span>
              <span className="text-[10px] text-teal-300 font-bold uppercase">Painel de mentoria</span>
            </div>
          </div>

          <nav className="space-y-1">
            {[
              { key: 'dashboard', label: 'Visão geral', icon: LayoutDashboard },
              { key: 'plano_startup', label: 'Plano por startup', icon: Target },
              { key: 'trilha_anual', label: 'Trilha anual (30 módulos)', icon: BookOpen },
              { key: 'benchmarking', label: 'Benchmarking', icon: Scale },
              { key: 'config', label: 'Configurar PIN', icon: Key }
            ].map(item => {
              const Icon = item.icon;
              const active = activeAdminTab === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => setActiveAdminTab(item.key)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition text-left ${
                    active ? 'bg-teal-500 text-slate-950 shadow-md' : 'text-slate-200 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" /> {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        <button
          onClick={() => { setRole(null); setAdminAuth(false); setPasswordInput(''); }}
          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-200 hover:text-white rounded-xl hover:bg-slate-800 transition"
        >
          <LogOut className="h-4 w-4" /> Sair do painel
        </button>
      </aside>

      <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">

        {/* ==================== ABA 1: VISÃO GERAL ==================== */}
        {activeAdminTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div>
                <h1 className="text-xl font-bold text-slate-900">Dashboard de maturidade das startups</h1>
                <p className="text-xs text-slate-600">Métricas consolidadas e análise individual por startup.</p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
                  <Filter className="h-3.5 w-3.5 text-slate-600" />
                  <span className="text-xs font-bold text-slate-800">Analisar:</span>
                  <select
                    value={dashboardSelection}
                    onChange={e => setDashboardSelection(e.target.value)}
                    className="bg-transparent text-xs font-bold text-teal-700 outline-none cursor-pointer max-w-[240px]"
                  >
                    <option value="todas">Média de todas as startups ({safeSubmissions.length})</option>
                    {safeSubmissions.map(s => (
                      <option key={s.id} value={s.id}>{s.startupName} ({s.stage})</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => {
                    if (window.confirm('Resetar dados para os iniciais de teste?')) {
                      try { localStorage.removeItem('hub_v3_submissions'); } catch (e) { /* ignore */ }
                      setSubmissions(INITIAL_STARTUPS);
                      setDashboardSelection('todas');
                    }
                  }}
                  className="text-xs flex items-center gap-1.5 text-slate-700 hover:text-slate-900 bg-white border border-slate-200 px-3 py-2 rounded-xl shadow-sm"
                >
                  <RefreshCw className="h-3.5 w-3.5" /> Resetar dados
                </button>
              </div>
            </div>

            {/* CARDS DE MÉTRICAS — textos completos, sem cortes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Pontuação média</span>
                <p className="text-3xl font-black text-slate-900 mt-1">
                  {avgOverallScore.toFixed(1)} <span className="text-xs text-slate-500 font-normal">/200 pts</span>
                </p>
                <span className="text-[11px] text-slate-500">
                  Média por dimensão: {(avgOverallScore / 8).toFixed(1)} / 25
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Destaque principal</span>
                <p className="text-base font-bold text-teal-700 mt-1 leading-snug break-words">{bestDimension[0]}</p>
                <span className="text-[11px] text-slate-500">{bestDimension[1]} / 25 pts</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Maior oportunidade</span>
                <p className="text-base font-bold text-amber-700 mt-1 leading-snug break-words">{worstDimension[0]}</p>
                <span className="text-[11px] text-slate-500">{worstDimension[1]} / 25 pts</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Startups analisadas</span>
                <p className="text-3xl font-black text-purple-700 mt-1">{displayedSubmissions.length}</p>
                <span className="text-[11px] text-slate-500">
                  {dashboardSelection === 'todas' ? 'Visão consolidada' : 'Visão individual'}
                </span>
              </div>
            </div>

            {/* GRÁFICOS COM RÓTULOS COMPLETOS */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm h-[440px]">
                <h3 className="text-xs font-bold text-slate-600 uppercase mb-3">
                  Radar de maturidade ({dashboardSelection === 'todas' ? 'média geral' : 'individual'})
                </h3>
                <ResponsiveContainer width="100%" height="90%">
                  <RadarChart data={chartData} outerRadius="62%" margin={{ top: 20, right: 50, bottom: 20, left: 50 }}>
                    <PolarGrid stroke="#CBD5E1" />
                    <PolarAngleAxis dataKey="subject" tick={<RadarTick color="#1E293B" />} />
                    <PolarRadiusAxis angle={90} domain={[0, 25]} tick={false} axisLine={false} />
                    <Radar name="Pontuação" dataKey="A" stroke="#0D9488" fill="#0D9488" fillOpacity={0.35} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#CBD5E1', borderRadius: '10px' }}
                      formatter={(value) => [`${value} / 25 pts`, 'Pontuação']}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm h-[440px]">
                <h3 className="text-xs font-bold text-slate-600 uppercase mb-3">Pontuação por dimensão (0 a 25 pts)</h3>
                <ResponsiveContainer width="100%" height="90%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, bottom: 42, left: -10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="subject" interval={0} tickLine={false} height={50} tick={<BarTick color="#1E293B" />} />
                    <YAxis domain={[0, 25]} tick={{ fill: '#334155', fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#CBD5E1', borderRadius: '10px' }}
                      formatter={(value) => [`${value} / 25 pts`, 'Pontuação']}
                    />
                    <Bar dataKey="A" name="Pontuação" fill="#0D9488" radius={[6, 6, 0, 0]} maxBarSize={46} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* TABELA COM CONTATO COMPLETO DO FUNDADOR */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row gap-3 justify-between items-start md:items-center bg-slate-50">
                <h3 className="font-bold text-slate-900 text-sm">Startups cadastradas</h3>
                <div className="flex flex-wrap gap-3">
                  <select
                    value={selectedStageFilter}
                    onChange={e => setSelectedStageFilter(e.target.value)}
                    className="px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 outline-none"
                  >
                    <option value="Todos">Todos os estágios</option>
                    <option value="Ideação">Ideação</option>
                    <option value="Operação">Operação</option>
                    <option value="Tração">Tração</option>
                    <option value="Escala">Escala</option>
                  </select>
                  <div className="relative w-64">
                    <Search className="h-3.5 w-3.5 absolute left-3 top-2.5 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Buscar por startup, fundador ou e-mail"
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl outline-none text-slate-800 placeholder:text-slate-400"
                    />
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-100 text-[10px] font-bold text-slate-600 uppercase border-b border-slate-200">
                    <tr>
                      <th className="px-5 py-3">Startup</th>
                      <th className="px-5 py-3">Fundador e contato</th>
                      <th className="px-5 py-3">Estágio</th>
                      <th className="px-5 py-3">Score total</th>
                      <th className="px-5 py-3">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredSubmissions.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-5 py-10 text-center text-slate-500">
                          Nenhuma startup encontrada com os filtros atuais. Ajuste a busca ou o estágio.
                        </td>
                      </tr>
                    ) : filteredSubmissions.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50 transition align-top">
                        <td className="px-5 py-3.5 font-bold text-slate-900">
                          {s.startupName}
                          <span className="block text-[11px] text-slate-500 font-normal">{s.segment}</span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="font-semibold text-slate-900 block">{s.founder}</span>
                          <a
                            href={`https://wa.me/55${(s.whatsapp || '').replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-teal-700 text-[11px] flex items-center gap-1 font-medium hover:underline"
                          >
                            <Phone className="h-3 w-3" /> {s.whatsapp || '—'}
                          </a>
                          <a
                            href={`mailto:${s.email || ''}`}
                            className="text-slate-600 text-[11px] flex items-center gap-1 font-medium hover:underline hover:text-teal-700"
                          >
                            <Mail className="h-3 w-3" /> {s.email || '—'}
                          </a>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getStageBadge(s.stage)}`}>
                            {s.stage}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 font-black text-slate-900">{s.score} / 200</td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => {
                                setSelectedStartup(s);
                                setActiveAdminTab('plano_startup');
                              }}
                              className="text-xs font-bold text-teal-700 hover:underline flex items-center gap-1"
                            >
                              Ver plano <ChevronRight className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteStartup(s.id)}
                              className="p-1.5 text-slate-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition"
                              title="Excluir startup"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ==================== ABA 2: PLANO POR STARTUP ==================== */}
        {activeAdminTab === 'plano_startup' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-xl font-bold text-slate-900">Plano de ação por startup</h1>
                <p className="text-xs text-slate-600">Recomendações individualizadas para desenvolvimento das 8 dimensões.</p>
              </div>
              <div className="w-full md:w-72">
                <select
                  value={selectedStartup ? selectedStartup.id : ''}
                  onChange={e => {
                    const found = safeSubmissions.find(s => s?.id === e.target.value);
                    setSelectedStartup(found || null);
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900"
                >
                  <option value="">Selecione uma startup...</option>
                  {safeSubmissions.map(s => (
                    <option key={s.id} value={s.id}>{s.startupName} ({s.stage})</option>
                  ))}
                </select>
              </div>
            </div>

            {selectedStartup ? (
              <div className="space-y-6">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between gap-4 md:items-center">
                  <div>
                    <span className="text-[10px] font-bold text-teal-700 uppercase">Plano personalizado</span>
                    <h2 className="text-lg font-bold text-slate-900">{selectedStartup.startupName}</h2>
                    <p className="text-xs text-slate-600 mt-0.5">Fundador: {selectedStartup.founder}</p>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs">
                      <span className="inline-flex items-center gap-1.5 text-teal-700 font-medium">
                        <Phone className="h-3 w-3" /> {selectedStartup.whatsapp || '—'}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-slate-600 font-medium">
                        <Mail className="h-3 w-3" /> {selectedStartup.email || '—'}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm no-print self-start"
                  >
                    <Printer className="h-4 w-4" /> Exportar relatório em PDF
                  </button>
                </div>

                {selectedStartup.notes && Object.values(selectedStartup.notes).some(Boolean) && (
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                    <h3 className="text-xs font-bold text-slate-600 uppercase">Observações enviadas pela startup</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {Object.entries(selectedStartup.notes).map(([dimId, text]) => {
                        if (!text) return null;
                        const dimObj = GOVTECH_DIMENSIONS.find(d => d.id === dimId);
                        return (
                          <div key={dimId} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                            <span className="font-bold text-teal-700 block text-[11px]">{dimObj?.name || dimId}</span>
                            <p className="text-xs text-slate-700 leading-relaxed mt-1">{text}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  {Object.entries(selectedStartup.dimensions || {}).map(([dimName, score]) => {
                    const plan = getActionPlanForDimension(dimName, score);
                    return (
                      <div key={dimName} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                        <div className="flex justify-between items-start gap-3 border-b border-slate-100 pb-3">
                          <div>
                            <h3 className="font-bold text-slate-900 text-sm leading-snug">{dimName}</h3>
                            <span className={`text-xs font-bold ${plan.color}`}>{score} / 25 pts · {plan.level}</span>
                          </div>
                          <span className="text-[10px] bg-slate-100 px-2.5 py-1 rounded-full text-slate-700 border border-slate-200 font-semibold whitespace-nowrap">
                            Meta: {plan.meta}
                          </span>
                        </div>
                        <ul className="space-y-2">
                          {plan.actions.map((act, i) => (
                            <li key={i} className="text-xs text-slate-700 flex items-start gap-2 leading-relaxed">
                              <CheckCircle2 className="h-3.5 w-3.5 text-teal-700 flex-shrink-0 mt-0.5" />
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
                <h3 className="font-bold text-slate-900">Escolha uma startup para começar</h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  Selecione uma startup no menu acima para ver o plano de ação por dimensão.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ==================== ABA 3: TRILHA ANUAL ==================== */}
        {activeAdminTab === 'trilha_anual' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-3">
                <div>
                  <h1 className="text-xl font-bold text-slate-900">Trilha de conhecimento anual (30 módulos)</h1>
                  <p className="text-xs text-slate-600">Programação estratégica de capacitação para o ciclo completo.</p>
                </div>
                <span className="px-3.5 py-1.5 bg-teal-50 text-teal-800 border border-teal-300 rounded-xl text-xs font-bold self-start">
                  30 módulos priorizados
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {['Q1', 'Q2', 'Q3', 'Q4'].map((quarter, qIdx) => (
                <div key={quarter} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-teal-700" />
                      <h2 className="font-bold text-slate-900 text-sm">Trimestre {qIdx + 1} ({quarter})</h2>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-full">
                      {ANNUAL_CURRICULUM.filter(m => m.quarter === quarter).length} módulos
                    </span>
                  </div>

                  <div className="space-y-2">
                    {ANNUAL_CURRICULUM.filter(m => m.quarter === quarter).map((item) => (
                      <div key={item.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
                        <span className="w-5 h-5 rounded-full bg-teal-700 text-white font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                          {item.id}
                        </span>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-slate-900 leading-snug">{item.title}</h4>
                          <span className="text-[11px] text-slate-600 font-medium block mt-0.5">{item.dim}</span>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border whitespace-nowrap ${
                          item.priority === 'Alta' ? 'bg-rose-50 text-rose-800 border-rose-300' :
                          item.priority === 'Média' ? 'bg-amber-50 text-amber-800 border-amber-300' :
                          'bg-slate-100 text-slate-700 border-slate-300'
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

        {/* ==================== ABA 4: BENCHMARKING ==================== */}
        {activeAdminTab === 'benchmarking' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <h1 className="text-xl font-bold text-slate-900">Benchmarking entre startups</h1>
              <p className="text-xs text-slate-600">Selecione até 3 startups para comparar os resultados do diagnóstico lado a lado.</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <span className="text-xs font-bold text-slate-600 uppercase">Startups selecionadas</span>
              <div className="flex flex-wrap gap-2">
                {safeSubmissions.map(s => {
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
                          alert('Você pode comparar no máximo 3 startups por vez. Remova uma para incluir outra.');
                        }
                      }}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition ${
                        isSelected
                          ? 'bg-teal-50 text-teal-800 border-teal-600 shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-300 hover:border-slate-400'
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
                    const s = safeSubmissions.find(item => item?.id === id);
                    if (!s) return null;
                    return (
                      <div key={s.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                        <h3 className="font-bold text-slate-900 text-base">{s.startupName}</h3>
                        <p className="text-2xl font-black text-teal-700">
                          {s.score} <span className="text-xs font-normal text-slate-500">/200</span>
                        </p>
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold border inline-block ${getStageBadge(s.stage)}`}>
                          {s.stage}
                        </span>
                        <p className="text-[11px] text-slate-600 flex items-center gap-1.5 pt-1">
                          <Mail className="h-3 w-3" /> {s.email || '—'}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm h-[480px]">
                  <h3 className="text-xs font-bold text-slate-600 uppercase mb-4">Comparativo pelas 8 dimensões</h3>
                  <ResponsiveContainer width="100%" height="88%">
                    <BarChart
                      margin={{ top: 10, right: 10, bottom: 42, left: -10 }}
                      data={GOVTECH_DIMENSIONS.map(d => {
                        const entry = { name: d.short };
                        benchmarkingSelected.forEach(id => {
                          const s = safeSubmissions.find(item => item?.id === id);
                          if (s) entry[s.startupName] = s.dimensions?.[d.name] || 0;
                        });
                        return entry;
                      })}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                      <XAxis dataKey="name" interval={0} tickLine={false} height={50} tick={<BarTick color="#1E293B" />} />
                      <YAxis domain={[0, 25]} tick={{ fill: '#334155', fontSize: 11 }} />
                      <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#CBD5E1', borderRadius: '10px' }} />
                      <Legend wrapperStyle={{ fontSize: 12, fontWeight: 700, color: '#1E293B', paddingTop: 8 }} />
                      {benchmarkingSelected.map((id, idx) => {
                        const s = safeSubmissions.find(item => item?.id === id);
                        if (!s) return null;
                        const colors = ['#0D9488', '#2563EB', '#9333EA'];
                        return (
                          <Bar
                            key={s.id}
                            dataKey={s.startupName}
                            fill={colors[idx] || '#64748B'}
                            radius={[5, 5, 0, 0]}
                            maxBarSize={28}
                          />
                        );
                      })}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================== ABA 5: CONFIGURAR PIN ==================== */}
        {activeAdminTab === 'config' && (
          <div className="max-w-md bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Alterar senha do administrador</h2>
              <p className="text-xs text-slate-600 mt-0.5">Defina uma nova senha de acesso ao painel de mentoria.</p>
            </div>

            <form onSubmit={handleChangePin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">Nova senha / PIN</label>
                <input
                  type="text" required
                  value={newPinInput}
                  onChange={e => setNewPinInput(e.target.value)}
                  placeholder="Mínimo de 4 caracteres"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm outline-none text-slate-900 focus:border-teal-600 placeholder:text-slate-400"
                />
              </div>

              {pinChangeSuccess && (
                <p className="text-xs text-teal-800 bg-teal-50 border border-teal-300 p-2.5 rounded-xl text-center font-semibold">
                  Senha alterada. Use a nova senha no próximo acesso.
                </p>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-teal-700 hover:bg-teal-600 text-white font-bold rounded-xl text-xs transition"
              >
                Salvar nova senha
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
