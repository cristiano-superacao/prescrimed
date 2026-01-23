"""
Página de Pacientes - Prescrimed Analytics
Análise detalhada de dados de pacientes
"""

import streamlit as st
import pandas as pd
import plotly.express as px

st.set_page_config(page_title="Pacientes - Prescrimed", page_icon="👥", layout="wide")

st.markdown("# 👥 Análise de Pacientes")
st.markdown("Visualize e analise dados detalhados dos pacientes")

# Filtros
col1, col2, col3 = st.columns(3)
with col1:
    status = st.selectbox("Status", ["Todos", "Ativos", "Inativos"])
with col2:
    idade_min = st.number_input("Idade mínima", 0, 120, 0)
with col3:
    idade_max = st.number_input("Idade máxima", 0, 120, 120)

# Dados de exemplo
dados_pacientes = pd.DataFrame({
    'Nome': ['Maria Silva', 'João Santos', 'Ana Costa', 'Pedro Oliveira', 'Carla Souza'],
    'Idade': [45, 62, 33, 58, 41],
    'Status': ['Ativo', 'Ativo', 'Inativo', 'Ativo', 'Ativo'],
    'Última Consulta': ['20/01/2026', '18/01/2026', '15/12/2025', '22/01/2026', '19/01/2026'],
    'Prescrições': [8, 15, 3, 12, 5]
})

st.dataframe(dados_pacientes, use_container_width=True, hide_index=True)

# Gráfico de distribuição por idade
st.markdown("### Distribuição por Faixa Etária")
fig = px.histogram(dados_pacientes, x='Idade', nbins=10, title='')
st.plotly_chart(fig, use_container_width=True)
