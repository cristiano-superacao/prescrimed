# 🚀 Deploy Frontend + Backend no Railway

## 📋 Visão Geral

Este guia explica como fazer o deploy completo do sistema Prescrimed no Railway, servindo tanto o frontend (React) quanto o backend (Node.js + Express) no mesmo serviço.

## 🌐 Domínio Principal

**URL de Produção**: `https://prescrimed.up.railway.app`

Este domínio serve:
- ✅ Frontend React (SPA)
- ✅ Backend API (`/api/*`)
- ✅ Health Check (`/health`)

## 🛠️ Configuração Atual

### 1. Build Automático

O Railway está configurado para fazer build automático através do arquivo `railway.json`:

```json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm ci --production=false && cd client && npm ci --production=false && npm run build"
  },
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/health",
    "healthcheckTimeout": 300
  }
}
```

### 2. Variáveis de Ambiente no Railway

Configure as seguintes variáveis no Railway Dashboard:

```bash
# Banco de Dados (referência ao serviço Postgres)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# Frontend/CORS
FRONTEND_URL=https://prescrimed.up.railway.app
CORS_ORIGIN=https://prescrimed.up.railway.app

# Ambiente
NODE_ENV=production
PORT=8080
```

### 3. Estrutura de Arquivos

```
prescrimed-main/
├── server.js              # Servidor Express que serve frontend + API
├── client/
│   ├── dist/              # Build do React (gerado automaticamente)
│   └── src/               # Código fonte React
├── routes/                # Rotas da API
├── models/                # Modelos Sequelize
└── railway.json           # Configuração do Railway
```

## 🔧 Como Funciona

### Fluxo de Requisições

1. **Arquivos Estáticos** (`/assets/*`, `/robots.txt`, etc.)
   - Servidos diretamente da pasta `client/dist`
   - Cache-Control otimizado

2. **Rotas da API** (`/api/*`)
   - Processadas pelo Express
   - CORS configurado para aceitar `https://prescrimed.up.railway.app`

3. **Health Check** (`/health`)
   - Retorna status do servidor e banco de dados
   - Usado pelo Railway para monitoramento

4. **SPA Fallback** (todas as outras rotas)
   - Retorna `client/dist/index.html`
   - Permite React Router funcionar corretamente
   - Exemplos: `/login`, `/dashboard`, `/pacientes`

## 🚀 Deploy Manual (se necessário)

### Opção 1: Via CLI

```bash
# 1. Fazer build do frontend
cd client
npm run build

# 2. Voltar para raiz e fazer push
cd ..
git add .
git commit -m "chore: atualizar build do frontend"
git push origin main

# 3. Railway detectará o push e fará deploy automaticamente
```

### Opção 2: Via Railway Dashboard

1. Acesse o projeto no Railway Dashboard
2. Vá em "Deployments"
3. Clique em "Deploy Now"

## 🔍 Verificação

### 1. Verificar Health Check

```bash
curl https://prescrimed.up.railway.app/health
```

Resposta esperada:
```json
{
  "status": "ok",
  "database": "connected",
  "DATABASE_URL": true,
  "uptime": 12345
}
```

### 2. Testar API

```bash
curl https://prescrimed.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"jeansoares@gmail.com","senha":"123456"}'
```

### 3. Acessar Frontend

Abra no navegador: `https://prescrimed.up.railway.app`

## 🎨 Layout Responsivo

O layout foi mantido 100% responsivo e profissional:

- ✅ Mobile First Design
- ✅ Breakpoints otimizados (sm, md, lg, xl)
- ✅ Tailwind CSS
- ✅ Componentes acessíveis
- ✅ Performance otimizada

## 📊 Monitoramento

### Logs do Railway

```bash
# Via CLI
railway logs

# Via Dashboard
Acesse: Settings → Deployments → View Logs
```

### Métricas

O Railway fornece métricas automáticas:
- CPU Usage
- Memory Usage
- Request Count
- Response Time

## 🔒 Segurança

### CORS Configurado

O servidor aceita requisições de:
- `https://prescrimed.up.railway.app` (produção)
- `https://prescrimed-production.up.railway.app` (variação)
- `http://localhost:5173` (desenvolvimento)
- Origens adicionais via `ALLOWED_ORIGINS`

### Headers de Segurança

- Helmet.js ativado
- CSP configurado
- HTTPS enforçado

## 🐛 Troubleshooting

### Problema: "DATABASE_URL: false"

**Solução**: Configure a variável no Railway Dashboard:
```
DATABASE_URL=${{Postgres.DATABASE_URL}}
```

### Problema: Erro CORS

**Solução**: Verifique se `CORS_ORIGIN` está configurado:
```
CORS_ORIGIN=https://prescrimed.up.railway.app
```

### Problema: Build falha

**Solução**: Verifique logs do build:
```bash
railway logs --deployment
```

Causas comuns:
- Dependências faltando no `package.json`
- Erro de sintaxe no código
- Memória insuficiente (upgrade do plano)

### Problema: Frontend não carrega

**Solução**: Verifique se o build foi feito:
```bash
ls -la client/dist/
```

Se vazio, rode:
```bash
cd client && npm run build
```

## 📝 Checklist de Deploy

- [ ] PostgreSQL configurado no Railway
- [ ] Variáveis de ambiente configuradas
- [ ] Build do frontend executado
- [ ] Commit e push para repositório
- [ ] Deploy automático concluído
- [ ] Health check retorna "ok"
- [ ] Login funcionando
- [ ] Módulos testados
- [ ] Layout responsivo verificado

## 🎯 Próximos Passos

1. Configurar domínio customizado (opcional)
2. Configurar SSL/TLS (automático no Railway)
3. Configurar backups automáticos do PostgreSQL
4. Implementar monitoring adicional (Sentry, etc.)
5. Configurar CI/CD avançado

## 📚 Recursos Adicionais

- [Railway Docs](https://docs.railway.app/)
- [Nixpacks](https://nixpacks.com/docs)
- [PostgreSQL no Railway](https://docs.railway.app/databases/postgresql)

---

**Mantendo Layout Responsivo e Profissional** ✨
