# Documentação Técnica - Prescrimed

## Atualização (26 jan 2026)
### RBAC em Cadastro de Residentes

- `routes/paciente.routes.js` agora é protegido com `authenticate` e `tenantIsolation` em todas as rotas.
- Criação (`POST /api/pacientes`) verifica `Empresa.tipoSistema` e `req.user.role`:
  - Casa de Repouso/PetShop: `admin`, `enfermeiro`, `assistente_social`, `medico`, `superadmin`.
  - Fisioterapia: `admin`, `enfermeiro`, `assistente_social`, `fisioterapeuta`, `medico`, `superadmin`.

### RBAC em Edição e Remoção de Residentes

- As rotas `PUT /api/pacientes/:id` e `DELETE /api/pacientes/:id` agora aplicam as mesmas regras de RBAC do cadastro:
  - Validação via `Empresa.tipoSistema` e `req.user.role` antes de atualizar/excluir.
  - Respostas com `403` e `code: access_denied` quando sem permissão.
  - Filtro de empresa permanece ativo pelo `tenantIsolation` (usuários não conseguem editar/excluir residentes de outra empresa).

### Residentes: Inativação (substitui exclusão)

- `DELETE /api/pacientes/:id` → agora retorna **405** (operação não permitida) com `code: operation_not_allowed`.
- Nova rota: `PUT /api/pacientes/:id/inativar` → inativa o residente (altera `status` para `inativo`).
  - Permissão: apenas `admin` da empresa; resposta `403`/`code: access_denied` se não autorizado.
  - Isolamento por empresa se mantém via `tenantIsolation`.

### Evoluções (RegistroEnfermagem): Histórico Imutável

- `PUT /api/enfermagem/:id` → retorna **405** com `code: history_immutable` (edição de histórico não é permitida).
- `DELETE /api/enfermagem/:id` → permitido apenas para `superadmin`; demais perfis recebem **403** com `code: access_denied`.
- Visualização: endpoints de listagem/detalhe permanecem para exibir histórico completo sem alterações retroativas.

### Frontend (Adequações)

- `Pacientes.jsx`: ação “Excluir” substituída por “Inativar” (somente `admin`). Serviços atualizados (`paciente.service.inactivate`).
- `Evolucao.jsx`: botões de edição removidos/bloqueados; exclusão desabilitada para não-superadmin, com mensagem amigável.

### Isolamento Multi-Tenant

- `middleware/auth.middleware.js`:
  - `authenticate`: valida JWT e anexa `req.user`.
  - `tenantIsolation`: aplica `empresaId` em `req.query` (GET) e `req.body` (POST/PUT); `superadmin` pode definir contexto via `x-empresa-id`.
  - `requireRole(...roles)`: valida roles específicas.
  - `checkResourceOwnership(model)`: verifica se o recurso pertence à empresa do usuário.

### Enum de Roles

- `server.js` garante valores do enum `usuarios.role` e adiciona `medico` quando ausente.

### Frontend – Tratamento de Erros

- `client/src/utils/errorHandler.js` expõe `handleApiError(error, fallback)` que:
  - Lê `code`/`error` da resposta.
  - Usa `friendlyErrorFromCode` para mensagem amigável.
  - Exibe toast via `window.showToast`.
- As páginas principais (Agenda, Pacientes, Prescrições, Enfermagem, Financeiro, Estoque, Cronograma, CensoMP, Dashboard, Empresas, Configurações) foram atualizadas para usar o utilitário.

### UI – Botão “Novo Residente”

- `client/src/pages/Pacientes.jsx` desabilita o botão quando o usuário não possui permissão, mantendo responsividade e acessibilidade (tooltip). Clique sem permissão exibe toast amigável.
# 📚 Documentação Técnica - Sistema Prescrimed

> Documentação completa do sistema de gestão de saúde multi-tenant  
> Manual de uso (operacional): [MANUAL_DO_SISTEMA.md](MANUAL_DO_SISTEMA.md)  
> **Versão:** 1.0.0  
> **Última Atualização:** 21 de Janeiro de 2026

---

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Arquitetura](#arquitetura)
- [Módulos do Sistema](#módulos-do-sistema)
- [API Endpoints](#api-endpoints)
- [Modelos de Dados](#modelos-de-dados)
- [Autenticação e Segurança](#autenticação-e-segurança)
- [Frontend](#frontend)
- [Deploy e Infraestrutura](#deploy-e-infraestrutura)
- [Guia de Desenvolvimento](#guia-de-desenvolvimento)

---

## 🎯 Visão Geral

### Propósito
Sistema completo de gestão de saúde projetado para atender múltiplos tipos de estabelecimentos:
- 🏥 Casas de Repouso
- 🦴 Clínicas de Fisioterapia  
- 🐾 Clínicas Veterinárias (Petshop)

### Características Principais
- **Multi-tenant**: Isolamento completo por empresa
- **Responsivo**: Design adaptável para mobile, tablet e desktop
- **Modular**: Arquitetura baseada em módulos independentes
- **Seguro**: Autenticação JWT com refresh token
- **Escalável**: Pronto para crescimento horizontal

---

## 🏗️ Arquitetura

### Stack Tecnológico

#### Backend
```
Node.js 20+
├── Express.js          → Framework web
├── Sequelize          → ORM para banco de dados
├── PostgreSQL         → Banco de dados principal
├── JWT                → Autenticação e autorização
├── Helmet             → Segurança HTTP
└── CORS               → Controle de acesso cross-origin
```

#### Frontend
```
React 18
├── Vite              → Build tool e dev server
├── React Router      → Roteamento SPA
├── Zustand           → State management
├── Axios             → Cliente HTTP
├── Tailwind CSS      → Framework CSS utilitário
├── Lucide React      → Ícones
└── React Hot Toast   → Notificações
```

#### Infraestrutura
```
Railway
├── Backend Service   → Node.js Express
├── PostgreSQL DB     → Banco de dados
└── Frontend Static   → Build React servido pelo backend
```

### Fluxo de Dados

```
Cliente (Browser)
    ↓ HTTPS
Railway Load Balancer
    ↓
Express Server
    ├─→ /api/*          → API Routes → Controllers → Models → PostgreSQL
    ├─→ /health         → Health Check
    ├─→ /assets/*       → Static Files (React Build)
    └─→ /*              → SPA Fallback (index.html)
```

---

## 📦 Módulos do Sistema

### 1. Dashboard
**Descrição:** Visão geral com métricas e indicadores  
**Funcionalidades:**
- Cards de estatísticas em tempo real
- Gráficos de receitas e despesas
- Alertas e notificações
- Resumo de pacientes ativos

**Endpoint:** `GET /api/dashboard/stats`

---

### 2. Gestão de Pacientes
**Descrição:** Cadastro completo com prontuário eletrônico  
**Funcionalidades:**
- CRUD completo de pacientes
- Busca por nome, CPF, telefone
- Filtros avançados por status
- Histórico de atendimentos
- Exportação de relatórios

**Endpoints:**
```
GET    /api/pacientes           → Listar todos
GET    /api/pacientes/:id       → Buscar por ID
POST   /api/pacientes           → Criar novo
PUT    /api/pacientes/:id       → Atualizar
DELETE /api/pacientes/:id       → Excluir
```

**Campos Principais:**
- Nome completo, CPF, RG, CNS
- Data de nascimento, idade
- Contato: telefone, email, endereço
- Responsável/familiar
- Convênio e plano de saúde
- Observações médicas

---

### 3. Prescrições Médicas
**Descrição:** Gestão de prescrições medicamentosas e nutricionais  
**Funcionalidades:**
- Tipos: Medicamentosa, Nutricional, Mista
- Status: Ativa, Cancelada, Arquivada
- Vigência com data início e fim
- Histórico de alterações

**Endpoints:**
```
GET    /api/prescricoes                    → Listar todas
GET    /api/prescricoes/paciente/:id       → Por paciente
GET    /api/prescricoes/:id                → Buscar por ID
POST   /api/prescricoes                    → Criar nova
PUT    /api/prescricoes/:id/cancelar       → Cancelar
PUT    /api/prescricoes/:id/arquivar       → Arquivar
DELETE /api/prescricoes/:id                → Excluir
```

---

### 4. Agendamentos
**Descrição:** Controle de consultas e procedimentos  
**Funcionalidades:**
- Agendamento com data/hora
- Status: Agendado, Confirmado, Realizado, Cancelado
- Notificações de confirmação
- Visualização em calendário

**Endpoints:**
```
GET    /api/agendamentos           → Listar todos
POST   /api/agendamentos           → Criar novo
PUT    /api/agendamentos/:id       → Atualizar
DELETE /api/agendamentos/:id       → Excluir
```

---

### 5. Registros de Enfermagem
**Descrição:** Evolução e acompanhamento de pacientes  
**Funcionalidades:**
- Tipos: Admissão, Evolução, Alta, Intercorrência
- Sinais vitais (PA, FC, FR, Temp, SatO2, Glicemia)
- Avaliação de riscos (queda, lesão)
- Estado geral e alertas
- Prioridade de atendimento

**Endpoints:**
```
GET    /api/enfermagem                → Listar todos
GET    /api/enfermagem/:id            → Buscar por ID
GET    /api/enfermagem/stats/dashboard → Estatísticas
POST   /api/enfermagem                → Criar novo
PUT    /api/enfermagem/:id            → Atualizar
DELETE /api/enfermagem/:id            → Excluir
```

**Modelo de Dados:**
```javascript
{
  tipo: ENUM('admissao', 'evolucao', 'alta', 'intercorrencia'),
  dataHora: TIMESTAMP,
  sinaisVitais: JSON {
    pa: String,
    fc: Number,
    fr: Number,
    temperatura: Number,
    saturacao: Number,
    glicemia: Number
  },
  riscoQueda: ENUM('baixo', 'medio', 'alto'),
  riscoLesao: ENUM('baixo', 'medio', 'alto'),
  estadoGeral: TEXT,
  alerta: BOOLEAN,
  prioridade: ENUM('rotina', 'urgente', 'emergencia')
}
```

---

### 6. Gestão de Estoque
**Descrição:** Controle de medicamentos e materiais  
**Funcionalidades:**
- Cadastro de itens com código de barras
- Controle de lotes e validades
- Entrada e saída de estoque
- Alertas de estoque mínimo
- Relatórios de movimentação

**Endpoints:**
```
GET    /api/estoque/medicamentos              → Listar medicamentos
POST   /api/estoque/medicamentos              → Criar medicamento
POST   /api/estoque/medicamentos/movimentacao → Entrada/saída (medicamento)

GET    /api/estoque/alimentos                 → Listar alimentos
POST   /api/estoque/alimentos                 → Criar alimento
POST   /api/estoque/alimentos/movimentacao    → Entrada/saída (alimento)

GET    /api/estoque/movimentacoes?tipo=medicamento|alimento → Últimas movimentações
GET    /api/estoque/stats                     → Estatísticas e alertas
```

---

### 7. Gestão Financeira
**Descrição:** Controle de receitas e despesas  
**Funcionalidades:**
- Tipos: Receita, Despesa
- Categorias personalizáveis
- Status: Pago, Pendente
- Dashboard com estatísticas
- **Exportação para PDF e Excel**
- Projeção de saldo

**Endpoints:**
```
GET    /api/financeiro               → Listar transações
GET    /api/financeiro/stats         → Estatísticas
POST   /api/financeiro               → Criar transação
PUT    /api/financeiro/:id           → Atualizar
DELETE /api/financeiro/:id           → Excluir
```

**Funcionalidades de Exportação:**
- **PDF**: Impressão formatada com resumo e tabela de transações
- **Excel**: Arquivo CSV com UTF-8, resumo financeiro e dados detalhados
- Botões responsivos com estados de loading
- Desabilitado quando não há transações

---

### 8. Gestão de Usuários
**Descrição:** Controle de acesso e permissões  
**Funcionalidades:**
- 9 níveis de função/cargo
- Status ativo/inativo
- Multi-tenant por empresa
- Controle de permissões granular

**Funções Disponíveis:**
1. Super Administrador (multi-empresa)
2. Administrador
3. Nutricionista
4. Enfermeiro
5. Técnico de Enfermagem
6. Fisioterapeuta
7. Assistente Social
8. Auxiliar Administrativo
9. Atendente

**Endpoints:**
```
GET    /api/usuarios           → Listar todos
GET    /api/usuarios/:id       → Buscar por ID
POST   /api/usuarios           → Criar novo
PUT    /api/usuarios/:id       → Atualizar
DELETE /api/usuarios/:id       → Excluir
```

---

### 9. Gestão de Empresas
**Descrição:** Controle de empresas/tenants (SuperAdmin)  
**Funcionalidades:**
- Cadastro de múltiplas empresas
- Tipos: Casa de Repouso, Fisioterapia, Petshop
- Planos: Básico, Profissional, Premium
- Status ativo/inativo

**Endpoints:**
```
GET    /api/empresas           → Listar todas (SuperAdmin)
GET    /api/empresas/me        → Buscar empresa do usuário
POST   /api/empresas           → Criar nova (SuperAdmin)
PUT    /api/empresas/me        → Atualizar empresa
DELETE /api/empresas/:id       → Excluir (SuperAdmin)
```

---

## 🔐 Autenticação e Segurança

### JWT Authentication

**Fluxo de Autenticação:**
```
1. Login → POST /api/auth/login
   ↓
2. Servidor valida credenciais
   ↓
3. Retorna { token, refreshToken, user }
   ↓
4. Cliente armazena no localStorage
   ↓
5. Requisições incluem: Authorization: Bearer <token>
   ↓
6. Middleware valida token e empresaId
```

**Configuração:**
- **Token Expiration:** 8h (configurável)
- **Refresh Token:** Usado para renovar token expirado
- **Secret Keys:** JWT_SECRET e JWT_REFRESH_SECRET (variáveis de ambiente)

### Multi-Tenant Isolation

Todas as requisições são isoladas por `empresaId`:

```javascript
// Middleware tenantIsolation
router.use(authenticate, tenantIsolation, async (req, res) => {
  // req.user.empresaId está disponível
  const data = await Model.findAll({ 
    where: { empresaId: req.user.empresaId } 
  });
});
```

### Segurança HTTP

```javascript
// Helmet - Headers de segurança
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

// CORS - Controle de origens
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS.split(','),
  credentials: true
}));
```

---

## 🎨 Frontend

### Estrutura de Pastas

```
client/
├── src/
│   ├── components/          → Componentes reutilizáveis
│   │   ├── common/          → Componentes básicos
│   │   │   ├── PageHeader.jsx
│   │   │   ├── StatsCard.jsx
│   │   │   ├── Table.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   └── SearchFilterBar.jsx
│   │   ├── PacienteModalNew.jsx
│   │   ├── TransacaoModal.jsx
│   │   ├── UsuarioModal.jsx
│   │   └── ...
│   ├── pages/               → Páginas da aplicação
│   │   ├── Dashboard.jsx
│   │   ├── Pacientes.jsx
│   │   ├── Usuarios.jsx
│   │   ├── Financeiro.jsx
│   │   ├── Evolucao.jsx
│   │   └── ...
│   ├── services/            → Camada de serviços API
│   │   ├── api.js           → Configuração Axios
│   │   ├── paciente.service.js
│   │   ├── financeiro.service.js
│   │   └── ...
│   ├── store/               → State management (Zustand)
│   │   └── authStore.js
│   ├── utils/               → Funções utilitárias
│   │   ├── currency.js      → Formatação de moeda
│   │   ├── date.js          → Formatação de datas
│   │   └── toastMessages.js → Mensagens de notificação
│   └── App.jsx              → Componente raiz
```

### Design System

**Cores Principais:**
```css
primary:   #2563eb (azul)
emerald:   #059669 (verde)
red:       #dc2626 (vermelho)
amber:     #d97706 (amarelo)
purple:    #7c3aed (roxo)
slate:     #64748b (cinza)
```

**Padrão de Botões (Atualizado em Jan/2026):**
```jsx
// Botão de Editar
<button className="group relative p-2.5 text-slate-500 hover:text-white hover:bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md">
  <Edit2 size={18} />
  <span className="tooltip">Editar</span>
</button>

// Botão de Excluir com Loading
<button 
  onClick={() => handleDelete(id, nome)}
  disabled={deletingId === id}
  className="group relative p-2.5 text-slate-500 hover:text-white hover:bg-gradient-to-br from-red-500 to-red-600 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
>
  {deletingId === id ? (
    <div className="animate-spin rounded-full h-[18px] w-[18px] border-2 border-white border-t-transparent"></div>
  ) : (
    <Trash2 size={18} />
  )}
  <span className="tooltip">Excluir</span>
</button>
```

**Características:**
- Ícones 18px (aumentado de 16px)
- Padding p-2.5 (aumentado de p-2)
- Gradientes em hover
- Tooltips com posicionamento absoluto
- Estados de loading com spinner
- Confirmações personalizadas com nome do item
- Acessibilidade com aria-labels

### Responsividade

**Breakpoints Tailwind:**
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

**Padrões Implementados:**
```jsx
// Grid responsivo
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

// Tabela Mobile/Desktop
<MobileGrid className="md:hidden">  {/* Mobile */}
<TableWrapper className="hidden md:block">  {/* Desktop */}

// Texto condicional
<span className="hidden sm:inline">Texto Desktop</span>
<span className="sm:hidden">Texto Mobile</span>
```

---

## 🚀 Deploy e Infraestrutura

### Railway Setup

**Serviços Configurados:**
1. **Backend + Frontend** (prescrimed-backend-production)
2. **PostgreSQL Database**

**Variáveis de Ambiente Obrigatórias:**
```env
NODE_ENV=production
PORT=8000
DATABASE_URL=postgresql://...  # Fornecido pelo Railway
JWT_SECRET=...
JWT_REFRESH_SECRET=...
FRONTEND_URL=https://prescrimed-backend-production.up.railway.app
ALLOWED_ORIGINS=https://prescrimed-backend-production.up.railway.app
SESSION_TIMEOUT=8h
```

### Build Process

**Railway Build:**
```bash
# railway.json → nixpacks.toml
npm install --production=false
cd client && npm install && npm run build:railway
# Gera client/dist/
```

**Estrutura Servida:**
```
Express Server
├── /api/*           → Backend API
├── /health          → Health check
├── /assets/*        → React build assets
└── /*               → SPA fallback (index.html)
```

### Healthcheck

**Endpoint:** `GET /health`

**Resposta:**
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2026-01-21T...",
  "uptime": 12345
}
```

---

## 👨‍💻 Guia de Desenvolvimento

### Setup Local

```bash
# 1. Clonar repositório
git clone https://github.com/cristiano-superacao/prescrimed.git
cd prescrimed-main

# 2. Instalar dependências do backend
npm install

# 3. Instalar dependências do frontend
cd client && npm install && cd ..

# 4. Configurar .env
cp .env.example .env
# Editar .env com suas configurações

# 5. Rodar desenvolvimento
npm run dev:full  # Backend + Frontend simultâneos
```

### Scripts Disponíveis

**Backend:**
```bash
npm run server          # Produção
npm run dev             # Desenvolvimento com nodemon
npm run seed:demo       # Criar dados demo
npm run create:superadmin  # Criar super admin
```

**Frontend:**
```bash
npm run client          # Dev server Vite
npm run build:client    # Build produção
```

**Deploy:**
```bash
git add -A
git commit -m "feat: descrição da mudança"
git push origin main    # Auto-deploy no Railway
```

### Padrão de Commits

```
feat: Nova funcionalidade
fix: Correção de bug
docs: Atualização de documentação
style: Mudanças de formatação
refactor: Refatoração de código
perf: Melhoria de performance
test: Adição de testes
chore: Tarefas de build/config
```

### Criando um Novo Módulo

**1. Backend - Model**
```javascript
// models/NovoModulo.js
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const NovoModulo = sequelize.define('NovoModulo', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    empresaId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    // ... outros campos
  });
  return NovoModulo;
};
```

**2. Backend - Routes**
```javascript
// routes/novomodulo.routes.js
import express from 'express';
import { NovoModulo } from '../models/index.js';
import { authenticate, tenantIsolation } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', authenticate, tenantIsolation, async (req, res) => {
  const items = await NovoModulo.findAll({ 
    where: { empresaId: req.user.empresaId } 
  });
  res.json(items);
});

// ... outros endpoints

export default router;
```

**3. Registrar no routes/index.js**
```javascript
import novomoduloRoutes from './novomodulo.routes.js';
router.use('/novomodulo', authenticate, tenantIsolation, novomoduloRoutes);
```

**4. Frontend - Service**
```javascript
// client/src/services/novomodulo.service.js
import { get, post, put, del } from './request';

export const novomoduloService = {
  getAll: async () => get('/novomodulo'),
  getById: async (id) => get(`/novomodulo/${id}`),
  create: async (data) => post('/novomodulo', data),
  update: async (id, data) => put(`/novomodulo/${id}`, data),
  delete: async (id) => del(`/novomodulo/${id}`)
};
```

**5. Frontend - Page**
```jsx
// client/src/pages/NovoModulo.jsx
import { useState, useEffect } from 'react';
import { novomoduloService } from '../services/novomodulo.service';
import PageHeader from '../components/common/PageHeader';

export default function NovoModulo() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await novomoduloService.getAll();
      setItems(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader title="Novo Módulo" />
      {/* ... conteúdo */}
    </div>
  );
}
```

---

## 📊 Relatórios e Exportação

### Sistema de Exportação (Financeiro)

**Funcionalidades:**
- Exportação para PDF (impressão)
- Exportação para Excel (CSV UTF-8)
- Filtros aplicados aos dados exportados
- Estatísticas incluídas nos relatórios

**Implementação:**

```javascript
// Exportar PDF
const exportToPDF = () => {
  const printWindow = window.open('', '_blank');
  const html = `<!DOCTYPE html>...`;  // HTML formatado
  printWindow.document.write(html);
  printWindow.print();
};

// Exportar Excel
const exportToExcel = () => {
  const csvContent = [headers, ...rows].join('\n');
  const BOM = '\uFEFF';  // UTF-8 BOM
  const blob = new Blob([BOM + csvContent], { 
    type: 'text/csv;charset=utf-8;' 
  });
  // Download automático
};
```

---

## 🔧 Troubleshooting

### Problemas Comuns

**1. Erro 405 Method Not Allowed**
- Causa: Frontend tentando acessar `/api` na mesma origem (serviço de frontend)
- Solução: Configurar `VITE_API_URL` para apontar para o backend

**2. CORS Error**
- Causa: Origem não permitida em `ALLOWED_ORIGINS`
- Solução: Adicionar domínio do frontend em `ALLOWED_ORIGINS`

**3. Token Expirado**
- Causa: JWT expirou após 8h
- Solução: Implementar refresh token automático

**4. Banco de Dados Offline**
- Causa: DATABASE_URL inválida ou PostgreSQL parado
- Solução: Verificar logs do Railway e reiniciar serviço

---

## 📝 Changelog

### Versão 1.0.0 (21/01/2026)

**Novas Funcionalidades:**
- ✅ Módulo completo de Registros de Enfermagem
- ✅ Exportação PDF e Excel no módulo Financeiro
- ✅ Reconstrução de todos os botões de ação (layout moderno)
- ✅ Sistema de tooltips em botões desktop
- ✅ Estados de loading em exclusões
- ✅ Confirmações personalizadas com nome do item

**Melhorias de UX:**
- ✅ Ícones aumentados de 16px para 18px
- ✅ Padding dos botões de p-2 para p-2.5
- ✅ Gradientes em hover para feedback visual
- ✅ Sombras em botões (shadow-sm hover:shadow-md)
- ✅ Melhor acessibilidade com aria-labels

**Páginas Atualizadas:**
- Pacientes
- Usuários
- Financeiro
- Empresas
- Agenda
- Evolução (Enfermagem)

---

## 🤝 Contribuindo

Para contribuir com o projeto:

1. Fork o repositório
2. Crie uma branch para sua feature (`git checkout -b feat/nova-feature`)
3. Commit suas mudanças (`git commit -m 'feat: Adiciona nova feature'`)
4. Push para a branch (`git push origin feat/nova-feature`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto está sob a licença MIT.

---

## 📞 Suporte

- **Repositório:** https://github.com/cristiano-superacao/prescrimed
- **Issues:** https://github.com/cristiano-superacao/prescrimed/issues
- **Railway:** https://railway.app

---

**Desenvolvido com ❤️ para a área da saúde**
