<?php
// admin/sessao.php
// Diz ao painel se há um administrador com sessão iniciada.

require_once __DIR__ . '/../conexao.php';

if (!isset($_SESSION['admin_id'])) {
    http_response_code(401);
    echo json_encode(['admin' => null]);
    exit;
}

echo json_encode(['admin' => [
    'id' => $_SESSION['admin_id'],
    'nome' => $_SESSION['admin_nome'],
    'email' => $_SESSION['admin_email'],
]]);
