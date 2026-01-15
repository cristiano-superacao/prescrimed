# 🚀 Configuração do Frontend no Railway

## ⚠️ Problema: "Backend Offline" e erros de conexão

Se você está vendo o banner vermelho "Backend Offline" e erros `ERR_CONNECTION_REFUSED` no console, é porque **as variáveis de ambiente do frontend não foram configuradas**.

## ✅ Solução: Configurar Variáveis no Serviço "cliente"

### 1. Acesse o Railway Dashboard
- Vá para https://railway.app
- Selecione seu projeto "produção"
- Clique no serviço **"cliente"** (não no backend!)

### 2. Configure as Variáveis de Ambiente

Clique em **Variables** e adicione:

```bash
# URL completa da API (com /api no final)
VITE_API_URL=https://prescrimed-backend-production-c5e0.up.railway.app/api

# URL raiz do backend (sem /api) para healthcheck
VITE_BACKEND_ROOT=https://prescrimed-backend-production-c5e0.up.railway.app

# OPCIONAL: Imagem de fundo customizada
# VITE_BG_IMAGE_URL=https://sua-imagem.com/hero.jpg
```

### 3. Redeploy do Frontend

Após salvar as variáveis:
1. O Railway fará **redeploy automático**
2. Aguarde 2-3 minutos
3. Acesse novamente: https://prescrimed.up.railway.app

### 4. Verificar se Funcionou

Abra o console do navegador (F12):
- ❌ **ANTES**: `Failed to load resource: net::ERR_CONNECTION_REFUSED localhost:3000/health`
- ✅ **DEPOIS**: Sem erros, banner "Backend Offline" desaparece

## 📊 Verificações Adicionais

### Backend (API) já deve ter essas variáveis:
```bash
MONGODB_URI=${MongoDB.URL_MONGO}
JWT_SECRET=<sua-chave-forte-base64>
NODE_ENV=production
FRONTEND_URL=https://prescrimed.up.railway.app
```

### Teste o Healthcheck Manualmente:
```bash
curl https://prescrimed-backend-production-c5e0.up.railway.app/health
```

Resposta esperada:
```json
{
  "status": "ok",
  "db": "connected",
  "timestamp": "2026-01-15T..."
}
```

Se `db: "unavailable"`, configure `MONGODB_URI` no backend primeiro.

## 🎯 Resumo do Fluxo

1. **Backend (API)**:
   - MONGODB_URI → conecta ao banco
   - JWT_SECRET → autentica usuários
   - FRONTEND_URL → permite CORS

2. **Frontend (Cliente)**:
   - VITE_API_URL → onde fazer requisições (/api)
   - VITE_BACKEND_ROOT → onde verificar health

3. **Banco de Dados**:
   - Executar localmente:
     ```powershell
     $env:MONGODB_URI="<URI do Railway/Atlas>"
     npm run init:db
     npm run seed:cloud
     ```

## 🐛 Troubleshooting

### "Backend Offline" ainda aparece?
- Verifique se salvou as variáveis no serviço **"cliente"** (não no backend)
- Aguarde o redeploy completar
- Limpe o cache do navegador (Ctrl+Shift+Del)

### Erros de CORS?
- Adicione `FRONTEND_URL` no backend
- Certifique-se que a URL está correta (sem barra final)

### 405 Method Not Allowed?
- Verifique se `VITE_API_URL` termina com `/api`
- Se usar Netlify, verifique o proxy no `netlify.toml`

## 📱 Layout Responsivo Mantido

Todas as correções preservam:
- ✅ Grid responsivo (desktop/tablet/mobile)
- ✅ Sidebar adaptável
- ✅ Cards e formulários mobile-first
- ✅ Touch targets de 44px mínimo
- ✅ HeroBackground com pattern local

---

**Dúvidas?** Verifique se as variáveis foram salvas nos serviços corretos:
- **Backend (API)**: MONGODB_URI, JWT_SECRET, NODE_ENV, FRONTEND_URL
- **Frontend (Cliente)**: VITE_API_URL, VITE_BACKEND_ROOT
