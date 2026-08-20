-- seed.sql
-- Dados de exemplo (opcional). Importe pelo phpMyAdmin DEPOIS do schema.sql,
-- com a base de dados "barbearia_odin" já selecionada, se quiser ver o site
-- a funcionar com serviços e agendamentos fictícios.

SET NAMES utf8mb4;

USE barbearia_odin;

INSERT INTO clientes (nome, email, telefone, data_nascimento, data_cadastro, observacoes) VALUES
('Ricardo Almeida', 'ricardo.almeida@email.pt', '+351 912 345 678', '1990-04-12', '2025-01-10', 'Alérgico a certos produtos'),
('Miguel Santos', 'miguel.santos@email.pt', '+351 923 456 789', '1985-11-02', '2025-03-22', NULL);

INSERT INTO servicos (nome, categoria, descricao, preco, duracao_min) VALUES
('Corte clássico', 'Corte', 'Tesoura e máquina, acabamento na navalha.', 15.00, 40),
('Barba na navalha', 'Barba', 'Toalha quente, óleo pré-barba e acabamento no fio da navalha.', 12.00, 30),
('Combo completo', 'Combo', 'Corte + barba + sobrancelha.', 24.00, 60),
('Corte infantil', 'Corte', 'Corte para os pequenos clientes.', 10.00, 30),
('Gel modelador', 'Produto', 'Venda de gel de fixação para o cabelo.', 8.00, 0),
('Óleo para barba', 'Produto', 'Venda de óleo hidratante para barba.', 10.00, 0);

INSERT INTO agendamentos (id_cliente, id_servico, barbeiro, data, hora, status, observacoes) VALUES
(
  (SELECT id_cliente FROM clientes WHERE email = 'ricardo.almeida@email.pt'),
  (SELECT id_servico FROM servicos WHERE nome = 'Combo completo'),
  'Bjorn', '2026-07-15', '10:30', 'Confirmado', 'Cliente habitual'
),
(
  (SELECT id_cliente FROM clientes WHERE email = 'miguel.santos@email.pt'),
  (SELECT id_servico FROM servicos WHERE nome = 'Corte clássico'),
  'Odin', '2026-07-15', '14:00', 'Pendente', NULL
);

-- Administrador padrão para testar o painel em /admin
-- login: admin@barbeariaodin.pt   palavra-passe: admin123
-- (troque esta palavra-passe depois de importar, criando outro admin e apagando este)
INSERT INTO admins (nome, email, senha_hash) VALUES
('Administrador', 'admin@barbeariaodin.pt', '$2y$12$CUW5sULu.PkwM5xTjh/XheHKTJEG9BUipCfIt0w.gWy3COrwB9r3W');
