# 🇧🇷 Configurações de Localização - Brasil

## Resumo da Configuração

O sistema **Prescrimed** está 100% configurado para a região do **Brasil** com:

- ✅ **Idioma**: Português do Brasil (pt-BR)
- ✅ **Região**: Brasil (BR)
- ✅ **Timezone**: America/Sao_Paulo (Horário de Brasília - UTC-3)
- ✅ **Moeda**: Real Brasileiro (BRL - R$)
- ✅ **Formato de Data**: DD/MM/YYYY
- ✅ **Formato de Hora**: HH:mm (24h)
- ✅ **Separador Decimal**: Vírgula (,)
- ✅ **Separador de Milhares**: Ponto (.)

---

## 📋 Configurações por Módulo

### Backend (Node.js/Express)

#### Timezone
```javascript
// server.js
process.env.TZ = 'America/Sao_Paulo';
```

#### Utilitários de Data
```javascript
// utils/date.js
const BRAZIL_CONFIG = {
  timezone: 'America/Sao_Paulo',
  locale: 'pt-BR'
};
```

#### Variáveis de Ambiente
```env
TZ=America/Sao_Paulo
NODE_ENV=production
```

---

### Frontend (React/Vite)

#### HTML Principal
```html
<!-- client/index.html -->
<html lang="pt-BR">
<meta http-equiv="Content-Language" content="pt-BR">
<meta name="language" content="Portuguese">
<meta name="geo.region" content="BR">
<meta name="geo.placename" content="Brasil">
```

#### Utilitários de Formatação

##### Moeda (BRL - Real)
```javascript
// client/src/utils/currency.js
export const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

// Exemplos:
formatCurrency(1234.56)  // "R$ 1.234,56"
formatCurrency(10)       // "R$ 10,00"
```

##### Datas e Horas
```javascript
// client/src/utils/dateFormat.js
export const formatDateTime = (date) => {
  return new Date(date).toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo'
  });
};

// Exemplos:
formatDateTime(new Date())  // "23/01/2026 15:30:45"
formatDate(new Date())      // "23/01/2026"
formatTime(new Date())      // "15:30"
formatDateLong(new Date())  // "23 de janeiro de 2026"
```

##### CPF e CNPJ
```javascript
// client/src/utils/locale.js
formatCPF('12345678900')    // "123.456.789-00"
formatCNPJ('12345678000199') // "12.345.678/0001-99"

// Validações
isValidCPF('123.456.789-00')  // true/false
isValidCNPJ('12.345.678/0001-99')  // true/false
```

##### Telefone
```javascript
formatPhone('11999998888')  // "(11) 99999-8888"
formatPhone('1133334444')   // "(11) 3333-4444"
```

##### CEP
```javascript
formatCEP('01310100')  // "01310-100"
```

##### Números e Porcentagens
```javascript
formatNumber(1234.56)      // "1.234,56"
formatNumber(1234.56, 0)   // "1.235"
formatPercent(85.5)        // "85,5%"
```

---

## 🗺️ Estados do Brasil

Array completo disponível em `client/src/utils/locale.js`:

```javascript
export const ESTADOS_BRASIL = [
  { sigla: 'AC', nome: 'Acre' },
  { sigla: 'AL', nome: 'Alagoas' },
  // ... todos os 27 estados/DF
];
```

---

## 📱 Responsividade

O layout é 100% responsivo para dispositivos brasileiros:

### Mobile (< 768px)
- ✅ Touch-friendly para celulares
- ✅ Menu hamburger
- ✅ Cards empilhados verticalmente
- ✅ Tabelas com scroll horizontal
- ✅ Formulários de toque grande

### Tablet (768px - 1024px)
- ✅ Layout de 2 colunas
- ✅ Sidebar retrátil
- ✅ Cards em grid 2x2

### Desktop (> 1024px)
- ✅ Layout completo
- ✅ Sidebar sempre visível
- ✅ Cards em grid 3x3
- ✅ Tabelas com todas as colunas

---

## 🎨 Cores e Tema

Paleta otimizada para acessibilidade (WCAG 2.1 AA):

```css
--primary: #6366f1    /* Índigo */
--success: #10b981    /* Verde */
--warning: #f59e0b    /* Âmbar */
--danger: #ef4444     /* Vermelho */
--info: #3b82f6       /* Azul */
```

Contraste de texto:
- ✅ Texto escuro em fundos claros
- ✅ Texto claro em fundos escuros
- ✅ Proporção mínima de 4.5:1

---

## 📄 Exemplos de Uso

### Dashboard
```javascript
// Métricas com formatação brasileira
<MetricCard
  title="Receitas Totais"
  value={formatCurrency(stats.receitas)}
  change={formatPercent(stats.crescimento)}
/>

// Datas relativas
<span>{formatRelativeTime(item.createdAt)}</span>  
// "há 2 horas", "há 3 dias"
```

### Formulários
```javascript
// Campos formatados automaticamente
<InputMask
  mask="999.999.999-99"
  placeholder="CPF"
  label="CPF do Paciente"
/>

<InputMask
  mask="(99) 99999-9999"
  placeholder="(11) 99999-9999"
  label="Telefone"
/>
```

### Tabelas
```javascript
// Colunas com formatação
<td>{formatCPF(paciente.cpf)}</td>
<td>{formatDate(paciente.dataNascimento)}</td>
<td>{calculateAge(paciente.dataNascimento)} anos</td>
<td>{formatPhone(paciente.contato)}</td>
```

### Relatórios
```javascript
// PDF/CSV com formatos brasileiros
const exportData = transacoes.map(t => ({
  Data: formatDateTime(t.data),
  Tipo: t.tipo === 'receita' ? 'Receita' : 'Despesa',
  Valor: formatCurrency(t.valor),
  Descrição: t.descricao
}));
```

---

## ✅ Checklist de Validação

### Backend
- [x] Timezone configurado (America/Sao_Paulo)
- [x] Datas salvas no banco em UTC
- [x] Datas convertidas para BRT na resposta
- [x] Variável TZ definida

### Frontend
- [x] HTML com lang="pt-BR"
- [x] Meta tags de localização
- [x] Moeda formatada em BRL
- [x] Datas em formato brasileiro (DD/MM/YYYY)
- [x] Números com vírgula decimal
- [x] CPF/CNPJ com validação
- [x] Telefones brasileiros
- [x] Estados do Brasil disponíveis

### Responsividade
- [x] Mobile < 768px
- [x] Tablet 768-1024px
- [x] Desktop > 1024px
- [x] Touch targets >= 44px
- [x] Texto legível em todos os tamanhos

### Acessibilidade
- [x] Contraste WCAG AA (4.5:1)
- [x] Labels em todos os inputs
- [x] ARIA labels onde necessário
- [x] Navegação por teclado
- [x] Foco visível

---

## 🔧 Manutenção

### Adicionar Novo Formato

1. Adicione função em `client/src/utils/locale.js`
2. Exporte a função
3. Importe onde necessário
4. Use consistentemente em todo o app

### Testar Formatação

```javascript
// Teste manual no console do navegador
import { formatCurrency, formatCPF } from './utils/locale';

console.log(formatCurrency(1234.56));  // "R$ 1.234,56"
console.log(formatCPF('12345678900')); // "123.456.789-00"
```

---

## 📚 Referências

- [Intl.NumberFormat - MDN](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat)
- [Intl.DateTimeFormat - MDN](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat)
- [Timezones IANA](https://www.iana.org/time-zones)
- [ISO 4217 - BRL](https://www.iso.org/iso-4217-currency-codes.html)

---

**Última atualização**: 23 de janeiro de 2026  
**Versão**: 1.0.0  
**Região**: Brasil 🇧🇷
