# 🚀 SISTEMA RODANDO LOCALMENTE!

## ✅ Status dos Servidores

### 📊 MongoDB Memory Server
- ✅ **Status**: Rodando
- 📍 **URI**: mongodb://127.0.0.1:27017/
- 💾 **Banco**: prescrimed (em memória)

### 🔧 Backend API (Node.js + Express)
- ✅ **Status**: Rodando
- 🌐 **URL**: http://localhost:3000
- 🏥 **Health Check**: http://localhost:3000/health
- 📚 **Ambiente**: development
- ✅ **MongoDB**: Conectado com sucesso
- 🌱 **Seed**: Dados iniciais criados

### 🎨 Frontend (React + Vite)
- ✅ **Status**: Rodando
- 🌐 **URL**: http://localhost:5173
- 🔗 **Proxy API**: http://localhost:3000/api

---

## 🔐 CREDENCIAIS DE ACESSO

### Super Administrador (Criado automaticamente)
```
Email: superadmin@prescrimed.com
Senha: admin123456
Role: superadmin
Empresa: Administração do Sistema
```

**⚠️ IMPORTANTE:** Este usuário tem acesso total ao sistema, incluindo:
- ✅ Gestão de todas as empresas
- ✅ Criação de novos usuários
- ✅ Todas as permissões de módulos
- ✅ Acesso às configurações globais

---

## 📱 COMO TESTAR O SISTEMA

### 1️⃣ Acessar o Sistema
1. Abra o navegador em: **http://localhost:5173**
2. Você será redirecionado para a tela de login

### 2️⃣ Fazer Login
1. Digite o email: `superadmin@prescrimed.com`
2. Digite a senha: `admin123456`
3. Clique em "Entrar"

### 3️⃣ Testar os Módulos

#### 📊 Dashboard
- Visualize estatísticas gerais
- Próximos passos operacionais
- Alertas críticos
- Gráficos de prescrições

#### 👥 Pacientes/Residentes
- Cadastre novos pacientes
- Edite informações
- Visualize prontuários
- Busque e filtre

#### 📝 Prescrições
- Crie prescrições médicas
- Associe a pacientes
- Gerencie medicamentos
- Histórico completo

#### 📅 Agenda
- Crie compromissos
- Gerencie consultas
- Visualize calendário
- Status dos agendamentos

#### 🗓️ Cronograma
- Planeje atividades
- Organize equipe
- Timeline de eventos

#### 📦 Estoque
- **Medicamentos**: Cadastre e movimente
- **Alimentos**: Controle de entrada/saída
- Alertas de estoque baixo
- Validade próxima

#### 💰 Financeiro
- Receitas e despesas
- Fluxo de caixa
- Transações pendentes
- Estatísticas financeiras

#### 👨‍⚕️ Usuários
- Gerencie equipe médica
- Defina permissões
- Controle de acesso
- Status dos usuários

#### ⚙️ Configurações
- Dados da empresa
- Preferências do sistema
- Personalização

---

## 🔄 TESTANDO MULTI-TENANT

### Criar Nova Empresa
1. Clique em "Sair" (não precisa, mas para testar registro)
2. Clique em "Registrar nova conta"
3. Preencha os dados:
   - Nome da Empresa: `Clínica Teste`
   - CNPJ: `12.345.678/0001-90`
   - Email: `teste@clinica.com`
   - Senha: `teste123`
   - Nome Admin: `Dr. Teste`

### Verificar Isolamento
1. Faça login com a nova empresa
2. Cadastre pacientes, prescrições, etc.
3. Faça logout
4. Faça login como super admin
5. Verifique que cada empresa tem seus dados isolados

---

## 🧪 TESTAR API DIRETAMENTE

### Health Check
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/health"
```

### Login via API
```powershell
$body = @{
    email = "superadmin@prescrimed.com"
    senha = "admin123456"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method POST -Body $body -ContentType "application/json"
```

### Listar Pacientes (com token)
```powershell
$token = "seu_token_jwt_aqui"
$headers = @{
    Authorization = "Bearer $token"
}

Invoke-RestMethod -Uri "http://localhost:3000/api/pacientes" -Headers $headers
```

---

## 🛑 PARAR OS SERVIDORES

### Método 1: Ctrl+C em cada terminal
Pressione `Ctrl+C` nos terminais onde estão rodando:
1. MongoDB Memory Server
2. Backend (npm run dev)
3. Frontend (npm run dev)

### Método 2: Fechar terminais
Simplesmente feche as janelas dos terminais

### Método 3: PowerShell
```powershell
# Parar processos node
Get-Process node | Stop-Process -Force
```

---

## 🔧 REINICIAR SISTEMA

### Opção 1: Tudo junto
```powershell
npm run dev:all
```

### Opção 2: Separado (recomendado)
```powershell
# Terminal 1 - MongoDB
node start-mongo-memory.js

# Terminal 2 - Backend
npm run dev

# Terminal 3 - Frontend
cd client
npm run dev
```

---

## 📊 MONITORAMENTO

### Logs do Backend
Acompanhe o terminal do backend para ver:
- ✅ Conexões ao MongoDB
- 🔐 Autenticações
- 🚨 Erros
- 📝 Requisições HTTP

### Logs do Frontend
Acompanhe o terminal do frontend para ver:
- 🔄 Hot reload
- ⚡ Build times
- 🐛 Erros de compilação

### Console do Navegador
Pressione `F12` no navegador para ver:
- 🌐 Requisições à API
- 🐛 Erros JavaScript
- 📊 Estado da aplicação
- 💾 LocalStorage (token, user)

---

## 🎯 FLUXO DE TESTES COMPLETO

1. ✅ **Login**: Acessar com super admin
2. ✅ **Dashboard**: Visualizar estatísticas
3. ✅ **Pacientes**: Cadastrar 2-3 pacientes
4. ✅ **Prescrições**: Criar prescrições para os pacientes
5. ✅ **Estoque**: Cadastrar medicamentos e alimentos
6. ✅ **Estoque**: Fazer movimentações (entrada/saída)
7. ✅ **Financeiro**: Criar transações (receitas e despesas)
8. ✅ **Agenda**: Criar compromissos
9. ✅ **Usuários**: Criar novo usuário da equipe
10. ✅ **Configurações**: Atualizar dados da empresa
11. ✅ **Multi-tenant**: Registrar nova empresa e testar isolamento

---

## 🐛 PROBLEMAS COMUNS

### Erro de conexão com MongoDB
```
❌ Erro ao conectar MongoDB
```
**Solução**: Certifique-se de que o MongoDB Memory Server está rodando

### Erro 404 na API
```
❌ Error: Request failed with status code 404
```
**Solução**: Verifique se o backend está rodando na porta 3000

### Tela branca no frontend
```
❌ Página em branco
```
**Solução**: Pressione F12 e verifique erros no console

### Token expirado
```
❌ Token expirado
```
**Solução**: Faça logout e login novamente

---

## ✅ SISTEMA TESTADO E FUNCIONANDO!

Todos os módulos foram implementados e testados:
- ✅ Autenticação e autorização
- ✅ Multi-tenant com isolamento completo
- ✅ Layout responsivo
- ✅ Integração com MongoDB
- ✅ CRUD completo de todos os módulos
- ✅ Sistema de permissões
- ✅ Validações de dados
- ✅ Feedback visual (toasts)

**Divirta-se testando! 🎉**
