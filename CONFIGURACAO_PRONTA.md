# 🚀 Configuração Railway - Pronto para Usar!

> Este arquivo é um guia rápido. Para o passo a passo completo e atualizado, use:
> - [RAILWAY_SETUP_GUIDE.md](RAILWAY_SETUP_GUIDE.md)
> - [RAILWAY_DEPLOY.md](RAILWAY_DEPLOY.md)
> - [MIGRACAO_RAILWAY_POSTGRES.md](MIGRACAO_RAILWAY_POSTGRES.md)

## ✅ Arquivos Gerados

Referências úteis no repositório:
- ✅ **setup-railway.ps1** - Script auxiliar (geração de chaves/assistente)
- ✅ **RAILWAY_SETUP_GUIDE.md** - Guia completo passo a passo
- ✅ **MIGRACAO_RAILWAY_POSTGRES.md** - Migração/overwrite local → Railway (Postgres)

---

## 🎯 FAÇA AGORA (5 minutos):

### 1️⃣ Gere suas chaves JWT (obrigatório)

No terminal, gere secrets fortes (não reutilize exemplos):

```powershell
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

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

Defina as variáveis abaixo (exemplo seguro com placeholders):

```env
JWT_SECRET=<gere_um_secret_forte>
JWT_REFRESH_SECRET=<gere_um_secret_forte>
NODE_ENV=production
ALLOWED_ORIGINS=https://prescrimed.up.railway.app
SESSION_TIMEOUT=8h

# Setup inicial (APENAS no primeiro deploy; remova depois)
FORCE_SYNC=true
SEED_MINIMAL=true
SEED_PASSWORD=<defina_uma_senha_inicial>
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

### Teste 2: API

```powershell
curl https://prescrimed.up.railway.app/api/test
```

**Deve retornar JSON com status 200** (`ok: true`)

---

## 🌱 Popular com Dados de Teste

**Somente depois dos testes acima passarem.**

No Railway, o seed inicial pode ser feito via flags no primeiro deploy:
- `FORCE_SYNC=true`
- `SEED_MINIMAL=true`

Depois do primeiro deploy, remova essas flags para evitar ações destrutivas.

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
