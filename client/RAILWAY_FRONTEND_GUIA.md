# 🎨 Deploy Frontend no Railway - Guia Completo

## 📋 Visão Geral

Este guia mostra como fazer deploy do **frontend React** do Prescrimed no Railway, mantendo todo o layout responsivo e profissional. O frontend pode ser hospedado no Railway junto com o backend ou separadamente.

## 🎯 Arquitetura Recomendada

### Opção 1: Frontend e Backend Separados (Recomendado)
```
Frontend (Netlify/Vercel)  →  Backend (Railway)
     ↓                              ↓
  React + Vite              Node.js + Express + MongoDB
  Static Hosting            Dynamic + Database
```

### Opção 2: Tudo no Railway
```
Frontend (Railway)  →  Backend (Railway)
     ↓                      ↓
  React Build         Node.js + Express + MongoDB
  Vite Preview        Dynamic + Database
```

## ✅ Configurações Já Aplicadas

### 1. Arquivos de Configuração Criados

- ✅ `railway.json` - Config Railway para frontend
- ✅ `nixpacks.toml` - Build configuration
- ✅ `.env.railway` - Template de variáveis
- ✅ `.env.production.railway` - Variáveis de produção
- ✅ `.railwayignore` - Arquivos excluídos do deploy

### 2. Build Otimizado

**vite.config.js atualizado:**
```javascript
// Preview server configurado para Railway
preview: {
  port: process.env.PORT || 3000,
  host: '0.0.0.0',
  strictPort: false,
}

// Build otimizations
build: {
  minify: 'terser',
  cssCodeSplit: true,
  assetsInlineLimit: 4096,
  chunkSizeWarningLimit: 1000,
}
```

### 3. Layout Responsivo Aprimorado

**index.css melhorado:**
```css
/* Touch-friendly (44px mínimo) */
.btn, .input, .sidebar-item {
  min-height: 44px;
}

/* Responsivo em todos dispositivos */
.card {
  @apply p-4 sm:p-6 md:p-8;
}

/* Utilitários responsivos */
.container-responsive
.grid-responsive
```

### 4. Scripts NPM Adicionados

```json
{
  "build:railway": "vite build",
  "start:railway": "vite preview --host 0.0.0.0 --port ${PORT:-3000}"
}
```

## 🚀 Deploy Frontend no Railway

### Passo 1: Criar Projeto Separado

1. Acesse https://railway.app
2. Clique em **"New Project"**
3. Selecione **"Deploy from GitHub repo"**
4. Escolha o repositório `prescrimed-main`
5. **IMPORTANTE:** Configure o Root Directory:
   - Clique em **Settings**
   - Em **Build**, defina `Root Directory` como `client`
   - Salve as alterações

### Passo 2: Configurar Variáveis de Ambiente

No Railway Dashboard do frontend, vá em **Variables**:

```env
# URL do backend (obrigatório)
VITE_API_URL=https://seu-backend.up.railway.app/api

# Node Environment
NODE_ENV=production

# Build optimizations
VITE_MINIFY=true
VITE_SOURCEMAP=false
```

### Passo 3: Aguardar Deploy

- Railway detectará automaticamente o `railway.json`
- Build levará ~2-3 minutos
- URL será gerada: `https://seu-frontend.up.railway.app`

### Passo 4: Testar

1. Acesse a URL do frontend
2. Verifique se o layout está responsivo
3. Faça login:
   - Email: `admin@sistema.com`
   - Senha: `Admin@123`
4. Teste em diferentes dispositivos/resoluções

## 🎨 Verificação de Responsividade

### Breakpoints Configurados

```css
/* Mobile First */
Base:    < 640px   (Mobile)
sm:     >= 640px   (Mobile L / Tablet P)
md:     >= 768px   (Tablet)
lg:     >= 1024px  (Desktop)
xl:     >= 1280px  (Desktop L)
2xl:    >= 1536px  (Desktop XL)
```

### Componentes Responsivos

#### Layout Principal
```jsx
// Sidebar responsiva
<div className="fixed lg:static w-72 
                transform lg:translate-x-0
                {mobile ? '-translate-x-full' : 'translate-x-0'}">
  <Sidebar />
</div>

// Main content
<main className="p-4 lg:p-8">
  <div className="max-w-6xl mx-auto">
    {/* Content */}
  </div>
</main>
```

#### Cards e Grid
```jsx
// Grid responsivo
<div className="grid grid-cols-1 sm:grid-cols-2 
                lg:grid-cols-3 xl:grid-cols-4 
                gap-4 md:gap-6">
  {/* Cards */}
</div>

// Card com padding responsivo
<div className="card p-4 sm:p-6 md:p-8">
  {/* Content */}
</div>
```

#### Header
```jsx
// Busca oculta em mobile
<div className="hidden sm:block">
  <input type="text" placeholder="Pesquisar..." />
</div>

// Menu mobile
<button className="lg:hidden">
  <Menu />
</button>
```

#### Modais
```jsx
// Modal responsivo
<div className="bg-white rounded-2xl 
                max-w-4xl w-full 
                max-h-[90vh] overflow-y-auto
                m-4">
  {/* Modal content */}
</div>
```

## 🔧 Otimizações Aplicadas

### 1. Performance

**Code Splitting:**
```javascript
manualChunks: {
  vendor: ['react', 'react-dom', 'react-router-dom'],
  ui: ['lucide-react', 'react-hot-toast'],
}
```

**Assets:**
- Minificação com Terser
- CSS code splitting
- Assets inline até 4KB
- Drop console.log em produção

### 2. Acessibilidade

**Touch Targets:**
```css
/* Todos elementos interativos têm 44px+ */
.btn, .input, .sidebar-item {
  min-height: 44px;
}
```

**Contraste:**
- Cores seguem WCAG 2.1 AA
- Gradientes mantêm legibilidade
- Focus rings visíveis

### 3. SEO

**Meta Tags:**
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="Sistema Prescrimed">
```

## 🌐 Alternativa: Deploy no Netlify/Vercel

Se preferir hospedar o frontend em outro serviço:

### Netlify
```bash
# Build settings
Build command: npm run build
Publish directory: client/dist

# Environment variables
VITE_API_URL=https://seu-backend.up.railway.app/api
```

### Vercel
```bash
# Build settings
Framework Preset: Vite
Root Directory: client
Build Command: npm run build
Output Directory: dist

# Environment variables
VITE_API_URL=https://seu-backend.up.railway.app/api
```

## 📱 Testes de Responsividade

### Desktop (1920x1080)
- ✅ Sidebar fixa 288px
- ✅ Grid 4 colunas
- ✅ Espaçamento amplo
- ✅ Header completo

### Tablet (768x1024)
- ✅ Sidebar colapsável
- ✅ Grid 2-3 colunas
- ✅ Padding reduzido
- ✅ Busca visível

### Mobile (375x667)
- ✅ Sidebar overlay
- ✅ Grid 1 coluna
- ✅ Header compacto
- ✅ Botões grandes

### Comandos de Teste

```bash
# Chrome DevTools
F12 > Toggle device toolbar (Ctrl+Shift+M)

# Testar diferentes resoluções
- iPhone SE (375x667)
- iPhone 12 Pro (390x844)
- iPad (768x1024)
- iPad Pro (1024x1366)
- Desktop (1920x1080)
```

## 🎯 Layout Profissional

### Design System

**Cores:**
```javascript
primary: {
  50: '#f2f9f5',   // Backgrounds
  400: '#52b788',  // Base
  600: '#40916c',  // Hover
  700: '#2d5016',  // Dark
  900: '#0f2306',  // Very Dark
}
```

**Sombras:**
```css
shadow-sm: Elementos pequenos
shadow-lg: Cards principais
shadow-xl: Modais e dropdowns
shadow-2xl: Elementos elevados
```

**Bordas:**
```css
rounded-lg: 0.5rem   (8px)
rounded-xl: 0.75rem  (12px)
rounded-2xl: 1rem    (16px)
rounded-3xl: 1.5rem  (24px)
```

**Espaçamento:**
```css
p-4: 1rem    (16px) - Mobile
p-6: 1.5rem  (24px) - Tablet
p-8: 2rem    (32px) - Desktop
```

### Componentes Estilizados

**Botões:**
```css
.btn-primary: Gradiente verde com shadow
.btn-secondary: Branco com borda
.btn-danger: Gradiente vermelho
.btn-success: Gradiente emerald
```

**Inputs:**
```css
border-2 border-slate-200
focus:ring-2 focus:ring-primary-400/20
rounded-2xl
min-height: 44px
```

**Cards:**
```css
bg-white rounded-3xl shadow-lg
hover:shadow-xl
p-4 sm:p-6 md:p-8
border border-slate-100
```

## 🔄 Atualização e Manutenção

### Deploy Automático

```bash
# Cada push na branch principal faz deploy automático
git add .
git commit -m "Update frontend"
git push origin main
```

### Deploy Manual

```bash
# Via Railway CLI
cd client
railway up

# Ver logs
railway logs

# Abrir dashboard
railway open
```

### Rollback

```bash
# No Railway Dashboard
Deployments > Selecione deploy anterior > Redeploy
```

## 🐛 Troubleshooting

### Build Falha

**Erro:** "Failed to build"
```bash
# Verificar:
1. package.json tem todas dependências
2. Node version (18.x)
3. Logs no Railway Dashboard

# Testar build local:
cd client
npm install
npm run build
```

### CSS Não Carrega

**Erro:** Estilos não aplicados
```bash
# Verificar:
1. Tailwind config correto
2. PostCSS configurado
3. index.css importado no main.jsx

# Rebuild:
npm run build
```

### Layout Quebrado em Mobile

**Erro:** Elementos não responsivos
```bash
# Verificar:
1. Viewport meta tag presente
2. Breakpoints do Tailwind
3. Classes responsive (sm:, md:, lg:)

# Testar:
F12 > Device toolbar > Testar diferentes dispositivos
```

### API Não Conecta

**Erro:** "Failed to fetch"
```bash
# Verificar:
1. VITE_API_URL configurada
2. Backend online
3. CORS no backend

# Testar:
curl https://seu-backend.up.railway.app/health
```

## 💰 Custos Railway Frontend

### Free Tier
- $5 crédito/mês
- ~500 horas uptime
- Suficiente para testes

### Hobby Plan ($5/mês)
- $5 + uso variável
- Para produção
- Uptime garantido

### Recomendação
```
Frontend: Netlify/Vercel (Gratuito)
Backend: Railway (Free tier ou Hobby)
```

## ✅ Checklist de Deploy

- [ ] Backend Railway online
- [ ] Root Directory configurado (`client`)
- [ ] VITE_API_URL configurada
- [ ] Build completou com sucesso
- [ ] Frontend acessível via URL
- [ ] Layout responsivo funcionando
- [ ] Login funciona
- [ ] Dashboard carrega
- [ ] Mobile testado
- [ ] Tablet testado
- [ ] Desktop testado
- [ ] Sem erros no console
- [ ] Performance OK (Lighthouse)

## 📊 Performance Esperada

### Lighthouse Scores
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 90+

### Métricas
- FCP: < 1.5s
- LCP: < 2.5s
- TTI: < 3.5s
- Build time: 2-3 min

## 🎉 Deploy Completo!

Frontend configurado e otimizado para Railway:

- ✅ Build otimizado com Vite
- ✅ Layout 100% responsivo
- ✅ Design profissional mantido
- ✅ Touch-friendly (44px+)
- ✅ Code splitting
- ✅ Assets otimizados
- ✅ SEO configurado
- ✅ Acessibilidade (WCAG)

**URLs:**
- Frontend: `https://seu-frontend.up.railway.app`
- Backend: `https://seu-backend.up.railway.app`

---

**🚀 Frontend pronto para produção no Railway!**

*Layout responsivo e profissional mantido em todos os dispositivos.*
