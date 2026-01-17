# 🏥 Prescrimed - Visão Geral do Sistema

> **Sistema de Prescrições Médicas Multi-Tenant**  
> © 2025-2026 Cristiano Superação. Todos os direitos reservados.

---

## 📊 Visão Executiva

O **Prescrimed** é uma solução completa de gestão de prescrições médicas desenvolvida com arquitetura moderna e escalável. O sistema suporta **três tipos de estabelecimentos** em uma única plataforma:

1. **🏥 Casa de Repouso** - Gestão de leitos, residentes e prescrições
2. **🐾 PetShop/Veterinária** - Cadastro de pets, tutores e atendimentos
3. **💪 Fisioterapia** - Agendamento de sessões, protocolos e evolução

---

## 🎯 Objetivos do Sistema

### Objetivos Primários
- ✅ Digitalizar e centralizar prescrições médicas
- ✅ Reduzir erros de prescrição através de validações
- ✅ Facilitar o acompanhamento do histórico de pacientes
- ✅ Permitir acesso remoto seguro aos dados
- ✅ Otimizar o tempo dos profissionais de saúde

### Objetivos Secundários
- ✅ Gerar relatórios e estatísticas de atendimento
- ✅ Controlar agendamentos e consultas
- ✅ Gerenciar múltiplas empresas em um único sistema
- ✅ Manter conformidade com LGPD
- ✅ Escalar horizontalmente conforme demanda

---

## 🏗️ Arquitetura do Sistema

### Visão Geral

```
┌─────────────────────────────────────────────────────────┐
│                    Cliente (Browser)                     │
│                  React 18 + TailwindCSS                  │
│                   Zustand + Axios                        │
└─────────────────────┬───────────────────────────────────┘
                      │ HTTPS (JWT Bearer)
                      │
┌─────────────────────▼───────────────────────────────────┐
│               Backend API (Node.js 18+)                  │
│                    Express 4.18                          │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Middleware Layer                                 │  │
│  │  - CORS, Helmet, Compression                      │  │
│  │  - JWT Authentication                             │  │
│  │  - Tenant Isolation                               │  │
│  │  - Request Validation                             │  │
│  └───────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Routes Layer (RESTful API)                       │  │
│  │  - /api/auth       - /api/empresas                │  │
│  │  - /api/usuarios   - /api/pacientes               │  │
│  │  - /api/prescricoes                               │  │
│  │  - /api/agendamentos                              │  │
│  │  - /api/casa-repouso (leitos)                     │  │
│  │  - /api/petshop (pets)                            │  │
│  │  - /api/fisioterapia (sessões)                    │  │
│  └───────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Business Logic Layer                             │  │
│  │  - Controllers                                    │  │
│  │  - Services                                       │  │
│  │  - Validations                                    │  │
│  └───────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Data Access Layer (Sequelize ORM)                │  │
│  │  - Models (Empresa, Usuario, Paciente, etc)       │  │
│  │  - Relations & Associations                       │  │
│  │  - Migrations & Seeders                           │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────┬───────────────────────────────────┘
                      │ SQL (TCP/IP)
                      │
┌─────────────────────▼───────────────────────────────────┐
│              Database Layer                              │
│  ┌──────────────────┐  ┌──────────────────┐             │
│  │   PostgreSQL 14+  │  │    SQLite 5.1    │            │
│  │    (Produção)    │  │ (Desenvolvimento) │            │
│  └──────────────────┘  └──────────────────┘             │
└─────────────────────────────────────────────────────────┘
```

### Camadas e Responsabilidades

#### 1. Frontend (Client Layer)
**Tecnologias:** React 18, Vite 5.4, TailwindCSS 3.4, Zustand 4.4, React Router 6.21

**Responsabilidades:**
- Interface do usuário responsiva e acessível
- Validação de formulários no lado do cliente
- Gerenciamento de estado local (Zustand)
- Comunicação com API via Axios
- Roteamento SPA (Single Page Application)
- Cache de dados otimizado

**Estrutura de Componentes:**
```
src/
├── components/          # Componentes reutilizáveis
│   ├── Header.jsx      # Cabeçalho da aplicação
│   ├── Sidebar.jsx     # Menu lateral
│   ├── Modal.jsx       # Modais genéricos
│   └── ...
├── pages/              # Páginas principais
│   ├── Dashboard.jsx   # Dashboard
│   ├── Pacientes.jsx   # Gestão de pacientes
│   ├── Prescricoes.jsx # Prescrições
│   └── ...
├── services/           # Serviços de API
│   ├── api.js         # Cliente Axios configurado
│   └── auth.service.js # Serviço de autenticação
├── store/             # Estado global Zustand
│   └── authStore.js   # Store de autenticação
└── utils/             # Utilitários e helpers
```

#### 2. Backend (API Layer)
**Tecnologias:** Node.js 18+, Express 4.18, JWT 9.0, bcryptjs 2.4, Helmet 7.1

**Responsabilidades:**
- Autenticação e autorização (JWT)
- Validação de dados de entrada
- Lógica de negócio
- Isolamento multi-tenant
- Controle de acesso baseado em roles
- Rate limiting e throttling
- Logging e monitoramento

**Fluxo de Requisição:**
```
Request → CORS → Helmet → Body Parser → Auth Middleware
   ↓
Tenant Isolation → Resource Ownership Check → Route Handler
   ↓
Controller → Service → Model (Sequelize) → Database
   ↓
Response ← Transform Data ← Error Handler ← Result
```

#### 3. Middleware Layer
**Implementações Principais:**

1. **authenticate** - Valida token JWT
   - Extrai token do header Authorization
   - Verifica assinatura e expiração
   - Injeta `req.user` com dados do usuário

2. **tenantIsolation** - Isola dados por empresa
   - Injeta `req.empresaId` baseado no usuário
   - Garante que queries filtrem por empresaId

3. **checkResourceOwnership** - Valida propriedade de recursos
   - Verifica se recurso pertence à empresa do usuário
   - Impede acesso cross-tenant

4. **requireRole** - Controle de acesso por role
   - Valida se usuário tem role necessária
   - Roles: superadmin, admin, nutricionista, atendente

#### 4. Data Layer (ORM + Database)
**Tecnologias:** Sequelize 6.37, PostgreSQL 14+, SQLite 5.1

**Models e Relacionamentos:**

```
Empresa (1) ────┬──── (N) Usuario
                ├──── (N) Paciente
                ├──── (N) Prescricao
                ├──── (N) Agendamento
                ├──── (N) CasaRepousoLeito
                ├──── (N) Pet
                └──── (N) SessaoFisio

Usuario (1) ────┬──── (N) Prescricao
                └──── (N) Agendamento

Paciente (1) ───┬──── (N) Prescricao
                └──── (N) Agendamento
```

---

## 🔐 Segurança

### Autenticação e Autorização

#### JWT (JSON Web Tokens)
- **Access Token:** Expira em 8h (configurável)
- **Refresh Token:** Expira em 30 dias
- **Algoritmo:** HS256
- **Claims:** userId, empresaId, role, email

#### Hierarquia de Roles
```
superadmin (nível 4)
    ↓ acesso total ao sistema
admin (nível 3)
    ↓ gestão completa da empresa
nutricionista (nível 2)
    ↓ prescrições e consultas
atendente (nível 1)
    ↓ cadastros básicos
```

### Proteções Implementadas

1. **SQL Injection** - Sequelize usa prepared statements
2. **XSS** - Sanitização de inputs, CSP headers via Helmet
3. **CSRF** - SameSite cookies, token validation
4. **DoS** - Rate limiting, request size limits
5. **Senhas** - Bcrypt com salt rounds = 10
6. **Headers HTTP** - Helmet (HSTS, noSniff, frameguard)
7. **CORS** - Whitelist de origens permitidas
8. **HTTPS** - TLS 1.2+ em produção

### Multi-Tenant Isolation

**Estratégia:** Shared database, isolated data

```sql
-- Toda query automaticamente filtrada por empresaId
SELECT * FROM pacientes WHERE empresaId = :empresaId;
INSERT INTO prescricoes (empresaId, ...) VALUES (:empresaId, ...);
```

**Garantias:**
- ✅ Middleware injeta empresaId em todas as queries
- ✅ Impossível acessar dados de outra empresa
- ✅ Superadmin pode acessar múltiplas empresas via query param
- ✅ Validação em camada de model e controller

---

## 📊 Modelos de Dados

### Core Models

#### Empresa
```javascript
{
  id: UUID,
  nome: String,
  cnpj: String (unique),
  tipoSistema: ENUM('casa-repouso', 'petshop', 'fisioterapia'),
  status: ENUM('ativa', 'inativa', 'suspensa'),
  configuracoes: JSON,
  createdAt, updatedAt
}
```

#### Usuario
```javascript
{
  id: UUID,
  empresaId: UUID (FK),
  nome: String,
  email: String (unique per empresa),
  senha: String (hashed),
  role: ENUM('superadmin', 'admin', 'nutricionista', 'atendente'),
  status: ENUM('ativo', 'inativo'),
  ultimoAcesso: Date,
  createdAt, updatedAt
}
```

#### Paciente
```javascript
{
  id: UUID,
  empresaId: UUID (FK),
  nome: String,
  cpf: String (unique per empresa),
  dataNascimento: Date,
  telefone: String,
  endereco: JSON,
  observacoes: Text,
  status: ENUM('ativo', 'inativo'),
  createdAt, updatedAt
}
```

#### Prescricao
```javascript
{
  id: UUID,
  empresaId: UUID (FK),
  pacienteId: UUID (FK),
  nutricionistaId: UUID (FK),
  tipo: ENUM('inicial', 'revisao', 'retorno'),
  itens: JSON [{
    alimento: String,
    quantidade: String,
    observacoes: String
  }],
  observacoes: Text,
  status: ENUM('ativa', 'inativa', 'cancelada'),
  createdAt, updatedAt
}
```

#### Agendamento
```javascript
{
  id: UUID,
  empresaId: UUID (FK),
  pacienteId: UUID (FK),
  usuarioId: UUID (FK),
  dataHora: DateTime,
  duracao: Integer (minutos),
  tipo: String,
  status: ENUM('agendado', 'confirmado', 'realizado', 'cancelado'),
  observacoes: Text,
  createdAt, updatedAt
}
```

### Módulos Específicos

#### CasaRepousoLeito (Casa de Repouso)
```javascript
{
  id: UUID,
  empresaId: UUID (FK),
  numero: String,
  andar: String,
  status: ENUM('disponivel', 'ocupado', 'manutencao'),
  observacoes: Text,
  createdAt, updatedAt
}
```

#### Pet (PetShop/Veterinária)
```javascript
{
  id: UUID,
  empresaId: UUID (FK),
  nome: String,
  especie: String,
  raca: String,
  idade: Integer,
  tutorNome: String,
  tutorTelefone: String,
  observacoes: Text,
  createdAt, updatedAt
}
```

#### SessaoFisio (Fisioterapia)
```javascript
{
  id: UUID,
  empresaId: UUID (FK),
  pacienteId: UUID (FK),
  dataHora: DateTime,
  protocolo: String,
  duracao: Integer (minutos),
  evolucao: Text,
  observacoes: Text,
  status: ENUM('agendada', 'realizada', 'cancelada'),
  createdAt, updatedAt
}
```

---

## 🚀 Fluxos de Uso

### Fluxo de Autenticação

```
1. Usuário acessa /login
2. Frontend envia { email, senha } → POST /api/auth/login
3. Backend valida credenciais (bcrypt.compare)
4. Gera accessToken (JWT 8h) + refreshToken (30d)
5. Retorna { token, refreshToken, user }
6. Frontend armazena tokens no localStorage
7. Todas requisições incluem header: Authorization: Bearer {token}
8. Quando token expira (401), frontend usa refreshToken → POST /api/auth/refresh
9. Backend valida refreshToken e gera novo accessToken
10. Frontend atualiza token e retenta requisição original
```

### Fluxo de Cadastro de Prescrição

```
1. Nutricionista acessa /prescricoes → clica "Nova Prescrição"
2. Seleciona paciente (lista filtrada por empresaId)
3. Preenche formulário com itens da prescrição
4. Frontend valida campos obrigatórios
5. Envia POST /api/prescricoes com dados
6. Backend:
   - Middleware authenticate → valida JWT
   - Middleware tenantIsolation → injeta empresaId
   - Controller valida dados
   - Verifica se paciente pertence à mesma empresa
   - Cria prescrição no banco
7. Retorna prescrição criada com status 201
8. Frontend atualiza lista e exibe toast de sucesso
```

### Fluxo Multi-Tenant

```
Empresa A (empresaId: UUID-A)
  ├── 10 usuários
  ├── 50 pacientes
  └── 200 prescrições
  
Empresa B (empresaId: UUID-B)
  ├── 5 usuários
  ├── 30 pacientes
  └── 100 prescrições

Usuario da Empresa A faz requisição:
  → Token JWT contém: { empresaId: UUID-A, ... }
  → Middleware injeta: req.empresaId = UUID-A
  → Query: SELECT * FROM prescricoes WHERE empresaId = 'UUID-A'
  → Resultado: Apenas 200 prescrições da Empresa A
  → Isolamento garantido! ✅
```

---

## 📈 Performance e Escalabilidade

### Otimizações Implementadas

1. **Frontend**
   - Code splitting automático (Vite)
   - Lazy loading de rotas
   - Memoização de componentes (React.memo)
   - Debounce em buscas
   - Cache de requisições GET

2. **Backend**
   - Compressão gzip/brotli
   - Connection pooling (PostgreSQL)
   - Índices no banco de dados
   - Paginação de resultados
   - Eager loading de relations (Sequelize)

3. **Database**
   - Índices em: empresaId, email, cpf, status
   - Foreign keys com ON DELETE CASCADE
   - Constraints para integridade

### Limites e Capacidade

| Recurso | Limite | Observação |
|---------|--------|------------|
| Requisições/min | 100 | Rate limit por IP |
| Tamanho de request | 10 MB | Body parser limit |
| Timeout de requisição | 30s | Configurable |
| Sessões simultâneas | Ilimitado | Stateless JWT |
| Empresas | Ilimitado | Multi-tenant |
| Usuários por empresa | Ilimitado | Soft limit: 100 |
| Pacientes por empresa | Ilimitado | Soft limit: 1000 |

---

## 🔧 Manutenção e Operação

### Monitoramento

**Logs:**
- Console logs em desenvolvimento (morgan 'dev')
- Structured logs em produção (JSON)
- Erros capturados com stack trace

**Health Checks:**
- `GET /health` - Status do servidor e database
- `GET /api/diagnostic/db-check` - Diagnóstico detalhado do DB

**Métricas:**
- Uptime do servidor
- Conexões ativas no pool do DB
- Taxa de requisições bem-sucedidas/falhadas

### Backup e Recovery

**Estratégia de Backup:**
1. Backup automático diário (Railway PostgreSQL)
2. Point-in-time recovery (PITR)
3. Retenção: 30 dias

**Disaster Recovery:**
1. Restore do backup mais recente
2. Replay de transaction logs
3. Validação de integridade
4. RTO (Recovery Time Objective): < 1h
5. RPO (Recovery Point Objective): < 15min

### Deployment

**Estratégia:** Blue-Green Deployment (Railway)

```
1. Build do código em ambiente staging
2. Testes automáticos (se configurados)
3. Deploy em instância nova (green)
4. Health check da nova instância
5. Switch de tráfego para green
6. Manter blue por 15min (rollback rápido)
7. Destruir blue após confirmação
```

**Zero Downtime:**
- Railway gerencia transição
- Conexões existentes são drenadas
- Novas conexões vão para nova instância

---

## 📱 Responsividade

### Breakpoints

```css
/* Mobile First */
default: 0-639px      /* Mobile */
sm: 640px            /* Large mobile */
md: 768px            /* Tablet */
lg: 1024px           /* Desktop */
xl: 1280px           /* Large desktop */
2xl: 1536px          /* Extra large */
```

### Adaptações por Dispositivo

**Mobile (< 640px):**
- Sidebar colapsada por padrão
- Menu hamburger
- Cards em coluna única
- Formulários full-width
- Touch targets 44px+

**Tablet (640px - 1024px):**
- Sidebar colapsável
- Grid 2 colunas
- Formulários otimizados
- Modais full-screen

**Desktop (> 1024px):**
- Sidebar fixa expandida
- Grid 3-4 colunas
- Formulários em modal
- Tooltips e hover states

---

## 🎓 Boas Práticas Implementadas

### Código

- ✅ ES Modules (import/export)
- ✅ Async/await (não callbacks)
- ✅ Error handling consistente
- ✅ Nomenclatura clara (camelCase, PascalCase)
- ✅ Comentários em pontos críticos
- ✅ DRY (Don't Repeat Yourself)
- ✅ SOLID principles

### Git

- ✅ Commits semânticos (feat, fix, docs, chore)
- ✅ Mensagens descritivas
- ✅ Branches por feature
- ✅ Pull requests com review
- ✅ .gitignore completo

### Segurança

- ✅ Nunca commitar secrets (.env no .gitignore)
- ✅ Validação de inputs
- ✅ Sanitização de outputs
- ✅ Princípio do menor privilégio
- ✅ Defense in depth

---

## 📚 Recursos Adicionais

### Documentação
- [README_COMPLETO.md](README_COMPLETO.md) - Documentação completa
- [DEPLOY_RAILWAY_AGORA.md](DEPLOY_RAILWAY_AGORA.md) - Guia de deploy
- [DOCUMENTACAO_INDICE.md](DOCUMENTACAO_INDICE.md) - Índice de navegação

### Scripts Úteis
```bash
# Desenvolvimento
npm run dev              # Backend em modo watch
npm run client           # Frontend em modo dev
npm run dev:full         # Backend + Frontend simultâneos

# Build
npm run build            # Build do frontend
npm run build:full       # Install deps + build

# Produção
npm start                # Inicia servidor
npm run seed:demo        # Seed de dados demo

# Railway
railway login            # Login no Railway
railway up               # Deploy
railway logs             # Ver logs
```

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/NovaFeature`)
3. Commit suas mudanças (`git commit -m 'feat: Adiciona NovaFeature'`)
4. Push para a branch (`git push origin feature/NovaFeature`)
5. Abra um Pull Request

---

<div align="center">

**© 2025-2026 Cristiano Superação - Prescrimed. Todos os direitos reservados.**

*Sistema de Prescrições Médicas Multi-Tenant*

[GitHub](https://github.com/cristiano-superacao/prescrimed) • [Issues](https://github.com/cristiano-superacao/prescrimed/issues)

</div>
