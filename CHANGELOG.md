# 📋 Changelog - Prescrimed

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

---

## [1.1.0] - 2026-01-17

### ✨ Adicionado
- **Logs detalhados de API:** Todas as requisições em `/api/*` agora são registradas no console com método e URL
- **Logging de erro 405:** Mensagens específicas quando métodos HTTP não permitidos são tentados
- **Documentação expandida:** Seção completa de troubleshooting no README.md
- **Exemplos de API:** Exemplos curl para testar endpoints de autenticação
- **Changelog:** Arquivo CHANGELOG.md para rastrear mudanças do projeto

### 🔧 Melhorado
- **Diagnóstico de erros:** Facilita identificação de problemas de CORS e método HTTP incorreto
- **Documentação do Railway:** Guia atualizado com todas as variáveis necessárias
- **README.md:** Informações mais claras sobre configuração de CORS e troubleshooting
- **Mensagens de erro:** Logs mais descritivos para facilitar debug

### 🐛 Corrigido
- **Problema 405 (Method Not Allowed):** Adicionados logs para identificar origem do erro
- **CORS:** Documentação clara sobre como configurar origens permitidas
- **Frontend MIME type:** Instruções para rebuild do frontend com configuração correta

---

## [1.0.0] - 2026-01-15

### ✨ Lançamento Inicial

#### Backend
- API REST completa com Express.js
- Autenticação JWT com refresh tokens
- Multi-tenant com isolamento por empresa
- PostgreSQL em produção, SQLite em desenvolvimento
- 9 funções de usuário (superadmin, admin, nutricionista, enfermeiro, etc.)
- Sistema de permissões granulares

#### Frontend
- Interface React 18 com Vite
- Design responsivo com Tailwind CSS
- Tema escuro com gradientes e glassmorphism
- 10+ páginas funcionais (Dashboard, Pacientes, Prescrições, etc.)
- State management com Zustand
- Rotas protegidas com autenticação

#### Módulos
- 👥 **Gestão de Usuários:** CRUD completo com permissões
- 🏢 **Empresas:** Multi-tenant, onboarding, configurações
- 🧑‍⚕️ **Pacientes:** Cadastro, prontuário, histórico
- 💊 **Prescrições:** Medicamentosa, nutricional, mista
- 📅 **Agendamentos:** Consultas, horários, status
- 🏥 **Censo MP:** Mapa de leitos para casas de repouso
- 💪 **Fisioterapia:** Sessões, evolução, exercícios
- 🐾 **Petshop:** Pets, atendimentos veterinários
- 📦 **Estoque:** Medicamentos, materiais, lotes
- 💰 **Financeiro:** Receitas, despesas, relatórios
- 📊 **Dashboard:** Métricas, indicadores, gráficos

#### Deploy
- Suporte completo para Railway
- Nixpacks para build automático
- Health check e diagnósticos
- Scripts de seed e setup
- Documentação completa (README.md, RAILWAY_SETUP.md)

#### Scripts Utilitários
- `npm run seed:minimal` - Seed rápido para testes
- `npm run create:superadmin` - Criar super admin
- `npm run smoke:api` - Testes de integração
- `npm run check:railway` - Validar configuração
- `npm run check:health` - Verificar status do backend

---

## Tipos de Mudanças

- **✨ Adicionado** - Novas funcionalidades
- **🔧 Melhorado** - Mudanças em funcionalidades existentes
- **🐛 Corrigido** - Correções de bugs
- **🗑️ Removido** - Funcionalidades removidas
- **🔒 Segurança** - Vulnerabilidades corrigidas
- **⚠️ Deprecated** - Funcionalidades que serão removidas

---

## Links

- [Repositório GitHub](https://github.com/cristiano-superacao/prescrimed)
- [Guia de Deploy Railway](RAILWAY_SETUP.md)
- [Documentação Completa](README.md)
