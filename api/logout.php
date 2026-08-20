<?php
// logout.php
// Termina a sessão do utilizador.

require_once __DIR__ . '/conexao.php';

$_SESSION = [];
session_destroy();

echo json_encode(['ok' => true]);
