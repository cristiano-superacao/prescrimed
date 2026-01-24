<<<<<<< HEAD
# ✅ Checklist Railway - Backend "prescrito"

Siga este checklist ANTES de redeployar o serviço no Railway. Marque cada item!

---

## 1. Exposição do Serviço
- [ ] **Public Networking** está ativado?  
  - Railway > prescrito > Settings > "Expose to Public Internet" (ou "Public Networking")

## 2. Variáveis de Ambiente
- [ ] `DATABASE_URL` está presente? (copie do plugin PostgreSQL)
- [ ] `JWT_SECRET` está presente? (use o script `setup-railway.ps1` para gerar)
- [ ] `JWT_REFRESH_SECRET` está presente?
- [ ] `NODE_ENV=production`
- [ ] `TZ=America/Sao_Paulo`
- [ ] `ALLOWED_ORIGINS` (adicione a URL do frontend, ex: https://prescrimed.up.railway.app)

## 3. Plugin PostgreSQL
- [ ] O plugin PostgreSQL está adicionado ao projeto?
- [ ] O serviço "prescrito" está vinculado ao plugin?

## 4. Configuração de Health Check
- [ ] Health check path: `/health`
- [ ] Timeout: **300 segundos** (5 min)
- [ ] Restart Policy: ON_FAILURE, Max Retries: 3

## 5. Deploy
- [ ] Clique em "Redeploy" no serviço "prescrito"
- [ ] Aguarde até 5 minutos (primeiro deploy pode demorar)

## 6. Logs
- [ ] Verifique se aparece:
  - `Banco de dados conectado com sucesso`
  - `Tabelas sincronizadas`
  - `Sistema pronto para uso!`
  - `Servidor ativo na porta XXXX`

## 7. Teste de Health Check
- [ ] Acesse: `https://<seu-backend>.up.railway.app/health`
  - Deve retornar: `{ "status": "ok", "database": "connected", ... }`

---

## Se algum item falhar:
- Reveja o item correspondente e ajuste no Railway.
- Se persistir, envie o log de erro completo para análise.

---

**Dica:**
- O backend só ficará "exposto" e acessível se o serviço estiver com Public Networking ativado e o health check passar!
- O deploy pode demorar até 5 minutos se for o primeiro ou se houver alterações no banco.

---

**Pronto para produção!**
=======
# ✅ Checklist Railway - Backend "prescrito"

Siga este checklist ANTES de redeployar o serviço no Railway. Marque cada item!

---

## 1. Exposição do Serviço
- [ ] **Public Networking** está ativado?  
  - Railway > prescrito > Settings > "Expose to Public Internet" (ou "Public Networking")

## 2. Variáveis de Ambiente
- [ ] `DATABASE_URL` está presente? (copie do plugin PostgreSQL)
- [ ] `JWT_SECRET` está presente? (use o script `setup-railway.ps1` para gerar)
- [ ] `JWT_REFRESH_SECRET` está presente?
- [ ] `NODE_ENV=production`
- [ ] `TZ=America/Sao_Paulo`
- [ ] `ALLOWED_ORIGINS` (adicione a URL do frontend, ex: https://prescrimed.up.railway.app)

## 3. Plugin PostgreSQL
- [ ] O plugin PostgreSQL está adicionado ao projeto?
- [ ] O serviço "prescrito" está vinculado ao plugin?

## 4. Configuração de Health Check
- [ ] Health check path: `/health`
- [ ] Timeout: **300 segundos** (5 min)
- [ ] Restart Policy: ON_FAILURE, Max Retries: 3

## 5. Deploy
- [ ] Clique em "Redeploy" no serviço "prescrito"
- [ ] Aguarde até 5 minutos (primeiro deploy pode demorar)

## 6. Logs
- [ ] Verifique se aparece:
  - `Banco de dados conectado com sucesso`
  - `Tabelas sincronizadas`
  - `Sistema pronto para uso!`
  - `Servidor ativo na porta XXXX`

## 7. Teste de Health Check
- [ ] Acesse: `https://<seu-backend>.up.railway.app/health`
  - Deve retornar: `{ "status": "ok", "database": "connected", ... }`

---

## Se algum item falhar:
- Reveja o item correspondente e ajuste no Railway.
- Se persistir, envie o log de erro completo para análise.

---

**Dica:**
- O backend só ficará "exposto" e acessível se o serviço estiver com Public Networking ativado e o health check passar!
- O deploy pode demorar até 5 minutos se for o primeiro ou se houver alterações no banco.

---

**Pronto para produção!**
>>>>>>> f8df367ce1ca1ff650c477905d008af90ee9fc68
