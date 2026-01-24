# ⚡ Guia Rápido: Redeploy Railway

## 🎯 O que foi corrigido?

### ✅ Commits enviados:
1. `e94fad7b` - fix(streamlit): garante pip no Nixpacks (Python packages)
2. `8ff8cf4e` - fix(railway): health check timeout 5min + endpoint correto

### 🔧 Mudanças aplicadas:

| Serviço | Antes | Depois |
|---------|-------|--------|
| **Backend** | timeout 100s | ⏱️ **300s (5min)** |
| **Backend** | 10 retries | 🔁 **3 retries** |
| **Streamlit** | endpoint `/` | 🎯 **`/_stcore/health`** |
| **Streamlit** | timeout 100s | ⏱️ **180s (3min)** |
| **Streamlit** | sem pip packages | 📦 **pip+setuptools via Nix** |

## 🚀 Como fazer Redeploy

### 1️⃣ Serviço Backend ("prescrito")

```
1. Abrir Railway Dashboard
2. Clicar no serviço "prescrito"
3. Aba "Deployments"
4. Botão [...] → "Redeploy"
5. Aguardar até 5 minutos
6. Verificar logs:
   ✅ "Banco de dados conectado"
   ✅ "Tabelas sincronizadas"
   ✅ "Sistema pronto para uso"
   ✅ "Servidor ativo na porta 8000"
```

### 2️⃣ Serviço Streamlit ("fluxo de luz")

```
1. Clicar no serviço "fluxo de luz"
2. IMPORTANTE: Verificar "Settings" → "Root Directory" = "streamlit/"
3. Aba "Deployments"
4. Botão [...] → "Redeploy"
5. Aguardar até 3 minutos
6. Verificar logs:
   ✅ "Collecting streamlit"
   ✅ "Successfully installed streamlit"
   ✅ "You can now view your Streamlit app"
```

### 3️⃣ Validar Health Checks

Após deploy bem-sucedido:

**Backend:**
```powershell
# Substituir pela URL real do seu serviço
curl https://prescrito.up.railway.app/health
```
Deve retornar:
```json
{"status":"ok","database":"connected","uptime":123.45}
```

**Streamlit:**
```powershell
# Substituir pela URL real do seu serviço
curl https://fluxo-de-luz.up.railway.app/_stcore/health
```
Deve retornar:
```json
{"status":"ok"}
```

## ⚠️ Atenção!

### Se Backend falhar novamente:

**Verificar variáveis de ambiente:**
- [ ] `DATABASE_URL` está configurado?
- [ ] `JWT_SECRET` existe?
- [ ] `JWT_REFRESH_SECRET` existe?
- [ ] `NODE_ENV=production`

**Checar PostgreSQL plugin:**
- [ ] Plugin PostgreSQL adicionado ao projeto?
- [ ] SERVICE_NAME conectado ao banco?

### Se Streamlit falhar novamente:

**Verificar configuração do serviço:**
- [ ] **Root Directory** = `streamlit/` (não vazio!)
- [ ] Arquivo `streamlit/app.py` existe no repositório?
- [ ] Health Check Path = `/_stcore/health` (não `/`)

**Logs mostram "Module pip not found"?**
- ✅ JÁ CORRIGIDO no commit `e94fad7b`
- Basta fazer redeploy que vai funcionar

## 📊 Tempo Esperado

| Fase | Backend | Streamlit |
|------|---------|-----------|
| Build | 2-3 min | 1-2 min |
| Start | 30-60s | 30s |
| Health Check | 10-30s | 5-10s |
| **TOTAL** | **3-5 min** | **2-3 min** |

## ✅ Sucesso!

Quando deploy funcionar:

1. ✅ Indicator verde no Railway
2. ✅ Sem avisos ⚠️
3. ✅ "On-line" em todos os serviços
4. ✅ URLs públicas acessíveis

### Próximo passo:
Abrir o frontend e testar:
- Login
- Criar empresa
- Cadastrar paciente
- Fazer prescrição
- Ver dashboard

---

**Dúvida comum:** "Por que 5 minutos de timeout?"

**R:** O backend precisa:
1. Conectar ao PostgreSQL (10-30s)
2. Sincronizar schema (`ALTER TABLE` se necessário) (20-60s)
3. Adicionar valores ao ENUM (5-15s)
4. Executar seed se `SEED_MINIMAL=true` (10-30s)

Total: **45-135 segundos** em média  
Margem de segurança: **300 segundos** (5 min) garante sucesso

---

💡 **Layout responsivo:** Nenhuma mudança no frontend  
💡 **Profissional:** Health checks adequados para produção  
💡 **Brasil:** Timezone América/São_Paulo mantido
