# 🏥 Prescrimed - Sistema Completo

Sistema de gestão de prescrições médicas com arquitetura multi-tenant, desenvolvido com React + Node.js + MongoDB.

---

## 🚀 Início Rápido

### 1️⃣ Instalar Dependências
```bash
npm install
cd client && npm install && cd ..
```

### 2️⃣ Iniciar o Sistema
```batch
# Clique duas vezes em:
INICIAR_SISTEMA_COMPLETO.bat

# Ou execute manualmente:
npm run server           # Terminal 1 - Backend
cd client && npm run dev # Terminal 2 - Frontend
```

### 3️⃣ Acessar
- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:3000
- **Health:** http://localhost:3000/health

### 4️⃣ Login
- **Email:** superadmin@prescrimed.com
- **Senha:** super123

---

## 📚 Documentação

| Documento | Descrição |
|-----------|-----------|
| **[GUIA_USO_RAPIDO.md](GUIA_USO_RAPIDO.md)** | Como usar o sistema diariamente |
| **[SOLUCAO_ERROS_API.md](SOLUCAO_ERROS_API.md)** | Resolver erros 404/400 |
| **[DIAGNOSTICO_SISTEMA.bat](DIAGNOSTICO_SISTEMA.bat)** | Verificar status do sistema |
| **[docs/MANUAL_COMPLETO_SISTEMA.md](docs/MANUAL_COMPLETO_SISTEMA.md)** | Manual completo |

---

## 🔧 Scripts Disponíveis

| Script | Comando | Descrição |
|--------|---------|-----------|
| **Iniciar Tudo** | `INICIAR_SISTEMA_COMPLETO.bat` | Inicia backend + frontend |
| **Parar Tudo** | `PARAR_SISTEMA.bat` | Para todos os processos |
| **Diagnóstico** | `DIAGNOSTICO_SISTEMA.bat` | Verifica problemas |
| **Backend** | `npm run server` | Apenas backend |
| **Frontend** | `cd client && npm run dev` | Apenas frontend |
| **Dev Full** | `npm run dev:full` | Backend + Frontend (dev mode) |

---

## 🛠️ Tecnologias

### Backend
- **Node.js** + Express
- **MongoDB** (Memory Server para dev)
- **JWT** para autenticação
- **Mongoose** ODM
- **Bcrypt** para senhas

### Frontend
- **React** 18
- **Vite** 
- **TailwindCSS** 3
- **React Router** 6
- **Axios** para API
- **Lucide Icons**

---

## 📁 Estrutura do Projeto

```
prescrimed/
├── client/                    # Frontend React
│   ├── src/
│   │   ├── components/       # Componentes reutilizáveis
│   │   ├── pages/            # Páginas da aplicação
│   │   ├── services/         # Serviços de API
│   │   └── store/            # Estado global
│   └── package.json
├── routes/                    # Rotas da API
│   ├── auth.routes.js
│   ├── usuario.routes.js
│   ├── paciente.routes.js
│   ├── prescricao.routes.js
│   ├── agendamento.routes.js
│   └── ...
├── models/                    # Modelos do MongoDB
│   ├── Usuario.js
│   ├── Paciente.js
│   ├── Prescricao.js
│   └── ...
├── middleware/                # Middlewares Express
│   └── auth.middleware.js
├── utils/                     # Utilitários
│   └── seed.js               # Seed inicial do banco
├── scripts/                   # Scripts auxiliares
│   ├── INICIAR_SISTEMA_COMPLETO.bat
│   ├── DIAGNOSTICO_SISTEMA.bat
│   └── PARAR_SISTEMA.bat
├── server.js                  # Servidor principal
└── package.json
```

---

## ✨ Funcionalidades

### 🏢 Multi-tenancy
- Suporte a múltiplas empresas/clínicas
- Isolamento completo de dados
- Gestão centralizada

### 👥 Gestão de Usuários
- Diferentes perfis (Admin, Médico, Nutricionista, etc.)
- Permissões granulares
- Autenticação segura (JWT)

### 🩺 Prescrições
- Criação de prescrições médicas
- Controle de medicamentos e alimentos
- Histórico completo

### 📅 Agenda
- Calendário de consultas
- Visualização mensal/semanal/diária
- Sincronização em tempo real

### 💊 Estoque
- Controle de medicamentos
- Movimentações de entrada/saída
- Alertas de estoque baixo

### 💰 Financeiro
- Controle de receitas e despesas
- Relatórios financeiros
- Dashboard analítico

---

## 🔍 Resolução de Problemas

### ❌ Erros 404 nas chamadas de API

**Causa:** Backend não está rodando

**Solução:**
```batch
1. PARAR_SISTEMA.bat
2. DIAGNOSTICO_SISTEMA.bat
3. INICIAR_SISTEMA_COMPLETO.bat
```

**Leia:** [SOLUCAO_ERROS_API.md](SOLUCAO_ERROS_API.md)

### ⚠️ "Cannot find module"

**Causa:** Dependências não instaladas

**Solução:**
```bash
npm install
cd client && npm install
```

### 🔴 Alerta "Backend Offline"

**Causa:** Servidor não está respondendo

**Solução:**
1. Execute `DIAGNOSTICO_SISTEMA.bat`
2. Verifique se a porta 3000 está livre
3. Inicie com `INICIAR_SISTEMA_COMPLETO.bat`

---

## 🎯 Variáveis de Ambiente

Crie um arquivo `.env` na raiz (opcional):

```env
# Porta do servidor
PORT=3000

# MongoDB (deixe vazio para usar Memory Server)
MONGODB_URI=

# JWT Secret
JWT_SECRET=sua-chave-secreta-super-segura

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Ambiente
NODE_ENV=development
```

---

## 🔐 Segurança

- ✅ Autenticação JWT com refresh tokens
- ✅ Senhas criptografadas (bcrypt)
- ✅ CORS configurado
- ✅ Helmet para headers de segurança
- ✅ Rate limiting (em produção)
- ✅ Validação de dados (express-validator)

---

## 📊 MongoDB Memory Server

Por padrão, o sistema usa **MongoDB Memory Server** para desenvolvimento:

**Vantagens:**
- ⚡ Muito rápido
- 🔧 Não precisa instalar MongoDB
- 🧹 Dados limpos a cada reinício

**Desvantagens:**
- ❌ Dados não persistem
- 💾 Apenas para desenvolvimento

**Para usar MongoDB real:**
1. Configure `MONGODB_URI` no `.env`
2. Reinicie o backend

---

## 🚀 Deploy

### Netlify (Frontend)
```bash
cd client
npm run build
# Deploy a pasta client/dist
```

### Railway/Render (Backend)
```bash
# Configure as variáveis de ambiente
MONGODB_URI=sua-connection-string
JWT_SECRET=sua-chave-secura

# O servidor iniciará automaticamente com:
npm start
```

**Docs de Deploy:**
- [DEPLOY_RAPIDO.md](DEPLOY_RAPIDO.md)
- [NETLIFY_CHECKLIST.md](NETLIFY_CHECKLIST.md)

---

## 📝 Credenciais de Teste

Após iniciar o sistema, use:

| Perfil | Email | Senha |
|--------|-------|-------|
| **Super Admin** | superadmin@prescrimed.com | super123 |
| Admin | admin@prescrimed.com | admin123 |
| Médico | medico@prescrimed.com | medico123 |
| Nutricionista | nutri@prescrimed.com | nutri123 |

---

## 🆘 Suporte

**Problema com erros 404/400?**
→ [SOLUCAO_ERROS_API.md](SOLUCAO_ERROS_API.md)

**Como usar o sistema?**
→ [GUIA_USO_RAPIDO.md](GUIA_USO_RAPIDO.md)

**Sistema não inicia?**
→ Execute `DIAGNOSTICO_SISTEMA.bat`

**Documentação completa?**
→ [docs/MANUAL_COMPLETO_SISTEMA.md](docs/MANUAL_COMPLETO_SISTEMA.md)

---

## 📄 Licença

MIT License - Veja [LICENSE](LICENSE) para detalhes

---

## ✅ Checklist Rápido

Antes de começar, verifique:

- [ ] Node.js 16+ instalado (`node -v`)
- [ ] NPM instalado (`npm -v`)
- [ ] Dependências instaladas (`npm install`)
- [ ] Porta 3000 livre
- [ ] Porta 5173 livre

**Iniciar:**
```
✅ INICIAR_SISTEMA_COMPLETO.bat
⏳ Aguardar 10 segundos
🌐 Acessar http://localhost:5173
👤 Login: superadmin@prescrimed.com / super123
```

---

💡 **Dica:** Mantenha os terminais do backend e frontend abertos enquanto usa o sistema!

🎉 **Bom uso!**
