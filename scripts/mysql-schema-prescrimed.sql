-- Prescrimed - Script de criação de banco e tabelas MySQL
-- Gera usuário, banco, tabelas principais e constraints

-- 1. Banco e usuário
CREATE DATABASE IF NOT EXISTS prescrimed CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'prescrimed'@'%' IDENTIFIED BY 'c18042016Cs@23';
GRANT ALL PRIVILEGES ON prescrimed.* TO 'prescrimed'@'%';
FLUSH PRIVILEGES;
USE prescrimed;

-- 2. Tabela empresas
CREATE TABLE IF NOT EXISTS empresas (
  id CHAR(36) PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  tipoSistema ENUM('casa-repouso','fisioterapia','petshop') DEFAULT 'casa-repouso',
  cnpj VARCHAR(30) UNIQUE,
  email VARCHAR(255),
  telefone VARCHAR(50),
  endereco TEXT,
  plano ENUM('basico','profissional','empresa') DEFAULT 'basico',
  ativo BOOLEAN DEFAULT TRUE,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Tabela usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id CHAR(36) PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  role ENUM('superadmin','admin','nutricionista','atendente','enfermeiro','tecnico_enfermagem','fisioterapeuta','assistente_social','auxiliar_administrativo') DEFAULT 'atendente',
  cpf VARCHAR(20),
  contato VARCHAR(50),
  especialidade VARCHAR(100),
  crm VARCHAR(30),
  crmUf VARCHAR(5),
  permissoes JSON,
  empresaId CHAR(36),
  ativo BOOLEAN DEFAULT TRUE,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_usuario_empresa FOREIGN KEY (empresaId) REFERENCES empresas(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Tabela pacientes
CREATE TABLE IF NOT EXISTS pacientes (
  id CHAR(36) PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  cpf VARCHAR(20) UNIQUE,
  dataNascimento DATE,
  email VARCHAR(255),
  telefone VARCHAR(50),
  endereco TEXT,
  empresaId CHAR(36) NOT NULL,
  observacoes TEXT,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_paciente_empresa FOREIGN KEY (empresaId) REFERENCES empresas(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Tabela prescricoes
CREATE TABLE IF NOT EXISTS prescricoes (
  id CHAR(36) PRIMARY KEY,
  pacienteId CHAR(36) NOT NULL,
  nutricionistaId CHAR(36) NOT NULL,
  empresaId CHAR(36) NOT NULL,
  tipo ENUM('nutricional','medicamentosa','mista') DEFAULT 'nutricional',
  descricao TEXT,
  observacoes TEXT,
  itens JSON,
  status ENUM('ativa','finalizada','cancelada') DEFAULT 'ativa',
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_prescricao_paciente FOREIGN KEY (pacienteId) REFERENCES pacientes(id) ON DELETE CASCADE,
  CONSTRAINT fk_prescricao_empresa FOREIGN KEY (empresaId) REFERENCES empresas(id) ON DELETE CASCADE,
  CONSTRAINT fk_prescricao_nutricionista FOREIGN KEY (nutricionistaId) REFERENCES usuarios(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Tabela agendamentos
CREATE TABLE IF NOT EXISTS agendamentos (
  id CHAR(36) PRIMARY KEY,
  pacienteId CHAR(36) NOT NULL,
  empresaId CHAR(36) NOT NULL,
  usuarioId CHAR(36),
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT,
  dataHora DATETIME NOT NULL,
  duracao INT DEFAULT 60,
  tipo ENUM('consulta','retorno','avaliacao','procedimento','outro') DEFAULT 'consulta',
  status ENUM('agendado','confirmado','cancelado','concluido','falta') DEFAULT 'agendado',
  observacoes TEXT,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_agendamento_paciente FOREIGN KEY (pacienteId) REFERENCES pacientes(id) ON DELETE CASCADE,
  CONSTRAINT fk_agendamento_empresa FOREIGN KEY (empresaId) REFERENCES empresas(id) ON DELETE CASCADE,
  CONSTRAINT fk_agendamento_usuario FOREIGN KEY (usuarioId) REFERENCES usuarios(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Tabela registros de enfermagem
CREATE TABLE IF NOT EXISTS RegistrosEnfermagem (
  id CHAR(36) PRIMARY KEY,
  pacienteId CHAR(36) NOT NULL,
  usuarioId CHAR(36) NOT NULL,
  empresaId CHAR(36) NOT NULL,
  tipo ENUM('evolucao','sinais_vitais','administracao_medicamento','curativo','intercorrencia','admissao','alta','transferencia','outro') NOT NULL DEFAULT 'evolucao',
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT NOT NULL,
  sinaisVitais TEXT,
  riscoQueda ENUM('baixo','medio','alto'),
  riscoLesao ENUM('baixo','medio','alto'),
  estadoGeral ENUM('bom','regular','grave','critico') DEFAULT 'bom',
  alerta BOOLEAN DEFAULT FALSE,
  prioridade ENUM('baixa','media','alta','urgente') DEFAULT 'baixa',
  observacoes TEXT,
  anexos TEXT,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_enfermagem_paciente FOREIGN KEY (pacienteId) REFERENCES pacientes(id) ON DELETE CASCADE,
  CONSTRAINT fk_enfermagem_usuario FOREIGN KEY (usuarioId) REFERENCES usuarios(id) ON DELETE SET NULL,
  CONSTRAINT fk_enfermagem_empresa FOREIGN KEY (empresaId) REFERENCES empresas(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Adicione outras tabelas conforme necessário seguindo o mesmo padrão.
