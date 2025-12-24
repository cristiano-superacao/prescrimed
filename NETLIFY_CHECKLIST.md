# ✅ Checklist de Deploy no Netlify

## 📋 Pré-requisitos Configurados

### ✅ 1. Estrutura do Projeto
- [x] `netlify.toml` na raiz do projeto
- [x] `base` configurado como "client"
- [x] `publish` configurado como "client/dist"
- [x] `command` configurado como "npm run build"

### ✅ 2. Arquivos de Configuração
- [x] `.nvmrc` (Node 18)
- [x] `.node-version` (18.18.0)
- [x] `client/public/_redirects` (SPA routing)
- [x] `client/public/_headers` (Security headers)
- [x] `client/public/robots.txt` (SEO)

### ✅ 3. Meta Tags e SEO
- [x] Meta description
- [x] Meta keywords
- [x] Open Graph tags (Facebook)
- [x] Twitter Card tags
- [x] Favicon configurado
- [x] Theme color definido (#6366f1)

### ✅ 4. Headers de Segurança
- [x] X-Frame-Options: DENY
- [x] X-Content-Type-Options: nosniff
- [x] X-XSS-Protection
- [x] Referrer-Policy
- [x] Permissions-Policy

### ✅ 5. Cache Otimizado
- [x] Assets: max-age 1 ano
- [x] JavaScript/CSS: max-age 1 ano
- [x] Fontes: max-age 1 ano
- [x] index.html: no-cache

### ✅ 6. Redirects Configurados
- [x] API proxy para backend Render
- [x] SPA fallback para todas as rotas

### ✅ 7. Build Testado
- [x] `npm run build` executado com sucesso
- [x] Dist gerada com todos os arquivos
- [x] Tamanho dos bundles otimizado
- [x] Tree-shaking funcionando

---

## 🚀 Configuração no Netlify Dashboard

### 1. Build Settings

```
Base directory: client
Build command: npm run build
Publish directory: client/dist
```

### 2. Environment Variables

Nenhuma variável de ambiente é necessária, pois o proxy está configurado no `netlify.toml`.

### 3. Deploy Notifications (Opcional)

Configure notificações de deploy por:
- Email
- Slack
- Discord
- Webhook

---

## 📊 Resultados do Build

### Tamanhos dos Arquivos Gerados

```
✓ index.html                   1.94 kB │ gzip:  0.71 kB
✓ assets/index-Ca2fNjn-.css   47.40 kB │ gzip:  7.76 kB
✓ assets/ui-6pwr-rBc.js       26.06 kB │ gzip:  9.30 kB
✓ assets/vendor-GYxUkayf.js  162.22 kB │ gzip: 52.74 kB
✓ assets/index-g2MtNoBW.js   226.44 kB │ gzip: 50.24 kB
```

### Performance

- ✅ **Total gzipped:** ~120 KB
- ✅ **Code splitting:** Vendor, UI e Index separados
- ✅ **Tree-shaking:** Console logs removidos em produção
- ✅ **Minificação:** Terser ativo

---

## 🔧 Configurações do netlify.toml

```toml
[build]
  base = "client"
  publish = "client/dist"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "18"
  NPM_FLAGS = "--legacy-peer-deps"

# API Proxy
[[redirects]]
  from = "/api/*"
  to = "https://prescrimed-backend.onrender.com/api/:splat"
  status = 200
  force = true

# SPA Fallback
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## 🌐 URLs de Deploy

### Produção
- **URL:** https://prescrimed.netlify.app
- **Backend:** https://prescrimed-backend.onrender.com

### Preview (Branch Deploys)
- Cada push gera um preview único
- URL: `https://deploy-preview-[PR-NUMBER]--prescrimed.netlify.app`

---

## 🧪 Como Testar o Deploy

### 1. Build Localmente

```bash
cd client
npm run build
npm run preview
```

Acesse: http://localhost:4173

### 2. Testar Produção

```bash
# Fazer commit e push
git add .
git commit -m "fix: corrige configuração do Netlify"
git push origin main
```

### 3. Verificar no Netlify

1. Acesse o dashboard do Netlify
2. Vá para "Deploys"
3. Aguarde o build completar (~2-3 minutos)
4. Clique em "Open production deploy"

---

## 🐛 Troubleshooting

### Erro: "Page Not Found"

**Causa:** SPA routing não configurado corretamente  
**Solução:** Verificar `_redirects` e `netlify.toml`

### Erro: "Failed to fetch"

**Causa:** Backend Render offline  
**Solução:** Reativar backend no Render ou rodar localmente

### Erro: "Build failed"

**Causa:** Dependências ou build command incorretos  
**Solução:** 
1. Verificar `package.json`
2. Testar `npm run build` localmente
3. Verificar logs do Netlify

### Erro: "Assets not loading"

**Causa:** Base path incorreto  
**Solução:** Verificar `base: '/'` no `vite.config.js`

---

## 📱 Testes Recomendados Após Deploy

### Funcionalidades

- [ ] Login funciona
- [ ] Logout funciona
- [ ] Navegação entre páginas
- [ ] API calls funcionam
- [ ] Autenticação persiste
- [ ] Página de Manual acessível
- [ ] Busca no Manual funciona
- [ ] Responsividade em mobile
- [ ] Responsividade em tablet

### Performance

- [ ] Lighthouse Score > 90
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3s
- [ ] Cache funcionando
- [ ] Assets comprimidos (gzip/brotli)

### SEO

- [ ] Meta tags presentes
- [ ] Open Graph funcionando
- [ ] Robots.txt acessível
- [ ] Favicon carregando

---

## 🔐 Segurança

### Headers Configurados

```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

### HTTPS

- ✅ Automático no Netlify
- ✅ Certificado SSL gratuito
- ✅ Renovação automática

---

## 📈 Monitoramento

### Ferramentas Recomendadas

1. **Netlify Analytics**
   - Pageviews
   - Top pages
   - Resources

2. **Google Analytics** (Adicionar se necessário)
   ```html
   <!-- Global site tag (gtag.js) - Google Analytics -->
   <script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
   ```

3. **Sentry** (Para erros)
   - Captura de erros frontend
   - Stack traces
   - User context

---

## ✅ Status Final

**Todos os pré-requisitos foram configurados com sucesso!**

### Arquivos Criados/Modificados

- ✅ `netlify.toml` (movido para raiz)
- ✅ `.nvmrc` (Node 18)
- ✅ `.node-version` (18.18.0)
- ✅ `client/public/_headers` (Security)
- ✅ `client/public/robots.txt` (SEO)
- ✅ `client/index.html` (Meta tags)

### Build Status

- ✅ Build executado com sucesso
- ✅ Dist gerada corretamente
- ✅ Todos os arquivos presentes
- ✅ Tamanhos otimizados

### Próximo Passo

**Fazer commit e push para deploy automático:**

```bash
git add .
git commit -m "chore: configura projeto para deploy no Netlify"
git push origin main
```

---

## 📞 Suporte

Se encontrar problemas:

1. Verificar logs do Netlify
2. Testar build localmente
3. Consultar documentação: https://docs.netlify.com
4. Abrir ticket no suporte do Netlify

---

**Sistema pronto para deploy no Netlify!** 🚀
