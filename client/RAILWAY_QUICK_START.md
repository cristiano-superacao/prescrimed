# 🎨 Frontend Railway - Quick Start

## Deploy Frontend em 3 Minutos

### 1️⃣ Criar Projeto Railway (1 min)

```bash
# 1. Acesse: https://railway.app
# 2. New Project > Deploy from GitHub
# 3. Selecione: prescrimed-main
# 4. Settings > Build
#    Root Directory: client
# 5. Save
```

### 2️⃣ Configurar Variáveis (1 min)

Railway Dashboard > Variables:

```env
VITE_API_URL=https://seu-backend.up.railway.app/api
NODE_ENV=production
```

### 3️⃣ Aguardar Deploy (1 min)

- Build automático inicia
- Aguarde 2-3 minutos
- URL gerada automaticamente

### ✅ Testar

1. Acesse: `https://seu-frontend.up.railway.app`
2. Login: `admin@sistema.com` / `Admin@123`
3. Verifique responsividade (F12 > Device Toolbar)

## 🎯 Arquivos Já Configurados

- ✅ `railway.json` - Config Railway
- ✅ `nixpacks.toml` - Build setup
- ✅ `vite.config.js` - Preview server 0.0.0.0
- ✅ `.env.railway` - Template variáveis
- ✅ `package.json` - Scripts Railway

## 📱 Layout Responsivo Garantido

### Mobile (<768px)
- Sidebar overlay com backdrop
- Grid 1 coluna
- Botões 44px+ (touch-friendly)
- Header compacto

### Tablet (768-1024px)
- Sidebar colapsável
- Grid 2-3 colunas
- Padding intermediário

### Desktop (>1024px)
- Sidebar fixa (288px)
- Grid 2-4 colunas
- Espaçamento amplo

## 🚀 Alternativa Recomendada

**Frontend: Netlify (Gratuito)**
```bash
# Build command: npm run build
# Publish directory: client/dist
# VITE_API_URL: https://backend.up.railway.app/api
```

**Backend: Railway**
```bash
# Apenas o backend no Railway
# Frontend static no Netlify
# Melhor performance + custo zero
```

## 🐛 Problemas?

### Build falha
```bash
# Verifique Root Directory está como: client
# Teste local: cd client && npm run build
```

### Layout quebrado
```bash
# Limpe cache: Deployments > Redeploy
# Verifique: viewport meta tag
```

### API não conecta
```bash
# Confirme VITE_API_URL correta
# Teste: curl https://backend.up.railway.app/health
```

## 📚 Guia Completo

[RAILWAY_FRONTEND_GUIA.md](./RAILWAY_FRONTEND_GUIA.md)

---

**Frontend configurado e responsivo! 🎨**
