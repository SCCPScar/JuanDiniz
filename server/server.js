// server.js
// Servidor principal: serve o site (front-end) e a API de cadastro/login

require('dotenv').config();

const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const db = require('./database');
const authRoutes = require('./auth');
const barbeariaRoutes = require('./barbearia');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());

// API de autenticação
app.use('/api/auth', authRoutes);
app.use('/api/barbearia', barbeariaRoutes);

// Rota de API desconhecida -> JSON 404 (em vez do HTML padrão do Express,
// que quebraria o resp.json() do front-end)
app.use('/api', (req, res) => {
  res.status(404).json({ erro: 'Rota de API não encontrada.' });
});

// Site estático (a pasta acima de /server, onde está o index.html)
const siteDir = path.join(__dirname, '..');
app.use(express.static(siteDir));

app.use((req, res, next) => {
  if (req.method !== 'GET') return next();
  res.sendFile(path.join(siteDir, 'index.html'));
});

// Handler de erro global -> garante resposta JSON mesmo em falhas
// inesperadas (ex: corpo JSON malformado no POST)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ erro: 'Erro interno do servidor.' });
});

db.iniciarBanco()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`A Barbearia de Odin rodando em http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error(
      'Não foi possível conectar ao MySQL. Verifique se o MySQL/XAMPP está ligado e se os dados em .env (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME) estão corretos.'
    );
    console.error(err.message);
    process.exit(1);
  });
