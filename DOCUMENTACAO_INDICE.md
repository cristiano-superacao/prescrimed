# 📚 Índice de Documentação - Prescrimed

> **Sistema de Prescrições Médicas Multi-Tenant**  
> © 2025-2026 Cristiano Superação. Todos os direitos reservados.

---

## 📖 Documentação Principal

### 🎯 Início Rápido
- **[README_COMPLETO.md](README_COMPLETO.md)** - Documentação completa do sistema
  - Visão geral do projeto
  - Características e funcionalidades
  - Guia de instalação local
  - Tecnologias utilizadas
  - Scripts disponíveis

- **[LICENSE](LICENSE)** - Licença MIT do projeto

---

## 🚀 Deploy e Configuração

### Railway (Backend + Frontend Unificado)
- **[DEPLOY_RAILWAY_AGORA.md](DEPLOY_RAILWAY_AGORA.md)** - Guia completo de deploy no Railway
  - Preparação local
  - Configuração do PostgreSQL
  - Variáveis de ambiente
  - Deploy via CLI
  - Validação pós-deploy

- **[.env.railway](.env.railway)** - Template de variáveis para Railway
- **[.env.production.example](.env.production.example)** - Exemplo de env de produção
- **[railway.json](railway.json)** - Configuração do build Railway
- **[nixpacks.toml](nixpacks.toml)** - Configuração Nixpacks

### Netlify (Frontend Separado - Opcional)
- **[netlify.toml](netlify.toml)** - Configuração do frontend no Netlify
- **[client/.env.railway](client/.env.railway)** - Variáveis do frontend

---

## 🛠️ Scripts e Ferramentas

### PowerShell
- **[scripts/check-health.ps1](scripts/check-health.ps1)** - Validar health do servidor
- **[scripts/configure-railway.ps1](scripts/configure-railway.ps1)** - Setup automático Railway
- **[scripts/seed-demo-data.js](scripts/seed-demo-data.js)** - Seed de dados demo

### Batch
- **[INICIAR_SISTEMA_COMPLETO.bat](INICIAR_SISTEMA_COMPLETO.bat)** - Iniciar backend + frontend
- **[PARAR_SISTEMA.bat](PARAR_SISTEMA.bat)** - Parar todos os processos

---

## 🏗️ Arquitetura do Sistema

### Backend (Node.js + Express)

#### Rotas API
| Rota | Arquivo | Descrição |
|------|---------|-----------|
| `/api/auth/*` | [routes/auth.routes.js](routes/auth.routes.js) | Autenticação (login, registro, refresh) |
| `/api/usuarios/*` | [routes/usuario.routes.js](routes/usuario.routes.js) | Gestão de usuários |
| `/api/empresas/*` | [routes/empresa.routes.js](routes/empresa.routes.js) | Gestão de empresas |
| `/api/pacientes/*` | [routes/paciente.routes.js](routes/paciente.routes.js) | Gestão de pacientes |
| `/api/prescricoes/*` | [routes/prescricao.routes.js](routes/prescricao.routes.js) | Prescrições médicas |
| `/api/agendamentos/*` | [routes/agendamento.routes.js](routes/agendamento.routes.js) | Sistema de agendamentos |
| `/api/dashboard/*` | [routes/dashboard.routes.js](routes/dashboard.routes.js) | Estatísticas e métricas |
| `/api/casa-repouso/*` | [routes/casa-repouso.routes.js](routes/casa-repouso.routes.js) | Gestão de leitos |
| `/api/petshop/*` | [routes/petshop.routes.js](routes/petshop.routes.js) | Cadastro de pets |
| `/api/fisioterapia/*` | [routes/fisioterapia.routes.js](routes/fisioterapia.routes.js) | Sessões de fisioterapia |
| `/api/diagnostic/*` | [routes/diagnostic.routes.js](routes/diagnostic.routes.js) | Diagnóstico do sistema |

#### Models (Sequelize)
| Model | Arquivo | Tabela |
|-------|---------|--------|
| Empresa | [models/Empresa.js](models/Empresa.js) | `empresas` |
| Usuario | [models/Usuario.js](models/Usuario.js) | `usuarios` |
| Paciente | [models/Paciente.js](models/Paciente.js) | `pacientes` |
| Prescricao | [models/Prescricao.js](models/Prescricao.js) | `prescricoes` |
| Agendamento | [models/Agendamento.js](models/Agendamento.js) | `agendamentos` |
| CasaRepousoLeito | [models/CasaRepousoLeito.js](models/CasaRepousoLeito.js) | `cr_leitos` |
| Pet | [models/Pet.js](models/Pet.js) | `petshop_pets` |
| SessaoFisio | [models/SessaoFisio.js](models/SessaoFisio.js) | `fisio_sessoes` |

#### Middleware
| Middleware | Arquivo | Função |
|------------|---------|--------|
| authenticate | [middleware/auth.middleware.js](middleware/auth.middleware.js) | Validação JWT |
| tenantIsolation | [middleware/auth.middleware.js](middleware/auth.middleware.js) | Isolamento multi-tenant |
| checkResourceOwnership | [middleware/auth.middleware.js](middleware/auth.middleware.js) | Validação de propriedade |
| requireRole | [middleware/auth.middleware.js](middleware/auth.middleware.js) | Controle de acesso por role |
| validateRequest | [middleware/validate.middleware.js](middleware/validate.middleware.js) | Validação de dados |

### Frontend (React + Vite)

#### Páginas Principais
- **[client/src/pages/Login.jsx](client/src/pages/Login.jsx)** - Tela de login
- **[client/src/pages/Register.jsx](client/src/pages/Register.jsx)** - Registro de empresas
- **[client/src/pages/Dashboard.jsx](client/src/pages/Dashboard.jsx)** - Dashboard principal
- **[client/src/pages/Pacientes.jsx](client/src/pages/Pacientes.jsx)** - Gestão de pacientes
- **[client/src/pages/Prescricoes.jsx](client/src/pages/Prescricoes.jsx)** - Prescrições
- **[client/src/pages/Agenda.jsx](client/src/pages/Agenda.jsx)** - Sistema de agendamentos
- **[client/src/pages/Usuarios.jsx](client/src/pages/Usuarios.jsx)** - Gestão de usuários
- **[client/src/pages/Empresas.jsx](client/src/pages/Empresas.jsx)** - Gestão de empresas
- **[client/src/pages/Configuracoes.jsx](client/src/pages/Configuracoes.jsx)** - Configurações

#### Serviços
- **[client/src/services/api.js](client/src/services/api.js)** - Cliente HTTP Axios
- **[client/src/services/auth.service.js](client/src/services/auth.service.js)** - Serviço de autenticação

---

## 🔧 Configuração

### Desenvolvimento Local
```bash
# Backend
npm install
cp .env.example .env
npm run dev

# Frontend
cd client
npm install
npm run dev
```

### Variáveis de Ambiente

#### Backend (.env)
```env
NODE_ENV=development
PORT=3000
JWT_SECRET=dev-secret-change-me
JWT_REFRESH_SECRET=dev-refresh-secret-change-me
SESSION_TIMEOUT=8h

# PostgreSQL Local
PGHOST=localhost
PGPORT=5432
PGUSER=postgres
PGPASSWORD=postgres
PGDATABASE=prescrimed

# Railway PostgreSQL
# DATABASE_URL=postgresql://user:pass@host:port/database
```

#### Frontend (client/.env.development)
```env
VITE_API_URL=http://localhost:3000/api
```

---

## 📊 Estrutura de Diretórios

```
prescrimed/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/    # Componentes reutilizáveis
│   │   ├── pages/         # Páginas principais
│   │   ├── services/      # Serviços e API
│   │   ├── store/         # Zustand stores
│   │   └── utils/         # Utilidades
│   ├── public/            # Assets estáticos
│   └── package.json
├── config/                 # Configurações
│   └── database.js        # Config Sequelize
├── middleware/             # Express middlewares
│   ├── auth.middleware.js
│   └── validate.middleware.js
├── models/                 # Models Sequelize
│   ├── index.js
│   ├── Empresa.js
│   ├── Usuario.js
│   ├── Paciente.js
│   ├── Prescricao.js
│   ├── Agendamento.js
│   ├── CasaRepousoLeito.js
│   ├── Pet.js
│   └── SessaoFisio.js
├── routes/                 # Rotas Express
│   ├── index.js
│   ├── auth.routes.js
│   ├── usuario.routes.js
│   ├── empresa.routes.js
│   ├── paciente.routes.js
│   ├── prescricao.routes.js
│   ├── agendamento.routes.js
│   ├── dashboard.routes.js
│   ├── casa-repouso.routes.js
│   ├── petshop.routes.js
│   ├── fisioterapia.routes.js
│   └── diagnostic.routes.js
├── scripts/                # Scripts utilitários
│   ├── check-health.ps1
│   ├── configure-railway.ps1
│   └── seed-demo-data.js
├── utils/                  # Funções auxiliares
├── .env.example           # Template de variáveis
├── .env.railway           # Template Railway
├── .env.production.example # Template produção
├── server.js              # Servidor Express
├── package.json           # Dependências Node
├── railway.json           # Config Railway
├── nixpacks.toml          # Config Nixpacks
├── netlify.toml           # Config Netlify
└── README_COMPLETO.md     # Documentação completa
```

---

## 🎓 Guias e Tutoriais

### Para Desenvolvedores
1. **[README_COMPLETO.md](README_COMPLETO.md)** - Leia primeiro
2. **[DEPLOY_RAILWAY_AGORA.md](DEPLOY_RAILWAY_AGORA.md)** - Deploy em produção
3. Scripts PowerShell em `scripts/` - Automação

### Para Administradores
1. Configure variáveis de ambiente (Railway Dashboard)
2. Execute seed de dados: `npm run seed:demo`
3. Valide health: `powershell scripts/check-health.ps1 -Domain seu-dominio.up.railway.app`

---

## 🐛 Troubleshooting

### Backend não inicia
- Verifique porta em uso: `netstat -ano | findstr :3000`
- O sistema tem fallback automático (3000 → 3001 → 3002...)

### Erro de CORS
- Adicione origem em `.env`: `ALLOWED_ORIGINS=https://seu-dominio.com`
- Backend já suporta `RAILWAY_PUBLIC_DOMAIN` automaticamente

### Database connection refused
- **Local**: Verifique PostgreSQL rodando ou deixe usar SQLite
- **Railway**: Confirme plugin PostgreSQL anexado e `DATABASE_URL` configurada

### Frontend não conecta à API
- Verifique `VITE_API_URL` no frontend
- Em produção unificada (Railway), usa `/api` relativo automaticamente

---

## 🤝 Contribuindo

1. Fork o projeto
2. Crie sua feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👨‍💻 Autor

**Cristiano Superação**

- GitHub: [@cristiano-superacao](https://github.com/cristiano-superacao)
- Repositório: [prescrimed](https://github.com/cristiano-superacao/prescrimed)

---

## 📞 Suporte

Para questões e suporte, abra uma [issue](https://github.com/cristiano-superacao/prescrimed/issues) no GitHub.

---

<div align="center">

**© 2025-2026 Cristiano Superação - Prescrimed. Todos os direitos reservados.**

*Sistema de Prescrições Médicas Multi-Tenant*

</div>
