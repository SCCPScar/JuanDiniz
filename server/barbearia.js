// barbearia.js
// Rotas da API: clientes, serviços e agendamentos

const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const db = require('./database.js');
const { JWT_SECRET, COOKIE_NAME } = require('./config');

// ===== Middleware: exige usuário logado =====
function requireAuth(req, res, next) {
  const token = req.cookies[COOKIE_NAME];
  if (!token) return res.status(401).json({ erro: 'É preciso estar logado.' });

  try {
    req.usuario = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ erro: 'Sessão inválida. Faça login novamente.' });
  }
}

// Busca o cliente ligado a este usuário (pelo e-mail) ou cria um novo
async function obterOuCriarCliente(usuario) {
  const [clientes] = await db.query('SELECT * FROM clientes WHERE email = ?', [usuario.email]);
  if (clientes[0]) return clientes[0];

  const [resultado] = await db.query(
    `INSERT INTO clientes (nome, email, telefone, data_nascimento, data_cadastro, observacoes)
     VALUES (?, ?, NULL, NULL, NOW(), NULL)`,
    [usuario.nome, usuario.email]
  );

  const [novoCliente] = await db.query('SELECT * FROM clientes WHERE id_cliente = ?', [resultado.insertId]);
  return novoCliente[0];
}

// ===== SERVIÇOS =====

// Listar todos os serviços (rota pública, para popular o formulário)
router.get('/servicos', async (req, res, next) => {
  try {
    const [servicos] = await db.query('SELECT * FROM servicos');
    res.json(servicos);
  } catch (err) {
    next(err);
  }
});

// ===== AGENDAMENTOS =====

// Criar novo agendamento (exige login)
router.post('/agendamentos', requireAuth, async (req, res, next) => {
  try {
    const { id_servico, barbeiro, data, hora, observacoes } = req.body || {};

    if (!id_servico || !data || !hora) {
      return res.status(400).json({ erro: 'Campos obrigatórios: serviço, data e hora.' });
    }

    const [servicos] = await db.query('SELECT id_servico FROM servicos WHERE id_servico = ?', [id_servico]);
    if (!servicos[0]) {
      return res.status(400).json({ erro: 'Serviço inválido.' });
    }

    const barbeiroLimpo = barbeiro || null;

    if (barbeiroLimpo) {
      const [conflitos] = await db.query(
        `SELECT id_agendamento FROM agendamentos
         WHERE barbeiro = ? AND data = ? AND hora = ? AND status != 'Cancelado'`,
        [barbeiroLimpo, data, hora]
      );
      if (conflitos[0]) {
        return res.status(409).json({ erro: 'Esse barbeiro já tem um horário marcado nesse dia e hora.' });
      }
    }

    const cliente = await obterOuCriarCliente(req.usuario);

    const [resultado] = await db.query(
      `INSERT INTO agendamentos (id_cliente, id_servico, barbeiro, data, hora, status, observacoes)
       VALUES (?, ?, ?, ?, ?, 'Pendente', ?)`,
      [cliente.id_cliente, id_servico, barbeiroLimpo, data, hora, observacoes || null]
    );

    res.status(201).json({ id_agendamento: resultado.insertId, mensagem: 'Agendamento realizado com sucesso!' });
  } catch (err) {
    next(err);
  }
});

// Listar os agendamentos do usuário logado
router.get('/meus-agendamentos', requireAuth, async (req, res, next) => {
  try {
    const [clientes] = await db.query('SELECT id_cliente FROM clientes WHERE email = ?', [req.usuario.email]);
    const cliente = clientes[0];

    if (!cliente) return res.json([]);

    const [agendamentos] = await db.query(
      `SELECT
        agendamentos.id_agendamento,
        servicos.nome AS nome_servico,
        agendamentos.barbeiro,
        agendamentos.data,
        DATE_FORMAT(agendamentos.hora, '%H:%i') AS hora,
        agendamentos.status,
        agendamentos.observacoes
      FROM agendamentos
      JOIN servicos ON agendamentos.id_servico = servicos.id_servico
      WHERE agendamentos.id_cliente = ?
      ORDER BY agendamentos.data DESC, agendamentos.hora DESC`,
      [cliente.id_cliente]
    );

    res.json(agendamentos);
  } catch (err) {
    next(err);
  }
});

module.exports = router;