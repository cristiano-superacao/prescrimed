# 🏥🐾 ANÁLISE: SISTEMA MULTI-NEGÓCIO

> **Data:** 04 de Dezembro de 2025  
> **Objetivo:** Avaliar viabilidade de adaptar o sistema para Casa de Repouso + Petshop  
> **Status:** ✅ **VIÁVEL COM ARQUITETURA BASEADA EM TIPO DE NEGÓCIO**

---

## 🎯 PROPOSTA

Transformar o sistema atual (focado em casas de repouso) em uma **plataforma multi-negócio** que suporte:

1. **Casa de Repouso** 🏥 (atual)
   - Pacientes/Residentes humanos
   - Prescrições médicas
   - Evolução médica
   - Censo M.P.

2. **Petshop** 🐾 (novo)
   - Pets (cães, gatos, etc.)
   - Prescrições veterinárias
   - Evolução veterinária
   - Censo de atendimentos

---

## 🔍 ANÁLISE DA ARQUITETURA ATUAL

### ✅ Pontos Favoráveis

#### 1. **Multi-tenant Já Implementado**
```javascript
// Todos os modelos já possuem empresaId
✅ Empresa
✅ Usuario
✅ Paciente  ← Pode ser adaptado para "Paciente/Pet"
✅ Prescricao
✅ Agendamento
✅ Transacao
✅ Medicamento
✅ Estoque
```

#### 2. **Estrutura Genérica de Campos**
O modelo `Paciente` possui campos que podem ser reutilizados:
```javascript
// Campos universais (humano ou pet)
- nome ✅
- dataNascimento ✅
- sexo ✅
- foto ✅
- peso ✅
- altura ✅
- alergias ✅
- medicamentosEmUso ✅
- observacoes ✅
- contatoEmergencia ✅ (tutor no caso de pet)

// Campos específicos de humano
- cpf ← Opcional
- convenio ← Opcional
- email ← Opcional
```

#### 3. **Módulos Reutilizáveis**
```javascript
✅ Dashboard       - Funciona para ambos
✅ Agenda          - Consultas médicas/veterinárias
✅ Prescrições     - Medicamentos humanos/veterinários
✅ Pacientes       - Residentes/Pets
✅ Estoque         - Medicamentos/Rações
✅ Evolução        - Prontuários
✅ Financeiro      - Transações
✅ Usuários        - Equipe médica/veterinária
✅ Configurações   - Universal
```

---

## 🏗️ ARQUITETURA PROPOSTA

### 1️⃣ Adicionar Campo `tipoNegocio` na Empresa

```javascript
// models/Empresa.js
const empresaSchema = new mongoose.Schema({
  // ... campos existentes
  tipoNegocio: {
    type: String,
    enum: ['casa_repouso', 'petshop'],
    default: 'casa_repouso',
    required: true
  },
  configuracoes: {
    // Configurações específicas por tipo de negócio
    terminologia: {
      paciente: String,      // "Residente" ou "Pet"
      prescricao: String,    // "Prescrição Médica" ou "Prescrição Veterinária"
      profissional: String,  // "Médico" ou "Veterinário"
    },
    camposObrigatorios: [String],
    camposVisiveis: [String],
    modulosAtivos: [String],
  }
});
```

### 2️⃣ Adaptar Modelo Paciente para Multi-propósito

```javascript
// models/Paciente.js (renomear para models/PacienteOuPet.js)
const pacienteOuPetSchema = new mongoose.Schema({
  empresaId: { type: ObjectId, ref: 'Empresa', required: true },
  
  // Campos universais
  nome: { type: String, required: true },
  dataNascimento: { type: Date, required: true },
  sexo: { type: String, enum: ['M', 'F', 'Outro'], required: true },
  foto: String,
  peso: Number,
  altura: Number,
  alergias: [String],
  condicoesMedicas: [String],
  medicamentosEmUso: [String],
  observacoes: String,
  status: { type: String, enum: ['ativo', 'inativo'], default: 'ativo' },
  
  // Campos específicos de humano (opcional)
  cpf: { type: String, sparse: true },
  email: String,
  convenio: {
    nome: String,
    numeroCarteirinha: String,
    validade: Date
  },
  
  // Campos específicos de pet (opcional)
  especie: { type: String, enum: ['cao', 'gato', 'passaro', 'outro'] },
  raca: String,
  pelagem: String,
  microchip: String,
  
  // Contato (tutor para pet, emergência para humano)
  contatoResponsavel: {
    nome: { type: String, required: true },
    telefone: { type: String, required: true },
    email: String,
    parentesco: String,  // ou "Tipo de relação"
    cpf: String,
    endereco: Map
  },
  
  // Campos comuns
  telefone: String,
  endereco: { type: Map, of: String },
  
  criadoPor: { type: ObjectId, ref: 'Usuario' }
}, { timestamps: true });
```

### 3️⃣ Sistema de Terminologia Dinâmica

```javascript
// constants/terminology.js
export const TERMINOLOGY = {
  casa_repouso: {
    paciente: 'Residente',
    pacientes: 'Residentes',
    prescricao: 'Prescrição Médica',
    prescricoes: 'Prescrições Médicas',
    profissional: 'Médico',
    profissionais: 'Médicos',
    consulta: 'Consulta Médica',
    prontuario: 'Prontuário',
    atendimento: 'Atendimento',
    censo: 'Censo M.P.',
  },
  petshop: {
    paciente: 'Pet',
    pacientes: 'Pets',
    prescricao: 'Prescrição Veterinária',
    prescricoes: 'Prescrições Veterinárias',
    profissional: 'Veterinário',
    profissionais: 'Veterinários',
    consulta: 'Consulta Veterinária',
    prontuario: 'Ficha Clínica',
    atendimento: 'Atendimento',
    censo: 'Censo de Atendimentos',
  }
};

// Hook customizado
export const useTerminology = () => {
  const { user } = useAuthStore();
  const empresa = user?.empresa || {};
  const tipoNegocio = empresa.tipoNegocio || 'casa_repouso';
  
  return TERMINOLOGY[tipoNegocio];
};
```

### 4️⃣ Componentes Adaptativos

```javascript
// Exemplo: client/src/pages/Pacientes.jsx
import { useTerminology } from '../hooks/useTerminology';

export default function Pacientes() {
  const terms = useTerminology();
  
  return (
    <div>
      <PageHeader
        title={terms.pacientes}  // "Residentes" ou "Pets"
        subtitle={`Gerencie ${terms.pacientes.toLowerCase()} cadastrados`}
      >
        <button className="btn btn-primary">
          <Plus size={18} /> Novo {terms.paciente}
        </button>
      </PageHeader>
      
      {/* Resto do componente */}
    </div>
  );
}
```

---

## 📋 MAPEAMENTO DE FUNCIONALIDADES

### Casa de Repouso 🏥

| Módulo | Descrição | Terminologia |
|--------|-----------|-------------|
| Dashboard | Visão geral da operação | "Residentes ativos", "Prescrições do dia" |
| Pacientes | Cadastro de residentes | "Residentes", "CPF", "Convênio" |
| Prescrições | Medicamentos prescritos | "Prescrição Médica", "Médico prescritor" |
| Agenda | Consultas e procedimentos | "Consulta Médica", "Exames" |
| Evolução | Prontuário eletrônico | "Evolução Médica", "Sinais vitais" |
| Censo M.P. | Controle de prescrições | "Censo de Medicamentos" |
| Estoque | Medicamentos e insumos | "Medicamentos", "Materiais" |
| Financeiro | Mensalidades e despesas | "Mensalidade", "Convênio" |

### Petshop 🐾

| Módulo | Descrição | Terminologia |
|--------|-----------|-------------|
| Dashboard | Visão geral da operação | "Pets ativos", "Consultas do dia" |
| Pacientes | Cadastro de pets | "Pets", "Espécie", "Raça", "Tutor" |
| Prescrições | Medicamentos prescritos | "Prescrição Veterinária", "Veterinário" |
| Agenda | Consultas e banhos/tosas | "Consulta Veterinária", "Banho & Tosa" |
| Evolução | Ficha clínica do pet | "Evolução Veterinária", "Vacinação" |
| Censo | Controle de atendimentos | "Censo de Atendimentos" |
| Estoque | Medicamentos e rações | "Medicamentos Vet", "Rações", "Acessórios" |
| Financeiro | Serviços e produtos | "Serviço", "Produto vendido" |

---

## 🎨 ADAPTAÇÕES DE UI/UX

### 1. **Cores e Branding por Tipo**

```javascript
// tailwind.config.js - Tema dinâmico
const THEMES = {
  casa_repouso: {
    primary: '#4F46E5',    // Indigo (atual)
    secondary: '#10B981',  // Emerald
    accent: '#8B5CF6',     // Purple
  },
  petshop: {
    primary: '#F59E0B',    // Amber/Orange
    secondary: '#10B981',  // Emerald
    accent: '#EC4899',     // Pink
  }
};
```

### 2. **Ícones Adaptativos**

```javascript
// Casa de Repouso
<Users size={24} />           // Residentes
<Activity size={24} />        // Sinais vitais
<FileText size={24} />        // Prescrições

// Petshop
<Dog size={24} />             // Pets
<Syringe size={24} />         // Vacinação
<FileHeart size={24} />       // Prescrições vet
```

### 3. **Formulários Contextuais**

```javascript
// PacienteModal.jsx - Campos dinâmicos
{tipoNegocio === 'casa_repouso' && (
  <>
    <input name="cpf" placeholder="CPF" />
    <input name="convenio" placeholder="Convênio" />
  </>
)}

{tipoNegocio === 'petshop' && (
  <>
    <select name="especie">
      <option>Cão</option>
      <option>Gato</option>
      <option>Pássaro</option>
    </select>
    <input name="raca" placeholder="Raça" />
    <input name="microchip" placeholder="Microchip" />
  </>
)}
```

---

## 🔧 IMPLEMENTAÇÃO SUGERIDA

### Fase 1: Infraestrutura (2-3 dias)

1. ✅ Adicionar `tipoNegocio` ao modelo Empresa
2. ✅ Criar sistema de terminologia (`constants/terminology.js`)
3. ✅ Criar hook `useTerminology()`
4. ✅ Adicionar campos específicos ao modelo Paciente (especie, raca, microchip)
5. ✅ Atualizar seed para incluir empresa tipo petshop

### Fase 2: Componentes (3-4 dias)

1. ✅ Adaptar `PacienteModal` para campos condicionais
2. ✅ Atualizar todos os componentes para usar `useTerminology()`
3. ✅ Criar componente `BusinessTypeSelector` no registro
4. ✅ Adaptar Dashboard com métricas contextuais
5. ✅ Atualizar Sidebar com ícones adaptativos

### Fase 3: Lógica de Negócio (2-3 dias)

1. ✅ Validações condicionais (CPF obrigatório só para casa de repouso)
2. ✅ Filtros e buscas adaptadas
3. ✅ Relatórios específicos por tipo
4. ✅ Exportação de dados contextuais

### Fase 4: Testes e Ajustes (2 dias)

1. ✅ Testar cadastro de empresas (ambos tipos)
2. ✅ Validar fluxos completos
3. ✅ Ajustar responsividade
4. ✅ Documentar diferenças

---

## 📊 COMPARATIVO DE MUDANÇAS

### Backend

| Arquivo | Mudanças | Impacto |
|---------|----------|---------|
| `models/Empresa.js` | + campo `tipoNegocio` | Baixo |
| `models/Paciente.js` | + campos pet (especie, raca, microchip) | Médio |
| `routes/auth.routes.js` | Validação do tipoNegocio no registro | Baixo |
| `utils/seed.js` | + dados exemplo petshop | Baixo |

**Total Backend:** ~150 linhas novas

### Frontend

| Arquivo | Mudanças | Impacto |
|---------|----------|---------|
| `constants/terminology.js` | Novo arquivo (terminologia) | Baixo |
| `hooks/useTerminology.js` | Novo hook | Baixo |
| `components/PacienteModal.jsx` | Campos condicionais | Médio |
| `pages/*.jsx` (12 páginas) | Usar `useTerminology()` | Alto |
| `components/Sidebar.jsx` | Ícones adaptativos | Baixo |
| `pages/Register.jsx` | Seletor de tipo de negócio | Médio |

**Total Frontend:** ~400 linhas modificadas + 200 linhas novas

---

## ✅ VANTAGENS DA ABORDAGEM

1. **Baixo Impacto**
   - 90% do código permanece igual
   - Multi-tenant já implementado
   - Estrutura de dados flexível

2. **Escalabilidade**
   - Fácil adicionar novos tipos (clínica, spa, etc.)
   - Terminologia extensível
   - Configurações por tipo

3. **Manutenibilidade**
   - Código compartilhado
   - Single source of truth
   - Testes unificados

4. **UX Consistente**
   - Mesma interface
   - Fluxos similares
   - Curva de aprendizado baixa

---

## ⚠️ DESAFIOS E CONSIDERAÇÕES

### 1. **Validações Condicionais**
```javascript
// Exemplo: CPF obrigatório só para casa de repouso
if (empresa.tipoNegocio === 'casa_repouso' && !cpf) {
  throw new Error('CPF é obrigatório para residentes');
}
```

### 2. **Relatórios Diferentes**
- Casa de repouso: Censo M.P., Evolução médica
- Petshop: Carteira de vacinação, Histórico de banhos

### 3. **Permissões Específicas**
- Médico vs Veterinário
- Enfermeiro vs Auxiliar Veterinário

### 4. **Compliance e Regulamentação**
- Casa de repouso: ANVISA, CRM
- Petshop: CFMV, CRMV

---

## 🎯 EXEMPLO DE IMPLEMENTAÇÃO

### Hook de Terminologia

```javascript
// hooks/useTerminology.js
import { useAuthStore } from '../store/authStore';
import { TERMINOLOGY } from '../constants/terminology';

export const useTerminology = () => {
  const { user } = useAuthStore();
  const tipoNegocio = user?.empresa?.tipoNegocio || 'casa_repouso';
  return TERMINOLOGY[tipoNegocio];
};
```

### Uso em Componente

```javascript
// pages/Pacientes.jsx
import { useTerminology } from '../hooks/useTerminology';

export default function Pacientes() {
  const terms = useTerminology();
  
  return (
    <PageHeader
      title={terms.pacientes}
      subtitle={`Cadastre e gerencie ${terms.pacientes.toLowerCase()}`}
    >
      <button className="btn btn-primary">
        <Plus size={18} /> 
        Novo {terms.paciente}
      </button>
    </PageHeader>
  );
}
```

### Formulário Adaptativo

```javascript
// components/PacienteModal.jsx
const { user } = useAuthStore();
const terms = useTerminology();
const tipoNegocio = user?.empresa?.tipoNegocio;

return (
  <form>
    {/* Campos universais */}
    <input name="nome" placeholder={`Nome do ${terms.paciente}`} required />
    <input type="date" name="dataNascimento" required />
    
    {/* Campos específicos de casa de repouso */}
    {tipoNegocio === 'casa_repouso' && (
      <>
        <input name="cpf" placeholder="CPF" />
        <input name="convenio" placeholder="Convênio" />
      </>
    )}
    
    {/* Campos específicos de petshop */}
    {tipoNegocio === 'petshop' && (
      <>
        <select name="especie" required>
          <option value="">Selecione a espécie</option>
          <option value="cao">Cão</option>
          <option value="gato">Gato</option>
          <option value="passaro">Pássaro</option>
          <option value="outro">Outro</option>
        </select>
        <input name="raca" placeholder="Raça" />
        <input name="microchip" placeholder="Número do Microchip" />
      </>
    )}
    
    {/* Contato responsável (tutor ou emergência) */}
    <fieldset>
      <legend>
        {tipoNegocio === 'petshop' ? 'Dados do Tutor' : 'Contato de Emergência'}
      </legend>
      <input name="contatoNome" placeholder="Nome" required />
      <input name="contatoTelefone" placeholder="Telefone" required />
    </fieldset>
  </form>
);
```

---

## 📈 ROADMAP DE IMPLEMENTAÇÃO

### Sprint 1 (1 semana)
- [ ] Adicionar `tipoNegocio` ao modelo Empresa
- [ ] Criar sistema de terminologia
- [ ] Implementar hook `useTerminology()`
- [ ] Adicionar campos pet ao modelo Paciente
- [ ] Atualizar tela de registro com seletor de tipo

### Sprint 2 (1 semana)
- [ ] Adaptar PacienteModal para campos condicionais
- [ ] Atualizar 12 páginas para usar terminologia dinâmica
- [ ] Adaptar Dashboard com métricas contextuais
- [ ] Criar seed com dados de exemplo petshop

### Sprint 3 (1 semana)
- [ ] Implementar validações condicionais
- [ ] Criar relatórios específicos por tipo
- [ ] Adaptar ícones e cores por tipo
- [ ] Testes de integração completos

### Sprint 4 (3 dias)
- [ ] Documentação completa
- [ ] Vídeos tutoriais
- [ ] Deploy em staging
- [ ] Testes com usuários reais

---

## 💰 ESTIMATIVA DE ESFORÇO

| Fase | Tempo | Complexidade |
|------|-------|-------------|
| Infraestrutura | 2-3 dias | Baixa |
| Componentes | 3-4 dias | Média |
| Lógica de Negócio | 2-3 dias | Média |
| Testes e Ajustes | 2 dias | Baixa |
| **Total** | **9-12 dias** | **Média** |

---

## 🎯 CONCLUSÃO

### ✅ VIABILIDADE: **ALTA**

A arquitetura atual do sistema Prescrimed **é altamente favorável** para suportar múltiplos tipos de negócio:

#### Pontos Fortes
✅ Multi-tenant já implementado  
✅ Estrutura de dados flexível  
✅ Componentes modulares e reutilizáveis  
✅ Layout responsivo mantido  
✅ Baixo impacto no código existente (~600 linhas novas/modificadas)

#### Benefícios
✅ **Escalabilidade:** Fácil adicionar novos tipos de negócio no futuro  
✅ **Manutenibilidade:** Código compartilhado entre tipos  
✅ **UX Consistente:** Mesma experiência, terminologia adaptada  
✅ **ROI:** Duplica mercado endereçável com esforço moderado

#### Recomendação
**IMPLEMENTAR** a solução multi-negócio seguindo a arquitetura proposta, começando com casa de repouso e petshop, com possibilidade de expansão futura para outros segmentos (clínicas, spas, etc.).

---

**Tempo estimado de implementação:** 9-12 dias úteis  
**Risco:** Baixo  
**Retorno:** Alto

🚀 **Sistema pronto para evolução multi-negócio mantendo qualidade e profissionalismo!**
