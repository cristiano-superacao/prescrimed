# 📋 Checklist de Deploy Railway

Use este checklist para garantir que tudo está configurado corretamente.

## ✅ Pré-Deploy

### Backend
- [ ] `railway.json` configurado
- [ ] `nixpacks.toml` criado
- [ ] `Procfile` criado
- [ ] Health check endpoint `/health` funciona
- [ ] CORS configurado com Railway domain
- [ ] Server binding em `0.0.0.0`

### MongoDB
- [ ] Cluster MongoDB Atlas criado
- [ ] Database user criado
- [ ] Network access configurado (0.0.0.0/0)
- [ ] Connection string copiada
- [ ] Testado localmente

### Segurança
- [ ] JWT_SECRET gerado com `openssl rand -base64 32`
- [ ] Senha MongoDB forte
- [ ] Arquivos `.env` em `.gitignore`
- [ ] Secrets não commitados

## ✅ Deploy Railway

### Configuração Inicial
- [ ] Conta Railway criada
- [ ] GitHub conectado ao Railway
- [ ] Projeto criado no Railway
- [ ] Repositório selecionado

### Variáveis de Ambiente
- [ ] `MONGODB_URI` configurada
- [ ] `JWT_SECRET` configurada
- [ ] `NODE_ENV=production` configurada
- [ ] `FRONTEND_URL` configurada (opcional)

### Build & Deploy
- [ ] Build completou sem erros
- [ ] Deploy bem-sucedido
- [ ] URL pública gerada
- [ ] Health check responde: `/health`

## ✅ Frontend (Netlify)

### Configuração
- [ ] `VITE_API_URL` atualizada no Netlify
- [ ] URL aponta para Railway: `https://seu-app.up.railway.app/api`
- [ ] Cache limpo
- [ ] Redeploy acionado

### Build
- [ ] Build completou sem erros
- [ ] Deploy bem-sucedido
- [ ] Site acessível

## ✅ Testes

### API Backend
- [ ] Health check: `curl https://seu-app.up.railway.app/health`
- [ ] Resposta: `{"status":"ok","timestamp":"..."}`
- [ ] Login API funciona
- [ ] Endpoints protegidos requerem auth

### Frontend
- [ ] Site carrega sem erros
- [ ] Console sem erros de CORS
- [ ] Login funciona
- [ ] Dashboard carrega dados
- [ ] Criar paciente funciona
- [ ] Criar prescrição funciona

### Responsividade
- [ ] Desktop (>1024px) - sidebar fixa
- [ ] Tablet (768-1024px) - grid responsivo
- [ ] Mobile (<768px) - sidebar overlay
- [ ] Touch targets adequados
- [ ] Modais responsivos

## ✅ Pós-Deploy

### Documentação
- [ ] URLs atualizadas na documentação
- [ ] Credenciais padrão documentadas
- [ ] Guia de troubleshooting revisado

### Segurança
- [ ] Credenciais padrão alteradas
- [ ] 2FA ativado no Railway
- [ ] 2FA ativado no GitHub
- [ ] Logs verificados (sem erros)

### Monitoramento
- [ ] Railway Dashboard acessível
- [ ] Logs em tempo real funcionando
- [ ] Metrics disponíveis
- [ ] Alertas configurados (opcional)

## ✅ Opcional (Recomendado)

### Domínio Personalizado
- [ ] Domínio adquirido
- [ ] DNS configurado (CNAME)
- [ ] SSL/TLS ativado (automático)
- [ ] URLs atualizadas

### CI/CD
- [ ] Branch configurada (main/master)
- [ ] Deploy automático ativado
- [ ] Webhook testado
- [ ] Rollback configurado

### Backup
- [ ] Backup MongoDB configurado
- [ ] Snapshot agendado
- [ ] Restore testado

## 🎯 Status Final

**Backend Railway:**
- URL: `_______________________`
- Status: [ ] Online [ ] Offline
- Health: [ ] OK [ ] Error

**Frontend Netlify:**
- URL: `_______________________`
- Status: [ ] Online [ ] Offline
- API: [ ] Connected [ ] Error

**MongoDB:**
- Provider: [ ] Atlas [ ] Railway
- Status: [ ] Connected [ ] Error
- Backup: [ ] Yes [ ] No

## 📊 Métricas Baseline

Anote para comparação futura:

- Build time: _____ min
- Deploy time: _____ min
- Response time (/health): _____ ms
- First login time: _____ sec
- Dashboard load time: _____ sec

## 🚨 Troubleshooting

Se algo falhar, consulte:

1. Railway logs: `railway logs`
2. Netlify logs: Dashboard > Deploys > [deploy] > Deploy log
3. Browser console: F12 > Console
4. Network tab: F12 > Network

## ✅ Deploy Completo!

- [ ] Todos os itens acima verificados
- [ ] Sistema funcional em produção
- [ ] Equipe notificada
- [ ] Documentação atualizada

**Data do Deploy:** _______________  
**Deployed by:** _______________  
**Notas:** _______________

---

**🎉 Parabéns! Sistema Prescrimed rodando no Railway!**
