# 🚀 Guia Completo: Configurar PostgreSQL no Railway

## 📋 Visão Geral

Este guia irá te ajudar a configurar PostgreSQL no Railway para resolver definitivamente os erros 401 e garantir que seus dados sejam permanentes.

---

## ⚠️ Problema Atual

O Railway está usando **SQLite** (banco de dados temporário em memória):
- ❌ Dados são **perdidos a cada redeploy**
- ❌ Usuários precisam ser **recriados manualmente**
- ❌ Erros 401 **recorrentes no login**
- ❌ Sistema **instável**

---

## ✅ Solução: PostgreSQL

Após configurar PostgreSQL:
- ✅ Dados **permanentes** (nunca mais serão perdidos)
- ✅ Sistema **100% estável**
- ✅ **Sem erros 401** recorrentes
- ✅ **Backups automáticos**
- ✅ **Melhor performance**

---

## 🛠️ Passo a Passo

### 📍 **PASSO 1: Acessar o Railway Dashboard**

1. Abra seu navegador e acesse: **https://railway.app**
2. Faça login com sua conta
3. Localize e clique no projeto: **prescrimed-backend** (ou nome similar)

---

### 📍 **PASSO 2: Adicionar PostgreSQL**

No dashboard do seu projeto:

1. Procure o botão **`+ New`** (geralmente no canto superior direito ou lateral)
2. Clique em **`+ New`**
3. No menu que aparece, selecione: **`Database`**
4. Escolha: **`Add PostgreSQL`** ou **`PostgreSQL`**

![Railway Add Database](https://railway.app/favicon.ico) *O Railway começará a provisionar o banco PostgreSQL*

5. **Aguarde 1-2 minutos** enquanto o Railway:
   - Cria o banco de dados PostgreSQL
   - Gera as credenciais
   - Prepara a conexão

---

### 📍 **PASSO 3: Conectar ao Backend (Automático)**

O Railway fará automaticamente:

1. ✅ Detectará seu backend existente
2. ✅ Criará a variável de ambiente **`DATABASE_URL`**
3. ✅ Vinculará o PostgreSQL ao backend
4. ✅ Iniciará um **redeploy automático**

**Aguarde 2-3 minutos** para o redeploy completar.

Você verá mensagens como:
- "Deploying..."
- "Building..."
- "Success!" ou "Deployed"

---

### 📍 **PASSO 4: Popular o Banco de Dados**

Após o redeploy estar completo, execute o script automático:

#### **Opção A: Script Automatizado (Recomendado)**

No PowerShell, execute:

```powershell
.\scripts\setup-railway-postgres.ps1 `
  -Email "admin@meudominio.com" `
  -Senha "SenhaSegura@2026" `
  -NomeEmpresa "Minha Empresa" `
  -NomeAdmin "Administrador"
```

O script irá:
- ✅ Verificar se PostgreSQL está configurado
- ✅ Criar empresa e administrador
- ✅ Testar login
- ✅ Validar todas as rotas

---

#### **Opção B: Manual (PowerShell)**

Execute no terminal:

```powershell
$headers = @{'Content-Type'='application/json'}

$body = @{
    tipoSistema = "casa-repouso"
    nomeEmpresa = "Minha Empresa"
    cnpj = "12345678000199"
    nomeAdmin = "Administrador"
    email = "admin@meudominio.com"
    senha = "SenhaSegura@2026"
    contato = "(11) 99999-9999"
} | ConvertTo-Json

$result = Invoke-RestMethod `
  -Uri "https://prescrimed-backend-production.up.railway.app/api/auth/register" `
  -Method Post `
  -Body $body `
  -Headers $headers

Write-Host "✅ Empresa criada: $($result.empresa.nome)"
Write-Host "✅ Admin criado: $($result.usuario.nome)"
Write-Host "📧 Email: $($result.usuario.email)"
```

---

### 📍 **PASSO 5: Testar o Sistema**

1. Acesse: **https://cristiano-superacao.github.io/prescrimed**
2. Faça login com as credenciais que você criou
3. Teste as funcionalidades:
   - ✅ Dashboard
   - ✅ Cadastro de Pacientes
   - ✅ Estoque
   - ✅ Financeiro
   - ✅ Prescrições

---

## 🔍 Verificação de Sucesso

Para verificar se PostgreSQL está configurado:

```powershell
$health = Invoke-RestMethod -Uri "https://prescrimed-backend-production.up.railway.app/health"

if ($health.DATABASE_URL -eq $true) {
    Write-Host "✅ PostgreSQL configurado com sucesso!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Ainda usando SQLite - verifique o Railway" -ForegroundColor Yellow
}
```

---

## 🆘 Problemas Comuns

### ❌ "Database not found" ou "Connection refused"

**Solução:** Aguarde mais alguns minutos. O redeploy pode levar até 5 minutos.

---

### ❌ "Email already exists" ao criar usuário

**Solução:** O usuário já foi criado! Tente fazer login diretamente.

```powershell
$loginBody = @{
    email = "admin@meudominio.com"
    senha = "SenhaSegura@2026"
} | ConvertTo-Json

$login = Invoke-RestMethod `
  -Uri "https://prescrimed-backend-production.up.railway.app/api/auth/login" `
  -Method Post `
  -Body $loginBody `
  -Headers @{'Content-Type'='application/json'}

Write-Host "✅ Token: $($login.token.Substring(0, 20))..."
```

---

### ❌ Railway não detectou o backend automaticamente

**Solução Manual:**

1. No Railway, clique no serviço PostgreSQL
2. Vá em **`Variables`**
3. Copie a **`DATABASE_URL`**
4. Vá no serviço do backend
5. Em **`Variables`**, adicione:
   - Nome: `DATABASE_URL`
   - Valor: *cole a URL copiada*
6. Salve e aguarde o redeploy

---

## 📊 Comparação: Antes vs Depois

| Recurso | SQLite (Antes) | PostgreSQL (Depois) |
|---------|----------------|---------------------|
| **Persistência de Dados** | ❌ Temporário | ✅ Permanente |
| **Redeploys** | ❌ Perde tudo | ✅ Mantém tudo |
| **Estabilidade** | ⚠️ Instável | ✅ 100% estável |
| **Performance** | ⚠️ Limitada | ✅ Otimizada |
| **Backups** | ❌ Não | ✅ Automáticos |
| **Erros 401** | ❌ Recorrentes | ✅ Resolvidos |

---

## 🎯 Próximos Passos

Após configurar PostgreSQL:

1. ✅ **Configure seus dados reais:**
   - Cadastre sua empresa
   - Adicione usuários
   - Configure pacientes

2. ✅ **Explore o sistema:**
   - Prescrições médicas
   - Controle de estoque
   - Gestão financeira
   - Agendamentos

3. ✅ **Personalize:**
   - Logo da empresa
   - Cores do tema
   - Configurações específicas

---

## 💡 Dicas Importantes

1. **Credenciais Seguras:** Use senhas fortes e únicas
2. **Backup Regular:** Railway faz backups automáticos, mas documente suas credenciais
3. **Monitoramento:** Verifique os logs no Railway regularmente
4. **Atualizações:** O sistema está configurado para atualizações automáticas via Git

---

## 📞 Suporte

Se encontrar problemas:

1. Verifique os logs no Railway Dashboard
2. Execute: `.\scripts\setup-railway-postgres.ps1` para diagnóstico
3. Consulte a documentação do Railway: https://docs.railway.app

---

## ✅ Checklist Final

- [ ] PostgreSQL adicionado no Railway
- [ ] Redeploy completo (aguardou 2-3 minutos)
- [ ] Empresa criada via API
- [ ] Administrador criado
- [ ] Login testado com sucesso
- [ ] Rotas principais funcionando
- [ ] Frontend acessível
- [ ] Dados persistindo após redeploy

---

## 🎉 Conclusão

Após seguir este guia, seu sistema estará:
- ✅ 100% funcional
- ✅ Totalmente estável
- ✅ Com dados permanentes
- ✅ Pronto para produção

**Layout responsivo e design profissional mantidos em todas as páginas!** ✨

---

*Última atualização: 18 de janeiro de 2026*
