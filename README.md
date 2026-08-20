# A Barbearia de Odin

Site com registo/login, marcação de horário online e painel administrativo.
Front-end em HTML/CSS/JS puro e back-end em **PHP + MySQL**, gerido pelo
**phpMyAdmin**.

## Como executar (XAMPP)

1. Instale o [XAMPP](https://www.apachefriends.org/pt_br/index.html) e ligue
   os módulos **Apache** e **MySQL** no painel de controlo.

2. Copie a pasta inteira deste projeto para dentro de `htdocs`, por exemplo:
   ```
   C:\xampp\htdocs\barbearia-odin\
   ```

3. Abra `http://localhost/phpmyadmin`, vá à aba **Importar** e envie o
   ficheiro `database/schema.sql` — isso cria a base de dados
   `barbearia_odin` com as 6 tabelas (`usuarios`, `clientes`, `servicos`,
   `agendamentos`, `admins`, `mensagens_contato`).

4. (Opcional) Ainda no phpMyAdmin, com a base de dados `barbearia_odin`
   selecionada, importe também `database/seed.sql` para ter alguns
   serviços, agendamentos de exemplo e um administrador já criados.

5. Se o seu MySQL usar outro utilizador/palavra-passe (diferente do padrão
   do XAMPP, que é `root` sem palavra-passe), ajuste em `api/config.php`.

6. Aceda a `http://localhost/barbearia-odin/` no navegador. Pronto — o
   site, o registo/login e a marcação de horário já funcionam.

## Páginas do site

- `index.html` — página principal, com os serviços, o formulário de
  marcação e o formulário de contacto.
- `entrar.html` — página de login.
- `registar.html` — página de criação de conta.
- `conta.html` — área de cliente: para onde o utilizador é enviado depois
  de entrar ou de se registar. Mostra os seus horários marcados, com opção
  de cancelar, e um atalho para marcar um novo horário.
- `admin/` — painel administrativo (ver secção abaixo).

## Painel administrativo

Aceda a `http://localhost/barbearia-odin/admin/` (também há uma ligação no
rodapé do site). Se importou o `seed.sql`, o login de teste é:

```
E-mail:         admin@barbeariaodin.pt
Palavra-passe:  admin123
```

Troque essa palavra-passe (ou crie outro administrador e apague este) antes
de usar o site a sério — pode fazer isso diretamente pelo phpMyAdmin,
editando a tabela `admins`, mas tenha em atenção que o campo `senha_hash`
tem de ser gerado com a função `password_hash()` do PHP, nunca escrito
diretamente como texto simples.

No painel é possível ver todos os agendamentos de todos os clientes (não
só os próprios) e mudar o estado de cada um (Pendente / Confirmado /
Concluído / Cancelado), além de ler as mensagens recebidas pelo formulário
de contacto.

## Estrutura do projeto

```
index.html, entrar.html, registar.html,
conta.html, style.css, auth.css, favicon.svg,
script.js, auth-frontend.js, entrar.js,
registar.js, conta.js, agendamento.js,
contato.js                             -> front-end do site (HTML, CSS e JS puro)

admin/
  index.html, painel.html, admin.css, admin.js  -> front-end do painel administrativo

api/
  config.php             -> utilizador/palavra-passe da base de dados
  conexao.php             -> liga ao MySQL e inicia a sessão (incluído por todos os outros)
  registar.php            -> POST: cria uma conta
  login.php               -> POST: entra na conta
  logout.php              -> POST: termina a sessão
  sessao.php              -> GET: diz se há alguém com sessão iniciada
  servicos.php            -> GET: lista os serviços da barbearia
  agendar.php             -> POST: cria uma marcação (exige sessão iniciada)
  meus-agendamentos.php   -> GET: lista as marcações do utilizador com sessão iniciada
  cancelar-agendamento.php -> POST: cancela uma marcação do próprio utilizador
  contato.php             -> POST: grava uma mensagem do formulário de contacto
  admin/
    login.php, logout.php, sessao.php    -> sessão separada, só para administradores
    agendamentos.php                     -> GET: lista os agendamentos de TODOS os clientes
    atualizar-status.php                 -> POST: muda o estado de um agendamento
    mensagens.php                        -> GET: lista as mensagens de contacto recebidas

database/
  schema.sql  -> cria a base de dados e as tabelas (importe pelo phpMyAdmin)
  seed.sql    -> dados de exemplo + administrador de teste (opcional, importe pelo phpMyAdmin)
```

## Como funciona o login

- As palavras-passe são guardadas com `password_hash()` (nunca em texto
  simples).
- O login usa a sessão nativa do PHP (`$_SESSION`, cookie `PHPSESSID`) — é
  a forma mais simples de manter alguém com sessão iniciada em PHP, sem
  bibliotecas externas.
- Depois de entrar ou de se registar, o cliente é enviado para
  `conta.html` — a sua área pessoal.
- Cada ficheiro em `api/` que precisa de saber quem tem sessão iniciada
  confere `$_SESSION['usuario_id']`. O painel administrativo usa uma chave
  de sessão diferente (`$_SESSION['admin_id']`), por isso é possível ter
  sessão iniciada como cliente e como administrador ao mesmo tempo, em
  separadores diferentes do navegador.

## Ver/editar os dados

Com o Apache e o MySQL ligados, abra `http://localhost/phpmyadmin`, clique
na base de dados `barbearia_odin` no menu à esquerda e navegue pelas
tabelas — é possível ver e editar clientes, serviços, agendamentos e
mensagens de contacto diretamente por lá. Para o dia a dia (mudar o
estado de um agendamento, por exemplo), o painel em `/admin/` é mais
rápido e não expõe a estrutura da base de dados a quem usar o site.
