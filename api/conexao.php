<?php
// conexao.php
// Liga à base de dados MySQL (a mesma que aparece no phpMyAdmin) e inicia
// a sessão do utilizador. Todos os ficheiros dentro de api/ começam por
// incluir este.

require_once __DIR__ . '/config.php';

session_start();
header('Content-Type: application/json; charset=utf-8');

$conexao = mysqli_connect(DB_HOST, DB_USUARIO, DB_SENHA, DB_NOME);

if (!$conexao) {
    http_response_code(500);
    echo json_encode([
        'erro' => 'Não foi possível ligar à base de dados. Verifique se o MySQL está ligado e se a base de dados "barbearia_odin" existe (importe database/schema.sql pelo phpMyAdmin).',
    ]);
    exit;
}

mysqli_set_charset($conexao, 'utf8mb4');
