# Planejamento de Testes com Seed (9 empresas) — 27 jan 2026

Este documento estrutura um seed completo para validação integral do sistema (APIs, rotas, regras de negócio, tabelas e multi-tenant).

## Nota importante sobre “dados reais”

Para evitar uso de dados pessoais reais (CPF/CNPJ, nomes e contatos), o seed utiliza **dados sintéticos** com **CPF/CNPJ válidos** (dígitos verificadores corretos), porém **não pertencentes a pessoas reais**.

Isso mantém o teste fiel às validações e ao comportamento do sistema, sem risco de privacidade.

---

## 1) Criação de Empresas (9)

O seed cria **9 empresas**, distribuídas em:

- 3x Casa de Repouso
- 3x PetShop
- 3x Fisioterapia

Identificadores (slug de teste):

- Casa: `casa_01`, `casa_02`, `casa_03`
- Pet: `pet_01`, `pet_02`, `pet_03`
- Fisio: `fisio_01`, `fisio_02`, `fisio_03`

Observação: o campo `empresa.codigo` do sistema segue o padrão já implementado (ex.: `Casa_01`, `Pet_01`, `Fisio_01`). Para garantir começar em `_01`, execute em banco limpo ou rode o seed com limpeza (`FORCE_PURGE=true`).

---

## 2) Criação de Funcionários (por empresa)

O seed cria usuários por empresa conforme as regras do sistema em `routes/paciente.routes.js`:

- Casa de Repouso e PetShop:
  - `admin`, `enfermeiro`, `assistente_social`, `medico`
- Fisioterapia:
  - `admin`, `enfermeiro`, `assistente_social`, `medico`, `fisioterapeuta`

Credenciais:

- Emails seguem padrão: `<role>.<slug>@test.prescrimed.local`
- Senha padrão: definida por `SEED_TEST_PASSWORD` (default: `Teste@2026`)

---

## 3) Cadastro de Residentes / Clientes

Para cada empresa são cadastrados **5 pacientes**, com:

- CPF válido
- Dados completos e consistentes
- Vínculo exclusivo com a empresa

O isolamento multi-tenant é validado no runner.

---

## 4) Execução das Funcionalidades (mínimo 5x por paciente)

O seed cria, para **cada paciente**, 5 execuções de:

- Agendamentos
- Evoluções/Enfermagem (`RegistroEnfermagem` tipo `evolucao`) — prioridade
- Prescrições

O runner também valida:

- PUT em evoluções retorna `405` com `code: history_immutable`
- DELETE em evoluções:
  - admin -> `403` (`code: access_denied`)
  - superadmin (com `x-empresa-id`) -> sucesso

---

## 5) Persistência e Migração

1) Valide tudo localmente no banco atual (PostgreSQL local recomendado).
2) Migre para o Railway conforme scripts existentes do projeto.

Recomendado:

- Revisar `npm run check:railway`
- Usar `npm run db:migrate:railway` (PowerShell) quando aplicável

---

## Como executar

### Seed (cria/atualiza)

```bash
# (opcional) limpar seed anterior do plano de testes
set FORCE_PURGE=true

# (opcional) senha padrão dos usuários
set SEED_TEST_PASSWORD=Teste@2026

npm run seed:testplan
```

### Runner (valida via API)

Pré-requisito: backend rodando em `http://localhost:8000`.

```bash
# Ajuste se necessário
set API_URL=http://localhost:8000/api

# Para o runner conseguir deletar como superadmin
set SUPERADMIN_EMAIL=superadmin@prescrimed.com
set SUPERADMIN_PASSWORD=admin123

npm run test:testplan
```

---

## Checklist de validação rápida

- `/api/diagnostic/db-check` retorna ok
- 9 empresas do plano criadas
- Cada empresa tem 5 pacientes
- Cada paciente tem 5 agendamentos + 5 evoluções + 5 prescrições
- Isolamento: token da empresa A não lista pacientes da empresa B
- Regras de evolução: PUT 405, DELETE admin 403, DELETE superadmin ok
