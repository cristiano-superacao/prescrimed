# 🏥 PrescrIMed - Sistema Multi-Tenant de Gestão de Prescrições Médicas

<div align="center">

![PrescrIMed Logo](https://via.placeholder.com/200x80/4F46E5/FFFFFF?text=PrescrIMed)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0+-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express.js](https://img.shields.io/badge/Express.js-4.18-000000?logo=express&logoColor=white)](https://expressjs.com/)

**Sistema moderno e completo para gestão de prescrições médicas com arquitetura multi-tenant**

[Funcionalidades](#-funcionalidades) •
[Instalação](#-instalação-rápida) •
[Documentação](#-documentação) •
[API](#-api-endpoints) •
[Deploy](#-deploy-em-produção)

</div>

---

## 📋 Sobre o Projeto

O **PrescrIMed** é uma solução completa e moderna para gestão de prescrições médicas, desenvolvido com as mais recentes tecnologias web. O sistema implementa uma arquitetura **multi-tenant robusta**, garantindo **isolamento total de dados** entre diferentes empresas/clínicas, permitindo que múltiplas organizações utilizem a mesma aplicação com **segurança e privacidade absolutas**.

### 🎯 Principais Diferenciais

- ✅ **Multi-Tenant Completo** - Isolamento de dados por empresa com segurança
- ✅ **Zero Configuração** - Primeiro usuário se torna automaticamente administrador  
- ✅ **Controle Granular** - Permissões por módulo para cada usuário
- ✅ **Interface Moderna** - UI responsiva e intuitiva com TailwindCSS
- ✅ **API RESTful** - Documentada e pronta para integrações
- ✅ **Segurança Avançada** - JWT, bcrypt, Helmet e validações
- ✅ **Cloud Ready** - MongoDB Atlas para escalabilidade
- ✅ **100% Open Source** - Código aberto e gratuito

---

## 🚀 Funcionalidades

### 👥 Gestão de Usuários
- Cadastro automático de empresa e primeiro administrador
- Criação de usuários pela equipe administrativa
- Controle de permissões por módulo (dashboard, pacientes, prescrições, financeiro, estoque, etc.)
- Gerenciamento de perfis (admin/usuário)
- Histórico de último acesso

### 🧑‍⚕️ Gestão de Pacientes
- Cadastro completo com informações pessoais e médicas
- Campos para alergias, condições médicas e medicamentos em uso
- Informações de convênio e contato de emergência
- Busca rápida e filtros avançados
- Histórico de prescrições por paciente

### 💊 Gestão de Prescrições e Censo M.P.
- Criação rápida e intuitiva de prescrições
- Suporte para múltiplos medicamentos
- Classificação por tipo (comum, controlado, amarelo, azul)
- Status de prescrição (ativa, cancelada, arquivada)
- **Censo M.P.**: Mapa de prescrições ativas e controle de dispensação

### 💰 Financeiro e Estoque
- **Financeiro**: Controle de fluxo de caixa, receitas e despesas
- **Estoque**: Gestão de medicamentos e materiais, com controle de validade e quantidade
- Relatórios financeiros e de movimentação de estoque

### 📅 Agenda e Evolução
- **Agenda**: Cronograma de consultas e compromissos
- **Evolução**: Registro clínico de enfermagem e acompanhamento diário

### 📊 Dashboard Intuitivo
- Visão geral com estatísticas em tempo real
- Total de pacientes, usuários e prescrições
- Prescrições e pacientes recentes
- Métricas por período customizável

### 🔐 Segurança e Autenticação
- Autenticação JWT com tokens seguros
- Senhas criptografadas com bcrypt
- Middleware de isolamento multi-tenant
- Proteção contra ataques comuns (Helmet)
- Validação de dados em todas as camadas

---

## 🏗️ Arquitetura e Tecnologias

### Backend

```
Stack Principal:
├── Node.js 18+           # Runtime JavaScript
├── Express 4.18          # Framework web
├── MongoDB + Mongoose    # Banco NoSQL
├── JWT                   # Autenticação stateless
├── Bcrypt               # Criptografia
└── Express Validator     # Validação
```

**Dependências:**
- `express` - Framework web rápido e minimalista
- `mongoose` - ODM para MongoDB com schemas tipados
- `jsonwebtoken` - Implementação JWT para autenticação
- `bcryptjs` - Hash de senhas com salt
- `helmet` - Segurança HTTP headers
- `cors` - Cross-Origin Resource Sharing
- `compression` - Compressão gzip/deflate
- `morgan` - Logger de requisições HTTP
- `express-validator` - Validação e sanitização
- `dotenv` - Gerenciamento de variáveis de ambiente

### Frontend

```
Stack Principal:
├── React 18              # Biblioteca UI
├── Vite 5                # Build tool
├── TailwindCSS 3         # Framework CSS
├── React Router 6        # Roteamento
├── Axios                 # Cliente HTTP
├── Zustand               # State management
└── Lucide React          # Ícones
```

**Dependências:**
- `react` + `react-dom` - Biblioteca principal
- `react-router-dom` - Gerenciamento de rotas
- `axios` - Cliente HTTP com interceptors
- `zustand` - State management minimalista
- `lucide-react` - Ícones SVG modernos
- `react-hot-toast` - Notificações elegantes
- `tailwindcss` - Framework CSS utility-first

---

## 💻 Instalação Rápida

### Pré-requisitos

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **MongoDB Atlas** (grátis) - [Criar conta](https://www.mongodb.com/cloud/atlas/register)
- **Git** ([Download](https://git-scm.com/))

### 1️⃣ Clonar o Repositório

```bash
git clone https://github.com/cristiano-superacao/prescrimed.git
cd prescrimed
```

### 2️⃣ Configurar MongoDB Atlas (5 minutos)

1. Acesse [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Crie uma conta gratuita (pode usar Google/GitHub)
3. Clique em **"Build a Database"** → Escolha **FREE (M0)**
4. Configure:
   - **Username**: `prescrimed`
   - **Password**: (crie uma senha forte e anote)
5. Em **Network Access**: Clique **"Allow Access from Anywhere"** (0.0.0.0/0)
6. Copie a **Connection String**:
   ```
   mongodb+srv://prescrimed:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### 3️⃣ Configurar Variáveis de Ambiente

Crie o arquivo `.env` na raiz do projeto:

```env
PORT=5000
MONGODB_URI=mongodb+srv://prescrimed:<SUA_SENHA>@cluster0.xxxxx.mongodb.net/prescrimed?retryWrites=true&w=majority
JWT_SECRET=prescrimed_secret_key_super_seguro_2024
NODE_ENV=development
```

> ⚠️ **Importante**: Substitua `<SUA_SENHA>` pela senha do MongoDB e adicione `/prescrimed` antes do `?`

Crie o arquivo `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

### 4️⃣ Instalar Dependências

```bash
# Backend
npm install

# Frontend
cd client
npm install
cd ..
```

### 5️⃣ Iniciar o Sistema

**Opção 1: Automático (Recomendado)**
```bash
.\start.bat
```

**Opção 2: Manual**
```bash
# Terminal 1 - Backend
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

### 6️⃣ Acessar a Aplicação

1. Abra o navegador em: **http://localhost:5173**
2. Clique em **"Cadastrar Empresa"**
3. Preencha os dados da sua empresa
4. **Você será automaticamente o administrador!** 🎉

---

## 📚 Documentação

### Primeiro Acesso

1. **Cadastrar Empresa**
   - Nome da empresa
   - CNPJ (opcional)
   - Nome do administrador
   - E-mail
   - Senha (mínimo 6 caracteres)

2. **Como Administrador, você pode:**
   - ✅ Criar e gerenciar usuários
   - ✅ Definir permissões por módulo
   - ✅ Gerenciar configurações da empresa
   - ✅ Acessar todos os módulos
   - ✅ Visualizar estatísticas completas

3. **Criar Usuários**
   - Acesse **"Usuários"** no menu
   - Clique em **"Novo Usuário"**
   - Preencha os dados
   - Selecione as **permissões** (dashboard, pacientes, prescrições, etc.)
   - Escolha o **perfil** (admin ou usuário)

---

## 🔌 API Endpoints

### 🔐 Autenticação

#### POST `/api/auth/register`
Registrar nova empresa e administrador

```json
// Request
{
  "nomeEmpresa": "Clínica Saúde Total",
  "cnpj": "12.345.678/0001-90",
  "email": "admin@clinica.com",
  "senha": "senha123",
  "nomeAdmin": "Dr. João Silva",
  "telefone": "(11) 98765-4321"
}

// Response 201
{
  "message": "Empresa e usuário criados com sucesso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": "64abc123...",
    "nome": "Dr. João Silva",
    "email": "admin@clinica.com",
    "role": "admin",
    "empresaId": "64xyz789...",
    "empresaNome": "Clínica Saúde Total"
  }
}
```

### 📊 Tabela de Endpoints

| Módulo | Método | Endpoint | Descrição | Auth | Permissão |
|--------|--------|----------|-----------|------|-----------|
| **Autenticação** |
| | POST | `/api/auth/register` | Cadastrar empresa | ❌ | - |
| | POST | `/api/auth/login` | Login | ❌ | - |
| | POST | `/api/auth/refresh` | Renovar token | ✅ | - |
| | GET | `/api/auth/me` | Dados do usuário | ✅ | - |
| **Usuários** |
| | GET | `/api/usuarios` | Listar usuários | ✅ | - |
| | GET | `/api/usuarios/:id` | Buscar por ID | ✅ | - |
| | POST | `/api/usuarios` | Criar usuário | ✅ | admin |
| | PUT | `/api/usuarios/:id` | Atualizar usuário | ✅ | admin |
| | PUT | `/api/usuarios/:id/permissoes` | Atualizar permissões | ✅ | admin |
| | DELETE | `/api/usuarios/:id` | Desativar usuário | ✅ | admin |
| **Pacientes** |
| | GET | `/api/pacientes` | Listar pacientes | ✅ | pacientes |
| | GET | `/api/pacientes/:id` | Buscar por ID | ✅ | pacientes |
| | POST | `/api/pacientes` | Cadastrar paciente | ✅ | pacientes |
| | PUT | `/api/pacientes/:id` | Atualizar paciente | ✅ | pacientes |
| | DELETE | `/api/pacientes/:id` | Desativar paciente | ✅ | pacientes |
| **Prescrições** |
| | GET | `/api/prescricoes` | Listar prescrições | ✅ | prescricoes |
| | GET | `/api/prescricoes/:id` | Buscar por ID | ✅ | prescricoes |
| | GET | `/api/prescricoes/paciente/:id` | Por paciente | ✅ | prescricoes |
| | POST | `/api/prescricoes` | Criar prescrição | ✅ | prescricoes |
| | PUT | `/api/prescricoes/:id` | Atualizar prescrição | ✅ | prescricoes |
| | PUT | `/api/prescricoes/:id/cancelar` | Cancelar prescrição | ✅ | prescricoes |
| | PUT | `/api/prescricoes/:id/arquivar` | Arquivar prescrição | ✅ | prescricoes |
| **Financeiro** |
| | GET | `/api/financeiro/transacoes` | Listar transações | ✅ | financeiro |
| | POST | `/api/financeiro/transacoes` | Nova transação | ✅ | financeiro |
| | GET | `/api/financeiro/resumo` | Resumo financeiro | ✅ | financeiro |
| **Estoque** |
| | GET | `/api/estoque/medicamentos` | Listar medicamentos | ✅ | estoque |
| | POST | `/api/estoque/movimentacoes` | Registrar entrada/saída | ✅ | estoque |
| **Agenda** |
| | GET | `/api/agendamentos` | Listar agendamentos | ✅ | agenda |
| | POST | `/api/agendamentos` | Novo agendamento | ✅ | agenda |
| **Dashboard** |
| | GET | `/api/dashboard/stats` | Estatísticas gerais | ✅ | dashboard |
| | GET | `/api/dashboard/prescricoes-recentes` | Prescrições recentes | ✅ | dashboard |
| | GET | `/api/dashboard/pacientes-recentes` | Pacientes recentes | ✅ | dashboard |
| **Empresas** |
| | GET | `/api/empresas/me` | Dados da empresa | ✅ | - |
| | PUT | `/api/empresas/me` | Atualizar empresa | ✅ | admin |

---

## 🔒 Segurança

### Implementações de Segurança

- **JWT (JSON Web Tokens)**: Autenticação stateless e segura
- **Bcrypt**: Hash de senhas com salt (10 rounds)
- **Helmet**: Proteção de cabeçalhos HTTP
- **CORS**: Controle de origens permitidas
- **Express Validator**: Validação e sanitização de inputs
- **Middleware de Tenant**: Isolamento automático de dados por empresa

### Isolamento Multi-Tenant

Toda requisição autenticada:
1. ✅ Extrai o `empresaId` do token JWT
2. ✅ Injeta automaticamente nas queries do banco
3. ✅ Filtra resultados pela empresa do usuário
4. ✅ Impede acesso a dados de outras empresas

```javascript
// Exemplo de isolamento automático
const pacientes = await Paciente.find({ empresaId: req.user.empresaId });
```

---

## 🚀 Deploy em Produção

### Backend (Render.com - Gratuito)

1. Crie conta no [Render](https://render.com/)
2. **New** → **Web Service**
3. Conecte seu repositório GitHub
4. Configure:
   ```
   Build Command: npm install
   Start Command: npm start
   ```
5. Adicione variáveis de ambiente:
   ```
   PORT=5000
   MONGODB_URI=sua_connection_string_atlas
   JWT_SECRET=seu_secret_super_seguro
   NODE_ENV=production
   ```

### Frontend (Vercel - Gratuito)

1. Crie conta no [Vercel](https://vercel.com/)
2. **Import Project**
3. Selecione o repositório
4. Configure:
   ```
   Framework Preset: Vite
   Root Directory: client
   Build Command: npm run build
   Output Directory: dist
   ```
5. Adicione variável de ambiente:
   ```
   VITE_API_URL=https://seu-backend.onrender.com/api
   ```

---

## 🛠️ Scripts Disponíveis

### Backend
```bash
npm run dev        # Modo desenvolvimento (nodemon)
npm start          # Modo produção
npm run client     # Apenas frontend
npm run dev:full   # Backend + Frontend
```

### Frontend
```bash
npm run dev        # Servidor Vite
npm run build      # Build produção
npm run preview    # Preview do build
```

### Utilitários
```bash
.\install.bat      # Instalar dependências (Windows)
.\start.bat        # Iniciar sistema (Windows)
.\fix.bat          # Corrigir problemas (Windows)
```

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

### Diretrizes

- Siga o estilo de código existente
- Adicione testes para novas funcionalidades
- Atualize a documentação quando necessário

---

## 📝 Licença

Este projeto está sob a licença MIT.

---

## 👨‍💻 Autor

**Cristiano Santos**
- GitHub: [@cristiano-superacao](https://github.com/cristiano-superacao)
- Email: cristiano.s.santos@ba.estudante.senai.br

---

## 🙏 Agradecimentos

- [Node.js](https://nodejs.org/)
- [React](https://reactjs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Express.js](https://expressjs.com/)
- [TailwindCSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)

---

## 📞 Suporte

Se precisar de ajuda:

1. Consulte a documentação completa em `/docs`
2. Abra uma [Issue](https://github.com/cristiano-superacao/prescrimed/issues)
3. Entre em contato: cristiano.s.santos@ba.estudante.senai.br

---

<div align="center">

**Desenvolvido com ❤️ para revolucionar a gestão médica**

[⬆ Voltar ao topo](#-prescrimed---sistema-multi-tenant-de-gestão-de-prescrições-médicas)

</div>
