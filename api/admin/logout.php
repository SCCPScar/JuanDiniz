<?php
// admin/logout.php

require_once __DIR__ . '/../conexao.php';

unset($_SESSION['admin_id'], $_SESSION['admin_nome'], $_SESSION['admin_email']);

echo json_encode(['ok' => true]);
