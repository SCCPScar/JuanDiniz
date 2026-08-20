<?php
// agendar.php
// Cria uma nova marcação para o utilizador com sessão iniciada.

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

$idServico = $dados['id_servico'] ?? '';
$barbeiro = trim($dados['barbeiro'] ?? '');
$data = $dados['data'] ?? '';
$hora = $dados['hora'] ?? '';
$observacoes = trim($dados['observacoes'] ?? '');

if ($idServico === '' || $data === '' || $hora === '') {
    http_response_code(400);
    echo json_encode(['erro' => 'Campos obrigatórios: serviço, data e hora.']);
    exit;
}

// Confere se a data/hora escolhida já não passou
$dataHoraAgendamento = DateTime::createFromFormat('Y-m-d H:i', "$data $hora");
if (!$dataHoraAgendamento || $dataHoraAgendamento < new DateTime()) {
    http_response_code(400);
    echo json_encode(['erro' => 'Escolha uma data e hora futuras.']);
    exit;
}

// Confere se o serviço existe
$stmt = mysqli_prepare($conexao, 'SELECT id_servico FROM servicos WHERE id_servico = ?');
mysqli_stmt_bind_param($stmt, 'i', $idServico);
mysqli_stmt_execute($stmt);
if (!mysqli_fetch_assoc(mysqli_stmt_get_result($stmt))) {
    http_response_code(400);
    echo json_encode(['erro' => 'Serviço inválido.']);
    exit;
}

$barbeiroValor = $barbeiro !== '' ? $barbeiro : null;
$obsValor = $observacoes !== '' ? $observacoes : null;

// Confere se o barbeiro já não tem outro cliente marcado nesse mesmo dia/hora
if ($barbeiroValor !== null) {
    $stmt = mysqli_prepare($conexao, "
        SELECT id_agendamento FROM agendamentos
        WHERE barbeiro = ? AND data = ? AND hora = ? AND status != 'Cancelado'
    ");
    mysqli_stmt_bind_param($stmt, 'sss', $barbeiroValor, $data, $hora);
    mysqli_stmt_execute($stmt);
    if (mysqli_fetch_assoc(mysqli_stmt_get_result($stmt))) {
        http_response_code(409);
        echo json_encode(['erro' => 'Esse barbeiro já tem um horário marcado nesse dia e hora.']);
        exit;
    }
}

// Busca o cliente ligado a este utilizador (pelo e-mail) ou cria um novo
$emailUsuario = $_SESSION['usuario_email'];
$nomeUsuario = $_SESSION['usuario_nome'];

$stmt = mysqli_prepare($conexao, 'SELECT id_cliente FROM clientes WHERE email = ?');
mysqli_stmt_bind_param($stmt, 's', $emailUsuario);
mysqli_stmt_execute($stmt);
$cliente = mysqli_fetch_assoc(mysqli_stmt_get_result($stmt));

if ($cliente) {
    $idCliente = $cliente['id_cliente'];
} else {
    $stmt = mysqli_prepare($conexao, 'INSERT INTO clientes (nome, email, data_cadastro) VALUES (?, ?, NOW())');
    mysqli_stmt_bind_param($stmt, 'ss', $nomeUsuario, $emailUsuario);
    mysqli_stmt_execute($stmt);
    $idCliente = mysqli_insert_id($conexao);
}

$stmt = mysqli_prepare($conexao, "
    INSERT INTO agendamentos (id_cliente, id_servico, barbeiro, data, hora, status, observacoes)
    VALUES (?, ?, ?, ?, ?, 'Pendente', ?)
");
mysqli_stmt_bind_param($stmt, 'iissss', $idCliente, $idServico, $barbeiroValor, $data, $hora, $obsValor);
mysqli_stmt_execute($stmt);

http_response_code(201);
echo json_encode([
    'id_agendamento' => mysqli_insert_id($conexao),
    'mensagem' => 'Agendamento realizado com sucesso!',
]);
