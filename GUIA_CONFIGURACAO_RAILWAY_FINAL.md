# 🚀 Configuração Completa do Railway - Prescrimed

## 📋 Guia Passo a Passo para Configurar e Ativar o Sistema

Este guia orienta a configuração completa das variáveis de ambiente no Railway para que o sistema funcione perfeitamente, mantendo o layout responsivo e profissional.

---

## ✅ Passo 1: Configurar Backend (API)

### 1.1. Acessar Serviço "backend pré-criminal"

1. Abra https://railway.app
2. Selecione seu projeto "produção"
3. Clique no serviço **"backend pré-criminal"**
4. Vá em **Variables** (aba lateral)

### 1.2. Adicionar/Editar Variáveis

Clique em **"+ Nova Variável"** ou **"Editor Bruto"** e adicione:

```bash
# ========================================
# BANCO DE DADOS
# ========================================
# Opção 1: Referência ao MongoDB interno (RECOMENDADO)
MONGODB_URI=${{MongoDB.URL_MONGO}}

# Opção 2: Se a referência acima não funcionar, use URL_PÚBLICA_MONGO
# MONGODB_URI=${{MongoDB.URL_PÚBLICA_MONGO}}

# Opção 3: Se precisar copiar manualmente, vá em MongoDB > Variables > copie URL_MONGO
# MONGODB_URI=mongodb://root:senha@mongodb.railway.internal:27017

# ========================================
# SEGURANÇA
# ========================================
# Gere um segredo forte (veja instruções abaixo)
JWT_SECRET=sua_chave_secreta_aqui_32_caracteres_base64

# ========================================
# AMBIENTE
# ========================================
NODE_ENV=production

# ========================================
# CORS (Frontend URL)
# ========================================
# URL do serviço "cliente" no Railway
FRONTEND_URL=https://prescrimed.up.railway.app
```

### 1.3. Gerar JWT_SECRET Forte

**Opção A - PowerShell (Windows):**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

**Opção B - Git Bash (Windows/Linux/Mac):**
```bash
openssl rand -base64 32
```

**Opção C - Online (use com cautela):**
- https://www.grc.com/passwords.htm
- Copie a senha de 64 caracteres

### 1.4. Salvar e Redeploy

1. Clique em **"Salvar Variáveis"** (botão no canto superior direito)
2. O Railway fará redeploy automático
3. Aguarde 2-3 minutos até aparecer "Ativo" no status

### 1.5. Verificar Health do Backend

**Abra o terminal local e teste:**

```bash
# Substitua pela sua URL real do backend
curl https://seu-backend-url.up.railway.app/health
```

**Resposta esperada:**
```json
{
  "status": "ok",
  "db": "connected",
  "timestamp": "2026-01-15T..."
}
```

❌ Se der erro ou `db: "unavailable"`, volte e verifique a variável `MONGODB_URI`.

---

## ✅ Passo 2: Configurar Frontend (Cliente)

### 2.1. Acessar Serviço "cliente"

1. No mesmo projeto Railway
2. Clique no serviço **"cliente"**
3. Vá em **Variables**

### 2.2. Adicionar Variáveis do Frontend

```bash
# ========================================
# URL DA API (Backend)
# ========================================
# Substitua pela URL real do seu backend
VITE_API_URL=https://seu-backend-url.up.railway.app/api

# ========================================
# URL RAIZ DO BACKEND (para healthcheck)
# ========================================
VITE_BACKEND_ROOT=https://seu-backend-url.up.railway.app

# ========================================
# IMAGEM DE FUNDO (OPCIONAL)
# ========================================
# Se quiser usar uma imagem personalizada no login/registro
# VITE_BG_IMAGE_URL=https://sua-imagem.com/hero.jpg
```

### 2.3. Obter URL Real do Backend

**Método 1 - No Railway:**
1. Clique no serviço "backend pré-criminal"
2. Vá em **Settings** > **Domains**
3. Copie a URL gerada (ex: `prescrimed-backend-production-xxxx.up.railway.app`)

**Método 2 - Nos logs:**
1. Clique no serviço "backend"
2. Vá em **Deployments** > último deploy
3. Procure por "Railway URL: https://..."

### 2.4. Salvar e Redeploy

1. Clique em **"Salvar Variáveis"**
2. Aguarde redeploy automático (1-2 minutos)

---

## ✅ Passo 3: Seed do Banco (Popular Dados)

### 3.1. Obter MONGODB_URI

**No Railway:**
1. Clique no serviço **"MongoDB"**
2. Vá em **Variables**
3. Copie o valor de **URL_MONGO** ou **URL_PÚBLICA_MONGO**

Exemplo:
```
mongodb://root:senha_aqui@mongodb.railway.internal:27017
```

### 3.2. Executar Seed Localmente

**Abra PowerShell no diretório do projeto:**

```powershell
# 1. Definir a variável de ambiente
$env:MONGODB_URI="mongodb://root:senha@mongodb.railway.internal:27017"

# 2. Executar o seed
npm run seed:cloud
```

**Aguarde a saída:**
```
✅ Conectado ao MongoDB
✅ Empresa criada: Casa Bela Vida (casa-repouso)
✅ Admin criado: admin.casa@prescrimed.com
✅ 5 pacientes criados para empresa ...
✅ Empresa criada: PetCare Premium (petshop)
✅ Admin criado: admin.pet@prescrimed.com
✅ 5 pacientes criados para empresa ...
✅ Empresa criada: ClinFisio Avançada (fisioterapia)
✅ Admin criado: admin.fisio@prescrimed.com
✅ 5 pacientes criados para empresa ...

======== Credenciais de Teste ========
Empresa: Casa Bela Vida [casa-repouso]
  Admin: admin.casa@prescrimed.com
  Senha: PrescriMed!2024
-----------------------------------
Empresa: PetCare Premium [petshop]
  Admin: admin.pet@prescrimed.com
  Senha: PrescriMed!2024
-----------------------------------
Empresa: ClinFisio Avançada [fisioterapia]
  Admin: admin.fisio@prescrimed.com
  Senha: PrescriMed!2024
-----------------------------------
```

### 3.3. Credenciais Criadas

| Empresa | Email | Senha | Tipo |
|---------|-------|-------|------|
| Casa Bela Vida | admin.casa@prescrimed.com | PrescriMed!2024 | casa-repouso |
| PetCare Premium | admin.pet@prescrimed.com | PrescriMed!2024 | petshop |
| ClinFisio Avançada | admin.fisio@prescrimed.com | PrescriMed!2024 | fisioterapia |

---

## ✅ Passo 4: Testar Sistema Completo

### 4.1. Verificar Backend

```bash
# Health check
curl https://seu-backend-url.up.railway.app/health

# Testar login
curl -X POST https://seu-backend-url.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin.casa@prescrimed.com\",\"senha\":\"PrescriMed!2024\"}"
```

### 4.2. Testar Frontend

1. Abra: `https://prescrimed.up.railway.app`
2. Faça login com: `admin.casa@prescrimed.com` / `PrescriMed!2024`
3. Verifique:
   - ✅ Dashboard carrega
   - ✅ Menu lateral funciona
   - ✅ Pacientes aparecem (5 cadastrados)
   - ✅ Evolução mostra residentes
   - ✅ Layout responsivo (teste no mobile)
   - ✅ Sem banner "Backend Offline"

### 4.3. Testar Responsividade

**Desktop (>1024px):**
- ✅ Sidebar fixa à esquerda
- ✅ Cards em grid (2-3 colunas)
- ✅ Busca completa no header

**Tablet (768px-1024px):**
- ✅ Sidebar colapsável
- ✅ Grid ajusta para 2 colunas
- ✅ Touch targets adequados

**Mobile (<768px):**
- ✅ Sidebar em overlay (menu hambúrguer)
- ✅ Cards em coluna única
- ✅ Botões touch-friendly (44px mínimo)
- ✅ Texto legível sem zoom

---

## 🐛 Troubleshooting

### ❌ "Backend Offline" ainda aparece

**Causa:** Variáveis `VITE_API_URL` ou `VITE_BACKEND_ROOT` não configuradas no cliente.

**Solução:**
1. Verifique se as variáveis estão no serviço "cliente"
2. Force redeploy: Settings > Redeploy
3. Limpe cache do navegador (Ctrl+Shift+Del)

### ❌ Health check retorna "db: unavailable"

**Causa:** `MONGODB_URI` incorreta ou MongoDB offline.

**Solução:**
1. Verifique se MongoDB está "Online" no Railway
2. Teste a referência: `${{MongoDB.URL_MONGO}}`
3. Se não funcionar, copie manualmente de MongoDB > Variables
4. Certifique-se de incluir usuário/senha corretos

### ❌ CORS Error no console

**Causa:** Frontend não está na lista de origens permitidas.

**Solução:**
1. Adicione `FRONTEND_URL` no backend
2. Verifique se a URL está correta (sem barra final)
3. Redeploy do backend

### ❌ Login retorna 401 "Email ou senha incorretos"

**Causa:** Seed não foi executado ou credenciais erradas.

**Solução:**
1. Execute `npm run seed:cloud` novamente
2. Use as credenciais exatas (case-sensitive)
3. Verifique no MongoDB se os usuários existem

### ❌ Imagens não carregam no Login/Registro

**Causa:** VITE_BG_IMAGE_URL inválida ou rede bloqueou.

**Solução:**
- O sistema usa fallback local (pattern.svg)
- O gradiente garante visual profissional mesmo sem foto
- Se quiser imagem customizada, defina `VITE_BG_IMAGE_URL`

---

## 📊 Resumo de Variáveis

### Backend (API)
```bash
MONGODB_URI=${{MongoDB.URL_MONGO}}
JWT_SECRET=chave_segura_32_chars
NODE_ENV=production
FRONTEND_URL=https://prescrimed.up.railway.app
```

### Frontend (Cliente)
```bash
VITE_API_URL=https://backend-url.up.railway.app/api
VITE_BACKEND_ROOT=https://backend-url.up.railway.app
VITE_BG_IMAGE_URL=https://sua-imagem.com/hero.jpg  # opcional
```

---

## 🎉 Sistema Pronto!

Após seguir todos os passos:

- ✅ Backend rodando e conectado ao MongoDB
- ✅ Frontend acessível e comunicando com API
- ✅ 3 empresas + 15 pacientes no banco
- ✅ Credenciais de teste funcionando
- ✅ Layout responsivo mantido
- ✅ Sem alertas de backend offline
- ✅ Healthcheck respondendo 200

**URLs Finais:**
- Frontend: https://prescrimed.up.railway.app
- Backend: https://seu-backend.up.railway.app
- API: https://seu-backend.up.railway.app/api
- Health: https://seu-backend.up.railway.app/health

**Acesso Rápido:**
- Casa de Repouso: admin.casa@prescrimed.com / PrescriMed!2024
- Petshop: admin.pet@prescrimed.com / PrescriMed!2024
- Fisioterapia: admin.fisio@prescrimed.com / PrescriMed!2024

---

## 📞 Próximos Passos Recomendados

1. **Alterar senhas padrão** após primeiro acesso
2. **Criar usuários reais** para cada empresa
3. **Configurar domínio personalizado** (opcional)
4. **Ativar SSL** (Railway faz automático)
5. **Monitorar logs** regularmente
6. **Backup do MongoDB** periódico
7. **Testar em diferentes dispositivos** (mobile, tablet)

---

**🔒 Segurança:** Nunca compartilhe suas variáveis de ambiente publicamente!
**📱 Responsivo:** Testado em Chrome, Firefox, Safari (desktop/mobile)
**🎨 Layout:** Profissional, acessível e moderno mantido em todas as telas
