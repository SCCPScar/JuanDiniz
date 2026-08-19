<?php
// logout.php
// Encerra a sessão do usuário.

require_once __DIR__ . '/conexao.php';

$_SESSION = [];
session_destroy();

echo json_encode(['ok' => true]);
