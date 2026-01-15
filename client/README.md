# 🎨 Prescrimed Frontend

Frontend React responsivo e profissional para o Sistema Prescrimed.

## 🚀 Deploy Rápido

### Railway (3 minutos)
```bash
1. Railway > New Project > GitHub
2. Settings > Root Directory: client
3. Variables > VITE_API_URL=https://backend.up.railway.app/api
4. Aguardar deploy
```
📚 [Guia Completo](./RAILWAY_FRONTEND_GUIA.md) | [Quick Start](./RAILWAY_QUICK_START.md)

### Netlify (Recomendado)
```bash
Build command: npm run build
Publish directory: client/dist
Environment: VITE_API_URL=https://backend.up.railway.app/api
```

## 📱 Layout Responsivo

### Mobile (<768px)
- Sidebar overlay
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

## 🛠️ Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Dev server
npm run dev
# Acesse: http://localhost:5173

# Build
npm run build

# Preview build
npm run preview
```

## 🎨 Design System

**Cores:**
- Primary: #52b788 (Green)
- Dark: #2d5016 / #1a3d0a
- Gradientes profissionais

**Componentes:**
- Botões com gradientes
- Cards rounded-3xl
- Inputs com focus rings
- Sidebar com backdrop

## 🔧 Configurações

**Vite:** Build otimizado, code splitting  
**Tailwind:** Mobile-first, customizado  
**React:** 18.2.0 com Router 6.21  
**Estado:** Zustand para gerenciamento  

## ✅ Features

- ✅ Layout 100% responsivo
- ✅ Touch targets 44px+
- ✅ Code splitting automático
- ✅ Assets otimizados
- ✅ SEO ready
- ✅ Acessibilidade WCAG
- ✅ Performance 90+ (Lighthouse)

## 📚 Documentação

- [Deploy Railway](./RAILWAY_FRONTEND_GUIA.md) - Guia completo
- [Quick Start](./RAILWAY_QUICK_START.md) - 3 minutos
- [Resumo](./RESUMO_CONFIGURACAO.md) - Configurações

## 🌐 Stack

- React 18.2
- Vite 5.0
- TailwindCSS 3.4
- React Router 6.21
- Zustand 4.4
- Axios 1.6
- Lucide Icons

## 📊 Performance

- Build: ~30-60s
- Bundle: ~200KB gzip
- FCP: < 1.5s
- LCP: < 2.5s
- Lighthouse: 90+

---

**Frontend pronto para produção! 🚀**
