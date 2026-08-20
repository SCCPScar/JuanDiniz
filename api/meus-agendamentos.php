<?php
// meus-agendamentos.php
// Lista as marcações do utilizador com sessão iniciada.

require_once __DIR__ . '/conexao.php';

if (!isset($_SESSION['usuario_id'])) {
    http_response_code(401);
    echo json_encode(['erro' => 'É preciso estar logado.']);
    exit;
}

$email = $_SESSION['usuario_email'];

$stmt = mysqli_prepare($conexao, 'SELECT id_cliente FROM clientes WHERE email = ?');
mysqli_stmt_bind_param($stmt, 's', $email);
mysqli_stmt_execute($stmt);
$cliente = mysqli_fetch_assoc(mysqli_stmt_get_result($stmt));

if (!$cliente) {
    echo json_encode([]);
    exit;
}

$stmt = mysqli_prepare($conexao, "
    SELECT
        agendamentos.id_agendamento,
        servicos.nome AS nome_servico,
        agendamentos.barbeiro,
        agendamentos.data,
        DATE_FORMAT(agendamentos.hora, '%H:%i') AS hora,
        agendamentos.status,
        agendamentos.observacoes
    FROM agendamentos
    JOIN servicos ON agendamentos.id_servico = servicos.id_servico
    WHERE agendamentos.id_cliente = ?
    ORDER BY agendamentos.data DESC, agendamentos.hora DESC
");
mysqli_stmt_bind_param($stmt, 'i', $cliente['id_cliente']);
mysqli_stmt_execute($stmt);
$agendamentos = mysqli_fetch_all(mysqli_stmt_get_result($stmt), MYSQLI_ASSOC);

echo json_encode($agendamentos);
