let player = null;
let isPlaying = false;
let progressTimer = null;

const loadBtn = document.getElementById('loadBtn');
const playBtn = document.getElementById('playBtn');
const prevBtn = document.getElementById('prevBtn');
const videoTitle = document.getElementById('videoTitle');
const status = document.getElementById('status');
const progress = document.getElementById('progress');
const progressBar = document.getElementById('progressBar');
const currentEl = document.getElementById('current');
const durationEl = document.getElementById('duration');
const volRange = document.getElementById('volRange');
const muteChk = document.getElementById('muteChk');

function parseYouTubeID(url){
  if(!url) return null;
  const patterns = [
    /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([-_A-Za-z0-9]{11})/,
    /[?&]v=([-_A-Za-z0-9]{11})/,
    /embed\/([-_A-Za-z0-9]{11})/
  ];
  for(const p of patterns){
    const m = url.match(p);
    if(m) return m[1];
  }
  return null;
}
function secsToMMSS(s){
  s = Math.floor(s||0);
  const m = Math.floor(s/60), sec = s%60;
  return String(m).padStart(2,'0')+":"+String(sec).padStart(2,'0');
}
function onYouTubeIframeAPIReady(){
  status.textContent = 'API sẵn sàng';
}
function createPlayer(videoId){
  if(player){ player.loadVideoById(videoId); return; }
  player = new YT.Player('playerHolder', {
    height:'0', width:'0', videoId:videoId,
    playerVars:{controls:0,rel:0,modestbranding:1},
    events:{ onReady:onPlayerReady, onStateChange:onPlayerStateChange }
  });
}
function onPlayerReady(){
  status.textContent = 'Loaded';
  const info = player.getVideoData();
  videoTitle.textContent = info.title || 'Không xác định';
  durationEl.textContent = secsToMMSS(player.getDuration()||0);
  player.setVolume(volRange.value);
  muteChk.checked ? player.mute() : player.unMute();
}
function onPlayerStateChange(e){
  if(e.data === YT.PlayerState.PLAYING){
    isPlaying = true; playBtn.textContent='❚❚'; status.textContent='Đang phát'; startProgressTimer();
  } else {
    isPlaying = false; playBtn.textContent='►'; status.textContent = e.data===0? 'Kết thúc':'Tạm dừng'; stopProgressTimer();
  }
}
function startProgressTimer(){
  stopProgressTimer();
  progressTimer = setInterval(()=>{
    if(!player) return;
    const dur = player.getDuration(), cur = player.getCurrentTime();
    if(dur>0){ progressBar.style.width=(cur/dur*100)+'%'; currentEl.textContent=secsToMMSS(cur); }
  },250);
}
function stopProgressTimer(){ if(progressTimer){clearInterval(progressTimer);progressTimer=null;} }

// UI events
loadBtn.addEventListener('click', ()=>{
  const id = parseYouTubeID(document.getElementById('ytLink').value.trim());
  if(!id){ status.textContent='Link không hợp lệ'; return; }
  createPlayer(id); status.textContent='Đang tải...';
});
playBtn.addEventListener('click', ()=>{ if(player){ player.getPlayerState()===1? player.pauseVideo(): player.playVideo(); }});
prevBtn.addEventListener('click', ()=>{ if(player) player.seekTo(0); });
progress.addEventListener('click', e=>{
  if(!player) return;
  const rect=progress.getBoundingClientRect();
  const pct=(e.clientX-rect.left)/rect.width;
  player.seekTo(player.getDuration()*pct,true);
});
volRange.addEventListener('input', ()=>{
  if(player){ player.setVolume(Number(volRange.value)); if(volRange.value==0){ player.mute(); muteChk.checked=true; } else { player.unMute(); muteChk.checked=false; } }
});
muteChk.addEventListener('change', ()=>{ if(player){ muteChk.checked? player.mute(): player.unMute(); }});

const stopBtn = document.getElementById('stopBtn');
const rewindBtn = document.getElementById('rewindBtn');
const forwardBtn = document.getElementById('forwardBtn');

// Stop (dừng và về đầu)
stopBtn.addEventListener('click', ()=>{
  if(player){
    player.stopVideo();
    progressBar.style.width = '0%';
    currentEl.textContent = "00:00";
  }
});

// Tua lùi 10s
rewindBtn.addEventListener('click', ()=>{
  if(player){
    let t = player.getCurrentTime() - 10;
    if(t < 0) t = 0;
    player.seekTo(t, true);
  }
});

// Tua tới 10s
forwardBtn.addEventListener('click', ()=>{
  if(player){
    let t = player.getCurrentTime() + 10;
    if(t > player.getDuration()) t = player.getDuration();
    player.seekTo(t, true);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const card = document.querySelector(".player-card");
  let isDragging = false;
  let offsetX = 0, offsetY = 0;

  card.addEventListener("mousedown", (e) => {
    isDragging = true;
    offsetX = e.clientX - card.offsetLeft;
    offsetY = e.clientY - card.offsetTop;
    card.style.transition = "none"; // tắt animation khi kéo
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    let x = e.clientX - offsetX;
    let y = e.clientY - offsetY;

    card.style.left = x + "px";
    card.style.top = y + "px";
    card.style.right = "auto";  // bỏ cố định right
    card.style.transform = "none"; // bỏ translateY(-50%)
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
  });
});