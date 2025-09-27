<?php
require 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username'] ?? '');
    $password = $_POST['password'] ?? '';
    $display = trim($_POST['display_name'] ?? '');

    if (strlen($username) < 3 || strlen($password) < 4) {
        echo json_encode(['success'=>false,'msg'=>'Username hoặc mật khẩu quá ngắn.']);
        exit;
    }

    // kiểm tra tồn tại
    $stmt = $pdo->prepare("SELECT id FROM users WHERE username = ?");
    $stmt->execute([$username]);
    if ($stmt->fetch()) {
        echo json_encode(['success'=>false,'msg'=>'Username đã tồn tại.']);
        exit;
    }

    $pwHash = password_hash($password, PASSWORD_DEFAULT);
    $stmt = $pdo->prepare("INSERT INTO users (username, password_hash, display_name) VALUES (?, ?, ?)");
    $stmt->execute([$username, $pwHash, $display ?: $username]);

    echo json_encode(['success'=>true,'msg'=>'Đăng ký thành công.']);
    exit;
}
echo json_encode(['success'=>false,'msg'=>'Phương thức không hợp lệ.']);
