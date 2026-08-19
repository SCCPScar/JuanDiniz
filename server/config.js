// config.js
// Configuração central de auth, compartilhada por auth.js e barbearia.js
// (antes cada arquivo definia sua própria cópia — risco de ficarem
// dessincronizados, e o segredo padrão era usado silenciosamente).

const JWT_SECRET = process.env.JWT_SECRET || 'troque-este-segredo-antes-de-publicar';

if (process.env.NODE_ENV === 'production' && JWT_SECRET === 'troque-este-segredo-antes-de-publicar') {
  throw new Error(
    'JWT_SECRET não configurado! Defina uma string longa e aleatória em .env antes de publicar em produção.'
  );
}

module.exports = {
  JWT_SECRET,
  COOKIE_NAME: 'barbearia_token',
  TOKEN_EXPIRES_IN: '7d',
  COOKIE_MAX_AGE: 7 * 24 * 60 * 60 * 1000, // 7 dias em ms

  // Conexão com o MySQL (o mesmo banco que você abre no phpMyAdmin)
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: Number(process.env.DB_PORT) || 3306,
  DB_USER: process.env.DB_USER || 'root',
  DB_PASSWORD: process.env.DB_PASSWORD || '',
  DB_NAME: process.env.DB_NAME || 'barbearia_odin',
};
