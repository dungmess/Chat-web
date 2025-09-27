<?php
require 'config.php';
header('Content-Type: application/json');

$last_id = isset($_GET['last_id']) ? (int)$_GET['last_id'] : 0;
$limit = 50;

$stmt = $pdo->prepare("SELECT m.id, m.message, m.created_at, u.display_name, m.sender_id
                       FROM messages m
                       JOIN users u ON m.sender_id = u.id
                       WHERE m.id > ?
                       ORDER BY m.id ASC
                       LIMIT ?");
$stmt->execute([$last_id, $limit]);
$rows = $stmt->fetchAll();

echo json_encode(['success'=>true,'messages'=>$rows]);
