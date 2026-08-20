<?php
// sessao.php
// Diz ao front-end se há sessão de utilizador iniciada (usado para trocar
// "Entrar/Registar" por "Olá, Nome" no menu, e para libertar o formulário
// de marcação).

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
