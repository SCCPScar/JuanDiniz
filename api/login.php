<?php
// login.php
// Confere e-mail/palavra-passe e inicia a sessão do utilizador.

require_once __DIR__ . '/conexao.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['erro' => 'Método não permitido.']);
    exit;
}

$dados = json_decode(file_get_contents('php://input'), true);

$email = strtolower(trim($dados['email'] ?? ''));
$senha = $dados['senha'] ?? '';

if ($email === '' || $senha === '') {
    http_response_code(400);
    echo json_encode(['erro' => 'Preencha o e-mail e a palavra-passe.']);
    exit;
}

$stmt = mysqli_prepare($conexao, 'SELECT * FROM usuarios WHERE email = ?');
mysqli_stmt_bind_param($stmt, 's', $email);
mysqli_stmt_execute($stmt);
$usuario = mysqli_fetch_assoc(mysqli_stmt_get_result($stmt));

if (!$usuario || !password_verify($senha, $usuario['senha_hash'])) {
    http_response_code(401);
    echo json_encode(['erro' => 'E-mail ou palavra-passe incorretos.']);
    exit;
}

$_SESSION['usuario_id'] = $usuario['id'];
$_SESSION['usuario_nome'] = $usuario['nome'];
$_SESSION['usuario_email'] = $usuario['email'];

echo json_encode(['usuario' => [
    'id' => $usuario['id'],
    'nome' => $usuario['nome'],
    'email' => $usuario['email'],
]]);
