"""
Componentes Reutilizáveis - Prescrimed Streamlit
Componentes UI para uso em todo o dashboard
"""

import streamlit as st
import plotly.graph_objects as go
from typing import List, Dict, Optional


def metric_card(title: str, value: str, delta: str = None, icon: str = "📊"):
    """
    Cria um card de métrica estilizado
    
    Args:
        title: Título da métrica
        value: Valor principal
        delta: Variação (opcional)
        icon: Ícone emoji (opcional)
    """
    delta_html = f'<p class="metric-delta">{delta}</p>' if delta else ''
    
    st.markdown(f"""
    <div class="metric-card">
        <div style="display: flex; align-items: center; margin-bottom: 0.5rem;">
            <span style="font-size: 1.5rem; margin-right: 0.5rem;">{icon}</span>
            <span style="color: #6B7280; font-size: 0.875rem; font-weight: 600; text-transform: uppercase;">{title}</span>
        </div>
        <p style="font-size: 2rem; font-weight: 700; color: #1F2937; margin: 0;">{value}</p>
        {delta_html}
    </div>
    """, unsafe_allow_html=True)


def status_badge(status: str, status_map: Dict[str, Dict] = None):
    """
    Cria um badge de status colorido
    
    Args:
        status: Status atual
        status_map: Mapeamento de status para cores e labels
    """
    default_map = {
        'ativo': {'color': '#10B981', 'label': 'Ativo'},
        'inativo': {'color': '#EF4444', 'label': 'Inativo'},
        'pendente': {'color': '#F59E0B', 'label': 'Pendente'},
        'concluido': {'color': '#06B6D4', 'label': 'Concluído'},
    }
    
    map_to_use = status_map or default_map
    status_info = map_to_use.get(status.lower(), {'color': '#6B7280', 'label': status})
    
    st.markdown(f"""
    <span style="
        background: {status_info['color']}20;
        color: {status_info['color']};
        padding: 0.25rem 0.75rem;
        border-radius: 9999px;
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    ">{status_info['label']}</span>
    """, unsafe_allow_html=True)


def alert_box(message: str, alert_type: str = "info"):
    """
    Cria uma caixa de alerta estilizada
    
    Args:
        message: Mensagem a exibir
        alert_type: Tipo do alerta (info, success, warning, error)
    """
    colors = {
        'info': {'bg': '#DBEAFE', 'border': '#3B82F6', 'text': '#1E40AF', 'icon': 'ℹ️'},
        'success': {'bg': '#D1FAE5', 'border': '#10B981', 'text': '#065F46', 'icon': '✅'},
        'warning': {'bg': '#FEF3C7', 'border': '#F59E0B', 'text': '#92400E', 'icon': '⚠️'},
        'error': {'bg': '#FEE2E2', 'border': '#EF4444', 'text': '#991B1B', 'icon': '❌'},
    }
    
    color = colors.get(alert_type, colors['info'])
    
    st.markdown(f"""
    <div style="
        background: {color['bg']};
        border-left: 4px solid {color['border']};
        color: {color['text']};
        padding: 1rem;
        border-radius: 0.5rem;
        margin: 1rem 0;
        display: flex;
        align-items: center;
        gap: 0.75rem;
    ">
        <span style="font-size: 1.5rem;">{color['icon']}</span>
        <span>{message}</span>
    </div>
    """, unsafe_allow_html=True)


def loading_spinner(message: str = "Carregando..."):
    """Exibe um spinner de carregamento"""
    with st.spinner(message):
        return st.empty()


def progress_bar(value: int, max_value: int = 100, label: str = None):
    """
    Cria uma barra de progresso customizada
    
    Args:
        value: Valor atual
        max_value: Valor máximo
        label: Label opcional
    """
    percentage = (value / max_value) * 100 if max_value > 0 else 0
    
    label_html = f'<p style="margin: 0 0 0.5rem 0; font-weight: 600;">{label}</p>' if label else ''
    
    st.markdown(f"""
    {label_html}
    <div style="
        background: #E5E7EB;
        border-radius: 9999px;
        height: 0.75rem;
        overflow: hidden;
        margin-bottom: 1rem;
    ">
        <div style="
            background: linear-gradient(90deg, #4F46E5 0%, #06B6D4 100%);
            height: 100%;
            width: {percentage}%;
            transition: width 0.3s ease;
        "></div>
    </div>
    <p style="text-align: right; color: #6B7280; font-size: 0.875rem; margin: 0;">{value} / {max_value}</p>
    """, unsafe_allow_html=True)


def data_table(data: List[Dict], columns: List[str] = None, actions: bool = False):
    """
    Cria uma tabela de dados estilizada
    
    Args:
        data: Lista de dicionários com os dados
        columns: Colunas a exibir (opcional)
        actions: Se deve incluir coluna de ações
    """
    import pandas as pd
    
    df = pd.DataFrame(data)
    
    if columns:
        df = df[columns]
    
    st.dataframe(
        df,
        use_container_width=True,
        hide_index=True
    )
