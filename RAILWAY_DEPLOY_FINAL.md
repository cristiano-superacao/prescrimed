# 🚀 Deploy Final no Railway - Backend Node

**Status:** Backend configurado e pronto para deploy
**Data:** 16 de janeiro de 2026

---

## ✅ O que foi feito

### 1. Backend Atualizado
- ✅ Campo `tipoSistema` adicionado ao modelo `Empresa` (casa-repouso, fisioterapia, petshop)
- ✅ Onboarding completo via `POST /auth/register` (cria Empresa + admin)
- ✅ Login corrigido para retornar `user` (alinhado ao frontend)
- ✅ Campos `cpf` e `contato` adicionados ao modelo `Usuario`
- ✅ Rota de diagnóstico `GET /api/diagnostic/db-check` para verificar tabelas

### 2. Scripts e Configuração
- ✅ `scripts/check-pg-tables.js` - Verificador local de tabelas
- ✅ `routes/diagnostic.routes.js` - Diagnóstico em produção
- ✅ `Procfile` - Força execução do Node
- ✅ `railway.json` - Build simplificado (backend only)
- ✅ `FORCE_SYNC=true` - Ativado para criar/alterar tabelas

---

## 🔧 Problema Atual

O serviço "client" no Railway está configurado como **site estático** (Caddy) em vez de **aplicação Node**.

**Sintoma:**
- As rotas `/api/...` retornam o HTML da SPA
- O Node (`server.js`) não está sendo executado
- Deploy marca como FAILED

**Causa:**
- O serviço "client" foi originalmente criado como frontend estático
- O Railway detecta arquivos estáticos e usa Caddy por padrão

---

## 💡 Solução Recomendada

### Opção 1: Criar Novo Serviço "Backend" (Recomendado)

1. **No Dashboard do Railway:**
   - Abra o projeto "supportive-benevolence"
   - Clique em "+ New" → "Empty Service"
   - Nome: `backend` ou `api`
   - Conecte ao repositório GitHub
   - Em Settings → Deploy:
     - Start Command: `node server.js`
     - Root Directory: `/` (deixe vazio ou `/`)
     - Build Command: `npm install`

2. **Conectar ao PostgreSQL:**
   - No serviço `backend`, clique em "+ New" → "Database" → "Add PostgreSQL"
   - Ou conecte ao banco existente em "Variables" → "Add Reference" → selecione o Postgres

3. **Configurar Variáveis no Serviço Backend:**
   ```
   NODE_ENV=production
   JWT_SECRET=sua-chave-super-secreta-aqui
   JWT_REFRESH_SECRET=sua-chave-refresh-super-secreta-aqui
   SESSION_TIMEOUT=8h
   FORCE_SYNC=true
   FRONTEND_URL=https://prescrimed.netlify.app
   ALLOWED_ORIGINS=https://prescrimed.netlify.app,https://precrimed.netlify.app
   ```
   - O `DATABASE_URL` será adicionado automaticamente ao conectar o Postgres

4. **No Terminal Local:**
   ```powershell
   railway link
   ```
   - Selecione o projeto e o novo serviço `backend`
   
   ```powershell
   railway up --detach
   railway service status
   railway logs --tail 300
   ```

5. **Validar:**
   ```powershell
   # Health check
   Invoke-RestMethod -Uri "https://SEU_DOMINIO_BACKEND_RAILWAY/health" -Method GET
   
   # Diagnóstico de tabelas
   Invoke-RestMethod -Uri "https://SEU_DOMINIO_BACKEND_RAILWAY/api/diagnostic/db-check" -Method GET
   ```

6. **Desativar FORCE_SYNC:**
   ```powershell
   railway variables --set FORCE_SYNC=false
   railway up --detach
   ```

### Opção 2: Reconfigurar Serviço "Client" Atual

Se preferir manter o serviço atual:

1. **No Dashboard → Serviço "client" → Settings:**
   - Em "Deploy":
     - Start Command: `node server.js`
     - Build Command: `npm install`
   - Em "Environment Variables":
     - Adicione todas as variáveis listadas acima

2. **Deploy:**
   ```powershell
   railway up --detach
   ```

---

## 📋 Checklist Pós-Deploy

Após o deploy bem-sucedido:

- [ ] `/health` retorna status 200 com `database: connected`
- [ ] `/api/diagnostic/db-check` lista todas as tabelas:
  - `empresas` com coluna `tipoSistema`
  - `usuarios` com colunas `cpf` e `contato`
  - `pacientes`
  - `prescricoes`
- [ ] `FORCE_SYNC=false` aplicado após confirmar tabelas
- [ ] Teste de cadastro (onboarding) no frontend:
  - Acesse: https://prescrimed.netlify.app/register
  - Selecione "Clínica de Fisioterapia"
  - Preencha os dados e registre
  - Confirme que empresa e usuário foram criados

---

## 🎯 Frontend

O frontend continua hospedado no **Netlify** com layout responsivo e profissional:
- URL: https://prescrimed.netlify.app
- Variável `VITE_BACKEND_ROOT` deve apontar para o domínio do backend Railway
- Exemplo: `VITE_BACKEND_ROOT=https://SEU_BACKEND.up.railway.app`

---

## 🔐 Segurança

**Importante:** Mantenha as seguintes variáveis **APENAS** no serviço de backend:
- `DATABASE_URL`
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- `SESSION_TIMEOUT`

Remova do serviço "client" se houver.

---

## 📞 Próximos Passos

1. Criar serviço "backend" no Railway (ou reconfigurar "client")
2. Conectar ao PostgreSQL
3. Configurar variáveis de ambiente
4. Fazer deploy com `FORCE_SYNC=true`
5. Validar health e tabelas
6. Desativar `FORCE_SYNC`
7. Testar onboarding completo com "Fisioterapia"

---

## 📚 Documentação Relacionada

- [RESUMO_CORRECOES.md](RESUMO_CORRECOES.md) - Histórico completo de correções
- [RAILWAY_CONFIGURACAO_CORRETA.md](RAILWAY_CONFIGURACAO_CORRETA.md) - Guia de configuração
- [RAILWAY_ACOES_IMEDIATAS.md](RAILWAY_ACOES_IMEDIATAS.md) - Ações imediatas
- [scripts/check-pg-tables.js](scripts/check-pg-tables.js) - Verificador de tabelas
- [scripts/create-tables.js](scripts/create-tables.js) - Criador de tabelas manual

---

✨ **Layout responsivo e profissional preservado em todas as páginas!**
