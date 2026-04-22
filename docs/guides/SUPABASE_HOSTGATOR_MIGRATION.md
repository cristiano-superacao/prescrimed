# Supabase + HostGator

## Diagnóstico do sistema

O sistema já é compatível com Supabase porque usa:

- Sequelize
- PostgreSQL
- autenticação própria com JWT
- frontend desacoplado da origem do banco

Isso significa que a migração para Supabase é de infraestrutura, não de models nem de rotas.

## O que usar no Supabase

Use o Supabase como Postgres gerenciado.

Você não precisa migrar para Supabase Auth nem reescrever o backend para usar client SDK do Supabase.

## URL recomendada

Prefira a connection string do pooler para produção em hospedagem compartilhada:

```env
DATABASE_URL=postgresql://postgres.PROJECT_REF:SENHA@aws-0-REGION.pooler.supabase.com:5432/postgres?sslmode=require
```

## Fluxo recomendado de migração

1. Criar o projeto no Supabase.
2. Obter a connection string do Postgres.
3. Configurar a URL no HostGator usando [.env.supabase.hostgator.example](.env.supabase.hostgator.example).
4. Validar a conexão com `npm run supabase:check`.
5. Se houver dados existentes, migrar com `npm run supabase:migrate`.
6. Subir a aplicação Node no HostGator.
7. Rodar `npm run seed:hostgator` para bootstrap inicial quando necessário.
8. Validar `https://prescrimed.com.br/health`.

## Dados existentes

Se você já tem dados no banco anterior, use uma destas opções:

- usar `SOURCE_DATABASE_URL="postgresql://origem..."` e `TARGET_DATABASE_URL="postgresql://supabase..."` com `npm run supabase:migrate`
- usar os scripts JSON legados e importar no Postgres com `IMPORT_JSON_ON_START=true`

## Verificações importantes

- SSL ativo na URL (`sslmode=require`)
- CORS apontando para `https://prescrimed.com.br`
- Node 20+ no HostGator
- `server.js` como startup file

## Scripts úteis

- `npm run supabase:check`
- `npm run postgres:export`
- `npm run supabase:import`
- `npm run supabase:migrate`
- `npm run hostgator:prepare`
- `npm run seed:hostgator`
- `npm run create:superadmin`
