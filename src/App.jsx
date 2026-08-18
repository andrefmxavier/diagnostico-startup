import React, { useState, useEffect } from 'react';
import {
  Rocket, CheckCircle2, LayoutDashboard, Lock, ShieldAlert, Filter, Search,
  ChevronRight, ChevronDown, ChevronUp, RefreshCw, LogOut, ArrowRight, ChevronLeft,
  Zap, Phone, Mail, Printer, Scale, Target, Key, Trash2, Copy, Check, X,
  ListChecks, Wrench, Gauge, Package, MessageSquare, Info,
  Link as LinkIcon, GraduationCap, Building2, Sparkles, Menu
} from 'lucide-react';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, Cell
} from 'recharts';

import { supabase } from './supabaseClient';

// ============================================================================
// 1. ESTRUTURA DAS 8 DIMENSÕES E INDICADORES
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
      { id: 'l4', text: 'Existe alinhamento de longo prazo entre os sócios (vesting e cap table formalizados)?' },
      { id: 'l5', text: 'A liderança toma decisões baseadas em dados e métricas de desempenho semanais?' }
    ]
  },
  {
    id: 'tecnologia',
    name: 'Tecnologia, IA & Propriedade Intelectual',
    short: 'Tecnologia & IA',
    description: 'Arquitetura de software, automação, IA generativa e controle de IP',
    questions: [
      { id: 't1', text: 'A startup possui arquitetura própria de software e controle total sobre a propriedade intelectual (IP)?' },
      { id: 't2', text: 'Utiliza IA generativa, machine learning ou automações para ganhar escala no produto?' },
      { id: 't3', text: 'A plataforma possui APIs abertas e facilidade de integração com sistemas legados?' },
      { id: 't4', text: 'A infraestrutura em nuvem é escalável, segura e possui redundância/backup automatizado?' },
      { id: 't5', text: 'O desenvolvimento segue boas práticas de segurança cibernética e conformidade com a LGPD?' }
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
      { id: 'pr2', text: 'O funil de vendas (inbound/outbound) está estruturado com etapas e métricas de conversão?' },
      { id: 'pr3', text: 'Existem rotinas de acompanhamento financeiro e DRE gerencial atualizada mensalmente?' },
      { id: 'pr4', text: 'Os processos de suporte e atendimento possuem SLA (tempo de resposta) definido?' },
      { id: 'pr5', text: 'Existe um roteiro formal de onboarding para novos clientes contratantes?' }
    ]
  },
  {
    id: 'recursos',
    name: 'Recursos, Runway & B2G',
    short: 'Recursos & Runway',
    description: 'Saúde financeira, tempo de sobrevida e captação de recursos',
    questions: [
      { id: 'r1', text: 'O tempo de sobrevida financeira (runway) atual da startup é superior a 12 meses?' },
      { id: 'r2', text: 'A startup possui margem de contribuição positiva ou caminho claro para o breakeven?' },
      { id: 'r3', text: 'A equipe possui experiência na captação de editais de fomento (FINEP, Sebrae, CNPq) ou investimento?' },
      { id: 'r4', text: 'A precificação do produto cobre custos operacionais com margem de lucro sustentável?' },
      { id: 'r5', text: 'A startup possui planejamento de alocação de capital para expansão de vendas?' }
    ]
  }
];

const DETAILED_TRACKS = [
  {
    id: 'trilha1',
    title: 'Trilha 1 — Fundação e Validação',
    subtitle: 'Confirmar a dor, estruturar o básico societário e financeiro e colocar de pé um MVP validado.',
    badge: 'Ideação & Operação',
    dimensionsSummary: [
      { name: 'Estratégia & Tese', count: 2 },
      { name: 'Liderança & Time', count: 1 },
      { name: 'Tecnologia & IA', count: 1 },
      { name: 'Cultura de Inovação', count: 1 },
      { name: 'Pessoas & Competências', count: 2 },
      { name: 'Produto & Validação', count: 2 },
      { name: 'Processos & Agilidade', count: 1 },
      { name: 'Recursos & Runway', count: 2 }
    ],
    modules: [
      { id: 1, title: 'Tese de valor e dor prioritária do cliente', category: 'Estratégia & Tese de Mercado', priority: 'Alta' },
      { id: 2, title: 'Entrevistas de descoberta e construção de MVP enxuto', category: 'Estrutura, Produto & Validação', priority: 'Alta' },
      { id: 3, title: 'Acordo de sócios, vesting e cap table', category: 'Liderança & Time', priority: 'Alta' },
      { id: 4, title: 'DRE gerencial e controle de queima de caixa', category: 'Recursos, Runway & B2G', priority: 'Alta' },
      { id: 5, title: 'Desenvolvimento de Pitch e Narrativa de Vendas', category: 'Pessoas & Competências', priority: 'Média' }
    ]
  },
  {
    id: 'trilha2',
    title: 'Trilha 2 — Tração Comercial e Produto',
    subtitle: 'Acelerar vendas B2B/B2G, escalar a arquitetura técnica e estruturar rotinas de Customer Success.',
    badge: 'Operação & Tração',
    dimensionsSummary: [
      { name: 'Estratégia & Tese', count: 1 },
      { name: 'Liderança & Time', count: 2 },
      { name: 'Tecnologia & IA', count: 2 },
      { name: 'Processos & Agilidade', count: 3 },
      { name: 'Recursos & Runway', count: 2 }
    ],
    modules: [
      { id: 1, title: 'Outbound Sales e Maquina de Vendas B2B', category: 'Processos & Agilidade', priority: 'Alta' },
      { id: 2, title: 'Arquitetura Nuvem Escalável e APIs Abertas', category: 'Tecnologia, IA & Propriedade Intelectual', priority: 'Alta' },
      { id: 3, title: 'Onboarding de Clientes e Redução de Churn', category: 'Processos & Agilidade', priority: 'Alta' },
      { id: 4, title: 'Conformidade com LGPD e Segurança Cibernética', category: 'Tecnologia, IA & Propriedade Intelectual', priority: 'Média' }
    ]
  },
  {
    id: 'trilha3',
    title: 'Trilha 3 — Governança, Capital e Escala',
    subtitle: 'Preparar para rodadas de investimento, expansão nacional/B2G e conselho consultivo.',
    badge: 'Tração & Escala',
    dimensionsSummary: [
      { name: 'Liderança & Time', count: 3 },
      { name: 'Tecnologia & IA', count: 2 },
      { name: 'Recursos & Runway', count: 4 }
    ],
    modules: [
      { id: 1, title: 'Captação de Investimento Venture Capital', category: 'Recursos, Runway & B2G', priority: 'Alta' },
      { id: 2, title: 'Estruturação de Conselho Consultivo e Governança', category: 'Liderança & Time', priority: 'Alta' },
      { id: 3, title: 'Contratualização B2G e Licitações Públicas', category: 'Recursos, Runway & B2G', priority: 'Alta' }
    ]
  }
];

const PLAN_RECOMMENDATIONS = {
  estrategia: {
    title: 'Validação da dor e da tese de valor',
    action: 'Converter a tese validada em plano de expansão para novas praças e verticais, com hipóteses de entrada documentadas.',
    tools: 'Roteiro de entrevista no formato The Mom Test, quadro de dores no Miro e registro padronizado no Notion ou Google Forms.',
    metrics: 'Número de entrevistas concluídas, percentual que confirma a dor como prioritária e valor declarado de disposição a pagar.',
    deliverable: 'Relatório de descoberta de uma página com as cinco dores mais citadas e a proposta de valor revisada.'
  },
  lideranca: {
    title: 'Governança societária e alinhamento',
    action: 'Preparar a governança para due diligence: atas organizadas, contratos assinados e societário sem passivos.',
    tools: 'Acordo de sócios revisado, plataforma de vesting/cap table (ex: Carta ou Excel) e rituais de OKR.',
    metrics: '% de dedicação exclusiva dos fundadores, NPS do time interno e cumprimento das metas trimestrais.',
    deliverable: 'Cap table atualizado e matriz de responsabilidades executivas aprovada pelos sócios.'
  },
  tecnologia: {
    title: 'Arquitetura limpa, IA e segurança de IP',
    action: 'Evoluir o código para microsserviços seguros com documentação aberta e modelos de automação/IA.',
    tools: 'AWS / Google Cloud, repositórios GitHub protegidos, APIs Swagger e auditoria LGPD.',
    metrics: 'Uptime da aplicação (>99.5%), tempo de resposta de API e cobertura de testes automatizados.',
    deliverable: 'Documentação técnica da arquitetura de software e registro formal de marca/código.'
  },
  cultura: {
    title: 'Cultura de experimentação e aprendizado',
    action: 'Estabelecer rotina semanal de testes A/B e reuniões de pós-mortem sem culpabilização.',
    tools: 'Quadro de hipóteses no Notion/Jira, Google Analytics, Hotjar e Mixpanel.',
    metrics: 'Quantidade de experimentos realizados por mês e taxa de conversão aprendida.',
    deliverable: 'Backlog de experimentos validados e repositório central de aprendizados com usuários.'
  },
  pessoas: {
    title: 'Capacidade de execução e Customer Success',
    action: 'Mapear papéis técnicos essenciais e estruturar atendimento dedicado com SLA claro.',
    tools: 'Zendesk/Intercom para suporte, matriz de competências CSD e treinamentos semanais.',
    metrics: 'Tempo médio de primeira resposta (FRT), CSAT de atendimento e eNPS do time.',
    deliverable: 'Manual de onboarding do cliente e playbook de suporte operacional.'
  },
  estrutura: {
    title: 'Validação contínua do MVP e uso ativo',
    action: 'Acompanhar métricas de retenção diária/semanal e conduzir testes piloto estruturados.',
    tools: 'Amplitude, Mixpanel, Hotjar e formulários de feedback pós-uso.',
    metrics: 'Usuários ativos diários/mensais (DAU/MAU) e taxa de retenção na semana 4 (W4).',
    deliverable: 'Relatório de engajamento do produto e lista de melhorias prioritárias para o backlog.'
  },
  processos: {
    title: 'Processos ágeis e funil de vendas',
    action: 'Estruturar máquina de vendas inbound/outbound com etapas bem definidas e rotina de DRE mensal.',
    tools: 'HubSpot/Pipedrive para CRM, Jira/Trello para Sprints e Conta Azul para financeiro.',
    metrics: 'Taxa de conversão do funil de vendas, ciclo médio de vendas (dias) e margem DRE.',
    deliverable: 'Playbook comercial de vendas e DRE gerencial atualizada dos últimos 12 meses.'
  },
  recursos: {
    title: 'Saúde financeira, Runway e captação B2G/Editais',
    action: 'Garantir sobrevida financeira superior a 12 meses e mapear editais de fomento e contratos públicos.',
    tools: 'Planilha de projeção de fluxo de caixa, plataforma de editais FINEP/Sebrae e Portal da Transparência.',
    metrics: 'Meses de Runway restante, Burn Rate mensal e margem de contribuição por cliente.',
    deliverable: 'Plano de alocação de capital para 18 meses e proposta comercial B2G padronizada.'
  }
};

const SHORT_LABELS = GOVTECH_DIMENSIONS.reduce((acc, d) => { acc[d.name] = d.short; return acc; }, {});
const getShortLabel = (fullName) => SHORT_LABELS?.[fullName] || fullName || '';
const ALL_QUESTIONS = GOVTECH_DIMENSIONS.flatMap(d => d.questions);

const STAGE_LIST = ['Ideação', 'Operação', 'Tração', 'Escala'];
const SEGMENT_OPTIONS = [
  'SaaS B2B',
  'GovTech / Cidades Inteligentes',
  'Healthtech / Saúde',
  'Edtech / Educação',
  'Fintech / Serviços Financeiros',
  'Agtech / Agronegócio',
  'E-commerce / Marketplace',
  'Outro'
];

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

const RadarTick = (props) => {
  const { x = 0, y = 0, textAnchor, payload, color = '#94a3b8' } = props;
  const lines = wrapLabel(payload?.value, 11);
  const offsetY = -((lines.length - 1) * 10) / 2;
  return (
    <text x={x} y={y + offsetY} textAnchor={textAnchor} fill={color} fontSize={10} fontWeight={700} dominantBaseline="central">
      {lines.map((line, i) => (
        <tspan key={i} x={x} dy={i === 0 ? 0 : 11}>{line}</tspan>
      ))}
    </text>
  );
};

const LogoHeader = ({ size = 'normal' }) => {
  const isLarge = size === 'large';
  return (
    <div className="flex items-center gap-3">
      <div className={`${isLarge ? 'w-10 h-10 md:w-12 md:h-12 text-xl md:text-2xl' : 'w-8 h-8 md:w-10 md:h-10 text-lg md:text-xl'} rounded-2xl bg-gradient-to-br from-teal-400 via-teal-500 to-emerald-600 flex items-center justify-center font-black text-slate-950 shadow-lg shadow-teal-500/25 border border-teal-300/40 shrink-0`}>
        <span className="font-extrabold tracking-tighter">H</span>
      </div>
      <div>
        <span className={`font-black tracking-tight text-white block ${isLarge ? 'text-base md:text-lg' : 'text-sm md:text-base'}`}>
          HUB DE DIAGNÓSTICO
        </span>
        <span className="text-[9px] md:text-[10px] text-teal-300 font-bold tracking-widest uppercase block">
          MATURIDADE DE STARTUPS 2026
        </span>
      </div>
    </div>
  );
};

const EMPTY_FORM = {
  startupName: '',
  founder: '',
  email: '',
  whatsapp: '',
  segment: 'SaaS B2B',
  responses: {},
  notes: {}
};

export default function App() {
  const [role, setRole] = useState(null);
  const [adminAuth, setAdminAuth] = useState(false);
  const [adminPin, setAdminPin] = useState('admin123');
  const [adminPinInput, setAdminPinInput] = useState('');
  const [newPinInput, setNewPinInput] = useState('');
  const [submissions, setSubmissions] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showMatrixModal, setShowMatrixModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filtros
  const [tableStageFilter, setTableStageFilter] = useState('Todos');
  const [tableSearchTerm, setTableSearchTerm] = useState('');
  const [activeTrackId, setActiveTrackId] = useState('trilha1');

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [submitted, setSubmitted] = useState(false);
  const [lastSubmission, setLastSubmission] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const [activeAdminTab, setActiveAdminTab] = useState('dashboard');
  const [selectedPlanStartupId, setSelectedPlanStartupId] = useState('');
  const [selectedBenchStartups, setSelectedBenchStartups] = useState([]);
  const [selectedObsDimension, setSelectedObsDimension] = useState('estrategia');

  const fetchStartups = async () => {
    try {
      const { data, error } = await supabase.from('startups').select('*');
      if (error) {
        console.error("Erro ao carregar startups:", error);
        return;
      }
      if (data) {
        const formatted = data.map(item => ({
          id: item.id,
          startupName: item.startup_name,
          founder: item.founder,
          email: item.email,
          whatsapp: item.whatsapp,
          segment: item.segment || 'SaaS B2B',
          stage: item.stage,
          score: item.score,
          date: item.date,
          dimensions: item.dimensions,
          notes: item.notes
        }));
        setSubmissions(formatted);
        if (formatted.length > 0 && !selectedPlanStartupId) {
          setSelectedPlanStartupId(formatted[0].id);
          setSelectedBenchStartups([formatted[0].id, formatted[1]?.id].filter(Boolean));
        }
      }
    } catch (err) {
      console.error("Exceção ao buscar startups:", err);
    }
  };

  useEffect(() => {
    fetchStartups();
  }, []);

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminPinInput === adminPin) {
      setAdminAuth(true);
    } else {
      alert('Senha/PIN incorreto!');
    }
  };

  const handleFormSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setIsSubmitting(true);

    const dimScores = {};
    let grandTotal = 0;

    GOVTECH_DIMENSIONS.forEach(dim => {
      let dimTotal = 0;
      (dim.questions || []).forEach(q => {
        dimTotal += Number(formData.responses?.[q.id] || 0);
      });
      dimScores[dim.name] = dimTotal;
      grandTotal += dimTotal;
    });

    let stage = 'Ideação';
    if (grandTotal > 70 && grandTotal <= 120) stage = 'Operação';
    if (grandTotal > 120 && grandTotal <= 170) stage = 'Tração';
    if (grandTotal > 170) stage = 'Escala';

    const cleanNotes = {};
    Object.entries(formData.notes || {}).forEach(([key, value]) => {
      if (value && String(value).trim()) cleanNotes[key] = String(value).trim();
    });

    const newEntry = {
      id: Date.now().toString(),
      startup_name: formData.startupName || 'Startup Sem Nome',
      founder: formData.founder || 'Não informado',
      email: formData.email || 'Não informado',
      whatsapp: formData.whatsapp || 'Não informado',
      segment: formData.segment || 'SaaS B2B',
      stage,
      score: grandTotal,
      date: new Date().toISOString().split('T')[0],
      dimensions: dimScores,
      notes: cleanNotes
    };

    try {
      const { error } = await supabase.from('startups').insert([newEntry]);
      if (error) {
        alert(`Erro ao salvar no banco de dados: ${error.message}`);
        setIsSubmitting(false);
        return;
      }

      setLastSubmission({
        ...newEntry,
        startupName: newEntry.startup_name
      });
      setSubmitted(true);
      await fetchStartups();
    } catch (err) {
      alert("Ocorreu um erro inesperado de conexão.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteStartup = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta startup do banco de dados?')) {
      const { error } = await supabase.from('startups').delete().eq('id', id);
      if (!error) {
        fetchStartups();
      } else {
        alert(`Erro ao excluir registro: ${error.message}`);
      }
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

  const safeSubmissions = Array.isArray(submissions) ? submissions : [];

  const tableFilteredSubmissions = safeSubmissions.filter(s => {
    const matchStage = tableStageFilter === 'Todos' || s.stage === tableStageFilter;
    const matchText = !tableSearchTerm || 
      s.startupName?.toLowerCase().includes(tableSearchTerm.toLowerCase()) ||
      s.founder?.toLowerCase().includes(tableSearchTerm.toLowerCase()) ||
      s.email?.toLowerCase().includes(tableSearchTerm.toLowerCase());
    return matchStage && matchText;
  });

  const avgOverallScore = safeSubmissions.length > 0
    ? (safeSubmissions.reduce((acc, curr) => acc + (curr?.score || 0), 0) / safeSubmissions.length)
    : 0;

  const activeDimValues = {};
  GOVTECH_DIMENSIONS.forEach(dim => {
    const totalDimScore = safeSubmissions.reduce((acc, curr) => acc + (curr?.dimensions?.[dim.name] || 0), 0);
    activeDimValues[dim.name] = safeSubmissions.length > 0
      ? Number((totalDimScore / safeSubmissions.length).toFixed(1))
      : 0;
  });

  const dimSorted = Object.entries(activeDimValues).sort((a, b) => b[1] - a[1]);
  const highlightTop = dimSorted[0] ? `${dimSorted[0][0]}` : 'N/A';
  const highlightLow = dimSorted[dimSorted.length - 1] ? `${dimSorted[dimSorted.length - 1][0]}` : 'N/A';

  const radarChartData = Object.entries(activeDimValues).map(([key, val]) => ({
    subject: getShortLabel(key),
    A: Number(val) || 0
  }));

  const barChartData = Object.entries(activeDimValues).map(([key, val]) => ({
    name: getShortLabel(key),
    Score: Number(val) || 0
  }));

  const stageDistribution = STAGE_LIST.map(stage => ({
    name: stage,
    Startups: safeSubmissions.filter(s => s?.stage === stage).length
  }));

  const segmentDistribution = Object.entries(
    safeSubmissions.reduce((acc, s) => {
      const key = s?.segment || 'Outro';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, Startups: value }));

  const currentPlanStartup = safeSubmissions.find(s => s.id === selectedPlanStartupId) || safeSubmissions[0];
  const answeredCount = ALL_QUESTIONS.filter(q => formData.responses?.[q.id] > 0).length;

  // Montagem dos Dados de Benchmarking para o Gráfico Agrupado
  const benchSelectedObjects = selectedBenchStartups.map(id => safeSubmissions.find(s => s.id === id)).filter(Boolean);
  const benchChartData = GOVTECH_DIMENSIONS.map(dim => {
    const entry = { name: dim.short };
    benchSelectedObjects.forEach(s => {
      entry[s.startupName] = s.dimensions?.[dim.name] || 0;
    });
    return entry;
  });

  const BENCH_COLORS = ['#0d9488', '#2563eb', '#9333ea'];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">

      {/* MODAL MATRIZ DE PERGUNTAS */}
      {showMatrixModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setShowMatrixModal(false)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 text-slate-500"
            >
              <X className="h-6 w-6" />
            </button>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Matriz de Perguntas &amp; Dimensões</h2>
              <p className="text-xs text-slate-500 mt-1">8 dimensões · 40 indicadores · escala de 1 a 5</p>
            </div>
            <div className="space-y-6">
              {GOVTECH_DIMENSIONS.map((dim, idx) => (
                <div key={dim.id} className="border border-slate-200 rounded-2xl p-5 space-y-3 bg-slate-50">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-sm text-slate-900">{idx + 1}. {dim.name}</h3>
                    <span className="text-[10px] font-bold px-2.5 py-1 bg-teal-100 text-teal-800 rounded-full">até 25 pts</span>
                  </div>
                  <p className="text-xs text-slate-500">{dim.description}</p>
                  <div className="bg-white rounded-xl divide-y divide-slate-100 border border-slate-200">
                    {dim.questions.map((q, qIdx) => (
                      <div key={q.id} className="p-3 text-xs text-slate-700 flex gap-3">
                        <span className="font-bold text-teal-700 shrink-0">{idx + 1}.{qIdx + 1}</span>
                        <span>{q.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SELEÇÃO DE INÍCIO */}
      {!role && (
        <div className="min-h-screen bg-slate-900 flex flex-col justify-between p-4 md:p-6">
          <header className="max-w-6xl mx-auto w-full flex flex-col sm:flex-row justify-between items-center gap-3 py-4 border-b border-slate-800 text-center sm:text-left">
            <LogoHeader size="large" />
            <span className="text-[11px] font-semibold px-3.5 py-1.5 bg-teal-500/10 border border-teal-500/25 rounded-full text-teal-300">
              Programa de Incubação e Aceleração 2026
            </span>
          </header>

          <main className="max-w-5xl mx-auto w-full my-auto py-8 text-center space-y-8">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-teal-500/10 border border-teal-500/25 rounded-full text-teal-300 font-bold text-[11px] uppercase">
                <Zap className="h-3.5 w-3.5" /> Hub Govtech PR
              </div>
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white px-2">Diagnóstico de Maturidade</h1>
              <p className="text-teal-300 text-xs sm:text-base font-semibold">Avaliação em 8 dimensões estratégicas</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-3xl mx-auto text-left px-2">
              <button
                onClick={() => setRole('startup')}
                className="bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-teal-500/60 rounded-2xl p-5 md:p-6 transition shadow-2xl flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 bg-teal-500/15 text-teal-300 rounded-xl flex items-center justify-center border border-teal-500/25">
                    <Rocket className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-base md:text-lg font-bold text-white">Área da startup</h2>
                    <p className="text-xs text-slate-300 mt-1">Responda os 40 indicadores e receba o radar de maturidade e relatório completo.</p>
                  </div>
                </div>
                <div className="mt-6 flex items-center text-xs font-bold text-teal-300 gap-2">
                  Iniciar diagnóstico <ArrowRight className="h-4 w-4" />
                </div>
              </button>

              <button
                onClick={() => setRole('admin')}
                className="bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-purple-500/60 rounded-2xl p-5 md:p-6 transition shadow-2xl flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 bg-purple-500/15 text-purple-300 rounded-xl flex items-center justify-center border border-purple-500/25">
                    <ShieldAlert className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-base md:text-lg font-bold text-white">Painel do administrador</h2>
                    <p className="text-xs text-slate-300 mt-1">Análise do portfólio, benchmarking, planos e trilhas.</p>
                  </div>
                </div>
                <div className="mt-6 flex items-center text-xs font-bold text-purple-300 gap-2">
                  Acessar área restrita <Lock className="h-3.5 w-3.5" />
                </div>
              </button>
            </div>
          </main>
          <footer className="text-center text-[11px] text-slate-500 py-4">
            Hub de Inovação &amp; Incubação · 2026
          </footer>
        </div>
      )}

      {/* ÁREA DA STARTUP */}
      {role === 'startup' && (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
          <header className="bg-slate-900 border-b border-slate-800 py-3 px-4 md:px-6 flex justify-between items-center sticky top-0 z-30">
            <LogoHeader size="normal" />
            <div className="flex gap-2">
              <button
                onClick={() => setShowMatrixModal(true)}
                className="text-xs font-medium text-slate-300 hover:text-white bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700 flex items-center gap-1.5"
              >
                <ListChecks className="h-3.5 w-3.5" /> Matriz de perguntas
              </button>
              <button
                onClick={() => { setRole(null); setSubmitted(false); setFormData(EMPTY_FORM); }}
                className="text-xs font-medium text-slate-200 hover:text-white bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700 flex items-center gap-1.5"
              >
                <LogOut className="h-3.5 w-3.5" /> Voltar ao início
              </button>
            </div>
          </header>

          <main className="max-w-4xl mx-auto w-full py-6 md:py-10 px-3 md:px-4">
            {!submitted ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-2xl space-y-6 md:space-y-8">
                {currentStep === 0 ? (
                  <div className="space-y-5">
                    <div>
                      <h2 className="text-lg md:text-xl font-bold text-white">Identificação da startup</h2>
                      <p className="text-xs text-slate-400 mt-0.5">Dados do fundador para registro no programa.</p>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">NOME DA STARTUP *</label>
                        <input
                          type="text" required value={formData.startupName}
                          onChange={e => setFormData({ ...formData, startupName: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white outline-none focus:border-teal-400"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">NOME DO FUNDADOR *</label>
                          <input
                            type="text" required value={formData.founder}
                            onChange={e => setFormData({ ...formData, founder: e.target.value })}
                            className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white outline-none focus:border-teal-400"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">WHATSAPP DO FUNDADOR *</label>
                          <input
                            type="text" required value={formData.whatsapp}
                            onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                            className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white outline-none focus:border-teal-400"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">E-MAIL DE CONTATO *</label>
                          <input
                            type="email" required value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white outline-none focus:border-teal-400"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">SEGMENTO DE ATUAÇÃO *</label>
                          <select
                            value={formData.segment}
                            onChange={e => setFormData({ ...formData, segment: e.target.value })}
                            className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white outline-none focus:border-teal-400"
                          >
                            {SEGMENT_OPTIONS.map(opt => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        if (formData.startupName && formData.founder) setCurrentStep(1);
                        else alert('Preencha os campos obrigatórios.');
                      }}
                      className="w-full py-3.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs transition flex items-center justify-center gap-2"
                    >
                      Iniciar questionário (40 indicadores) <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6 md:space-y-8">
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 sticky top-16 z-20 shadow-xl">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-300">Progresso de respostas:</span>
                        <span className="text-xs font-extrabold text-teal-300 bg-teal-500/10 px-3 py-1 rounded-lg border border-teal-500/20">
                          {answeredCount} / 40 respondidas
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-[11px] font-medium text-slate-400 border-t border-slate-800/80 pt-2">
                        <span><b className="text-teal-400">1:</b> Discordo Totalmente</span>
                        <span><b className="text-teal-400">3:</b> Parcial / Neutro</span>
                        <span><b className="text-teal-400">5:</b> Concordo Totalmente</span>
                      </div>
                    </div>

                    {GOVTECH_DIMENSIONS.map((dim, dimIdx) => (
                      <div key={dim.id} className="bg-slate-950 border border-slate-800 rounded-xl md:rounded-2xl p-4 md:p-5 space-y-4">
                        <div className="space-y-1">
                          <h3 className="font-bold text-white text-xs md:text-sm">{dimIdx + 1}. {dim.name}</h3>
                          <p className="text-[11px] text-slate-400">{dim.description}</p>
                        </div>

                        <div className="flex justify-between items-center bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-800 text-[10px] text-slate-400">
                          <span>1 = Mínimo / Discordo</span>
                          <span>3 = Médio</span>
                          <span>5 = Máximo / Concordo</span>
                        </div>

                        <div className="divide-y divide-slate-800">
                          {dim.questions.map((q, qIdx) => (
                            <div key={q.id} className="py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
                              <span className="text-xs text-slate-200 leading-relaxed">{dimIdx + 1}.{qIdx + 1} {q.text}</span>
                              <div className="flex gap-2 justify-end shrink-0 pt-1 md:pt-0">
                                {[1, 2, 3, 4, 5].map(score => (
                                  <button
                                    key={score}
                                    onClick={() => setFormData(prev => ({
                                      ...prev,
                                      responses: { ...(prev.responses || {}), [q.id]: score }
                                    }))}
                                    className={`w-9 h-9 md:w-8 md:h-8 rounded-xl text-xs font-bold border transition ${
                                      formData.responses?.[q.id] === score
                                        ? 'bg-teal-500 text-slate-950 border-teal-400 shadow-md scale-105'
                                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                                    }`}
                                  >
                                    {score}
                                  </button>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="pt-2">
                          <label className="block text-[11px] font-bold text-slate-400 mb-1">
                            Observações para {dim.name} (opcional):
                          </label>
                          <textarea
                            rows={2}
                            value={formData.notes?.[dim.id] || ''}
                            onChange={e => setFormData({
                              ...formData,
                              notes: { ...(formData.notes || {}), [dim.id]: e.target.value }
                            })}
                            placeholder="Descreva detalhes práticos ou justificativas..."
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-teal-500"
                          />
                        </div>
                      </div>
                    ))}
                    <button
                      disabled={isSubmitting}
                      onClick={handleFormSubmit}
                      className="w-full py-4 bg-teal-500 hover:bg-teal-400 disabled:bg-slate-700 text-slate-950 font-black rounded-xl text-xs shadow-lg shadow-teal-500/20 transition flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? 'Enviando e salvando...' : 'Enviar diagnóstico'}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-6">
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-500/10 border border-teal-500/25 rounded-full text-teal-300 font-bold text-[11px]">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Diagnóstico concluído
                    </span>
                    <h2 className="text-2xl font-black text-white mt-2">{lastSubmission?.startupName}</h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Fundador: <b className="text-slate-200">{lastSubmission?.founder}</b> · Segmento: <b className="text-slate-200">{lastSubmission?.segment}</b>
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-center min-w-[100px]">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">SCORE TOTAL</span>
                      <p className="text-2xl font-black text-teal-400 mt-0.5">{lastSubmission?.score} <span className="text-xs text-slate-500 font-normal">/200</span></p>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-center min-w-[100px] flex flex-col justify-center">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">ESTÁGIO</span>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getStageBadge(lastSubmission?.stage)}`}>
                        {lastSubmission?.stage}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider text-center">RADAR DE MATURIDADE (8 DIMENSÕES)</h3>
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={
                          GOVTECH_DIMENSIONS.map(d => ({
                            subject: getShortLabel(d.name),
                            A: lastSubmission?.dimensions?.[d.name] || 0
                          }))
                        }>
                          <PolarGrid stroke="#334155" />
                          <PolarAngleAxis dataKey="subject" tick={<RadarTick />} />
                          <PolarRadiusAxis angle={30} domain={[0, 25]} stroke="#475569" fontSize={10} />
                          <Radar name="Startup" dataKey="A" stroke="#0d9488" fill="#0d9488" fillOpacity={0.4} />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">PONTUAÇÃO POR DIMENSÃO</h3>
                    <div className="space-y-2">
                      {GOVTECH_DIMENSIONS.map(d => {
                        const score = lastSubmission?.dimensions?.[d.name] || 0;
                        return (
                          <div key={d.id} className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 flex justify-between items-center">
                            <span className="text-xs font-semibold text-slate-200">{d.name}</span>
                            <span className="text-xs font-bold text-teal-300 bg-teal-500/10 px-2.5 py-0.5 rounded-lg border border-teal-500/20">
                              {score} / 25
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-4 border-t border-slate-800">
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        setCopiedLink(true);
                        setTimeout(() => setCopiedLink(false), 2000);
                      }}
                      className="w-full sm:w-auto px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs border border-slate-700 flex items-center justify-center gap-2"
                    >
                      {copiedLink ? <Check className="h-4 w-4 text-teal-400" /> : <Copy className="h-4 w-4" />}
                      {copiedLink ? 'Link copiado!' : 'Copiar link do resultado'}
                    </button>
                    <button
                      onClick={() => window.print()}
                      className="w-full sm:w-auto px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs border border-slate-700 flex items-center justify-center gap-2"
                    >
                      <Printer className="h-4 w-4" /> Exportar PDF / Imprimir
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setCurrentStep(0);
                      setFormData(EMPTY_FORM);
                    }}
                    className="w-full sm:w-auto px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs transition"
                  >
                    Preencher novo diagnóstico
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      )}

      {/* PAINEL ADMINISTRATIVO */}
      {role === 'admin' && (
        <>
          {!adminAuth ? (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
              <form onSubmit={handleAdminLogin} className="bg-slate-950 border border-slate-800 p-6 md:p-8 rounded-3xl max-w-md w-full space-y-6 text-center">
                <div className="w-12 h-12 bg-purple-500/10 text-purple-400 rounded-2xl flex items-center justify-center mx-auto border border-purple-500/20">
                  <Lock className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Acesso Restrito</h2>
                  <p className="text-xs text-slate-400 mt-1">Digite a senha de administrador para acessar o painel.</p>
                </div>
                <div>
                  <input
                    type="password"
                    placeholder="Senha / PIN"
                    value={adminPinInput}
                    onChange={e => setAdminPinInput(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-sm text-center text-white outline-none focus:border-purple-500"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setRole(null)}
                    className="w-1/2 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs"
                  >
                    Voltar
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs"
                  >
                    Entrar
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row h-screen bg-slate-100 font-sans text-slate-800 overflow-hidden relative">
              
              <div className="md:hidden bg-slate-900 text-white px-4 py-3 flex justify-between items-center border-b border-slate-800 shrink-0 z-30">
                <LogoHeader size="normal" />
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 rounded-xl bg-slate-800 text-slate-200 border border-slate-700 focus:outline-none"
                >
                  {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
              </div>

              {mobileMenuOpen && (
                <div 
                  className="md:hidden fixed inset-0 bg-slate-950/80 z-40 backdrop-blur-sm"
                  onClick={() => setMobileMenuOpen(false)}
                />
              )}

              <aside className={`
                fixed md:static inset-y-0 left-0 z-50
                w-72 md:w-64 bg-slate-900 text-white flex flex-col justify-between p-5 border-r border-slate-800 shrink-0
                transform transition-transform duration-300 ease-in-out
                ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
              `}>
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <LogoHeader size="normal" />
                    <button 
                      onClick={() => setMobileMenuOpen(false)}
                      className="md:hidden p-1.5 text-slate-400 hover:text-white"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <nav className="space-y-1">
                    {[
                      { key: 'dashboard', label: 'Visão geral', icon: LayoutDashboard },
                      { key: 'plano', label: 'Plano por startup', icon: Target },
                      { key: 'trilhas', label: 'Trilhas de conhecimento', icon: GraduationCap },
                      { key: 'benchmarking', label: 'Benchmarking', icon: Scale },
                      { key: 'pin', label: 'Configurar PIN', icon: Key },
                      { key: 'matriz', label: 'Matriz de perguntas', icon: ListChecks }
                    ].map(item => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.key}
                          onClick={() => {
                            if (item.key === 'matriz') {
                              setShowMatrixModal(true);
                            } else {
                              setActiveAdminTab(item.key);
                            }
                            setMobileMenuOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                            activeAdminTab === item.key && item.key !== 'matriz' ? 'bg-teal-500 text-slate-950' : 'text-slate-200 hover:bg-slate-800'
                          }`}
                        >
                          <Icon className="h-4 w-4" /> {item.label}
                        </button>
                      );
                    })}
                  </nav>
                </div>
                <button
                  onClick={() => { setAdminAuth(false); setRole(null); }}
                  className="mt-6 text-xs text-slate-400 hover:text-white flex items-center gap-2 pt-4 border-t border-slate-800"
                >
                  <LogOut className="h-4 w-4" /> Sair do painel
                </button>
              </aside>

              <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">

                {/* 1. VISÃO GERAL */}
                {activeAdminTab === 'dashboard' && (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div>
                        <h1 className="text-xl font-bold text-slate-900">Dashboard de maturidade das startups</h1>
                        <p className="text-xs text-slate-500">Métricas consolidadas, análise individual e distribuição do portfólio.</p>
                      </div>
                      <button
                        onClick={fetchStartups}
                        className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-sm transition"
                      >
                        <RefreshCw className="h-3.5 w-3.5" /> Atualizar dados
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pontuação Média</span>
                        <p className="text-2xl font-black text-slate-900 mt-1">{avgOverallScore.toFixed(1)} <span className="text-xs text-slate-400 font-normal">/ 200 pts</span></p>
                        <span className="text-[11px] text-slate-500 block mt-1">Média por dimensão: {(avgOverallScore / 8).toFixed(1)} / 25</span>
                      </div>

                      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Destaque Principal</span>
                        <p className="text-sm font-bold text-teal-700 mt-1 truncate">{highlightTop}</p>
                        <span className="text-[11px] text-slate-500 block mt-1">Maior pontuação do portfólio</span>
                      </div>

                      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Maior Oportunidade</span>
                        <p className="text-sm font-bold text-amber-700 mt-1 truncate">{highlightLow}</p>
                        <span className="text-[11px] text-slate-500 block mt-1">Gargalo prioritário do lote</span>
                      </div>

                      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Startups Analisadas</span>
                        <p className="text-2xl font-black text-purple-700 mt-1">{safeSubmissions.length}</p>
                        <span className="text-[11px] text-slate-500 block mt-1">Total cadastrado no programa</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Radar de Maturidade (Média Geral)</h3>
                        <div className="h-72 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarChartData}>
                              <PolarGrid stroke="#e2e8f0" />
                              <PolarAngleAxis dataKey="subject" tick={<RadarTick />} />
                              <PolarRadiusAxis angle={30} domain={[0, 25]} stroke="#cbd5e1" fontSize={10} />
                              <Radar name="Média" dataKey="A" stroke="#0d9488" fill="#0d9488" fillOpacity={0.3} />
                            </RadarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Pontuação por Dimensão (0 a 25 pts)</h3>
                        <div className="h-72 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -20, bottom: 65 }}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} />
                              <XAxis 
                                dataKey="name" 
                                stroke="#475569" 
                                fontSize={10} 
                                interval={0} 
                                angle={-45} 
                                textAnchor="end"
                              />
                              <YAxis domain={[0, 25]} stroke="#64748b" fontSize={10} />
                              <Tooltip />
                              <Bar dataKey="Score" fill="#0d9488" radius={[4, 4, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>

                    {/* TABELA COM FILTRO POR ESTÁGIO, BUSCA E ÍCONES COMPLETOS */}
                    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm space-y-4 p-5">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <h3 className="font-bold text-sm text-slate-900">Startups cadastradas</h3>
                        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                          <select
                            value={tableStageFilter}
                            onChange={e => setTableStageFilter(e.target.value)}
                            className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 outline-none"
                          >
                            <option value="Todos">Todos os estágios</option>
                            {STAGE_LIST.map(st => <option key={st} value={st}>{st}</option>)}
                          </select>

                          <div className="relative flex-1 sm:w-64">
                            <Search className="h-3.5 w-3.5 absolute left-3 top-2.5 text-slate-400" />
                            <input
                              type="text"
                              placeholder="Buscar por startup, fundador ou e-mail..."
                              value={tableSearchTerm}
                              onChange={e => setTableSearchTerm(e.target.value)}
                              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 outline-none focus:border-teal-500"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="overflow-x-auto border border-slate-100 rounded-xl">
                        <table className="w-full text-left text-xs min-w-[700px]">
                          <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                            <tr>
                              <th className="p-3">STARTUP</th>
                              <th className="p-3">FUNDADOR E CONTATO</th>
                              <th className="p-3">ESTÁGIO</th>
                              <th className="p-3">SCORE TOTAL</th>
                              <th className="p-3 text-right">AÇÕES</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {tableFilteredSubmissions.length === 0 ? (
                              <tr><td colSpan={5} className="p-5 text-center text-slate-400">Nenhuma startup encontrada.</td></tr>
                            ) : (
                              tableFilteredSubmissions.map(s => (
                                <tr key={s.id} className="hover:bg-slate-50/80 transition">
                                  <td className="p-3">
                                    <span className="font-bold text-slate-900 block text-xs">{s.startupName}</span>
                                    <span className="text-[10px] text-slate-500">{s.segment}</span>
                                  </td>
                                  <td className="p-3">
                                    <span className="font-medium text-slate-800 block text-xs">{s.founder}</span>
                                    <span className="text-[10px] text-slate-500 block flex items-center gap-1 mt-0.5">
                                      📞 {s.whatsapp}
                                    </span>
                                    <span className="text-[10px] text-slate-500 block flex items-center gap-1">
                                      ✉️ {s.email}
                                    </span>
                                  </td>
                                  <td className="p-3">
                                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStageBadge(s.stage)}`}>{s.stage}</span>
                                  </td>
                                  <td className="p-3 font-black text-slate-900 text-sm">{s.score} / 200</td>
                                  <td className="p-3 text-right space-x-3">
                                    <button
                                      onClick={() => {
                                        setSelectedPlanStartupId(s.id);
                                        setActiveAdminTab('plano');
                                      }}
                                      className="text-xs font-bold text-teal-700 hover:underline inline-flex items-center gap-1"
                                    >
                                      Ver plano &gt;
                                    </button>
                                    <button
                                      onClick={() => {
                                        navigator.clipboard.writeText(window.location.href);
                                        alert('Link da startup copiado!');
                                      }}
                                      className="text-slate-500 hover:text-slate-800"
                                      title="Copiar link"
                                    >
                                      <Copy className="h-3.5 w-3.5 inline" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteStartup(s.id)}
                                      className="text-rose-600 hover:text-rose-800"
                                      title="Excluir"
                                    >
                                      <Trash2 className="h-3.5 w-3.5 inline" />
                                    </button>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. PLANO POR STARTUP (Restaurado ao modelo AchaBuraco) */}
                {activeAdminTab === 'plano' && (
                  <div className="space-y-6">
                    <div className="bg-white p-4 md:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <h1 className="text-xl font-bold text-slate-900">Plano de ação por startup</h1>
                        <p className="text-xs text-slate-500">Ações por dimensão, com ferramentas sugeridas, métricas a acompanhar e entregáveis esperados.</p>
                      </div>
                      <div className="w-full md:w-80">
                        <select
                          value={selectedPlanStartupId}
                          onChange={e => setSelectedPlanStartupId(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 outline-none"
                        >
                          {safeSubmissions.map(s => (
                            <option key={s.id} value={s.id}>{s.startupName} ({s.stage})</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {currentPlanStartup ? (
                      <div className="space-y-6">
                        {/* CABEÇALHO DO PLANO COM BOTÃO PDF */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                          <div>
                            <span className="text-[10px] font-bold text-teal-600 uppercase tracking-wider block">PLANO PERSONALIZADO</span>
                            <h2 className="text-2xl font-black text-slate-900 mt-0.5">{currentPlanStartup.startupName}</h2>
                            <p className="text-xs text-slate-500 mt-1">
                              Fundador: <b className="text-slate-800">{currentPlanStartup.founder}</b> · {currentPlanStartup.segment} · Score: <b className="text-slate-800">{currentPlanStartup.score} / 200 pts</b>
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-3">
                              <span>📞 {currentPlanStartup.whatsapp}</span>
                              <span>✉️ {currentPlanStartup.email}</span>
                            </p>
                          </div>

                          <div className="flex gap-2 w-full md:w-auto">
                            <button
                              onClick={() => window.print()}
                              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs shadow-md transition flex items-center justify-center gap-2 w-full md:w-auto"
                            >
                              <Printer className="h-4 w-4" /> Exportar relatório em PDF
                            </button>
                          </div>
                        </div>

                        {/* OBSERVAÇÕES ENVIADAS PELA STARTUP */}
                        {Object.keys(currentPlanStartup.notes || {}).length > 0 && (
                          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">OBSERVAÇÕES ENVIADAS PELA STARTUP</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {Object.entries(currentPlanStartup.notes || {}).map(([dimId, noteText]) => {
                                const dimObj = GOVTECH_DIMENSIONS.find(d => d.id === dimId);
                                return (
                                  <div key={dimId} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                                    <span className="font-bold text-xs text-teal-800 block">{dimObj?.name || dimId}</span>
                                    <p className="text-xs text-slate-600 italic">"{noteText}"</p>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* LISTA DAS 8 DIMENSÕES COM ENTREGÁVEIS */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {GOVTECH_DIMENSIONS.map(dim => {
                            const score = currentPlanStartup.dimensions?.[dim.name] || 0;
                            const percent = Math.round((score / 25) * 100);
                            const rec = PLAN_RECOMMENDATIONS[dim.id] || {};

                            return (
                              <div key={dim.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                                <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                                  <div>
                                    <h3 className="font-bold text-sm text-slate-900">{dim.name}</h3>
                                    <span className="text-xs font-bold text-teal-700">{score} / 25 pts · {percent}% · nível {percent >= 70 ? 'Avançado' : 'Intermediário'}</span>
                                  </div>
                                  <span className="text-[10px] bg-slate-100 border border-slate-200 text-slate-600 px-2.5 py-1 rounded-lg font-medium">
                                    Meta: sustentar a referência e replicar boas práticas
                                  </span>
                                </div>

                                <div className="space-y-3">
                                  <div className="space-y-1">
                                    <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                                      <CheckCircle2 className="h-4 w-4 text-teal-600 shrink-0" /> {rec.title}
                                    </h4>
                                    <p className="text-xs text-slate-600 leading-relaxed pl-5">{rec.action}</p>
                                  </div>

                                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                                    <span className="font-bold text-[10px] text-slate-400 uppercase block flex items-center gap-1">
                                      <Wrench className="h-3 w-3" /> FERRAMENTAS SUGERIDAS
                                    </span>
                                    <p className="text-xs text-slate-700">{rec.tools}</p>
                                  </div>

                                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                                    <span className="font-bold text-[10px] text-slate-400 uppercase block flex items-center gap-1">
                                      <Gauge className="h-3 w-3" /> MÉTRICAS A ACOMPANHAR
                                    </span>
                                    <p className="text-xs text-slate-700">{rec.metrics}</p>
                                  </div>

                                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                                    <span className="font-bold text-[10px] text-slate-400 uppercase block flex items-center gap-1">
                                      <Package className="h-3 w-3" /> ENTREGÁVEL ESPERADO
                                    </span>
                                    <p className="text-xs text-slate-700">{rec.deliverable}</p>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="bg-white p-8 rounded-2xl text-center text-xs text-slate-500 border border-slate-200">
                        Nenhuma startup cadastrada.
                      </div>
                    )}
                  </div>
                )}

                {/* 3. TRILHAS DE CONHECIMENTO (Restaurado ao modelo com abas e badges) */}
                {activeAdminTab === 'trilhas' && (
                  <div className="space-y-6">
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-center">
                      <div>
                        <h1 className="text-xl font-bold text-slate-900">Trilhas de conhecimento</h1>
                        <p className="text-xs text-slate-500">Três pacotes de capacitação com 12 temáticas cada, ordenados por prioridade e cobrindo as 8 dimensões.</p>
                      </div>
                      <span className="px-3 py-1 bg-teal-50 border border-teal-200 rounded-full text-xs font-bold text-teal-800">
                        3 trilhas · 36 módulos
                      </span>
                    </div>

                    {/* ABAS SUPERIORES DAS TRILHAS */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {DETAILED_TRACKS.map(t => {
                        const isActive = activeTrackId === t.id;
                        return (
                          <button
                            key={t.id}
                            onClick={() => setActiveTrackId(t.id)}
                            className={`p-4 rounded-2xl border text-left transition ${
                              isActive
                                ? 'bg-white border-teal-500 shadow-md ring-2 ring-teal-500/20'
                                : 'bg-slate-50 border-slate-200 hover:bg-white'
                            }`}
                          >
                            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 block mb-1">12 TEMÁTICAS</span>
                            <h3 className="font-bold text-sm text-slate-900">{t.title}</h3>
                            <p className="text-xs text-slate-500 mt-1">{t.subtitle}</p>
                          </button>
                        );
                      })}
                    </div>

                    {/* DETALHAMENTO DA TRILHA SELEÇÃO */}
                    {(() => {
                      const track = DETAILED_TRACKS.find(t => t.id === activeTrackId);
                      if (!track) return null;
                      return (
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                          <div>
                            <h2 className="text-xl font-black text-slate-900">{track.title}</h2>
                            <p className="text-xs text-slate-500 mt-1">{track.subtitle}</p>
                          </div>

                          {/* RESUMO DAS DIMENSÕES NA TRILHA */}
                          <div className="flex flex-wrap gap-2">
                            {track.dimensionsSummary.map((d, i) => (
                              <span key={i} className="px-3 py-1 bg-teal-50 text-teal-800 border border-teal-200 rounded-full text-[11px] font-semibold">
                                {d.name} · {d.count}
                              </span>
                            ))}
                          </div>

                          <div className="pt-2 space-y-3">
                            <span className="text-[11px] font-bold px-2.5 py-1 bg-rose-100 text-rose-800 rounded-full inline-block">
                              Prioridade Alta · {track.modules.length} módulos
                            </span>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {track.modules.map(mod => (
                                <div key={mod.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 flex items-start gap-3">
                                  <div className="w-7 h-7 bg-teal-700 text-white rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                                    {mod.id}
                                  </div>
                                  <div>
                                    <h4 className="font-bold text-xs text-slate-900">{mod.title}</h4>
                                    <span className="text-[10px] text-slate-500 block mt-0.5">{mod.category}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* 4. BENCHMARKING (Restaurado ao modelo de comparação com gráfico agrupado) */}
                {activeAdminTab === 'benchmarking' && (
                  <div className="space-y-6">
                    <div>
                      <h1 className="text-xl font-bold text-slate-900">Benchmarking entre startups</h1>
                      <p className="text-xs text-slate-500">Selecione até 3 startups para comparar os resultados do diagnóstico lado a lado.</p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">STARTUPS SELECIONADAS</span>
                      <div className="flex flex-wrap gap-2">
                        {safeSubmissions.map(s => {
                          const isSel = selectedBenchStartups.includes(s.id);
                          return (
                            <button
                              key={s.id}
                              onClick={() => {
                                if (isSel) setSelectedBenchStartups(selectedBenchStartups.filter(id => id !== s.id));
                                else if (selectedBenchStartups.length < 3) setSelectedBenchStartups([...selectedBenchStartups, s.id]);
                              }}
                              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition ${
                                isSel ? 'bg-teal-500 text-slate-950 border-teal-400 shadow-sm' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              {s.startupName}
                            </button>
                          );
                        })}
                      </div>

                      {/* CARDS COMPARATIVOS */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                        {selectedBenchStartups.map(id => {
                          const s = safeSubmissions.find(sub => sub.id === id);
                          if (!s) return null;
                          return (
                            <div key={s.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                              <h3 className="font-bold text-base text-slate-900">{s.startupName}</h3>
                              <p className="text-2xl font-black text-teal-700">{s.score} <span className="text-xs font-normal text-slate-400">/ 200</span></p>
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border inline-block ${getStageBadge(s.stage)}`}>{s.stage}</span>
                              <div className="pt-2 text-xs text-slate-500 space-y-1 border-t border-slate-200/60 mt-2">
                                <p className="flex items-center gap-1.5"><Building2 className="h-3.5 w-3.5 text-slate-400" /> {s.segment}</p>
                                <p className="flex items-center gap-1.5">✉️ {s.email}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* GRÁFICO DE BARRAS AGRUPADAS DE 8 DIMENSÕES */}
                    {benchSelectedObjects.length > 0 && (
                      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">COMPARATIVO PELAS 8 DIMENSÕES</h3>
                        <div className="h-80 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={benchChartData} margin={{ top: 10, right: 10, left: -20, bottom: 60 }}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} />
                              <XAxis dataKey="name" stroke="#475569" fontSize={10} interval={0} angle={-35} textAnchor="end" />
                              <YAxis domain={[0, 25]} stroke="#64748b" fontSize={10} />
                              <Tooltip />
                              <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: '10px' }} />
                              {benchSelectedObjects.map((obj, idx) => (
                                <Bar key={obj.id} dataKey={obj.startupName} fill={BENCH_COLORS[idx % BENCH_COLORS.length]} radius={[4, 4, 0, 0]} />
                              ))}
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 5. CONFIGURAR PIN */}
                {activeAdminTab === 'pin' && (
                  <div className="max-w-md bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                    <div>
                      <h2 className="text-base font-bold text-slate-900">Alterar senha do administrador</h2>
                      <p className="text-xs text-slate-500 mt-0.5">Defina uma nova senha de acesso ao painel de mentoria.</p>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">NOVA SENHA / PIN</label>
                        <input
                          type="password"
                          value={newPinInput}
                          onChange={e => setNewPinInput(e.target.value)}
                          placeholder="Mínimo de 4 caracteres"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:border-teal-500"
                        />
                      </div>
                      <button
                        onClick={() => {
                          if (newPinInput.length >= 4) {
                            setAdminPin(newPinInput);
                            alert('PIN alterado com sucesso!');
                            setNewPinInput('');
                          } else {
                            alert('A senha deve ter pelo menos 4 caracteres.');
                          }
                        }}
                        className="w-full py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl text-xs transition"
                      >
                        Salvar nova senha
                      </button>
                    </div>
                  </div>
                )}

              </main>
            </div>
          )}
        </>
      )}
    </div>
  );
}
