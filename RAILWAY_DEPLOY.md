# Deploy Railway - Prescrimed PostgreSQL

## 🚀 Como Fazer Deploy no Railway

### 1. Criar Conta e Projeto
```bash
# Login no Railway
railway login

# Criar novo projeto
railway init
```

### 2. Adicionar PostgreSQL
- No dashboard do Railway, clique em "New" → "Database" → "PostgreSQL"
- O Railway criará automaticamente a variável `DATABASE_URL`

### 3. Configurar Variáveis de Ambiente

No Railway Dashboard, adicione:

```env
NODE_ENV=production
PORT=3000
JWT_SECRET=sua-chave-secreta-super-segura-aqui
JWT_REFRESH_SECRET=sua-chave-refresh-super-segura-aqui
SESSION_TIMEOUT=8h
FRONTEND_URL=https://seu-frontend.netlify.app
ALLOWED_ORIGINS=https://seu-frontend.netlify.app,https://prescrimed.up.railway.app
```

**⚠️ IMPORTANTE:** O Railway fornece `DATABASE_URL` automaticamente quando você adiciona PostgreSQL.

### 4. Deploy

```bash
# Deploy via CLI
railway up

# Ou conecte seu repositório GitHub no Dashboard
# Railway fará deploy automaticamente a cada push
```

### 5. Verificar Logs

```bash
railway logs
```

### 6. Abrir Aplicação

```bash
railway open
```

## 🔍 Diagnóstico de Problemas

### Backend Offline

Se o frontend mostrar "Backend Offline":

1. **Verificar Logs:**
```bash
railway logs
```

2. **Verificar Variáveis:**
- Confirme que `DATABASE_URL` existe (criada automaticamente pelo Railway)
- Verifique se `JWT_SECRET` e `JWT_REFRESH_SECRET` estão configurados

3. **Verificar Health Check:**
```bash
curl https://seu-app.up.railway.app/health
```

Deve retornar:
```json
{
  "status": "ok",
  "database": "connected",
  "uptime": 123.45,
  "timestamp": "2026-01-16T..."
}
```

4. **Erros Comuns:**

**Erro:** `connection refused` ou `ETIMEDOUT`
- **Solução:** Verifique se o PostgreSQL está ativo no Railway

**Erro:** `SSL connection required`
- **Solução:** Já configurado no `config/database.js` com SSL

**Erro:** `authentication failed`
- **Solução:** Railway gerencia as credenciais automaticamente via `DATABASE_URL`

**Erro:** `port already in use`
- **Solução:** Railway define `PORT` automaticamente (variável de ambiente)

### Rebuild Forçado

Se mudanças não aparecerem:

```bash
# Via CLI
railway up --detach

# Ou no Dashboard: Settings → Trigger Deploy
```

## 📋 Checklist de Deploy

- [ ] PostgreSQL adicionado ao projeto Railway
- [ ] Variáveis de ambiente configuradas (JWT_SECRET, etc.)
- [ ] Código commitado no repositório
- [ ] Deploy realizado (`railway up` ou via GitHub)
- [ ] Logs verificados sem erros
- [ ] Health check respondendo (status 200)
- [ ] Frontend atualizado com URL do Railway backend

## 🔗 URLs Importantes

- **Backend:** `https://prescrimed.up.railway.app`
- **Health:** `https://prescrimed.up.railway.app/health`
- **API:** `https://prescrimed.up.railway.app/api`

## 🎯 Próximos Passos

1. Configure o frontend para usar a URL do Railway:
```javascript
// client/.env.production
VITE_API_URL=https://prescrimed.up.railway.app/api
```

2. Deploy do frontend (Netlify/Vercel)

3. Configure CORS no backend com a URL do frontend em produção

## 💡 Dicas

- Railway oferece $5/mês de crédito gratuito
- PostgreSQL pode precisar de upgrade para uso intenso
- Use logs para debugging: `railway logs -f` (follow)
- Backup do banco: Railway tem backups automáticos no plano pago

## 🆘 Suporte

- Docs: https://docs.railway.app
- Discord: https://discord.gg/railway
- GitHub: https://github.com/railwayapp/railway
