# Deploy Locaweb - Prescrimed (MySQL)

## 1. Banco de Dados MySQL
- Crie um banco de dados MySQL no painel da Locaweb.
- Anote host, usuário, senha, nome do banco.

## 2. Variáveis de Ambiente
- Copie `.env.locaweb.example` para `.env` e preencha com seus dados.

## 3. Instale dependências
```sh
npm ci
```

## 4. Gere as tabelas no MySQL
- O Sequelize pode criar as tabelas automaticamente no primeiro start.
- Se preferir, gere o SQL com:
```sh
npx sequelize-cli db:migrate
```
- Ou use o script de sync automático (já incluso no server.js).

## 5. Start do servidor
```sh
NODE_ENV=production node server.js
```

## 6. Rotas e layout
- Todas as rotas e layout frontend permanecem iguais.
- O backend detecta automaticamente se está usando MySQL, PostgreSQL ou SQLite.

## 7. Observações
- O layout responsivo e profissional do frontend não é alterado.
- O backend está pronto para rodar em ambiente Locaweb (MySQL).
- Se precisar de dump SQL para criar tabelas manualmente, rode o sistema localmente e exporte via MySQL Workbench ou `mysqldump`.

---

**Dúvidas?**
- Consulte a documentação dos models em `/models` e as rotas em `/routes`.
- Para customizações, mantenha a compatibilidade com Sequelize.
