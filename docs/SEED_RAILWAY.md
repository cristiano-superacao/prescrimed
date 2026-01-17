# 🚂 Replicar Dados Demo para o Railway

Este guia mostra como transferir os dados de demonstração (empresas, usuários, pacientes e prescrições) do banco SQLite local para o PostgreSQL do Railway, **mantendo o layout responsivo e profissional** (só muda o banco de dados).

## ✅ Pré-requisitos

- Projeto já enviado para o GitHub
- Backend configurado no Railway
- PostgreSQL vinculado ao serviço do backend no Railway
- Sistema testado localmente (os dados já existem no SQLite)

## 🎯 Método Automatizado (Recomendado)

### Passo 1: Executar o Script

No PowerShell, na raiz do projeto:

```powershell
cd "c:\Users\Superação\Desktop\Sistema\prescrimed-main"
.\scripts\seed-railway.ps1
```

O script vai:
1. Solicitar a `DATABASE_URL` do Railway
2. Validar a conexão
3. Executar o seed diretamente no Postgres do Railway
4. Limpar as variáveis de ambiente automaticamente

### Passo 2: Pegar a DATABASE_URL

1. Acesse [railway.app](https://railway.app)
2. Abra seu projeto
3. Clique no serviço do **Postgres** (ou vá em **Variables** do backend)
4. Copie o valor completo da variável `DATABASE_URL`
   - Formato: `postgresql://usuario:senha@host.railway.app:5432/railway?sslmode=require`

### Passo 3: Colar no Script

Quando o script pedir, cole a `DATABASE_URL` e pressione Enter.

✅ **Pronto!** Os dados serão replicados automaticamente.

---

## 🔧 Método Manual

Se preferir executar manualmente:

```powershell
cd "c:\Users\Superação\Desktop\Sistema\prescrimed-main"

# 1. Definir a DATABASE_URL (copiada do Railway)
$env:DATABASE_URL = "postgresql://usuario:senha@host.railway.app:5432/railway"

# 2. Executar o seed
npm run seed:demo

# 3. Limpar a variável
Remove-Item Env:DATABASE_URL
```

---

## 📊 Dados Criados

Após executar o seed, o Postgres do Railway terá:

### 🏢 Empresas (3)
1. **Benevolência Solidária** (Casa de Repouso - Plano Profissional)
2. **Vital Fisio Center** (Fisioterapia - Plano Empresa)
3. **Pet Care Premium** (Petshop - Plano Básico)

### 👥 Usuários (9 total - 3 por empresa)

**Senha para todos:** `Prescri@2026`

#### Benevolência Solidária
- `admin+benevolencia-solidaria@prescrimed.com` (Admin)
- `nutri+benevolencia-solidaria@prescrimed.com` (Nutricionista)
- `atendente+benevolencia-solidaria@prescrimed.com` (Atendente)

#### Vital Fisio Center
- `admin+vital-fisio-center@prescrimed.com` (Admin)
- `nutri+vital-fisio-center@prescrimed.com` (Nutricionista)
- `atendente+vital-fisio-center@prescrimed.com` (Atendente)

#### Pet Care Premium
- `admin+pet-care-premium@prescrimed.com` (Admin)
- `nutri+pet-care-premium@prescrimed.com` (Nutricionista)
- `atendente+pet-care-premium@prescrimed.com` (Atendente)

### 🧑‍⚕️ Pacientes (9 total - 3 por empresa)
Cada empresa tem 3 pacientes com dados completos (nome, CPF, endereço, etc.)

### 📋 Prescrições (9 total - 1 por paciente)
Cada paciente possui 1 prescrição nutricional ativa com:
- Café da manhã (08:00)
- Almoço (12:00)
- Jantar (18:30)

---

## 🚀 Testar no Railway

1. **Acesse o painel do Railway**
2. **Vá no serviço do backend**
3. **Clique em "Redeploy"** (ou aguarde o deploy automático se configurado)
4. **Aguarde o deploy finalizar** (geralmente 2-5 minutos)
5. **Acesse a URL do projeto** (exemplo: `https://seu-projeto.up.railway.app`)
6. **Faça login** com qualquer uma das credenciais acima

---

## 🎨 Layout Mantido

✅ **Nenhuma mudança visual no sistema:**
- O frontend React continua exatamente igual (responsivo, TailwindCSS)
- A pasta WEB continua servida em `/web` (landing responsiva)
- Todos os componentes, cores, espaçamentos permanecem idênticos
- **Apenas a origem dos dados mudou:** SQLite local → PostgreSQL Railway

---

## 🔄 Ambientes

### Local (Desenvolvimento)
- **Backend:** http://localhost:3000
- **Frontend:** http://localhost:5173
- **Banco:** SQLite (`database.sqlite`)
- **Dados:** Mesmos do seed

### Produção (Railway)
- **Backend:** `https://seu-backend.up.railway.app`
- **Frontend:** Conforme configurado (Netlify/Railway/Outro)
- **Banco:** PostgreSQL (Railway)
- **Dados:** Replicados via script acima

---

## ⚠️ Observações

1. **Não commite a DATABASE_URL:** Ela é sensível e só existe no Railway
2. **Localmente sempre use SQLite:** Não defina `DATABASE_URL` no `.env` local
3. **O script limpa a variável automaticamente:** Evita conflitos futuros
4. **Pode rodar quantas vezes quiser:** O seed usa `findOrCreate` (não duplica dados)

---

## 📚 Arquivos Relacionados

- **Script automatizado:** [`scripts/seed-railway.ps1`](./seed-railway.ps1)
- **Script de seed:** [`scripts/seed-demo-data.js`](./seed-demo-data.js)
- **Config do banco:** [`config/database.js`](../config/database.js)
- **Guia de deploy:** [`DEPLOY.md`](../DEPLOY.md)
- **Config Railway:** [`RAILWAY_CONFIG.md`](../RAILWAY_CONFIG.md)

---

## 🆘 Problemas Comuns

### ❌ "SQLITE_ERROR: no such column"
**Solução:** Apague `database.sqlite` e rode `npm run seed:demo` novamente

### ❌ "SQLITE_BUSY: database is locked"
**Solução:** Feche qualquer processo usando o banco (backend rodando) e tente novamente

### ❌ "connection timeout" ao rodar no Railway
**Solução:** Verifique se o Postgres está ativo no painel e se a `DATABASE_URL` está correta

### ❌ Seed roda mas login não funciona no Railway
**Solução:** Confira se o backend realmente subiu após o deploy e se está usando a `DATABASE_URL` correta

---

**✨ Pronto para produção com dados de demonstração realistas e layout profissional mantido!**
