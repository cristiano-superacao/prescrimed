# ⚙️ Configuração para Região do Brasil

Este documento descreve as configurações regionais do sistema Prescrimed para o Brasil.

## 🌍 Timezone

O sistema está configurado para o **Horário de Brasília (America/Sao_Paulo)**.

### Backend
- **Timezone do servidor**: `America/Sao_Paulo` (UTC-3)
- **Armazenamento no banco**: UTC (padrão internacional)
- **Conversão**: Automática entre UTC ↔ America/Sao_Paulo

### Configuração

No arquivo `.env`:
```env
TZ=America/Sao_Paulo
```

No código:
```javascript
// server.js
process.env.TZ = 'America/Sao_Paulo';

// config/database.js
process.env.TZ = 'America/Sao_Paulo';
```

## 📅 Formato de Data e Hora

### Frontend (React)
Todos os componentes usam formatação brasileira:

```javascript
// Data: dd/mm/aaaa
date.toLocaleDateString('pt-BR')

// Hora: HH:mm
date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

// Data e hora completa
date.toLocaleString('pt-BR')
```

### Backend (Node.js)
Utilitários disponíveis em `utils/date.js`:

```javascript
import { 
  getBrazilNow,           // Data/hora atual em horário de Brasília
  toBrazilTime,           // Converte data para horário de Brasília
  formatBrazilDate,       // Formata data: dd/mm/aaaa
  formatBrazilDateTime,   // Formata data e hora: dd/mm/aaaa HH:mm:ss
  calculateAge,           // Calcula idade usando horário de Brasília
  BRAZIL_CONFIG           // Constantes de configuração
} from './utils/date.js';

// Exemplos
const agora = getBrazilNow();
const dataFormatada = formatBrazilDate(new Date());
const dataHoraFormatada = formatBrazilDateTime(new Date());
```

## 💰 Moeda

### Configuração
- **Moeda**: Real Brasileiro (BRL)
- **Símbolo**: R$
- **Locale**: pt-BR

### Uso
```javascript
// client/src/utils/currency.js
export const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

// Exemplo: R$ 1.234,56
```

## 🗂️ Padrões Brasileiros

### Números
```javascript
// Separador decimal: vírgula (,)
// Separador de milhar: ponto (.)
// Exemplo: 1.234,56
new Intl.NumberFormat('pt-BR').format(1234.56)
```

### CPF/CNPJ
- **CPF**: XXX.XXX.XXX-XX (11 dígitos)
- **CNPJ**: XX.XXX.XXX/XXXX-XX (14 dígitos)

### CEP
- **Formato**: XXXXX-XXX (8 dígitos)

### Telefone
- **Fixo**: (XX) XXXX-XXXX
- **Celular**: (XX) 9XXXX-XXXX

## 🛠️ Arquivos Configurados

### Backend
- ✅ `server.js` - Define TZ=America/Sao_Paulo
- ✅ `config/database.js` - Define TZ e timezone do Sequelize
- ✅ `utils/date.js` - Funções utilitárias com timezone brasileiro
- ✅ `.env.example` - Inclui TZ=America/Sao_Paulo

### Frontend
- ✅ `client/src/utils/currency.js` - Formatação de moeda em BRL
- ✅ Todos os componentes em `client/src/pages/*.jsx` - Usam 'pt-BR'
- ✅ `client/src/components/*.jsx` - Formatação pt-BR

## 📊 Banco de Dados

### Timestamps
Todos os modelos Sequelize têm `timestamps: true`, criando automaticamente:
- `createdAt` - Data/hora de criação
- `updatedAt` - Data/hora de última atualização

**Armazenamento**: UTC (Universal Time Coordinated)  
**Exibição**: America/Sao_Paulo (conversão automática)

### Configuração do Sequelize
```javascript
// config/database.js
sequelize = new Sequelize(DATABASE_URL, {
  dialect: 'postgres',
  timezone: '+00:00', // Armazena em UTC
  // ...
});
```

## 🚀 Deploy no Railway

O Railway detecta automaticamente o timezone através da variável `TZ` no `.env`:

```bash
# No Railway, adicione a variável de ambiente:
TZ=America/Sao_Paulo
```

A variável `PORT` é definida automaticamente pela plataforma (não configure manualmente).

## ✅ Checklist de Configuração

- [x] Timezone do servidor: America/Sao_Paulo
- [x] Timezone do banco de dados: UTC (armazenamento)
- [x] Formato de data frontend: pt-BR (dd/mm/aaaa)
- [x] Formato de hora frontend: pt-BR (HH:mm)
- [x] Moeda: BRL (R$)
- [x] Locale: pt-BR
- [x] Utilitários de data com timezone brasileiro
- [x] Documentação atualizada

## 📝 Observações

1. **Armazenamento em UTC**: O banco armazena datas em UTC para garantir consistência internacional
2. **Conversão automática**: O backend converte automaticamente UTC ↔ America/Sao_Paulo
3. **Frontend pt-BR**: Todos os componentes React já usam formatação brasileira
4. **Moeda BRL**: Sistema configurado para Real Brasileiro

## 🔗 Referências

- [Lista de Timezones IANA](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)
- [Intl.DateTimeFormat pt-BR](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat)
- [Intl.NumberFormat pt-BR](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat)
