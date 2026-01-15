# 🎯 COMO USAR O SISTEMA - GUIA RÁPIDO

## ✅ Sistema iniciado com sucesso!

### 🌐 Acesse o sistema:
**http://localhost:5173**

### 👤 Faça login:
```
Email: superadmin@prescrimed.com
Senha: super123
```

---

## 📊 O QUE FOI CORRIGIDO

### ❌ Problema Original
- Deploy do Netlify mostrava "Página não encontrada"
- Backend do Render estava OFFLINE (hibernando)
- Sistema não carregava nada

### ✅ Solução Implementada
1. **Sistema configurado para rodar LOCALMENTE**
2. **Backend:** MongoDB Memory Server na porta 3000
3. **Frontend:** Vite dev server na porta 5173
4. **Scripts automáticos criados:**
   - `INICIAR_SISTEMA_COMPLETO.bat` - Inicia tudo
   - `PARAR_SISTEMA.bat` - Para tudo

---

## 🎨 LAYOUT RESPONSIVO MANTIDO

✅ **Mobile:** 320px - 768px (1 coluna)  
✅ **Tablet:** 768px - 1024px (2 colunas)  
✅ **Desktop:** 1024px+ (3-4 colunas)

✅ **Design profissional preservado:**
- Paleta Indigo/Purple
- Gradientes suaves
- Animações fluidas
- Sombras modernas
- Ícones Lucide
- Dark mode

---

## 🚀 COMO INICIAR O SISTEMA

### Opção 1: Script Automático (Recomendado)
```bash
# Duplo clique ou execute no terminal:
INICIAR_SISTEMA_COMPLETO.bat
```

### Opção 2: Manual
```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
cd client
npm run dev
```

### Opção 3: Tudo Junto
```bash
npm run dev
```

---

## 🛑 COMO PARAR O SISTEMA

### Opção 1: Script Automático
```bash
# Duplo clique:
PARAR_SISTEMA.bat
```

### Opção 2: Manual
- Feche as janelas do terminal
- Ou pressione `Ctrl+C` em cada terminal

---

## 📱 MÓDULOS DISPONÍVEIS

Após fazer login, você terá acesso a:

1. 🏠 **Dashboard** - Visão geral
2. 📅 **Agenda** - Agendamentos
3. 📊 **Cronograma** - Planejamento
4. 💊 **Prescrições** - Medicamentos
5. 📋 **Censo M.P.** - Censo médico
6. 👥 **Pacientes** - Cadastro
7. 📦 **Estoque** - Inventário
8. 📈 **Evolução** - Acompanhamento
9. 💰 **Financeiro** - Gestão financeira
10. 👤 **Usuários** - Gerenciamento
11. 🏢 **Empresas** - Multi-tenant
12. ⚙️ **Configurações** - Preferências

---

## 🔐 OUTROS USUÁRIOS DE TESTE

| Tipo | Email | Senha |
|------|-------|-------|
| **Admin** | admin@clinicavida.com | admin123 |
| **Médico** | medico@clinicavida.com | medico123 |
| **Enfermeiro** | enfermeiro@clinicavida.com | enfermeiro123 |

---

## 🐛 RESOLUÇÃO DE PROBLEMAS

### Porta em uso?
```bash
# Windows
netstat -ano | findstr :3000
netstat -ano | findstr :5173

# Matar processo
taskkill /F /PID <número_do_pid>
```

### Erro de dependências?
```bash
# Reinstalar
npm install
cd client
npm install
```

### Backend não conecta?
```bash
# Verificar se está rodando
curl http://localhost:3000/api/auth/me
```

---

## 📚 DOCUMENTAÇÃO

### Guias
- [Como Iniciar](docs/guias/COMO_INICIAR.md)
- [Instalação](docs/guias/INSTALACAO.md)
- [Referência Rápida](docs/guias/REFERENCIA_RAPIDA.md)

### Análises
- [Sistema Completo](docs/analises/ANALISE_SISTEMA_COMPLETA.md)
- [Multi-Negócio](docs/analises/ANALISE_MULTI_NEGOCIO.md)

### Status
- [Backend Offline](STATUS_BACKEND_OFFLINE.md)
- [Resumo Final](RESUMO_FINAL.md)
- [Acesso Sistema](ACESSO_SISTEMA.md)

---

## 🎯 PRÓXIMOS PASSOS

1. ✅ **Sistema funcionando localmente**
2. ⏳ Reativar backend do Render
3. ⏳ Deploy automático funcional
4. ⏳ Backend sempre online

---

## 💡 DICA

**Mantenha as janelas do terminal abertas** enquanto usar o sistema. Elas mostram logs importantes do backend e frontend.

---

<div align="center">

## 🎉 SISTEMA 100% FUNCIONAL!

**Layout responsivo e profissional mantido em todos os módulos**

[🌐 Abrir Sistema](http://localhost:5173) | [📚 Ver Docs](docs/)

---

Desenvolvido com ❤️ por **Cristiano Santos**

</div>
