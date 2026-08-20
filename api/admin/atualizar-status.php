<?php
// admin/atualizar-status.php
// Muda o estado de qualquer marcação (Pendente, Confirmado, Concluído ou Cancelado).

require_once __DIR__ . '/../conexao.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['erro' => 'Método não permitido.']);
    exit;
}

if (!isset($_SESSION['admin_id'])) {
    http_response_code(401);
    echo json_encode(['erro' => 'É preciso estar logado como administrador.']);
    exit;
}

$dados = json_decode(file_get_contents('php://input'), true);
$idAgendamento = $dados['id_agendamento'] ?? '';
$status = $dados['status'] ?? '';

$statusValidos = ['Pendente', 'Confirmado', 'Cancelado', 'Concluído'];

if ($idAgendamento === '' || !in_array($status, $statusValidos, true)) {
    http_response_code(400);
    echo json_encode(['erro' => 'Informe um agendamento e um status válido.']);
    exit;
}

$stmt = mysqli_prepare($conexao, 'UPDATE agendamentos SET status = ? WHERE id_agendamento = ?');
mysqli_stmt_bind_param($stmt, 'si', $status, $idAgendamento);
mysqli_stmt_execute($stmt);

if (mysqli_stmt_affected_rows($stmt) === 0) {
    http_response_code(404);
    echo json_encode(['erro' => 'Agendamento não encontrado.']);
    exit;
}

echo json_encode(['ok' => true]);
