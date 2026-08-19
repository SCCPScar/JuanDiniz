const db = require('./database.js');

async function main() {
  await db.iniciarBanco();

  // Evita duplicar dados se o script for rodado mais de uma vez
  const [[{ total }]] = await db.query('SELECT COUNT(*) AS total FROM clientes');
  if (total > 0) {
    console.log('Banco já tem dados — seed não executado. Limpe as tabelas no phpMyAdmin se quiser recriar do zero.');
    process.exit(0);
  }

  // Inserir clientes de exemplo
  const inserirCliente = async (nome, email, telefone, data_nascimento, data_cadastro, observacoes) => {
    const [resultado] = await db.query(
      `INSERT INTO clientes (nome, email, telefone, data_nascimento, data_cadastro, observacoes)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nome, email, telefone, data_nascimento, data_cadastro, observacoes]
    );
    return resultado.insertId;
  };

  const idRicardo = await inserirCliente('Ricardo Almeida', 'ricardo.almeida@email.pt', '+351 912 345 678', '1990-04-12', '2025-01-10', 'Alérgico a certos produtos');
  const idMiguel = await inserirCliente('Miguel Santos', 'miguel.santos@email.pt', '+351 923 456 789', '1985-11-02', '2025-03-22', null);

  // Inserir serviços de exemplo
  const inserirServico = async (nome, categoria, descricao, preco, duracao_min) => {
    const [resultado] = await db.query(
      `INSERT INTO servicos (nome, categoria, descricao, preco, duracao_min)
       VALUES (?, ?, ?, ?, ?)`,
      [nome, categoria, descricao, preco, duracao_min]
    );
    return resultado.insertId;
  };

  await inserirServico('Corte clássico', 'Corte', 'Tesoura e máquina, acabamento na navalha.', 15, 40);
  const idCombo = await inserirServico('Combo completo', 'Combo', 'Corte + barba + sobrancelha.', 24, 60);
  await inserirServico('Barba na navalha', 'Barba', 'Toalha quente, óleo pré-barba e acabamento no fio da navalha.', 12, 30);
  await inserirServico('Corte infantil', 'Corte', 'Corte para os pequenos clientes.', 10, 30);
  await inserirServico('Gel modelador', 'Produto', 'Venda de gel de fixação para o cabelo.', 8, 0);
  await inserirServico('Óleo para barba', 'Produto', 'Venda de óleo hidratante para barba.', 10, 0);

  // Reaproveita o primeiro serviço inserido acima ("Corte clássico") pelo select
  const [[{ id_servico: idCorteClassico }]] = await db.query(
    "SELECT id_servico FROM servicos WHERE nome = 'Corte clássico'"
  );

  // Inserir agendamentos de exemplo
  const inserirAgendamento = async (id_cliente, id_servico, barbeiro, data, hora, status, observacoes) => {
    await db.query(
      `INSERT INTO agendamentos (id_cliente, id_servico, barbeiro, data, hora, status, observacoes)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id_cliente, id_servico, barbeiro, data, hora, status, observacoes]
    );
  };

  await inserirAgendamento(idRicardo, idCombo, 'Bjorn', '2026-07-15', '10:30', 'Confirmado', 'Cliente habitual');
  await inserirAgendamento(idMiguel, idCorteClassico, 'Odin', '2026-07-15', '14:00', 'Pendente', null);

  console.log('Dados de exemplo inseridos com sucesso!');
  process.exit(0);
}

main().catch((err) => {
  console.error('Erro ao rodar o seed:', err);
  process.exit(1);
});
