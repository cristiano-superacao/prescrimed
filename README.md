# 🏥 Prescrimed - Sistema de Gestão de Saúde

Sistema completo de gestão para casas de repouso, clínicas de fisioterapia e clínicas veterinárias (petshop). Oferece prescrições médicas, prontuários eletrônicos, agendamentos, controle de estoque e gestão financeira em uma plataforma multi-tenant moderna e responsiva.

Agora inclui a base comercial/fiscal com catálogo de produtos e serviços, pedidos, pagamentos com webhook público e emissão fiscal preparada para provedor REST externo.

[![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![Railway](https://img.shields.io/badge/Deploy-Railway-purple.svg)](https://railway.app/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-blue.svg)](https://www.postgresql.org/)

> **Última Atualização:** 21 de janeiro de 2026  
> **Status do Sistema:** ✅ Operacional | 📘 [Manual do Sistema](MANUAL_DO_SISTEMA.md) | 📚 [Documentação Técnica Completa](DOCUMENTATION.md)

---

## 🎯 Funcionalidades

### 👥 Gestão de Usuários e Permissões
- **9 Funções Clínicas/Administrativas:**
  - Super Administrador (multi-empresa)
  - Administrador
  - Nutricionista
  - Enfermeiro
  - Técnico de Enfermagem
  - Fisioterapeuta
  - Assistente Social
  - Auxiliar Administrativo
  - Atendente
- Sistema de permissões granulares por módulo
- Multi-tenant com isolamento por empresa

### 📋 Módulos Principais
- **Dashboard:** Visão geral com métricas e indicadores em tempo real
- **Pacientes:** Cadastro completo com prontuário eletrônico e busca avançada
- **Prescrições:** Medicamentosas, nutricionais e mistas com controle de vigência
- **Agenda:** Agendamentos e controle de consultas com notificações
- **Evolução/Enfermagem:** Registros completos com sinais vitais e avaliação de riscos
- **Estoque:** Controle de medicamentos, materiais e alertas de validade
- **Financeiro:** Gestão de receitas e despesas com **exportação PDF/Excel**
- **Comercial/Fiscal:** Catálogo, pedidos, checkout, webhook de pagamento e emissão de NF-e/NFS-e por provedor REST
- **Usuários:** Controle de acesso com 9 níveis de permissão
- **Empresas:** Gestão multi-tenant (Super Admin)
- **Censo MP:** Mapa de leitos para casas de repouso
- **Cronograma:** Planejamento de atividades e procedimentos

### 🎨 Interface
- **Layout responsivo e profissional** em todas as telas (mobile, tablet, desktop)
- Design moderno com Tailwind CSS e componentes padronizados
- Botões de ação com gradientes, tooltips e estados de loading
- Tema escuro com glassmorphism e transições suaves
- Componentes acessíveis (WCAG) otimizados para touch e keyboard
- Exportação de relatórios em PDF e Excel
- Notificações toast personalizadas (sucesso, erro, aviso)

---

## 🏗️ Arquitetura

### Backend
- **Node.js 20+** com Express
- **PostgreSQL** via Sequelize ORM (suporte exclusivo)
- **JWT** para autenticação
- **Helmet** e CORS configurados para segurança
- Multi-tenant com isolamento por `empresaId`

### Frontend
- **React 18** com Vite
- **React Router** para SPA
- **Zustand** para state management
- **Axios** para requisições HTTP
- **Tailwind CSS** para estilização

### Deploy
- **Railway** (backend + PostgreSQL + frontend estático)
- **Nixpacks** para build automático
- **Healthcheck** em `/health`
- Auto-deploy via GitHub

### Integrações comerciais e fiscais
- Provedor de pagamento via API REST configurável por ambiente
- Webhook público em `/api/public/webhooks/payment` com validação HMAC SHA-256
- Emissão automática de nota fiscal após pagamento aprovado
- Fallback seguro para modo simulado quando o provedor ainda não estiver configurado

---

## 🚀 Início Rápido

### Pré-requisitos
- Node.js 20+
- npm 10+
- PostgreSQL (produção e desenvolvimento)

### Instalação Local

```bash
# Clone o repositório
git clone https://github.com/cristiano-superacao/prescrimed.git
cd prescrimed

# Instale dependências do backend
npm install

# Instale dependências do frontend e faça build
npm run build:client

# Configure variáveis de ambiente (copie .env.example para .env)
cp .env.example .env

# Inicie o servidor (serve backend + frontend)
npm start
```

Abra [http://localhost:8000](http://localhost:8000)

### Desenvolvimento Local

```bash
# Terminal 1: Backend (watch mode)
npm run dev

# Terminal 2: Frontend (Vite dev server)
npm run client
```

Frontend estará em [http://localhost:5173](http://localhost:5173)

### 📊 Dashboard Analytics (Streamlit) - NOVO!

O Prescrimed agora inclui um **dashboard interativo** desenvolvido com Streamlit para visualização de dados e análises avançadas:

```bash
# Instalar dependências Python
npm run streamlit:install

# Executar o dashboard
npm run streamlit

# Ou executar tudo junto (Backend + Frontend + Streamlit)
npm run dev:all
```

Dashboard estará em [http://localhost:8501](http://localhost:8501)

**Funcionalidades do Dashboard:**
- 📊 Métricas em tempo real (pacientes, prescrições, receita)
- 📈 Gráficos interativos com Plotly
- 🔍 Filtros avançados por período e empresa
- 📋 Tabelas dinâmicas
- 🎨 Design responsivo e profissional
- 🔌 Integração com API do backend

📄 **Documentação completa:** [STREAMLIT_GUIDE.md](STREAMLIT_GUIDE.md)

---

## 🔧 Configuração

### Variáveis de Ambiente (Backend)

Crie um arquivo `.env` na raiz do projeto:

```env
# Ambiente
NODE_ENV=production

# Servidor
PORT=8000

# Banco de Dados (Railway PostgreSQL)
DATABASE_URL=postgresql://usuario:senha@host:5432/database

# Autenticação JWT (gere secrets seguros!)
JWT_SECRET=seu-secret-jwt-aqui-minimo-32-caracteres
JWT_REFRESH_SECRET=seu-refresh-secret-aqui-minimo-32-caracteres
SESSION_TIMEOUT=8h

# CORS / Frontend
FRONTEND_URL=https://prescrimed.up.railway.app
CORS_ORIGIN=https://prescrimed.up.railway.app
ALLOWED_ORIGINS=https://prescrimed.up.railway.app,http://localhost:8000,http://127.0.0.1:8000,http://localhost:5173,http://127.0.0.1:5173
PUBLIC_BASE_URL=https://prescrimed.up.railway.app

# Pagamentos
PAYMENT_PROVIDER=mercado-pago
PAYMENT_PROVIDER_BASE_URL=https://api.seu-provedor-pagamento.com
PAYMENT_PROVIDER_TOKEN=seu-token-pagamento
PAYMENT_PROVIDER_CHECKOUT_PATH=/checkout
PAYMENT_WEBHOOK_SECRET=segredo-hmac-do-webhook
PAYMENT_WEBHOOK_STRICT=true

# Fiscal
FISCAL_PROVIDER=nuvem-fiscal
FISCAL_PROVIDER_BASE_URL=https://api.seu-provedor-fiscal.com
FISCAL_PROVIDER_TOKEN=seu-token-fiscal
FISCAL_PROVIDER_INVOICE_PATH=/invoices
FISCAL_ENVIRONMENT=producao
NFSE_CITY_CODE=3550308
AUTO_EMIT_FISCAL_ON_PAYMENT_APPROVED=true

# Backups (Superadmin)
# Armazenamento local (pasta). Default: ./data/backups
# Em Railway, use Volume para persistência se necessário.
BACKUP_DIR=./data/backups

# Backups automáticos (opcional)
BACKUP_AUTO_ENABLED=false
BACKUP_AUTO_INTERVAL_HOURS=24
BACKUP_AUTO_SEND_EMAIL=true
BACKUP_RETENTION_COUNT=30
# BACKUP_RETENTION_DAYS=90

# SMTP (opcional) - envio de backups por e-mail
# Se não configurar, o sistema cria o arquivo local e marca e-mail como "skipped".
SMTP_HOST=smtp.seu-provedor.com
SMTP_PORT=587
SMTP_USER=seu_usuario
SMTP_PASS=sua_senha
SMTP_FROM="Prescrimed <no-reply@prescrimed.com.br>"

# Seed / Deploy Inicial (TEMPORÁRIO - remova após primeiro deploy)
FORCE_SYNC=true
SEED_MINIMAL=true
SEED_SLUG=empresa-teste
SEED_PASSWORD=Prescri@2026

# Opcional: Fail-Fast (derruba servidor se DATABASE_URL ausente)
# Recomendado em produção para garantir uso do banco na nuvem (Railway PostgreSQL)
# FAIL_FAST_DB=true
```

#### Configuração rápida do `DATABASE_URL` (Railway)

- Foi criado um arquivo local de exemplo com a URL real em `.env.local` (não será commitado).
- Para produção no Railway, copie a URL do serviço Postgres para a variável `DATABASE_URL` nas Variables do serviço backend.
- Forma recomendada e profissional de composição (portável):

```env
DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${PGHOST}:${PGPORT}/${POSTGRES_DB}
```

Isso mantém o layout limpo e permite trocar host/porta/credenciais sem editar a URL diretamente.

#### Webhook público de pagamento

- Endpoint: `POST /api/public/webhooks/payment`
- Assinatura: HMAC SHA-256 em `X-Webhook-Signature` ou `X-Signature`
- Corpo esperado: JSON com `id`/`externalId`, `status`, `pedidoId` ou `metadata.pedidoId`
- Efeito automático: atualização do pagamento, sincronização financeira e tentativa de emissão fiscal

**Gere secrets seguros:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Variáveis de Ambiente (Frontend)

Arquivo `client/.env.production`:

```env
# Produção - aponta para backend público Railway
VITE_BACKEND_ROOT=https://prescrimed-backend-production.up.railway.app

# Ou use proxy relativo se frontend e backend no mesmo domínio:
# VITE_API_URL=/api
```

---

## 📦 Scripts Disponíveis

### Desenvolvimento
```bash
npm run dev              # Backend em watch mode (nodemon)
npm run client           # Frontend dev server (Vite)
npm run dev:full         # Backend + Frontend simultâneos
```

### Build
```bash
npm run build:client     # Build do frontend
npm run build:full       # Instala deps + build do frontend
npm run build            # Alias para build:client
```

### Deploy (Produção)
```bash
npm start                # Inicia servidor (produção)
npm run railway:build    # Build para Railway
npm run railway:start    # Start no Railway
npm run predeploy:check  # Verifica Variables (Railway/local)
npm run predeploy        # Pré-check + build automático
```

### Utilitários
```bash
npm run seed:minimal     # Seed mínimo (1 empresa + 4 usuários + 3 pacientes)
npm run seed:demo        # Seed completo com dados demo
npm run create:superadmin # Criar/atualizar super admin
npm run backfill:empresa:codigo # Preencher codigo/codigoNumero em empresas antigas
npm run smoke:api        # Smoke test completo da API
npm run sanity:rules     # Valida regras: inativação (pacientes), histórico de evoluções
npm run check:railway    # Validar configuração do Railway
npm run check:health     # Verificar status do backend
```

---

## 🐳 Deploy no Railway

### Guia Completo
Consulte [RAILWAY_SETUP.md](RAILWAY_SETUP.md) para instruções detalhadas passo a passo.

### Resumo Rápido

1. **Criar Projeto no Railway**
   - Conecte seu repositório GitHub
   - Adicione PostgreSQL ao projeto

2. **Configurar Variáveis Obrigatórias**
   ```
   DATABASE_URL=<copie do PostgreSQL Railway>
   JWT_SECRET=<gere com crypto.randomBytes>
   JWT_REFRESH_SECRET=<gere com crypto.randomBytes>
   NODE_ENV=production
   ```

3. **Primeiro Deploy (criar tabelas + seed)**
   ```
   FORCE_SYNC=true
   SEED_MINIMAL=true
   SEED_PASSWORD=Prescri@2026
   ```

4. **Deploy Subsequentes (remova as temporárias)**
   - Remova `FORCE_SYNC` e `SEED_MINIMAL`
   - Mantenha `DATABASE_URL`, `JWT_SECRET`, etc.

5. **Configurar CORS para Frontend**
   ```
   ALLOWED_ORIGINS=https://prescrimed.up.railway.app,http://localhost:8000,http://127.0.0.1:8000,http://localhost:5173,http://127.0.0.1:5173
   FRONTEND_URL=https://prescrimed.up.railway.app
   CORS_ORIGIN=https://prescrimed.up.railway.app
   ```

6. **Validar Deploy**
   - Acesse `https://seu-servico.up.railway.app/health`
   - Deve retornar: `{"status":"ok","database":"connected",...}`
   - Verifique os logs para: `[API] POST /api/auth/login` (confirmando requisições)

---

## 🔐 Criar Super Administrador

### Método 1: Via Seed (primeiro deploy)
```bash
# No Railway, configure:
SEED_MINIMAL=true
SEED_PASSWORD=Prescri@2026
SEED_SLUG=empresa-teste

# Credenciais geradas:
# Email: superadmin+empresa-teste@prescrimed.com
# Senha: Prescri@2026
```

### Método 2: Script Dedicado (qualquer momento)
```bash
# No Railway, configure:
SUPERADMIN_EMAIL=superadmin@prescrimed.com
SUPERADMIN_PASSWORD=SuaSenhaSegura123
SUPERADMIN_NOME=Super Admin

# Execute no Railway (Run Command):
npm run create:superadmin
```

### Método 3: Local
```bash
# No terminal:
export SUPERADMIN_EMAIL=superadmin@prescrimed.com
export SUPERADMIN_PASSWORD=Prescri@2026
npm run create:superadmin
```

---

## 🧪 Testes e Validação

### Smoke Test (valida fluxo completo)
```bash
# Local (requer backend rodando em localhost:8000)
npm run smoke:api

# Railway
BASE_URL=https://seu-backend.up.railway.app npm run smoke:api
```

O smoke test valida:
- ✅ Health check
- ✅ Cadastro de empresa + usuário
- ✅ Login e autenticação
- ✅ Criação de paciente
- ✅ Criação de prescrição
- ✅ Persistência no banco (Postgres)

### Acesso por Cargo (Roles) e Usuários por Empresa

Para garantir que cada empresa tenha profissionais essenciais e que eles consigam operar nas funcionalidades de cada residente, use os scripts abaixo.

**Criar usuários por empresa (Nutricionista, Assistente Social, Técnico de Enfermagem):**

```bash
node scripts/seed-company-role-users.js
```

Isso cria, para cada empresa existente, três usuários com senha padrão `teste123` e e-mails no padrão:
- `nutricionista.<slug-da-empresa>@prescrimed.com`
- `assistente-social.<slug-da-empresa>@prescrimed.com`
- `tecnico-enfermagem.<slug-da-empresa>@prescrimed.com`

Exemplo para "Casa de Repouso Vida Plena":
- `nutricionista.casa-de-repouso-vida-plena@prescrimed.com`
- `assistente-social.casa-de-repouso-vida-plena@prescrimed.com`
- `tecnico-enfermagem.casa-de-repouso-vida-plena@prescrimed.com`

**Testar acessos por residente e operações de cada cargo:**

```bash
node scripts/test-resident-role-access.js
```

O teste realiza:
- Nutricionista: login, lista pacientes/agendamentos e cria uma prescrição no residente.
- Técnico de Enfermagem: login, lista pacientes/agendamentos e cria um registro de enfermagem (sinais vitais).
- Assistente Social: login e leitura de pacientes/agendamentos.

Essas operações usam o isolamento multi-tenant (`empresaId`) e respeitam as permissões configuradas.

### Paginação e Ordenação (UI/Backend)

- Paginação padronizada em todos os módulos (backend) com resposta `{ items, total, page, pageSize }`.
- Ordenação por `updatedAt DESC` nos listados recentes (10 mais recentes).
- Agenda com ordenação especial por status: **Confirmados → Agendados → Cancelados → Concluídos**.
- UI com layout responsivo e profissional em todas as listas, incluindo exibição do **Código de cadastro** (ID) em cartões e tabelas.


### Atualização (26 jan 2026) — Regras de Acesso de Residentes + Erros Amigáveis

- RBAC para cadastro de Residentes por tipo de sistema:
   - Casa de Repouso/PetShop: `admin`, `enfermeiro`, `assistente_social`, `medico` (e `superadmin`).
   - Fisioterapia: `admin`, `enfermeiro`, `assistente_social`, `fisioterapeuta`, `medico` (e `superadmin`).
- Novo role disponível: `medico` (incluído no enum e na UI).
- Multi-tenant: todas as rotas protegidas aplicam isolamento por `empresaId`; `superadmin` pode selecionar contexto com `x-empresa-id`.
- Frontend: botão “Novo Residente” desabilita quando não permitido e exibe tooltip com orientação.
- Tratamento de erros amigáveis:
   - Backend padroniza `{ error, code, details }` com mapeamento de códigos comuns.
   - Frontend usa `client/src/utils/errorHandler.js` (`handleApiError`) para exibir toasts claros.


## 👤 Capacidades por Cargo

- **Nutricionista:**
   - Criar/listar/editar prescrições nutricionais por residente
   - Ver pacientes e agendamentos da empresa
   - Acesso aos detalhes de prontuário
- **Técnico de Enfermagem:**
   - Criar registros de enfermagem (ex.: sinais vitais, evolução)
   - Ver pacientes e agendamentos
   - Atualizar registros próprios
- **Assistente Social:**
   - Ler pacientes e agendamentos
   - Consultar informações do residente (sem escrita clínica)

Essas capacidades funcionam com **isolamento multi-tenant** via `empresaId` e autenticação JWT. Rotas sensíveis aplicam verificação de propriedade e/ou role.

---

## ❗ Tratamento de Erros (Mensagens Amigáveis)

- Backend retorna erros padronizados com `{ error, code, details }`.
- Mapeamentos comuns:
   - `validation_error`: "Alguns dados parecem inválidos..."
   - `unique_constraint`: "Já existe um registro com esses dados."
   - `auth_token_error`: "Sessão expirada..."
   - `access_denied`, `not_found`, `service_unavailable`
- Frontend exibe toasts claros e orientados ao usuário.
- Interceptores de API lidam com indisponibilidade, 401/refresh, 5xx e instruções úteis.

### Verificar Configuração do Railway
```bash
npm run check:railway
```

Valida:
- ❌ Variáveis obrigatórias faltando
- ⚠️ Secrets inseguros ou curtos
- ✅ Configuração completa

---

## 🔧 Troubleshooting

### Backend não conecta ao PostgreSQL
**Sintoma:** `database unavailable` ou `DATABASE_URL ausente`

**Solução:**
1. Confirme que `DATABASE_URL` está configurada no Railway
2. Verifique se PostgreSQL foi adicionado ao projeto
3. Copie a URL do serviço Postgres (Variables → `DATABASE_URL`)

### Frontend retorna HTML em vez de JSON
**Sintoma:** `Failed to load module script: Expected JavaScript-or-Wasm module script but server responded with MIME type 'text/html'`

**Causa:** Frontend buildado com `base: '/prescrimed/'` mas servido em `/`

**Solução:** Build com base correto:
```bash
# Para Railway/Netlify (raiz):
cd client && npm run build:railway

# Para GitHub Pages (/prescrimed/):
cd client && VITE_BASE=/prescrimed/ npm run build
```

### Erro 405 em /api/auth/register ou /api/auth/login
**Sintoma:** `405 Method Not Allowed` ao tentar fazer login ou registro

**Causas Possíveis:**
1. **CORS bloqueando requisições do frontend**
2. **Método HTTP incorreto** sendo enviado pelo cliente
3. **Middleware interceptando** a requisição antes de chegar na rota

**Soluções:**

**1. Verificar CORS no Backend:**
```env
# No Railway, adicione todos os domínios e localhost para testes locais:
ALLOWED_ORIGINS=https://prescrimed.up.railway.app,http://localhost:8000,http://127.0.0.1:8000,http://localhost:5173,http://127.0.0.1:5173
FRONTEND_URL=https://prescrimed.up.railway.app/
CORS_ORIGIN=https://prescrimed.up.railway.app/
```

**2. Verificar logs do servidor:**
O sistema agora registra todas as requisições na API:
```
[API] POST /api/auth/login
[API] 405 Method Not Allowed: GET /api/auth/login
```

**3. Verificar configuração do frontend:**
```env
# client/.env.production
VITE_BACKEND_ROOT=https://prescrimed-backend-production.up.railway.app
```

**4. Limpar cache do navegador:**
- Ctrl+Shift+Delete (Chrome/Edge)
- Limpar cookies e cache do site
- Tentar em janela anônima

**5. Verificar método da requisição:**
O frontend deve sempre usar POST para `/api/auth/login` e `/api/auth/register`

**6. Redeploy completo:**
```bash
# Reconstruir frontend
cd client && npm run build:railway

# Fazer commit e push
git add .
git commit -m "fix: rebuild frontend with correct API configuration"
git push origin master
```

### Tabelas não foram criadas
**Sintoma:** `relation "usuarios" does not exist`

**Solução:**
1. No primeiro deploy, configure: `FORCE_SYNC=true`
2. Aguarde deploy completar e verifique logs
3. Após confirmação, remova `FORCE_SYNC` (ou mude para `false`)

### Login retorna "Credenciais inválidas"
**Causa:** Usuário não existe no banco

**Solução:** Crie super admin:
```bash
# No Railway (Variables):
SUPERADMIN_EMAIL=superadmin@prescrimed.com
SUPERADMIN_PASSWORD=Prescri@2026

# Rode no Railway (Run Command):
npm run create:superadmin
```

---

## 📊 API Endpoints

### Autenticação
```
POST   /api/auth/register    # Cadastro (empresa + usuário)
POST   /api/auth/login       # Login (retorna JWT)
GET    /api/auth/me          # Dados do usuário autenticado
```

**Exemplo de Login:**
```bash
curl -X POST https://seu-backend.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"superadmin@prescrimed.com","senha":"Prescri@2026"}'
```

**Resposta Esperada:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "nome": "Super Admin",
    "email": "superadmin@prescrimed.com",
    "role": "superadmin",
    "empresaId": 1
  }
}
```

### Usuários
```
GET    /api/usuarios         # Listar usuários da empresa
POST   /api/usuarios         # Criar usuário
GET    /api/usuarios/:id     # Detalhes do usuário
PUT    /api/usuarios/:id     # Atualizar usuário
DELETE /api/usuarios/:id     # Remover usuário
GET    /api/usuarios/me      # Perfil do usuário logado
PUT    /api/usuarios/:id/permissoes  # Atualizar permissões

### Empresas
```
POST   /api/empresas         # Criar empresa com validação
GET    /api/empresas         # Listar empresas
GET    /api/empresas/me      # Dados da empresa atual do usuário
PUT    /api/empresas/me      # Atualizar dados da empresa atual
GET    /api/empresas/:id     # Detalhes por ID
PUT    /api/empresas/:id     # Atualizar por ID
DELETE /api/empresas/:id     # Remover empresa
```

**Exemplo de criação de empresa:**
```bash
curl -X POST https://seu-backend.up.railway.app/api/empresas \
   -H "Content-Type: application/json" \
   -d '{
      "nome":"Clínica Exemplo",
      "tipoSistema":"casa-repouso",
      "cnpj":"11.222.333/0001-44",
      "email":"contato@clinicaexemplo.com",
      "telefone":"(11) 90000-0000",
      "endereco":"Rua Exemplo, 123"
   }'
```
```

### Empresas
```
GET    /api/empresas         # Listar empresas (superadmin)
POST   /api/empresas         # Criar empresa
GET    /api/empresas/:id     # Detalhes da empresa
PUT    /api/empresas/:id     # Atualizar empresa
GET    /api/empresas/me      # Dados da empresa do usuário
PUT    /api/empresas/me      # Atualizar empresa atual
```

### Pacientes
```
GET    /api/pacientes        # Listar pacientes
POST   /api/pacientes        # Criar paciente
GET    /api/pacientes/:id    # Detalhes do paciente
PUT    /api/pacientes/:id    # Atualizar paciente
DELETE /api/pacientes/:id    # Remover paciente
```

### Prescrições
```
GET    /api/prescricoes      # Listar prescrições
POST   /api/prescricoes      # Criar prescrição
GET    /api/prescricoes/:id  # Detalhes da prescrição
PUT    /api/prescricoes/:id  # Atualizar prescrição
DELETE /api/prescricoes/:id  # Remover prescrição
```

### Health & Diagnóstico
```
GET    /health               # Health check
GET    /api/health           # Health check (alternativo)
GET    /api/test             # Teste de conectividade
GET    /api/diagnostic/db-check  # Verificar tabelas/colunas
```

**Logs do Sistema:**
O backend agora registra todas as requisições API:
```
[API] POST /api/auth/login
[API] GET /api/usuarios
[API] 405 Method Not Allowed: GET /api/auth/login  # Erro de método
```

Isso facilita o troubleshooting de problemas como erro 405 (método não permitido).

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Faça fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'feat: adicionar MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

### Padrão de Commits
Seguimos [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` nova funcionalidade
- `fix:` correção de bug
- `docs:` documentação
- `style:` formatação (sem mudança de lógica)
- `refactor:` refatoração (sem mudança de comportamento)
- `perf:` melhoria de performance
- `test:` testes
- `chore:` manutenção

---

## � Changelog Recente

### [Janeiro 2026] - Melhorias de Diagnóstico e CORS
- ✅ **Logs aprimorados:** Todas as requisições `/api/*` agora são registradas com método e URL
- ✅ **Troubleshooting 405:** Logs detalhados para identificar métodos HTTP não permitidos
- ✅ **CORS otimizado:** Suporte para múltiplas origens via `ALLOWED_ORIGINS`
- ✅ **Documentação expandida:** Guia completo de troubleshooting para erros comuns
- ✅ **Health check robusto:** Validação de conectividade e estado do banco
- ✅ **Scripts utilitários:** `create:superadmin`, `smoke:api`, `check:railway`

---

## �📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 🌟 Agradecimentos

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Express](https://expressjs.com/)
- [Sequelize](https://sequelize.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Railway](https://railway.app/)

---


## 📞 Suporte

- **GitHub Issues:** [https://github.com/cristiano-superacao/prescrimed/issues](https://github.com/cristiano-superacao/prescrimed/issues)
- Consulte [RAILWAY_SETUP.md](RAILWAY_SETUP.md) para deploy detalhado.

---

**Desenvolvido com ❤️ mantendo o layout responsivo e profissional em todas as telas**

---

## Atualizações – 26 jan 2026

- RBAC estendido para edição e exclusão de Residentes, com as mesmas regras já aplicadas ao cadastro por `tipoSistema` da empresa e `role` do usuário (superadmin mantém acesso total).
- UI atualizada: botões Editar/Excluir ficam desabilitados quando não há permissão e exibem mensagem amigável quando acionados sem acesso.
- Backend retorna `code: access_denied` padronizado; frontend converte para mensagens claras ao usuário.
 - Residentes: exclusão bloqueada (405). Administrador pode apenas inativar via `PUT /api/pacientes/:id/inativar`; UI exibe ação “Inativar”.
 - Evoluções: histórico imutável (edição bloqueada com 405 e `code: history_immutable`), exclusão permitida somente ao Super Administrador; UI desabilita editar e restringe excluir.
