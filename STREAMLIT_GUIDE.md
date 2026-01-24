# 🚀 Guia de Instalação e Uso do Streamlit - Prescrimed

## 📊 O que é o Streamlit App?

O **Streamlit App** é um dashboard interativo de analytics desenvolvido para o sistema Prescrimed. Ele oferece:

- 📈 Visualizações de dados em tempo real
- 📊 Gráficos interativos com Plotly
- 🎨 Design responsivo e profissional
- 🔍 Filtros avançados
- 📋 Tabelas dinâmicas
- 🌐 Integração com a API do backend

---

## 🛠️ Instalação

### Pré-requisitos

- ✅ Python 3.8 ou superior
- ✅ pip (gerenciador de pacotes Python)
- ✅ Backend Prescrimed rodando (API na porta 8000)

### Passo 1: Verificar Python

```bash
python --version
# ou
python3 --version
```

Se não tiver Python instalado, baixe em: [python.org](https://www.python.org/downloads/)

### Passo 2: Criar Ambiente Virtual (Recomendado)

```bash
# Windows (PowerShell)
cd streamlit-app
python -m venv venv
.\venv\Scripts\activate

# Linux/Mac
cd streamlit-app
python3 -m venv venv
source venv/bin/activate
```

### Passo 3: Instalar Dependências

**Opção A: Via script npm (recomendado)**
```bash
# A partir da raiz do projeto
npm run streamlit:install
```

**Opção B: Manualmente**
```bash
cd streamlit-app
pip install -r requirements.txt
```

**Pacotes que serão instalados:**
- streamlit (framework principal)
- pandas (manipulação de dados)
- plotly (gráficos interativos)
- requests (comunicação com API)
- sqlalchemy (banco de dados)
- e outros auxiliares...

---

## 🚀 Executar o Dashboard

### Opção 1: Via npm script (Recomendado)

```bash
# A partir da raiz do projeto
npm run streamlit
```

### Opção 2: Diretamente com Streamlit

```bash
cd streamlit-app
streamlit run app.py
```

### Opção 3: Rodar tudo junto (Backend + Frontend + Streamlit)

```bash
npm run dev:all
```

Isso iniciará:
- 🟢 Backend Node.js (porta 8000)
- 🔵 Frontend React (porta 5173)
- 🟣 Streamlit Dashboard (porta 8501)

---

## 📱 Acessar o Dashboard

Após iniciar, o dashboard estará disponível em:

```
http://localhost:8501
```

O navegador padrão será aberto automaticamente.

---

## 🎯 Funcionalidades Disponíveis

### ✅ Implementadas

1. **Dashboard Geral** (`/`)
   - Métricas principais (pacientes, prescrições, receita)
   - Gráfico de evolução de pacientes
   - Distribuição de prescrições por tipo
   - Últimas atividades

2. **Páginas Adicionais**
   - 👥 Pacientes (análise básica)
   - 💊 Prescrições (análise básica)

### 🚧 Em Desenvolvimento

- 💰 Dashboard Financeiro completo
- 📈 Relatórios personalizados
- 🔐 Autenticação integrada
- 📊 Mais visualizações de dados
- 🗺️ Mapas e geolocalização
- 📧 Exportação de relatórios (PDF, Excel)

---

## 🔧 Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na pasta `streamlit-app/`:

```env
# API Backend
API_URL=http://localhost:8000/api

# Banco de Dados (opcional para acesso direto)
DATABASE_URL=postgresql://user:password@localhost:5432/prescrimed
```

### Personalizar Tema

Edite `.streamlit/config.toml`:

```toml
[theme]
primaryColor = "#4F46E5"           # Cor principal (roxo Prescrimed)
backgroundColor = "#FFFFFF"         # Fundo branco
secondaryBackgroundColor = "#F3F4F6"  # Cinza claro
textColor = "#1F2937"              # Texto escuro
font = "sans serif"                # Fonte

[server]
port = 8501                        # Porta do Streamlit
enableCORS = true                  # Permitir CORS
```

---

## 📊 Estrutura de Arquivos

```
streamlit-app/
├── 📄 app.py                    # Aplicação principal (dashboard geral)
├── 📄 requirements.txt          # Dependências Python
├── 📄 README.md                 # Documentação do Streamlit
├── 📄 .env.example              # Exemplo de variáveis de ambiente
│
├── 📁 .streamlit/
│   └── config.toml              # Configurações (tema, porta, etc)
│
├── 📁 pages/                    # Páginas adicionais (multi-page app)
│   ├── 01_Pacientes.py         # Análise de pacientes
│   └── 02_Prescricoes.py       # Análise de prescrições
│
├── 📁 components/               # Componentes reutilizáveis
│   └── ui_components.py         # Cards, badges, alertas, etc
│
└── 📁 utils/                    # Utilitários
    └── api_client.py            # Cliente para comunicação com API
```

---

## 🎨 Design e Responsividade

O dashboard foi desenvolvido com design profissional e é **totalmente responsivo**:

### ✅ Dispositivos Suportados

- 💻 **Desktop**: 1920x1080, 1366x768
- 💻 **Laptop**: 1280x720
- 📱 **Tablet**: 768x1024
- 📱 **Mobile**: 375x667 e superior

### 🎨 Sistema de Cores

```css
--primary: #4F46E5        /* Roxo Prescrimed */
--secondary: #06B6D4      /* Ciano */
--success: #10B981        /* Verde */
--warning: #F59E0B        /* Âmbar */
--danger: #EF4444         /* Vermelho */
--dark: #1F2937           /* Cinza escuro */
--light: #F3F4F6          /* Cinza claro */
```

---

## 🔌 Integração com Backend

O Streamlit se comunica com o backend Node.js através de requests HTTP:

```python
from utils.api_client import APIClient

# Inicializar cliente
api = APIClient()

# Buscar dados
dados = api.get('dashboard/metrics')
pacientes = api.get('pacientes', params={'status': 'ativo'})

# Enviar dados
resultado = api.post('prescricoes', data={'paciente_id': 123})
```

---

## 📈 Exemplos de Uso

### Criar Card de Métrica

```python
from components.ui_components import metric_card

metric_card(
    title="Total de Pacientes",
    value="1,234",
    delta="↑ 12% vs mês anterior",
    icon="👥"
)
```

### Criar Gráfico

```python
import plotly.express as px

fig = px.line(dados, x='data', y='valor', title='Evolução')
st.plotly_chart(fig, use_container_width=True)
```

### Criar Tabela

```python
from components.ui_components import data_table

data_table(
    data=[
        {'nome': 'Maria', 'idade': 45},
        {'nome': 'João', 'idade': 62}
    ],
    columns=['nome', 'idade']
)
```

---

## 🐛 Resolução de Problemas

### Erro: "streamlit: command not found"

**Solução:**
```bash
pip install --upgrade streamlit
# ou
python -m streamlit run app.py
```

### Erro: "ModuleNotFoundError: No module named 'streamlit'"

**Solução:**
```bash
cd streamlit-app
pip install -r requirements.txt
```

### Erro: "Port 8501 is already in use"

**Solução:**
```bash
# Mudar porta no config.toml ou:
streamlit run app.py --server.port 8502
```

### Dashboard não conecta à API

**Verificar:**
1. Backend está rodando na porta 8000?
2. Arquivo `.env` configurado corretamente?
3. URL da API está correta?

```bash
# Testar API
curl http://localhost:8000/health
```

---

## 🚀 Deploy (Futuro)

### Railway

O Streamlit pode ser executado junto ao Node.js no Railway:

```yaml
# railway.toml
[build]
builder = "NIXPACKS"

[build.nixPacks]
packages = ["python39", "nodejs_20"]

[deploy]
startCommand = "npm start & streamlit run streamlit-app/app.py"
```

### Heroku

```yaml
# Procfile
web: npm start
worker: cd streamlit-app && streamlit run app.py
```

---

## 📚 Recursos Adicionais

- 📖 [Streamlit Docs](https://docs.streamlit.io/)
- 📊 [Plotly Python](https://plotly.com/python/)
- 🐼 [Pandas Docs](https://pandas.pydata.org/docs/)
- 🎨 [Streamlit Components](https://streamlit.io/components)

---

## 🤝 Contribuindo

Para adicionar novas páginas ou funcionalidades:

1. **Nova Página**: Crie arquivo em `pages/03_NomePagina.py`
2. **Novo Componente**: Adicione função em `components/ui_components.py`
3. **Nova Utilidade**: Adicione em `utils/`

---

## 📝 Changelog

### Versão 1.0.0 (23/01/2026)
- ✨ Lançamento inicial
- ✅ Dashboard geral completo
- ✅ Páginas de pacientes e prescrições
- ✅ Design responsivo
- ✅ Integração com API preparada
- ✅ Componentes reutilizáveis

---

## 💡 Dicas de Uso

1. **Recarregar automaticamente**: Streamlit detecta mudanças e pergunta se quer recarregar
2. **Limpar cache**: Use `Ctrl + R` ou clique em "Rerun" no canto superior direito
3. **Modo escuro**: Acesse menu > Settings > Theme
4. **Compartilhar**: Use o botão "Share" para gerar link (Streamlit Cloud)

---

**Desenvolvido com ❤️ para o Sistema Prescrimed**  
**Data:** 23 de janeiro de 2026  
**Versão:** 1.0.0
