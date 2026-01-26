# Manual do Sistema Prescrimed

> Manual de uso (operacional) para equipes e administradores.
>
> Para documentação técnica (arquitetura, API e deploy), veja: [DOCUMENTATION.md](DOCUMENTATION.md).

---

## 1) Visão geral
O Prescrimed é um sistema **multi-empresa (multi-tenant)** para gestão de operações em:
- Casa de repouso
- Clínica de fisioterapia
- Petshop/veterinária

O sistema é dividido em módulos (menu lateral) e funciona em **layout responsivo** (mobile/tablet/desktop) com sidebar recolhível no celular.

---

## 2) Acesso ao sistema

### Login
- Acesse a tela de login e informe **email** e **senha**.
- Após login, o sistema identifica automaticamente sua **empresa** e seus acessos.

### Primeiro acesso (onboarding)
Existe um fluxo de cadastro que cria:
- uma **Empresa**
- um usuário **admin** para essa empresa

Esse fluxo é feito pela tela de **Registro** (rota `/register`).

### Acesso como Super Administrador
O perfil `superadmin` é usado para administração **multi-empresa** (multi-tenant) e libera o módulo **Empresas**.

Como criar/acessar um `superadmin`:
- Em ambientes de deploy, use o script `npm run create:superadmin` com `SUPERADMIN_EMAIL` e `SUPERADMIN_PASSWORD` definidos.
- Em ambientes locais com dados de demonstração/seed, o projeto pode criar um superadmin automaticamente conforme o script de seed configurado.

---

## 3) Perfis (funções) e regra de acesso
As funções do sistema são:
- `superadmin` (acessa todas as empresas)
- `admin`
- `nutricionista`
- `enfermeiro`
- `tecnico_enfermagem`
- `fisioterapeuta`
- `assistente_social`
- `auxiliar_administrativo`
- `atendente`

### Regra multi-tenant (importante)
- Usuários comuns **enxergam apenas dados da própria empresa**.
- O sistema força `empresaId` automaticamente nas operações.
- Apenas `superadmin` pode atuar em múltiplas empresas.

---

## 4) Fluxo recomendado de uso (passo a passo)

### Passo 1 — Cadastros básicos
1. (Admin) Cadastre/valide os **Usuários** da empresa.
2. Cadastre **Pacientes/Residentes**.

### Passo 2 — Rotina assistencial
1. Registre **Agendamentos** (consultas, visitas, procedimentos).
2. Crie e acompanhe **Prescrições**.
3. Registre **Evolução/Enfermagem** (sinais vitais, observações, riscos).

### Passo 3 — Operação e controle
1. Use **Estoque** para controlar entradas/saídas e alertas.
2. Use **Financeiro** para receitas/despesas e relatórios.

---

## 5) Módulos (o que cada tela faz)

### Dashboard
- Visão geral com indicadores e atalhos (depende do perfil).

### Pacientes (Residentes)
- Cadastro, busca e manutenção do prontuário.

### Prescrições
- Criação e acompanhamento (nutricional/mista, conforme configuração).

### Agenda
- Criação e acompanhamento de agendamentos.

### Evolução / Enfermagem
- Registro de evolução, sinais vitais e observações.

### Estoque
- Itens por tipo (ex.: medicamentos, alimentos)
- Movimentações (entrada/saída)
- Estatísticas e alertas (mínimo/validade)

### Financeiro
- Lançamentos de receitas/despesas
- Estatísticas
- Exportação (ex.: CSV/Excel e impressão/PDF, conforme tela)

### Usuários
- Gestão de usuários da empresa (admin/superadmin).

### Empresas
- Gestão de empresas (**somente `superadmin`**).
- Se você estiver logado como `admin`, é esperado que o menu **Empresas** não apareça.

### Manual (tela)
- Ajuda interativa dentro do próprio sistema.

---

## 6) Exportações e relatórios
Algumas telas possuem botões de exportação (por exemplo, Financeiro e Estoque), incluindo:
- Impressão/geração de PDF via navegador
- Exportação para CSV (Excel)

---

## 7) Problemas comuns (FAQ)

### “Token não fornecido” (401)
- Você precisa estar logado; faça login novamente.

### “Acesso negado” (403)
- Seu perfil não tem permissão para a ação.

### “Sistema em manutenção / DB indisponível” (503)
- O servidor está sem banco configurado ou o banco está indisponível.
- Em produção (Railway), verifique se o serviço backend está com `DATABASE_URL` configurado.

---

## 8) Links úteis
- Documentação técnica: [DOCUMENTATION.md](DOCUMENTATION.md)
- Migração local → Railway (Postgres): [MIGRACAO_RAILWAY_POSTGRES.md](MIGRACAO_RAILWAY_POSTGRES.md)
- Guia Railway (vários): [RAILWAY_DEPLOY.md](RAILWAY_DEPLOY.md)
