<?php
// config.php (SQLite version)
define('DB_FILE', __DIR__ . '/chat_app.db');

try {
    $pdo = new PDO("sqlite:" . DB_FILE);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (Exception $e) {
    die("DB connection failed: " . htmlspecialchars($e->getMessage()));
}

session_start();

// Tạo bảng nếu chưa có
$pdo->exec("
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  display_name TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
");

$pdo->exec("
CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sender_id INTEGER NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(sender_id) REFERENCES users(id) ON DELETE CASCADE
);
");
