<?php
// contato.php
// Recebe o formulário de contato e guarda no banco (tabela mensagens_contato).
// Assim dá pra ver as mensagens recebidas pelo phpMyAdmin, sem precisar
// configurar um servidor de e-mail.

require_once __DIR__ . '/conexao.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['erro' => 'Método não permitido.']);
    exit;
}

$dados = json_decode(file_get_contents('php://input'), true);

$nome = trim($dados['nome'] ?? '');
$email = trim($dados['email'] ?? '');
$mensagem = trim($dados['mensagem'] ?? '');

if ($nome === '' || $email === '' || $mensagem === '') {
    http_response_code(400);
    echo json_encode(['erro' => 'Preencha nome, e-mail e mensagem.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['erro' => 'E-mail inválido.']);
    exit;
}

$stmt = mysqli_prepare($conexao, 'INSERT INTO mensagens_contato (nome, email, mensagem) VALUES (?, ?, ?)');
mysqli_stmt_bind_param($stmt, 'sss', $nome, $email, $mensagem);
mysqli_stmt_execute($stmt);

http_response_code(201);
echo json_encode(['ok' => true, 'mensagem' => 'Mensagem enviada! Em breve entraremos em contato.']);
