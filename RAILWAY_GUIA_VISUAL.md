# 🎯 GUIA RÁPIDO - Deploy Railway (Passo a Passo)

## 🚨 CORREÇÕES APLICADAS ✅

Os erros foram corrigidos! Arquivos criados:
- ✅ `railway.json` - Configuração de build/deploy
- ✅ `nixpacks.toml` - Build steps
- ✅ `.railwayignore` - Otimização de upload
- ✅ `package.json` - Scripts atualizados

---

## 📋 PASSOS NO RAILWAY

### 1️⃣ LIMPAR DEPLOY ANTERIOR (Se necessário)

No Railway Dashboard:
1. Deletar os serviços "cliente" e "-" que falharam
2. Manter apenas o PostgreSQL (se existir)

### 2️⃣ CRIAR NOVO SERVIÇO

1. **New Service** → **GitHub Repo**
2. Selecione: `cristiano-superacao/prescrimed`
3. Nome sugerido: `prescrimed-backend`

### 3️⃣ ADICIONAR/CONECTAR POSTGRESQL

Se não existe:
- **Add Service** → **Database** → **PostgreSQL**

Se já existe:
- Clique no serviço backend → **Variables** → **Add Reference** → Selecione o PostgreSQL

### 4️⃣ CONFIGURAR VARIÁVEIS DE AMBIENTE

No serviço backend, vá em **Variables** e adicione:

```env
NODE_ENV=production
PORT=3000
JWT_SECRET=meu-super-secreto-jwt-2026-prescrimed-32chars
JWT_REFRESH_SECRET=meu-refresh-secreto-2026-prescrimed-32chars
SESSION_TIMEOUT=8h
FORCE_SYNC=true
```

**⚠️ IMPORTANTE:** Depois da primeira criação das tabelas, REMOVER `FORCE_SYNC=true`

### 5️⃣ CONFIGURAR CORS (Depois do deploy)

Quando o Railway gerar a URL (ex: `https://prescrimed-production.up.railway.app`), adicione:

```env
FRONTEND_URL=https://prescrimed-production.up.railway.app
ALLOWED_ORIGINS=https://prescrimed-production.up.railway.app
```

### 6️⃣ CONFIGURAÇÕES DE BUILD (Opcional - Railway detecta automaticamente)

**Settings** → **Build**:
- Root Directory: `/` (raiz)
- Build Command: *(deixe vazio, usa nixpacks.toml)*
- Start Command: `npm start`
- Install Command: *(deixe vazio)*

### 7️⃣ DEPLOY

1. Salve as configurações
2. Deploy será iniciado automaticamente
3. Acompanhe os logs: **Deployments** → **View Logs**

### 8️⃣ VERIFICAR SUCESSO

Quando aparecer "✅ Deployment succeeded":

1. **Testar Health Check:**
   - Clique no botão do domínio gerado
   - Adicione `/health` na URL
   - Deve retornar: `{"status":"ok","database":"connected"}`

2. **Testar API:**
   - URL: `https://seu-dominio.up.railway.app/api/test`
   - Deve retornar JSON com mensagem

3. **Acessar Sistema:**
   - URL: `https://seu-dominio.up.railway.app`
   - Deve carregar a interface do Prescrimed

### 9️⃣ PÓS-DEPLOY IMPORTANTE

1. **Remover FORCE_SYNC:**
   - Variables → Editar `FORCE_SYNC` → Deletar ou mudar para `false`
   - Isso evita recriar tabelas a cada deploy

2. **Verificar PostgreSQL:**
   - PostgreSQL service → **Data**
   - Verificar se tabelas foram criadas:
     - empresas
     - usuarios
     - pacientes
     - prescricoes

---

## 🔍 LOGS ESPERADOS (Sucesso)

```
💾 Usando SQLite para desenvolvimento local
🎬 Iniciando servidor Prescrimed...
📡 Conectando ao PostgreSQL...
📁 Servindo arquivos estáticos de: /app/client/dist
✅ Frontend estático disponível
✅ Pasta WEB servida em /web
🚀 Servidor Ativo na porta 3000
📍 Acesse: http://localhost:3000
✅ PostgreSQL conectado com sucesso
✅ Tabelas criadas/sincronizadas
🎉 Sistema pronto para uso!
```

---

## ❌ ERROS COMUNS E SOLUÇÕES

### "Cannot find module './client/dist'"
**Solução:** Build do frontend falhou
- Verificar logs de build
- Garantir que `nixpacks.toml` está na raiz
- Redeploy

### "ECONNREFUSED PostgreSQL"
**Solução:** DATABASE_URL não está configurada
- Verificar se PostgreSQL está conectado ao serviço
- Variables → Add Reference → PostgreSQL

### "Port 3000 already in use"
**Solução:** Não deveria acontecer no Railway
- Railway define PORT automaticamente
- Se ocorrer, verificar se não há dois serviços rodando

### "CORS Error" no frontend
**Solução:** Domínio não está em ALLOWED_ORIGINS
- Adicionar URL do Railway em ALLOWED_ORIGINS
- Formato: `https://prescrimed-production.up.railway.app`

---

## 🎯 CHECKLIST FINAL

Antes de considerar concluído:

- [ ] Serviço backend criado e rodando
- [ ] PostgreSQL conectado
- [ ] Variáveis de ambiente configuradas
- [ ] Build completado com sucesso
- [ ] `/health` retorna status ok
- [ ] `/api/test` retorna JSON
- [ ] Interface frontend carrega
- [ ] Login funciona (criar usuário se necessário)
- [ ] FORCE_SYNC removido após primeira criação
- [ ] Domain Railway anotado para referência

---

## 🌐 URLs IMPORTANTES

Após deploy bem-sucedido, você terá:

- **Frontend:** https://prescrimed-production.up.railway.app
- **API:** https://prescrimed-production.up.railway.app/api
- **Health:** https://prescrimed-production.up.railway.app/health
- **Landing:** https://prescrimed-production.up.railway.app/web
- **Swagger:** https://prescrimed-production.up.railway.app/api/docs *(se implementado)*

---

## 💡 DICAS PROFISSIONAIS

1. **Custom Domain:**
   - Settings → Networking → Generate Domain (gratuito)
   - Ou adicionar seu próprio domínio

2. **Backups PostgreSQL:**
   - PostgreSQL → Data → Export
   - Fazer backup regular das tabelas

3. **Monitoramento:**
   - Metrics → Ver uso de CPU/RAM/Network
   - Logs → Acompanhar erros em tempo real

4. **Rollback Rápido:**
   - Deployments → Versão anterior → Redeploy

5. **Secrets Seguros:**
   - Gerar JWT_SECRET forte: https://www.uuidgenerator.net/
   - Ou: `openssl rand -base64 32`

---

## 📞 SUPORTE

Se algo não funcionar:

1. **Ver logs completos:** Deployments → View Logs
2. **Verificar build:** Build Logs tab
3. **Testar localmente:** `npm run build:full && npm start`
4. **Verificar arquivos:** GitHub repo deve ter railway.json

---

**Agora é só seguir os passos acima no Railway! 🚀**

O push já foi feito para o GitHub, então quando criar o serviço no Railway, ele vai pegar automaticamente as configurações corretas.

Boa sorte! 🎉
