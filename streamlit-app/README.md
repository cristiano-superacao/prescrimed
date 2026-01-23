# Streamlit App - Prescrimed Analytics

## 📊 Sobre

Dashboard interativo desenvolvido com Streamlit para análise de dados e visualização de métricas do sistema Prescrimed.

## 🚀 Instalação

### 1. Criar ambiente virtual (recomendado)

```bash
# Windows
python -m venv venv
.\venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
```

### 2. Instalar dependências

```bash
cd streamlit-app
pip install -r requirements.txt
```

## 🎯 Executar Localmente

```bash
# A partir da raiz do projeto
cd streamlit-app
streamlit run app.py
```

O dashboard estará disponível em: `http://localhost:8501`

## 📦 Estrutura

```
streamlit-app/
├── app.py                      # Aplicação principal
├── requirements.txt            # Dependências Python
├── .streamlit/
│   └── config.toml            # Configurações do Streamlit
├── pages/                     # Páginas adicionais (futuro)
├── components/                # Componentes reutilizáveis
│   └── ui_components.py       # Componentes UI
└── utils/                     # Utilitários
    └── api_client.py          # Cliente de API
```

## 🎨 Funcionalidades

### ✅ Implementado

- 📊 Dashboard geral com métricas principais
- 📈 Gráficos interativos (Plotly)
- 🎨 Design responsivo e profissional
- 🔍 Filtros por período e empresa
- 📋 Tabela de últimas atividades
- 🌐 Integração com API (preparado)

### 🚧 Em Desenvolvimento

- 👥 Análise detalhada de pacientes
- 💊 Análise de prescrições
- 💰 Dashboard financeiro completo
- 📈 Relatórios personalizados
- 🔐 Autenticação integrada
- 📊 Mais visualizações de dados

## 🔧 Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na pasta `streamlit-app/`:

```env
API_URL=http://localhost:8000/api
DATABASE_URL=postgresql://user:password@localhost:5432/prescrimed
```

## 🎨 Personalização

### Tema

Edite o arquivo `.streamlit/config.toml` para personalizar cores:

```toml
[theme]
primaryColor = "#4F46E5"      # Cor primária
backgroundColor = "#FFFFFF"    # Fundo
secondaryBackgroundColor = "#F3F4F6"  # Fundo secundário
textColor = "#1F2937"         # Texto
```

## 📱 Responsividade

O dashboard é totalmente responsivo e funciona em:
- 💻 Desktop (1920x1080 e acima)
- 💻 Laptop (1366x768)
- 📱 Tablet (768x1024)
- 📱 Mobile (375x667 e acima)

## 🔌 Integração com Backend

O Streamlit se conecta à API Node.js/Express através do módulo `utils/api_client.py`:

```python
from utils.api_client import APIClient

api = APIClient()
dados = api.get('dashboard/metrics')
```

## 📊 Gráficos Disponíveis

- 📈 Linha (evolução temporal)
- 📊 Barras (comparações)
- 🥧 Pizza (distribuições)
- 📉 Área (tendências)
- 🗺️ Mapas (localização) - futuro
- 📊 Heatmaps (correlações) - futuro

## 🚀 Deploy no Railway (Futuro)

O Streamlit pode ser executado em paralelo ao Node.js no Railway:

```toml
# Adicionar ao nixpacks.toml
[phases.install]
cmds = [
  "npm ci",
  "pip install -r streamlit-app/requirements.txt"
]
```

## 📚 Documentação

- [Streamlit Docs](https://docs.streamlit.io/)
- [Plotly Python](https://plotly.com/python/)
- [Pandas](https://pandas.pydata.org/docs/)

## 🤝 Contribuindo

Sinta-se à vontade para adicionar novas páginas e componentes:

1. Crie uma nova página em `pages/`
2. Importe componentes de `components/ui_components.py`
3. Use `utils/api_client.py` para buscar dados da API

## 📄 Licença

Este projeto segue a mesma licença do sistema Prescrimed principal.

---

**Desenvolvido com ❤️ para o Sistema Prescrimed**
