<?php
// contato.php
// Recebe o formulário de contacto e guarda na base de dados (tabela
// mensagens_contato). Assim é possível ver as mensagens recebidas pelo
// phpMyAdmin, sem ser preciso configurar um servidor de e-mail.

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
    echo json_encode(['erro' => 'Preencha o nome, o e-mail e a mensagem.']);
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
echo json_encode(['ok' => true, 'mensagem' => 'Mensagem enviada! Entraremos em contacto em breve.']);
