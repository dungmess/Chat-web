<?php
require 'config.php';
$logged = isset($_SESSION['user_id']);
$display = $_SESSION['display_name'] ?? '';
?>
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>9C GROUPCHAT</title>
  <link rel="icon" type="image/png" href="/img/logo.png">
  <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600&display=swap" rel="stylesheet">
  <?php if (!$logged): ?>
    <link rel="stylesheet" href="Login.css">
  <?php else: ?>
    <link rel="stylesheet" href="chat.css">
  <?php endif; ?>

</head>
<body>
  <header>
    
    <img src="/img/logo.png" width = "114px" height="114px" id="logo">
    <h1 id="tag">Ổ RẮN 9C</h1>
  <div class="container">
    <?php if (!$logged): ?>
      <div class="auth">
        <div class="login-box" id="loginCard">
          <h2>Login</h2>
          <form id="loginForm">
            <div class="input-box">
              <input type="text" name="username" required>
              <label>Username</label>
            </div>
            <div class="input-box">
              <input type="password" name="password" required>
              <label>Password</label>
            </div>
            <button type="submit" class="btn">Sign in</button>
            <div class="options">
              <a href="#">Forget Password</a>
              <a href="#" id="showRegister">Signup</a>
            </div>
          </form>
        </div>

        <div class="login-box" id="registerCard" style="display:none">
          <h2>Register</h2>
          <form id="registerForm">
            <div class="input-box">
              <input type="text" name="username" required>
              <label>Username</label>
            </div>
            <div class="input-box">
              <input type="text" name="display_name">
              <label>Display name</label>
            </div>
            <div class="input-box">
              <input type="password" name="password" required>
              <label>Password</label>
            </div>
            <button type="submit" class="btn">Register</button>
            <div class="options">
              <a href="#" id="showLogin">Login</a>
            </div>
          </form>
        </div>
      </div>

    <?php else: ?>
      <div class="chat-wrapper">
        <div class="topbar">
          <div>Xin chào, <strong><?=htmlspecialchars($display)?></strong></div>
          <div><a href="logout.php">Logout</a></div>
        </div>

        <div id="messages" class="messages"></div>

        <form id="sendForm" class="sendForm">
          <input id="messageInput" name="message" autocomplete="off" placeholder="Nhập tin nhắn..." />
          <button type="submit">Send</button>
        </form>
      </div>
    <?php endif; ?>
  </div>
      
<div class="player-card">
  <div class="row">
    <div class="input-wrap">
      <input id="ytLink" type="text"
        placeholder="Dán link YouTube vào đây (vd: https://youtu.be/dQw4w9WgXcQ)" />
    </div>
    <button id="loadBtn">Load</button>
  </div>

  <div class="meta">
    <div class="title" id="videoTitle">Chưa có bài hát nào</div>
    <div class="time" id="duration">00:00</div>
  </div>

  <div class="controls">
  <button id="playBtn" class="big-btn">►</button>
  <button id="stopBtn" class="small">■</button>
  <button id="rewindBtn" class="small">« 10s</button>
  <button id="forwardBtn" class="small">10s »</button>
  <button id="prevBtn" class="small">⟲</button>
  <div style="flex:1">
    <div class="progress" id="progress">
      <div class="bar" id="progressBar"></div>
    </div>
  </div>
  <div class="time" id="current">00:00</div>
  <label><input id="muteChk" type="checkbox" /> Mute</label>
  <input id="volRange" type="range" min="0" max="100" value="100" />
</div>


  <div class="footer">
    <div>Phát từ YouTube • Dán link và bấm Load</div>
    <div id="status">Trạng thái: chờ</div>
  </div>

  <!-- iframe YouTube (ẩn) -->
  <div id="playerHolder" class="hidden"></div>
</div>

<!-- Gọi CSS và JS -->
<link rel="stylesheet" href="music-player.css">
<script src="https://www.youtube.com/iframe_api"></script>
<script src="music-player.js"></script>



  <script>
    const logged = <?= $logged ? 'true' : 'false' ?>;
  </script>
  <script src="script.js"></script>
</body>
</html>
