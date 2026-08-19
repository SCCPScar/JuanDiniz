-- schema.sql
-- Importe este arquivo pelo phpMyAdmin (aba "Importar") para criar o banco
-- "barbearia_odin" e todas as tabelas de uma vez, prontas para usar.

SET NAMES utf8mb4;

CREATE DATABASE IF NOT EXISTS barbearia_odin
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE barbearia_odin;

CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  senha_hash VARCHAR(255) NOT NULL,
  criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS clientes (
  id_cliente INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  email VARCHAR(190) UNIQUE,
  telefone VARCHAR(30),
  data_nascimento DATE NULL,
  data_cadastro DATETIME NULL,
  observacoes TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS servicos (
  id_servico INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  categoria ENUM('Corte', 'Barba', 'Combo', 'Produto') NOT NULL,
  descricao TEXT,
  preco DECIMAL(10,2) NOT NULL,
  duracao_min INT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS agendamentos (
  id_agendamento INT AUTO_INCREMENT PRIMARY KEY,
  id_cliente INT NOT NULL,
  id_servico INT NOT NULL,
  barbeiro VARCHAR(100),
  data DATE NOT NULL,
  hora TIME NOT NULL,
  status ENUM('Confirmado', 'Pendente', 'Cancelado', 'Concluído') NOT NULL DEFAULT 'Pendente',
  observacoes TEXT,
  FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente) ON DELETE CASCADE,
  FOREIGN KEY (id_servico) REFERENCES servicos(id_servico) ON DELETE RESTRICT,
  INDEX idx_agendamentos_data_hora (data, hora),
  INDEX idx_agendamentos_barbeiro_data_hora (barbeiro, data, hora)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Administradores da barbearia (login separado do login de clientes,
-- usado no painel /admin para ver e atualizar todos os agendamentos)
CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  senha_hash VARCHAR(255) NOT NULL,
  criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Mensagens enviadas pelo formulário de contato do site
CREATE TABLE IF NOT EXISTS mensagens_contato (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  email VARCHAR(190) NOT NULL,
  mensagem TEXT NOT NULL,
  enviado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
