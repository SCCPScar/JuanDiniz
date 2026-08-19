# Backend — A Barbearia de Odin

API de cadastro/login/agendamentos com Node.js + Express + MySQL — o mesmo
banco que você visualiza e edita pelo **phpMyAdmin**.

## 1. Ligue o MySQL e o phpMyAdmin

Mais simples: instale o **XAMPP** (ou WAMP/Laragon) e ligue os módulos
**Apache** e **MySQL** no painel de controle. O phpMyAdmin fica disponível em
`http://localhost/phpmyadmin`.

## 2. Crie o banco de dados

No phpMyAdmin:

1. Abra a aba **Importar**.
2. Escolha o arquivo `server/schema.sql` deste projeto.
3. Clique em **Executar**.

Isso cria o banco `barbearia_odin` e as 4 tabelas (`usuarios`, `clientes`,
`servicos`, `agendamentos`) já com os relacionamentos (chaves estrangeiras) e
índices prontos. Depois disso, dá pra abrir o banco `barbearia_odin` no menu
lateral do phpMyAdmin e ver/editar os dados a qualquer momento.

> Se você preferir, pode pular esse passo — o servidor também cria as
> tabelas sozinho na primeira vez que inicia (`CREATE TABLE IF NOT EXISTS`).
> Importar o `schema.sql` é só mais rápido e deixa tudo visível no
> phpMyAdmin desde já.

## 3. Configure e rode o servidor

1. Instale as dependências:
   ```
   cd server
   npm install
   ```

2. Copie o arquivo de exemplo de variáveis de ambiente:
   ```
   cp .env.example .env
   ```
   Abra `.env` e ajuste:
   - `JWT_SECRET` — troque por uma string longa e aleatória antes de publicar.
   - `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` — dados de acesso
     ao MySQL. No XAMPP padrão: host `localhost`, usuário `root`, senha em
     branco, porta `3306`.

3. (Opcional) Popule o banco com dados de exemplo:
   ```
   npm run seed
   ```

4. Suba o servidor:
   ```
   npm start
   ```

5. Acesse `http://localhost:3000` — o Express já serve o site (index.html,
   css, js) E a API, então não precisa rodar nada mais. Um Live Server
   separado não é necessário (e não vai ter acesso à API).

## O que tem aqui

- `schema.sql` — script SQL pronto para importar no phpMyAdmin e criar o
  banco `barbearia_odin` com todas as tabelas.
- `database.js` — abre a conexão com o MySQL (pool de conexões) e garante
  que as tabelas existem.
- `config.js` — configuração central (segredo do JWT, dados de conexão do
  banco), lida a partir do `.env`.
- `auth.js` — rotas: `POST /api/auth/cadastro`, `POST /api/auth/login`,
  `POST /api/auth/logout`, `GET /api/auth/me`.
- `barbearia.js` — rotas: `GET /api/barbearia/servicos`,
  `POST /api/barbearia/agendamentos`, `GET /api/barbearia/meus-agendamentos`.
- `server.js` — sobe o Express, serve os arquivos estáticos e monta as rotas
  de API.
- `seed.js` — insere clientes/serviços/agendamentos de exemplo (roda uma vez
  só; se o banco já tiver dados, ele avisa e não duplica nada).
- `check.js` — imprime no terminal o conteúdo das tabelas, útil para
  conferir rápido sem abrir o phpMyAdmin.
- Senhas são guardadas com hash (bcrypt) — nunca em texto puro.
- A sessão usa um cookie `httpOnly` com JWT (7 dias de validade).

## Publicar online (deploy)

Esse backend precisa rodar em algo que execute Node.js continuamente (não
funciona em hospedagem só de arquivos estáticos, tipo GitHub Pages) e
precisa de um MySQL acessível pela internet. Opções com plano gratuito:
Railway e Render oferecem Node.js + MySQL juntos; o PlanetScale e o próprio
Railway também oferecem MySQL gerenciado separado. Nesses casos, aponte as
variáveis `DB_HOST`/`DB_USER`/`DB_PASSWORD`/`DB_NAME` do `.env` para o banco
que o provedor te der — o phpMyAdmin local continua funcionando normalmente
para o banco local de desenvolvimento.
