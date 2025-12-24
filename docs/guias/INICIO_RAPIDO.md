# ⚡ REFERÊNCIA RÁPIDA - PRESCRIMED

## 🚀 INICIAR O SISTEMA

### Método 1: Script Automático (Recomendado)
```batch
.\iniciar-tudo.bat
```
Este script:
- ✅ Limpa processos anteriores
- ✅ Inicia MongoDB Memory Server
- ✅ Inicia Backend API (porta 3000)
- ✅ Inicia Frontend React (porta 5173)
- ✅ Abre o navegador automaticamente

### Método 2: Manual (3 terminais)
```powershell
# Terminal 1 - MongoDB
node start-mongo-memory.js

# Terminal 2 - Backend
npm run dev

# Terminal 3 - Frontend
cd client
npm run dev
```

---

## 🔐 LOGIN

```
📧 Email: superadmin@prescrimed.com
🔑 Senha: admin123456
```

---

## 🌐 URLs

| Servidor | URL |
|----------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:3000 |
| Health Check | http://localhost:3000/health |

---

## 🛑 PARAR O SISTEMA

### Fechar Janelas CMD
Simplesmente feche as 3 janelas CMD abertas:
- MongoDB Memory
- Backend API
- Frontend React

### Ou via PowerShell
```powershell
Get-Process node | Stop-Process -Force
```

---

## 📦 MÓDULOS DISPONÍVEIS

1. 📊 **Dashboard** - Estatísticas e visão geral
2. 📅 **Agenda** - Compromissos e consultas
3. 🗓️ **Cronograma** - Planejamento de atividades
4. 📝 **Prescrições** - Gestão de prescrições médicas
5. 📋 **Censo M.P.** - Prescrições padronizadas
6. 👥 **Pacientes** - Cadastro de residentes
7. 📦 **Estoque** - Medicamentos e Alimentos
8. 📈 **Evolução** - Acompanhamento clínico
9. 💰 **Financeiro** - Receitas e despesas
10. 👨‍⚕️ **Usuários** - Gestão de equipe
11. 🏢 **Empresas** - Administração multi-tenant
12. ⚙️ **Configurações** - Personalização

---

## 🐛 SOLUÇÃO DE PROBLEMAS

### Erro: ERR_CONNECTION_REFUSED
**Causa**: Backend não está rodando
**Solução**: 
```powershell
# Parar tudo
Get-Process node | Stop-Process -Force

# Reiniciar
.\iniciar-tudo.bat
```

### Erro: Porta já em uso
**Solução**:
```powershell
# Liberar porta 3000
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process -Force

# Liberar porta 5173
Get-Process -Id (Get-NetTCPConnection -LocalPort 5173).OwningProcess | Stop-Process -Force
```

### Tela branca no frontend
1. Abra o DevTools (F12)
2. Verifique erros no Console
3. Verifique se Backend está rodando
4. Force refresh: `Ctrl + Shift + R`

---

## ✅ CHECKLIST DE FUNCIONAMENTO

- [ ] 3 janelas CMD abertas (MongoDB, Backend, Frontend)
- [ ] Backend responde em http://localhost:3000/health
- [ ] Frontend abre em http://localhost:5173
- [ ] Login funciona com as credenciais
- [ ] Dashboard carrega estatísticas
- [ ] Não há erros no Console (F12)

---

## 📚 DOCUMENTAÇÃO COMPLETA

- **ANALISE_SISTEMA.md** - Análise técnica completa
- **TESTE_LOCAL.md** - Guia detalhado de testes
- **README.md** - Visão geral do projeto

---

## 💡 DICAS

- As janelas CMD mostram logs em tempo real
- Use `rs` no terminal do Backend para reiniciar (nodemon)
- Pressione `F12` no navegador para DevTools
- Dados são salvos em memória (perdidos ao parar MongoDB)

---

**Desenvolvido com 💚 - Sistema Prescrimed**
