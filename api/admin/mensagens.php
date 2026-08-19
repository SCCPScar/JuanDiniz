<?php
// admin/mensagens.php
// Lista as mensagens recebidas pelo formulário de contato.

require_once __DIR__ . '/../conexao.php';

if (!isset($_SESSION['admin_id'])) {
    http_response_code(401);
    echo json_encode(['erro' => 'É preciso estar logado como administrador.']);
    exit;
}

$resultado = mysqli_query($conexao, 'SELECT * FROM mensagens_contato ORDER BY enviado_em DESC');

echo json_encode(mysqli_fetch_all($resultado, MYSQLI_ASSOC));
