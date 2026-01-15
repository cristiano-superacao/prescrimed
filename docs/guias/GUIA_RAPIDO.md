# 🚀 Guia Rápido de Inicialização

## ⚡ Iniciar o Sistema (3 métodos)

### Método 1: PowerShell (Recomendado) ⭐
```powershell
.\iniciar.ps1
```
**Vantagens:**
- ✅ Verifica e instala dependências automaticamente
- ✅ Feedback colorido e detalhado
- ✅ Mais robusto e moderno
- ✅ Não requer permissões especiais

### Método 2: Batch (CMD)
```cmd
iniciar.bat
```
**Vantagens:**
- ✅ Funciona em qualquer Windows
- ✅ Compatível com versões antigas
- ✅ Simples e direto

### Método 3: Manual (Para desenvolvedores)
```powershell
# Terminal 1 - Backend
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev

# Terminal 3 - MongoDB (opcional, para testes)
node start-mongo-memory.js
```

---

## 🛑 Parar o Sistema

### PowerShell
```powershell
.\parar.ps1
```

### Batch (CMD)
```cmd
parar.bat
```

### Manual
Feche as janelas dos terminais ou pressione `Ctrl+C` em cada uma.

---

## 🔧 Solução de Problemas

### Erro: "cannot be loaded because running scripts is disabled"

**Solução:** Permitir execução de scripts PowerShell

```powershell
# Execute como Administrador
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Depois execute novamente:
```powershell
.\iniciar.ps1
```

### Erro: "ENOENT: no such file or directory"

**Causa:** Comando executado no diretório errado

**Solução:** Navegue até a pasta do projeto
```powershell
cd "c:\Users\Superação\Desktop\Sistemas\prescrimed-system"
.\iniciar.ps1
```

### Erro: "Port 5000 is already in use"

**Causa:** Outro processo está usando a porta

**Solução:** Parar todos os processos Node.js
```powershell
.\parar.ps1
```
Depois inicie novamente:
```powershell
.\iniciar.ps1
```

### Erro: "npm install failed"

**Solução:** Limpar cache e reinstalar
```powershell
# Backend
npm cache clean --force
rm -r node_modules
npm install

# Frontend
cd client
npm cache clean --force
rm -r node_modules
npm install
cd ..
```

---

## 📋 Verificar Status

### Ver processos Node.js rodando
```powershell
Get-Process -Name node
```

### Ver portas em uso
```powershell
netstat -ano | findstr :5000
netstat -ano | findstr :5173
netstat -ano | findstr :27017
```

---

## 🎯 Primeiro Acesso

1. **Abra o navegador:** http://localhost:5173

2. **Clique em "Registrar"** (canto superior direito)

3. **Preencha os dados:**
   - Nome completo
   - Email
   - Senha
   - Nome da empresa/clínica
   - CNPJ (opcional)

4. **Você será o ADMINISTRADOR principal!**

5. **Comece a usar:**
   - Cadastre pacientes
   - Crie prescrições
   - Adicione mais usuários
   - Configure o sistema

---

## 🌐 URLs do Sistema

| Serviço | URL | Descrição |
|---------|-----|-----------|
| **Frontend** | http://localhost:5173 | Interface do usuário |
| **Backend API** | http://localhost:5000 | API REST |
| **API Docs** | http://localhost:5000/api-docs | Documentação Swagger |
| **Health Check** | http://localhost:5000/health | Status do servidor |

---

## 📦 MongoDB

### Modo Desenvolvimento (Padrão)
- Usa MongoDB em memória
- Dados são perdidos ao reiniciar
- Perfeito para testes

### Modo Produção (MongoDB Atlas)
1. Execute: `configurar.bat` ou `.\configurar.ps1`
2. Escolha opção **1** (Configurar MongoDB Atlas)
3. Siga o guia: `MONGODB_ATLAS_GUIA.md`

---

## 🔄 Comandos Úteis

### Reinstalar dependências
```powershell
# Backend
npm install

# Frontend
cd client
npm install
cd ..
```

### Atualizar dependências
```powershell
# Backend
npm update

# Frontend
cd client
npm update
cd ..
```

### Criar build de produção
```powershell
npm run build
```

### Deploy automático
```powershell
node deploy.js
```

---

## 📚 Documentação Adicional

- **README.md** - Visão geral completa
- **MONGODB_ATLAS_GUIA.md** - Configurar banco na nuvem
- **DEPLOY_FACIL.md** - Deploy simplificado
- **GUIA_DEPLOY_COMPLETO.md** - Deploy detalhado
- **DOCUMENTATION.md** - Documentação técnica
- **SISTEMA_COMPLETO.md** - Arquitetura do sistema

---

## ⚙️ Configurações Avançadas

### Mudar porta do backend
Edite `.env`:
```env
PORT=3000
```

### Configurar CORS
Edite `.env`:
```env
CORS_ORIGIN=http://localhost:3000,http://exemplo.com
```

### Modo de desenvolvimento
Edite `.env`:
```env
NODE_ENV=development
```

---

## 🆘 Suporte

Caso tenha problemas:

1. **Verifique os logs** nas janelas dos terminais
2. **Consulte a documentação** nos arquivos `.md`
3. **Limpe e reinstale** dependências
4. **Execute os scripts de parada** antes de reiniciar

---

**Desenvolvido com ❤️ para profissionais da saúde**
