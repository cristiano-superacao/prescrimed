# 🚀 Configuração Railway - Pronto para Usar!

## ✅ Arquivos Gerados

Acabei de criar:
- ✅ **setup-railway.ps1** - Script que gera chaves JWT
- ✅ **.railway-env.txt** - Variáveis prontas para copiar
- ✅ **scripts/seed-production-data.js** - Popula banco com dados de teste
- ✅ **DEPLOY_RAILWAY_RAPIDO.md** - Guia completo passo a passo

---

## 🎯 FAÇA AGORA (5 minutos):

### 1️⃣ Abra o arquivo `.railway-env.txt`

Este arquivo contém as variáveis de ambiente com as chaves JWT já geradas de forma segura.

### 2️⃣ Vá para o Railway Dashboard

1. Acesse: https://railway.app/dashboard
2. Selecione o projeto **Prescrimed**
3. Clique no serviço **backend** (pode estar com nome "prescrito" ou "prescrimed-main")

### 3️⃣ Adicione PostgreSQL

```
+ New → Database → Add PostgreSQL
```

Isso cria automaticamente a variável `DATABASE_URL`.

### 4️⃣ Configure Variáveis de Ambiente

```
Settings → Variables → Raw Editor
```

Cole todo o conteúdo do arquivo `.railway-env.txt`:

```env
JWT_SECRET=ad90395005d599a3c84c88af9e3ee9f51b5782f82229fb97fe1738fbe5decb7dfd334c470a80bb351da3ca85c2f386f480c84e70114e544f7971671f069b5866
JWT_REFRESH_SECRET=d1e444f2ce7bd411fd07fe26af80283942b8c48bdc905fcd15dfe8a8a2be2b221741ff9a916d3e5649332b7e5ad2cb3dca036677f001f274cad7f261c5aa80b3
NODE_ENV=production
ALLOWED_ORIGINS=https://prescrimed.up.railway.app
SESSION_TIMEOUT=8h
```

> **Não adicione DATABASE_URL manualmente!** O PostgreSQL cria automaticamente.

### 5️⃣ Habilite Public Domain

```
Settings → Networking → Generate Domain
```

### 6️⃣ Faça Redeploy

```
Deployments → (três pontinhos) → Redeploy
```

Aguarde 2-3 minutos até aparecer "Running" com ✅

---

## ✅ Validar que Funcionou

### Teste 1: Health Check

```powershell
curl https://prescrimed.up.railway.app/health
```

**Deve retornar JSON** (não HTML):
```json
{
  "status": "ok",
  "database": "connected",
  ...
}
```

### Teste 2: API Endpoint

```powershell
curl https://prescrimed.up.railway.app/api/health
```

**Deve retornar JSON com status 200**

---

## 🌱 Popular com Dados de Teste

**Somente depois dos testes acima passarem!**

```powershell
cd C:\Users\Superação\Desktop\Sistema\prescrimed-main
node scripts/seed-production-data.js
```

Isso criará:
- ✅ **3 empresas**: Casa de Repouso, Fisioterapia, Petshop
- ✅ **3 admins** (um por empresa)
- ✅ **9 funcionários** (3 por empresa)
- ✅ **9 residentes/pacientes/pets** (3 por empresa)

---

## 🔑 Credenciais de Acesso

Após executar o seed, faça login em: https://prescrimed.up.railway.app

### Casa de Repouso Vida Plena
```
Email: maria.silva@vidaplena.com
Senha: Admin@2026
```

### Clínica de Fisioterapia Movimento
```
Email: roberto.lima@movimento.com
Senha: Fisio@2026
```

### Petshop Amigo Fiel
```
Email: juliana.vet@amigofiel.com
Senha: Pet@2026
```

---

## 📋 Checklist Final

Marque conforme completa:

- [ ] PostgreSQL plugin adicionado
- [ ] Variáveis do .railway-env.txt copiadas
- [ ] Public domain habilitado
- [ ] Redeploy concluído
- [ ] `/health` retorna JSON ✅
- [ ] `/api/health` retorna JSON ✅
- [ ] Seed executado com sucesso
- [ ] Login funcionando em todas as empresas
- [ ] CRUD de pacientes/residentes/pets funcional
- [ ] Dashboard carregando métricas
- [ ] Layout responsivo (mobile/tablet/desktop)

---

## 🆘 Problemas?

### Erro: 405 Method Not Allowed
➡️ Backend não está executando. Verifique:
- Start Command está como "node server.js"?
- Logs mostram "Servidor ativo na porta XXX"?

### Erro: 503 Service Unavailable  
➡️ Banco não conectou. Verifique:
- PostgreSQL foi adicionado?
- DATABASE_URL existe nas variáveis?
- Logs do PostgreSQL não mostram erros?

### Erro: CORS blocked
➡️ Verifique:
- ALLOWED_ORIGINS inclui o domínio correto?
- Frontend está usando VITE_BACKEND_ROOT correto?

---

## ✨ Próximos Testes

Após tudo funcionar, testar:

1. **Autenticação**: Login/logout em cada empresa
2. **CRUD Completo**: Criar, editar, visualizar, deletar
3. **Prescrições**: Casa de repouso
4. **Sessões**: Fisioterapia  
5. **Atendimentos**: Petshop
6. **Agenda**: Criar eventos
7. **Financeiro**: Registrar transações
8. **Estoque**: Movimentações
9. **Relatórios**: Gerar PDFs
10. **Responsividade**: Testar em mobile/tablet

---

**Tempo total estimado: 10 minutos** ⏱️
**Dificuldade: Fácil** 😊

Qualquer dúvida, consulte **DEPLOY_RAILWAY_RAPIDO.md** para detalhes expandidos!
