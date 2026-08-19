# A Barbearia de Odin

Site com cadastro/login, agendamento online e painel administrativo.
Front-end em HTML/CSS/JS puro e back-end em **PHP + MySQL**, gerenciado
pelo **phpMyAdmin**.

## Como rodar (XAMPP)

1. Instale o [XAMPP](https://www.apachefriends.org/pt_br/index.html) e ligue
   os módulos **Apache** e **MySQL** no painel de controle.

2. Copie a pasta inteira deste projeto para dentro de `htdocs`, por exemplo:
   ```
   C:\xampp\htdocs\barbearia-odin\
   ```

3. Abra `http://localhost/phpmyadmin`, vá na aba **Importar** e envie o
   arquivo `database/schema.sql` — isso cria o banco `barbearia_odin` com
   as 6 tabelas (`usuarios`, `clientes`, `servicos`, `agendamentos`,
   `admins`, `mensagens_contato`).

4. (Opcional) Ainda no phpMyAdmin, com o banco `barbearia_odin` selecionado,
   importe também `database/seed.sql` para ter alguns serviços,
   agendamentos de exemplo e um administrador já cadastrados.

5. Se o seu MySQL usar outro usuário/senha (diferente do padrão do XAMPP,
   que é `root` sem senha), ajuste em `api/config.php`.

6. Acesse `http://localhost/barbearia-odin/` no navegador. Pronto — o site,
   o cadastro/login e o agendamento já funcionam.

## Painel administrativo

Acesse `http://localhost/barbearia-odin/admin/` (também tem um link no
rodapé do site). Se você importou o `seed.sql`, o login de teste é:

```
E-mail: admin@barbeariaodin.pt
Senha:  admin123
```

Troque essa senha (ou crie outro administrador e apague este) antes de usar
o site a sério — dá pra fazer isso direto pelo phpMyAdmin, editando a tabela
`admins`, mas lembre que o campo `senha_hash` precisa ser gerado com a
função `password_hash()` do PHP, nunca digitado como texto puro.

No painel dá pra ver todos os agendamentos de todos os clientes (não só os
seus) e mudar o status de cada um (Pendente / Confirmado / Concluído /
Cancelado), além de ler as mensagens recebidas pelo formulário de contato.

## Estrutura do projeto

```
index.html, style.css, auth.css, favicon.svg,
script.js, auth-frontend.js,
agendamento.js, contato.js            -> front-end do site (HTML, CSS e JS puro)

admin/
  index.html, painel.html, admin.css, admin.js  -> front-end do painel administrativo

api/
  config.php             -> usuário/senha do banco
  conexao.php             -> conecta ao MySQL e inicia a sessão (incluído por todos os outros)
  cadastro.php            -> POST: cria uma conta
  login.php               -> POST: entra na conta
  logout.php              -> POST: sai da conta
  sessao.php              -> GET: diz se tem alguém logado
  servicos.php            -> GET: lista os serviços da barbearia
  agendar.php             -> POST: cria um agendamento (exige login)
  meus-agendamentos.php   -> GET: lista os agendamentos do usuário logado
  cancelar-agendamento.php -> POST: cancela um agendamento do próprio usuário
  contato.php             -> POST: grava uma mensagem do formulário de contato
  admin/
    login.php, logout.php, sessao.php    -> sessão separada, só para administradores
    agendamentos.php                     -> GET: lista os agendamentos de TODOS os clientes
    atualizar-status.php                 -> POST: muda o status de um agendamento
    mensagens.php                        -> GET: lista as mensagens de contato recebidas

database/
  schema.sql  -> cria o banco e as tabelas (importe pelo phpMyAdmin)
  seed.sql    -> dados de exemplo + administrador de teste (opcional, importe pelo phpMyAdmin)
```

## Como funciona o login

- As senhas são guardadas com `password_hash()` (nunca em texto puro).
- O login usa a sessão nativa do PHP (`$_SESSION`, cookie `PHPSESSID`) — é
  o jeito mais simples de manter alguém logado em PHP, sem bibliotecas
  externas.
- Cada arquivo em `api/` que precisa saber quem está logado confere
  `$_SESSION['usuario_id']`. O painel administrativo usa uma chave de
  sessão diferente (`$_SESSION['admin_id']`), então é possível estar
  logado como cliente e como administrador ao mesmo tempo, em abas
  diferentes do navegador.

## Ver/editar os dados

Com o Apache e o MySQL ligados, abra `http://localhost/phpmyadmin`, clique
no banco `barbearia_odin` no menu à esquerda e navegue pelas tabelas — dá
pra ver e editar clientes, serviços, agendamentos e mensagens de contato
diretamente por lá. Para o dia a dia (mudar o status de um agendamento, por
exemplo), o painel em `/admin/` é mais rápido e não expõe a estrutura do
banco a quem for usar o site.
