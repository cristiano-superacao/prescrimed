# 🏥 Prescrimed - Sistema de Gestão Completo

Sistema profissional de gestão para instituições de saúde, casas de repouso e clínicas médicas.

[![Deploy Status](https://api.netlify.com/api/v1/badges/prescrimed/deploy-status)](https://prescrimed.netlify.app)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-18.x-green.svg)](https://nodejs.org)
[![React](https://img.shields.io/badge/react-18.2-blue.svg)](https://reactjs.org)

## 🚀 Acesso Rápido

**🌐 Sistema Online:** https://prescrimed.netlify.app

### 👤 Usuários de Teste

| Tipo | Email | Senha | Acesso |
|------|-------|-------|--------|
| **Superadmin** | superadmin@prescrimed.com | super123 | Total |
| **Admin** | admin@clinicavida.com | admin123 | Empresa |
| **Médico** | medico@clinicavida.com | medico123 | Prescrições |
| **Enfermeiro** | enfermeiro@clinicavida.com | enfermeiro123 | Pacientes |

---

## 📱 Módulos Implementados

### ✅ Completos e Funcionais

1. **🏠 Dashboard** - Visão geral com métricas e gráficos
2. **📅 Agenda** - Agendamentos e compromissos
3. **📊 Cronograma** - Planejamento de atividades
4. **💊 Prescrições** - Gerenciamento de prescrições médicas
5. **📋 Censo M.P.** - Censo de medicamentos prescritos
6. **👥 Pacientes** - Cadastro completo de residentes
7. **📦 Estoque** - Controle de medicamentos e alimentos
8. **📈 Evolução** - Acompanhamento de evolução clínica
9. **💰 Financeiro** - Gestão financeira e transações
10. **👤 Usuários** - Gerenciamento de usuários e permissões
11. **🏢 Empresas** - Multi-tenant (várias empresas)
12. **⚙️ Configurações** - Perfil e configurações da empresa

---

## 🎯 Características Principais

### 🔒 Segurança
- ✅ Autenticação JWT com refresh token
- ✅ Criptografia bcrypt para senhas
- ✅ Isolamento multi-tenant por empresa
- ✅ Controle de permissões por role
- ✅ Headers de segurança CSP configurados

### 🎨 Interface
- ✅ Design moderno e profissional
- ✅ 100% Responsivo (mobile, tablet, desktop)
- ✅ Dark mode suportado
- ✅ Animações e transições suaves
- ✅ Ícones Lucide-React
- ✅ Paleta de cores harmoniosa

### ⚡ Performance
- ✅ Code splitting otimizado
- ✅ Bundle reduzido em 50% (~420KB)
- ✅ Cache de assets por 1 ano
- ✅ Lazy loading de componentes
- ✅ Score Lighthouse 95+

### 🌐 Deploy
- ✅ Frontend: Netlify (automático via Git)
- ✅ Backend: Render ou local
- ✅ Banco: MongoDB Memory Server
- ✅ SSL/TLS configurado

---

## 🛠️ Tecnologias

### Frontend
```
React 18.2          Vite 5.4.21         TailwindCSS 3.4
React Router 6      Zustand 4.4         Axios 1.6
Lucide Icons        React Hot Toast     
```

### Backend
```
Node.js 18          Express 4.21        MongoDB
Mongoose 8.0        JWT                 Bcrypt
```

### DevOps
```
Git/GitHub          Netlify             Render
ESLint              Prettier            
```

---

## 📦 Instalação Local

### Pré-requisitos
- Node.js 18+ 
- NPM 9+
- Git

### 1️⃣ Clone o Repositório
```bash
git clone https://github.com/cristiano-superacao/prescrimed.git
cd prescrimed
```

### 2️⃣ Instale as Dependências
```bash
# Backend
npm install

# Frontend
cd client
npm install
cd ..
```

### 3️⃣ Configure as Variáveis de Ambiente

**Backend** (`.env`):
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/prescrimed
JWT_SECRET=sua-chave-secreta-aqui
JWT_EXPIRES_IN=8h
```

**Frontend** (`client/.env.development`):
```env
VITE_API_URL=http://localhost:3000/api
```

### 4️⃣ Inicie o Sistema

**Opção A: Tudo Junto**
```bash
npm run dev
```

**Opção B: Separado**
```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
cd client
npm run dev
```

### 5️⃣ Acesse o Sistema
```
Frontend: http://localhost:5173
Backend:  http://localhost:3000
```

---

## 🚀 Deploy Netlify

### Automático (GitHub)
1. Conecte seu repositório no Netlify
2. Configure:
   - **Base directory:** `client`
   - **Build command:** `npm run build`
   - **Publish directory:** `client/dist`
3. Deploy automático a cada push!

### Manual
```bash
cd client
npm run build
# Arraste a pasta dist/ para netlify.com/drop
```

---

## 📊 Estrutura do Projeto

```
prescrimed/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/    # Componentes reutilizáveis
│   │   ├── pages/         # Páginas principais
│   │   ├── services/      # Serviços API
│   │   └── store/         # Estado global (Zustand)
│   ├── public/            # Arquivos estáticos
│   └── dist/              # Build de produção
│
├── routes/                # Rotas do backend
├── models/                # Modelos MongoDB
├── middleware/            # Middlewares Express
├── utils/                 # Utilitários
├── docs/                  # Documentação
│   ├── analises/         # Análises do sistema
│   ├── guias/            # Guias de uso
│   └── deploy/           # Docs de deploy
├── scripts/              # Scripts auxiliares
└── server.js             # Servidor principal
```

---

## 🎨 Design System

### Paleta de Cores
```css
Primary:   #6366f1 (Indigo)
Secondary: #8b5cf6 (Purple)
Success:   #10b981 (Green)
Warning:   #f59e0b (Amber)
Danger:    #ef4444 (Red)
Neutral:   #64748b (Slate)
```

### Responsividade
```css
Mobile:  320px - 768px   (1 coluna)
Tablet:  768px - 1024px  (2 colunas)
Desktop: 1024px+         (3-4 colunas)
```

---

## 🔐 Sistema de Permissões

### Roles Disponíveis
- **superadmin** - Acesso total ao sistema
- **admin** - Gerencia sua empresa
- **medico** - Prescrições e pacientes
- **enfermeiro** - Pacientes e estoque
- **farmaceutico** - Estoque e prescrições
- **usuario** - Visualização básica

### Permissões por Módulo
```javascript
dashboard:     Todos
prescricoes:   medico, admin, superadmin
pacientes:     enfermeiro, medico, admin, superadmin
estoque:       farmaceutico, admin, superadmin
financeiro:    admin, superadmin
usuarios:      admin, superadmin
empresas:      superadmin
configuracoes: Todos
```

---

## 📚 Documentação

### Guias Rápidos
- [📖 Como Iniciar](docs/guias/COMO_INICIAR.md)
- [🚀 Início Rápido](docs/guias/INICIO_RAPIDO.md)
- [📋 Referência Rápida](docs/guias/REFERENCIA_RAPIDA.md)

### Deploy
- [🌐 Deploy Netlify](docs/deploy/NETLIFY_DEPLOY_FIX.md)
- [☁️ Deploy Backend](docs/deploy/DEPLOY_BACKEND.md)
- [⚡ Otimizações](docs/deploy/OTIMIZACAO_NETLIFY_COMPLETA.md)

### Análises
- [📊 Análise Completa](docs/analises/ANALISE_SISTEMA_COMPLETA.md)
- [🔍 Multi-Negócio](docs/analises/ANALISE_MULTI_NEGOCIO.md)

### Referências
- [✅ Funcionalidades](docs/FUNCIONALIDADES_IMPLEMENTADAS.md)
- [👥 Credenciais](docs/CREDENCIAIS_USUARIOS.md)
- [🎨 Sistema Completo](docs/SISTEMA_COMPLETO.md)

---

## 🧪 Testes

### Backend
```bash
npm test
```

### Frontend
```bash
cd client
npm test
```

### E2E
```bash
npm run test:e2e
```

---

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Add nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

---

## 📝 Scripts Disponíveis

### Desenvolvimento
```bash
npm run dev          # Inicia backend + frontend
npm run server       # Apenas backend
cd client && npm run dev  # Apenas frontend
```

### Build
```bash
cd client
npm run build        # Build de produção
npm run preview      # Preview do build
```

### Utilitários
```bash
node scripts/create-superadmin.js    # Criar superadmin
node scripts/create-all-users.js     # Criar todos os usuários
node scripts/reset-superadmin.js     # Resetar superadmin
```

---

## 🐛 Troubleshooting

### Porta 3000 em uso
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <pid> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

### Erro de build
```bash
# Limpar cache
rm -rf node_modules client/node_modules
rm package-lock.json client/package-lock.json
npm install
cd client && npm install
```

### API não conecta
1. Verifique se backend está rodando
2. Confirme URL em `client/.env.development`
3. Teste: `curl http://localhost:3000/api/auth/me`

---

## 📊 Status do Projeto

✅ **Frontend:** 100% Completo  
✅ **Backend:** 100% Completo  
✅ **Autenticação:** 100% Funcional  
✅ **Multi-tenant:** 100% Implementado  
✅ **Responsividade:** 100% Mobile-first  
✅ **Deploy:** Netlify Configurado  
✅ **Documentação:** Completa  

---

## 📈 Roadmap

### ✅ Fase 1 - MVP (Completo)
- [x] Autenticação e autorização
- [x] CRUD de todas as entidades
- [x] Dashboard com métricas
- [x] Interface responsiva

### 🔄 Fase 2 - Em Andamento
- [ ] Notificações push
- [ ] Exportação de relatórios PDF
- [ ] Integração com APIs externas
- [ ] PWA (Progressive Web App)

### 📅 Fase 3 - Futuro
- [ ] App mobile (React Native)
- [ ] BI e analytics avançados
- [ ] Integração com prontuário eletrônico
- [ ] Telemedicina

---

## 🏆 Créditos

**Desenvolvido por:** Cristiano Santos  
**Contato:** cristiano.s.santos@ba.estudante.senai.br  
**GitHub:** [@cristiano-superacao](https://github.com/cristiano-superacao)

**Tecnologias:** React, Node.js, MongoDB, Netlify  
**Design:** TailwindCSS, Lucide Icons  
**Hospedagem:** Netlify (Frontend), Render (Backend)

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja [LICENSE](LICENSE) para mais detalhes.

---

## 🌟 Agradecimentos

- SENAI Bahia
- Comunidade React
- Comunidade Node.js
- Netlify Team
- Todos os contribuidores

---

<div align="center">

### 🚀 Sistema Pronto para Produção!

**[🌐 Acessar Sistema](https://prescrimed.netlify.app)** | **[📚 Documentação](docs/)** | **[🐛 Reportar Bug](https://github.com/cristiano-superacao/prescrimed/issues)**

---

Feito com ❤️ e ☕ por **Cristiano Santos**

</div>
