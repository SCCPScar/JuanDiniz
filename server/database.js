// database.js
// Conexão com o MySQL (o mesmo banco de dados que aparece no phpMyAdmin).
//
// Fluxo recomendado: importe server/schema.sql pelo phpMyAdmin para criar o
// banco "barbearia_odin" e as tabelas — assim você já vê tudo pronto lá
// dentro. Mesmo assim, as tabelas também são criadas automaticamente aqui
// (CREATE TABLE IF NOT EXISTS) para o projeto funcionar mesmo que alguém
// esqueça de importar o schema.sql.

const mysql = require('mysql2/promise');
const {
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
} = require('./config');

const pool = mysql.createPool({
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  dateStrings: true, // datas/horas voltam como texto ("2026-07-15", "10:30"), igual ao front-end espera
  decimalNumbers: true, // preços (DECIMAL) voltam como number, não como string
});

async function iniciarBanco() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nome VARCHAR(150) NOT NULL,
      email VARCHAR(190) NOT NULL UNIQUE,
      senha_hash VARCHAR(255) NOT NULL,
      criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS clientes (
      id_cliente INT AUTO_INCREMENT PRIMARY KEY,
      nome VARCHAR(150) NOT NULL,
      email VARCHAR(190) UNIQUE,
      telefone VARCHAR(30),
      data_nascimento DATE NULL,
      data_cadastro DATETIME NULL,
      observacoes TEXT
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS servicos (
      id_servico INT AUTO_INCREMENT PRIMARY KEY,
      nome VARCHAR(150) NOT NULL,
      categoria ENUM('Corte', 'Barba', 'Combo', 'Produto') NOT NULL,
      descricao TEXT,
      preco DECIMAL(10,2) NOT NULL,
      duracao_min INT DEFAULT 0
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  await pool.query(`
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
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  console.log('Banco de dados MySQL conectado e tabelas prontas!');
}

module.exports = pool;
module.exports.iniciarBanco = iniciarBanco;
