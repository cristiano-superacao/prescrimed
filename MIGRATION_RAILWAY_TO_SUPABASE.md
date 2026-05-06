Migração Railway → Supabase (passo-a-passo)

Resumo rápido
- Objetivo: migrar o banco PostgreSQL do Railway para o Supabase e deixar o frontend funcionando usando Supabase (Auth + DB) mantendo o layout responsivo e profissional.
- O repositório já suporta Supabase: há variáveis `VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY` no frontend e `SUPABASE_DB_URL`/`SUPABASE_POOLER_URL` no backend.
- Já atualizei os workflows do GitHub Actions para injetar as variáveis `VITE_SUPABASE_*` durante o build do cliente.

Requisitos pré-migração
- Acesso ao projeto no Railway (URL de conexão Postgres ou variável `DATABASE_URL`).
- Conta no Supabase com projeto criado (obter `anon key` e a URL do projeto).
- Node 18+ e npm no seu ambiente local (scripts de export/import usam Node).

Passos sugeridos (local / terminal)
1) Exportar dados do Railway (origem)
- Configure a variável de ambiente `SOURCE_DATABASE_URL` apontando para a URL do Railway (ou use `DATABASE_URL`/`DATABASE_URL_OVERRIDE`).
- Execute (na raíz do repo):

```bash
npm ci
node scripts/export-postgres-to-json.js
```

- O diretório `data/export` receberá arquivos JSON por tabela e um `_summary.json`.

2) Preparar Supabase (destino)
- No Supabase UI: crie o projeto e, se necessário, crie as tabelas com os mesmos nomes/colunas (idealmente execute o esquema SQL existente). Se preferir, exporte esquema do Railway e aplique no Supabase.
- Copie a URL do banco (ex.: `postgresql://postgres:...@db.<project>.supabase.co:5432/postgres`) e defina `DATABASE_URL` apontando para ela localmente (ou `DATABASE_URL_OVERRIDE`).

3) Importar dados para Supabase
- Defina `DATABASE_URL` para apontar ao Supabase DB.
- (Opcional) `CLEAR_DESTINATION=true` para truncar as tabelas antes de importar.
- Execute:

```bash
node scripts/import-json-to-railway.js
```

- Verifique `data/export/_import_summary.json`.

4) Atualizar variáveis de ambiente do deploy
- No painel de deploy (GitHub Actions / Hostgator / outro), configure:
  - `DATABASE_URL` (ou `SUPABASE_DB_URL`/`SUPABASE_POOLER_URL`) apontando para o Supabase
  - `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` (usados no frontend)
  - `VITE_BACKEND_ROOT` e `VITE_API_URL` se mantiver backend em outro host

Observação: já atualizei os workflows `.github/workflows/deploy.yml` e `.github/workflows/deploy-pages.yml` para incluir `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` no momento do build do cliente.

5) Testes
- Build local do cliente com variáveis:

```bash
cd client
VITE_SUPABASE_URL="https://<seu>.supabase.co" VITE_SUPABASE_ANON_KEY="<anon>" VITE_BACKEND_ROOT="" npm run build
```

- Rodar frontend localmente (`npm run dev`) e verificar se o `BackendStatusMonitor` mostra `Cliente Supabase configurado` e se você consegue logar via Supabase Auth.

6) Migração do backend (opcional)
- Se preferir manter o backend Node/Express em produção, disponibilize-o em um host (Railway, HostGator, Vercel, Render, etc.) e defina `VITE_BACKEND_ROOT`/`VITE_API_URL` adequadamente.
- Alternativamente, migre parte da lógica para Supabase (Row Level Security, RPC/Functions, Edge Functions). Esta opção exige trabalho adicional no código (mover endpoints, adaptar queries e permissões).

Notas de compatibilidade (frontend)
- O frontend já usa o `supabaseClient` (`client/src/lib/supabase.js`) e o `authStore` faz fallback ao backend quando necessário.
- Para uso direto do Supabase: configure `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` no ambiente de build e/ou salve uma configuração runtime via UI (o app aceita salvar no localStorage para testes).

Checklist final
- [ ] Exportar dados do Railway
- [ ] Importar no Supabase
- [ ] Ajustar segredos no provider de deploy (GitHub/HostGator/etc.)
- [ ] Testar login e fluxos principais (criar empresa, prescrição, agendamento)
- [ ] Confirmar layout (responsivo) e ajustar CSS, se necessário

Se quiser, eu executo as etapas de export/import localmente (preciso que você defina `SOURCE_DATABASE_URL` e `DATABASE_URL` no ambiente do terminal) e configuro os secrets no GitHub Actions (preciso acesso ao repositório ou você pode me fornecer os valores para gravar localmente).