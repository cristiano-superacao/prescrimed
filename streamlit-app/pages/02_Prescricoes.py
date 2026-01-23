"""
Página de Prescrições - Prescrimed Analytics
Análise detalhada de prescrições médicas
"""

import streamlit as st
import pandas as pd
import plotly.express as px
from datetime import datetime, timedelta

st.set_page_config(page_title="Prescrições - Prescrimed", page_icon="💊", layout="wide")

st.markdown("# 💊 Análise de Prescrições")
st.markdown("Acompanhe e analise as prescrições do sistema")

# Métricas rápidas
col1, col2, col3, col4 = st.columns(4)
with col1:
    st.metric("Total de Prescrições", "856", "↑ 8%")
with col2:
    st.metric("Ativas Hoje", "124", "↑ 3%")
with col3:
    st.metric("Concluídas", "732", "↑ 12%")
with col4:
    st.metric("Taxa de Adesão", "87%", "↑ 2%")

st.markdown("---")

# Gráfico de prescrições por dia
st.markdown("### 📈 Prescrições nos Últimos 30 Dias")
dates = pd.date_range(end=datetime.now(), periods=30, freq='D')
valores = [20 + i % 10 + (i % 3) * 5 for i in range(30)]
dados_timeline = pd.DataFrame({'Data': dates, 'Prescrições': valores})

fig = px.area(dados_timeline, x='Data', y='Prescrições', title='')
fig.update_layout(height=300)
st.plotly_chart(fig, use_container_width=True)

# Tabela de prescrições recentes
st.markdown("### 📋 Prescrições Recentes")
dados_prescricoes = pd.DataFrame({
    'ID': ['#PRE-001', '#PRE-002', '#PRE-003', '#PRE-004', '#PRE-005'],
    'Paciente': ['Maria Silva', 'João Santos', 'Ana Costa', 'Pedro Oliveira', 'Carla Souza'],
    'Medicamento': ['Paracetamol 500mg', 'Ibuprofeno 600mg', 'Amoxicilina 500mg', 'Losartana 50mg', 'Metformina 850mg'],
    'Data': ['23/01/2026', '23/01/2026', '22/01/2026', '22/01/2026', '21/01/2026'],
    'Status': ['✅ Ativa', '✅ Ativa', '⏳ Pendente', '✅ Ativa', '🔄 Em uso']
})

st.dataframe(dados_prescricoes, use_container_width=True, hide_index=True)
