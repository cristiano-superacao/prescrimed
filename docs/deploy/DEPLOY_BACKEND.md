# 🚀 Deploy do Backend no Render

## Passo 1: Preparar o Repositório

Certifique-se de que as alterações no `server.js` foram commitadas:

```bash
git add .
git commit -m "fix: Configurar CORS para produção"
git push origin main
```

## Passo 2: Configurar no Render

1. Acesse: https://dashboard.render.com/
2. Login com GitHub
3. Clique em **"New +"** → **"Web Service"**
4. Conecte o repositório: `cristiano-superacao/prescrimed`
5. Configure:

### Configurações Básicas
- **Name:** `prescrimed-backend`
- **Region:** `Oregon (US West)` ou mais próximo
- **Branch:** `main`
- **Root Directory:** deixe em branco (raiz do projeto)
- **Runtime:** `Node`
- **Build Command:** `npm install`
- **Start Command:** `node server.js`

### Plano
- Escolha: **Free** (para testes) ou **Starter** (para produção)

### Variáveis de Ambiente
Clique em **"Advanced"** e adicione:

```env
PORT=5000
NODE_ENV=production
JWT_SECRET=prescrimed_secret_key_2024_super_seguro_mongodb
MONGODB_URI=mongodb://127.0.0.1:27017/prescrimed
FRONTEND_URL=https://precrimed.netlify.app
CORS_ORIGIN=https://precrimed.netlify.app
```

⚠️ **IMPORTANTE:** Substitua `MONGODB_URI` pela sua connection string do MongoDB Atlas!

## Passo 3: Deploy

1. Clique em **"Create Web Service"**
2. Aguarde o build completar (2-5 minutos)
3. Anote a URL do serviço (ex: `https://prescrimed-backend.onrender.com`)

## Passo 4: Atualizar Frontend

Atualize o arquivo `.env.production` no frontend:

```env
VITE_API_URL=https://prescrimed-backend.onrender.com/api
```

## Passo 5: Testar

Teste a API:
```bash
curl https://prescrimed-backend.onrender.com/health
```

Resposta esperada:
```json
{"status":"ok","timestamp":"2025-12-03T..."}
```

## 📝 Notas

- O Render **hiberna** apps gratuitos após 15 min de inatividade
- Primeira requisição após hibernar pode levar 30-60 segundos
- Para produção, considere plano pago para evitar hibernação
- MongoDB em memória não funciona no Render - use MongoDB Atlas

## 🔧 Troubleshooting

### Erro de CORS
Verifique se `FRONTEND_URL` está configurado corretamente nas variáveis de ambiente.

### Erro de Conexão MongoDB
Certifique-se de usar MongoDB Atlas e liberar acesso de qualquer IP (0.0.0.0/0).

### Deploy Falhou
Verifique logs no painel do Render: **Logs** → **Deploy Logs**
