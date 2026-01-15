# Documentação Técnica - Prescrimed

## 📂 Estrutura de Pastas

### Raiz do Projeto (`/`)

- **`server.js`**: Ponto de entrada do Backend. Configura o servidor Express, conecta ao MongoDB e define as rotas.
- **`models/`**: Schemas do Mongoose (Banco de Dados).
  - `Usuario.js`: Dados de usuários e permissões.
  - `Empresa.js`: Dados das clínicas/empresas.
  - `Paciente.js`: Dados dos pacientes.
  - `Prescricao.js`: Dados das prescrições médicas.
- **`routes/`**: Definição das rotas da API.
  - `auth.routes.js`: Login, registro e autenticação.
  - `usuario.routes.js`: CRUD de usuários.
  - `paciente.routes.js`: CRUD de pacientes.
  - `prescricao.routes.js`: CRUD de prescrições.
  - `financeiro.routes.js`: Rotas de transações financeiras.
  - `estoque.routes.js`: Rotas de controle de estoque.
  - `agendamento.routes.js`: Rotas da agenda.
  - `dashboard.routes.js`: Dados para os gráficos e cards.
- **`middleware/`**: Middlewares do Express.
  - `auth.middleware.js`: Verifica o token JWT e protege rotas.
- **`config/`**: Arquivos de configuração (ex: conexão com banco).

### Frontend (`/client`)

- **`src/`**: Código fonte do React.
  - **`main.jsx`**: Ponto de entrada do React.
  - **`App.jsx`**: Configuração de rotas e layout principal.
  - **`pages/`**: Componentes de página.
    - `Login.jsx`: Tela de login.
    - `Register.jsx`: Tela de cadastro.
    - `Dashboard.jsx`: Tela inicial com resumos.
    - `Pacientes.jsx`: Listagem e cadastro de pacientes.
    - `Prescricoes.jsx`: Criação e visualização de prescrições.
    - `CensoMP.jsx`: Mapa de prescrições e controle.
    - `Financeiro.jsx`: Gestão financeira.
    - `Estoque.jsx`: Controle de estoque.
    - `Agenda.jsx`: Cronograma de consultas.
    - `Evolucao.jsx`: Registro de evolução clínica.
    - `Usuarios.jsx`: Gestão de usuários (Admin).
    - `Configuracoes.jsx`: Perfil e dados da empresa.
  - **`components/`**: Componentes reutilizáveis.
    - `Layout.jsx`: Estrutura base (Sidebar + Header).
    - `Sidebar.jsx`: Menu lateral.
    - `Header.jsx`: Barra superior.
    - `ProtectedRoute.jsx`: Proteção de rotas privadas.
    - `EmpresaModal.jsx`: Modal de gestão de empresas.
  - **`services/`**: Comunicação com a API (Axios).
    - `api.js`: Instância do Axios com interceptors.
    - `auth.service.js`: Login/Logout.
    - `dashboard.service.js`: Dados do dashboard.
    - `financeiro.service.js`: API Financeiro.
    - `estoque.service.js`: API Estoque.
    - `agendamento.service.js`: API Agenda.
  - **`store/`**: Gerenciamento de estado global (Zustand).
    - `authStore.js`: Estado de autenticação (usuário logado).

## 🔐 Fluxo de Autenticação

1. **Login**: O usuário envia email/senha para `/api/auth/login`.
2. **Token**: O servidor retorna um JWT (JSON Web Token).
3. **Armazenamento**: O frontend salva o token no `localStorage`.
4. **Requisições**: O `api.js` intercepta todas as requisições e adiciona o header `Authorization: Bearer <token>`.
5. **Backend**: O `auth.middleware.js` verifica o token. Se válido, adiciona o usuário (`req.user`) à requisição.

## 🎨 Estilização

O projeto utiliza **Tailwind CSS** para estilização.

- As classes utilitárias são usadas diretamente no JSX (ex: `className="bg-blue-500 text-white"`).
- Configurações globais estão em `client/src/index.css`.
- Configuração do tema em `client/tailwind.config.js`.

## 🚀 Scripts Principais

- `npm run dev` (Raiz): Inicia o backend com Nodemon.
- `npm run dev` (Client): Inicia o frontend com Vite.
- `start.bat`: Script Windows para iniciar tudo automaticamente.
