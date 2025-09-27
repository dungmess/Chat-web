<?php
require 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username'] ?? '');
    $password = $_POST['password'] ?? '';

    $stmt = $pdo->prepare("SELECT id, password_hash, display_name FROM users WHERE username = ?");
    $stmt->execute([$username]);
    $user = $stmt->fetch();

    if ($user && password_verify($password, $user['password_hash'])) {
        // login success
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['display_name'] = $user['display_name'];
        echo json_encode(['success'=>true,'msg'=>'Đăng nhập thành công.']);
    } else {
        echo json_encode(['success'=>false,'msg'=>'Tên đăng nhập hoặc mật khẩu không đúng.']);
    }
    exit;
}
echo json_encode(['success'=>false,'msg'=>'Phương thức không hợp lệ.']);
