# Deploy HostGator - Prescrimed

## Compatibilidade

Este projeto so roda 100% no HostGator se o plano oferecer:

- Node.js em execucao continua
- acesso a PostgreSQL local ou remoto
- configuracao de variaveis de ambiente no painel

Para este projeto, a opcao mais simples e estavel é usar o HostGator para a aplicacao Node.js e o Supabase como PostgreSQL gerenciado.

Se o plano for apenas hospedagem estatica, publique somente o frontend e mantenha a API em outro provedor.

## Arquivos prontos no projeto

- Ambiente de producao local: [.env.hostgator.production.local](.env.hostgator.production.local)
- Exemplo versionado: [.env.hostgator.production.example](.env.hostgator.production.example)
- Pacote estatico do frontend: [Template](Template)

## Passo 1 - Configurar o banco PostgreSQL

Crie ou identifique um banco PostgreSQL e anote:

- host
- porta
- nome do banco
- usuario
- senha

Monte a DATABASE_URL neste formato:

```env
DATABASE_URL=postgresql://USUARIO:SENHA@HOST:5432/NOME_DO_BANCO?sslmode=require
```

Se usar Supabase, consulte também [docs/guides/SUPABASE_HOSTGATOR_MIGRATION.md](docs/guides/SUPABASE_HOSTGATOR_MIGRATION.md).

## Passo 2 - Preencher o ambiente

Use o conteudo de [.env.hostgator.production.local](.env.hostgator.production.local) no painel do Node.js App do HostGator.

O mesmo arquivo agora tambem pode carregar as variaveis do frontend HostGator:

- `VITE_API_URL=/api`
- `VITE_BACKEND_ROOT=https://prescrimed.com.br`
- `VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co`
- `VITE_SUPABASE_ANON_KEY=sua-anon-key-publica`

Quando voce roda `npm run hostgator:prepare`, essas chaves sao convertidas automaticamente em `client/.env.hostgator.local` e passam a entrar no build final do `Template/`.

Campos obrigatorios:

- DATABASE_URL
- JWT_SECRET
- JWT_REFRESH_SECRET
- FRONTEND_URL
- ALLOWED_ORIGINS

Bootstrap inicial ja preenchido:

- `HOSTGATOR_ADMIN_EMAIL=prescrimed@prescrimed.com.br`
- `HOSTGATOR_ADMIN_PASSWORD=@2028Pres`

## Passo 3 - Publicar o backend Node.js

No painel do HostGator, crie a aplicacao Node.js com:

- Node.js 20 ou superior
- Application startup file: server.js
- Application root: pasta do projeto

Depois execute:

```sh
npm install
```

Ou use o preparo automatizado:

```sh
npm run hostgator:prepare
```

Esse preparo agora valida o arquivo .env.hostgator.production.local e gera:

- hostgator-artifacts/node-app-manager.env.txt
- hostgator-artifacts/frontend-hostgator.env.txt
- hostgator-artifacts/deploy-summary.txt
- client/.env.hostgator.local sincronizado para o build final do frontend
- Template atualizado para upload

Inicie a aplicacao e verifique o health check:

```sh
curl https://prescrimed.com.br/health
```

Se o host nao disponibilizar curl, abra a URL no navegador.

## Passo 4 - Criar tabelas e usuario inicial

Com a aplicacao apontando para o PostgreSQL correto, rode uma vez:

```sh
npm run seed:hostgator
```

Se tambem quiser garantir superadmin:

```sh
npm run create:superadmin
```

## Passo 5 - Publicar o frontend

Se o backend Node servir o frontend, gere o build principal:

```sh
npm run build:client
```

Se voce for publicar o frontend estatico no public_html, use o pacote [Template](Template) gerado por:

```sh
npm run build:template
```

Envie todo o conteudo da pasta [Template](Template) para o public_html.

Se o frontend tambem for usar o SDK do Supabase em producao, confirme antes do upload que `hostgator-artifacts/frontend-hostgator.env.txt` contem `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` preenchidos.

Se quiser um fluxo unico para backend + frontend, prefira:

```sh
npm run hostgator:prepare
```

## Passo 6 - Verificacoes finais

Teste estas rotas:

- <https://prescrimed.com.br/health>
- <https://prescrimed.com.br/api/auth/login>
- <https://prescrimed.com.br/>

Teste o login com:

- `usuario: prescrimed@prescrimed.com.br`
- `senha: @2028Pres`

## Problemas comuns

### CORS bloqueando

Confirme no painel que estas variaveis estao corretas:

- `FRONTEND_URL=https://prescrimed.com.br`
- `CORS_ORIGIN=https://prescrimed.com.br`
- `ALLOWED_ORIGINS=https://prescrimed.com.br,https://www.prescrimed.com.br`

### Banco indisponivel

Confirme:

- DATABASE_URL valida
- firewall/liberacao de IP do HostGator para o banco
- SSL habilitado no Postgres remoto quando exigido

### Frontend abre, mas a API nao responde

Confirme:

- a aplicacao Node esta iniciada
- server.js foi definido como startup file
- o dominio esta apontando para a app Node ou usando proxy corretamente

### Shared hosting sem Node.js

Nesse caso, o backend nao vai subir no HostGator. Use o HostGator apenas para o frontend e mantenha a API em outro ambiente compatível.
