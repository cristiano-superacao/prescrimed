# Deploy no Railway - Prescrimed

## 🚀 Deploy Automático

O Railway está configurado para fazer deploy automático quando você faz push para o repositório.

### Configuração Atual

**Arquitetura:**
```
┌─────────────────────┐
│  Railway Service    │
│  prescrimed.up      │
│  .railway.app       │
└──────────┬──────────┘
           │
           ├─→ Backend Node.js (server.js)
           │   └─ Porta: 8000
           │   └─ Rotas: /api/*
           │
           └─→ Frontend React (client/dist)
               └─ Servido estaticamente
               └─ SPA Fallback para React Router
```

### Variáveis de Ambiente Necessárias

Configure no Railway Dashboard → Serviço → Variables:

```env
# Database
DATABASE_URL=postgresql://... (automático se conectar Postgres)

# JWT
JWT_SECRET=seu-secret-super-seguro-aqui
SESSION_TIMEOUT=8h

# Node
NODE_ENV=production
PORT=8000 (ou deixe o Railway definir automaticamente)
```

### Build Process

O `nixpacks.toml` define o processo de build:

1. **Setup**: Instala Node.js 20
2. **Install**: 
   - Instala dependências do backend (`npm ci`)
   - Entra em `client/`, instala dependências
   - **Build do frontend com `VITE_BASE=/`** (importante!)
   - Volta para raiz
3. **Start**: Executa `node server.js`

### Diferença entre Railway e GitHub Pages

| Aspecto | Railway | GitHub Pages |
|---------|---------|--------------|
| **Base Path** | `/` (raiz) | `/prescrimed/` |
| **Build Var** | `VITE_BASE=/` | `VITE_BASE=/prescrimed/` |
| **Backend** | Mesmo serviço (`/api`) | Separado (Railway backend) |
| **Domínio** | `prescrimed.up.railway.app` | `cristiano-superacao.github.io/prescrimed` |

### Como Fazer Deploy

**Opção 1: Push Automático (Recomendado)**
```bash
git add .
git commit -m "Update: descrição das mudanças"
git push origin master
```
Railway detecta o push e faz deploy automaticamente.

**Opção 2: Deploy Manual via Railway CLI**
```bash
railway up
```

### Verificar Deploy

1. Acesse: https://prescrimed.up.railway.app
2. Deve mostrar a tela de login
3. Verifique DevTools (F12) → Console
   - ✅ Sem erros MIME type
   - ✅ Assets carregando de `/assets/...` (não `/prescrimed/assets/`)

### Troubleshooting

**Erro: "Failed to load module script" (MIME type 'text/html')**
- **Causa**: Build feito com base path errado
- **Solução**: Verificar que `nixpacks.toml` tem `VITE_BASE=/`

**Erro: "Cannot GET /api/..."**
- **Causa**: Backend não iniciou ou rotas não registradas
- **Solução**: Verificar logs no Railway Dashboard

**Erro: "Database connection failed"**
- **Causa**: `DATABASE_URL` não configurada ou Postgres não conectado
- **Solução**: Conectar serviço Postgres ao serviço do app

### Logs

Ver logs em tempo real:
```bash
railway logs
```

Ou no Railway Dashboard → Serviço → Deployments → View Logs

### Custos

- **Postgres**: ~$5/mês (plano Hobby)
- **Web Service**: Baseado em uso (Railway oferece $5 free credit/mês)

### Recomendação

**Para produção**, considere usar:
- **Frontend**: GitHub Pages (GRÁTIS)
- **Backend**: Railway (apenas API + Database)

Isso economiza recursos Railway servindo apenas a API, e o frontend fica em CDN gratuito do GitHub.
