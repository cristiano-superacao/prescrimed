# ⚡ Deploy Netlify - Quick Start

## 🚀 Deploy em 3 Passos

### 1. Verificar Backend Railway Está Online

```bash
# Testar backend
curl https://prescrimed-backend-production.up.railway.app/health
```

✅ Deve retornar: `{"status":"ok","timestamp":"..."}`

### 2. Conectar Netlify ao GitHub

1. Acesse: https://app.netlify.com/projects/precrimed
2. **Import from Git** (se ainda não conectado)
3. Selecione: **cristiano-superacao/prescrimed**
4. As configurações já estão em `client/netlify.toml`

### 3. Configurar Variável de Ambiente

No Netlify Dashboard:

```
Site settings > Environment variables > Add variable

Key: VITE_API_URL
Value: /api
```

**Salvar** e fazer **Deploy**!

## ✅ Build Settings (Automático via netlify.toml)

```
Base directory: client
Build command: npm run build
Publish directory: client/dist
Node version: 18
```

## 🎯 URLs

**Frontend:** https://precrimed.netlify.app  
**Backend:** https://prescrimed-backend-production.up.railway.app

## 🔧 Se Build Falhar

### Erro: Dependências
```bash
# No Netlify Environment Variables, adicionar:
NPM_FLAGS=--legacy-peer-deps
```

### Erro: API não conecta
```bash
# Verificar netlify.toml tem o redirect correto:
[[redirects]]
  from = "/api/*"
  to = "https://prescrimed-backend-production.up.railway.app/api/:splat"
```

### Erro: Layout quebrado
```bash
# Limpar cache no Netlify:
Deploys > Trigger deploy > Clear cache and deploy
```

## 📱 Testar Após Deploy

1. **Login:** `admin@sistema.com` / `Admin@123`
2. **Mobile:** F12 > Device toolbar > iPhone
3. **Tablet:** iPad
4. **Desktop:** Full screen

## ✅ Checklist

- [ ] Backend Railway online
- [ ] Netlify conectado ao GitHub
- [ ] VITE_API_URL configurada
- [ ] Build passou
- [ ] Site acessível
- [ ] Login funciona
- [ ] Mobile responsivo
- [ ] Tablet responsivo
- [ ] Desktop responsivo

---

## 📚 Documentação Completa

Ver: [NETLIFY_DEPLOY.md](./NETLIFY_DEPLOY.md)

**Deploy pronto em ~3 minutos! 🚀**
