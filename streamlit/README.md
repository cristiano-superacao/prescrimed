# Prescrimed — Painel Streamlit

Painel auxiliar para observar saúde do backend, resumo financeiro e diagnósticos, mantendo o layout simples e profissional.

## Pré-requisitos
- Python 3.10+ instalado e disponível no PATH
- Windows PowerShell (scripts fornecidos) 

## Instalação rápida (Windows)

```powershell
# criar venv e instalar dependências
powershell -ExecutionPolicy Bypass -File ..\scripts\setup-streamlit.ps1

# executar o app
powershell -ExecutionPolicy Bypass -File ..\scripts\run-streamlit.ps1
```

## Variáveis opcionais
- `API_BASE`: URL da API com sufixo `/api` (ex.: `https://seu-backend.up.railway.app/api`).
  - Se não definida, o app usa o backend de produção atual.

## Uso
- No painel lateral, ajuste a `API Base` e, se necessário, informe um `Token JWT` para endpoints protegidos.
- Abas disponíveis:
  - Saúde (`/health`, `/api/health`)
  - Financeiro (resumo `receitas`, `despesas`, `saldo`)
  - Diagnóstico (conexão com banco)
