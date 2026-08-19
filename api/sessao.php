<?php
// sessao.php
// Diz ao front-end se tem usuário logado (usado para trocar
// "Entrar/Cadastrar" por "Olá, Nome" no menu, e para liberar o formulário
// de agendamento).

require_once __DIR__ . '/conexao.php';

if (!isset($_SESSION['usuario_id'])) {
    http_response_code(401);
    echo json_encode(['usuario' => null]);
    exit;
}

echo json_encode(['usuario' => [
    'id' => $_SESSION['usuario_id'],
    'nome' => $_SESSION['usuario_nome'],
    'email' => $_SESSION['usuario_email'],
]]);
