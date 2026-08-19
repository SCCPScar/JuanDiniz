<?php
// admin/agendamentos.php
// Lista TODOS os agendamentos (de todos os clientes) — só para administradores.

require_once __DIR__ . '/../conexao.php';

if (!isset($_SESSION['admin_id'])) {
    http_response_code(401);
    echo json_encode(['erro' => 'É preciso estar logado como administrador.']);
    exit;
}

$resultado = mysqli_query($conexao, "
    SELECT
        agendamentos.id_agendamento,
        clientes.nome AS nome_cliente,
        clientes.email AS email_cliente,
        servicos.nome AS nome_servico,
        agendamentos.barbeiro,
        agendamentos.data,
        DATE_FORMAT(agendamentos.hora, '%H:%i') AS hora,
        agendamentos.status,
        agendamentos.observacoes
    FROM agendamentos
    JOIN clientes ON agendamentos.id_cliente = clientes.id_cliente
    JOIN servicos ON agendamentos.id_servico = servicos.id_servico
    ORDER BY agendamentos.data DESC, agendamentos.hora DESC
");

echo json_encode(mysqli_fetch_all($resultado, MYSQLI_ASSOC));
