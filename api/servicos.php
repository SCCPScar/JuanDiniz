<?php
// servicos.php
// Lista todos os serviços (rota pública, usada para preencher o formulário de marcação).

require_once __DIR__ . '/conexao.php';

$resultado = mysqli_query($conexao, 'SELECT * FROM servicos');
$servicos = mysqli_fetch_all($resultado, MYSQLI_ASSOC);

echo json_encode($servicos);
