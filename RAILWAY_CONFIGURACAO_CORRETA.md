# ✅ Configuração Correta do Railway - Checklist Completo

## 📊 Análise das Imagens Fornecidas

### ❌ Problemas Identificados:

1. **PostgreSQL sem tabelas criadas** (Imagem 4 - "Você não tem mesas")
   - O Sequelize não está criando as tabelas automaticamente
   - Faltando sync() em produção ou problemas de conexão

2. **Variáveis duplicadas e desnecessárias**
   - Frontend (cliente) tem 21 variáveis, muitas desnecessárias
   - Backend tem variáveis em português (DOMÍNIO_PÚBLICO_FERROVIÁRIO ao invés de RAILWAY_PUBLIC_DOMAIN)

3. **Variáveis críticas possivelmente ausentes**
   - DATABASE_URL precisa estar no serviço backend principal
   - NODE_ENV=production precisa estar configurado

---

## 🔧 Variáveis Corretas por Serviço

### 1️⃣ Serviço Backend (Principal) - OBRIGATÓRIAS

```env
# Ambiente
NODE_ENV=production

# JWT (gere senhas fortes únicas)
JWT_SECRET=sua-senha-super-secreta-minimo-32-caracteres-aqui-2026
JWT_REFRESH_SECRET=outra-senha-diferente-para-refresh-tokens-2026
SESSION_TIMEOUT=8h

# Frontend URL (se frontend separado)
FRONTEND_URL=https://seu-frontend.netlify.app
ALLOWED_ORIGINS=https://seu-frontend.netlify.app,https://prescrimed.netlify.app

# DATABASE_URL é fornecida AUTOMATICAMENTE pelo Railway quando você adiciona PostgreSQL
# NÃO adicione manualmente, o Railway injeta automaticamente!
```

### 2️⃣ Serviço PostgreSQL - Railway Gerencia Automaticamente

**NÃO configure variáveis manualmente!** O Railway cria automaticamente:
- `DATABASE_URL` (connection string completa)
- `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`

Essas variáveis são **automaticamente injetadas** no serviço backend quando você:
1. Adiciona PostgreSQL no projeto Railway
2. Conecta o PostgreSQL ao serviço backend

### 3️⃣ Serviço Frontend (Cliente) - SE SEPARADO

```env
# APENAS estas variáveis:
VITE_API_URL=https://seu-backend.up.railway.app/api
VITE_BACKEND_ROOT=https://seu-backend.up.railway.app
```

**⚠️ IMPORTANTE:** Frontend NÃO deve ter:
- ❌ DATABASE_URL (vulnerabilidade de segurança!)
- ❌ JWT_SECRET (nunca exponha secrets no frontend!)
- ❌ Credenciais de banco de dados

---

## 🚀 Passo a Passo para Corrigir

### **Passo 1: Limpar Variáveis Desnecessárias**

No Railway Dashboard:

1. **Serviço Backend:**
   - Mantenha APENAS: `NODE_ENV`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `SESSION_TIMEOUT`
   - DELETE: `PGDATABASE`, `PGPORT`, `DOMÍNIO_PÚBLICO_FERROVIÁRIO` (Railway gerencia automaticamente)

2. **Serviço Frontend (se separado):**
   - Mantenha APENAS: `VITE_API_URL`, `VITE_BACKEND_ROOT`
   - DELETE: `DATABASE_URL`, `JWT_SECRET`, `CORS_ORIGIN`, e todas outras variáveis de backend

### **Passo 2: Conectar PostgreSQL ao Backend**

1. No Railway Dashboard, vá para o serviço **PostgreSQL**
2. Clique na aba **"Implantações"** ou **"Connect"**
3. **Conecte o PostgreSQL ao serviço Backend**
4. Railway automaticamente injetará `DATABASE_URL` no backend

### **Passo 3: Verificar Conexão DATABASE_URL**

1. No serviço Backend, aba **"Variáveis"**
2. **Verifique se apareceu `DATABASE_URL`** (começa com `postgresql://`)
3. Se não apareceu, repita Passo 2

### **Passo 4: Forçar Criação das Tabelas**

**Opção A: Alterando temporariamente o sync (RECOMENDADO)**

1. Adicione temporariamente no Railway (Variáveis do Backend):
   ```
   FORCE_SYNC=true
   ```

2. No arquivo `server.js`, altere temporariamente a linha 45:
   ```javascript
   // ANTES:
   await sequelize.sync({ force: false });
   
   // DEPOIS (temporário):
   await sequelize.sync({ 
     alter: process.env.FORCE_SYNC === 'true' ? true : false 
   });
   ```

3. Commit e push:
   ```bash
   git add server.js
   git commit -m "feat(db): add FORCE_SYNC option for table creation"
   git push origin master
   ```

4. Railway fará redeploy automático e criará as tabelas

5. **DEPOIS que as tabelas forem criadas:**
   - Delete a variável `FORCE_SYNC` do Railway
   - Reverta a alteração no `server.js` (ou mantenha como está)

**Opção B: Script Manual de Criação**

1. Acesse o Railway CLI:
   ```bash
   railway login
   railway link
   railway run node scripts/create-tables.js
   ```

2. Ou use a aba "Console" no Railway Dashboard para executar comandos SQL

### **Passo 5: Testar Conexão e Tabelas**

1. Acesse: `https://seu-backend.up.railway.app/health`
2. Deve retornar:
   ```json
   {
     "status": "ok",
     "database": "connected",
     "uptime": 123.45,
     "timestamp": "2026-01-16T..."
   }
   ```

3. No Railway Dashboard, aba **"Logs"** do Backend:
   - Procure: `✅ PostgreSQL conectado com sucesso`
   - Procure: `✅ Tabelas sincronizadas` ou `✅ Modelos sincronizados`

4. No Railway Dashboard, PostgreSQL → aba **"Banco de dados"**:
   - Execute query: `SELECT * FROM pg_tables WHERE schemaname = 'public';`
   - Deve listar: `empresas`, `usuarios`, `pacientes`, `prescricoes`

---

## 🔍 Verificação das Tabelas no PostgreSQL Railway

### Método 1: Via Railway Dashboard (Visual)

1. Acesse o serviço **PostgreSQL**
2. Clique na aba **"Banco de dados"**
3. No campo de query SQL, execute:
   ```sql
   SELECT tablename FROM pg_tables WHERE schemaname = 'public';
   ```
4. Deve mostrar 4 tabelas:
   - `empresas`
   - `usuarios`
   - `pacientes`
   - `prescricoes`

### Método 2: Via Railway CLI

```bash
railway login
railway link
railway connect postgres
# Depois dentro do psql:
\dt
```

### Método 3: Via Logs do Backend

No Railway Dashboard, aba "Logs" do Backend, procure por:
```
Executing (default): CREATE TABLE IF NOT EXISTS "empresas"
Executing (default): CREATE TABLE IF NOT EXISTS "usuarios"
Executing (default): CREATE TABLE IF NOT EXISTS "pacientes"
Executing (default): CREATE TABLE IF NOT EXISTS "prescricoes"
```

---

## 🔐 Gerando JWT Secrets Seguros

**NÃO use `dev-secret-change-me` em produção!**

### No PowerShell (Windows):
```powershell
# JWT_SECRET
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 64 | % {[char]$_})

# JWT_REFRESH_SECRET (execute novamente para gerar diferente)
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 64 | % {[char]$_})
```

### Online (alternativa):
1. Acesse: https://www.uuidgenerator.net/api/guid
2. Copie 2 GUIDs diferentes
3. Use como JWT_SECRET e JWT_REFRESH_SECRET

---

## 🌐 Configuração de CORS

O código atual já está correto e aceita:
- ✅ `https://prescrimed.netlify.app`
- ✅ `https://precrimed.netlify.app`
- ✅ `https://prescrimer.netlify.app`
- ✅ Qualquer URL em `FRONTEND_URL`
- ✅ Qualquer URL em `ALLOWED_ORIGINS` (separadas por vírgula)

**Exemplo de ALLOWED_ORIGINS:**
```env
ALLOWED_ORIGINS=https://app1.com,https://app2.com,https://outro-dominio.com
```

---

## 📝 Checklist Final - Antes de Deploy

- [ ] PostgreSQL adicionado ao projeto Railway
- [ ] PostgreSQL conectado ao serviço Backend
- [ ] `DATABASE_URL` aparece nas variáveis do Backend
- [ ] `NODE_ENV=production` configurado
- [ ] `JWT_SECRET` e `JWT_REFRESH_SECRET` com senhas fortes únicas
- [ ] `FRONTEND_URL` configurada (se frontend separado)
- [ ] Frontend NÃO tem variáveis sensíveis (DATABASE_URL, JWT_SECRET)
- [ ] Logs do Backend mostram "PostgreSQL conectado com sucesso"
- [ ] Endpoint `/health` retorna `"database": "connected"`
- [ ] Tabelas criadas no PostgreSQL (verificar via query ou Dashboard)

---

## 🐛 Troubleshooting

### Problema: "database: connecting" em /health

**Causa:** `DATABASE_URL` não está configurada ou incorreta

**Solução:**
1. Verifique se PostgreSQL está conectado ao Backend
2. Verifique se `DATABASE_URL` aparece nas variáveis
3. Veja logs: procure por `DATABASE_URL` ou mensagens de erro

### Problema: Tabelas não aparecem no PostgreSQL

**Causa:** `sequelize.sync()` não executou em produção

**Solução:**
- Use o **Passo 4 - Opção A** acima (adicionar `FORCE_SYNC=true` temporariamente)

### Problema: CORS bloqueando requisições

**Causa:** URL do frontend não está em `ALLOWED_ORIGINS`

**Solução:**
```env
ALLOWED_ORIGINS=https://seu-frontend-real.netlify.app
```

### Problema: Erro 500 em todas as rotas

**Causa:** `JWT_SECRET` não configurado

**Solução:**
- Configure `JWT_SECRET` e `JWT_REFRESH_SECRET` no Railway

---

## 🎯 Estrutura Final Recomendada

```
Railway Projeto: prescrimed
├── Serviço: Backend (Node.js)
│   ├── Variáveis:
│   │   ├── NODE_ENV=production
│   │   ├── JWT_SECRET=... (64 caracteres)
│   │   ├── JWT_REFRESH_SECRET=... (64 caracteres diferentes)
│   │   ├── SESSION_TIMEOUT=8h
│   │   └── FRONTEND_URL=https://prescrimed.netlify.app
│   └── DATABASE_URL (injetada automaticamente)
│
├── Serviço: PostgreSQL
│   └── (Conectado ao Backend - Railway gerencia tudo)
│
└── Frontend (Netlify separado - opcional)
    └── Variáveis:
        ├── VITE_API_URL=https://prescrimed.up.railway.app/api
        └── VITE_BACKEND_ROOT=https://prescrimed.up.railway.app
```

---

## ✅ Como Saber que Está Tudo Certo

1. **Logs do Backend sem erros:**
   ```
   📡 Usando DATABASE_URL do Railway/Render (PostgreSQL)
   ✅ PostgreSQL conectado com sucesso
   ✅ Modelos sincronizados (produção)
   🎉 Sistema pronto para uso!
   🚀 Servidor Ativo na porta 3000
   ```

2. **Health Check funcionando:**
   ```bash
   curl https://seu-backend.up.railway.app/health
   # Resposta: {"status":"ok","database":"connected",...}
   ```

3. **Tabelas existem:**
   - Railway PostgreSQL → Banco de dados → Query: `\dt` mostra 4 tabelas

4. **Frontend conecta ao backend:**
   - Abra frontend → DevTools Console → Sem erros CORS
   - Login/registro funcionam

---

## 📞 Suporte

Se após seguir este guia ainda houver problemas:

1. Capture logs do Railway (aba "Logs" do Backend)
2. Verifique variáveis de ambiente (aba "Variáveis")
3. Teste health endpoint: `https://seu-backend.up.railway.app/health`
4. Compartilhe os resultados para diagnóstico detalhado
