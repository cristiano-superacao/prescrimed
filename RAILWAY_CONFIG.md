# Railway Configuration for Prescrimed

# 1. Backend Service (API + Static Frontend)

## Variables
```
NODE_ENV=production
PORT=3000
JWT_SECRET=<generate-strong-secret-32-chars>
JWT_REFRESH_SECRET=<generate-strong-secret-32-chars>
SESSION_TIMEOUT=8h
FRONTEND_URL=https://prescrimed.netlify.app
ALLOWED_ORIGINS=https://prescrimed.netlify.app,https://prescrimed.up.railway.app
FORCE_SYNC=true
```

## Build Command
```
npm install --production=false && npm run build:full
```

## Start Command
```
npm start
```

## Root Directory
```
/
```

## Healthcheck
```
/health
```

---

# 2. PostgreSQL Database (Adicionar via Railway)

Railway automatically provides:
- DATABASE_URL
- PGHOST
- PGPORT
- PGUSER
- PGPASSWORD
- PGDATABASE

---

# 3. Deploy Steps

1. **Criar Projeto no Railway**
   - New Project > Deploy from GitHub
   - Selecionar repositório prescrimed

2. **Adicionar PostgreSQL**
   - New > Database > PostgreSQL
   - Aguardar provisionamento

3. **Configurar Variáveis Backend**
   - Settings > Variables
   - Adicionar todas as variáveis acima
   - DATABASE_URL é fornecida automaticamente

4. **Primeiro Deploy**
   - Defina FORCE_SYNC=true
   - Deploy automático via git push
   - Aguardar criação de tabelas

5. **Pós-Deploy**
   - Remover FORCE_SYNC=true (ou definir false)
   - Validar /health endpoint
   - Verificar logs

---

# 4. Frontend Separado (Opcional - Netlify)

Se preferir servir frontend via Netlify:

## netlify.toml (client/)
```toml
[build]
  base = "client"
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## Environment Variables (Netlify)
```
VITE_API_URL=https://prescrimed-backend.up.railway.app/api
```

---

# 5. URLs Finais

- Backend API: https://prescrimed-backend.up.railway.app/api
- Health Check: https://prescrimed-backend.up.railway.app/health
- Frontend (se Railway): https://prescrimed-backend.up.railway.app
- Frontend (se Netlify): https://prescrimed.netlify.app
- Landing Page: https://prescrimed-backend.up.railway.app/web

---

# 6. Custom Domain (Opcional)

Railway:
- Settings > Networking > Custom Domain
- Adicionar prescrimed.com
- Configurar DNS CNAME

---

# 7. Monitoramento

- Logs: Railway Dashboard > Deployments > Logs
- Metrics: Railway Dashboard > Metrics
- Database: Railway Dashboard > PostgreSQL > Data

---

# 8. Rollback

```bash
# Via Railway CLI
railway rollback

# Via Dashboard
Deployments > Select Previous > Redeploy
```

---

# 9. CI/CD

Railway faz deploy automático em:
- Push para branch main
- Merge de pull requests
- Tags git

---

# 10. Custos Estimados

- Hobby Plan: $5/mês (500 horas execução)
- Pro Plan: $20/mês (uso ilimitado)
- PostgreSQL: Incluído no plano

---

**Desenvolvido com ❤️ para profissionais de saúde**
