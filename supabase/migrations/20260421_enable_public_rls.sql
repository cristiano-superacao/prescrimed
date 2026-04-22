begin;

revoke all on all tables in schema public from anon, authenticated;
revoke all on all sequences in schema public from anon, authenticated;
revoke all on all routines in schema public from anon, authenticated;

do $$
declare
  target_table text;
  target_tables text[] := array[
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
  foreach target_table in array target_tables loop
    if exists (
      select 1
      from information_schema.tables
      where table_schema = 'public'
        and table_name = target_table
    ) then
      execute format('alter table public.%I enable row level security', target_table);
    end if;
  end loop;
end
$$;

commit;-- Hardening do schema public no Supabase para tabelas gerenciadas pelo Sequelize.
-- O frontend deste projeto consome a API Node/Express; estas tabelas nao devem
-- ficar acessiveis diretamente por anon/authenticated no PostgREST.

begin;

revoke all on all tables in schema public from anon, authenticated;
revoke all on all sequences in schema public from anon, authenticated;
revoke all on all routines in schema public from anon, authenticated;

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