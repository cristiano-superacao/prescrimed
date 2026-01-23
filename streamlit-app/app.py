"""
Streamlit Dashboard - Prescrimed
Dashboard interativo para visualização de dados e análises do sistema Prescrimed
"""

import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from datetime import datetime, timedelta
import requests
import os
from dotenv import load_dotenv

# Carrega variáveis de ambiente
load_dotenv()

# Configuração da página
st.set_page_config(
    page_title="Prescrimed - Dashboard Analytics",
    page_icon="🏥",
    layout="wide",
    initial_sidebar_state="expanded"
)

# URL da API
API_URL = os.getenv('API_URL', 'http://localhost:8000/api')

# CSS customizado para layout profissional e responsivo
st.markdown("""
<style>
    /* Design System - Prescrimed */
    :root {
        --primary: #4F46E5;
        --primary-dark: #4338CA;
        --secondary: #06B6D4;
        --success: #10B981;
        --warning: #F59E0B;
        --danger: #EF4444;
        --dark: #1F2937;
        --light: #F3F4F6;
    }
    
    /* Header customizado */
    .main-header {
        background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
        padding: 2rem;
        border-radius: 1rem;
        color: white;
        margin-bottom: 2rem;
        box-shadow: 0 10px 30px rgba(79, 70, 229, 0.2);
    }
    
    .main-header h1 {
        margin: 0;
        font-size: 2.5rem;
        font-weight: 700;
    }
    
    .main-header p {
        margin: 0.5rem 0 0 0;
        opacity: 0.9;
        font-size: 1.1rem;
    }
    
    /* Cards de métricas */
    .metric-card {
        background: white;
        border-radius: 1rem;
        padding: 1.5rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
        border-left: 4px solid var(--primary);
        transition: transform 0.2s, box-shadow 0.2s;
    }
    
    .metric-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
    }
    
    /* Responsividade */
    @media (max-width: 768px) {
        .main-header h1 {
            font-size: 1.75rem;
        }
        
        .main-header p {
            font-size: 0.95rem;
        }
        
        .metric-card {
            padding: 1rem;
        }
    }
    
    /* Sidebar */
    .css-1d391kg {
        background: linear-gradient(180deg, #F9FAFB 0%, #F3F4F6 100%);
    }
    
    /* Botões */
    .stButton>button {
        background: var(--primary);
        color: white;
        border: none;
        border-radius: 0.5rem;
        padding: 0.5rem 2rem;
        font-weight: 600;
        transition: all 0.2s;
    }
    
    .stButton>button:hover {
        background: var(--primary-dark);
        transform: translateY(-2px);
        box-shadow: 0 6px 12px rgba(79, 70, 229, 0.3);
    }
    
    /* Tabelas */
    .dataframe {
        border-radius: 0.5rem;
        overflow: hidden;
    }
    
    /* Remove padding padrão */
    .block-container {
        padding-top: 2rem;
    }
</style>
""", unsafe_allow_html=True)

# Header principal
st.markdown("""
<div class="main-header">
    <h1>🏥 Prescrimed Analytics</h1>
    <p>Dashboard de Análise de Dados e Métricas do Sistema</p>
</div>
""", unsafe_allow_html=True)

# Sidebar - Navegação e filtros
with st.sidebar:
    st.image("https://via.placeholder.com/200x60/4F46E5/FFFFFF?text=Prescrimed", use_container_width=True)
    st.markdown("---")
    
    st.markdown("### 🎯 Navegação")
    page = st.selectbox(
        "Selecione uma página",
        ["📊 Dashboard Geral", "👥 Pacientes", "💊 Prescrições", "💰 Financeiro", "📈 Relatórios"],
        label_visibility="collapsed"
    )
    
    st.markdown("---")
    st.markdown("### 🔍 Filtros")
    
    # Filtro de período
    periodo = st.selectbox(
        "Período",
        ["Últimos 7 dias", "Últimos 30 dias", "Últimos 3 meses", "Último ano", "Personalizado"]
    )
    
    if periodo == "Personalizado":
        col1, col2 = st.columns(2)
        with col1:
            data_inicio = st.date_input("De", datetime.now() - timedelta(days=30))
        with col2:
            data_fim = st.date_input("Até", datetime.now())
    
    # Filtro de empresa
    empresas = ["Todas as empresas", "Empresa 1", "Empresa 2", "Empresa 3"]
    empresa_selecionada = st.selectbox("Empresa", empresas)
    
    st.markdown("---")
    st.markdown("### ⚙️ Configurações")
    if st.button("🔄 Atualizar Dados"):
        st.rerun()

# Conteúdo principal baseado na página selecionada
if page == "📊 Dashboard Geral":
    # Métricas principais em cards
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        st.metric(
            label="👥 Total de Pacientes",
            value="1,234",
            delta="↑ 12% vs mês anterior"
        )
    
    with col2:
        st.metric(
            label="💊 Prescrições Ativas",
            value="856",
            delta="↑ 8% vs mês anterior"
        )
    
    with col3:
        st.metric(
            label="💰 Receita do Mês",
            value="R$ 145.280",
            delta="↑ 15% vs mês anterior"
        )
    
    with col4:
        st.metric(
            label="⭐ Satisfação",
            value="4.8/5.0",
            delta="↑ 0.2 vs mês anterior"
        )
    
    st.markdown("---")
    
    # Gráficos principais
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown("### 📈 Evolução de Pacientes")
        # Dados de exemplo
        dados_evolucao = pd.DataFrame({
            'Data': pd.date_range(start='2024-01-01', periods=30, freq='D'),
            'Pacientes': [100 + i * 2 + (i % 5) * 3 for i in range(30)]
        })
        
        fig = px.line(
            dados_evolucao,
            x='Data',
            y='Pacientes',
            title='',
            markers=True
        )
        fig.update_layout(
            height=300,
            margin=dict(l=0, r=0, t=0, b=0),
            plot_bgcolor='rgba(0,0,0,0)',
            paper_bgcolor='rgba(0,0,0,0)',
        )
        st.plotly_chart(fig, use_container_width=True)
    
    with col2:
        st.markdown("### 💊 Prescrições por Tipo")
        # Dados de exemplo
        dados_prescricoes = pd.DataFrame({
            'Tipo': ['Medicamentos', 'Exames', 'Procedimentos', 'Outros'],
            'Quantidade': [450, 220, 150, 36]
        })
        
        fig = px.pie(
            dados_prescricoes,
            values='Quantidade',
            names='Tipo',
            hole=0.4,
            color_discrete_sequence=px.colors.qualitative.Set3
        )
        fig.update_layout(
            height=300,
            margin=dict(l=0, r=0, t=0, b=0),
            showlegend=True
        )
        st.plotly_chart(fig, use_container_width=True)
    
    st.markdown("---")
    
    # Tabela de últimas atividades
    st.markdown("### 📋 Últimas Atividades")
    
    dados_atividades = pd.DataFrame({
        'Data': ['23/01/2026 14:30', '23/01/2026 14:15', '23/01/2026 14:00', '23/01/2026 13:45'],
        'Paciente': ['Maria Silva', 'João Santos', 'Ana Costa', 'Pedro Oliveira'],
        'Ação': ['Nova prescrição', 'Consulta agendada', 'Exame realizado', 'Pagamento recebido'],
        'Responsável': ['Dr. Carlos', 'Dra. Ana', 'Lab. Central', 'Financeiro'],
        'Status': ['✅ Concluído', '⏳ Agendado', '✅ Concluído', '✅ Concluído']
    })
    
    st.dataframe(
        dados_atividades,
        use_container_width=True,
        hide_index=True,
        column_config={
            "Data": st.column_config.TextColumn("Data/Hora", width="medium"),
            "Paciente": st.column_config.TextColumn("Paciente", width="medium"),
            "Ação": st.column_config.TextColumn("Ação", width="medium"),
            "Responsável": st.column_config.TextColumn("Responsável", width="medium"),
            "Status": st.column_config.TextColumn("Status", width="small"),
        }
    )

elif page == "👥 Pacientes":
    st.markdown("## 👥 Gestão de Pacientes")
    st.info("📊 Funcionalidade em desenvolvimento - Em breve você terá acesso completo à análise de pacientes")

elif page == "💊 Prescrições":
    st.markdown("## 💊 Análise de Prescrições")
    st.info("📊 Funcionalidade em desenvolvimento - Em breve você terá acesso completo à análise de prescrições")

elif page == "💰 Financeiro":
    st.markdown("## 💰 Dashboard Financeiro")
    st.info("📊 Funcionalidade em desenvolvimento - Em breve você terá acesso completo à análise financeira")

elif page == "📈 Relatórios":
    st.markdown("## 📈 Relatórios Personalizados")
    st.info("📊 Funcionalidade em desenvolvimento - Em breve você poderá gerar relatórios personalizados")

# Footer
st.markdown("---")
st.markdown("""
<div style='text-align: center; opacity: 0.6; padding: 2rem 0;'>
    <p>© 2026 Prescrimed - Sistema de Gestão de Prescrições Médicas</p>
    <p style='font-size: 0.85rem;'>Dashboard desenvolvido com Streamlit | Versão 1.0.0</p>
</div>
""", unsafe_allow_html=True)
