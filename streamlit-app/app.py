import os
import requests
import streamlit as st

BACKEND_DEFAULT = "https://prescrimed-backend-production.up.railway.app"
BACKEND_URL = os.getenv("BACKEND_URL", BACKEND_DEFAULT).rstrip("/")

st.set_page_config(page_title="Prescrimed Dashboard", layout="wide")

st.title("Prescrimed — Dashboard Streamlit")

col1, col2, col3 = st.columns([2,2,1])
with col1:
    st.subheader("Status do Backend")
    try:
        r = requests.get(f"{BACKEND_URL}/health", timeout=8)
        data = r.json()
        st.success(f"Online • DB: {data.get('database','desconhecido')} • Uptime: {int(data.get('uptime',0))}s")
    except Exception as e:
        st.error(f"Backend indisponível: {e}")

with col2:
    st.subheader("API Health (/api/health)")
    try:
        r = requests.get(f"{BACKEND_URL}/api/health", timeout=8)
        st.info(f"Resposta: {r.status_code}")
        if r.status_code == 200:
            st.success("API saudável")
        elif r.status_code == 404:
            st.warning("Endpoint ainda não publicado nesta instância")
        else:
            st.warning("API respondeu, verificar autenticação ou rotas")
    except Exception as e:
        st.error(f"Erro ao acessar API: {e}")

with col3:
    st.subheader("Configuração")
    st.caption(f"BACKEND_URL: {BACKEND_URL}")

st.divider()

st.subheader("Acesso Rápido")
colA, colB = st.columns(2)
with colA:
    st.markdown("""
    - Login (frontend): [GitHub Pages](https://cristiano-superacao.github.io/prescrimed)
    - Backend: [Railway]({backend})
    """.format(backend=BACKEND_URL))

with colB:
    st.markdown("""
    - Financeiro (API protegida): `/api/financeiro/stats`
    - Diagnóstico DB: `/api/diagnostic/db-check`
    """)

st.info("Este dashboard é complementar e não substitui o frontend React/Vite. Mantém visual limpo e responsivo para status rápido.")
