import React, { useState, useEffect } from 'react';
import {
  Rocket, CheckCircle2, LayoutDashboard, Lock, ShieldAlert, Filter, Search,
  ChevronRight, ChevronDown, ChevronUp, RefreshCw, LogOut, ArrowRight, ChevronLeft,
  Zap, Phone, Mail, Printer, Scale, Target, Key, Trash2, Copy, Check, X,
  ListChecks, Wrench, Gauge, Package, MessageSquare, Info,
  Link as LinkIcon, GraduationCap, Building2
} from 'lucide-react';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, Cell
} from 'recharts';

// ============================================================================
// 1. AS 8 DIMENSÕES E OS 40 INDICADORES
//    "short" = rótulo enxuto usado nos gráficos
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
const DIM_BY_ID = GOVTECH_DIMENSIONS.reduce((acc, d) => { acc[d.id] = d; return acc; }, {});
const DIM_ID_BY_NAME = GOVTECH_DIMENSIONS.reduce((acc, d) => { acc[d.name] = d.id; return acc; }, {});
const getShortLabel = (fullName) => SHORT_LABELS?.[fullName] || fullName || '';

// ============================================================================
// 2. PLAYBOOK DE AÇÕES COM SUBTÓPICOS PRÁTICOS POR DIMENSÃO
//    Cada frente ajusta a ação ao nível e traz ferramentas, métricas e entregável
// ============================================================================
const ACTION_PLAYBOOK = {
  estrategia: [
    {
      frente: 'Validação da dor e da tese de valor',
      baixo: 'Rodar 15 entrevistas de descoberta com clientes-alvo para confirmar qual é a dor prioritária e como ela é resolvida hoje.',
      medio: 'Segmentar a base já entrevistada e priorizar os dois nichos com maior urgência e disposição a pagar.',
      alto: 'Converter a tese validada em plano de expansão para novas praças e verticais, com hipóteses de entrada documentadas.',
      ferramentas: 'Roteiro de entrevista no formato The Mom Test, quadro de dores no Miro e registro padronizado no Notion ou Google Forms.',
      metricas: 'Número de entrevistas concluídas, percentual que confirma a dor como prioritária e valor declarado de disposição a pagar.',
      entregavel: 'Relatório de descoberta de uma página com as cinco dores mais citadas e a proposta de valor revisada.'
    },
    {
      frente: 'Dimensionamento de mercado (TAM/SAM/SOM)',
      baixo: 'Levantar dados públicos do setor e montar a primeira estimativa de TAM, SAM e SOM com as fontes citadas.',
      medio: 'Refinar o SOM com dados reais do funil atual: ticket médio praticado, ciclo de venda e taxa de conversão.',
      alto: 'Modelar cenários de captura de mercado por região e vertical, com metas trimestrais de participação.',
      ferramentas: 'IBGE, Abstartups, relatórios setoriais, Google Trends e planilha de modelagem no Google Sheets ou Excel.',
      metricas: 'Ticket médio, ciclo médio de venda em dias, número de contas endereçáveis e participação de mercado atual.',
      entregavel: 'Planilha de mercado com premissas explícitas e três cenários: conservador, base e agressivo.'
    },
    {
      frente: 'Modelo de contratação e diferenciação',
      baixo: 'Mapear as formas de contratação viáveis (assinatura SaaS, licença, dispensa, pregão) e escolher a rota inicial.',
      medio: 'Padronizar proposta comercial e contrato-modelo, com política de desconto e critérios claros de aprovação.',
      alto: 'Estruturar contratos plurianuais e parcerias de canal para reduzir a dependência de vendas diretas.',
      ferramentas: 'Marco Legal das Startups (LC 182/2021), Lei 14.133/2021 e modelos contratuais revisados por assessoria jurídica.',
      metricas: 'Prazo médio entre proposta e assinatura, taxa de conversão de proposta em contrato e ticket recorrente.',
      entregavel: 'Kit comercial com proposta padrão, contrato-modelo e matriz comparativa frente aos concorrentes.'
    }
  ],
  lideranca: [
    {
      frente: 'Governança societária',
      baixo: 'Formalizar acordo de sócios, cap table e cláusulas de vesting antes de qualquer nova captação.',
      medio: 'Revisar o cap table considerando diluição futura e criar pool de opções para o time-chave.',
      alto: 'Preparar a governança para due diligence: atas organizadas, contratos assinados e societário sem passivos.',
      ferramentas: 'Planilha de cap table, assessoria jurídica societária e modelos de acordo de sócios e de vesting.',
      metricas: 'Percentual do capital formalizado, existência de cláusulas de saída e prazo de cliff definido.',
      entregavel: 'Acordo de sócios assinado e cap table atualizado com cenários de diluição.'
    },
    {
      frente: 'Ritmo de gestão orientado a dados',
      baixo: 'Instituir uma reunião semanal de uma hora com três indicadores fixos acompanhados pelos fundadores.',
      medio: 'Consolidar um painel único de indicadores e distribuir donos por métrica dentro do time.',
      alto: 'Operar por OKRs trimestrais com revisão mensal e prestação de contas ao conselho consultivo.',
      ferramentas: 'Google Data Studio ou Metabase, planilha de indicadores semanais e quadro de OKRs no Notion.',
      metricas: 'Aderência às reuniões semanais, percentual de metas atingidas no trimestre e tempo de atualização dos dados.',
      entregavel: 'Painel de indicadores publicado e ata semanal padronizada com decisões e responsáveis.'
    },
    {
      frente: 'Complementaridade e rede do time',
      baixo: 'Mapear as lacunas de competência entre negócios, tecnologia e operações e definir plano de suprimento.',
      medio: 'Trazer mentores ou consultores para as lacunas críticas enquanto a contratação ainda não se paga.',
      alto: 'Montar conselho consultivo com nomes de referência do setor e agenda formal de reuniões.',
      ferramentas: 'Matriz de competências, rede de mentoria do Hub, LinkedIn e associações setoriais.',
      metricas: 'Lacunas críticas cobertas, horas de mentoria aplicadas e número de conexões qualificadas geradas.',
      entregavel: 'Matriz de competências do time com plano de contratação e mentoria para os próximos seis meses.'
    }
  ],
  tecnologia: [
    {
      frente: 'Arquitetura, IP e documentação técnica',
      baixo: 'Documentar a arquitetura atual, as dependências e a titularidade do código desenvolvido por terceiros.',
      medio: 'Reduzir a dívida técnica crítica e formalizar cessão de direitos de todos os colaboradores e fornecedores.',
      alto: 'Proteger os ativos de propriedade intelectual (marca, software, eventual patente) e manter documentação viva.',
      ferramentas: 'Repositório versionado no GitHub ou GitLab, diagramas C4, INPI para marca e registro de software.',
      metricas: 'Cobertura de documentação, percentual de código com titularidade formalizada e itens de dívida técnica abertos.',
      entregavel: 'Documento de arquitetura atualizado e pasta de propriedade intelectual com contratos de cessão.'
    },
    {
      frente: 'IA, automação e escala do produto',
      baixo: 'Identificar dois processos manuais repetitivos e testar automação simples antes de investir em modelos.',
      medio: 'Colocar em produção um recurso com IA que reduza o tempo de tarefa do usuário, medindo antes e depois.',
      alto: 'Monitorar custo por inferência e qualidade dos modelos, com plano de otimização contínua.',
      ferramentas: 'APIs de modelos de linguagem, pipelines de dados, ferramentas de automação e observabilidade de custo.',
      metricas: 'Tempo economizado por tarefa, custo por inferência, taxa de acerto do modelo e adoção do recurso.',
      entregavel: 'Recurso de IA em produção com relatório de impacto medido e custo por usuário ativo.'
    },
    {
      frente: 'Segurança da informação e LGPD',
      baixo: 'Mapear os dados pessoais tratados, nomear o encarregado e publicar a política de privacidade.',
      medio: 'Implantar controle de acesso, criptografia em repouso e rotina testada de backup e restauração.',
      alto: 'Executar teste de intrusão periódico e manter plano de resposta a incidentes ensaiado.',
      ferramentas: 'Registro de operações de tratamento, gerenciador de segredos e backup automatizado com teste de restauração.',
      metricas: 'Tempo de restauração de backup, incidentes registrados, vulnerabilidades críticas abertas e prazo de correção.',
      entregavel: 'Relatório de conformidade com a LGPD e plano de resposta a incidentes documentado.'
    }
  ],
  cultura: [
    {
      frente: 'Ciclos de experimentação',
      baixo: 'Definir um ciclo quinzenal de experimentos com hipótese escrita, critério de sucesso e prazo.',
      medio: 'Priorizar experimentos por impacto e esforço, mantendo no máximo três testes simultâneos.',
      alto: 'Institucionalizar o backlog de experimentos com revisão mensal de resultados e decisões de continuidade.',
      ferramentas: 'Quadro de hipóteses no Trello ou Notion, ferramentas de teste A/B e enquetes rápidas com usuários.',
      metricas: 'Experimentos concluídos por mês, percentual de hipóteses validadas e tempo médio de ciclo.',
      entregavel: 'Backlog de experimentos com resultado registrado e decisão tomada para cada teste.'
    },
    {
      frente: 'Registro e circulação de aprendizados',
      baixo: 'Criar um repositório único onde toda entrevista e teste vira uma nota padronizada.',
      medio: 'Transformar aprendizados recorrentes em diretrizes de produto acessíveis a todo o time.',
      alto: 'Publicar sínteses periódicas de aprendizado para clientes e parceiros, reforçando autoridade no setor.',
      ferramentas: 'Base de conhecimento no Notion, gravação e transcrição de entrevistas e modelo padrão de nota.',
      metricas: 'Notas registradas por mês, tempo entre entrevista e registro e uso das notas em decisões de roadmap.',
      entregavel: 'Repositório de aprendizados organizado por dimensão e por persona de cliente.'
    },
    {
      frente: 'Atualização, diversidade e escuta ativa',
      baixo: 'Reservar duas horas semanais de estudo em pauta fixa e escutar usuários finais com regularidade.',
      medio: 'Incluir usuários de perfis diversos nos testes de usabilidade e registrar as barreiras encontradas.',
      alto: 'Manter programa de inovação aberta com ICTs, universidades e outras startups do ecossistema.',
      ferramentas: 'Agenda fixa de estudo, roteiro de teste de usabilidade e parcerias com ICTs e universidades.',
      metricas: 'Horas de capacitação por pessoa, diversidade de perfis nos testes e parcerias ativas.',
      entregavel: 'Calendário de estudo e relatório semestral de acessibilidade e usabilidade da solução.'
    }
  ],
  pessoas: [
    {
      frente: 'Capacidade interna de desenvolvimento',
      baixo: 'Reduzir a dependência de terceiros garantindo ao menos uma pessoa interna com domínio do código.',
      medio: 'Definir padrões de código, revisão por pares e ambiente de homologação antes de cada entrega.',
      alto: 'Estruturar squads com autonomia e plano de carreira técnico para reter pessoas-chave.',
      ferramentas: 'Guia de estilo de código, pull requests com revisão obrigatória, ambientes separados e testes automatizados.',
      metricas: 'Frequência de deploy, tempo de correção de bugs críticos, cobertura de testes e rotatividade técnica.',
      entregavel: 'Manual de engenharia com padrões, fluxo de revisão e política de deploy.'
    },
    {
      frente: 'UX/UI e simplicidade para o usuário final',
      baixo: 'Realizar cinco testes de usabilidade gravados com usuários reais e corrigir os três maiores travamentos.',
      medio: 'Padronizar componentes de interface e reduzir o número de cliques das tarefas mais frequentes.',
      alto: 'Manter pesquisa contínua de satisfação e evolução do produto guiada por dados de uso.',
      ferramentas: 'Figma, biblioteca de componentes, testes de usabilidade moderados e analytics de produto.',
      metricas: 'Taxa de conclusão de tarefa, tempo até o primeiro valor percebido, NPS e chamados por confusão de interface.',
      entregavel: 'Relatório de usabilidade com correções priorizadas e biblioteca de componentes publicada.'
    },
    {
      frente: 'Suporte, atendimento e Customer Success',
      baixo: 'Definir quem responde o cliente, por qual canal e em quanto tempo, com registro de todos os chamados.',
      medio: 'Criar base de ajuda e classificar chamados por causa raiz para atacar os motivos recorrentes.',
      alto: 'Implantar acompanhamento proativo de contas estratégicas com plano de sucesso por cliente.',
      ferramentas: 'Ferramenta de tickets, base de conhecimento pública e pesquisa de satisfação pós-atendimento.',
      metricas: 'Tempo de primeira resposta, tempo de solução, chamados por cliente ativo e taxa de renovação.',
      entregavel: 'Política de atendimento com SLA publicado e base de ajuda no ar.'
    }
  ],
  estrutura: [
    {
      frente: 'MVP e evidências de uso',
      baixo: 'Colocar o MVP em operação com pelo menos um usuário real utilizando semanalmente.',
      medio: 'Instrumentar o produto para medir uso e identificar quais recursos realmente entregam valor.',
      alto: 'Consolidar evidências de retenção e expansão de uso como base para novos contratos.',
      ferramentas: 'Analytics de produto, painel de uso semanal e entrevistas de acompanhamento com usuários ativos.',
      metricas: 'Usuários ativos semanais, retenção no trigésimo dia, frequência de uso e recursos mais utilizados.',
      entregavel: 'Painel de uso do produto com série histórica e relatório de retenção.'
    },
    {
      frente: 'Entrevistas estruturadas e provas de conceito',
      baixo: 'Completar 20 entrevistas estruturadas e selecionar um cliente âncora para a primeira PoC.',
      medio: 'Executar PoC com escopo, prazo e critérios de aceite formalizados em documento assinado.',
      alto: 'Converter PoCs em contratos recorrentes e transformar resultados em cases replicáveis.',
      ferramentas: 'Roteiro de entrevista, termo de PoC com critérios de aceite e cronograma de piloto.',
      metricas: 'PoCs em andamento, taxa de conversão de PoC em contrato e tempo médio de piloto.',
      entregavel: 'Termo de PoC assinado e relatório final de piloto com resultados quantificados.'
    },
    {
      frente: 'Validação jurídica e contratual',
      baixo: 'Revisar termos de uso, política de privacidade e modelo de contrato com apoio jurídico.',
      medio: 'Adequar contratos às exigências de compras públicas e privadas do seu segmento.',
      alto: 'Manter compliance contratual pronto para auditoria e due diligence de investidores.',
      ferramentas: 'Assessoria jurídica especializada, modelos contratuais setoriais e checklist de compliance.',
      metricas: 'Percentual de contratos padronizados, pendências jurídicas abertas e prazo médio de análise.',
      entregavel: 'Pasta jurídica organizada com contratos, termos e pareceres vigentes.'
    }
  ],
  processos: [
    {
      frente: 'Agilidade no desenvolvimento',
      baixo: 'Adotar um quadro Kanban visível com limite de trabalho em andamento e reunião semanal de prioridades.',
      medio: 'Operar sprints com escopo fechado, revisão de entrega e retrospectiva registrada.',
      alto: 'Medir previsibilidade de entrega e ajustar a capacidade do time com base em dados históricos.',
      ferramentas: 'Jira, Trello ou Linear, quadro Kanban compartilhado e rotina de retrospectiva.',
      metricas: 'Itens entregues por sprint, tempo de ciclo, previsibilidade da entrega e retrabalho.',
      entregavel: 'Cadência de sprints documentada com histórico de entregas e retrospectivas.'
    },
    {
      frente: 'Funil comercial estruturado',
      baixo: 'Desenhar as etapas do funil e registrar todas as oportunidades em um CRM, mesmo que gratuito.',
      medio: 'Medir a conversão por etapa e atacar o gargalo de maior perda antes de aumentar o topo do funil.',
      alto: 'Operar previsão de receita com pipeline ponderado e metas por vendedor ou canal.',
      ferramentas: 'CRM (HubSpot, Pipedrive ou RD Station), cadência de prospecção e materiais de apoio à venda.',
      metricas: 'Oportunidades criadas, conversão por etapa, ciclo de venda e receita prevista versus realizada.',
      entregavel: 'CRM operante com funil desenhado e relatório mensal de conversão.'
    },
    {
      frente: 'Onboarding de clientes e SLA',
      baixo: 'Escrever o roteiro de onboarding em etapas, com responsável e prazo para cada uma.',
      medio: 'Reduzir o tempo entre assinatura e primeiro valor entregue ao cliente, medindo cada etapa.',
      alto: 'Padronizar o onboarding em playbook replicável por segmento de cliente.',
      ferramentas: 'Checklist de implantação, materiais de treinamento, agenda de acompanhamento e SLA publicado.',
      metricas: 'Tempo de implantação, aderência ao SLA, satisfação pós-onboarding e churn nos primeiros 90 dias.',
      entregavel: 'Playbook de onboarding com checklist, materiais e cronograma padrão.'
    }
  ],
  recursos: [
    {
      frente: 'Runway, DRE e controle de caixa',
      baixo: 'Montar DRE gerencial mensal e calcular o runway atual com base no consumo médio de caixa.',
      medio: 'Projetar caixa para 12 meses com cenários e revisar mensalmente contra o realizado.',
      alto: 'Operar orçamento anual por centro de custo com acompanhamento de desvios.',
      ferramentas: 'Planilha de DRE gerencial, controle de fluxo de caixa e apoio contábil especializado.',
      metricas: 'Runway em meses, queima mensal de caixa, margem de contribuição e desvio entre orçado e realizado.',
      entregavel: 'DRE gerencial dos últimos 12 meses e projeção de caixa com cenários.'
    },
    {
      frente: 'Fomento e captação de recursos',
      baixo: 'Mapear editais abertos de FINEP, Sebrae, Fundação Araucária e CNPq compatíveis com o estágio atual.',
      medio: 'Submeter ao menos duas propostas por semestre, com documentação e certidões em dia.',
      alto: 'Estruturar rodada de investimento com data room organizado e materiais de captação prontos.',
      ferramentas: 'Portais de editais, modelos de plano de trabalho, certidões negativas e data room em nuvem.',
      metricas: 'Propostas submetidas, taxa de aprovação, recursos captados e prazo de prestação de contas.',
      entregavel: 'Calendário de editais e data room com documentos societários, financeiros e técnicos.'
    },
    {
      frente: 'Precificação e sustentabilidade da margem',
      baixo: 'Calcular o custo real de servir um cliente e verificar se o preço atual cobre os custos.',
      medio: 'Revisar a política de preços por segmento e definir régua de reajuste contratual.',
      alto: 'Otimizar unit economics acompanhando CAC, LTV e payback por canal de aquisição.',
      ferramentas: 'Planilha de custo por cliente, modelo de unit economics e análise de coorte.',
      metricas: 'Margem de contribuição, CAC, LTV, relação LTV/CAC e tempo de payback.',
      entregavel: 'Tabela de preços fundamentada e planilha de unit economics por canal.'
    }
  ]
};

// ============================================================================
// 3. TRÊS TRILHAS DE CAPACITAÇÃO, 12 TEMÁTICAS CADA, COBRINDO AS 8 DIMENSÕES
// ============================================================================
const LEARNING_TRACKS = [
  {
    id: 'fundacao',
    name: 'Trilha 1 — Fundação e Validação',
    audience: 'Indicada para startups em Ideação e início de Operação',
    goal: 'Confirmar a dor, estruturar o básico societário e financeiro e colocar de pé um MVP validado.',
    modules: [
      { title: 'Tese de valor e dor prioritária do cliente', dim: 'estrategia', priority: 'Alta' },
      { title: 'Entrevistas de descoberta e construção de MVP enxuto', dim: 'estrutura', priority: 'Alta' },
      { title: 'Acordo de sócios, vesting e cap table', dim: 'lideranca', priority: 'Alta' },
      { title: 'DRE gerencial e controle de queima de caixa', dim: 'recursos', priority: 'Alta' },
      { title: 'Arquitetura inicial de software e conformidade com a LGPD', dim: 'tecnologia', priority: 'Alta' },
      { title: 'Rotina ágil de entrega com Scrum e Kanban', dim: 'processos', priority: 'Média' },
      { title: 'UX/UI e simplicidade para o usuário final', dim: 'pessoas', priority: 'Média' },
      { title: 'Testes rápidos e registro sistemático de aprendizados', dim: 'cultura', priority: 'Média' },
      { title: 'PoC piloto com cliente âncora: escopo e critérios de aceite', dim: 'estrutura', priority: 'Média' },
      { title: 'Marco Legal das Startups e modelos de contratação', dim: 'estrategia', priority: 'Média' },
      { title: 'Preparação documental para editais de fomento', dim: 'recursos', priority: 'Baixa' },
      { title: 'Onboarding do time e rotinas iniciais de suporte', dim: 'pessoas', priority: 'Baixa' }
    ]
  },
  {
    id: 'tracao',
    name: 'Trilha 2 — Tração Comercial e Produto',
    audience: 'Indicada para startups em Operação e Tração',
    goal: 'Transformar validação em receita recorrente, com funil previsível e produto medido por uso.',
    modules: [
      { title: 'Funil de vendas B2B e B2G com métricas de conversão', dim: 'processos', priority: 'Alta' },
      { title: 'Precificação, proposta comercial e política de desconto', dim: 'estrategia', priority: 'Alta' },
      { title: 'Integrações via API e interoperabilidade com sistemas legados', dim: 'tecnologia', priority: 'Alta' },
      { title: 'Métricas de uso, ativação e retenção do produto', dim: 'estrutura', priority: 'Alta' },
      { title: 'CAC, LTV, churn e unit economics na prática', dim: 'recursos', priority: 'Média' },
      { title: 'Customer Success e SLA de atendimento', dim: 'pessoas', priority: 'Média' },
      { title: 'Onboarding de clientes contratantes', dim: 'processos', priority: 'Média' },
      { title: 'Testes A/B e ciclos curtos de melhoria contínua', dim: 'cultura', priority: 'Média' },
      { title: 'Gestão por indicadores semanais e cadência de decisão', dim: 'lideranca', priority: 'Média' },
      { title: 'Escalabilidade em nuvem, DevOps e custo de infraestrutura', dim: 'tecnologia', priority: 'Baixa' },
      { title: 'Casos de sucesso, prova social e marketing de conteúdo', dim: 'estrategia', priority: 'Baixa' },
      { title: 'Retenção de talentos técnicos e plano de capacitação', dim: 'pessoas', priority: 'Baixa' }
    ]
  },
  {
    id: 'escala',
    name: 'Trilha 3 — Governança, Capital e Escala',
    audience: 'Indicada para startups em Tração e Escala',
    goal: 'Preparar a empresa para capital, auditoria e expansão sem perder controle operacional.',
    modules: [
      { title: 'Estruturação de rodada anjo/VC, valuation e data room', dim: 'recursos', priority: 'Alta' },
      { title: 'Governança corporativa e conselho consultivo', dim: 'lideranca', priority: 'Alta' },
      { title: 'Auditoria de código, segurança e proteção de propriedade intelectual', dim: 'tecnologia', priority: 'Alta' },
      { title: 'Plano de expansão nacional e entrada em novas verticais', dim: 'estrategia', priority: 'Alta' },
      { title: 'Gestão financeira avançada, orçamento e forecast', dim: 'processos', priority: 'Média' },
      { title: 'Roadmap de produto e priorização orientada a valor', dim: 'estrutura', priority: 'Média' },
      { title: 'Plano de carreira e cultura em times em crescimento', dim: 'pessoas', priority: 'Média' },
      { title: 'Inovação aberta e parcerias com ICTs e universidades', dim: 'cultura', priority: 'Média' },
      { title: 'Compliance e preparação para due diligence', dim: 'recursos', priority: 'Baixa' },
      { title: 'Participação em eventos e articulação no ecossistema', dim: 'cultura', priority: 'Baixa' },
      { title: 'Indicadores ESG e relatórios para stakeholders', dim: 'processos', priority: 'Baixa' },
      { title: 'Observabilidade, SRE e confiabilidade em escala', dim: 'tecnologia', priority: 'Baixa' }
    ]
  }
];

const PRIORITY_ORDER = { 'Alta': 0, 'Média': 1, 'Baixa': 2 };
const STAGE_LIST = ['Ideação', 'Operação', 'Tração', 'Escala'];
const STAGE_COLORS = {
  'Ideação': '#D97706',
  'Operação': '#2563EB',
  'Tração': '#0D9488',
  'Escala': '#7C3AED'
};
const SEGMENT_PALETTE = ['#0D9488', '#2563EB', '#7C3AED', '#D97706', '#0891B2', '#DB2777', '#65A30D', '#475569'];

// ============================================================================
// 4. RÓTULOS DOS GRÁFICOS SEM SOBREPOSIÇÃO
// ============================================================================
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

const AngledTick = (props) => {
  const { x = 0, y = 0, payload, color = '#1E293B', angle = -35 } = props;
  const lines = wrapLabel(payload?.value, 16);
  return (
    <g transform={`translate(${x},${y + 10}) rotate(${angle})`}>
      <text textAnchor="end" fill={color} fontSize={10} fontWeight={700}>
        {lines.map((line, i) => (
          <tspan key={i} x={0} dy={i === 0 ? 0 : 11}>{line}</tspan>
        ))}
      </text>
    </g>
  );
};

// ============================================================================
// 5. DADOS INICIAIS
// ============================================================================
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
      estrategia: 'Atuamos fortemente em prefeituras do interior do Paraná.',
      tecnologia: 'Usamos visão computacional para detectar buracos e rachaduras pela câmera do celular.'
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

const EMPTY_FORM = {
  startupName: '',
  founder: '',
  email: '',
  whatsapp: '',
  segment: 'SaaS B2B',
  responses: {},
  notes: {}
};

// ============================================================================
// 6. CSS DE IMPRESSÃO A4 (quebra natural de páginas, sem cortar cards)
// ============================================================================
const PRINT_STYLES = `
  @media print {
    @page { size: A4 portrait; margin: 12mm; }
    html, body {
      background: #ffffff !important;
      color: #0f172a !important;
      height: auto !important;
      overflow: visible !important;
    }
    .no-print, aside { display: none !important; }
    .print-root, .print-scroll {
      height: auto !important;
      max-height: none !important;
      min-height: 0 !important;
      overflow: visible !important;
      display: block !important;
      padding: 0 !important;
    }
    .print-area {
      border: none !important;
      background: #ffffff !important;
      color: #0f172a !important;
      box-shadow: none !important;
      padding: 0 !important;
      height: auto !important;
      overflow: visible !important;
    }
    .print-card {
      background: #f8fafc !important;
      border: 1px solid #cbd5e1 !important;
      color: #0f172a !important;
      box-shadow: none !important;
    }
    .print-text, .print-card * { color: #0f172a !important; }
    .avoid-break, .print-card, table, tr, li {
      page-break-inside: avoid !important;
      break-inside: avoid !important;
    }
    .chart-box {
      height: 300px !important;
      max-height: 300px !important;
      page-break-inside: avoid !important;
      break-inside: avoid !important;
    }
    h1, h2, h3 { page-break-after: avoid !important; }
  }
`;

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================
export default function App() {
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
  const [showMatrix, setShowMatrix] = useState(false);

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [submitted, setSubmitted] = useState(false);
  const [lastSubmission, setLastSubmission] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedRowId, setCopiedRowId] = useState(null);

  const [activeAdminTab, setActiveAdminTab] = useState('dashboard');
  const [selectedStartup, setSelectedStartup] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStageFilter, setSelectedStageFilter] = useState('Todos');
  const [benchmarkingSelected, setBenchmarkingSelected] = useState(['1', '2']);
  const [expandedPlan, setExpandedPlan] = useState({});
  const [activeTrack, setActiveTrack] = useState('fundacao');

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
      setSubmissions(prev => (Array.isArray(prev) ? prev.filter(s => s?.id !== id) : []));
      if (selectedStartup && selectedStartup.id === id) setSelectedStartup(null);
      if (dashboardSelection === id) setDashboardSelection('todas');
      setBenchmarkingSelected(prev => prev.filter(item => item !== id));
    }
  };

  const handleFormSubmit = (e) => {
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
      startupName: formData.startupName,
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

  const copyToClipboard = (text) => {
    try {
      navigator.clipboard.writeText(text);
    } catch (e) {
      window.prompt('Copie o link do resultado:', text);
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

  const getPriorityBadge = (priority) => {
    if (priority === 'Alta') return 'bg-rose-50 text-rose-800 border-rose-300';
    if (priority === 'Média') return 'bg-amber-50 text-amber-800 border-amber-300';
    return 'bg-slate-100 text-slate-700 border-slate-300';
  };

  const getActionPlanForDimension = (dimName, score) => {
    const percentage = ((score || 0) / 25) * 100;
    let levelKey = 'baixo';
    let level = 'A desenvolver';
    let meta = 'Meta: alcançar o nível médio (13 a 19 pts)';
    let color = 'text-amber-700';

    if (percentage >= 80) {
      levelKey = 'alto';
      level = 'Avançado';
      meta = 'Meta: sustentar a referência e replicar boas práticas';
      color = 'text-emerald-700';
    } else if (percentage >= 50) {
      levelKey = 'medio';
      level = 'Médio';
      meta = 'Meta: alcançar o nível avançado (20 a 25 pts)';
      color = 'text-blue-700';
    }

    const dimId = DIM_ID_BY_NAME?.[dimName];
    const frentes = ACTION_PLAYBOOK?.[dimId] || [];

    const actions = frentes.map(f => ({
      frente: f?.frente || '',
      action: f?.[levelKey] || '',
      ferramentas: f?.ferramentas || '',
      metricas: f?.metricas || '',
      entregavel: f?.entregavel || ''
    }));

    return { level, levelKey, meta, color, percentage, actions };
  };

  // CÁLCULOS DEFENSIVOS
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

  const selectedDashboardStartup = dashboardSelection === 'todas'
    ? null
    : safeSubmissions.find(s => s?.id === dashboardSelection) || null;

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
      activeDimValues[dim.name] = selectedDashboardStartup?.dimensions?.[dim.name] || 0;
    }
  });

  const sortedActiveDim = Object.entries(activeDimValues).sort((a, b) => Number(b[1]) - Number(a[1]));
  const bestDimension = sortedActiveDim[0] || ['N/A', 0];
  const worstDimension = sortedActiveDim[sortedActiveDim.length - 1] || ['N/A', 0];

  const chartData = Object.entries(activeDimValues).map(([key, val]) => ({
    subject: getShortLabel(key),
    A: Number(val) || 0
  }));

  const stageDistribution = STAGE_LIST.map(stage => ({
    name: stage,
    Startups: safeSubmissions.filter(s => s?.stage === stage).length
  }));

  const segmentDistribution = Object.entries(
    safeSubmissions.reduce((acc, s) => {
      const key = s?.segment || 'Não informado';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {})
  )
    .map(([name, value]) => ({ name, Startups: value }))
    .sort((a, b) => b.Startups - a.Startups);

  const currentTrack = LEARNING_TRACKS.find(t => t.id === activeTrack) || LEARNING_TRACKS[0];
  const orderedModules = [...(currentTrack?.modules || [])].sort(
    (a, b) => (PRIORITY_ORDER[a.priority] ?? 9) - (PRIORITY_ORDER[b.priority] ?? 9)
  );

  // --------------------------------------------------------------------------
  // MODAL: MATRIZ DE PERGUNTAS & DIMENSÕES
  // --------------------------------------------------------------------------
  const renderMatrixModal = () => {
    if (!showMatrix) return null;
    return (
      <div className="fixed inset-0 z-50 bg-slate-950/80 flex items-start justify-center p-4 overflow-y-auto no-print">
        <div className="bg-white w-full max-w-4xl rounded-2xl border border-slate-200 shadow-2xl my-8">
          <div className="sticky top-0 bg-white border-b border-slate-200 rounded-t-2xl px-6 py-4 flex justify-between items-start gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Matriz de Perguntas & Dimensões</h2>
              <p className="text-xs text-slate-600">
                8 dimensões · 40 indicadores · escala de 1 (discordo totalmente) a 5 (concordo totalmente)
              </p>
            </div>
            <button
              onClick={() => setShowMatrix(false)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition shrink-0"
              title="Fechar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-6 space-y-5">
            {GOVTECH_DIMENSIONS.map((dim, idx) => (
              <div key={dim.id} className="border border-slate-200 rounded-2xl overflow-hidden">
                <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{idx + 1}. {dim.name}</h3>
                      <p className="text-xs text-slate-600 mt-0.5">{dim.description}</p>
                    </div>
                    <span className="text-[10px] font-bold text-teal-800 bg-teal-50 border border-teal-300 px-2 py-1 rounded-full whitespace-nowrap">
                      até 25 pts
                    </span>
                  </div>
                </div>
                <ol className="divide-y divide-slate-100">
                  {dim.questions.map((q, qIdx) => (
                    <li key={q.id} className="px-4 py-2.5 text-xs text-slate-700 flex gap-3">
                      <span className="font-bold text-teal-700 shrink-0">{idx + 1}.{qIdx + 1}</span>
                      <span className="leading-relaxed">{q.text}</span>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-200 px-6 py-4 flex justify-end">
            <button
              onClick={() => setShowMatrix(false)}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition"
            >
              Fechar matriz
            </button>
          </div>
        </div>
      </div>
    );
  };

  // --------------------------------------------------------------------------
  // TELA 1: LANDING
  // --------------------------------------------------------------------------
  if (!role) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between p-6 font-sans">
        {renderMatrixModal()}

        <header className="max-w-6xl mx-auto w-full flex flex-wrap gap-4 justify-between items-center py-4 border-b border-slate-800">
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

        <main className="max-w-5xl mx-auto w-full my-auto py-12 text-center space-y-10">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-teal-500/10 border border-teal-500/25 rounded-full text-teal-300 font-bold text-xs uppercase tracking-wider">
              <Zap className="h-3.5 w-3.5" /> Hub GovTech PR
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight uppercase">
              Diagnóstico de Maturidade - Avaliação em 8 Dimensões Estratégicas
            </h1>
            <p className="text-slate-200 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
              Mapeamento de governança, tecnologia, tração e planejamento de conhecimento para aceleradoras e programas de inovação.
            </p>
          </div>

          {/* BLOCO INSTITUCIONAL EXPLICATIVO */}
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 md:p-7 text-left max-w-4xl mx-auto shadow-2xl space-y-5">
            <div className="flex items-center gap-2 text-teal-300">
              <Info className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-widest">Sobre o diagnóstico</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-white">O que é</h3>
                <p className="text-xs text-slate-200 leading-relaxed">
                  Ferramenta de mapeamento contínuo para ecossistemas de inovação. Cada rodada registra a fotografia atual
                  da startup e permite acompanhar a evolução ao longo do programa.
                </p>
              </div>
              <div className="space-y-2 md:border-l md:border-slate-700 md:pl-5">
                <h3 className="text-sm font-bold text-white">Metodologia</h3>
                <p className="text-xs text-slate-200 leading-relaxed">
                  Avaliação quantitativa em escala de 1 a 5, distribuída em 8 dimensões estratégicas e 40 indicadores.
                  Cada dimensão vale até 25 pontos, somando 200 pontos.
                </p>
              </div>
              <div className="space-y-2 md:border-l md:border-slate-700 md:pl-5">
                <h3 className="text-sm font-bold text-white">Objetivo</h3>
                <p className="text-xs text-slate-200 leading-relaxed">
                  Gerar matrizes de maturidade, identificar gargalos operacionais e direcionar planos de ação
                  personalizados por dimensão, com trilhas de capacitação correspondentes.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-700">
              <span className="text-[11px] text-slate-300">
                Estágios calculados: Ideação (0–70) · Operação (71–120) · Tração (121–170) · Escala (171–200)
              </span>
              <button
                onClick={() => setShowMatrix(true)}
                className="ml-auto text-xs font-bold text-teal-300 hover:text-teal-200 flex items-center gap-2 border border-teal-500/30 bg-teal-500/10 px-3.5 py-2 rounded-xl transition"
              >
                <ListChecks className="h-3.5 w-3.5" /> Ver matriz de perguntas
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto text-left">
            <button
              onClick={() => setRole('startup')}
              className="bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-teal-500/60 rounded-2xl p-6 transition-all duration-300 group flex flex-col justify-between shadow-2xl"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 bg-teal-500/15 text-teal-300 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform border border-teal-500/25">
                  <Rocket className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white group-hover:text-teal-300 transition-colors">Área da startup</h2>
                  <p className="text-xs text-slate-300 leading-relaxed mt-1">
                    Responda os 40 indicadores e receba o radar de maturidade, o score por dimensão e o link do relatório.
                  </p>
                </div>
              </div>
              <div className="mt-8 flex items-center text-xs font-bold text-teal-300 gap-2 group-hover:translate-x-1 transition-transform">
                Iniciar diagnóstico <ArrowRight className="h-4 w-4" />
              </div>
            </button>

            <button
              onClick={() => setRole('admin')}
              className="bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-purple-500/60 rounded-2xl p-6 transition-all duration-300 group flex flex-col justify-between shadow-2xl"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 bg-purple-500/15 text-purple-300 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform border border-purple-500/25">
                  <ShieldAlert className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">Painel do administrador</h2>
                  <p className="text-xs text-slate-300 leading-relaxed mt-1">
                    Análise individual e coletiva, distribuição por estágio e setor, planos de ação e trilhas de capacitação.
                  </p>
                </div>
              </div>
              <div className="mt-8 flex items-center text-xs font-bold text-purple-300 gap-2 group-hover:translate-x-1 transition-transform">
                Acessar área restrita <Lock className="h-3.5 w-3.5" />
              </div>
            </button>
          </div>
        </main>

        <footer className="max-w-6xl mx-auto w-full text-center py-4 border-t border-slate-800 text-xs text-slate-400">
          Hub de Inovação & Incubação · 2026
        </footer>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // TELA 2: ÁREA DA STARTUP
  // --------------------------------------------------------------------------
  if (role === 'startup') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans print-root">
        <style>{PRINT_STYLES}</style>
        {renderMatrixModal()}

        <header className="bg-slate-900 border-b border-slate-800 py-4 px-6 md:px-8 flex flex-wrap gap-3 justify-between items-center sticky top-0 z-30 no-print">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-500 text-slate-950 font-black flex items-center justify-center text-sm">H</div>
            <span className="font-bold text-sm tracking-wide text-white">Hub Diagnóstico — Startup</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowMatrix(true)}
              className="text-xs font-medium text-slate-200 hover:text-white flex items-center gap-2 bg-slate-800 px-3.5 py-2 rounded-xl border border-slate-700 transition"
            >
              <ListChecks className="h-3.5 w-3.5" /> Matriz de perguntas
            </button>
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
          </div>
        </header>

        <main className="max-w-4xl mx-auto w-full flex-1 py-10 px-4 print-scroll">
          {submitted ? (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-8 print-area">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-6 avoid-break">
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
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 h-[420px] print-card chart-box">
                  <h3 className="text-xs font-bold text-slate-200 uppercase mb-2 text-center print-text">
                    Radar de maturidade (8 dimensões)
                  </h3>
                  <ResponsiveContainer width="100%" height="90%">
                    <RadarChart
                      outerRadius="60%"
                      margin={{ top: 22, right: 46, bottom: 22, left: 46 }}
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
                  <h3 className="text-xs font-bold text-slate-200 uppercase mb-2 print-text">Pontuação por dimensão</h3>
                  <div className="grid grid-cols-1 gap-2 text-xs">
                    {Object.entries(lastSubmission?.dimensions || {}).map(([dim, val]) => (
                      <div key={dim} className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex justify-between items-center gap-3 print-card avoid-break">
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
                  <h3 className="text-xs font-bold text-slate-200 uppercase print-text">Observações da startup</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    {Object.entries(lastSubmission.notes).map(([dimId, text]) => {
                      if (!text) return null;
                      return (
                        <div key={dimId} className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1 print-card avoid-break">
                          <span className="font-bold text-teal-300 block text-[11px] print-text">
                            {DIM_BY_ID?.[dimId]?.name || dimId}
                          </span>
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
                      copyToClipboard(generateShareableLink(lastSubmission));
                      setCopiedLink(true);
                      setTimeout(() => setCopiedLink(false), 3000);
                    }}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold rounded-xl text-xs flex items-center gap-2 border border-slate-700"
                  >
                    {copiedLink ? <Check className="h-3.5 w-3.5" /> : <LinkIcon className="h-3.5 w-3.5" />}
                    {copiedLink ? 'Link copiado' : 'Copiar link do resultado'}
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
                    setFormData(EMPTY_FORM);
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
                    <p className="text-xs text-slate-300 mt-1">Dados de contato do fundador para registro no programa.</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Nome da startup *</label>
                      <input
                        type="text" required
                        value={formData.startupName}
                        onChange={e => setFormData({ ...formData, startupName: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm outline-none focus:border-teal-400 text-white"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Nome do fundador *</label>
                        <input
                          type="text" required
                          value={formData.founder}
                          onChange={e => setFormData({ ...formData, founder: e.target.value })}
                          className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm outline-none focus:border-teal-400 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">WhatsApp do fundador *</label>
                        <input
                          type="text" required
                          value={formData.whatsapp}
                          onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                          className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm outline-none focus:border-teal-400 text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">E-mail de contato *</label>
                      <input
                        type="email" required
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm outline-none focus:border-teal-400 text-white"
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
                    Iniciar indicador 1 de 40 <ArrowRight className="h-4 w-4" />
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

                          {/* OBSERVAÇÕES: SEMPRE EM BRANCO, SEM PLACEHOLDER */}
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
                              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-100 outline-none focus:border-teal-400"
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
                                  alert('Responda os 5 indicadores desta dimensão antes de avançar.');
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
                                  alert('Responda os 5 indicadores desta dimensão antes de concluir.');
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

  // --------------------------------------------------------------------------
  // TELA 3: LOGIN DO ADMINISTRADOR
  // --------------------------------------------------------------------------
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
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm outline-none focus:border-purple-400 text-white"
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

  // --------------------------------------------------------------------------
  // TELA 4: PAINEL DO ADMINISTRADOR
  // --------------------------------------------------------------------------
  return (
    <div className="flex h-screen bg-slate-100 font-sans text-slate-800 overflow-hidden print-root">
      <style>{PRINT_STYLES}</style>
      {renderMatrixModal()}

      <aside className="w-64 bg-slate-900 text-white flex flex-col justify-between p-5 border-r border-slate-800 shrink-0 no-print">
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
              { key: 'trilhas', label: 'Trilhas de conhecimento', icon: GraduationCap },
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

            <button
              onClick={() => setShowMatrix(true)}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition text-left text-slate-200 hover:bg-slate-800 hover:text-white"
            >
              <ListChecks className="h-4 w-4 shrink-0" /> Matriz de perguntas
            </button>
          </nav>
        </div>

        <button
          onClick={() => { setRole(null); setAdminAuth(false); setPasswordInput(''); }}
          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-200 hover:text-white rounded-xl hover:bg-slate-800 transition"
        >
          <LogOut className="h-4 w-4" /> Sair do painel
        </button>
      </aside>

      <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 print-scroll">

        {/* ======================= ABA 1: VISÃO GERAL ======================= */}
        {activeAdminTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div>
                <h1 className="text-xl font-bold text-slate-900">Dashboard de maturidade das startups</h1>
                <p className="text-xs text-slate-600">Métricas consolidadas, análise individual e distribuição do portfólio.</p>
              </div>

              <div className="flex flex-wrap items-center gap-3 no-print">
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

            {/* CARDS DE MÉTRICAS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm avoid-break">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Pontuação média</span>
                <p className="text-3xl font-black text-slate-900 mt-1">
                  {avgOverallScore.toFixed(1)} <span className="text-xs text-slate-500 font-normal">/200 pts</span>
                </p>
                <span className="text-[11px] text-slate-500">
                  Média por dimensão: {(avgOverallScore / 8).toFixed(1)} / 25
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm avoid-break">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Destaque principal</span>
                <p className="text-base font-bold text-teal-700 mt-1 leading-snug break-words">{bestDimension[0]}</p>
                <span className="text-[11px] text-slate-500">{bestDimension[1]} / 25 pts</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm avoid-break">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Maior oportunidade</span>
                <p className="text-base font-bold text-amber-700 mt-1 leading-snug break-words">{worstDimension[0]}</p>
                <span className="text-[11px] text-slate-500">{worstDimension[1]} / 25 pts</span>
              </div>

              {/* BADGE DE ESTÁGIO QUANDO INDIVIDUAL, TOTAL QUANDO MÉDIA GERAL */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm avoid-break">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  {selectedDashboardStartup ? 'Estágio de maturidade' : 'Startups analisadas'}
                </span>
                {selectedDashboardStartup ? (
                  <div className="mt-2 space-y-1.5">
                    <span className={`px-3 py-1 rounded-full text-sm font-black border inline-block ${getStageBadge(selectedDashboardStartup.stage)}`}>
                      {selectedDashboardStartup.stage}
                    </span>
                    <p className="text-[11px] text-slate-600 leading-snug">
                      {selectedDashboardStartup.startupName} · {selectedDashboardStartup.score} / 200 pts
                    </p>
                  </div>
                ) : (
                  <>
                    <p className="text-3xl font-black text-purple-700 mt-1">{safeSubmissions.length}</p>
                    <span className="text-[11px] text-slate-500">Total cadastrado no programa</span>
                  </>
                )}
              </div>
            </div>

            {/* RADAR + BARRAS POR DIMENSÃO */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm h-[460px] chart-box avoid-break">
                <h3 className="text-xs font-bold text-slate-600 uppercase mb-3">
                  Radar de maturidade ({dashboardSelection === 'todas' ? 'média geral' : 'individual'})
                </h3>
                <ResponsiveContainer width="100%" height="90%">
                  <RadarChart data={chartData} outerRadius="58%" margin={{ top: 24, right: 56, bottom: 24, left: 56 }}>
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

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm h-[460px] chart-box avoid-break">
                <h3 className="text-xs font-bold text-slate-600 uppercase mb-3">Pontuação por dimensão (0 a 25 pts)</h3>
                <ResponsiveContainer width="100%" height="88%">
                  <BarChart data={chartData} margin={{ top: 10, right: 12, bottom: 78, left: -12 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis
                      dataKey="subject"
                      interval={0}
                      tickLine={false}
                      height={90}
                      tick={<AngledTick color="#1E293B" angle={-35} />}
                    />
                    <YAxis domain={[0, 25]} tick={{ fill: '#334155', fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#CBD5E1', borderRadius: '10px' }}
                      formatter={(value) => [`${value} / 25 pts`, 'Pontuação']}
                    />
                    <Bar dataKey="A" name="Pontuação" fill="#0D9488" radius={[6, 6, 0, 0]} maxBarSize={44} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* DISTRIBUIÇÃO POR ESTÁGIO + POR SETOR */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm h-[400px] chart-box avoid-break">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-xs font-bold text-slate-600 uppercase">Distribuição por estágio de maturidade</h3>
                  <span className="text-[10px] font-bold text-slate-500">{safeSubmissions.length} startups</span>
                </div>
                <ResponsiveContainer width="100%" height="86%">
                  <BarChart data={stageDistribution} margin={{ top: 10, right: 12, bottom: 20, left: -12 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="name" interval={0} tickLine={false} tick={{ fill: '#1E293B', fontSize: 11, fontWeight: 700 }} />
                    <YAxis allowDecimals={false} tick={{ fill: '#334155', fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#CBD5E1', borderRadius: '10px' }}
                      formatter={(value) => [`${value} startup(s)`, 'Quantidade']}
                    />
                    <Bar dataKey="Startups" radius={[6, 6, 0, 0]} maxBarSize={60}>
                      {stageDistribution.map(entry => (
                        <Cell key={entry.name} fill={STAGE_COLORS[entry.name] || '#64748B'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm h-[400px] chart-box avoid-break">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-xs font-bold text-slate-600 uppercase">Distribuição por setor de atuação</h3>
                  <span className="text-[10px] font-bold text-slate-500">{segmentDistribution.length} setores</span>
                </div>
                {segmentDistribution.length === 0 ? (
                  <p className="text-xs text-slate-500 py-10 text-center">Nenhuma startup cadastrada ainda.</p>
                ) : (
                  <ResponsiveContainer width="100%" height="86%">
                    <BarChart data={segmentDistribution} margin={{ top: 10, right: 12, bottom: 70, left: -12 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                      <XAxis
                        dataKey="name"
                        interval={0}
                        tickLine={false}
                        height={82}
                        tick={<AngledTick color="#1E293B" angle={-35} />}
                      />
                      <YAxis allowDecimals={false} tick={{ fill: '#334155', fontSize: 11 }} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#CBD5E1', borderRadius: '10px' }}
                        formatter={(value) => [`${value} startup(s)`, 'Quantidade']}
                      />
                      <Bar dataKey="Startups" radius={[6, 6, 0, 0]} maxBarSize={52}>
                        {segmentDistribution.map((entry, idx) => (
                          <Cell key={entry.name} fill={SEGMENT_PALETTE[idx % SEGMENT_PALETTE.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* TABELA DE STARTUPS */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row gap-3 justify-between items-start md:items-center bg-slate-50">
                <h3 className="font-bold text-slate-900 text-sm">Startups cadastradas</h3>
                <div className="flex flex-wrap gap-3 no-print">
                  <select
                    value={selectedStageFilter}
                    onChange={e => setSelectedStageFilter(e.target.value)}
                    className="px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 outline-none"
                  >
                    <option value="Todos">Todos os estágios</option>
                    {STAGE_LIST.map(st => <option key={st} value={st}>{st}</option>)}
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
                      <tr key={s.id} className="hover:bg-slate-50 transition align-top avoid-break">
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
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setSelectedStartup(s);
                                setExpandedPlan({});
                                setActiveAdminTab('plano_startup');
                              }}
                              className="text-xs font-bold text-teal-700 hover:underline flex items-center gap-1"
                            >
                              Ver plano <ChevronRight className="h-3.5 w-3.5" />
                            </button>

                            <button
                              onClick={() => {
                                copyToClipboard(generateShareableLink(s));
                                setCopiedRowId(s.id);
                                setTimeout(() => setCopiedRowId(null), 2500);
                              }}
                              className={`p-1.5 rounded-lg transition border ${
                                copiedRowId === s.id
                                  ? 'text-teal-700 bg-teal-50 border-teal-300'
                                  : 'text-slate-500 border-transparent hover:text-teal-700 hover:bg-teal-50'
                              }`}
                              title="Copiar link do resultado desta startup"
                            >
                              {copiedRowId === s.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            </button>

                            <button
                              onClick={() => handleDeleteStartup(s.id)}
                              className="p-1.5 text-slate-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition"
                              title="Excluir startup"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          {copiedRowId === s.id && (
                            <span className="text-[10px] text-teal-700 font-bold block mt-1">Link copiado</span>
                          )}
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
                <p className="text-xs text-slate-600">
                  Ações por dimensão, com ferramentas sugeridas, métricas a acompanhar e entregáveis esperados.
                </p>
              </div>
              <div className="w-full md:w-72 no-print">
                <select
                  value={selectedStartup ? selectedStartup.id : ''}
                  onChange={e => {
                    const found = safeSubmissions.find(s => s?.id === e.target.value);
                    setSelectedStartup(found || null);
                    setExpandedPlan({});
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
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between gap-4 md:items-center avoid-break">
                  <div>
                    <span className="text-[10px] font-bold text-teal-700 uppercase">Plano personalizado</span>
                    <h2 className="text-lg font-bold text-slate-900">{selectedStartup.startupName}</h2>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Fundador: {selectedStartup.founder} · {selectedStartup.segment} · {selectedStartup.score} / 200 pts
                    </p>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs">
                      <span className="inline-flex items-center gap-1.5 text-teal-700 font-medium">
                        <Phone className="h-3 w-3" /> {selectedStartup.whatsapp || '—'}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-slate-600 font-medium">
                        <Mail className="h-3 w-3" /> {selectedStartup.email || '—'}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 no-print">
                    <button
                      onClick={() => {
                        const dims = Object.keys(selectedStartup.dimensions || {});
                        const anyClosed = dims.some(k => !expandedPlan[k]);
                        if (anyClosed) {
                          const all = {};
                          dims.forEach(k => { all[k] = true; });
                          setExpandedPlan(all);
                        } else {
                          setExpandedPlan({});
                        }
                      }}
                      className="px-4 py-2 bg-white border border-slate-300 text-slate-800 font-bold rounded-xl text-xs flex items-center gap-1.5"
                    >
                      <ListChecks className="h-4 w-4" /> Expandir / recolher tudo
                    </button>
                    <button
                      onClick={() => window.print()}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm"
                    >
                      <Printer className="h-4 w-4" /> Exportar relatório em PDF
                    </button>
                  </div>
                </div>

                {selectedStartup.notes && Object.values(selectedStartup.notes).some(Boolean) && (
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 avoid-break">
                    <h3 className="text-xs font-bold text-slate-600 uppercase">Observações enviadas pela startup</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {Object.entries(selectedStartup.notes).map(([dimId, text]) => {
                        if (!text) return null;
                        return (
                          <div key={dimId} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                            <span className="font-bold text-teal-700 block text-[11px]">
                              {DIM_BY_ID?.[dimId]?.name || dimId}
                            </span>
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
                    const isOpen = !!expandedPlan[dimName];
                    return (
                      <div key={dimName} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 avoid-break print-card">
                        <div className="flex justify-between items-start gap-3 border-b border-slate-100 pb-3">
                          <div>
                            <h3 className="font-bold text-slate-900 text-sm leading-snug">{dimName}</h3>
                            <span className={`text-xs font-bold ${plan.color}`}>
                              {score} / 25 pts · {Math.round(plan.percentage)}% · nível {plan.level}
                            </span>
                          </div>
                          <span className="text-[10px] bg-slate-100 px-2.5 py-1 rounded-xl text-slate-700 border border-slate-200 font-semibold text-right max-w-[160px] leading-snug">
                            {plan.meta}
                          </span>
                        </div>

                        <ul className="space-y-3">
                          {plan.actions.map((item, i) => (
                            <li key={i} className="text-xs text-slate-800 space-y-2">
                              <div className="flex items-start gap-2">
                                <CheckCircle2 className="h-3.5 w-3.5 text-teal-700 flex-shrink-0 mt-0.5" />
                                <div>
                                  <span className="font-bold text-slate-900 block">{item.frente}</span>
                                  <span className="text-slate-700 leading-relaxed">{item.action}</span>
                                </div>
                              </div>

                              {isOpen && (
                                <div className="ml-5 grid grid-cols-1 gap-2 pb-1">
                                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5">
                                    <span className="text-[10px] font-bold text-slate-600 uppercase flex items-center gap-1.5">
                                      <Wrench className="h-3 w-3" /> Ferramentas sugeridas
                                    </span>
                                    <p className="text-[11px] text-slate-700 leading-relaxed mt-1">{item.ferramentas}</p>
                                  </div>
                                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5">
                                    <span className="text-[10px] font-bold text-slate-600 uppercase flex items-center gap-1.5">
                                      <Gauge className="h-3 w-3" /> Métricas a acompanhar
                                    </span>
                                    <p className="text-[11px] text-slate-700 leading-relaxed mt-1">{item.metricas}</p>
                                  </div>
                                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5">
                                    <span className="text-[10px] font-bold text-slate-600 uppercase flex items-center gap-1.5">
                                      <Package className="h-3 w-3" /> Entregável esperado
                                    </span>
                                    <p className="text-[11px] text-slate-700 leading-relaxed mt-1">{item.entregavel}</p>
                                  </div>
                                </div>
                              )}
                            </li>
                          ))}
                        </ul>

                        <button
                          onClick={() => setExpandedPlan(prev => ({ ...prev, [dimName]: !prev[dimName] }))}
                          className="w-full mt-1 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-800 flex items-center justify-center gap-1.5 transition no-print"
                        >
                          {isOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                          {isOpen ? 'Ocultar subtópicos práticos' : 'Ver subtópicos práticos'}
                        </button>
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

        {/* ==================== ABA 3: TRILHAS DE CONHECIMENTO ==================== */}
        {activeAdminTab === 'trilhas' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-3">
                <div>
                  <h1 className="text-xl font-bold text-slate-900">Trilhas de conhecimento</h1>
                  <p className="text-xs text-slate-600">
                    Três pacotes de capacitação com 12 temáticas cada, ordenados por prioridade e cobrindo as 8 dimensões do diagnóstico.
                  </p>
                </div>
                <span className="px-3.5 py-1.5 bg-teal-50 text-teal-800 border border-teal-300 rounded-xl text-xs font-bold self-start">
                  3 trilhas · 36 módulos
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 no-print">
              {LEARNING_TRACKS.map(track => {
                const isActive = track.id === activeTrack;
                return (
                  <button
                    key={track.id}
                    onClick={() => setActiveTrack(track.id)}
                    className={`text-left p-4 rounded-2xl border transition shadow-sm ${
                      isActive
                        ? 'bg-teal-50 border-teal-600 ring-1 ring-teal-600'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <GraduationCap className={`h-4 w-4 shrink-0 ${isActive ? 'text-teal-700' : 'text-slate-500'}`} />
                      <h3 className={`font-bold text-sm ${isActive ? 'text-teal-800' : 'text-slate-900'}`}>{track.name}</h3>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-1.5 leading-relaxed">{track.audience}</p>
                    <span className="text-[10px] font-bold text-slate-500 uppercase block mt-2">12 temáticas</span>
                  </button>
                );
              })}
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 avoid-break">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="font-bold text-slate-900 text-base">{currentTrack?.name}</h2>
                <p className="text-xs text-slate-600 mt-1">{currentTrack?.goal}</p>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {GOVTECH_DIMENSIONS.map(d => {
                    const count = (currentTrack?.modules || []).filter(m => m.dim === d.id).length;
                    return (
                      <span
                        key={d.id}
                        className={`text-[10px] font-bold px-2 py-1 rounded-full border ${
                          count > 0
                            ? 'bg-teal-50 text-teal-800 border-teal-300'
                            : 'bg-slate-100 text-slate-500 border-slate-200'
                        }`}
                        title={d.name}
                      >
                        {d.short} · {count}
                      </span>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-4">
                {['Alta', 'Média', 'Baixa'].map(priority => {
                  const group = orderedModules.filter(m => m.priority === priority);
                  if (group.length === 0) return null;
                  return (
                    <div key={priority} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${getPriorityBadge(priority)}`}>
                          Prioridade {priority}
                        </span>
                        <span className="text-[11px] text-slate-500 font-semibold">{group.length} módulos</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {group.map((mod) => (
                          <div key={mod.title} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3 avoid-break">
                            <span className="w-6 h-6 rounded-full bg-teal-700 text-white font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                              {orderedModules.indexOf(mod) + 1}
                            </span>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-xs font-bold text-slate-900 leading-snug">{mod.title}</h4>
                              <span className="text-[11px] text-slate-600 font-medium block mt-0.5">
                                {DIM_BY_ID?.[mod.dim]?.name || mod.dim}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
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

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 no-print">
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
                      <div key={s.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2 avoid-break">
                        <h3 className="font-bold text-slate-900 text-base">{s.startupName}</h3>
                        <p className="text-2xl font-black text-teal-700">
                          {s.score} <span className="text-xs font-normal text-slate-500">/200</span>
                        </p>
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold border inline-block ${getStageBadge(s.stage)}`}>
                          {s.stage}
                        </span>
                        <p className="text-[11px] text-slate-600 flex items-center gap-1.5 pt-1">
                          <Building2 className="h-3 w-3" /> {s.segment}
                        </p>
                        <p className="text-[11px] text-slate-600 flex items-center gap-1.5">
                          <Mail className="h-3 w-3" /> {s.email || '—'}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm h-[500px] chart-box avoid-break">
                  <h3 className="text-xs font-bold text-slate-600 uppercase mb-4">Comparativo pelas 8 dimensões</h3>
                  <ResponsiveContainer width="100%" height="88%">
                    <BarChart
                      margin={{ top: 10, right: 12, bottom: 78, left: -12 }}
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
                      <XAxis
                        dataKey="name"
                        interval={0}
                        tickLine={false}
                        height={90}
                        tick={<AngledTick color="#1E293B" angle={-35} />}
                      />
                      <YAxis domain={[0, 25]} tick={{ fill: '#334155', fontSize: 11 }} />
                      <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#CBD5E1', borderRadius: '10px' }} />
                      <Legend wrapperStyle={{ fontSize: 12, fontWeight: 700, color: '#1E293B', paddingTop: 10 }} />
                      {benchmarkingSelected.map((id, idx) => {
                        const s = safeSubmissions.find(item => item?.id === id);
                        if (!s) return null;
                        const colors = ['#0D9488', '#2563EB', '#7C3AED'];
                        return (
                          <Bar
                            key={s.id}
                            dataKey={s.startupName}
                            fill={colors[idx] || '#64748B'}
                            radius={[5, 5, 0, 0]}
                            maxBarSize={26}
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
