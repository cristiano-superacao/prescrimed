-- Hardening do schema public no Supabase para tabelas gerenciadas pelo Sequelize.
-- O frontend deste projeto consome a API Node/Express; estas tabelas nao devem
-- ficar acessiveis diretamente por anon/authenticated no PostgREST.

begin;

do $$
begin
  if exists (select 1 from pg_roles where rolname = 'anon')
     and exists (select 1 from pg_roles where rolname = 'authenticated') then
    execute 'revoke all on all tables in schema public from anon, authenticated';
    execute 'revoke all on all sequences in schema public from anon, authenticated';
    execute 'revoke all on all routines in schema public from anon, authenticated';
  end if;
end
$$;

do $$
declare
  app_table text;
  app_tables text[] := array[
    'empresas',
    'usuarios',
    'pacientes',
    'prescricoes',
    'agendamentos',
    'cr_leitos',
    'petshop_pets',
    'fisio_sessoes',
    'EstoqueItens',
    'EstoqueMovimentacoes',
    'FinanceiroTransacoes',
    'RegistrosEnfermagem',
    'empresa_sequencias',
    'catalogo_itens',
    'pedidos',
    'pedido_itens',
    'pagamentos',
    'notas_fiscais',
    'nota_fiscal_logs'
  ];
begin
  foreach app_table in array app_tables loop
    if exists (
      select 1
      from information_schema.tables
      where table_schema = 'public'
        and table_name = app_table
    ) then
      execute format('alter table public.%I enable row level security', app_table);
    end if;
  end loop;
end
$$;

commit;