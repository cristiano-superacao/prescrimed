# Guia de Configuração e Testes no Railway

## 🎯 Objetivo
Configurar o sistema no Railway com dados reais de teste, validar todas as funcionalidades e garantir que frontend e backend funcionem corretamente.

## 📋 Dados de Teste Criados

### 🏥 Empresa 1: Casa de Repouso Vida Plena
- **Tipo**: Casa de Repouso
- **CNPJ**: 12345678000101
- **Admin**: Maria Silva
  - Email: maria.silva@vidaplena.com
  - Senha: Admin@2026
- **Funcionários**:
  - João Enfermeiro (enfermeiro)
  - Ana Técnica (técnico enfermagem)
  - Carlos Cuidador (cuidador)
- **Residentes**:
  - José Santos (75 anos)
  - Rita Oliveira (77 anos)
  - Pedro Costa (73 anos)

### 💪 Empresa 2: Clínica de Fisioterapia Movimento
- **Tipo**: Fisioterapia
- **CNPJ**: 23456789000102
- **Admin**: Dr. Roberto Lima
  - Email: roberto.lima@movimento.com
  - Senha: Fisio@2026
- **Funcionários**:
  - Dra. Paula Fisio (fisioterapeuta)
  - Lucas Auxiliar (auxiliar)
  - Fernanda Recepção (recepcionista)
- **Pacientes**:
  - Marcos Alves (45 anos)
  - Sandra Pereira (50 anos)
  - Rafael Souza (35 anos)

### 🐾 Empresa 3: Petshop Amigo Fiel
- **Tipo**: Petshop
- **CNPJ**: 34567890000103
- **Admin**: Dra. Juliana Vet
  - Email: juliana.vet@amigofiel.com
  - Senha: Pet@2026
- **Funcionários**:
  - Dr. André Veterinário (veterinário)
  - Camila Tosadora (tosadora)
  - Bruno Atendimento (atendente)
- **Pets**:
  - Rex (Labrador)
  - Mimi (Siamês)
  - Thor (Pastor Alemão)

## 🚀 Passo 1: Configurar Variáveis no Railway

### Serviço "prescrito" (Backend)
```env
# Database
DATABASE_URL=postgresql://user:pass@host:5432/railway

# Segurança
JWT_SECRET=sua_chave_secreta_muito_segura_aqui

# CORS
ALLOWED_ORIGINS=https://prescrimed.up.railway.app,https://prescrimed-production.up.railway.app

# Ambiente
NODE_ENV=production
PORT=3000
```

### Serviço "cliente" (Frontend)
```env
# Backend URL
VITE_BACKEND_ROOT=https://prescrimed-production.up.railway.app
VITE_API_URL=https://prescrimed-production.up.railway.app/api
```

## 🌱 Passo 2: Popular o Banco de Dados

### Via Node.js (local ou Cloud Shell)
```bash
# Clone o repositório
git clone https://github.com/cristiano-superacao/prescrimed.git
cd prescrimed

# Instale dependências
npm install

# Execute o seed
node scripts/seed-production-data.js
```

### Via Railway CLI (recomendado)
```bash
# No diretório do projeto
railway run node scripts/seed-production-data.js
```

## ✅ Passo 3: Checklist de Testes

### Autenticação
- [ ] Login com admin de cada empresa
- [ ] Logout funciona corretamente
- [ ] Token é renovado automaticamente
- [ ] Redirecionamento ao expirar sessão

### Casa de Repouso
- [ ] Listar residentes
- [ ] Criar nova prescrição para residente
- [ ] Registrar evolução de enfermagem
- [ ] Consultar histórico completo
- [ ] Gerar relatório de censo

### Fisioterapia
- [ ] Listar pacientes
- [ ] Criar sessão de fisioterapia
- [ ] Registrar evolução da sessão
- [ ] Consultar histórico de sessões
- [ ] Agendar nova sessão

### Petshop
- [ ] Listar pets cadastrados
- [ ] Criar novo atendimento
- [ ] Registrar vacinação
- [ ] Agendar banho/tosa
- [ ] Consultar histórico do pet

### Módulos Compartilhados
- [ ] Dashboard carrega métricas corretas
- [ ] Agenda exibe compromissos
- [ ] Financeiro registra transações
- [ ] Estoque controla movimentações
- [ ] Usuários: criar, editar, desativar

### Responsividade
- [ ] Layout mobile (< 768px)
- [ ] Layout tablet (768px - 1024px)
- [ ] Layout desktop (> 1024px)
- [ ] Menu sidebar responsivo
- [ ] Tabelas scrolláveis em mobile

## 🔧 Passo 4: Resolver Erros Comuns

### Erro: CORS bloqueado
**Solução**: Verificar `ALLOWED_ORIGINS` no backend e `VITE_BACKEND_ROOT` no frontend.

### Erro: 503 Service Unavailable
**Solução**: Verificar se `DATABASE_URL` está configurada e se PostgreSQL está ativo.

### Erro: 401 Unauthorized
**Solução**: Token expirado ou inválido. Fazer logout e login novamente.

### Erro: Rotas 404
**Solução**: Verificar se o build do frontend foi feito com `npm run build:railway`.

## 📊 Passo 5: Validação de Rotas

### Backend Endpoints
```bash
# Health check
curl https://prescrimed-production.up.railway.app/health

# Auth
curl -X POST https://prescrimed-production.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"maria.silva@vidaplena.com","senha":"Admin@2026"}'

# Pacientes
curl https://prescrimed-production.up.railway.app/api/pacientes \
  -H "Authorization: Bearer SEU_TOKEN"
```

### Frontend Pages
- https://prescrimed.up.railway.app/#/login
- https://prescrimed.up.railway.app/#/dashboard
- https://prescrimed.up.railway.app/#/pacientes
- https://prescrimed.up.railway.app/#/prescricoes
- https://prescrimed.up.railway.app/#/agenda
- https://prescrimed.up.railway.app/#/financeiro
- https://prescrimed.up.railway.app/#/usuarios

## 🎨 Validação de Layout

### Componentes Críticos
- Header com logo e menu
- Sidebar com navegação
- Cards de métricas no dashboard
- Tabelas com paginação
- Modais de cadastro/edição
- Formulários responsivos
- Botões de ação (criar, editar, deletar)
- Alerts e notificações (toast)

### CSS/Tailwind
- Cores consistentes
- Espaçamentos harmônicos
- Tipografia legível
- Ícones alinhados
- Hover states
- Loading states
- Estados de erro

## 📈 Métricas de Sucesso

### Performance
- [ ] Tempo de carregamento < 3s
- [ ] API responde em < 500ms
- [ ] Health check < 200ms

### Funcionalidade
- [ ] 100% das rotas acessíveis
- [ ] 0 erros 500 no console
- [ ] CRUD completo funciona
- [ ] Filtros e busca operacionais

### UX
- [ ] Navegação intuitiva
- [ ] Feedback visual claro
- [ ] Mensagens de erro úteis
- [ ] Layout profissional

## 🚨 Suporte

Em caso de problemas:
1. Verificar logs no Railway Dashboard
2. Testar endpoints via curl/Postman
3. Limpar cache do navegador
4. Verificar variáveis de ambiente
5. Redeployar se necessário

---

**Última atualização**: 23 de janeiro de 2026
