# 🚂 Configuração Railway - Prescrimed

## ✅ Variáveis de Ambiente Obrigatórias

Configure estas variáveis no painel do Railway (Settings > Variables):

### 1. MongoDB (OBRIGATÓRIO)
```
MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/prescrimed?retryWrites=true&w=majority
```
⚠️ **Atenção:** Substitua `usuario`, `senha` e `cluster` pelos seus dados do MongoDB Atlas.

### 2. JWT Secret (OBRIGATÓRIO)
```
JWT_SECRET=SuaChaveSecretaSuperSeguraAqui123456
```
💡 Use uma string longa e aleatória (mínimo 32 caracteres).

### 3. Porta (Automático)
```
PORT=3000
```
✅ O Railway define isso automaticamente, mas você pode deixar explícito.

### 4. Node Environment
```
NODE_ENV=production
```

### 5. CORS - Frontend URL (Opcional)
```
FRONTEND_URL=https://seu-dominio.railway.app
```
💡 Se você hospedar o frontend separadamente no GitHub Pages ou Netlify, coloque a URL aqui.

## 📦 MongoDB Atlas - Setup Rápido

1. Acesse: https://cloud.mongodb.com/
2. Crie um cluster gratuito (M0)
3. Database Access > Add New Database User:
   - Username: `prescrimed_admin`
   - Password: [gere uma senha forte]
4. Network Access > Add IP Address:
   - Adicione `0.0.0.0/0` (permite todas as IPs - recomendado para Railway)
5. Databases > Connect > Connect your application:
   - Copie a connection string
   - Substitua `<password>` pela senha criada
   - Adicione `/prescrimed` antes de `?retryWrites`

## 🔄 Deploy Automático

O Railway faz deploy automático quando você:
- Fizer `git push` para o branch `master`
- Alterar variáveis de ambiente no painel

## 🏥 Health Check

O Railway verifica se a aplicação está saudável através de:
- **Endpoint:** `/health`
- **Timeout:** 360 segundos (6 minutos)
- **Resposta esperada:** `{ status: 'ok', ... }`

## 🎯 Após Configurar

1. Faça push do código: `git push origin master`
2. Configure as variáveis no Railway
3. Aguarde o deploy (3-5 minutos)
4. Acesse: `https://seu-projeto.up.railway.app/health`
5. Se retornar `{ status: 'ok' }`, está funcionando! ✅

## 🌐 URLs do Sistema

- **Backend API:** `https://seu-projeto.up.railway.app/api`
- **Frontend:** `https://seu-projeto.up.railway.app/`
- **Health Check:** `https://seu-projeto.up.railway.app/health`

## 🐛 Troubleshooting

### Erro: "Cannot find module '/app/routes/index.js'"
✅ **Resolvido!** Commit vazio foi enviado para forçar novo build.

### Erro: "Healthcheck failed"
- Verifique se `MONGODB_URI` está configurada
- Verifique se a connection string do MongoDB está correta
- Aguarde até 6 minutos para o primeiro deploy (seeding do banco)

### Erro: 500 no login/register
- Verifique se `JWT_SECRET` está configurada
- Verifique se `MONGODB_URI` está acessível

## 📚 Documentação Adicional

- [Variáveis de Ambiente](./.env.example)
- [Resumo do Sistema](./RESUMO_FINAL.md)
- [Manual Completo](./docs/MANUAL_COMPLETO_SISTEMA.md)
