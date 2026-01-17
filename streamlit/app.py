import os
import requests
import pandas as pd
import streamlit as st
import plotly.express as px

st.set_page_config(page_title="Prescrimed Dashboard", layout="wide")

# Configuração inicial
DEFAULT_BACKEND = os.environ.get("PRESCRIMED_BACKEND", "https://prescrimed-backend-production.up.railway.app")
if "token" not in st.session_state:
    st.session_state["token"] = None

st.title("Prescrimed • Painel Streamlit")
st.caption("Visualização rápida de saúde da API e estatísticas financeiras em produção.")

with st.sidebar:
    st.header("Configurações")
    backend_root = st.text_input("Backend (Root)", DEFAULT_BACKEND)
    test_health = st.button("Testar Saúde")
    st.divider()
    st.subheader("Login")
    email = st.text_input("Email", value="", placeholder="seu-email@exemplo.com")
    senha = st.text_input("Senha", type="password")
    do_login = st.button("Entrar")

def api_get(path: str):
    url = backend_root.rstrip("/") + path
    headers = {"Content-Type": "application/json"}
    if st.session_state["token"]:
        headers["Authorization"] = f"Bearer {st.session_state['token']}"
    return requests.get(url, headers=headers, timeout=10)

def api_post(path: str, json: dict):
    url = backend_root.rstrip("/") + path
    headers = {"Content-Type": "application/json"}
    return requests.post(url, json=json, headers=headers, timeout=10)

def format_brl(valor: float) -> str:
    try:
        return f"R$ {valor:,.2f}".replace(",", "X").replace(".", ",").replace("X", ".")
    except Exception:
        return "R$ 0,00"

# Ações de sidebar
if test_health:
    c1, c2 = st.columns(2)
    with c1:
        st.write("Endpoint:", "/health")
        try:
            r = api_get("/health")
            st.code(r.text, language="json")
            st.success(f"Status: {r.status_code}")
        except Exception as e:
            st.error(f"Falha /health: {e}")
    with c2:
        st.write("Endpoint:", "/api/health")
        try:
            r = api_get("/api/health")
            st.code(r.text, language="json")
            st.success(f"Status: {r.status_code}")
        except Exception as e:
            st.warning(f"Falha /api/health: {e}")

if do_login:
    if not email or not senha:
        st.warning("Informe email e senha.")
    else:
        try:
            resp = api_post("/api/auth/login", {"email": email, "senha": senha})
            if resp.status_code == 200:
                data = resp.json()
                st.session_state["token"] = data.get("token")
                st.success("Login realizado!")
            else:
                st.error(f"Erro de login: {resp.status_code} — {resp.text}")
        except Exception as e:
            st.error(f"Falha ao login: {e}")

# Corpo principal: Estatísticas Financeiras
st.header("Estatísticas Financeiras")
if not st.session_state["token"]:
    st.info("Faça login na barra lateral para carregar estatísticas protegidas.")
else:
    try:
        r = api_get("/api/financeiro/stats")
        if r.status_code != 200:
            st.error(f"Erro ao buscar stats: {r.status_code}")
        else:
            payload = r.json()
            stats = payload.get("data", {})
            receitas = float(stats.get("receitas", 0))
            despesas = float(stats.get("despesas", 0))
            saldo = float(stats.get("saldo", 0))

            m1, m2, m3 = st.columns(3)
            m1.metric("Receitas", format_brl(receitas))
            m2.metric("Despesas", format_brl(despesas))
            m3.metric("Saldo", format_brl(saldo))

            fluxo = stats.get("fluxoCaixa", {})
            receitas_mes = pd.DataFrame(fluxo.get("receitas", []))
            despesas_mes = pd.DataFrame(fluxo.get("despesas", []))

            c1, c2 = st.columns(2)
            with c1:
                if not receitas_mes.empty:
                    fig_r = px.bar(receitas_mes, x="mes", y="valor", title="Receitas por Mês",
                                   labels={"mes": "Mês", "valor": "Valor (R$)"}, text="valor")
                    st.plotly_chart(fig_r, use_container_width=True)
            with c2:
                if not despesas_mes.empty:
                    fig_d = px.bar(despesas_mes, x="mes", y="valor", title="Despesas por Mês",
                                   labels={"mes": "Mês", "valor": "Valor (R$)"}, text="valor")
                    st.plotly_chart(fig_d, use_container_width=True)

            categorias = pd.DataFrame(stats.get("categorias", []))
            if not categorias.empty:
                fig_c = px.pie(categorias, names="nome", values="valor", title="Categorias")
                st.plotly_chart(fig_c, use_container_width=True)
    except Exception as e:
        st.error(f"Falha ao carregar estatísticas: {e}")

st.divider()
st.caption("© Prescrimed — Streamlit Dashboard")import os
import time
import requests
import streamlit as st

st.set_page_config(page_title="Prescrimed • Painel Streamlit", layout="wide")

DEFAULT_API_BASE = os.environ.get("API_BASE", "https://prescrimed-backend-production.up.railway.app/api").rstrip("/")
DEFAULT_BACKEND_ROOT = DEFAULT_API_BASE.replace("/api", "")

st.title("Prescrimed — Painel de Observabilidade")
st.caption("Interface auxiliar em Streamlit para saúde da API, finanças e diagnósticos.")

with st.sidebar:
    st.header("Configuração")
    api_base = st.text_input("API Base (ex: https://.../api)", value=DEFAULT_API_BASE)
    backend_root = api_base.replace("/api", "")
    token = st.text_input("Token JWT (opcional)", type="password")
    refresh_on_load = st.checkbox("Atualizar automaticamente", value=True)
    st.write("\n")
    st.markdown("### Ações")
    btn_health = st.button("Checar /health")
    btn_api_health = st.button("Checar /api/health")

tabs = st.tabs(["Saúde", "Financeiro", "Diagnóstico", "Informações"])

def safe_get(url, headers=None, timeout=10):
    try:
        r = requests.get(url, headers=headers or {}, timeout=timeout)
        return r.status_code, r.json() if r.headers.get("Content-Type", "").startswith("application/json") else r.text
    except Exception as e:
        return "ERR", str(e)

with tabs[0]:
    st.subheader("Saúde do Backend")
    col1, col2 = st.columns(2)
    with col1:
        if btn_health or refresh_on_load:
            code, data = safe_get(f"{backend_root}/health")
            st.metric(label="/health", value=code)
            st.json(data) if isinstance(data, dict) else st.write(data)
    with col2:
        if btn_api_health or refresh_on_load:
            code, data = safe_get(f"{api_base}/health")
            st.metric(label="/api/health", value=code)
            st.json(data) if isinstance(data, dict) else st.write(data)

with tabs[1]:
    st.subheader("Resumo Financeiro")
    headers = {"Authorization": f"Bearer {token}"} if token else {}
    code, data = safe_get(f"{api_base}/financeiro/stats", headers=headers)
    col1, col2, col3 = st.columns(3)
    if isinstance(data, dict):
        stats = data.get("data", data)
        receitas = float(stats.get("receitas", 0) or 0)
        despesas = float(stats.get("despesas", 0) or 0)
        saldo = float(stats.get("saldo", receitas - despesas))
        col1.metric("Receitas (R$)", f"{receitas:,.2f}")
        col2.metric("Despesas (R$)", f"{despesas:,.2f}")
        col3.metric("Saldo (R$)", f"{saldo:,.2f}")
    else:
        st.write("Status:", code)
        st.write(data)

with tabs[2]:
    st.subheader("Diagnóstico")
    code, data = safe_get(f"{api_base}/diagnostic/db-check")
    st.write("Status:", code)
    if isinstance(data, dict):
        st.json(data)
    else:
        st.write(data)

with tabs[3]:
    st.subheader("Informações")
    st.markdown("- **API Base**: %s" % api_base)
    st.markdown("- **Backend Root**: %s" % backend_root)
    st.markdown("- **Atualização automática**: %s" % ("sim" if refresh_on_load else "não"))
    st.markdown("\n")
    st.info("Para endpoints protegidos, informe um Token JWT válido no menu lateral.")
