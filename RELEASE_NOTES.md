# Prescrimed – Release 2026-01-24
---

# Prescrimed – Release 2026-01-26

## Backend
- RBAC no cadastro de Residentes conforme `Empresa.tipoSistema` (Casa de Repouso/PetShop vs Fisioterapia).
- Proteção de `routes/paciente.routes.js` com `authenticate` + `tenantIsolation` em todas as rotas.
- Inclusão do role `medico` no enum `usuarios.role` com garantia dinâmica no `server.js`.
 - RBAC estendido para edição e exclusão de Residentes (PUT/DELETE), com `403` e `code: access_denied` quando sem permissão.
 - Residentes: exclusão bloqueada (DELETE → 405 `operation_not_allowed`); adicionada rota `PUT /api/pacientes/:id/inativar` (somente `admin`).
 - Evoluções: edição bloqueada (PUT → 405 `history_immutable`); exclusão somente `superadmin` (caso contrário 403 `access_denied`).

## Frontend
- Utilitário `handleApiError` centralizado para mensagens amigáveis.
- Atualização das páginas principais para usar mensagens claras e traduzidas por código.
- Botão “Novo Residente” com desabilitação e tooltip quando o perfil não possui permissão.
 - Ações “Editar” e “Excluir” em Residentes agora respeitam RBAC (botões desabilitados + mensagem amigável quando acionados sem acesso).
 - Residentes: ação “Excluir” substituída por “Inativar” (somente `admin`), mantendo layout responsivo e profissional.
 - Evoluções: edição removida/bloqueada; exclusão desabilitada para não-superadmin, com tooltip descritiva.

## Documentação
- README atualizado com seção de Atualizações (26 jan 2026).
- Manual do Sistema revisado com regras por módulo e empresa.
- Documentação Técnica atualizada com detalhes de middleware, rotas e enum.

## Observações
- Layout responsivo e profissional mantido.
- Isolamento por empresa ativo; `superadmin` pode usar contexto via header `x-empresa-id`.


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
