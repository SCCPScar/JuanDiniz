<?php
// cancelar-agendamento.php
// Cancela um agendamento do próprio usuário logado (muda o status para
// "Cancelado" — não apaga a linha, para manter o histórico).

require_once __DIR__ . '/conexao.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['erro' => 'Método não permitido.']);
    exit;
}

if (!isset($_SESSION['usuario_id'])) {
    http_response_code(401);
    echo json_encode(['erro' => 'É preciso estar logado.']);
    exit;
}

$dados = json_decode(file_get_contents('php://input'), true);
$idAgendamento = $dados['id_agendamento'] ?? '';

if ($idAgendamento === '') {
    http_response_code(400);
    echo json_encode(['erro' => 'Informe o agendamento a cancelar.']);
    exit;
}

$email = $_SESSION['usuario_email'];

// Só deixa cancelar um agendamento que pertença ao próprio usuário logado
$stmt = mysqli_prepare($conexao, "
    SELECT agendamentos.id_agendamento
    FROM agendamentos
    JOIN clientes ON agendamentos.id_cliente = clientes.id_cliente
    WHERE agendamentos.id_agendamento = ? AND clientes.email = ?
");
mysqli_stmt_bind_param($stmt, 'is', $idAgendamento, $email);
mysqli_stmt_execute($stmt);
$agendamento = mysqli_fetch_assoc(mysqli_stmt_get_result($stmt));

if (!$agendamento) {
    http_response_code(404);
    echo json_encode(['erro' => 'Agendamento não encontrado.']);
    exit;
}

$stmt = mysqli_prepare($conexao, "UPDATE agendamentos SET status = 'Cancelado' WHERE id_agendamento = ?");
mysqli_stmt_bind_param($stmt, 'i', $idAgendamento);
mysqli_stmt_execute($stmt);

echo json_encode(['ok' => true, 'mensagem' => 'Agendamento cancelado.']);
