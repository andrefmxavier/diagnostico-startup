# Axia · Mentoria 2

Aplicação web (React + Vite + Tailwind) que reúne os módulos da Mentoria 2 da Axia:

- **Skills consultivas** — catálogo de skills e frameworks consultivos.
- **Dashboard executivo** — indicadores-chave para a tomada de decisão.

## Como rodar

```bash
npm install
cp .env.example .env.local   # opcional: preencha as credenciais do Supabase
npm run dev
```

Build de produção: `npm run build` (publicado pelo Netlify a partir de `dist/`).

## Estrutura

```
src/
  main.jsx                     # ponto de entrada
  App.jsx                      # casca da aplicação e navegação entre módulos
  config/
    app.js                     # nome, subtítulo e rodapé
    modules.js                 # registro dos módulos exibidos no menu
  lib/
    supabaseClient.js          # cliente Supabase (via variáveis de ambiente)
  components/
    layout/                    # AppShell (menu lateral) e LogoHeader
    ui/                        # Card, PageHeader, StatCard, EmptyState
  modules/
    home/                      # página inicial
    skills-consultivas/        # SkillsPage + skills.js (dados)
    dashboard-executivo/       # DashboardPage + kpis.js (dados)
```

## Adicionando um módulo

1. Crie `src/modules/<nome>/` com o componente da página.
2. Registre-o em `src/config/modules.js` (id, rótulo, ícone do `lucide-react` e componente).

## Variáveis de ambiente

| Variável | Uso |
| --- | --- |
| `VITE_SUPABASE_URL` | URL do projeto Supabase |
| `VITE_SUPABASE_ANON_KEY` | Chave pública (anon/publishable) do Supabase |

Sem essas variáveis a aplicação funciona normalmente, apenas sem persistência (`supabase` fica `null`).
