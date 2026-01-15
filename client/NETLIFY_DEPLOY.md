# 🚀 Deploy Netlify - Prescrimed Frontend

## 📋 Configuração Atual

O projeto já está configurado para deploy no Netlify com todas as otimizações necessárias:

✅ **netlify.toml** configurado
✅ **Layout responsivo** mantido
✅ **Build otimizado** com Vite
✅ **Proxy API** configurado para Railway
✅ **Headers de segurança** aplicados
✅ **Cache otimizado** para assets

## 🎯 Passo a Passo - Deploy Automático

### 1️⃣ Conectar ao GitHub (Se Ainda Não Conectado)

1. Acesse: https://app.netlify.com/projects/precrimed
2. Clique em **"Set up a new site"** ou **"Import from Git"**
3. Escolha **GitHub**
4. Selecione o repositório: **cristiano-superacao/prescrimed**
5. Autorize o Netlify a acessar o repositório

### 2️⃣ Configurar Build Settings

No Netlify Dashboard, configure:

```
Base directory: client
Build command: npm run build
Publish directory: client/dist
```

**OBS:** O arquivo `netlify.toml` já contém essas configurações, mas é bom verificar.

### 3️⃣ Configurar Variáveis de Ambiente

No Netlify Dashboard:

1. Vá em **Site settings** > **Environment variables**
2. Clique em **Add a variable**
3. Adicione:

```
Key: VITE_API_URL
Value: /api
```

**IMPORTANTE:** Usar `/api` porque o `netlify.toml` já está configurado para fazer proxy para o Railway.

### 4️⃣ Deploy Automático

1. O Netlify detectará o push no GitHub
2. Build iniciará automaticamente
3. Aguarde 2-3 minutos
4. Site estará no ar!

## 🔧 Configurações Já Aplicadas

### netlify.toml
```toml
[build]
  base = "client"
  publish = "client/dist"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "18"
  NPM_FLAGS = "--legacy-peer-deps"

# Proxy API para Railway
[[redirects]]
  from = "/api/*"
  to = "https://prescrimed-backend-production.up.railway.app/api/:splat"
  status = 200
  force = true
```

### Build Otimizado (vite.config.js)
- Code splitting automático
- Minificação com Terser
- Assets otimizados
- CSS code split
- Tree shaking

### Layout Responsivo (index.css)
- Touch targets 44px+
- Padding responsivo (p-4 sm:p-6 md:p-8)
- Grid responsivo
- Mobile-first approach
- Breakpoints otimizados

## 🌐 URLs Backend Railway

Certifique-se de que o backend está no ar no Railway:

**URL Backend:** https://prescrimed-backend-production.up.railway.app

### Verificar Backend
```bash
curl https://prescrimed-backend-production.up.railway.app/health
```

Deve retornar:
```json
{"status":"ok","timestamp":"..."}
```

## ✅ Checklist Pré-Deploy

- [ ] Backend Railway está online
- [ ] Backend responde em `/health`
- [ ] Repositório GitHub está atualizado
- [ ] `netlify.toml` está na pasta `client/`
- [ ] Build local funciona: `cd client && npm run build`
- [ ] Variável `VITE_API_URL=/api` configurada no Netlify

## 🐛 Troubleshooting

### Build Falha no Netlify

**Erro:** "Failed during stage 'Reading and parsing configuration files'"

**Solução:**
1. Verificar se `netlify.toml` está em `client/`
2. Verificar sintaxe do `netlify.toml`
3. Base directory deve ser `client`

### Build Falha - Dependências

**Erro:** Conflitos de dependências

**Solução:**
1. No Netlify: Environment variables
2. Adicionar: `NPM_FLAGS = --legacy-peer-deps`
3. Ou já está em `netlify.toml` na seção `[build.environment]`

### API Não Conecta

**Erro:** "Failed to fetch" ou CORS

**Solução:**
1. Verificar proxy no `netlify.toml`:
   ```toml
   [[redirects]]
     from = "/api/*"
     to = "https://prescrimed-backend-production.up.railway.app/api/:splat"
   ```
2. Verificar se backend Railway está online
3. Testar: `curl https://prescrimed-backend-production.up.railway.app/health`

### Layout Quebrado

**Erro:** CSS não carrega ou layout não responsivo

**Solução:**
1. Verificar build completou com sucesso
2. Limpar cache Netlify: **Deploys** > **Trigger deploy** > **Clear cache and deploy**
3. Verificar `index.css` tem classes responsivas
4. Testar localmente: `npm run build && npm run preview`

## 📱 Verificar Responsividade Após Deploy

### Mobile (<768px)
1. Abrir site no Netlify
2. F12 > Device toolbar (Ctrl+Shift+M)
3. Testar iPhone SE, iPhone 12
4. Verificar:
   - ✅ Sidebar overlay funciona
   - ✅ Botões 44px+ clicáveis
   - ✅ Grid 1 coluna
   - ✅ Header compacto

### Tablet (768-1024px)
1. Testar iPad, iPad Pro
2. Verificar:
   - ✅ Sidebar colapsável
   - ✅ Grid 2-3 colunas
   - ✅ Busca visível

### Desktop (>1024px)
1. Testar resoluções 1920x1080, 2560x1440
2. Verificar:
   - ✅ Sidebar fixa
   - ✅ Grid 2-4 colunas
   - ✅ Espaçamento amplo

## 🎨 Performance Check

Após deploy, testar no Lighthouse:

1. Abrir site Netlify
2. F12 > Lighthouse
3. Run report
4. Verificar scores:
   - Performance: 90+
   - Accessibility: 95+
   - Best Practices: 95+
   - SEO: 90+

## 🔄 Deploy Manual (Alternativa)

Se preferir fazer deploy manual:

```bash
# 1. Fazer build local
cd client
npm install
npm run build

# 2. Instalar Netlify CLI
npm install -g netlify-cli

# 3. Login no Netlify
netlify login

# 4. Deploy
netlify deploy --prod --dir=dist --site=precrimed
```

## 📊 Monitoramento Pós-Deploy

### Verificar Logs
1. Netlify Dashboard > **Deploys**
2. Clicar no último deploy
3. Ver **Deploy log**

### Métricas
1. Netlify Dashboard > **Analytics**
2. Ver bandwidth usage
3. Ver page views

### Erros
1. Netlify Dashboard > **Functions** > **Logs**
2. Ver erros de runtime
3. Browser console (F12)

## ✅ Checklist Pós-Deploy

- [ ] Site acessível via URL Netlify
- [ ] HTTPS ativo (automático)
- [ ] Login funciona
- [ ] Dashboard carrega dados
- [ ] API conecta (proxy funcionando)
- [ ] Layout responsivo em mobile
- [ ] Layout responsivo em tablet
- [ ] Layout responsivo em desktop
- [ ] Sem erros no console
- [ ] Lighthouse score 90+

## 🎯 URLs Finais

**Frontend Netlify:** https://precrimed.netlify.app  
**Backend Railway:** https://prescrimed-backend-production.up.railway.app

**API via Proxy:** https://precrimed.netlify.app/api

## 🚀 Deploy Automático Configurado

A partir de agora, todo push para `master` no GitHub fará deploy automático:

```bash
git add .
git commit -m "feat: nova funcionalidade"
git push origin master
```

Netlify detecta → Build automático → Deploy!

## 🎉 Deploy Completo!

Seu sistema Prescrimed está no ar com:

✅ Frontend otimizado no Netlify  
✅ Backend no Railway  
✅ Layout 100% responsivo  
✅ Performance otimizada  
✅ Deploy automático  
✅ HTTPS gratuito

**Acesse:** https://precrimed.netlify.app

**Credenciais:**
- Email: `admin@sistema.com`
- Senha: `Admin@123`

---

**🎨 Layout responsivo e profissional garantido!**
