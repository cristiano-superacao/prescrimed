# Migração de dados: Postgres local → Postgres Railway

Este guia copia **todos os dados** do seu Postgres local para o Postgres do Railway.

## Pré-requisitos

- PostgreSQL instalado no Windows (para ter `pg_dump.exe` e `pg_restore.exe`).
- Banco local já populado (por exemplo após `npm run seed:complete`).
- Ter a `DATABASE_URL` do Postgres do Railway (Settings → Variables → `DATABASE_URL`).

Observação: a `DATABASE_URL` precisa ser uma URL real (com host/porta numéricos). Se você estiver com algo como `...@HOST:PORTA/NOME_DB`, isso é apenas um template e indica que o Postgres ainda não está anexado/configurado no serviço.

## Passo a passo (recomendado)

1) Confirme que o local está OK:

- `npm run test:api:complete`

2) Migre para o Railway (sobrescreve o banco destino):

- `npm run db:migrate:railway`

O script vai pedir que você cole a `DATABASE_URL` do Railway e vai solicitar confirmação.

## Variáveis suportadas

- Origem (local):
  - usa `DATABASE_URL` (env) ou lê do arquivo `.env`.

- Destino (Railway):
  - você pode colar no prompt, ou definir antes:
    - `RAILWAY_DATABASE_URL`
    - ou `DATABASE_URL_RAILWAY`

## Validação rápida

Depois, valide tabelas/dados apontando temporariamente o script para o Railway:

- `set DATABASE_URL_OVERRIDE=postgresql://...` (PowerShell: `$env:DATABASE_URL_OVERRIDE = 'postgresql://...'`)
- `node scripts/check-railway-tables.js`

## Observações importantes

- O fluxo é **destrutivo no destino** (Railway): o restore usa `--clean --if-exists`.
- Se o Railway estiver usando URL interna (`railway.internal`) ela pode não ser acessível de fora. Para migrar do seu PC, use a URL pública (proxy `*.proxy.rlwy.net`).
- Se a URL do Railway não tiver `sslmode=...`, o script acrescenta `sslmode=require` automaticamente.
