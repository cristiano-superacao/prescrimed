# 🏥 Prescrimed - Sistema de Prescrições Médicas Multi-Tenant

<div align="center">

![Prescrimed Logo](https://via.placeholder.com/200x80/52b788/FFFFFF?text=Prescrimed)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-336791?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.18-000000?logo=express&logoColor=white)](https://expressjs.com/)

**Sistema completo e profissional para gestão de prescrições médicas com suporte a Casa de Repouso, PetShop e Fisioterapia**

[Características](#-características) •
[Início Rápido](#-início-rápido) •
[Documentação](#-documentação) •
[Tecnologias](#-tecnologias) •
[Deploy](#-deploy) •
[Licença](#-licença)

</div>

---

## 📋 Sobre o Projeto

O **Prescrimed** é um sistema moderno de gestão de prescrições médicas desenvolvido com arquitetura **multi-tenant**, permitindo que múltiplas empresas (casas de repouso, petshops e clínicas de fisioterapia) utilizem o mesmo sistema com **isolamento total de dados**.

### 🎯 Principais Diferenciais

- ✅ **Multi-Tenant Completo** - Isolamento de dados por empresa com segurança robusta
- ✅ **3 Tipos de Sistema** - Casa de Repouso, PetShop e Fisioterapia com rotas específicas
- ✅ **Autenticação JWT** - Sistema seguro de autenticação e autorização
- ✅ **Interface Moderna** - UI responsiva e profissional com TailwindCSS
- ✅ **API RESTful** - Documentada e pronta para integrações
- ✅ **PostgreSQL + SQLite** - Suporte dual para produção e desenvolvimento
- ✅ **Fallback de Porta Automático** - Zero downtime em desenvolvimento
- ✅ **100% Responsivo** - Layout adaptável para desktop, tablet e mobile

---

## ✨ Características

### 🏢 Multi-Tenant

- Isolamento completo de dados por empresa (`empresaId`)
- Middleware automático de tenant isolation
- Suporte a superadmin para gestão global
- Controle granular de permissões por role

### 🔐 Segurança

- Autenticação JWT com refresh tokens
- Senhas criptografadas com bcrypt
- CORS configurado para múltiplas origens
- Helmet para headers HTTP seguros
- Validação de dados com express-validator
- Proteção contra SQL Injection
- Rate limiting em produção

### ⚡ Performance

- Compressão gzip/brotli
- Code splitting automático
- Assets otimizados
- Cache estratégico
- Lazy loading de componentes
- Build otimizado com Vite

### 📱 Responsividade

- Mobile-first design
- Touch targets 44px+
- Breakpoints otimizados
- Sidebar adaptável
- Modais responsivos

---

## 🚀 Início Rápido

### Pré-requisitos

- Node.js 18+ ([Download](https://nodejs.org/))
- PostgreSQL 14+ (produção) ou SQLite (desenvolvimento)
- Git

### Instalação

```bash
# 1. Clonar repositório
git clone https://github.com/cristiano-superacao/prescrimed.git
cd prescrimed

# 2. Instalar dependências do backend
npm install

# 3. Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas configurações

# 4. Instalar dependências do frontend
cd client
npm install
cd ..

# 5. Iniciar backend (desenvolvimento)
npm run dev

# 6. Iniciar frontend (em outro terminal)
cd client
npm run dev
```

### Acesso

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3000/api
- **Health Check:** http://localhost:3000/health

---

## 📚 Documentação

### Estrutura do Projeto

```
prescrimed/
├── server.js                    # Backend principal
├── config/
│   └── database.js              # Configuração PostgreSQL/SQLite
├── models/                      # Modelos Sequelize
│   ├── Usuario.js
│   ├── Empresa.js
│   ├── Paciente.js
│   ├── Prescricao.js
│   ├── Agendamento.js
│   ├── CasaRepousoLeito.js     # Casa de Repouso
│   ├── Pet.js                   # PetShop
│   └── SessaoFisio.js           # Fisioterapia
├── routes/                      # Rotas da API
│   ├── auth.routes.js
│   ├── dashboard.routes.js
│   ├── usuario.routes.js
│   ├── paciente.routes.js
│   ├── prescricao.routes.js
│   ├── agendamento.routes.js
│   ├── casa-repouso.routes.js  # Rotas Casa de Repouso
│   ├── petshop.routes.js        # Rotas PetShop
│   └── fisioterapia.routes.js   # Rotas Fisioterapia
├── middleware/
│   ├── auth.middleware.js       # Autenticação JWT
│   └── validate.middleware.js   # Validação de dados
├── client/                      # Frontend React
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── store/
│   └── dist/                    # Build de produção
└── docs/                        # Documentação adicional
```

### Rotas Específicas por Sistema

#### Casa de Repouso
- `GET /api/casa-repouso/leitos` - Listar leitos
- `POST /api/casa-repouso/leitos` - Criar leito
- `GET /api/casa-repouso/leitos/:id` - Detalhes do leito
- `PUT /api/casa-repouso/leitos/:id` - Atualizar leito
- `DELETE /api/casa-repouso/leitos/:id` - Deletar leito

#### PetShop
- `GET /api/petshop/pets` - Listar pets
- `POST /api/petshop/pets` - Cadastrar pet
- `GET /api/petshop/pets/:id` - Detalhes do pet
- `PUT /api/petshop/pets/:id` - Atualizar pet
- `DELETE /api/petshop/pets/:id` - Deletar pet

#### Fisioterapia
- `GET /api/fisioterapia/sessoes` - Listar sessões
- `POST /api/fisioterapia/sessoes` - Agendar sessão
- `GET /api/fisioterapia/sessoes/:id` - Detalhes da sessão
- `PUT /api/fisioterapia/sessoes/:id` - Atualizar sessão
- `DELETE /api/fisioterapia/sessoes/:id` - Deletar sessão

### Credenciais Padrão

Após rodar o seed (`npm run seed:demo`):

**Superadmin:**
- Email: `superadmin@prescrimed.com`
- Senha: `admin123`

**Empresas de Teste:**
1. Casa de Repouso Vida Plena
2. PetShop Amigo Fiel
3. Clínica Fisio Movimento

Ver [docs/CREDENCIAIS_USUARIOS.md](docs/CREDENCIAIS_USUARIOS.md) para mais detalhes.

---

## 🛠️ Tecnologias

### Backend

| Tecnologia | Versão | Descrição |
|-----------|--------|-----------|
| Node.js | 18+ | Runtime JavaScript |
| Express | 4.18 | Framework web |
| PostgreSQL | 14+ | Banco de dados produção |
| SQLite | 5.1 | Banco de dados desenvolvimento |
| Sequelize | 6.37 | ORM SQL |
| JWT | 9.0 | Autenticação |
| bcryptjs | 2.4 | Criptografia de senhas |
| Helmet | 7.1 | Segurança HTTP |
| CORS | 2.8 | Cross-Origin Resource Sharing |
| Morgan | 1.10 | Logger HTTP |

### Frontend

| Tecnologia | Versão | Descrição |
|-----------|--------|-----------|
| React | 18.2 | Biblioteca UI |
| Vite | 5.4 | Build tool |
| TailwindCSS | 3.4 | Framework CSS |
| React Router | 6.21 | Roteamento |
| Zustand | 4.4 | State management |
| Axios | 1.6 | Cliente HTTP |
| Lucide React | 0.303 | Ícones |
| React Hot Toast | 2.4 | Notificações |

---

## 📦 Scripts Disponíveis

### Desenvolvimento

```bash
npm run dev              # Backend com nodemon
npm run client           # Frontend apenas
npm run dev:full         # Backend + Frontend

cd client && npm run dev # Frontend (alternativa)
```

### Produção

```bash
npm run build            # Build frontend
npm run build:full       # Instalar + Build completo
npm start                # Servidor produção
npm run railway:build    # Build para Railway
npm run railway:start    # Start para Railway
```

### Utilidades

```bash
npm run seed:demo        # Popular banco com dados demo
npm run server           # Backend sem nodemon
```

---

## 🌐 Deploy

### Railway (Recomendado para Backend)

1. **Criar projeto no Railway**
   - Conectar repositório GitHub
   - Adicionar serviço PostgreSQL

2. **Configurar variáveis de ambiente**
   ```
   DATABASE_URL=<gerado-automaticamente>
   JWT_SECRET=<seu-secret-seguro>
   JWT_REFRESH_SECRET=<seu-refresh-secret>
   NODE_ENV=production
   FORCE_SYNC=true (apenas primeira vez)
   ```

3. **Deploy automático**
   - Railway detecta `railway.json` e `nixpacks.toml`
   - Build e deploy automáticos

### Netlify (Recomendado para Frontend)

1. **Configurar no Netlify**
   - Base directory: `client`
   - Build command: `npm run build`
   - Publish directory: `client/dist`

2. **Variáveis de ambiente**
   ```
   VITE_API_URL=https://seu-backend.railway.app/api
   ```

Ver [DEPLOY.md](DEPLOY.md) para instruções detalhadas.

---

## 🔒 Segurança

- ✅ Autenticação JWT com tokens de acesso e refresh
- ✅ Senhas hash com bcrypt (10 rounds)
- ✅ CORS configurado para origens permitidas
- ✅ Helmet para security headers
- ✅ Validação de entrada com express-validator
- ✅ Proteção contra injeção SQL (Sequelize)
- ✅ Isolamento multi-tenant por empresaId
- ✅ Handlers de exceção não capturadas em dev
- ✅ HTTPS obrigatório em produção

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'feat: Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

### Padrões de Commit

- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `docs:` Documentação
- `style:` Formatação
- `refactor:` Refatoração
- `test:` Testes
- `chore:` Manutenção

---

## 📄 Licença

Este projeto está sob a licença MIT.

```
MIT License

Copyright (c) 2025 Cristiano Superação - Prescrimed

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 👨‍💻 Autor

**Cristiano Superação**
- GitHub: [@cristiano-superacao](https://github.com/cristiano-superacao)
- Email: contato@prescrimed.com

---

## 🙏 Agradecimentos

- Comunidade React e Node.js
- TailwindCSS pelo framework CSS
- Sequelize pela ORM robusta
- Lucide Icons pelos ícones modernos
- Todos os contribuidores do projeto

---

## 📞 Suporte

Para suporte, abra uma [issue](https://github.com/cristiano-superacao/prescrimed/issues) ou entre em contato via email.

---

<div align="center">

**Desenvolvido com ❤️ para profissionais de saúde**

© 2025 Prescrimed. Todos os direitos reservados.

</div>
