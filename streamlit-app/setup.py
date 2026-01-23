#!/usr/bin/env python3
"""
Script de Setup do Streamlit - Prescrimed
Facilita a instalação e configuração do dashboard
"""

import subprocess
import sys
import os
from pathlib import Path

def print_header(text):
    """Imprime cabeçalho formatado"""
    print("\n" + "=" * 60)
    print(f"  {text}")
    print("=" * 60 + "\n")

def print_step(text):
    """Imprime passo formatado"""
    print(f"▶️  {text}")

def print_success(text):
    """Imprime mensagem de sucesso"""
    print(f"✅ {text}")

def print_error(text):
    """Imprime mensagem de erro"""
    print(f"❌ {text}")

def check_python():
    """Verifica se Python está instalado"""
    print_step("Verificando instalação do Python...")
    try:
        version = sys.version.split()[0]
        major, minor = map(int, version.split('.')[:2])
        
        if major >= 3 and minor >= 8:
            print_success(f"Python {version} encontrado")
            return True
        else:
            print_error(f"Python {version} encontrado, mas é necessário Python 3.8+")
            return False
    except:
        print_error("Python não encontrado")
        return False

def check_pip():
    """Verifica se pip está instalado"""
    print_step("Verificando pip...")
    try:
        result = subprocess.run([sys.executable, "-m", "pip", "--version"], 
                              capture_output=True, text=True)
        if result.returncode == 0:
            print_success(f"pip encontrado: {result.stdout.strip()}")
            return True
        else:
            print_error("pip não encontrado")
            return False
    except:
        print_error("Erro ao verificar pip")
        return False

def create_venv():
    """Cria ambiente virtual"""
    print_step("Criando ambiente virtual...")
    venv_path = Path("venv")
    
    if venv_path.exists():
        print("⚠️  Ambiente virtual já existe. Pulando criação.")
        return True
    
    try:
        subprocess.run([sys.executable, "-m", "venv", "venv"], check=True)
        print_success("Ambiente virtual criado com sucesso")
        return True
    except:
        print_error("Falha ao criar ambiente virtual")
        return False

def install_requirements():
    """Instala dependências do requirements.txt"""
    print_step("Instalando dependências...")
    
    # Determina o executável do pip no ambiente virtual
    if sys.platform == "win32":
        pip_executable = Path("venv/Scripts/pip.exe")
    else:
        pip_executable = Path("venv/bin/pip")
    
    try:
        subprocess.run([str(pip_executable), "install", "--upgrade", "pip"], 
                      check=True, capture_output=True)
        print_success("pip atualizado")
        
        subprocess.run([str(pip_executable), "install", "-r", "requirements.txt"], 
                      check=True)
        print_success("Todas as dependências instaladas")
        return True
    except subprocess.CalledProcessError as e:
        print_error(f"Falha ao instalar dependências: {e}")
        return False

def create_env_file():
    """Cria arquivo .env se não existir"""
    print_step("Configurando variáveis de ambiente...")
    
    env_file = Path(".env")
    env_example = Path(".env.example")
    
    if env_file.exists():
        print("⚠️  Arquivo .env já existe. Pulando criação.")
        return True
    
    if env_example.exists():
        try:
            with open(env_example, 'r') as src:
                content = src.read()
            with open(env_file, 'w') as dst:
                dst.write(content)
            print_success("Arquivo .env criado a partir do .env.example")
            return True
        except:
            print_error("Falha ao criar .env")
            return False
    else:
        print("⚠️  .env.example não encontrado. Criando .env básico...")
        try:
            with open(env_file, 'w') as f:
                f.write("API_URL=http://localhost:8000/api\n")
                f.write("DATABASE_URL=postgresql://localhost:5432/prescrimed\n")
            print_success("Arquivo .env criado")
            return True
        except:
            print_error("Falha ao criar .env")
            return False

def print_instructions():
    """Imprime instruções finais"""
    print_header("🎉 Instalação Concluída!")
    
    print("Para executar o dashboard:\n")
    
    if sys.platform == "win32":
        print("  1. Ativar ambiente virtual:")
        print("     .\\venv\\Scripts\\activate\n")
    else:
        print("  1. Ativar ambiente virtual:")
        print("     source venv/bin/activate\n")
    
    print("  2. Executar Streamlit:")
    print("     streamlit run app.py\n")
    
    print("Ou use os scripts npm da raiz do projeto:")
    print("  npm run streamlit\n")
    
    print("O dashboard estará disponível em:")
    print("  🌐 http://localhost:8501\n")

def main():
    """Função principal"""
    print_header("🚀 Setup do Streamlit App - Prescrimed")
    
    # Verificações
    if not check_python():
        print("\nPor favor, instale Python 3.8+ e tente novamente.")
        print("Download: https://www.python.org/downloads/")
        sys.exit(1)
    
    if not check_pip():
        print("\nPor favor, instale pip e tente novamente.")
        sys.exit(1)
    
    # Setup
    steps = [
        ("Criar ambiente virtual", create_venv),
        ("Instalar dependências", install_requirements),
        ("Configurar variáveis de ambiente", create_env_file)
    ]
    
    for step_name, step_func in steps:
        if not step_func():
            print(f"\n❌ Falha no passo: {step_name}")
            sys.exit(1)
    
    # Sucesso
    print_instructions()

if __name__ == "__main__":
    main()
