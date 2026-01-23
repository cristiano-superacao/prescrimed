# ⚙️ Configuração Railway - prescrimed.up.railway.app

## 🎯 URL Configurada
**Aplicação:** https://prescrimed.up.railway.app

## 📋 Variáveis de Ambiente Necessárias

### Backend (Serviço Principal)

Configure estas variáveis no **Railway Dashboard** → **Seu Serviço** → **Variables**:

```bash
# Database (criado automaticamente pelo plugin PostgreSQL)
DATABASE_URL=postgres://user:password@host:port/database

# Segurança (OBRIGATÓRIO)
JWT_SECRET=seu-segredo-super-forte-aqui
JWT_REFRESH_SECRET=outro-segredo-diferente-aqui
SESSION_TIMEOUT=8h

# CORS / Frontend
FRONTEND_URL=https://prescrimed.up.railway.app
CORS_ORIGIN=https://prescrimed.up.railway.app
ALLOWED_ORIGINS=https://prescrimed.up.railway.app,https://prescrimed-production.up.railway.app

# Ambiente
NODE_ENV=production

# Sincronização (apenas primeiro deploy)
# FORCE_SYNC=true  # Descomente APENAS no primeiro deploy, depois remova
```

### Frontend (Variáveis do Build)

O frontend está configurado para usar **URL relativa** (`/api`), portanto não precisa de variáveis adicionais. O arquivo `.env.railway` já está correto.

Se precisar configurar algo específico:
```bash
VITE_API_URL=/api
VITE_BACKEND_ROOT=https://prescrimed.up.railway.app
```

## 🚀 Deploy

### 1. Conectar Repositório
```bash
# No Railway Dashboard:
1. New Project → Deploy from GitHub repo
2. Selecione: cristiano-superacao/prescrimed
3. Branch: main
```

### 2. Adicionar PostgreSQL
```bash
# No seu serviço:
1. Clique em "New" → Database → Add PostgreSQL
2. A variável DATABASE_URL será criada automaticamente
```

### 3. Configurar Variáveis
```bash
# Variables tab:
1. Adicione JWT_SECRET (gere com: openssl rand -base64 32)
2. Adicione JWT_REFRESH_SECRET (diferente do anterior)
3. Adicione FRONTEND_URL=https://prescrimed.up.railway.app
4. Adicione CORS_ORIGIN=https://prescrimed.up.railway.app
5. Adicione NODE_ENV=production
```

### 4. Primeiro Deploy
```bash
# Apenas no PRIMEIRO deploy, adicione temporariamente:
FORCE_SYNC=true

# Após o deploy ser bem-sucedido, REMOVA esta variável
```

### 5. Verificar
```bash
# Acesse:
https://prescrimed.up.railway.app/health

# Deve retornar:
{
  "status": "ok",
  "database": "connected",
  "uptime": 123.45,
  "timestamp": "2026-01-23T..."
}
```

## 🔐 Criar Superadmin

Após o primeiro deploy bem-sucedido:

```bash
# No Railway Dashboard → Serviço → Shell (ou localmente via Railway CLI):
node scripts/create-superadmin.js
```

Credenciais padrão:
- **Email:** superadmin@prescrimed.com
- **Senha:** Admin@123456

⚠️ **IMPORTANTE:** Altere a senha imediatamente após o primeiro login!

## 🌐 CORS Configurado

O sistema está pré-configurado para aceitar requisições de:

✅ https://prescrimed.up.railway.app
✅ https://prescrimed-production.up.railway.app
✅ http://localhost:5173 (desenvolvimento)
✅ http://localhost:3000 (desenvolvimento)
✅ Domínio do Railway (via `RAILWAY_PUBLIC_DOMAIN`)

## 📊 Monitoramento

### Health Check
```bash
GET https://prescrimed.up.railway.app/health
```

### Logs
```bash
# Railway Dashboard → Serviço → Deployments → View Logs
```

### Métricas
```bash
# Railway Dashboard → Serviço → Metrics
```

## 🔄 Atualizações

### Deploy Automático
Todo push na branch `main` dispara deploy automático.

### Deploy Manual
```bash
# Railway Dashboard → Serviço → Deployments → Deploy
```

### Rollback
```bash
# Railway Dashboard → Serviço → Deployments → Selecione deploy anterior → Rollback
```

## 🆘 Troubleshooting

### Erro: "Database connection failed"
```bash
✅ Verifique se o plugin PostgreSQL está adicionado
✅ Confirme que DATABASE_URL está definida
✅ Aguarde 2-3 minutos após adicionar o banco
```

### Erro: "CORS blocked"
```bash
✅ Verifique FRONTEND_URL e CORS_ORIGIN
✅ Certifique-se que usa HTTPS (não HTTP)
✅ Verifique se a URL está sem barra final
```

### Erro: "JWT_SECRET not defined"
```bash
✅ Adicione JWT_SECRET no Variables
✅ Adicione JWT_REFRESH_SECRET
✅ Faça novo deploy
```

### Build falha
```bash
✅ Verifique logs no Railway Dashboard
✅ Confirme que package.json e package-lock.json estão commitados
✅ Verifique se client/package.json também está commitado
```

## 📱 Layout Responsivo

O sistema mantém **layout responsivo e profissional** em todos os dispositivos:

✅ **Desktop** (1920x1080+): Layout completo com sidebars
✅ **Tablet** (768-1024px): Layout adaptado
✅ **Mobile** (320-767px): Layout compacto com menu hambúrguer
✅ **Tailwind CSS**: Classes responsivas (`sm:`, `md:`, `lg:`, `xl:`)

## 🔗 Links Úteis

- **Aplicação:** https://prescrimed.up.railway.app
- **Health Check:** https://prescrimed.up.railway.app/health
- **API Base:** https://prescrimed.up.railway.app/api
- **GitHub:** https://github.com/cristiano-superacao/prescrimed
- **Railway Docs:** https://docs.railway.app

## ✅ Checklist Final

- [ ] Repositório conectado ao Railway
- [ ] PostgreSQL plugin adicionado
- [ ] Variáveis de ambiente configuradas
- [ ] FRONTEND_URL = https://prescrimed.up.railway.app
- [ ] CORS_ORIGIN = https://prescrimed.up.railway.app
- [ ] JWT_SECRET definido
- [ ] JWT_REFRESH_SECRET definido
- [ ] Primeiro deploy com FORCE_SYNC=true
- [ ] FORCE_SYNC removido após primeiro deploy
- [ ] /health retorna "ok"
- [ ] Superadmin criado
- [ ] Senha padrão alterada
- [ ] Layout responsivo verificado

---

**Sistema pronto para produção no Railway! 🚀**
