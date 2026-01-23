"""
Utilitários de Conexão com API - Prescrimed Streamlit
Funções auxiliares para comunicação com o backend
"""

import requests
import os
from typing import Dict, List, Optional
import streamlit as st

class APIClient:
    """Cliente para comunicação com a API Prescrimed"""
    
    def __init__(self, base_url: str = None):
        self.base_url = base_url or os.getenv('API_URL', 'http://localhost:8000/api')
        self.token = None
    
    def set_token(self, token: str):
        """Define o token de autenticação"""
        self.token = token
    
    def _get_headers(self) -> Dict:
        """Retorna headers padrão para requisições"""
        headers = {'Content-Type': 'application/json'}
        if self.token:
            headers['Authorization'] = f'Bearer {self.token}'
        return headers
    
    def get(self, endpoint: str, params: Dict = None) -> Optional[Dict]:
        """Requisição GET"""
        try:
            url = f"{self.base_url}/{endpoint}"
            response = requests.get(url, headers=self._get_headers(), params=params, timeout=10)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            st.error(f"Erro ao buscar dados: {str(e)}")
            return None
    
    def post(self, endpoint: str, data: Dict) -> Optional[Dict]:
        """Requisição POST"""
        try:
            url = f"{self.base_url}/{endpoint}"
            response = requests.post(url, json=data, headers=self._get_headers(), timeout=10)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            st.error(f"Erro ao enviar dados: {str(e)}")
            return None
    
    def put(self, endpoint: str, data: Dict) -> Optional[Dict]:
        """Requisição PUT"""
        try:
            url = f"{self.base_url}/{endpoint}"
            response = requests.put(url, json=data, headers=self._get_headers(), timeout=10)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            st.error(f"Erro ao atualizar dados: {str(e)}")
            return None
    
    def delete(self, endpoint: str) -> bool:
        """Requisição DELETE"""
        try:
            url = f"{self.base_url}/{endpoint}"
            response = requests.delete(url, headers=self._get_headers(), timeout=10)
            response.raise_for_status()
            return True
        except requests.exceptions.RequestException as e:
            st.error(f"Erro ao deletar dados: {str(e)}")
            return False
    
    def health_check(self) -> bool:
        """Verifica se a API está online"""
        try:
            url = f"{self.base_url.replace('/api', '')}/health"
            response = requests.get(url, timeout=5)
            return response.status_code == 200
        except:
            return False


def format_currency(value: float) -> str:
    """Formata valor para moeda brasileira"""
    return f"R$ {value:,.2f}".replace(',', '_').replace('.', ',').replace('_', '.')


def format_date(date_str: str, format_type: str = 'br') -> str:
    """Formata data para formato brasileiro"""
    from datetime import datetime
    try:
        if format_type == 'br':
            date_obj = datetime.fromisoformat(date_str.replace('Z', '+00:00'))
            return date_obj.strftime('%d/%m/%Y %H:%M')
        return date_str
    except:
        return date_str


def safe_divide(numerator: float, denominator: float, default: float = 0) -> float:
    """Divisão segura que evita divisão por zero"""
    return numerator / denominator if denominator != 0 else default
