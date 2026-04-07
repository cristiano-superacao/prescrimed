# Deploy externo - Prescrimed (PostgreSQL)

> Nota: este projeto foi consolidado em PostgreSQL. Instruções antigas de MySQL devem ser tratadas como legado.

## 1. Banco de Dados PostgreSQL
- Crie um banco PostgreSQL no provedor escolhido.
- Anote host, porta, usuário, senha e nome do banco.

## 2. Variáveis de Ambiente
- Copie `.env.locaweb.example` para `.env` e preencha com seus dados.
- Defina `DATABASE_URL` no formato PostgreSQL.

## 3. Instale dependências
```sh
npm ci
```

## 4. Gere as tabelas
- O Sequelize cria as tabelas automaticamente no primeiro start quando o banco estiver acessível.
- Em produção, prefira iniciar com a configuração final já apontando para o banco correto.

## 5. Start do servidor
```sh
NODE_ENV=production node server.js
```

## 6. Rotas e layout
- Todas as rotas e o layout frontend permanecem iguais.
- O layout responsivo e profissional do frontend não é alterado por essa configuração.

## 7. Observações
- O backend atual usa PostgreSQL como caminho suportado.
- Para customizações, mantenha compatibilidade com Express, Sequelize e o modelo multi-tenant.

---

## Dúvidas?
- Consulte a documentação dos models em `/models` e as rotas em `/routes`.
- Para ambientes externos, replique a mesma estrutura usada no Railway: `DATABASE_URL`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `ALLOWED_ORIGINS` e `PUBLIC_BASE_URL`.
