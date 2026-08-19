<?php
// conexao.php
// Conecta ao banco MySQL (o mesmo banco que você vê no phpMyAdmin) e inicia
// a sessão do usuário. Todo arquivo dentro de api/ começa incluindo este.

require_once __DIR__ . '/config.php';

session_start();
header('Content-Type: application/json; charset=utf-8');

$conexao = mysqli_connect(DB_HOST, DB_USUARIO, DB_SENHA, DB_NOME);

if (!$conexao) {
    http_response_code(500);
    echo json_encode([
        'erro' => 'Não foi possível conectar ao banco de dados. Verifique se o MySQL está ligado e se o banco "barbearia_odin" existe (importe database/schema.sql pelo phpMyAdmin).',
    ]);
    exit;
}

mysqli_set_charset($conexao, 'utf8mb4');
