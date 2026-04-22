# HostGator Node App Manager - Checklist

## Antes de abrir o painel

Tenha em mãos:

- o conteúdo de [.env.hostgator.production.local](.env.hostgator.production.local)
- a URL do PostgreSQL
- os secrets JWT

Se ainda não gerou os secrets, rode:

```sh
npm run hostgator:secrets
```

Se quiser preparar tudo de uma vez e revisar o .env antes de publicar, rode:

```sh
npm run hostgator:prepare
```

Esse comando agora:

- valida o arquivo .env.hostgator.production.local
- bloqueia placeholders perigosos antes do deploy
- gera hostgator-artifacts/node-app-manager.env.txt para copiar no painel
- gera hostgator-artifacts/frontend-hostgator.env.txt com as variaveis finais do build HostGator
- sincroniza client/.env.hostgator.local para o Template sair com as URLs definitivas
- regenera o pacote Template pronto para upload

## Criar a aplicação Node.js

No Node App Manager da HostGator, preencha assim:

- Node.js version: 20.x ou superior
- Application mode: Production
- Application root: pasta raiz do projeto prescrimed-main
- Application URL: domínio principal da aplicação
- Application startup file: server.js

Observacao importante (frontend estatico vs API):

- Se voce vai enviar o `Template/` para `public_html`, o Apache vai servir o SPA.
- Nesse caso, as rotas `/api/*` precisam continuar chegando no Node (Node App Manager / proxy / subdominio).
- O `Template/.htaccess` gerado ja evita reescrever `/api` e `/health` para `index.html`, mas o roteamento do HostGator ainda precisa estar correto.
- Se a API ficar em outro dominio/subdominio, ajuste `VITE_API_URL` (ex.: `https://backend.seu-dominio.com/api`) antes de rodar `npm run build:template`.

Se houver campo de variáveis por chave/valor, cadastre uma por linha.

## Variáveis obrigatórias

Cadastre exatamente estas:

- `NODE_ENV=production`
- `TZ=America/Sao_Paulo`
- `PORT=3000`
- `DATABASE_URL=postgresql://USUARIO:SENHA@HOST:5432/NOME_DO_BANCO?sslmode=require`
- `JWT_SECRET=valor-gerado-no-script`
- `JWT_REFRESH_SECRET=valor-gerado-no-script`
- `SESSION_TIMEOUT=8h`
- `FRONTEND_URL=https://prescrimed.com.br`
- `URL_FRONTEND=https://prescrimed.com.br`
- `CORS_ORIGIN=https://prescrimed.com.br`
- `ALLOWED_ORIGINS=https://prescrimed.com.br,https://www.prescrimed.com.br`
- `PUBLIC_BASE_URL=https://prescrimed.com.br`

## Variáveis do bootstrap inicial

Cadastre também:

- `HOSTGATOR_EMPRESA_NOME=Prescrimed`
- `HOSTGATOR_EMPRESA_TIPO=casa-repouso`
- `HOSTGATOR_EMPRESA_CNPJ=00000000000191`
- `HOSTGATOR_EMPRESA_EMAIL=contato@prescrimed.com.br`
- `HOSTGATOR_ADMIN_NOME=Administrador Prescrimed`
- `HOSTGATOR_ADMIN_EMAIL=prescrimed@prescrimed.com.br`
- `HOSTGATOR_ADMIN_PASSWORD=@2028Pres`

## Variáveis opcionais úteis

Se quiser garantir superadmin:

- `SUPERADMIN_EMAIL=prescrimed@prescrimed.com.br`
- `SUPERADMIN_PASSWORD=@2028Pres`
- `SUPERADMIN_NOME=Super Admin Prescrimed`

Se usar email:

- SMTP_HOST=...
- SMTP_PORT=587
- SMTP_SECURE=false
- SMTP_USER=...
- SMTP_PASS=...
- SMTP_FROM=Prescrimed <no-reply@prescrimed.com.br>

## Comandos no terminal da aplicação

Depois de salvar a app:

```sh
npm install
npm run hostgator:prepare
npm run seed:hostgator
```

Modo A (mesmo dominio - recomendado):

```sh
npm run build:client
```

Nesse modo, o backend serve o frontend via `client/dist` e o browser usa `/api` na mesma origem.

Use também os artefatos locais gerados:

- hostgator-artifacts/node-app-manager.env.txt
- hostgator-artifacts/frontend-hostgator.env.txt
- hostgator-artifacts/deploy-summary.txt

Se quiser criar ou atualizar o superadmin explicitamente:

```sh
npm run create:superadmin
```

## Verificações imediatas

Abra no navegador:

- <https://prescrimed.com.br/health>
- <https://prescrimed.com.br/>

Depois teste o login:

- `email: prescrimed@prescrimed.com.br`
- `senha: @2028Pres`

## Se a aplicação não subir

Confira nesta ordem:

- Node 20+ selecionado
- startup file = server.js
- DATABASE_URL correta
- build gerado em client/dist
- Template atualizado em Template/
- app reiniciada depois de salvar variáveis
- logs do Node App Manager sem erro de conexão com banco
