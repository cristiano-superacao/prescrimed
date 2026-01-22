# 📋 Changelog - Prescrimed

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

---

## [1.2.0] - 2026-01-21

### ✨ Adicionado

#### Módulo de Registros de Enfermagem (Completo)
- **Backend:** Model `RegistroEnfermagem.js` com tipos (Admissão, Evolução, Alta, Intercorrência)
- **Backend:** Sinais vitais em JSON (PA, FC, FR, Temperatura, SatO2, Glicemia)
- **Backend:** Avaliação de riscos (queda, lesão) e prioridades
- **Backend:** Routes completas `/api/enfermagem` com stats
- **Frontend:** Página `Evolucao.jsx` completa (900+ linhas)
- **Frontend:** Modal com 3 seções color-coded
- **Frontend:** Dashboard com 4 cards de estatísticas
- **Frontend:** Service layer `enfermagem.service.js`

#### Sistema de Exportação PDF/Excel
- **Financeiro:** Exportação PDF com impressão formatada e estatísticas
- **Financeiro:** Exportação Excel (CSV UTF-8) com resumo financeiro
- **Estoque:** Exportação PDF com relatório de inventário
- **Estoque:** Exportação Excel com dados completos do estoque
- Botões responsivos com tooltips informativos
- Estados de loading e disabled quando não há dados
- Padrão visual consistente (vermelho PDF, verde Excel)

#### Documentação Completa
- **DOCUMENTATION.md:** Documentação técnica detalhada (823 linhas)
- Arquitetura backend e frontend explicada
- Todos os 9 módulos documentados com endpoints
- Modelos de dados com exemplos
- Guia de desenvolvimento para novos módulos
- Troubleshooting de problemas comuns
- **README.md:** Atualizado com link para documentação técnica

### 🎨 Melhorado

#### Design System Padronizado
- **Botões de Ação:** Ícones 18px (vs 16px), padding p-2.5 (vs p-2)
- **Gradientes:** Hover com `from-{color}-500 to-{color}-600`
- **Sombras:** `shadow-sm hover:shadow-md` em todos botões
- **Transições:** `transition-all duration-200` suaves
- **Tooltips:** Posicionamento absoluto consistente com fade in/out
- **Loading States:** Spinners animados durante exclusões
- **Confirmações:** Mensagens personalizadas com nome do item

#### Páginas Reconstruídas com Novo Padrão
- **Pacientes:** Botões Histórico, Editar, Excluir com gradientes
- **Usuários:** Proteção contra auto-exclusão, tooltips descritivos
- **Financeiro:** Integração com exportação, layout otimizado
- **Empresas:** Avisos sobre perda de dados, loading states
- **Estoque:** Botões compactados para mobile, exportação completa

#### Responsividade Aprimorada
- Mobile: Ícones apenas, texto oculto
- Tablet (sm): Texto em botões principais
- Desktop (lg): Todos textos visíveis
- Headers com `flex-wrap` e gaps consistentes
- Separadores visuais entre grupos de botões

#### Acessibilidade
- `aria-labels` em todos botões de ação
- `title` attributes informativos
- Estados `disabled` claramente visíveis
- Navegação por teclado melhorada

### 🔧 Técnico

#### Padrões de Código
- HandleDelete padronizado com try/finally
- Exportação CSV com BOM UTF-8
- Estados `deletingId` para controle de loading
- Tooltips com `group` e `group-hover`

#### Build
- Bundle: 296.97 KB (gzipped: 64.77 KB)
- +12KB de funcionalidades (exportação + enfermagem)
- Todos builds bem-sucedidos

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
