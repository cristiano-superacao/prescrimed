# 🧪 Guia de Teste Local - Prescrimed

## ✅ Endereços

- UI/API: `http://localhost:8000`
- Alternativa (Windows/proxy): `http://127.0.0.1:8000`

---

## 🤖 Smoke test (recomendado)

```bash
set TEST_BASE_URL=http://127.0.0.1:8000
node test-local.js
```

---

## 📝 Testes manuais (UI)

1. **Health check:** abra `http://localhost:8000/health`
2. **Login:** entre com um usuário criado pelo seed (se aplicável)
3. **Pacientes:** crie um paciente e confirme na listagem
4. **Prescrições:** crie uma prescrição e confirme na listagem
5. **Estoque:** crie um item + registre movimentação e valide saldo/estatísticas
6. **Financeiro:** crie uma transação (receita/despesa) e valide estatísticas

---

## 🧪 Testes via API (curl)

```bash
curl http://localhost:8000/health
curl http://localhost:8000/api/diagnostic
```

---

## 🚀 Deploy no Railway (PostgreSQL)

1. **Configurar o banco:** crie um PostgreSQL no Railway e copie a `DATABASE_URL`.
2. **Variáveis do serviço:**
   - `DATABASE_URL`
   - `JWT_SECRET` e `JWT_REFRESH_SECRET`
   - `NODE_ENV=production`
   - `FORCE_SYNC=true` (apenas no primeiro deploy)
   - `FAIL_FAST_DB=true` (para garantir uso do Postgres)
3. **Validar:** acesse `https://seu-servico.up.railway.app/health` e teste o fluxo.

---

## 📊 Status atual

✅ Servidor local rodando na porta **8000**  
✅ Frontend servido em `/`  
✅ API funcionando em `/api/*`  
✅ Layout responsivo e profissional mantido  
✅ Banco: SQLite em dev (`./database.sqlite`) ou Postgres via `DATABASE_URL`
