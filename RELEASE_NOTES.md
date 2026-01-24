# Prescrimed – Release 2026-01-24

## Backend
- Removido bloqueio 405 por validação de método em /api (evita erro no login e preflight). Ver arquivo: server.js.
- Ajustado seed de Railway para autenticar via export padrão do Sequelize. Ver arquivo: scripts/seed-railway.ps1.
- Adicionado wrapper para rebuild de banco no Railway com prompt de DATABASE_URL e execução de seeds. Ver arquivo: scripts/rebuild-railway.ps1.

## Frontend
- Página Evolução atualizada para grid responsivo de duas colunas no desktop, mantendo layout mobile. Ver arquivo: client/src/pages/Evolucao.jsx.
- Monitor de backend continua informando estado e instruções para VITE_API_URL/VITE_BACKEND_ROOT.

## Deploy/DB
- Confirmado uso de host público ballast.proxy.rlwy.net (Public Connection String) no Railway com sslmode=require.
- Scripts prontos para rebuild + seeds e validação pós-deploy.

## Próximos passos
- Executar rebuild e seeds em produção com a DATABASE_URL pública.
- Rodar smoke test de login/navegação.
- Criar release/tag e (opcional) PR de acompanhamento.
