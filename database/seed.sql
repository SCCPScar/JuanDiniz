-- seed.sql
-- Dados de exemplo (opcional). Importe pelo phpMyAdmin DEPOIS do schema.sql,
-- com o banco "barbearia_odin" já selecionado, se quiser ver o site
-- funcionando com serviços e agendamentos de mentira.

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
