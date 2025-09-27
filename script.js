// script.js
document.addEventListener('DOMContentLoaded', () => {
  if (!logged) {
    // auth UI
    document.getElementById("showRegister").addEventListener("click", function(e){
      e.preventDefault();
      document.getElementById("loginCard").style.display = "none";
      document.getElementById("registerCard").style.display = "block";
    });

    document.getElementById("showLogin").addEventListener("click", function(e){
      e.preventDefault();
      document.getElementById("registerCard").style.display = "none";
      document.getElementById("loginCard").style.display = "block";
    });


    // register
    document.getElementById('registerForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const res = await fetch('register.php', {method:'POST', body:fd});
      const json = await res.json();
      alert(json.msg);
      if (json.success) {
        location.reload();
      }
    });

    // login
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const res = await fetch('login.php', {method:'POST', body:fd});
      const json = await res.json();
      alert(json.msg);
      if (json.success) location.reload();
    });

    return;
  }

  // Chat logic
  const messagesEl = document.getElementById('messages');
  const sendForm = document.getElementById('sendForm');
  const messageInput = document.getElementById('messageInput');

  let lastId = 0;
  let polling = true;

  function renderMessage(row, selfId) {
    const div = document.createElement('div');
    div.className = 'message ' + (row.sender_id == selfId ? 'self' : 'other');
    const meta = document.createElement('div');
    meta.className = 'meta';
    meta.textContent = row.display_name + ' • ' + new Date(row.created_at).toLocaleString();
    const body = document.createElement('div');
    body.className = 'body';
    body.textContent = row.message;
    div.appendChild(meta);
    div.appendChild(body);
    return div;
  }

  // get current user id (we don't expose ID in session to JS for security, so we'll fetch messages and determine last id)
  // Instead we fetch messages and display; server returns sender_id so we can check self via a small trick:
  // We'll fetch the first time to populate messages and also ask the server to embed our user id by requesting a tiny endpoint.
  // To keep simple, we'll request it from a small endpoint; but to avoid extra file, we can rely on session display_name only.
  // Simpler: we will not highlight self precisely; but we can style using PHP to echo user id into JS if desired.
  // Let's fetch current user id via a safe endpoint
  // For simplicity, let's set window.CURRENT_USER_ID by asking the server to render it in index.php; we didn't, so skip self-highlighting.
  // But in index.php we didn't echo user id; to keep functionality working, we will assume server did echo nothing.
  // We'll still render messages; the CSS will make them all "other".
  // (If you want self-highlighting, add "<?=json_encode($_SESSION['user_id'])?>" in index.php)

  // Start polling
  async function fetchMessages() {
    try {
      const res = await fetch('fetch_messages.php?last_id=' + encodeURIComponent(lastId));
      const json = await res.json();
      if (json.success) {
        for (const m of json.messages) {
          const el = document.createElement('div');
          el.className = 'message other';
          const meta = document.createElement('div');
          meta.className = 'meta';
          meta.textContent = m.display_name + ' • ' + new Date(m.created_at).toLocaleString();
          const body = document.createElement('div');
          body.className = 'body';
          body.textContent = m.message;
          el.appendChild(meta);
          el.appendChild(body);
          messagesEl.appendChild(el);
          lastId = Math.max(lastId, m.id);
        }
        if (json.messages.length) {
          messagesEl.scrollTop = messagesEl.scrollHeight;
        }
      }
    } catch (err) {
      console.error('fetchMessages error', err);
    } finally {
      if (polling) setTimeout(fetchMessages, 1000); // poll mỗi 1s
    }
  }

  fetchMessages();

  sendForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = messageInput.value.trim();
    if (!text) return;
    const fd = new FormData();
    fd.append('message', text);
    const res = await fetch('send_message.php', {method:'POST', body:fd});
    const json = await res.json();
    if (json.success && json.message) {
      // append the message immediately
      const m = json.message;
      const el = document.createElement('div');
      el.className = 'message other';
      const meta = document.createElement('div');
      meta.className = 'meta';
      meta.textContent = m.display_name + ' • ' + new Date(m.created_at).toLocaleString();
      const body = document.createElement('div');
      body.className = 'body';
      body.textContent = m.message;
      el.appendChild(meta);
      el.appendChild(body);
      messagesEl.appendChild(el);
      lastId = Math.max(lastId, m.id);
      messagesEl.scrollTop = messagesEl.scrollHeight;
      messageInput.value = '';
      messageInput.focus();
    } else {
      alert(json.msg || 'Gửi thất bại.');
    }
  });
});

// ép theme luôn là dark
document.documentElement.classList.add("dark");

// nếu có code toggle thì disable nó
const toggle = document.querySelector("#themeToggle");
if (toggle) toggle.remove();
