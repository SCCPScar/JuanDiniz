# A Barbearia de Odin

Site com cadastro/login e agendamento online. Front-end em HTML/CSS/JS puro
e back-end em **PHP + MySQL**, gerenciado pelo **phpMyAdmin**.

## Como rodar (XAMPP)

1. Instale o [XAMPP](https://www.apachefriends.org/pt_br/index.html) e ligue
   os módulos **Apache** e **MySQL** no painel de controle.

2. Copie a pasta inteira deste projeto para dentro de `htdocs`, por exemplo:
   ```
   C:\xampp\htdocs\barbearia-odin\
   ```

3. Abra `http://localhost/phpmyadmin`, vá na aba **Importar** e envie o
   arquivo `database/schema.sql` — isso cria o banco `barbearia_odin` com
   as 4 tabelas (`usuarios`, `clientes`, `servicos`, `agendamentos`).

4. (Opcional) Ainda no phpMyAdmin, com o banco `barbearia_odin` selecionado,
   importe também `database/seed.sql` para ter alguns serviços e
   agendamentos de exemplo já cadastrados.

5. Se o seu MySQL usar outro usuário/senha (diferente do padrão do XAMPP,
   que é `root` sem senha), ajuste em `api/config.php`.

6. Acesse `http://localhost/barbearia-odin/` no navegador. Pronto — o site,
   o cadastro/login e o agendamento já funcionam.

## Estrutura do projeto

```
index.html, style.css, auth.css, script.js,
auth-frontend.js, agendamento.js     -> front-end (HTML, CSS e JS puro)

api/
  config.php          -> usuário/senha do banco
  conexao.php          -> conecta ao MySQL e inicia a sessão (incluído por todos os outros)
  cadastro.php         -> POST: cria uma conta
  login.php            -> POST: entra na conta
  logout.php           -> POST: sai da conta
  sessao.php           -> GET: diz se tem alguém logado
  servicos.php         -> GET: lista os serviços da barbearia
  agendar.php           -> POST: cria um agendamento (exige login)
  meus-agendamentos.php -> GET: lista os agendamentos do usuário logado

database/
  schema.sql  -> cria o banco e as tabelas (importe pelo phpMyAdmin)
  seed.sql    -> dados de exemplo (opcional, importe pelo phpMyAdmin)
```

## Como funciona o login

- As senhas são guardadas com `password_hash()` (nunca em texto puro).
- O login usa a sessão nativa do PHP (`$_SESSION`, cookie `PHPSESSID`) — é
  o jeito mais simples de manter alguém logado em PHP, sem bibliotecas
  externas.
- Cada arquivo em `api/` que precisa saber quem está logado confere
  `$_SESSION['usuario_id']`.

## Ver/editar os dados

Com o Apache e o MySQL ligados, abra `http://localhost/phpmyadmin`, clique
no banco `barbearia_odin` no menu à esquerda e navegue pelas tabelas — dá
pra ver e editar clientes, serviços e agendamentos diretamente por lá.
