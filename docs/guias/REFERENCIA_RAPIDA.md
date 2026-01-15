# 🎯 Referência Rápida - PrescrIMed

## 📁 Estrutura de Arquivos de Inicialização

```
prescrimed-system/
│
├── 🚀 SCRIPTS DE INICIALIZAÇÃO
│   ├── iniciar.ps1          ⭐ PowerShell (RECOMENDADO)
│   ├── iniciar.bat          📝 Batch/CMD (Alternativo)
│   ├── parar.ps1            🛑 Parar sistema (PowerShell)
│   └── parar.bat            🛑 Parar sistema (Batch)
│
├── 📚 DOCUMENTAÇÃO
│   ├── GUIA_RAPIDO.md       ⚡ Este arquivo - Início rápido
│   ├── README.md            📖 Documentação principal
│   ├── COMO_INICIAR.md      🔧 Guia detalhado de inicialização
│   ├── MONGODB_ATLAS_GUIA.md 🌐 Configurar banco na nuvem
│   ├── DEPLOY_FACIL.md      🚀 Deploy simplificado
│   └── GUIA_DEPLOY_COMPLETO.md 📦 Deploy detalhado
│
└── ⚙️ CONFIGURAÇÃO
    ├── .env                 🔐 Variáveis de ambiente
    ├── package.json         📦 Dependências backend
    └── client/package.json  📦 Dependências frontend
```

---

## ⚡ Comandos Essenciais

### Iniciar Sistema

```powershell
# PowerShell (Recomendado)
.\iniciar.ps1

# CMD/Batch
iniciar.bat
```

### Parar Sistema

```powershell
# PowerShell
.\parar.ps1

# CMD/Batch
parar.bat

# Manual
Ctrl+C em cada terminal OU fechar as janelas
```

### Verificar Status

```powershell
# Ver processos Node.js
Get-Process -Name node

# Ver portas em uso
netstat -ano | findstr :5000
netstat -ano | findstr :5173
```

---

## 🌐 URLs Importantes

| URL | Descrição |
|-----|-----------|
| http://localhost:5173 | **Frontend** - Interface do sistema |
| http://localhost:5000 | **Backend** - API REST |
| http://localhost:5000/api-docs | Documentação Swagger |
| http://localhost:5000/health | Health check |

---

## 🚨 Solução Rápida de Problemas

### ❌ Erro: "scripts is disabled"
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### ❌ Erro: "Port already in use"
```powershell
.\parar.ps1
.\iniciar.ps1
```

### ❌ Erro: "ENOENT: no such file"
```powershell
cd "c:\Users\Superação\Desktop\Sistemas\prescrimed-system"
.\iniciar.ps1
```

### ❌ Erro: "npm install failed"
```powershell
npm cache clean --force
rm -r node_modules
npm install
```

---

## 📋 Checklist de Inicialização

- [ ] Navegue até a pasta do projeto
- [ ] Execute `.\iniciar.ps1` (ou `iniciar.bat`)
- [ ] Aguarde abrir 3 janelas de terminal
- [ ] Verifique se o navegador abriu automaticamente
- [ ] Acesse http://localhost:5173
- [ ] Clique em "Registrar" para criar primeira conta
- [ ] ✅ Sistema pronto para usar!

---

## 🎓 Primeiro Acesso

1. **URL:** http://localhost:5173
2. **Ação:** Clique em "Registrar"
3. **Preencha:**
   - Nome completo
   - Email
   - Senha (mínimo 6 caracteres)
   - Nome da empresa
   - CNPJ (opcional)
4. **Resultado:** Você é o ADMINISTRADOR!

---

## 🔄 Fluxo de Trabalho Típico

```
INICIAR
   ↓
.\iniciar.ps1
   ↓
Aguardar 3 terminais abrirem
   ↓
Navegador abre automaticamente
   ↓
TRABALHAR NO SISTEMA
   ↓
PARAR (quando terminar)
   ↓
.\parar.ps1
```

---

## 🛠️ Comandos Avançados

### Backend

```powershell
# Modo desenvolvimento (auto-reload)
npm run dev

# Modo produção
npm start

# Criar usuário superadmin
node create-superadmin.js

# Testar login
node test-login.js
```

### Frontend

```powershell
cd client

# Modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview
```

### Deploy

```powershell
# Deploy completo (interativo)
node deploy.js

# Build do frontend
npm run build
```

---

## 📊 Monitoramento

### Logs em Tempo Real

- **MongoDB:** Janela "📦 MongoDB Memory Server"
- **Backend:** Janela "🔧 PrescrIMed Backend"
- **Frontend:** Janela "🌐 PrescrIMed Frontend"

### Tipos de Log

```
✅ Sucesso
❌ Erro
⚠️ Aviso
ℹ️ Informação
🔍 Debug
```

---

## 🔐 Segurança

### Ambiente Local (Desenvolvimento)
- MongoDB em memória
- JWT_SECRET padrão
- CORS liberado para localhost

### Ambiente Produção
- MongoDB Atlas (nuvem)
- JWT_SECRET único e forte
- CORS configurado apenas para domínios autorizados

---

## 💾 Dados

### Modo Desenvolvimento (Padrão)
- **Banco:** MongoDB em memória
- **Persistência:** ❌ Dados perdidos ao reiniciar
- **Uso:** Testes e desenvolvimento

### Modo Produção
- **Banco:** MongoDB Atlas (nuvem)
- **Persistência:** ✅ Dados permanentes
- **Configuração:** Veja `MONGODB_ATLAS_GUIA.md`

---

## 📞 Suporte Rápido

| Problema | Solução | Documento |
|----------|---------|-----------|
| Como iniciar? | `.\iniciar.ps1` | GUIA_RAPIDO.md |
| Erro de porta | `.\parar.ps1` | GUIA_RAPIDO.md |
| Configurar nuvem | Veja o guia | MONGODB_ATLAS_GUIA.md |
| Deploy sistema | Execute script | DEPLOY_FACIL.md |
| Erro script PowerShell | Mudar política | GUIA_RAPIDO.md |

---

## 🎯 Objetivos Alcançados

✅ Inicialização automática em 1 comando
✅ Verificação de dependências
✅ Feedback visual colorido
✅ Abertura automática do navegador
✅ 3 métodos de inicialização
✅ Scripts de parada dedicados
✅ Documentação completa
✅ Solução de problemas comuns
✅ Layout responsivo e profissional
✅ Sistema organizado e robusto

---

## 📝 Notas Importantes

1. **Sempre execute scripts da pasta do projeto**
2. **Aguarde todos os serviços iniciarem**
3. **Não feche os 3 terminais durante o uso**
4. **Use `parar.ps1` antes de reiniciar**
5. **Dados em memória são temporários**

---

**Última atualização:** 03/12/2025
**Versão:** 1.0.0
**Status:** ✅ Produção
