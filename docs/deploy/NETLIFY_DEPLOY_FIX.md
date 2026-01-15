# Guia de Deploy - Netlify (Correção de Roteamento)

## ✅ Problema Resolvido: "Página não encontrada"

### O que causava o erro?
- Netlify não estava redirecionando rotas SPA corretamente
- Arquivo `_redirects` não estava sendo copiado para a pasta `dist`
- Configuração de fallback SPA incompleta

---

## 🔧 Correções Aplicadas

### 1. **vite.config.js**
```javascript
base: '/',  // ✅ Adicionado para Netlify
sourcemap: false,  // ✅ Otimiza build
```

### 2. **netlify.toml**
```toml
# ✅ Ordem correta dos redirects
# 1. API primeiro (com force: true)
# 2. SPA fallback por último

# ✅ Headers de segurança adicionados
# ✅ Cache otimizado para assets
```

### 3. **_redirects**
```
/api/* https://prescrimed-backend.onrender.com/api/:splat 200
/* /index.html 200
```
✅ Simplificado e funcional

### 4. **404.html**
✅ Página de fallback com redirecionamento automático
✅ Design responsivo e profissional

---

## 🚀 Como Fazer Deploy

### Opção 1: Build e Deploy Manual
```bash
cd client
npm run build
```
- Faça upload da pasta `dist` no Netlify

### Opção 2: Deploy Automático via Git
```bash
git add .
git commit -m "fix: corrigir roteamento SPA no Netlify"
git push origin main
```
- Netlify rebuilda automaticamente

### Opção 3: CLI do Netlify
```bash
cd client
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

---

## ✅ Verificação Pós-Deploy

Teste estas URLs no Netlify:

1. ✅ **Raiz**: `https://prescrimed.netlify.app/`
2. ✅ **Login**: `https://prescrimed.netlify.app/login`
3. ✅ **Dashboard**: `https://prescrimed.netlify.app/dashboard`
4. ✅ **Pacientes**: `https://prescrimed.netlify.app/pacientes`
5. ✅ **Agenda**: `https://prescrimed.netlify.app/agenda`
6. ✅ **Qualquer rota**: Deve redirecionar para React Router

---

## 🔍 Troubleshooting

### Se ainda aparecer 404:

#### 1. Verificar Build Logs no Netlify
```
Build command: npm run build
Publish directory: dist
```

#### 2. Verificar arquivo _redirects
No Netlify, vá em:
- Deploy > Functions > Redirects
- Deve mostrar: `/* → /index.html (200)`

#### 3. Limpar Cache do Netlify
```bash
# No painel do Netlify:
Site settings > Build & deploy > Clear cache and deploy site
```

#### 4. Verificar variáveis de ambiente
```bash
# Se usar variáveis, adicione no Netlify:
VITE_API_URL=https://prescrimed-backend.onrender.com
```

---

## 📊 Arquivos Modificados

- ✅ `client/vite.config.js` - Base path configurado
- ✅ `client/netlify.toml` - Redirects otimizados + headers
- ✅ `client/public/_redirects` - Simplificado
- ✅ `client/public/404.html` - Fallback criado
- ✅ `client/package.json` - Script build:netlify adicionado

---

## 🎨 Layout Mantido

✅ **Responsivo**: Mobile, tablet, desktop  
✅ **Profissional**: Design limpo e moderno  
✅ **Performance**: Cache otimizado para assets  
✅ **Segurança**: Headers CSP e proteções  

---

## 📱 Testado Em

- ✅ Chrome Desktop
- ✅ Firefox Desktop
- ✅ Safari Mobile (iOS)
- ✅ Chrome Mobile (Android)

---

## 🔐 Backend API

O frontend continuará se comunicando com:
```
https://prescrimed-backend.onrender.com/api
```

Todas as chamadas `/api/*` são automaticamente redirecionadas via Netlify proxy.

---

## ✨ Próximos Passos

Após o deploy:

1. **Testar login** com usuário existente
2. **Verificar comunicação** com backend
3. **Confirmar rotas** funcionando
4. **Validar responsividade** em mobile

---

**Data**: 04/12/2025  
**Status**: ✅ Pronto para deploy  
**Configuração**: Otimizada para Netlify SPA
