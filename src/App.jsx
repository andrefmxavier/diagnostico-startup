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
// 1. DIMENSÕES E INDICADORES
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

const SHORT_LABELS = GOVTECH_DIMENSIONS.reduce((acc, d) => { acc[d.name] = d.short; return acc; }, {});
const DIM_ID_BY_NAME = GOVTECH_DIMENSIONS.reduce((acc, d) => { acc[d.name] = d.id; return acc; }, {});
const getShortLabel = (fullName) => SHORT_LABELS?.[fullName] || fullName || '';
const ALL_QUESTIONS = GOVTECH_DIMENSIONS.flatMap(d => d.questions);

// ============================================================================
// 2. MÓDULOS DE CAPACITAÇÃO (TRILHA DINÂMICA)
// ============================================================================
const ALL_MODULES_DATABASE = [
  { id: 'm1', title: 'Tese de valor e dor prioritária do cliente', dim: 'estrategia' },
  { id: 'm2', title: 'Entrevistas de descoberta e validação do problema', dim: 'estrategia' },
  { id: 'm3', title: 'Dimensionamento de Mercado (TAM/SAM/SOM) e Proposta Comercial', dim: 'estrategia' },
  { id: 'm4', title: 'Modelos de Contratação Pública e Privada (SaaS, B2B e B2G)', dim: 'estrategia' },
  
  { id: 'm5', title: 'Acordo de sócios, vesting e cap table inicial', dim: 'lideranca' },
  { id: 'm6', title: 'Ritmo de Gestão por Indicadores (OKRs e KPIs)', dim: 'lideranca' },
  { id: 'm7', title: 'Governança Corporativa e Conselho Consultivo', dim: 'lideranca' },
  { id: 'm8', title: 'Complementaridade do Time e Sucessão', dim: 'lideranca' },

  { id: 'm9', title: 'Arquitetura de Software e Controle de Propriedade Intelectual (IP)', dim: 'tecnologia' },
  { id: 'm10', title: 'Aplicação prática de IA Generativa e Automação de Processos', dim: 'tecnologia' },
  { id: 'm11', title: 'APIs, Integração com Legados e Segurança da Informação', dim: 'tecnologia' },
  { id: 'm12', title: 'Conformidade com a LGPD e Auditoria de Código', dim: 'tecnologia' },

  { id: 'm13', title: 'Cultura de Experimentação e Testes Rápidos de Hipóteses', dim: 'cultura' },
  { id: 'm14', title: 'Documentação e Circulação Sistemática de Aprendizados', dim: 'cultura' },
  { id: 'm15', title: 'Inovação Aberta e Parcerias com ICTs e Universidades', dim: 'cultura' },

  { id: 'm16', title: 'UX/UI Design: Foco na Simplicidade e Experiência do Usuário', dim: 'pessoas' },
  { id: 'm17', title: 'Estruturação de Atendimento, Suporte e Customer Success', dim: 'pessoas' },
  { id: 'm18', title: 'Retenção de Talentos Técnicos e Capacitação Continuada', dim: 'pessoas' },

  { id: 'm19', title: 'Construção de MVP Enxuto e Validação em Campo', dim: 'estrutura' },
  { id: 'm20', title: 'Provas de Conceito (PoC): Escopo e Critérios de Aceite', dim: 'estrutura' },
  { id: 'm21', title: 'Métricas de Uso Ativo, Engajamento e Ativação', dim: 'estrutura' },

  { id: 'm22', title: 'Metodologias Ágeis de Desenvolvimento (Scrum/Kanban)', dim: 'processos' },
  { id: 'm23', title: 'Estruturação do Funil de Vendas e CRM na Prática', dim: 'processos' },
  { id: 'm24', title: 'Playbook de Onboarding de Clientes e Acordos de SLA', dim: 'processos' },

  { id: 'm25', title: 'DRE Gerencial, Fluxo de Caixa e Projeção de Runway', dim: 'recursos' },
  { id: 'm26', title: 'Captação via Editais de Fomento (FINEP, Sebrae, CNPq)', dim: 'recursos' },
  { id: 'm27', title: 'Precificação Sustentável e Análise de Unit Economics (CAC/LTV)', dim: 'recursos' },
  { id: 'm28', title: 'Preparação para Rodada de Investimento Anjo e VC (Data Room)', dim: 'recursos' }
];

const STAGE_LIST = ['Ideação', 'Operação', 'Tração', 'Escala'];
const SEGMENT_OPTIONS = [
  'SaaS B2B',
  'GovTech / Cidades Inteligentes',
  'Healthtech / Saúde',
  'Edtech / Educação',
  'Fintech / Serviços Financeiros',
  'Agtech / Agronegócio',
  'E-commerce / Retailtech',
  'Outro'
];

const SEGMENT_PALETTE = ['#0D9488', '#2563EB', '#7C3AED', '#D97706', '#0891B2', '#DB2777', '#65A30D', '#475569'];

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
  const { x = 0, y = 0, textAnchor, payload, color = '#1E293B' } = props;
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
          Maturidade 2026
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
  const [adminPinInput, setAdminPinInput] = useState('');
  const [submissions, setSubmissions] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [submitted, setSubmitted] = useState(false);

  const [activeAdminTab, setActiveAdminTab] = useState('dashboard');
  const [selectedTrackStartupId, setSelectedTrackStartupId] = useState('');

  const fetchStartups = async () => {
    const { data, error } = await supabase.from('startups').select('*');
    if (data && !error) {
      const formatted = data.map(item => ({
        id: item.id,
        startupName: item.startup_name,
        founder: item.founder,
        email: item.email,
        whatsapp: item.whatsapp,
        segment: item.segment || 'Não informado',
        stage: item.stage,
        score: item.score,
        date: item.date,
        dimensions: item.dimensions,
        notes: item.notes
      }));
      setSubmissions(formatted);
      if (formatted.length > 0 && !selectedTrackStartupId) {
        setSelectedTrackStartupId(formatted[0].id);
      }
    }
  };

  useEffect(() => {
    fetchStartups();
  }, []);

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminPinInput === 'admin123') {
      setAdminAuth(true);
    } else {
      alert('Senha incorreta!');
    }
  };

  const handleFormSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    const dimScores = {};
    let grandTotal = 0;

    GOVTECH_DIMENSIONS.forEach(dim => {
      let dimTotal = 0;
      (dim.questions || []).forEach(q => {
        dimTotal += formData.responses?.[q.id] || 0;
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
      startup_name: formData.startupName,
      founder: formData.founder,
      email: formData.email,
      whatsapp: formData.whatsapp,
      segment: formData.segment,
      stage,
      score: grandTotal,
      date: new Date().toISOString().split('T')[0],
      dimensions: dimScores,
      notes: cleanNotes
    };

    const { error } = await supabase.from('startups').insert([newEntry]);

    if (!error) {
      fetchStartups();
      setSubmitted(true);
    } else {
      alert('Erro ao enviar respostas. Tente novamente.');
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

  const radarChartData = Object.entries(activeDimValues).map(([key, val]) => ({
    subject: getShortLabel(key),
    A: Number(val) || 0
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

  const currentTrackStartup = safeSubmissions.find(s => s.id === selectedTrackStartupId) || safeSubmissions[0];

  const getDynamicTrackForStartup = (startup) => {
    if (!startup || !startup.dimensions) return [];

    const sortedDimensions = Object.entries(startup.dimensions)
      .map(([dimName, score]) => ({
        dimId: DIM_ID_BY_NAME[dimName],
        dimName,
        score
      }))
      .sort((a, b) => a.score - b.score);

    const dynamicModules = [];

    sortedDimensions.forEach((item, index) => {
      let priority = 'Baixa';
      if (index < 3 || item.score < 15) priority = 'Alta';
      else if (index < 5) priority = 'Média';

      const dimModules = ALL_MODULES_DATABASE.filter(m => m.dim === item.dimId);
      dimModules.forEach(m => {
        dynamicModules.push({
          ...m,
          dimName: item.dimName,
          score: item.score,
          priority
        });
      });
    });

    return dynamicModules;
  };

  const dynamicModules = getDynamicTrackForStartup(currentTrackStartup);
  const answeredCount = ALL_QUESTIONS.filter(q => formData.responses?.[q.id] > 0).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">

      {/* SELEÇÃO DE INÍCIO */}
      {!role && (
        <div className="min-h-screen bg-slate-900 flex flex-col justify-between p-4 md:p-6">
          <header className="max-w-6xl mx-auto w-full flex flex-col sm:flex-row justify-between items-center gap-3 py-4 border-b border-slate-800 text-center sm:text-left">
            <LogoHeader size="large" />
            <span className="text-[11px] font-semibold px-3 py-1 bg-teal-500/10 border border-teal-500/25 rounded-full text-teal-300">
              Programa de Incubação e Aceleração 2026
            </span>
          </header>

          <main className="max-w-5xl mx-auto w-full my-auto py-8 text-center space-y-8">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-500/10 border border-teal-500/25 rounded-full text-teal-300 font-bold text-[11px] uppercase">
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
                    <p className="text-xs text-slate-300 mt-1">Preencha o diagnóstico e receba seu score por dimensão.</p>
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
                    <p className="text-xs text-slate-300 mt-1">Análise em tempo real de todas as startups.</p>
                  </div>
                </div>
                <div className="mt-6 flex items-center text-xs font-bold text-purple-300 gap-2">
                  Acessar área restrita <Lock className="h-3.5 w-3.5" />
                </div>
              </button>
            </div>
          </main>
        </div>
      )}

      {/* ÁREA DA STARTUP */}
      {role === 'startup' && (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
          <header className="bg-slate-900 border-b border-slate-800 py-3 px-4 md:px-6 flex justify-between items-center sticky top-0 z-30">
            <LogoHeader size="normal" />
            <button
              onClick={() => { setRole(null); setSubmitted(false); }}
              className="text-xs font-medium text-slate-200 hover:text-white bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700"
            >
              Voltar
            </button>
          </header>

          <main className="max-w-4xl mx-auto w-full py-6 md:py-10 px-3 md:px-4">
            {!submitted ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-2xl space-y-6 md:space-y-8">
                {currentStep === 0 ? (
                  <div className="space-y-5">
                    <h2 className="text-lg md:text-xl font-bold text-white">Identificação da startup</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">Nome da startup *</label>
                        <input
                          type="text" required value={formData.startupName}
                          onChange={e => setFormData({ ...formData, startupName: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white outline-none focus:border-teal-400"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">Fundador *</label>
                          <input
                            type="text" required value={formData.founder}
                            onChange={e => setFormData({ ...formData, founder: e.target.value })}
                            className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white outline-none focus:border-teal-400"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">WhatsApp *</label>
                          <input
                            type="text" required value={formData.whatsapp}
                            onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                            className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white outline-none focus:border-teal-400"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">E-mail *</label>
                          <input
                            type="email" required value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white outline-none focus:border-teal-400"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">Segmento / Setor *</label>
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
                      className="w-full py-3.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs transition"
                    >
                      Iniciar questionário (40 indicadores)
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6 md:space-y-8">
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex justify-between items-center sticky top-16 z-20">
                      <span className="text-xs font-bold text-slate-300">Progresso:</span>
                      <span className="text-xs font-extrabold text-teal-300 bg-teal-500/10 px-3 py-1 rounded-lg border border-teal-500/20">
                        {answeredCount} / 40 respondidas
                      </span>
                    </div>

                    {GOVTECH_DIMENSIONS.map((dim, dimIdx) => (
                      <div key={dim.id} className="bg-slate-950 border border-slate-800 rounded-xl md:rounded-2xl p-4 md:p-5 space-y-4">
                        <h3 className="font-bold text-white text-xs md:text-sm">{dimIdx + 1}. {dim.name}</h3>
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
                                        ? 'bg-teal-500 text-slate-950 border-teal-400 shadow-md'
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
                      </div>
                    ))}
                    <button
                      onClick={handleFormSubmit}
                      className="w-full py-4 bg-teal-500 text-slate-950 font-black rounded-xl text-xs shadow-lg shadow-teal-500/20"
                    >
                      Enviar diagnóstico
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-slate-900 p-6 md:p-8 rounded-3xl space-y-4 text-center border border-slate-800">
                <CheckCircle2 className="h-10 w-10 md:h-12 md:w-12 text-teal-400 mx-auto" />
                <h2 className="text-lg md:text-xl font-bold text-white">Diagnóstico enviado com sucesso!</h2>
                <p className="text-xs text-slate-400">Sua pontuação foi gravada na nuvem e enviada ao painel de mentoria.</p>
              </div>
            )}
          </main>
        </div>
      )}

      {/* PAINEL ADMINISTRATIVO */}
      {role === 'admin' && (
        <>
          {/* TELA DE AUTENTICAÇÃO / LOGIN DO ADMIN */}
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
                    placeholder="Senha do Admin"
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
            <div className="flex flex-col md:flex-row h-screen bg-slate-100 font-sans text-slate-800 overflow-hidden">
              {/* HEADER MOBILE */}
              <div className="md:hidden bg-slate-900 text-white px-4 py-3 flex justify-between items-center border-b border-slate-800 shrink-0">
                <LogoHeader size="normal" />
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 rounded-lg bg-slate-800 text-slate-200"
                >
                  {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
              </div>

              {/* BARRA LATERAL */}
              <aside className={`${
                mobileMenuOpen ? 'block' : 'hidden'
              } md:block w-full md:w-64 bg-slate-900 text-white flex flex-col justify-between p-5 border-r border-slate-800 shrink-0 z-20`}>
                <div className="space-y-6">
                  <div className="hidden md:block">
                    <LogoHeader size="normal" />
                  </div>
                  <nav className="space-y-1">
                    {[
                      { key: 'dashboard', label: 'Visão geral', icon: LayoutDashboard },
                      { key: 'trilhas', label: 'Trilha Dinâmica (IA)', icon: GraduationCap }
                    ].map(item => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.key}
                          onClick={() => {
                            setActiveAdminTab(item.key);
                            setMobileMenuOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                            activeAdminTab === item.key ? 'bg-teal-500 text-slate-950' : 'text-slate-200 hover:bg-slate-800'
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
                  className="mt-6 md:mt-0 text-xs text-slate-400 hover:text-white flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" /> Sair do painel
                </button>
              </aside>

              {/* CONTEÚDO PRINCIPAL DO ADMIN */}
              <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
                {activeAdminTab === 'dashboard' && (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <h1 className="text-lg md:text-xl font-bold text-slate-900">Visão Geral do Portfólio (Supabase)</h1>
                      <button
                        onClick={fetchStartups}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-sm"
                      >
                        <RefreshCw className="h-3.5 w-3.5" /> Atualizar dados
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-white p-4 md:p-5 rounded-2xl border border-slate-200 shadow-sm">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Score Médio</span>
                        <p className="text-2xl md:text-3xl font-black text-slate-900 mt-1">{avgOverallScore.toFixed(1)}</p>
                      </div>
                      <div className="bg-white p-4 md:p-5 rounded-2xl border border-slate-200 shadow-sm">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Startups Registradas</span>
                        <p className="text-2xl md:text-3xl font-black text-purple-700 mt-1">{safeSubmissions.length}</p>
                      </div>
                    </div>

                    {/* GRÁFICOS RESTAURADOS */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* GRÁFICO DE RADAR DE MATURIDADE */}
                      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Maturidade Média por Dimensão</h3>
                        <div className="h-64 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarChartData}>
                              <PolarGrid stroke="#e2e8f0" />
                              <PolarAngleAxis dataKey="subject" tick={<RadarTick />} />
                              <PolarRadiusAxis angle={30} domain={[0, 25]} stroke="#cbd5e1" fontSize={10} />
                              <Radar name="Média" dataKey="A" stroke="#0d9488" fill="#0d9488" fillOpacity={0.4} />
                            </RadarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      {/* DISTRIBUIÇÃO POR ESTÁGIO */}
                      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Distribuição por Estágio</h3>
                        <div className="h-64 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stageDistribution}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} />
                              <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                              <YAxis allowDecimals={false} stroke="#64748b" fontSize={11} />
                              <Tooltip />
                              <Bar dataKey="Startups" fill="#2563eb" radius={[6, 6, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>

                    {/* TABELA DE RESPOSTAS */}
                    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                      <div className="p-4 border-b border-slate-200 bg-slate-50 font-bold text-xs text-slate-800">
                        Respostas Recebidas ({safeSubmissions.length})
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs min-w-[600px]">
                          <thead className="bg-slate-100 text-slate-600 font-bold">
                            <tr>
                              <th className="p-3">Startup</th>
                              <th className="p-3">Fundador</th>
                              <th className="p-3">Segmento</th>
                              <th className="p-3">Estágio</th>
                              <th className="p-3">Score</th>
                              <th className="p-3">Data</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {safeSubmissions.length === 0 ? (
                              <tr><td colSpan={6} className="p-5 text-center text-slate-400">Nenhuma startup respondeu ainda.</td></tr>
                            ) : (
                              safeSubmissions.map(s => (
                                <tr key={s.id}>
                                  <td className="p-3 font-bold text-slate-900">{s.startupName}</td>
                                  <td className="p-3 text-slate-600">{s.founder}</td>
                                  <td className="p-3 text-slate-500">{s.segment}</td>
                                  <td className="p-3"><span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStageBadge(s.stage)}`}>{s.stage}</span></td>
                                  <td className="p-3 font-extrabold text-teal-700">{s.score}/200</td>
                                  <td className="p-3 text-slate-500">{s.date}</td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* ABA DE TRILHA DINÂMICA PERSONALIZADA */}
                {activeAdminTab === 'trilhas' && (
                  <div className="space-y-6">
                    <div className="bg-white p-4 md:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <h1 className="text-lg md:text-xl font-bold text-slate-900 flex items-center gap-2">
                          <Sparkles className="h-5 w-5 text-teal-600" /> Trilha Dinâmica
                        </h1>
                        <p className="text-xs text-slate-600 mt-0.5">
                          Módulos organizados de acordo com as notas da startup.
                        </p>
                      </div>

                      <div className="w-full md:w-72">
                        <select
                          value={selectedTrackStartupId}
                          onChange={e => setSelectedTrackStartupId(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 outline-none"
                        >
                          {safeSubmissions.map(s => (
                            <option key={s.id} value={s.id}>{s.startupName} ({s.stage})</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {currentTrackStartup ? (
                      <div className="bg-white p-4 md:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                        <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                          <div>
                            <h2 className="text-base font-bold text-slate-900">{currentTrackStartup.startupName}</h2>
                            <span className="text-xs text-slate-500">Fundador: {currentTrackStartup.founder} · Score: {currentTrackStartup.score}/200</span>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStageBadge(currentTrackStartup.stage)}`}>
                            Estágio: {currentTrackStartup.stage}
                          </span>
                        </div>

                        <div className="space-y-4">
                          {['Alta', 'Média', 'Baixa'].map(priorityLevel => {
                            const modulesInLevel = dynamicModules.filter(m => m.priority === priorityLevel);
                            if (modulesInLevel.length === 0) return null;

                            return (
                              <div key={priorityLevel} className="space-y-3">
                                <div className="flex items-center gap-2">
                                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                                    priorityLevel === 'Alta' ? 'bg-rose-50 text-rose-800 border-rose-300' :
                                    priorityLevel === 'Média' ? 'bg-amber-50 text-amber-800 border-amber-300' :
                                    'bg-slate-100 text-slate-700 border-slate-300'
                                  }`}>
                                    Prioridade {priorityLevel} {priorityLevel === 'Alta' && '(Gargalos)'}
                                  </span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  {modulesInLevel.map((mod, idx) => (
                                    <div key={mod.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
                                      <span className="w-6 h-6 rounded-full bg-teal-700 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                                        {idx + 1}
                                      </span>
                                      <div>
                                        <h4 className="text-xs font-bold text-slate-900">{mod.title}</h4>
                                        <p className="text-[11px] text-slate-500 mt-0.5">
                                          Dimensão: <span className="font-semibold text-teal-700">{mod.dimName}</span> ({mod.score}/25)
                                        </p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="bg-white p-8 rounded-2xl text-center text-xs text-slate-500 border border-slate-200">
                        Nenhuma startup cadastrada no banco de dados para gerar a trilha.
                      </div>
                    )}
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
