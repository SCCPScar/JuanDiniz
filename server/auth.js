// auth.js
// Rotas de cadastro, login, logout e verificação de sessão

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./database');
const { JWT_SECRET, COOKIE_NAME, TOKEN_EXPIRES_IN, COOKIE_MAX_AGE } = require('./config');

const router = express.Router();

// ---------- Rate limiting simples (sem dependência nova) ----------
// Bloqueia um IP por 15 min após 8 tentativas de login malsucedidas.
const tentativasLogin = new Map(); // ip -> { count, primeiraTentativa }
const JANELA_MS = 15 * 60 * 1000;
const LIMITE_TENTATIVAS = 8;

function limitarLogin(req, res, next) {
  const ip = req.ip;
  const agora = Date.now();
  const registro = tentativasLogin.get(ip);

  if (registro && agora - registro.primeiraTentativa < JANELA_MS) {
    if (registro.count >= LIMITE_TENTATIVAS) {
      return res.status(429).json({ erro: 'Muitas tentativas. Tente novamente em alguns minutos.' });
    }
  } else {
    tentativasLogin.set(ip, { count: 0, primeiraTentativa: agora });
  }

  next();
}

function registrarTentativaFalha(req) {
  const registro = tentativasLogin.get(req.ip);
  if (registro) registro.count += 1;
}

function limparTentativas(req) {
  tentativasLogin.delete(req.ip);
}

function criarToken(usuario) {
  return jwt.sign(
    { id: usuario.id, nome: usuario.nome, email: usuario.email },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRES_IN }
  );
}

function definirCookie(res, token) {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: COOKIE_MAX_AGE,
  });
}

function validarEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ---------- Cadastro ----------
router.post('/cadastro', async (req, res, next) => {
  try {
    const { nome, email, senha } = req.body || {};

    if (!nome || !email || !senha) {
      return res.status(400).json({ erro: 'Preencha nome, e-mail e senha.' });
    }
    if (!validarEmail(email)) {
      return res.status(400).json({ erro: 'E-mail inválido.' });
    }
    if (senha.length < 6) {
      return res.status(400).json({ erro: 'A senha precisa ter pelo menos 6 caracteres.' });
    }

    const emailNormalizado = String(email).trim().toLowerCase();

    const [existentes] = await db.query('SELECT id FROM usuarios WHERE email = ?', [emailNormalizado]);
    if (existentes.length > 0) {
      return res.status(409).json({ erro: 'Já existe uma conta com este e-mail.' });
    }

    const senhaHash = bcrypt.hashSync(senha, 10);
    const nomeLimpo = String(nome).trim();

    const [resultado] = await db.query(
      'INSERT INTO usuarios (nome, email, senha_hash) VALUES (?, ?, ?)',
      [nomeLimpo, emailNormalizado, senhaHash]
    );

    const usuario = {
      id: resultado.insertId,
      nome: nomeLimpo,
      email: emailNormalizado,
    };

    const token = criarToken(usuario);
    definirCookie(res, token);

    res.status(201).json({ usuario });
  } catch (err) {
    next(err);
  }
});

// ---------- Login ----------
router.post('/login', limitarLogin, async (req, res, next) => {
  try {
    const { email, senha } = req.body || {};

    if (!email || !senha) {
      return res.status(400).json({ erro: 'Preencha e-mail e senha.' });
    }

    const emailNormalizado = String(email).trim().toLowerCase();
    const [usuarios] = await db.query('SELECT * FROM usuarios WHERE email = ?', [emailNormalizado]);
    const usuario = usuarios[0];

    if (!usuario || !bcrypt.compareSync(senha, usuario.senha_hash)) {
      registrarTentativaFalha(req);
      return res.status(401).json({ erro: 'E-mail ou senha incorretos.' });
    }

    limparTentativas(req);
    const token = criarToken(usuario);
    definirCookie(res, token);

    res.json({ usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email } });
  } catch (err) {
    next(err);
  }
});

// ---------- Logout ----------
router.post('/logout', (req, res) => {
  res.clearCookie(COOKIE_NAME);
  res.json({ ok: true });
});

// ---------- Usuário atual (verifica sessão) ----------
router.get('/me', (req, res) => {
  const token = req.cookies[COOKIE_NAME];
  if (!token) return res.status(401).json({ usuario: null });

  try {
    const dados = jwt.verify(token, JWT_SECRET);
    res.json({ usuario: { id: dados.id, nome: dados.nome, email: dados.email } });
  } catch {
    res.status(401).json({ usuario: null });
  }
});

module.exports = router;
