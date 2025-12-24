# 🔧 Guia de Solução de Erros - API 404/400

## ❌ Problema
Erros no console do navegador:
```
Failed to load resource: the server responded with a status of 404 ()
api/agendamentos?dataInicio=...
api/prescricoes?status=ativa
api/usuarios
```

## 🎯 Causa Raiz
**Backend não está rodando** ou não está acessível na porta 3000.

---

## ✅ Solução Rápida

### 1️⃣ Execute o Diagnóstico
```batch
DIAGNOSTICO_SISTEMA.bat
```
Este script verifica:
- ✓ Node.js instalado
- ✓ Processos Node.js rodando
- ✓ Portas 3000 e 5173 abertas
- ✓ Backend respondendo

### 2️⃣ Inicie o Sistema Completo
```batch
INICIAR_SISTEMA_COMPLETO.bat
```
Aguarde ~10 segundos para o backend inicializar.

### 3️⃣ Verifique o Status
Abra no navegador:
- http://localhost:3000/health (deve retornar `{"status":"ok"}`)
- http://localhost:5173 (Frontend)

---

## 🔍 Verificações Manuais

### Backend está rodando?
```powershell
# PowerShell
Get-Process -Name node -ErrorAction SilentlyContinue

# CMD
tasklist | find "node.exe"
```

### Porta 3000 está em uso?
```powershell
# PowerShell
netstat -an | Select-String ":3000"

# CMD
netstat -an | find ":3000"
```

### Testar API manualmente
```powershell
# PowerShell
Invoke-WebRequest -Uri http://localhost:3000/health

# CMD/Browser
curl http://localhost:3000/health
```

---

## 🛠️ Soluções para Problemas Específicos

### Erro: "Backend Offline"
**Alerta vermelho no topo da página**

**Solução:**
1. Execute `INICIAR_SISTEMA_COMPLETO.bat`
2. Aguarde 10 segundos
3. Recarregue a página (F5)

### Erro: "Port 3000 is already in use"
**Outra instância do backend rodando**

**Solução:**
```batch
# Parar todos os processos Node.js
PARAR_SISTEMA.bat

# Ou manualmente
taskkill /F /IM node.exe

# Reiniciar
INICIAR_SISTEMA_COMPLETO.bat
```

### Erro: "Cannot find module"
**Dependências não instaladas**

**Solução:**
```bash
# Na raiz do projeto
npm install

# No frontend
cd client
npm install
cd ..

# Reiniciar
INICIAR_SISTEMA_COMPLETO.bat
```

### Erro: "ECONNREFUSED"
**Backend não está respondendo**

**Solução:**
1. Verifique se o MongoDB está rodando (memory server inicia automaticamente)
2. Confira o arquivo `.env` (ou use MongoDB Memory Server)
3. Veja os logs no terminal do backend para erros
4. Reinstale as dependências: `npm install`

---

## 📊 Monitoramento em Tempo Real

O sistema agora possui um **monitor de status do backend** que:
- ✅ Verifica a conexão a cada 10 segundos
- 🔴 Mostra alerta vermelho se o backend estiver offline
- 📝 Fornece instruções de como resolver
- 🔗 Link direto para testar a conexão

---

## 🚀 Comandos Úteis

### Iniciar apenas o Backend
```bash
npm run server
# ou
npm start
```

### Iniciar apenas o Frontend
```bash
cd client
npm run dev
```

### Iniciar tudo de uma vez
```bash
npm run dev:full
```

### Ver logs do MongoDB Memory Server
Os logs aparecem no terminal do backend quando ele inicia.

---

## 📝 Checklist de Problemas

- [ ] Node.js está instalado? (`node -v`)
- [ ] NPM está instalado? (`npm -v`)
- [ ] Dependências instaladas? (`npm install`)
- [ ] Backend rodando? (verifique terminal)
- [ ] Porta 3000 livre/em uso? (`netstat -an | find ":3000"`)
- [ ] Health check funcionando? (http://localhost:3000/health)
- [ ] CORS configurado? (já está no server.js)
- [ ] Token de autenticação válido? (faça login novamente)

---

## 🎓 Entendendo os Erros

### 404 - Not Found
- A rota não existe no backend
- O backend não está rodando
- URL está incorreta

### 400 - Bad Request
- Dados enviados estão incorretos
- Falta algum campo obrigatório
- Formato dos dados está errado

### 401 - Unauthorized
- Token inválido ou expirado
- Usuário não autenticado
- Faça login novamente

### 500 - Internal Server Error
- Erro no servidor
- Problema com MongoDB
- Verifique os logs do backend

### Network Error / ECONNREFUSED
- Backend não está rodando
- Firewall bloqueando
- Porta incorreta

---

## 📞 Debug Avançado

### Habilitar logs detalhados
No arquivo `server.js`, o Morgan já está ativo e mostra:
- Método HTTP
- URL
- Status Code
- Tempo de resposta

### Verificar MongoDB
```javascript
// No terminal do backend, você verá:
✅ MongoDB conectado com sucesso
// ou
✅ MongoDB Memory Server conectado com sucesso
⚠️  Dados serão perdidos ao reiniciar o servidor
```

### Testar rotas específicas
```bash
# GET /health
curl http://localhost:3000/health

# POST /auth/login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"superadmin@prescrimed.com","senha":"super123"}'
```

---

## 💡 Dicas de Prevenção

1. **Sempre inicie com** `INICIAR_SISTEMA_COMPLETO.bat`
2. **Não feche os terminais** do backend/frontend enquanto usar o sistema
3. **Execute** `PARAR_SISTEMA.bat` antes de reiniciar
4. **Use** `DIAGNOSTICO_SISTEMA.bat` para verificar o status
5. **Mantenha** os terminais visíveis para ver erros em tempo real

---

## 🎯 Resumo: 3 Passos para Resolver

```
1. PARAR_SISTEMA.bat        (limpa processos)
2. INICIAR_SISTEMA_COMPLETO.bat  (inicia tudo)
3. Aguarde 10 segundos e acesse http://localhost:5173
```

✅ Pronto! O sistema deve funcionar normalmente.
