# 📚 Manual Completo do Sistema Prescrimed

## 🏥 Guia Passo a Passo de Todos os Módulos

---

## 📋 Índice

1. [Dashboard](#1-dashboard)
2. [Agenda](#2-agenda)
3. [Cronograma](#3-cronograma)
4. [Prescrições](#4-prescricoes)
5. [Censo M.P.](#5-censo-mp)
6. [Pacientes](#6-pacientes)
7. [Estoque](#7-estoque)
8. [Evolução](#8-evolucao)
9. [Financeiro](#9-financeiro)
10. [Usuários](#10-usuarios)
11. [Empresas](#11-empresas)
12. [Configurações](#12-configuracoes)

---

## 1. 🏠 Dashboard

### O que é?
Visão geral do sistema com métricas principais, gráficos e atalhos rápidos.

### Como usar:

#### Passo 1: Visualizar Métricas
- **Pacientes Ativos**: Total de residentes/pets atualmente cadastrados
- **Prescrições Ativas**: Medicamentos em uso
- **Agendamentos Hoje**: Compromissos do dia
- **Receita Mensal**: Faturamento do mês atual

#### Passo 2: Analisar Gráficos
- **Gráfico de Pacientes**: Evolução mensal de cadastros
- **Gráfico Financeiro**: Comparativo receitas vs despesas
- **Ocupação**: Taxa de ocupação do estabelecimento

#### Passo 3: Ações Rápidas
- Clique nos cards para acessar módulos específicos
- Use os botões de ação rápida:
  - ➕ Nova Prescrição
  - ➕ Novo Agendamento
  - ➕ Nova Evolução

### Permissões necessárias:
- ✅ Todos os usuários têm acesso

---

## 2. 📅 Agenda

### O que é?
Gerenciamento de agendamentos, consultas, visitas e compromissos.

### Como usar:

#### Passo 1: Visualizar Agenda
1. Acesse **Agenda** no menu lateral
2. Escolha a visualização:
   - **Dia**: Agenda detalhada do dia
   - **Semana**: Visão semanal
   - **Mês**: Calendário mensal

#### Passo 2: Criar Novo Agendamento
1. Clique em **+ Novo Agendamento**
2. Preencha os campos:
   - **Paciente**: Selecione da lista
   - **Tipo**: Consulta, Visita, Procedimento, Reunião
   - **Data e Hora**: Quando será
   - **Profissional**: Quem atenderá
   - **Observações**: Notas adicionais
3. Clique em **Salvar**

#### Passo 3: Editar/Cancelar
1. Clique no agendamento desejado
2. Escolha:
   - **✏️ Editar**: Modificar informações
   - **✅ Confirmar**: Marcar como confirmado
   - **❌ Cancelar**: Cancelar agendamento

#### Passo 4: Filtrar Agendamentos
- Use filtros por:
  - Paciente
  - Profissional
  - Tipo de agendamento
  - Status (Pendente, Confirmado, Realizado)

### Permissões necessárias:
- ✅ Admin, Médico, Enfermeiro

---

## 3. 📊 Cronograma

### O que é?
Planejamento e gestão de tarefas, atividades e rotinas.

### Como usar:

#### Passo 1: Criar Tarefa
1. Acesse **Cronograma**
2. Clique em **+ Nova Tarefa**
3. Preencha:
   - **Título**: Nome da tarefa
   - **Descrição**: Detalhes
   - **Prioridade**: Baixa, Média, Alta, Urgente
   - **Responsável**: Quem executará
   - **Prazo**: Data limite
   - **Recorrência**: Única, Diária, Semanal, Mensal
4. Clique em **Criar**

#### Passo 2: Acompanhar Tarefas
- **Pendentes**: Tarefas a fazer
- **Em Progresso**: Tarefas em execução
- **Concluídas**: Tarefas finalizadas
- **Atrasadas**: Tarefas vencidas

#### Passo 3: Marcar como Concluída
1. Clique na tarefa
2. Clique em **✓ Marcar como Concluída**
3. Adicione observações (opcional)

#### Passo 4: Configurar Rotinas
- Crie tarefas recorrentes para:
  - Administração de medicamentos
  - Higienização
  - Alimentação
  - Atividades recreativas

### Permissões necessárias:
- ✅ Admin, Enfermeiro, Médico

---

## 4. 💊 Prescrições

### O que é?
Gerenciamento completo de prescrições médicas e veterinárias.

### Como usar:

#### Passo 1: Criar Nova Prescrição
1. Acesse **Prescrições**
2. Clique em **+ Nova Prescrição**
3. Selecione o **Paciente/Pet**
4. Adicione medicamentos:
   - **Nome do Medicamento**
   - **Dosagem**: Ex: 500mg
   - **Via**: Oral, Injetável, Tópica, etc.
   - **Frequência**: Horários de administração
   - **Duração**: Quantos dias
   - **Observações**: Instruções especiais
5. Defina:
   - **Data Início**: Quando começa
   - **Data Fim**: Quando termina
   - **Prescritor**: Médico/Veterinário responsável
6. Clique em **Salvar Prescrição**

#### Passo 2: Consultar Prescrições
- **Ativas**: Em uso no momento
- **Finalizadas**: Tratamentos concluídos
- **Suspensas**: Prescrições interrompidas

#### Passo 3: Administrar Medicamento
1. Abra a prescrição ativa
2. Clique em **Registrar Administração**
3. Confirme horário e dosagem
4. Adicione observações se necessário
5. Salve o registro

#### Passo 4: Renovar Prescrição
1. Abra prescrição finalizada
2. Clique em **Renovar**
3. Ajuste datas e dosagens
4. Salve nova prescrição

### Permissões necessárias:
- ✅ Médico, Admin (criar/editar)
- ✅ Enfermeiro (visualizar/administrar)

---

## 5. 📋 Censo M.P.

### O que é?
Censo de Medicamentos Prescritos - Relatório consolidado de todos os medicamentos em uso.

### Como usar:

#### Passo 1: Gerar Censo
1. Acesse **Censo M.P.**
2. Selecione o período:
   - Hoje
   - Esta Semana
   - Este Mês
   - Personalizado
3. Clique em **Gerar Censo**

#### Passo 2: Analisar Dados
O censo mostra:
- **Medicamentos em Uso**: Lista completa
- **Quantidade por Medicamento**: Quantos pacientes usam
- **Horários de Administração**: Agenda de medicação
- **Estoque Necessário**: Previsão de consumo

#### Passo 3: Exportar Relatório
1. Clique em **📥 Exportar**
2. Escolha o formato:
   - PDF (para impressão)
   - Excel (para análise)
   - CSV (para sistemas externos)

#### Passo 4: Imprimir Mapa de Medicação
1. Clique em **🖨️ Imprimir Mapa**
2. Selecione:
   - Por paciente
   - Por horário
   - Por medicamento
3. Imprima para a equipe

### Permissões necessárias:
- ✅ Médico, Enfermeiro, Farmacêutico, Admin

---

## 6. 👥 Pacientes

### O que é?
Cadastro completo de residentes (casa de repouso) ou pets (petshop).

### Como usar:

#### Passo 1: Cadastrar Novo Paciente
1. Acesse **Pacientes**
2. Clique em **+ Novo Paciente**
3. Preencha **Dados Pessoais**:
   - **Nome Completo**
   - **Data de Nascimento**
   - **CPF** (casa de repouso) ou **Microchip** (pet)
   - **Gênero/Espécie**
   - **Foto** (opcional)

4. Preencha **Dados de Contato**:
   - **Telefone**
   - **E-mail**
   - **Endereço**

5. Preencha **Responsável** (obrigatório):
   - **Nome do Responsável**
   - **Parentesco/Relação**
   - **Telefone de Emergência**
   - **CPF**

6. Preencha **Dados Médicos**:
   - **Tipo Sanguíneo**
   - **Alergias**
   - **Doenças Crônicas**
   - **Medicamentos de Uso Contínuo**
   - **Restrições Alimentares**

7. Defina **Status**:
   - Ativo
   - Inativo
   - Alta
   - Falecido

8. Clique em **Salvar**

#### Passo 2: Visualizar Prontuário
1. Clique no paciente
2. Veja as abas:
   - **Dados Gerais**: Informações cadastrais
   - **Prescrições**: Medicamentos
   - **Evoluções**: Histórico clínico
   - **Agendamentos**: Consultas marcadas
   - **Documentos**: Arquivos anexados

#### Passo 3: Editar Paciente
1. Abra o paciente
2. Clique em **✏️ Editar**
3. Modifique os campos necessários
4. Clique em **Salvar Alterações**

#### Passo 4: Anexar Documentos
1. Abra o paciente
2. Vá para aba **Documentos**
3. Clique em **+ Anexar Documento**
4. Selecione:
   - Tipo: Exame, Laudo, Receita, Contrato, Outros
   - Arquivo: Escolha do computador
   - Descrição: Breve texto
5. Clique em **Upload**

### Permissões necessárias:
- ✅ Enfermeiro, Médico, Admin (criar/editar)
- ✅ Todos (visualizar)

---

## 7. 📦 Estoque

### O que é?
Controle de medicamentos, materiais médicos, alimentos e produtos.

### Como usar:

#### Passo 1: Cadastrar Produto
1. Acesse **Estoque**
2. Clique em **+ Novo Produto**
3. Preencha:
   - **Nome do Produto**
   - **Categoria**: Medicamento, Alimento, Material, Higiene
   - **Código/SKU**: Para controle interno
   - **Unidade**: Comprimido, Caixa, Kg, Litro
   - **Estoque Mínimo**: Alerta quando baixo
   - **Estoque Atual**: Quantidade disponível
   - **Localização**: Onde está armazenado
   - **Validade**: Data de vencimento
   - **Fornecedor**: Quem fornece
   - **Valor Unitário**: Preço
4. Clique em **Salvar**

#### Passo 2: Registrar Entrada
1. Clique no produto
2. Clique em **+ Entrada**
3. Preencha:
   - **Quantidade**
   - **Data da Entrada**
   - **Nota Fiscal**: Número (opcional)
   - **Lote**: Número do lote
   - **Validade**: Nova data de vencimento
   - **Valor Total**
   - **Observações**
4. Clique em **Registrar Entrada**

#### Passo 3: Registrar Saída
1. Clique no produto
2. Clique em **- Saída**
3. Preencha:
   - **Quantidade**
   - **Motivo**: Uso, Venda, Descarte, Perda
   - **Paciente**: Se aplicável
   - **Responsável**: Quem retirou
   - **Observações**
4. Clique em **Registrar Saída**

#### Passo 4: Alertas de Estoque
O sistema alerta automaticamente quando:
- ⚠️ **Estoque Baixo**: Abaixo do mínimo
- ⚠️ **Vencimento Próximo**: Produtos com validade < 30 dias
- 🚨 **Vencido**: Produtos expirados

#### Passo 5: Inventário
1. Clique em **📊 Inventário**
2. Escolha a categoria
3. Verifique fisicamente os produtos
4. Ajuste quantidades se necessário
5. Gere relatório de inventário

#### Passo 6: Relatórios
- **Movimentações**: Histórico de entradas/saídas
- **Produtos Críticos**: Estoque baixo
- **Validades**: Produtos a vencer
- **Valor Total**: Total em estoque

### Permissões necessárias:
- ✅ Farmacêutico, Admin (gerenciar)
- ✅ Enfermeiro (visualizar e registrar saídas)

---

## 8. 📈 Evolução

### O que é?
Registro de acompanhamento clínico e evolução dos pacientes.

### Como usar:

#### Passo 1: Criar Nova Evolução
1. Acesse **Evolução**
2. Selecione o **Paciente**
3. Clique em **+ Nova Evolução**
4. Preencha **Sinais Vitais**:
   - **Pressão Arterial**: Ex: 120/80 mmHg
   - **Frequência Cardíaca**: Ex: 72 bpm
   - **Temperatura**: Ex: 36.5°C
   - **Frequência Respiratória**: Ex: 16 irpm
   - **Peso**: Ex: 65 kg
   - **Glicemia**: Ex: 95 mg/dL (se aplicável)

5. Preencha **Observações Clínicas**:
   - Estado geral
   - Queixas
   - Alterações percebidas
   - Comportamento
   - Alimentação
   - Hidratação
   - Eliminações

6. Registre **Condutas**:
   - Ações realizadas
   - Medicamentos administrados
   - Procedimentos executados
   - Encaminhamentos

7. Defina:
   - **Data/Hora**: Quando foi avaliado
   - **Profissional**: Quem fez a evolução
   - **Tipo**: Médica, Enfermagem, Nutricional, Fisioterapêutica

8. Clique em **Salvar Evolução**

#### Passo 2: Consultar Histórico
1. Selecione o paciente
2. Visualize todas as evoluções
3. Use filtros:
   - Por período
   - Por profissional
   - Por tipo
4. Veja gráficos de evolução:
   - Peso ao longo do tempo
   - Pressão arterial
   - Glicemia

#### Passo 3: Imprimir Evolução
1. Selecione a evolução
2. Clique em **🖨️ Imprimir**
3. Escolha formato
4. Imprima ou salve em PDF

### Permissões necessárias:
- ✅ Médico, Enfermeiro (criar)
- ✅ Todos (visualizar)

---

## 9. 💰 Financeiro

### O que é?
Gestão completa de receitas, despesas e fluxo de caixa.

### Como usar:

#### Passo 1: Registrar Receita
1. Acesse **Financeiro**
2. Clique em **+ Nova Receita**
3. Preencha:
   - **Descrição**: Ex: Mensalidade Sr. João
   - **Valor**: R$ 3.500,00
   - **Categoria**: Mensalidade, Serviço, Produto
   - **Paciente**: Vincular ao paciente (opcional)
   - **Data**: Quando foi recebido
   - **Forma de Pagamento**: Dinheiro, PIX, Cartão, Boleto
   - **Status**: Recebido, Pendente, Atrasado
   - **Observações**
4. Anexe **Comprovante** (opcional)
5. Clique em **Salvar**

#### Passo 2: Registrar Despesa
1. Clique em **+ Nova Despesa**
2. Preencha:
   - **Descrição**: Ex: Compra de medicamentos
   - **Valor**: R$ 850,00
   - **Categoria**: Fornecedor, Salário, Aluguel, Utilities, Outros
   - **Fornecedor**: Nome do fornecedor
   - **Data**: Quando foi pago
   - **Forma de Pagamento**
   - **Status**: Pago, Pendente, Vencido
   - **Nota Fiscal**: Número
   - **Observações**
3. Anexe **Comprovante** (opcional)
4. Clique em **Salvar**

#### Passo 3: Contas a Receber/Pagar
- **Contas a Receber**:
  - Mensalidades pendentes
  - Serviços não pagos
  - Clique em **Dar Baixa** ao receber

- **Contas a Pagar**:
  - Fornecedores a pagar
  - Salários a pagar
  - Clique em **Dar Baixa** ao pagar

#### Passo 4: Relatórios Financeiros
1. Clique em **📊 Relatórios**
2. Escolha o tipo:
   - **Fluxo de Caixa**: Entradas vs Saídas
   - **DRE**: Demonstrativo de Resultados
   - **Por Categoria**: Receitas/Despesas por tipo
   - **Por Período**: Mensal, Trimestral, Anual
3. Analise gráficos e tabelas
4. Exporte em PDF ou Excel

#### Passo 5: Dashboard Financeiro
Visualize:
- 💰 **Receita do Mês**
- 💸 **Despesa do Mês**
- 📊 **Lucro/Prejuízo**
- 📈 **Gráfico de Evolução**
- ⚠️ **Contas Vencidas**

### Permissões necessárias:
- ✅ Admin (total)
- ✅ Auxiliar Administrativo (registrar)

---

## 10. 👤 Usuários

### O que é?
Gerenciamento de usuários do sistema e suas permissões.

### Como usar:

#### Passo 1: Criar Novo Usuário
1. Acesse **Usuários**
2. Clique em **+ Novo Usuário**
3. Preencha **Dados Pessoais**:
   - **Nome Completo**
   - **E-mail**: Usado para login
   - **CPF**
   - **Telefone**
   - **Foto** (opcional)

4. Defina **Credenciais**:
   - **Senha**: Mínimo 6 caracteres
   - **Confirmar Senha**

5. Escolha **Role/Função**:
   - **Superadmin**: Acesso total a tudo
   - **Admin**: Gerencia sua empresa
   - **Médico**: Prescrições e consultas
   - **Enfermeiro**: Cuidados e evoluções
   - **Farmacêutico**: Estoque e medicamentos
   - **Usuário**: Visualização básica

6. Selecione **Permissões**:
   - ☑️ Dashboard
   - ☑️ Agenda
   - ☑️ Prescrições
   - ☑️ Pacientes
   - ☑️ Estoque
   - ☑️ Financeiro
   - ☑️ Usuários
   - ☑️ Configurações

7. Defina **Status**:
   - Ativo (pode acessar)
   - Inativo (bloqueado)

8. Clique em **Criar Usuário**

#### Passo 2: Editar Usuário
1. Clique no usuário desejado
2. Clique em **✏️ Editar**
3. Modifique os campos
4. Clique em **Salvar Alterações**

#### Passo 3: Resetar Senha
1. Clique no usuário
2. Clique em **🔑 Resetar Senha**
3. Digite a nova senha
4. Confirme
5. Usuário receberá notificação

#### Passo 4: Desativar Usuário
1. Clique no usuário
2. Altere **Status** para **Inativo**
3. Usuário não poderá mais fazer login
4. Todos os dados são mantidos

#### Passo 5: Histórico de Acesso
1. Clique no usuário
2. Vá para aba **Histórico**
3. Visualize:
   - Último acesso
   - Ações realizadas
   - Módulos acessados

### Permissões necessárias:
- ✅ Admin (criar/editar usuários da empresa)
- ✅ Superadmin (criar/editar todos)

---

## 11. 🏢 Empresas

### O que é?
Gerenciamento de empresas cadastradas (apenas para Superadmin).

### Como usar:

#### Passo 1: Criar Nova Empresa
1. Acesse **Empresas** (menu Superadmin)
2. Clique em **+ Nova Empresa**
3. Preencha:
   - **Nome da Empresa**
   - **CNPJ**
   - **Tipo**: Casa de Repouso ou Petshop
   - **E-mail**
   - **Telefone**
   - **Endereço Completo**

4. Defina **Plano**:
   - Básico (5 usuários)
   - Premium (20 usuários)
   - Enterprise (ilimitado)

5. Configure **Módulos Ativos**:
   - Selecione quais módulos a empresa terá acesso

6. Crie **Administrador**:
   - Nome
   - E-mail
   - Senha inicial

7. Clique em **Criar Empresa**

#### Passo 2: Gerenciar Empresas
- **Ativar/Desativar**: Suspender acesso
- **Editar Dados**: Atualizar informações
- **Gerenciar Plano**: Upgrade/Downgrade
- **Ver Usuários**: Todos da empresa
- **Ver Estatísticas**: Uso do sistema

#### Passo 3: Relatório Consolidado
1. Clique em **📊 Relatório Geral**
2. Veja métricas de todas as empresas:
   - Total de usuários
   - Total de pacientes
   - Receita total
   - Empresas ativas/inativas

### Permissões necessárias:
- ✅ Apenas Superadmin

---

## 12. ⚙️ Configurações

### O que é?
Personalização do perfil e preferências do sistema.

### Como usar:

#### Passo 1: Editar Perfil
1. Acesse **Configurações**
2. Vá para **Meu Perfil**
3. Edite:
   - **Foto de Perfil**: Upload de imagem
   - **Nome**
   - **E-mail**
   - **Telefone**
   - **CPF**
4. Clique em **Salvar Alterações**

#### Passo 2: Alterar Senha
1. Vá para **Segurança**
2. Preencha:
   - **Senha Atual**
   - **Nova Senha**
   - **Confirmar Nova Senha**
3. Clique em **Alterar Senha**

#### Passo 3: Preferências do Sistema
1. Vá para **Preferências**
2. Configure:
   - **Tema**: Claro ou Escuro
   - **Idioma**: Português, Inglês, Espanhol
   - **Fuso Horário**
   - **Formato de Data**: DD/MM/YYYY ou MM/DD/YYYY
   - **Notificações**: E-mail, Push, SMS

#### Passo 4: Configurações da Empresa (Admin)
1. Vá para **Empresa**
2. Edite:
   - **Logo da Empresa**: Upload
   - **Dados Cadastrais**
   - **Endereço**
   - **Contatos**
   - **Informações Fiscais**

3. Configure **Integrações**:
   - Sistema de pagamento
   - E-mail (SMTP)
   - WhatsApp Business

4. Defina **Políticas**:
   - Backup automático
   - Retenção de dados
   - Privacidade

#### Passo 5: Notificações
1. Vá para **Notificações**
2. Ative/Desative alertas para:
   - Novos agendamentos
   - Prescrições vencendo
   - Estoque baixo
   - Contas a vencer
   - Novos usuários
   - Mensagens internas

### Permissões necessárias:
- ✅ Todos (próprio perfil)
- ✅ Admin (configurações da empresa)

---

## 🎓 Dicas de Boas Práticas

### 1. Segurança
- 🔒 Use senhas fortes (mínimo 8 caracteres)
- 🔒 Não compartilhe senhas
- 🔒 Faça logout ao sair
- 🔒 Altere senhas periodicamente

### 2. Dados
- 💾 Faça backup regular
- 💾 Mantenha dados atualizados
- 💾 Revise informações periodicamente
- 💾 Arquive documentos importantes

### 3. Organização
- 📋 Use categorias consistentes
- 📋 Padronize nomenclaturas
- 📋 Mantenha histórico organizado
- 📋 Documente procedimentos

### 4. Eficiência
- ⚡ Use atalhos do teclado
- ⚡ Configure notificações importantes
- ⚡ Automatize tarefas recorrentes
- ⚡ Revise relatórios semanalmente

---

## ❓ Perguntas Frequentes

### Como faço backup dos dados?
R: Apenas o administrador pode solicitar backup. Vá em Configurações > Empresa > Backup.

### Posso acessar de múltiplos dispositivos?
R: Sim! O sistema é responsivo e funciona em computador, tablet e celular.

### Como recupero minha senha?
R: Na tela de login, clique em "Esqueci minha senha" e siga as instruções.

### Há limite de usuários?
R: Depende do plano: Básico (5), Premium (20), Enterprise (ilimitado).

### Os dados são seguros?
R: Sim! Usamos criptografia, backups automáticos e servidores seguros.

### Posso personalizar o sistema?
R: Admins podem personalizar logo, cores e alguns campos personalizados.

---

## 📞 Suporte

### Precisa de ajuda?
- 📧 **E-mail**: suporte@prescrimed.com
- 📱 **WhatsApp**: (71) 99999-9999
- 💬 **Chat**: Disponível no sistema (canto inferior direito)
- 📚 **Base de Conhecimento**: docs.prescrimed.com

### Horário de Atendimento
- Segunda a Sexta: 8h às 18h
- Sábado: 9h às 13h
- Emergências: 24/7 (apenas para planos Premium e Enterprise)

---

<div align="center">

## 🎉 Sistema Prescrimed

**Gestão Profissional para Casas de Repouso e Petshops**

Desenvolvido com ❤️ por **Cristiano Santos**

[🌐 Site](https://prescrimed.netlify.app) | [📚 Docs](docs/) | [🐛 Suporte](mailto:cristiano.s.santos@ba.estudante.senai.br)

---

*Última atualização: Dezembro 2024 - v1.0.0*

</div>
