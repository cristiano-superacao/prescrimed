# 🚀 Guia Rápido - Como Usar o Sistema Prescrimed

## 📋 Pré-requisitos

✅ Node.js instalado (versão 16 ou superior)  
✅ NPM instalado (vem com o Node.js)  
✅ Dependências instaladas (`npm install`)

---

## 🎯 Iniciando o Sistema

### Método 1: Script Automatizado (Recomendado)
```batch
# Clique duas vezes no arquivo:
INICIAR_SISTEMA_COMPLETO.bat
```

O script irá:
1. ✓ Verificar Node.js e NPM
2. ✓ Parar processos anteriores
3. ✓ Iniciar o backend (porta 3000)
4. ✓ Aguardar backend ficar pronto
5. ✓ Iniciar o frontend (porta 5173)

### Método 2: Manual
```powershell
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend (em outra janela)
cd client
npm run dev
```

---

## 🌐 Acessando o Sistema

Após iniciar, abra seu navegador em:

**Frontend:** http://localhost:5173  
**Backend API:** http://localhost:3000  
**Health Check:** http://localhost:3000/health

---

## 👤 Credenciais de Acesso

### Super Admin (acesso total)
- **Email:** superadmin@prescrimed.com
- **Senha:** super123

### Usuários de Teste (criados automaticamente)
- **Admin:** admin@prescrimed.com | Senha: admin123
- **Médico:** medico@prescrimed.com | Senha: medico123
- **Nutricionista:** nutri@prescrimed.com | Senha: nutri123

---

## 🔍 Verificando se Está Funcionando

### ✅ Backend Online
Se o backend estiver funcionando, você verá:
- Terminal com mensagens:
  ```
  🚀 Servidor rodando na porta 3000
  ✅ MongoDB Memory Server conectado com sucesso
  ```
- http://localhost:3000/health retorna: `{"status":"ok"}`

### ✅ Frontend Online  
Se o frontend estiver funcionando, você verá:
- Terminal com mensagens:
  ```
  VITE v... ready in ...ms
  ➜ Local: http://localhost:5173/
  ```
- Página de login carrega normalmente

### ❌ Problemas?
Se você ver erros 404 ou "Backend Offline":
1. Execute: `DIAGNOSTICO_SISTEMA.bat`
2. Siga as instruções no diagnóstico
3. Consulte: `SOLUCAO_ERROS_API.md`

---

## 🛑 Parando o Sistema

### Método 1: Script (Recomendado)
```batch
PARAR_SISTEMA.bat
```

### Método 2: Manual
- Feche as janelas do PowerShell/CMD do backend e frontend
- Ou pressione `Ctrl + C` em cada terminal

### Método 3: Forçar Parada
```powershell
# PowerShell
Stop-Process -Name node -Force

# CMD
taskkill /F /IM node.exe
```

---

## 📊 Monitor de Status do Backend

O sistema possui um **alerta automático** que aparece se o backend estiver offline:

🔴 **Barra Vermelha no Topo**  
- Aparece automaticamente quando o backend não responde
- Mostra instruções de como resolver
- Link direto para testar a conexão
- Verifica a cada 10 segundos

---

## 🔧 Resolução de Problemas Comuns

### Erro: "Cannot find module 'express'"
**Causa:** Dependências não instaladas  
**Solução:**
```bash
npm install
cd client
npm install
cd ..
```

### Erro: "Port 3000 is already in use"
**Causa:** Backend já está rodando  
**Solução:**
```batch
PARAR_SISTEMA.bat
INICIAR_SISTEMA_COMPLETO.bat
```

### Erro: "Failed to load resource: 404"
**Causa:** Backend não está rodando  
**Solução:**
```batch
DIAGNOSTICO_SISTEMA.bat
# Seguir instruções
```

### Erro: "Network Error" ou "ECONNREFUSED"
**Causa:** Backend não acessível  
**Solução:**
1. Verifique se o backend está rodando
2. Confirme que está na porta 3000
3. Teste: http://localhost:3000/health

---

## 📝 Workflow Recomendado

### Primeira Vez
```
1. npm install (na raiz)
2. cd client && npm install (no frontend)
3. INICIAR_SISTEMA_COMPLETO.bat
4. Aguardar ~10 segundos
5. Acessar http://localhost:5173
6. Fazer login com superadmin
```

### Uso Diário
```
1. INICIAR_SISTEMA_COMPLETO.bat
2. Aguardar backend inicializar
3. Acessar http://localhost:5173
4. Trabalhar normalmente
5. PARAR_SISTEMA.bat quando terminar
```

### Desenvolvimento
```
# Terminal 1
npm run dev  # Backend com auto-reload

# Terminal 2
cd client
npm run dev  # Frontend com hot-reload

# Os dois ficam rodando e recarregam automaticamente
```

---

## 💾 Dados do Sistema

### MongoDB Memory Server
- **Tipo:** Banco de dados em memória
- **Persistência:** ❌ Dados são perdidos ao reiniciar
- **Velocidade:** ⚡ Muito rápido
- **Uso:** Ideal para desenvolvimento

**Importante:** Cada vez que você reiniciar o backend:
- Usuários de teste são recriados
- Dados anteriores são perdidos
- Super Admin é recriado automaticamente

### Migrar para MongoDB Real (Produção)
Se quiser dados persistentes, configure no `.env`:
```env
MONGODB_URI=mongodb://localhost:27017/prescrimed
# ou
MONGODB_URI=mongodb+srv://seu-usuario:senha@cluster.mongodb.net/prescrimed
```

---

## 🎨 Funcionalidades Disponíveis

✅ **Dashboard** - Visão geral do sistema  
✅ **Pacientes** - Cadastro e gestão de pacientes  
✅ **Prescrições** - Criação de prescrições médicas  
✅ **Agenda** - Calendário de consultas  
✅ **Cronograma** - Planejamento de atividades  
✅ **Estoque** - Controle de medicamentos  
✅ **Financeiro** - Gestão financeira  
✅ **Usuários** - Gerenciamento de usuários  
✅ **Empresas** - Multi-tenancy (várias empresas)  
✅ **Configurações** - Personalização do sistema

---

## 🔐 Segurança

- ✅ Autenticação JWT
- ✅ Senhas criptografadas (bcrypt)
- ✅ CORS configurado
- ✅ Helmet (segurança HTTP)
- ✅ Tokens com expiração
- ✅ Refresh tokens

---

## 📱 URLs Úteis

| Recurso | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:3000 |
| Health Check | http://localhost:3000/health |
| API Auth | http://localhost:3000/api/auth/login |
| API Usuários | http://localhost:3000/api/usuarios |

---

## 🆘 Precisa de Ajuda?

1. **Diagnóstico:** Execute `DIAGNOSTICO_SISTEMA.bat`
2. **Erros 404/400:** Leia `SOLUCAO_ERROS_API.md`
3. **Logs:** Verifique os terminais do backend e frontend
4. **Health Check:** Teste http://localhost:3000/health

---

## ✅ Checklist de Verificação

Antes de reportar problemas, verifique:

- [ ] Node.js instalado (`node -v`)
- [ ] NPM instalado (`npm -v`)
- [ ] Dependências instaladas (`npm install`)
- [ ] Backend rodando (verifique terminal)
- [ ] Frontend rodando (verifique terminal)
- [ ] Porta 3000 disponível
- [ ] Porta 5173 disponível
- [ ] Nenhum erro nos terminais
- [ ] Health check funcionando
- [ ] Console do navegador sem erros

---

## 🎯 Resumo: 3 Passos

```
1. INICIAR_SISTEMA_COMPLETO.bat
2. Aguardar 10 segundos
3. Acessar http://localhost:5173
```

✨ **Pronto! Sistema funcionando!**
