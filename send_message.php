<?php
require 'config.php';
header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success'=>false,'msg'=>'Chưa đăng nhập.']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success'=>false,'msg'=>'Phương thức không hợp lệ.']);
    exit;
}

$msg = trim($_POST['message'] ?? '');
if ($msg === '') {
    echo json_encode(['success'=>false,'msg'=>'Tin nhắn rỗng.']);
    exit;
}

// Lưu vào DB
$stmt = $pdo->prepare("INSERT INTO messages (sender_id, message) VALUES (?, ?)");
$stmt->execute([$_SESSION['user_id'], $msg]);

// trả về ID mới + thời gian
$id = $pdo->lastInsertId();
$sth = $pdo->prepare("SELECT m.id, m.message, m.created_at, u.display_name FROM messages m JOIN users u ON m.sender_id = u.id WHERE m.id = ?");
$sth->execute([$id]);
$row = $sth->fetch();

echo json_encode(['success'=>true,'message'=>$row]);
