# 🚀 GUIA DE ATIVAÇÃO - NETLIFY E RENDER

**Data:** 4 de dezembro de 2025  
**Status:** Deploy pronto, aguardando ativação manual

---

## 📋 CREDENCIAIS

### Netlify
**Email:** Cristiano.s.santos@ba.estudante.senai.br  
**Senha:** 18042016

### Render
**Email:** Cristiano.s.santos@ba.estudante.senai.br  
**Senha:** 18042016

---

## 🌐 PASSO 1: VERIFICAR DEPLOY NO NETLIFY

### 1.1 Acessar Netlify Dashboard

1. Abra: https://app.netlify.com
2. Faça login com as credenciais acima
3. Localize o site "prescrimed" na lista

### 1.2 Verificar Status do Deploy

**O deploy automático já foi acionado pelo push do Git!**

- ✅ Commits enviados: 5 commits (último: 9a18806)
- ⏳ Build em andamento ou concluído
- 🌐 URL: https://prescrimed.netlify.app

### 1.3 Acompanhar Build

1. Clique no site "prescrimed"
2. Vá para "Deploys"
3. Veja o deploy mais recente
4. Status esperado: ✅ "Published"

### 1.4 Verificar Configurações (Se necessário)

Se o deploy falhar, verificar:

**Site Settings → Build & deploy → Build settings**

```
Base directory: client
Build command: npm run build
Publish directory: client/dist
```

**Site Settings → Build & deploy → Environment**

```
NODE_VERSION = 18
```

---

## 🔥 PASSO 2: REATIVAR BACKEND NO RENDER

### 2.1 Acessar Render Dashboard

1. Abra: https://dashboard.render.com
2. Faça login com as credenciais acima
3. Localize o serviço "prescrimed-backend"

### 2.2 Status Atual

**Status Esperado:** 🔴 Suspended (Free tier hibernated)

### 2.3 Reativar o Serviço

**ATENÇÃO:** Render Free Tier tem limitações:
- ⚠️ Hiberna após 15 min de inatividade
- ⚠️ Demora ~5 min para "acordar"
- ⚠️ Não é recomendado para produção

**Para Reativar:**

1. Clique no serviço "prescrimed-backend"
2. Procure o botão **"Resume"** ou **"Restart"**
3. Clique em "Resume"
4. Aguarde ~5 minutos para o serviço inicializar
5. Verifique em: https://prescrimed-backend.onrender.com/api/health

### 2.4 Alternativa: Upgrade para Plano Pago

**Recomendado para produção:**

1. No dashboard do Render
2. Clique em "Upgrade"
3. Escolha plano **"Starter"** ($7/mês)
4. Benefícios:
   - ✅ Serviço sempre ativo
   - ✅ Sem hibernação
   - ✅ 512MB RAM garantidos
   - ✅ Melhor performance

---

## 🖥️ PASSO 3: EXECUTAR SISTEMA LOCALMENTE (ALTERNATIVA)

Se preferir não reativar o Render, pode rodar tudo localmente:

### 3.1 Iniciar Sistema Local

```bash
# No Windows, clique duas vezes em:
INICIAR_SISTEMA_COMPLETO.bat

# Ou no PowerShell:
.\INICIAR_SISTEMA_COMPLETO.bat
```

### 3.2 O que acontece:

1. ✅ Para processos Node existentes
2. ✅ Inicia backend na porta 3000 (MongoDB Memory Server)
3. ✅ Inicia frontend na porta 5173
4. ✅ Abre navegador automaticamente
5. ✅ Sistema pronto para uso

### 3.3 URLs Locais

- Frontend: http://localhost:5173
- Backend: http://localhost:3000/api
- Login padrão: admin@admin.com / admin123

---

## 🔍 PASSO 4: TESTES PÓS-ATIVAÇÃO

### 4.1 Testar Netlify (Produção)

**URL:** https://prescrimed.netlify.app

**Testes:**
- [ ] Site carrega corretamente
- [ ] Favicon aparece
- [ ] Layout responsivo em mobile
- [ ] Navegação entre páginas funciona
- [ ] Página de Manual acessível

**⚠️ Login não funcionará até backend estar ativo!**

### 4.2 Testar Backend Render

**URL de Health Check:**
```
https://prescrimed-backend.onrender.com/api/health
```

**Resposta esperada:**
```json
{
  "status": "ok",
  "timestamp": "2025-12-04T..."
}
```

**Se retornar erro 404 ou timeout:**
- Backend ainda está iniciando (aguarde mais 2-3 min)
- OU backend está offline (precisa reativar)

### 4.3 Testar Login Completo

**Com backend ativo:**

1. Acesse: https://prescrimed.netlify.app
2. Faça login:
   - Email: admin@admin.com
   - Senha: admin123
3. Verificar:
   - [ ] Login bem-sucedido
   - [ ] Dashboard carrega
   - [ ] Menu lateral aparece
   - [ ] Todas as páginas acessíveis
   - [ ] Manual funciona

---

## 🐛 TROUBLESHOOTING

### Problema 1: Netlify Deploy Falhou

**Sintomas:** Build com erro no Netlify

**Soluções:**

1. **Verificar logs:**
   - Netlify Dashboard → Deploys → Ver logs
   - Procurar mensagem de erro

2. **Limpar cache e rebuildar:**
   - Deploys → Trigger deploy → Clear cache and deploy site

3. **Verificar configurações:**
   - Site settings → Build & deploy
   - Confirmar base = "client"
   - Confirmar publish = "client/dist"

### Problema 2: Backend Render Não Inicia

**Sintomas:** Health check retorna erro após 5+ minutos

**Soluções:**

1. **Ver logs do Render:**
   - Dashboard → prescrimed-backend → Logs
   - Procurar erros de inicialização

2. **Verificar variáveis de ambiente:**
   - Environment → Environment Variables
   - Confirmar MONGODB_URI está configurada

3. **Fazer deploy manual:**
   - Manual Deploy → Deploy latest commit

### Problema 3: "Failed to Fetch" no Login

**Sintomas:** Erro ao tentar fazer login no site Netlify

**Causa:** Backend Render offline ou hibernando

**Soluções:**

1. **Reativar Render** (ver Passo 2)
2. **OU usar sistema local** (ver Passo 3)
3. **Aguardar 5 minutos** após reativar

### Problema 4: 404 no Netlify

**Sintomas:** Páginas retornam 404 ao recarregar

**Causa:** Redirect SPA não configurado

**Solução:**
- Já está configurado! (_redirects presente)
- Se persistir: Limpar cache do Netlify
- Trigger new deploy

---

## 📊 STATUS ESPERADO APÓS ATIVAÇÃO

### ✅ Netlify (Frontend)

```
Status: Published ✅
URL: https://prescrimed.netlify.app
Build: Success (120KB gzipped)
Deploy time: ~2-3 minutos
```

### ✅ Render (Backend)

```
Status: Live ✅
URL: https://prescrimed-backend.onrender.com
Health: /api/health returns 200 OK
Startup time: ~5 minutos
```

### ✅ Funcionalidades

```
Login: ✅ Funciona
Navegação: ✅ Funciona
API calls: ✅ Funciona
Manual: ✅ Acessível
Responsivo: ✅ Mobile/Tablet/Desktop
```

---

## 📱 COMANDOS ÚTEIS

### Verificar Status do Backend Render (PowerShell)

```powershell
Invoke-WebRequest -Uri "https://prescrimed-backend.onrender.com/api/health" -Method GET
```

**Resposta esperada:**
```
StatusCode: 200
Content: {"status":"ok",...}
```

### Testar Deploy Netlify Localmente

```bash
cd client
npm run build
npm run preview
```

Acesse: http://localhost:4173

---

## 🎯 CHECKLIST DE ATIVAÇÃO COMPLETA

### Netlify
- [ ] Login realizado em https://app.netlify.com
- [ ] Site "prescrimed" localizado
- [ ] Deploy status: Published
- [ ] URL acessível: https://prescrimed.netlify.app
- [ ] Build sem erros
- [ ] Site carregando corretamente

### Render
- [ ] Login realizado em https://dashboard.render.com
- [ ] Serviço "prescrimed-backend" localizado
- [ ] Status mudado de Suspended para Live
- [ ] Health check retorna 200 OK
- [ ] Aguardados 5 minutos para inicialização

### Testes Funcionais
- [ ] Frontend carrega (Netlify)
- [ ] Backend responde (Render)
- [ ] Login funciona
- [ ] Dashboard carrega
- [ ] Navegação entre páginas OK
- [ ] Manual acessível
- [ ] Responsivo em mobile

---

## 💡 RECOMENDAÇÕES

### Para Desenvolvimento

✅ **Use o sistema local:**
```bash
INICIAR_SISTEMA_COMPLETO.bat
```

**Vantagens:**
- Sem custo
- Sem latência
- Sem hibernação
- Dados em memória (rápido)

### Para Produção

⚠️ **Considere upgrade do Render:**

**Plano Free:**
- Hiberna após 15 min
- Demora para acordar
- Não recomendado para usuários reais

**Plano Starter ($7/mês):**
- Sempre ativo
- Performance estável
- Recomendado para produção

---

## 📞 SUPORTE

### Links Úteis

- **Netlify Docs:** https://docs.netlify.com
- **Render Docs:** https://render.com/docs
- **Netlify Dashboard:** https://app.netlify.com
- **Render Dashboard:** https://dashboard.render.com

### Verificar Status dos Serviços

- **Netlify Status:** https://www.netlifystatus.com
- **Render Status:** https://status.render.com

---

## ✅ PRÓXIMOS PASSOS

1. **Fazer login no Netlify** com as credenciais fornecidas
2. **Verificar deploy** (deve estar publicado automaticamente)
3. **Fazer login no Render** com as credenciais fornecidas
4. **Clicar em "Resume"** para reativar o backend
5. **Aguardar 5 minutos** para backend inicializar
6. **Testar sistema** em https://prescrimed.netlify.app
7. **Se preferir local,** rodar `INICIAR_SISTEMA_COMPLETO.bat`

---

**🚀 Sistema configurado e pronto para ativação!**

**Credenciais:** Cristiano.s.santos@ba.estudante.senai.br / 18042016

**URLs:**
- Frontend: https://prescrimed.netlify.app
- Backend: https://prescrimed-backend.onrender.com
- Netlify: https://app.netlify.com
- Render: https://dashboard.render.com
