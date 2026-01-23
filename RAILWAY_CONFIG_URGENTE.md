# ⚠️ IMPORTANTE: Configuração Railway Pendente

## 🔴 Problema Atual
O serviço Railway está retornando **405 Method Not Allowed** para rotas `/api/*`, indicando que o Node.js não está executando corretamente ou o serviço está em modo "static files only".

## ✅ Solução: Configurar Railway Corretamente

### Passo 1: Verificar Serviço "prescrito" no Railway

1. **Acesse o Dashboard do Railway**
   - URL: https://railway.app/dashboard

2. **Selecione o projeto "Prescrimed"**

3. **Localize o serviço backend (pode estar chamado "prescrito" ou "prescrimed-main")**

### Passo 2: Configurar Networking

1. **Entre em Settings → Networking**
2. **Habilite "Public Networking"**
3. **Configure o domínio público**:
   - Opção 1: Usar domínio Railway (ex: `prescrito-production.up.railway.app`)
   - Opção 2: Usar domínio customizado

### Passo 3: Verificar Variáveis de Ambiente

**No serviço backend, adicione:**

```env
# Obrigatórias
DATABASE_URL=postgresql://...   # Gerada automaticamente pelo Railway
NODE_ENV=production
PORT=3000

# Segurança
JWT_SECRET=sua_chave_secreta_muito_segura_min_32_chars

# CORS (adicione TODOS os domínios que acessarão a API)
ALLOWED_ORIGINS=https://prescrimed.up.railway.app
```

### Passo 4: Verificar Build e Deploy

1. **Em Settings → Deploy**, verifique:
   - ✅ Build Command: `npm ci --production=false && cd client && npm ci --production=false && npm run build:railway && cd ..`
   - ✅ Start Command: `node server.js`
   - ✅ Health Check Path: `/health`
   - ✅ Health Check Timeout: 100

2. **Se necessário, redeploy o serviço:**
   - Clique em "Deploy" → "Redeploy"

### Passo 5: Validar Backend

```powershell
# Teste 1: Health Check (deve retornar JSON, não HTML)
curl https://prescrimed.up.railway.app/health

# Teste 2: API Health
curl https://prescrimed.up.railway.app/api/health

# Teste 3: Tentar registrar (deve retornar erro específico, não 405)
curl -X POST https://prescrimed.up.railway.app/api/auth/register `
  -H "Content-Type: application/json" `
  -d '{\"nomeEmpresa\":\"Teste\",\"tipoSistema\":\"casa-repouso\"}'
```

**Resultados esperados:**
- ✅ `/health` → JSON com `{"status":"ok",...}`
- ✅ `/api/health` → JSON com `{"status":"ok",...}`
- ✅ `/api/auth/register` → Erro 400 (campos obrigatórios) ou 201 (sucesso)
- ❌ Qualquer 405 → Backend não está rodando!

### Passo 6: Se Ainda Não Funcionar

**Verifique os logs:**
1. Railway Dashboard → Serviço → Logs
2. Procure por:
   - `🚀 Servidor ativo na porta XXX`
   - `✅ Frontend estático disponível`
   - `Database connection failed` (indica problema no DB)

**Problemas comuns:**
- **Erro: `EADDRINUSE`** → Porta em uso (Railway deve definir PORT automaticamente)
- **Erro: `ECONNREFUSED`** → DATABASE_URL incorreta ou Postgres não criado
- **Sem logs de inicialização** → Start command não está executando `node server.js`

### Passo 7: Popular Banco de Dados

**Somente depois que `/api/auth/register` funcionar!**

```powershell
# Local (se tiver Railway CLI)
railway run node scripts/seed-production-data.js

# Ou via API direta (depois que o backend estiver OK)
node scripts/seed-production-data.js
```

## 📊 Checklist de Configuração

### Serviço Backend
- [ ] Networking público habilitado
- [ ] `DATABASE_URL` configurada
- [ ] `JWT_SECRET` configurada
- [ ] `NODE_ENV=production`
- [ ] `ALLOWED_ORIGINS` com domínio correto
- [ ] Start command: `node server.js`
- [ ] Health check: `/health`
- [ ] Logs mostram "Servidor ativo"

### Validação de API
- [ ] `/health` retorna JSON (não HTML)
- [ ] `/api/health` retorna JSON
- [ ] `/api/auth/register` não retorna 405
- [ ] Postgres conectado (ver logs)

### Dados de Teste
- [ ] Script de seed executado com sucesso
- [ ] 3 empresas criadas
- [ ] 9 usuários admin criados
- [ ] 9 residentes/pacientes/pets criados

## 🆘 Se Precisar de Ajuda

1. **Capture os logs do Railway** (últimas 50 linhas)
2. **Teste as URLs acima** e copie as respostas
3. **Verifique se o Postgres está criado e conectado**
4. **Confirme que o serviço está em "Running" (não "Sleeping")**

---

**Nota**: Este é um problema de **configuração do Railway**, não do código. O código está correto (server.js, routes, models, etc.). Precisamos apenas garantir que o Node.js esteja executando no ambiente de produção.
