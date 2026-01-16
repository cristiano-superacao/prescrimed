# 🏥 Prescrimed - Sistema de Prescrições Médicas

Sistema completo de gestão de prescrições médicas **multi-tenant** com PostgreSQL, autenticação JWT e interface moderna.

## ✨ Características

- 🏢 **Multi-tenant**: Isolamento completo por empresa
- 🔐 **Segurança**: JWT, bcrypt, CORS, Helmet
- ⚡ **Performance**: Compressão, cache, otimizações
- 📱 **Responsivo**: Interface adaptável (mobile-first)
- 🎨 **Moderno**: React + Vite + Tailwind CSS
- 🗄️ **PostgreSQL**: Banco robusto com Sequelize ORM

## 🚀 Início Rápido

```bash
# Clonar repositório
git clone <repo-url>
cd prescrimed-main

# Backend
npm install
cp .env.example .env
# Configurar .env com PostgreSQL
npm run server

# Frontend (outro terminal)
cd client
npm install
npm run dev
```

Acesse: http://localhost:5173

## 📚 Documentação

- [Guia de Deploy](DEPLOY.md) - Configuração completa Railway/Netlify/Render
- [Documentação API](docs/DOCUMENTATION.md) - Endpoints e exemplos
- [Manual do Sistema](docs/MANUAL_COMPLETO_SISTEMA.md) - Guia do usuário

## 🏗️ Estrutura do Projeto

```
prescrimed/
├── server.js              # Backend principal
├── models/                # Modelos Sequelize
│   ├── Usuario.js
│   ├── Empresa.js
│   ├── Paciente.js
│   └── Prescricao.js
├── routes/                # Rotas da API
│   ├── auth.routes.js
│   ├── usuario.routes.js
│   ├── empresa.routes.js
│   ├── paciente.routes.js
│   └── prescricao.routes.js
├── client/                # Frontend React
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── store/
│   └── dist/              # Build de produção
└── WEB/                   # Landing page estática
```

## 🔑 Credenciais Padrão

Ver [docs/CREDENCIAIS_USUARIOS.md](docs/CREDENCIAIS_USUARIOS.md)

## 🛠️ Tecnologias

**Backend**
- Node.js + Express
- PostgreSQL + Sequelize
- JWT + bcrypt
- Helmet + CORS

**Frontend**
- React 18
- Vite
- TailwindCSS
- Zustand
- React Router
- Axios

## 📦 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Backend apenas
npm run client           # Frontend apenas
npm run dev:full         # Backend + Frontend

# Produção
npm run build            # Build frontend
npm run build:full       # Instalar + Build completo
npm start                # Servidor produção

# Utilidades
npm run server           # Backend sem nodemon
```

## 🌐 Deploy

### Railway (Recomendado)
- Backend: Conectar repo + adicionar PostgreSQL
- Frontend: Netlify ou Railway separado

Ver [DEPLOY.md](DEPLOY.md) para instruções detalhadas.

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'feat: Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📄 Licença

MIT License - Sistema Prescrimed

---

**Desenvolvido com ❤️ para profissionais de saúde**
