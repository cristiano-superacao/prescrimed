# 👥 CREDENCIAIS DE ACESSO - PRESCRIMED

## 🔐 Usuários por Modalidade

---

### 🔴 SUPER ADMINISTRADOR
**Email:** superadmin@prescrimed.com  
**Senha:** super123  
**Permissões (12):** Acesso total ao sistema
- ✅ Dashboard, Agenda, Cronograma, Prescrições
- ✅ Censo M.P., Pacientes, Estoque, Evolução
- ✅ Financeiro, Usuários, Empresas, Configurações

---

### 👨‍⚕️ MÉDICO
**Email:** medico@prescrimed.com  
**Senha:** medico123  
**CRM:** 123456-SP  
**Permissões (7):** Foco clínico
- ✅ Dashboard, Agenda, Cronograma
- ✅ Prescrições (criar/editar)
- ✅ Pacientes, Evolução, Relatórios

---

### 👩‍⚕️ ENFERMEIRO(A)
**Email:** enfermeiro@prescrimed.com  
**Senha:** enfermeiro123  
**COREN:** 987654-SP  
**Permissões (8):** Gestão de enfermagem
- ✅ Dashboard, Agenda, Cronograma
- ✅ Prescrições (visualizar)
- ✅ Pacientes, Evolução, Estoque, Relatórios

---

### 🏥 TÉCNICO DE ENFERMAGEM
**Email:** tecnico@prescrimed.com  
**Senha:** tecnico123  
**COREN:** 456789-SP  
**Permissões (7):** Suporte técnico
- ✅ Dashboard, Agenda, Cronograma
- ✅ Prescrições (visualizar)
- ✅ Pacientes, Estoque, Relatórios

---

### 🥗 NUTRICIONISTA
**Email:** nutricionista@prescrimed.com  
**Senha:** nutricionista123  
**CRN:** 12345-SP  
**Permissões (8):** Gestão nutricional
- ✅ Dashboard, Agenda, Cronograma
- ✅ Prescrições (dietas)
- ✅ Pacientes, Evolução, Estoque, Relatórios

---

### 🤝 ASSISTENTE SOCIAL
**Email:** assistente.social@prescrimed.com  
**Senha:** social123  
**CRESS:** 54321-SP  
**Permissões (5):** Gestão social
- ✅ Dashboard, Agenda
- ✅ Pacientes, Evolução, Relatórios

---

### 🔷 ADMINISTRADOR
**Email:** admin@prescrimed.com  
**Senha:** admin123  
**Permissões (8):** Gestão administrativa
- ✅ Dashboard, Agenda, Cronograma, Pacientes
- ✅ Financeiro, Usuários, Configurações, Relatórios

---

### 📋 AUXILIAR ADMINISTRATIVO
**Email:** auxiliar@prescrimed.com  
**Senha:** auxiliar123  
**Permissões (4):** Apoio operacional
- ✅ Dashboard, Agenda
- ✅ Pacientes, Relatórios

---

## 📊 Resumo de Acessos por Módulo

| Módulo | Usuários com Acesso |
|--------|---------------------|
| 📊 Dashboard | 8 |
| 📅 Agenda | 8 |
| 🗓️ Cronograma | 6 |
| 💊 Prescrições | 5 |
| 🏥 Pacientes | 8 |
| 📦 Estoque | 4 |
| 📈 Evolução | 5 |
| 💰 Financeiro | 2 |
| 👥 Usuários | 2 |
| 🏢 Empresas | 1 |
| ⚙️ Configurações | 2 |
| 📑 Relatórios | 8 |

---

## 🚀 Acesso ao Sistema

**URL:** http://localhost:5174

### Como testar cada perfil:
1. Acesse o sistema
2. Faça login com as credenciais acima
3. Observe as permissões específicas no sidebar
4. Cada usuário verá apenas os módulos permitidos

---

## ✅ Características do Sistema

- ✨ **Layout Responsivo**: Mobile, Tablet e Desktop
- 🎨 **Design Profissional**: TailwindCSS com componentes modernos
- 🔐 **Controle de Acesso**: Baseado em roles e permissões
- 📱 **Multi-plataforma**: Funciona em todos os dispositivos
- ⚡ **Performance**: React + Vite para carregamento rápido
- 🔄 **Tempo Real**: Atualizações dinâmicas e responsivas

---

## 🔧 Comandos Úteis

```bash
# Iniciar sistema completo
iniciar-completo.bat

# Criar novos usuários
node create-all-users.js

# Resetar super admin
node reset-superadmin.js
```

---

**Desenvolvido com ❤️ para Prescrimed**
