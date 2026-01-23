# 🚀 Guia Rápido de Deploy Railway

## Problema: Backend não está executando (405 Method Not Allowed)

### ✅ Solução em 3 Passos:

### 1️⃣ No Railway Dashboard - Serviço Backend

#### A. Verificar/Criar Plugin PostgreSQL
```
1. No projeto "Prescrimed"
2. Clique em "+ New" → "Database" → "Add PostgreSQL"
3. Isso criará automaticamente a variável DATABASE_URL
```

#### B. Adicionar Variáveis de Ambiente Obrigatórias
```
Settings → Variables → Add Variables:

JWT_SECRET=cole_aqui_chave_64_chars
JWT_REFRESH_SECRET=cole_aqui_outra_chave_64_chars
NODE_ENV=production
ALLOWED_ORIGINS=https://prescrimed.up.railway.app
```

**Gerar chaves JWT seguras (execute no PowerShell):**
```powershell
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

#### C. Habilitar Public Networking
```
Settings → Networking → Generate Domain
Anote o domínio gerado (ex: prescrito-production.up.railway.app)
```

#### D. Redeploy
```
Deployments → Click nos 3 pontinhos → Redeploy
```

---

### 2️⃣ Aguardar Deploy (2-5 minutos)

Acompanhe os logs:
```
Deployments → Click no deploy mais recente → View Logs

Aguarde ver:
✅ Banco de dados conectado com sucesso
🚀 Servidor ativo na porta 3000
```

---

### 3️⃣ Validar Backend

#### Teste 1: Health Check
```powershell
curl https://prescrimed.up.railway.app/health
```

**Resultado esperado:**
```json
{
  "status": "ok",
  "uptime": 123.45,
  "database": "connected",
  "timestamp": "2026-01-23T...",
  "env": "production"
}
```

#### Teste 2: API Register
```powershell
curl -X POST https://prescrimed.up.railway.app/api/auth/register `
  -H "Content-Type: application/json" `
  -d '{
    "nomeEmpresa": "Teste",
    "tipoSistema": "casa-repouso",
    "cnpj": "12345678000199",
    "nomeAdmin": "Admin",
    "email": "admin@teste.com",
    "senha": "Senha@123",
    "cpf": "12345678900",
    "contato": "(11) 99999-9999"
  }'
```

**Se retornar 201 ou 400 (campos já existem) = API funcionando! ✅**
**Se retornar 405 = Backend ainda não está rodando ❌**

---

### 4️⃣ Popular com Dados de Teste

**Somente após /api funcionar!**

```powershell
cd C:\Users\Superação\Desktop\Sistema\prescrimed-main
node scripts/seed-production-data.js
```

Isso criará:
- ✅ 3 empresas (Casa Repouso, Fisioterapia, Petshop)
- ✅ 3 admins
- ✅ 9 funcionários  
- ✅ 9 residentes/pacientes/pets

---

### 5️⃣ Acessar Sistema

```
URL: https://prescrimed.up.railway.app

Logins:
  Casa de Repouso:
    Email: maria.silva@vidaplena.com
    Senha: Admin@2026

  Fisioterapia:
    Email: roberto.lima@movimento.com
    Senha: Fisio@2026

  Petshop:
    Email: juliana.vet@amigofiel.com
    Senha: Pet@2026
```

---

## 🔧 Troubleshooting

### Erro: DATABASE_URL não definida
```
Adicione plugin PostgreSQL:
+ New → Database → Add PostgreSQL
```

### Erro: JWT_SECRET não definida
```
Gere e adicione nas variáveis:
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Erro: 503 Service Unavailable
```
Verifique logs do PostgreSQL:
Databases → PostgreSQL → Logs
```

### Erro: 405 mesmo após deploy
```
1. Verifique se PORT está disponível (não force PORT=3000)
2. Verifique se startCommand é "node server.js"
3. Force redeploy completo
```

---

## 📋 Checklist Final

- [ ] PostgreSQL plugin criado
- [ ] DATABASE_URL gerada automaticamente
- [ ] JWT_SECRET configurada (64+ chars)
- [ ] JWT_REFRESH_SECRET configurada (64+ chars)
- [ ] NODE_ENV=production
- [ ] ALLOWED_ORIGINS configurada
- [ ] Public domain habilitada
- [ ] Deploy concluído sem erros
- [ ] `/health` retorna JSON
- [ ] `/api/auth/register` não retorna 405
- [ ] Seed executado com sucesso
- [ ] Login funcionando no frontend

---

**Tempo estimado: 10 minutos**
