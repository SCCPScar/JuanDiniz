<?php
// cadastro.php
// Cria uma conta nova e já loga o usuário (sessão do PHP).

require_once __DIR__ . '/conexao.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['erro' => 'Método não permitido.']);
    exit;
}

$dados = json_decode(file_get_contents('php://input'), true);

$nome = trim($dados['nome'] ?? '');
$email = trim($dados['email'] ?? '');
$senha = $dados['senha'] ?? '';

if ($nome === '' || $email === '' || $senha === '') {
    http_response_code(400);
    echo json_encode(['erro' => 'Preencha nome, e-mail e senha.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['erro' => 'E-mail inválido.']);
    exit;
}

if (strlen($senha) < 6) {
    http_response_code(400);
    echo json_encode(['erro' => 'A senha precisa ter pelo menos 6 caracteres.']);
    exit;
}

$email = strtolower($email);

// Confere se já existe conta com esse e-mail
$stmt = mysqli_prepare($conexao, 'SELECT id FROM usuarios WHERE email = ?');
mysqli_stmt_bind_param($stmt, 's', $email);
mysqli_stmt_execute($stmt);
$existente = mysqli_fetch_assoc(mysqli_stmt_get_result($stmt));

if ($existente) {
    http_response_code(409);
    echo json_encode(['erro' => 'Já existe uma conta com este e-mail.']);
    exit;
}

// password_hash cuida de gerar o hash da senha com segurança (nunca salvamos senha em texto puro)
$senhaHash = password_hash($senha, PASSWORD_DEFAULT);

$stmt = mysqli_prepare($conexao, 'INSERT INTO usuarios (nome, email, senha_hash) VALUES (?, ?, ?)');
mysqli_stmt_bind_param($stmt, 'sss', $nome, $email, $senhaHash);
mysqli_stmt_execute($stmt);

$id = mysqli_insert_id($conexao);

$_SESSION['usuario_id'] = $id;
$_SESSION['usuario_nome'] = $nome;
$_SESSION['usuario_email'] = $email;

http_response_code(201);
echo json_encode(['usuario' => ['id' => $id, 'nome' => $nome, 'email' => $email]]);
