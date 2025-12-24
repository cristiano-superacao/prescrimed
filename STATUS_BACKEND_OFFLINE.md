# 🚨 STATUS DO SISTEMA PRESCRIMED

## ⚠️ PROBLEMA IDENTIFICADO

O **backend do Render** está OFFLINE! 

### 🔗 Backend URL
- **URL:** https://prescrimed-backend.onrender.com
- **Status:** ❌ OFFLINE (404 Not Found)
- **Causa:** O serviço gratuito do Render hiberna após inatividade

### 🌐 Frontend Netlify
- **URL:** https://prescrimed.netlify.app
- **Status:** ✅ ONLINE
- **Problema:** Não consegue conectar ao backend

---

## ✅ SOLUÇÃO RÁPIDA

### Execute o sistema LOCALMENTE:

1. **Abra o terminal no diretório do projeto**

2. **Execute o script de inicialização:**
   ```bash
   INICIAR_SISTEMA_COMPLETO.bat
   ```

3. **Acesse:**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:3000

4. **Login:**
   - Email: `superadmin@prescrimed.com`
   - Senha: `super123`

---

## 🔧 PARA REATIVAR O RENDER

### Opção 1: Aguardar Ativação
O Render pode levar 1-2 minutos para sair da hibernação na primeira requisição.

### Opção 2: Deploy Manual
```bash
# No diretório do projeto
cd c:\Users\Superação\prescrimed

# Fazer commit e push
git add .
git commit -m "Update: Reativar backend"
git push

# O Render fará deploy automático
```

### Opção 3: Usar Plano Pago
O plano pago do Render (~$7/mês) mantém o serviço sempre ativo.

---

## 📋 SCRIPTS DISPONÍVEIS

### Windows (.bat)
- **INICIAR_SISTEMA_COMPLETO.bat** - Inicia tudo (backend + frontend)
- **PARAR_SISTEMA.bat** - Para todos os processos

### PowerShell (.ps1)
```powershell
# Iniciar
.\scripts\iniciar.ps1

# Parar
.\scripts\parar.ps1
```

### NPM
```bash
# Tudo junto
npm run dev

# Separado
npm run server  # Backend (Terminal 1)
cd client && npm run dev  # Frontend (Terminal 2)
```

---

## 🌐 URLs DO PROJETO

| Serviço | URL | Status |
|---------|-----|--------|
| **Frontend Prod** | https://prescrimed.netlify.app | ✅ Online |
| **Backend Prod** | https://prescrimed-backend.onrender.com | ❌ Offline |
| **Frontend Local** | http://localhost:5173 | ⏸️ Parado |
| **Backend Local** | http://localhost:3000 | ⏸️ Parado |
| **Netlify Dashboard** | https://app.netlify.com/projects/prescrimed | ✅ |

---

## 🎯 RECOMENDAÇÃO

**Use o sistema LOCALMENTE** até que o backend do Render seja reativado ou migrado para outra solução.

Execute: `INICIAR_SISTEMA_COMPLETO.bat`

---

**Última verificação:** 04/12/2024
**Deploy ID:** 693225e2f37c45736244d523
