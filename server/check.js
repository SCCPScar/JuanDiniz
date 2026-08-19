const db = require('./database.js');

async function main() {
  const [clientes] = await db.query('SELECT * FROM clientes');
  console.log('--- Clientes ---');
  console.log(clientes);

  const [servicos] = await db.query('SELECT * FROM servicos');
  console.log('--- Serviços ---');
  console.log(servicos);

  const [agendamentos] = await db.query('SELECT * FROM agendamentos');
  console.log('--- Agendamentos ---');
  console.log(agendamentos);

  process.exit(0);
}

main().catch((err) => {
  console.error('Erro ao consultar o banco:', err);
  process.exit(1);
});
