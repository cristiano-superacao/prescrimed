# 🏥 Correção de Health Checks do Railway

**Data:** 23 de janeiro de 2026  
**Status:** ✅ CORRIGIDO

## 📋 Problemas Identificados (das imagens do Railway)

### 1. Serviço "prescrito" (Backend Node)
- ❌ Deploy falhando com "A implantação falhou durante o processo de rede"
- ❌ Health check timeout após múltiplas tentativas (1m28s cada)
- ❌ "Réplicas em escala 1/1 nunca ficaram saudáveis!"

### 2. Serviço "fluxo de luz" (Streamlit)
- ⚠️ 10 avisos de health check
- ❌ Verificação de integridade falhando continuamente

## 🔧 Correções Aplicadas

### Backend (railway.json)
```json
{
  "healthcheckTimeout": 300,        // ↑ 100→300s (5 minutos)
  "restartPolicyMaxRetries": 3      // ↓ 10→3 (evita throttling)
}
```

**Por quê?**
- O backend precisa:
  1. Conectar ao PostgreSQL (pode levar 10-30s)
  2. Executar `sequelize.sync()` com ALTER (20-60s se schema mudou)
  3. Adicionar valores ao ENUM `usuarios.role` (5-15s)
  4. Executar seed mínimo se `SEED_MINIMAL=true` (10-30s)
- Total estimado: **60-120 segundos** em primeira implantação
- Railway precisa de margem: **300s garante sucesso**

### Streamlit (streamlit/railway.toml)
```toml
startCommand = "python -m streamlit run app.py --server.port $PORT --server.address 0.0.0.0 --server.headless true --server.runOnSave false"
healthcheckPath = "/_stcore/health"  # ↑ era "/" (lento)
healthcheckTimeout = 180             # ↑ era 100s
restartPolicyMaxRetries = 3          # ↓ era 10
```

**Por quê?**
- O endpoint `/` do Streamlit:
  - Renderiza toda a página (gráficos, CSS, JavaScript)
  - Pode levar 30-60s na primeira renderização
  - Não é ideal para health check
- O endpoint nativo `/_stcore/health`:
  - Retorna JSON simples: `{"status": "ok"}`
  - Responde em <1 segundo
  - É o endpoint oficial para monitoramento
- Flags adicionais:
  - `--server.headless true`: otimiza para servidor (sem browser watcher)
  - `--server.runOnSave false`: desabilita hot-reload (não precisa em produção)

### Nixpacks do Streamlit (streamlit/nixpacks.toml)
```toml
nixPkgs = ["python311", "python311Packages.pip", "python311Packages.setuptools", "python311Packages.wheel"]
```

**Por quê?**
- O Python do Nixpacks **não vem com pip embutido**
- O erro original:
  ```
  /root/.nix-profile/bin/python: Nenhum módulo chamado pip
  ```
- Solução: instalar `python311Packages.pip` via Nix (já inclui pip no ambiente)

## ✅ Checklist de Deploy no Railway

Antes de fazer redeploy, **verifique**:

### Backend ("prescrito")
- [ ] Variáveis de ambiente configuradas:
  - `DATABASE_URL` (do plugin PostgreSQL)
  - `JWT_SECRET` (gerado via `setup-railway.ps1`)
  - `JWT_REFRESH_SECRET`
  - `NODE_ENV=production`
  - `TZ=America/Sao_Paulo`
  - `ALLOWED_ORIGINS` (URLs do frontend e Streamlit)
- [ ] Serviço com **Public Networking** habilitado
- [ ] Health check path: `/health`
- [ ] Timeout: **300 segundos** (5 min)

### Streamlit ("fluxo de luz")
- [ ] Variáveis de ambiente configuradas:
  - `PORT` (Railway injeta automaticamente)
- [ ] Serviço com **Public Networking** habilitado
- [ ] Health check path: `/_stcore/health` ⚠️ CRÍTICO
- [ ] Timeout: **180 segundos** (3 min)
- [ ] Root Directory: `streamlit/` (não raiz do repositório!)

### Frontend ("cliente")
- [ ] Variáveis de ambiente configuradas:
  - `VITE_BACKEND_ROOT` (URL pública do backend "prescrito")
- [ ] Build command: `npm ci && npm run build:railway`
- [ ] Start command: `npx serve -s dist -l $PORT`
- [ ] Health check: **OFF** (serve é instantâneo)

## 🚀 Próximos Passos

1. **Commitar e fazer push:**
   ```powershell
   git add -A
   git commit -m "fix(railway): aumenta health check timeout e corrige endpoint do Streamlit"
   git push origin main
   ```

2. **Redeploy no Railway:**
   - Serviço "prescrito" (backend) → aguardar até 5 min
   - Serviço "fluxo de luz" (Streamlit) → aguardar até 3 min

3. **Validar logs:**
   - Backend deve mostrar:
     ```
     ✅ Banco de dados conectado com sucesso
     ✅ Tabelas criadas/sincronizadas (produção com ALTER)
     🎉 Sistema pronto para uso!
     🚀 Servidor ativo na porta 8000
     ```
   - Streamlit deve mostrar:
     ```
     You can now view your Streamlit app in your browser.
     ```

4. **Testar health checks:**
   ```powershell
   # Backend
   curl https://prescrito.up.railway.app/health
   # Deve retornar: {"status":"ok","database":"connected",...}

   # Streamlit
   curl https://fluxo-de-luz.up.railway.app/_stcore/health
   # Deve retornar: {"status":"ok"}
   ```

5. **Validar funcionamento:**
   - Acessar frontend → fazer login
   - Criar empresa de teste
   - Cadastrar paciente
   - Criar prescrição
   - Verificar dashboard

## 📊 Impacto das Mudanças

### Antes (com problemas)
- ❌ Backend falhava após 1m28s × 7 tentativas = ~10 min de espera inútil
- ❌ Streamlit falhava continuamente (10+ avisos)
- ❌ Deploy nunca completava com sucesso

### Depois (esperado)
- ✅ Backend sobe em 2-3 minutos (primeira vez) ou 30-60s (redeploys)
- ✅ Streamlit sobe em 30-60 segundos
- ✅ Health checks passam consistentemente
- ✅ Serviços ficam estáveis (sem restart loops)

## 🔍 Troubleshooting

Se ainda falhar após essas correções:

### Backend não conecta ao banco
```powershell
# Verificar no Railway:
# 1. Plugin PostgreSQL está adicionado ao projeto?
# 2. DATABASE_URL está nas variáveis de ambiente do serviço?
# 3. Logs mostram "Conectando ao banco de dados..."?
```

### Streamlit não responde em /_stcore/health
```powershell
# Verificar no Railway:
# 1. Root Directory do serviço é "streamlit/" ?
# 2. Arquivo streamlit/app.py existe?
# 3. Logs mostram "You can now view your Streamlit app"?
```

### Timeout persiste mesmo com 5 minutos
```powershell
# Pode ser problema de quota/recurso:
# 1. Verificar se plano Railway tem memória suficiente (min 512MB)
# 2. Verificar se região us-east4 está disponível
# 3. Tentar redeploy forçado (não incremental)
```

## 📝 Referências

- [Railway Health Checks](https://docs.railway.app/deploy/healthchecks)
- [Streamlit Health Endpoint](https://docs.streamlit.io/develop/api-reference/configuration/server-options)
- [Nixpacks Python Config](https://nixpacks.com/docs/providers/python)
- [Guia anterior: CONFIGURACAO_PRONTA.md](./CONFIGURACAO_PRONTA.md)

---

**Layout Responsivo:** ✅ Nenhuma mudança no frontend/UI  
**Profissionalismo:** ✅ Health checks adequados para produção  
**Compatibilidade:** ✅ Mantém .env.railway e variáveis existentes
