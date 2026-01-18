<<<<<<< HEAD
# 🧪 Guia de Teste Local - Prescrimed

## ✅ Servidor está rodando!


O sistema normalmente ficará ativo em: **http://localhost:8000**

Se houver problema para acessar via `localhost` (comum em alguns ambientes Windows/proxy), use:



## 🤖 Teste Automatizado (recomendado)

Execute o smoke test local:

```bash
set TEST_BASE_URL=http://127.0.0.1:8000
node test-local.js
```


## 📝 Testes Manuais

### 1. Verificar Health Check
Abra no navegador:
```
http://localhost:8000/health
```

Deve retornar:
```json
{
  "status": "ok",
  "uptime": 123.45,
  "database": "connected",
  "timestamp": "2026-01-17..."
}
```

### 2. Acessar a Interface
```
http://localhost:8000
```

Você verá a tela de login do Prescrimed com layout responsivo e profissional.

### 3. Login com Usuário Seed
Use as credenciais criadas pelo seed:

**Super Admin:**

**Admin:**

**Nutricionista:**

### 4. Registrar Nova Empresa
Na tela de login, clique em "Criar conta" e preencha:

**Dados da Empresa:**

**Dados do Administrador:**

Clique em "Registrar". A empresa será criada e salva no banco SQLite local.

### 5. Verificar Dados no Banco
As empresas criadas ficam salvas em:
```
./database.sqlite
```

### 6. Testar Criação de Paciente
1. Após login, vá em "Pacientes" no menu lateral
2. Clique em "+ Novo Paciente"
3. Preencha os dados:
   - Nome: `João Silva`
   - CPF: `987.654.321-00`
   - Data de Nascimento: `01/01/1950`
   - Email: `joao@email.com`
   - Telefone: `(11) 88888-8888`
4. Clique em "Salvar"

Os dados são salvos automaticamente no banco local!

### 7. Testar Prescrição
1. Vá em "Prescrições" no menu
2. Clique em "+ Nova Prescrição"
3. Selecione um paciente
4. Adicione medicamentos/itens
5. Clique em "Salvar Prescrição"


## 🧪 Testes via API (Postman/Insomnia/curl)

### Health Check
```bash
curl http://localhost:8000/health
```

### Registrar Nova Empresa
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "tipoSistema": "casa-repouso",
    "nomeEmpresa": "Clínica API Teste",
    "cnpj": "99.888.777/0001-66",
    "email": "api@clinica.com",
    "senha": "Api@2026",
    "nomeAdmin": "Admin API",
    "cpf": "11122233344",
    "contato": "(11) 77777-7777"
  }'
```

### Login
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@clinica.com",
    "senha": "Api@2026"
  }'
```

Copie o `token` retornado para usar nas próximas requisições.

### Listar Empresas (requer autenticação)
```bash
curl http://localhost:8000/api/empresas \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

### Criar Empresa via API
```bash
curl -X POST http://localhost:8000/api/empresas \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "nome": "Nova Clínica",
    "tipoSistema": "fisioterapia",
    "cnpj": "11.222.333/0001-44",
    "email": "nova@clinica.com",
    "telefone": "(11) 66666-6666",
    "endereco": "Rua Nova, 123"
  }'
```


## 💾 Persistência de Dados

### Local (Desenvolvimento)

### Railway (Produção)


## 🎯 Validações Implementadas

### Rota POST /api/empresas

### Rota POST /api/auth/register


## 🚀 Próximos Passos

1. **Testar todas as funcionalidades via interface:**
   - Dashboard
   - Pacientes (criar, editar, visualizar)
   - Prescrições (medicamentosa, nutricional)
   - Agendamentos
   - Censo MP (leitos)
   - Estoque
   - Financeiro

2. **Deploy no Railway:**
   - Faça push para GitHub: `git push origin master`
   - Railway fará auto-deploy
   - Configure variáveis no Railway:
     - `DATABASE_URL` (copie do PostgreSQL)
     - `JWT_SECRET` e `JWT_REFRESH_SECRET`
     - `NODE_ENV=production`
     - `FORCE_SYNC=true` (apenas primeiro deploy)
     - `FAIL_FAST_DB=true` (garantir uso do Postgres)

3. **Validar no Railway:**
   - Acesse: `https://seu-servico.up.railway.app/health`
   - Teste login e criação de empresas
   - Confirme persistência no PostgreSQL


## 📊 Status Atual

✅ Servidor local rodando na porta 3000  
✅ SQLite configurado para desenvolvimento  
✅ Frontend servido em `/`  
✅ API funcionando em `/api/*`  
✅ Validações implementadas  
✅ Layout responsivo e profissional mantido  
✅ Dados persistem corretamente no banco local  

**Para visualizar o sistema, acesse:** http://localhost:3000

**O Simple Browser do VS Code está aberto e você pode interagir diretamente com o sistema!**
=======
# 🧪 Guia de Teste Local - Prescrimed

## ✅ Servidor está rodando!


O sistema normalmente ficará ativo em: **http://localhost:8000**

Se houver problema para acessar via `localhost` (comum em alguns ambientes Windows/proxy), use:

- `http://127.0.0.1:8000`

---

## 🤖 Teste Automatizado (recomendado)

Execute o smoke test local:

```bash
set TEST_BASE_URL=http://127.0.0.1:8000
node test-local.js
```

---

## 📝 Testes Manuais

### 1. Verificar Health Check
Abra no navegador:
```
http://localhost:8000/health
```

Deve retornar:
```json
{
  "status": "ok",
  "uptime": 123.45,
  "database": "connected",
  "timestamp": "2026-01-17..."
}
```

### 2. Acessar a Interface
```
http://localhost:8000
```

Você verá a tela de login do Prescrimed com layout responsivo e profissional.

### 3. Login com Usuário Seed
Use as credenciais criadas pelo seed:

**Super Admin:**
- Email: `superadmin+empresa-teste@prescrimed.com`
- Senha: `Prescri@2026`

**Admin:**
- Email: `admin+empresa-teste@prescrimed.com`
- Senha: `Prescri@2026`

**Nutricionista:**
- Email: `nutri+empresa-teste@prescrimed.com`
- Senha: `Prescri@2026`

### 4. Registrar Nova Empresa
Na tela de login, clique em "Criar conta" e preencha:

**Dados da Empresa:**
- Nome: `Clínica Teste Local`
- Tipo de Sistema: `Casa de Repouso` (ou Fisioterapia/Petshop)
- CNPJ: `12.345.678/0001-90`
- Email: `contato@clinicateste.com`
- Telefone: `(11) 99999-9999`

**Dados do Administrador:**
- Nome: `Admin Teste`
- Email: `admin@clinicateste.com`
- Senha: `Teste@2026`
- CPF: `123.456.789-00`

Clique em "Registrar". A empresa será criada e salva no banco SQLite local.

### 5. Verificar Dados no Banco
As empresas criadas ficam salvas em:
```
./database.sqlite
```

### 6. Testar Criação de Paciente
1. Após login, vá em "Pacientes" no menu lateral
2. Clique em "+ Novo Paciente"
3. Preencha os dados:
   - Nome: `João Silva`
   - CPF: `987.654.321-00`
   - Data de Nascimento: `01/01/1950`
   - Email: `joao@email.com`
   - Telefone: `(11) 88888-8888`
4. Clique em "Salvar"

Os dados são salvos automaticamente no banco local!

### 7. Testar Prescrição
1. Vá em "Prescrições" no menu
2. Clique em "+ Nova Prescrição"
3. Selecione um paciente
4. Adicione medicamentos/itens
5. Clique em "Salvar Prescrição"

---

## 🧪 Testes via API (Postman/Insomnia/curl)

### Health Check
```bash
curl http://localhost:8000/health
```

### Registrar Nova Empresa
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "tipoSistema": "casa-repouso",
    "nomeEmpresa": "Clínica API Teste",
    "cnpj": "99.888.777/0001-66",
    "email": "api@clinica.com",
    "senha": "Api@2026",
    "nomeAdmin": "Admin API",
    "cpf": "11122233344",
    "contato": "(11) 77777-7777"
  }'
```

### Login
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@clinica.com",
    "senha": "Api@2026"
  }'
```

Copie o `token` retornado para usar nas próximas requisições.

### Listar Empresas (requer autenticação)
```bash
curl http://localhost:8000/api/empresas \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

### Criar Empresa via API
```bash
curl -X POST http://localhost:8000/api/empresas \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "nome": "Nova Clínica",
    "tipoSistema": "fisioterapia",
    "cnpj": "11.222.333/0001-44",
    "email": "nova@clinica.com",
    "telefone": "(11) 66666-6666",
    "endereco": "Rua Nova, 123"
  }'
```

---

## 💾 Persistência de Dados

### Local (Desenvolvimento)
- **Banco:** SQLite
- **Arquivo:** `./database.sqlite`
- **Persistência:** ✅ Todos os dados são salvos e mantidos entre reinicializações

### Railway (Produção)
- **Banco:** PostgreSQL na nuvem
- **URL:** Configurada via `DATABASE_URL`
- **Persistência:** ✅ Dados permanentes no banco do Railway
- **Recomendação:** Configure `FAIL_FAST_DB=true` para garantir uso do PostgreSQL

---

## 🎯 Validações Implementadas

### Rota POST /api/empresas
- ✅ Nome obrigatório
- ✅ tipoSistema deve ser: casa-repouso, fisioterapia ou petshop
- ✅ CNPJ único (erro 409 se duplicado)
- ✅ Email válido (formato)
- ✅ Plano: basico, profissional ou empresa

### Rota POST /api/auth/register
- ✅ Email e senha obrigatórios
- ✅ Cria empresa + usuário admin simultaneamente
- ✅ Suporta CNPJ, contato, endereço
- ✅ Senha hasheada com bcrypt

---

## 🚀 Próximos Passos

1. **Testar todas as funcionalidades via interface:**
   - Dashboard
   - Pacientes (criar, editar, visualizar)
   - Prescrições (medicamentosa, nutricional)
   - Agendamentos
   - Censo MP (leitos)
   - Estoque
   - Financeiro

2. **Deploy no Railway:**
   - Faça push para GitHub: `git push origin master`
   - Railway fará auto-deploy
   - Configure variáveis no Railway:
     - `DATABASE_URL` (copie do PostgreSQL)
     - `JWT_SECRET` e `JWT_REFRESH_SECRET`
     - `NODE_ENV=production`
     - `FORCE_SYNC=true` (apenas primeiro deploy)
     - `FAIL_FAST_DB=true` (garantir uso do Postgres)

3. **Validar no Railway:**
   - Acesse: `https://seu-servico.up.railway.app/health`
   - Teste login e criação de empresas
   - Confirme persistência no PostgreSQL

---

## 📊 Status Atual

✅ Servidor local rodando na porta 3000  
✅ SQLite configurado para desenvolvimento  
✅ Frontend servido em `/`  
✅ API funcionando em `/api/*`  
✅ Validações implementadas  
✅ Layout responsivo e profissional mantido  
✅ Dados persistem corretamente no banco local  

**Para visualizar o sistema, acesse:** http://localhost:3000

**O Simple Browser do VS Code está aberto e você pode interagir diretamente com o sistema!**
>>>>>>> 9eb81865cc33511fa5c624f41c8e69ea8bf20e94
