# 🚂 Guia de Configuração do Railway

Este guia contém o passo a passo completo para configurar e fazer deploy do Prescrimed no Railway.

> **Última Atualização:** 17 de janeiro de 2026  
> **Versão do Guia:** 1.1 - Com troubleshooting aprimorado

---

## 📋 Pré-requisitos

- Conta no Railway (https://railway.app)
- Repositório GitHub conectado ao Railway
- Node.js 20+ (já configurado no projeto)

---

## 🗄️ Passo 1: Adicionar PostgreSQL

1. No seu projeto Railway, clique em **"+ New"**
2. Selecione **"Database" → "PostgreSQL"**
3. Aguarde a criação do banco (leva ~30 segundos)
4. Clique no serviço PostgreSQL criado
5. Vá na aba **"Variables"**
6. Copie o valor de `DATABASE_URL` (ou `DATABASE_PRIVATE_URL`)

---

## ⚙️ Passo 2: Configurar Variáveis do Backend

1. Clique no serviço **"backend pré-criminal"** (seu serviço Node.js)
2. Vá em **"Settings" → "Variables"** (ou aba "Variables")
3. Adicione as seguintes variáveis obrigatórias:

### 🔴 Variáveis Obrigatórias

| Variável | Valor | Como obter |
|----------|-------|------------|
| `DATABASE_URL` | `postgresql://...` | Cole o valor copiado do PostgreSQL |
| `JWT_SECRET` | `abc123...` (64+ caracteres) | Gere com: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` |
| `JWT_REFRESH_SECRET` | `xyz789...` (64+ caracteres) | Gere com o mesmo comando acima (valor diferente) |
| `NODE_ENV` | `production` | Digite manualmente |

### 🟢 Variáveis Opcionais (Recomendadas)

| Variável | Valor | Descrição |
|----------|-------|-----------|
| `TZ` | `America/Sao_Paulo` | Timezone do Brasil (Horário de Brasília) |
| `FRONTEND_URL` | `https://prescrimed.netlify.app` | URL do seu frontend no Netlify |
| `CORS_ORIGIN` | `https://prescrimed.netlify.app` | Mesma URL (para CORS) |
| `SESSION_TIMEOUT` | `8h` | Tempo de sessão do usuário |

### 🚀 Variáveis para Primeiro Deploy (TEMPORÁRIAS)

**Use apenas no primeiro deploy para criar tabelas e dados demo:**

| Variável | Valor | Remover Depois? |
|----------|-------|-----------------|
| `FORCE_SYNC` | `true` | ✅ Sim, após primeiro deploy |
| `SEED_MINIMAL` | `true` | ✅ Sim, após primeiro deploy |
| `SEED_SLUG` | `empresa-teste` | ✅ Sim (opcional) |
| `SEED_PASSWORD` | `Prescri@2026` | ✅ Sim (opcional) |

---

## 🔄 Passo 3: Fazer Deploy

1. Após adicionar as variáveis, clique em **"Deploy"** ou espere o deploy automático
2. Aguarde o build completar (~2-3 minutos na primeira vez)
3. Verifique os **"Logs"** para acompanhar:
   - ✅ Build do frontend completado
   - ✅ PostgreSQL conectado
   - ✅ Seed executado (se `SEED_MINIMAL=true`)
   - ✅ Servidor rodando na porta

---

## ✅ Passo 4: Validar Deploy

### 4.1. Verificar Health
Acesse no navegador:
```
https://seu-servico.up.railway.app/health
```

Resposta esperada:
```json
{
  "status": "ok",
  "uptime": 123.45,
  "database": "connected",
  "timestamp": "2026-01-17T..."
}
```

### 4.2. Testar API
```
https://seu-servico.up.railway.app/api/test
```

Resposta esperada:
```json
{
  "message": "API Prescrimed com PostgreSQL",
  "timestamp": "...",
  "database": "postgres + Sequelize"
}
```

### 4.3. Verificar Tabelas (Opcional)
```
https://seu-servico.up.railway.app/api/diagnostic/db-check
```

Deve retornar lista de tabelas criadas: `empresas`, `usuarios`, `pacientes`, `prescricoes`.

---

## 🧪 Passo 5: Testar Login com Dados Demo

Se você usou `SEED_MINIMAL=true`, os seguintes usuários foram criados:

| Email | Senha | Função |
|-------|-------|--------|
| `superadmin+empresa-teste@prescrimed.com` | `Prescri@2026` | Super Administrador |
| `admin+empresa-teste@prescrimed.com` | `Prescri@2026` | Administrador |
| `nutri+empresa-teste@prescrimed.com` | `Prescri@2026` | Nutricionista |
| `atendente+empresa-teste@prescrimed.com` | `Prescri@2026` | Atendente |

Teste no frontend (Netlify) fazendo login com qualquer um desses usuários.

---

## 🧹 Passo 6: Limpeza Pós-Deploy

Após confirmar que tudo funciona:

1. **Remova as variáveis temporárias:**
   - `FORCE_SYNC`
   - `SEED_MINIMAL`
   - `SEED_SLUG` (opcional)
   - `SEED_PASSWORD` (opcional)

2. **Faça um redeploy** para aplicar as mudanças

**⚠️ Importante:** Não remova `DATABASE_URL`, `JWT_SECRET`, ou outras variáveis obrigatórias!

---

## 🐛 Troubleshooting

### Deploy falha no healthcheck
- **Causa:** Variáveis obrigatórias ausentes ou incorretas
- **Solução:** Verifique `DATABASE_URL` e `JWT_SECRET` no Railway

### Erro "database unavailable"
- **Causa:** PostgreSQL não conectado
- **Solução:** Certifique-se de que `DATABASE_URL` está configurada e aponta para o PostgreSQL do Railway

### Tabelas não foram criadas
- **Causa:** Primeira execução sem `FORCE_SYNC=true`
- **Solução:** Adicione `FORCE_SYNC=true`, redeploy, depois remova

### Login retorna "Credenciais inválidas"
- **Causa:** Seed não foi executado ou falhou
- **Solução:** 
  1. Adicione `SEED_MINIMAL=true`
  2. Redeploy
  3. Verifique logs para confirmar "✅ Seed concluído"

### Frontend não carrega (404)
- **Causa:** Build do client falhou
- **Solução:** Verifique logs de build; se necessário, rode local: `npm run build:client`

### Erro 405 (Method Not Allowed) no login
- **Sintoma:** Login retorna erro 405 ou CORS bloqueado
- **Causa:** CORS não configurado corretamente ou método HTTP incorreto
- **Solução:**
  1. Adicione o domínio do frontend em `ALLOWED_ORIGINS`:
     ```
     ALLOWED_ORIGINS=https://seu-frontend.netlify.app,https://prescrimed.up.railway.app
     ```
  2. Verifique os logs do Railway para ver a requisição:
     ```
     [API] POST /api/auth/login  # Correto
     [API] 405 Method Not Allowed: GET /api/auth/login  # Erro: método errado
     ```
  3. Se o método estiver incorreto, reconstrua o frontend:
     ```bash
     cd client && npm run build:railway
     git add . && git commit -m "fix: rebuild frontend"
     git push
     ```

### Logs não aparecem no Railway
- **Causa:** Logs podem estar desabilitados ou filtrados
- **Solução:** 
  1. Vá em Settings → Deployments → [último deploy] → View logs
  2. Procure por `[API]` para ver requisições
  3. Procure por `✅` e `❌` para status do sistema

---

## 📞 Suporte

- **Logs do Railway:** Settings → Deployments → [último deploy] → View logs
- **GitHub Issues:** https://github.com/cristiano-superacao/prescrimed/issues
- **Documentação Railway:** https://docs.railway.app

---

## 🎉 Pronto!

Seu backend está rodando no Railway com PostgreSQL, tabelas criadas e dados demo.
Agora configure o frontend no Netlify para apontar para:
```
https://seu-servico.up.railway.app/api
```
