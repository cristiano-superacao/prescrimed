# 🚂 MIGRAÇÃO PARA RAILWAY - GUIA COMPLETO

**Data:** 4 de dezembro de 2025  
**Credenciais:** cristiano.s.santos@ba.estudante.senai.br / 18042016

---

## ✅ POR QUE RAILWAY?

### Vantagens sobre Render Free:
- ✅ **Não hiberna** (serviço sempre ativo)
- ✅ **$5 de créditos grátis/mês** (suficiente para desenvolvimento)
- ✅ **Deploy automático** via GitHub
- ✅ **Logs em tempo real** e métricas
- ✅ **MongoDB integrado** ou usa Atlas facilmente
- ✅ **Interface moderna** e intuitiva
- ✅ **Sem cold starts** (resposta imediata)

---

## 🚀 PASSO A PASSO DE MIGRAÇÃO

### PASSO 1: Criar Conta no Railway

1. **Acesse:** https://railway.app
2. **Clique em:** "Start a New Project" ou "Login"
3. **Login com GitHub:**
   - Clique em "Login with GitHub"
   - Use as credenciais do GitHub conectadas ao email
   - **OU** crie conta com email direto

**Credenciais:**
- Email: cristiano.s.santos@ba.estudante.senai.br
- Senha: 18042016

---

### PASSO 2: Conectar Repositório GitHub

1. **No Railway Dashboard:**
   - Clique em "New Project"
   - Selecione "Deploy from GitHub repo"

2. **Autorizar Railway:**
   - Clique em "Configure GitHub App"
   - Selecione "cristiano-superacao/prescrimed"
   - Clique em "Install & Authorize"

3. **Selecionar Repositório:**
   - Clique em "prescrimed"
   - Railway detectará automaticamente que é Node.js

---

### PASSO 3: Configurar Variáveis de Ambiente

1. **No projeto Railway:**
   - Clique na aba "Variables"
   - Adicione as seguintes variáveis:

```bash
# Porta (Railway define automaticamente, mas pode adicionar)
PORT=3000

# MongoDB (escolha uma opção abaixo)

# OPÇÃO 1: MongoDB Memory Server (para testes)
USE_MEMORY_DB=true

# OPÇÃO 2: MongoDB Atlas (recomendado para produção)
MONGODB_URI=mongodb+srv://seu-usuario:sua-senha@cluster.mongodb.net/prescrimed

# JWT Secret (obrigatório)
JWT_SECRET=seu-secret-aqui-muito-seguro-2024

# Node Environment
NODE_ENV=production
```

**⚠️ Importante:** Se não tiver MongoDB Atlas, vou criar um passo a passo depois.

---

### PASSO 4: Configurar Deploy

O Railway já detecta automaticamente, mas vamos garantir:

1. **Settings do Serviço:**
   - Root Directory: `/` (raiz)
   - Build Command: `npm install`
   - Start Command: `npm start`

2. **Variáveis já preenchidas** (passo anterior)

3. **Clicar em "Deploy"**

---

### PASSO 5: Aguardar Deploy

1. **Acompanhar Build:**
   - Na aba "Deployments"
   - Ver logs em tempo real
   - Aguardar "Build Successful"

2. **Tempo estimado:** ~2-3 minutos

3. **Status esperado:** ✅ "Active" (verde)

---

### PASSO 6: Obter URL do Backend

1. **No Railway Dashboard:**
   - Clique no serviço "prescrimed"
   - Vá em "Settings"
   - Seção "Domains"
   - Clique em "Generate Domain"

2. **URL gerada será algo como:**
```
https://prescrimed-production.up.railway.app
```

3. **Copie essa URL!**

---

### PASSO 7: Atualizar Frontend (Netlify)

Agora precisa atualizar o redirect do Netlify para apontar para Railway:

1. **Abrir arquivo local:**
```
c:\Users\Superação\prescrimed\netlify.toml
```

2. **Atualizar redirect da API:**
```toml
[[redirects]]
  from = "/api/*"
  to = "https://prescrimed-production.up.railway.app/api/:splat"
  status = 200
  force = true
```

3. **Fazer commit:**
```bash
git add netlify.toml
git commit -m "chore: atualiza backend para Railway"
git push origin main
```

4. **Netlify faz deploy automático!**

---

### PASSO 8: Testar Sistema Completo

1. **Testar Backend Railway:**
```
https://prescrimed-production.up.railway.app/api/health
```

**Resposta esperada:**
```json
{
  "status": "ok",
  "timestamp": "2025-12-04T..."
}
```

2. **Testar Frontend Netlify:**
```
https://prescrimed.netlify.app
```

3. **Fazer Login:**
   - Email: admin@admin.com
   - Senha: admin123

---

## 📊 CONFIGURAÇÃO DE MONGODB

### OPÇÃO 1: Usar MongoDB Memory Server (Temporário)

**Já está configurado!** Basta adicionar variável:
```bash
USE_MEMORY_DB=true
```

**⚠️ Atenção:** Dados são perdidos ao reiniciar!

---

### OPÇÃO 2: MongoDB Atlas (Recomendado)

1. **Criar conta gratuita:**
   - Acesse: https://www.mongodb.com/cloud/atlas/register
   - Use email: cristiano.s.santos@ba.estudante.senai.br

2. **Criar Cluster:**
   - Escolha "Free" (M0)
   - Região: São Paulo (sa-east-1)
   - Nome: prescrimed-cluster

3. **Configurar Acesso:**
   - Database Access → Add User
   - Username: prescrimed
   - Password: [gerar senha segura]
   - Salve a senha!

4. **Configurar Network Access:**
   - Network Access → Add IP Address
   - Selecione "Allow Access from Anywhere"
   - IP: 0.0.0.0/0

5. **Obter Connection String:**
   - Clusters → Connect → Connect your application
   - Copiar string: `mongodb+srv://prescrimed:SENHA@cluster.mongodb.net/prescrimed`

6. **Adicionar no Railway:**
   - Variables → Add Variable
   - Nome: `MONGODB_URI`
   - Valor: [connection string copiada]

---

### OPÇÃO 3: MongoDB Railway (Integrado)

1. **No Railway Dashboard:**
   - Clique em "New"
   - Selecione "Database"
   - Escolha "Add MongoDB"

2. **Railway cria automaticamente:**
   - MongoDB já conectado
   - Variável `MONGO_URL` gerada

3. **Atualizar código** (se necessário):
   - Usar `process.env.MONGO_URL` ou `process.env.MONGODB_URI`

---

## 🔧 CONFIGURAÇÕES AVANÇADAS

### Custom Domain (Opcional)

Se você tiver um domínio próprio:

1. **Railway Settings → Domains:**
   - Add Custom Domain
   - Digite: api.prescrimed.com
   - Configurar DNS (CNAME)

2. **Atualizar Netlify:**
```toml
[[redirects]]
  from = "/api/*"
  to = "https://api.prescrimed.com/api/:splat"
```

---

### Aumentar Recursos (Se necessário)

**Free Tier:**
- 512 MB RAM
- Shared CPU
- $5 créditos/mês

**Plano Pago ($5/mês):**
- 8 GB RAM
- 8 vCPU
- 100 GB Disco

---

## 📈 MONITORAMENTO

### Ver Logs em Tempo Real

1. **Railway Dashboard:**
   - Clique no serviço
   - Aba "Logs"
   - Ver logs ao vivo

### Métricas de Performance

1. **Aba "Metrics":**
   - CPU usage
   - RAM usage
   - Network traffic
   - Requests per minute

---

## 🔄 DEPLOY AUTOMÁTICO

**Já está configurado!**

Cada vez que você fizer `git push`:
1. ✅ GitHub recebe o push
2. ✅ Railway detecta mudanças
3. ✅ Faz build automático
4. ✅ Deploy em produção
5. ✅ Zero downtime!

---

## 🐛 TROUBLESHOOTING

### Build falhou

**Problema:** Erro no npm install

**Solução:**
1. Ver logs completos no Railway
2. Verificar package.json
3. Verificar versão do Node (18+)

---

### App não inicia

**Problema:** Start command não funciona

**Solução:**
1. Verificar `npm start` em package.json
2. Confirmar PORT está sendo lido: `process.env.PORT`
3. Ver logs de erro

---

### MongoDB Connection Error

**Problema:** Não conecta ao MongoDB

**Solução:**
1. Verificar MONGODB_URI está correta
2. Confirmar IP whitelisted (0.0.0.0/0)
3. Testar connection string localmente
4. Verificar usuário/senha corretos

---

### Backend responde 502

**Problema:** Bad Gateway

**Solução:**
1. Ver logs do Railway
2. Confirmar app está rodando (PORT correto)
3. Aguardar deploy completar
4. Fazer redeploy manual

---

## ✅ CHECKLIST COMPLETO

### Configuração Railway
- [ ] Conta criada em railway.app
- [ ] Repositório GitHub conectado
- [ ] Variáveis de ambiente configuradas
- [ ] Deploy bem-sucedido
- [ ] URL gerada e copiada
- [ ] Health check retorna 200 OK

### Configuração MongoDB
- [ ] Opção escolhida (Memory/Atlas/Railway)
- [ ] Connection string configurada
- [ ] Teste de conexão OK

### Atualização Netlify
- [ ] netlify.toml atualizado
- [ ] Commit feito
- [ ] Push para GitHub
- [ ] Deploy Netlify concluído

### Testes Finais
- [ ] Backend Railway responde
- [ ] Frontend Netlify carrega
- [ ] Login funciona
- [ ] API calls funcionam
- [ ] Dados persistem (se Atlas)

---

## 💰 CUSTOS

### Free Tier
```
Créditos: $5/mês
Uso esperado: ~$3-4/mês
Sobra: $1-2/mês
```

**Suficiente para:**
- Desenvolvimento
- Testes
- Projeto pessoal
- Até ~100 req/hora

### Quando Upgrade?

**Sinais:**
- Créditos acabando antes do fim do mês
- Latência alta
- Muitos usuários simultâneos
- App ficando lento

**Plano Developer ($5/mês):**
- Mais recursos
- Melhor performance
- Sem preocupação com créditos

---

## 🎯 PRÓXIMOS PASSOS

### Agora:
1. ✅ Acessar railway.app
2. ✅ Criar conta com email fornecido
3. ✅ Conectar repositório GitHub
4. ✅ Configurar variáveis
5. ✅ Fazer deploy

### Depois:
1. Copiar URL do Railway
2. Atualizar netlify.toml
3. Git push
4. Testar sistema completo

### Futuro:
1. Configurar MongoDB Atlas (dados persistentes)
2. Custom domain (se quiser)
3. Monitorar uso de créditos
4. Considerar upgrade quando necessário

---

## 📞 SUPORTE

### Links Úteis
- **Railway Docs:** https://docs.railway.app
- **Railway Dashboard:** https://railway.app/dashboard
- **Railway Status:** https://status.railway.app
- **Railway Discord:** https://discord.gg/railway

### Em caso de problemas:
1. Ver logs no Railway
2. Consultar documentação
3. Discord Railway (comunidade ativa)
4. GitHub Issues do projeto

---

## 🎉 RESUMO

**Vantagens da Migração:**
- ✅ Backend sempre ativo (sem hibernação)
- ✅ Deploy automático via Git
- ✅ Logs e métricas em tempo real
- ✅ $5 créditos grátis/mês
- ✅ Interface moderna
- ✅ Melhor performance que Render free

**Processo:**
1. Criar conta Railway
2. Conectar GitHub
3. Configurar variáveis
4. Deploy automático
5. Atualizar Netlify
6. Testar e usar!

**Tempo total:** ~10-15 minutos

---

**🚂 Sistema pronto para migrar para Railway!**

**Credenciais:** cristiano.s.santos@ba.estudante.senai.br / 18042016

**Comece agora:** https://railway.app
