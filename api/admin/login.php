<?php
// admin/login.php
// Login do painel administrativo. Usa uma sessão separada da sessão de
// clientes ($_SESSION['admin_id'] em vez de $_SESSION['usuario_id']), então
// dá pra estar logado como cliente e como admin ao mesmo tempo, em abas
// diferentes.

require_once __DIR__ . '/../conexao.php';

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
    echo json_encode(['erro' => 'Preencha e-mail e senha.']);
    exit;
}

$stmt = mysqli_prepare($conexao, 'SELECT * FROM admins WHERE email = ?');
mysqli_stmt_bind_param($stmt, 's', $email);
mysqli_stmt_execute($stmt);
$admin = mysqli_fetch_assoc(mysqli_stmt_get_result($stmt));

if (!$admin || !password_verify($senha, $admin['senha_hash'])) {
    http_response_code(401);
    echo json_encode(['erro' => 'E-mail ou senha incorretos.']);
    exit;
}

$_SESSION['admin_id'] = $admin['id'];
$_SESSION['admin_nome'] = $admin['nome'];
$_SESSION['admin_email'] = $admin['email'];

echo json_encode(['admin' => ['id' => $admin['id'], 'nome' => $admin['nome'], 'email' => $admin['email']]]);
