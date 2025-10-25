// === Canvas nền động ===
const canvas = document.getElementById('bg');
const ctx = canvas.getContext('2d', { alpha: false });
let w, h, dpr;

function resize() {
  dpr = window.devicePixelRatio || 1;
  w = canvas.width = innerWidth * dpr;
  h = canvas.height = innerHeight * dpr;
  ctx.scale(dpr, dpr);
}
window.addEventListener('resize', resize);
resize();

let numParticles = innerWidth < 768 ? 70 : 130;
let numNetwork = innerWidth < 768 ? 30 : 60;

const particles = Array.from({ length: numParticles }, () => ({
  x: Math.random() * innerWidth,
  y: Math.random() * innerHeight,
  r: Math.random() * 1.8 + 0.3,
  dx: (Math.random() - 0.5) * 0.5,
  dy: (Math.random() - 0.5) * 0.5,
  color: Math.random() > 0.5 ? "#ff00ff" : "#00ffff"
}));

const networkParticles = Array.from({ length: numNetwork }, () => ({
  x: Math.random() * innerWidth,
  y: Math.random() * innerHeight,
  vx: (Math.random() - 0.5) * 0.3,
  vy: (Math.random() - 0.5) * 0.3,
  r: Math.random() * 2 + 0.4
}));

function drawBackground() {
  const bg = ctx.createLinearGradient(0, 0, 0, innerHeight);
  bg.addColorStop(0, "#030010");
  bg.addColorStop(1, "#000");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, innerWidth, innerHeight);
}

function draw() {
  drawBackground();
  for (let p of particles) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.shadowBlur = 6;
    ctx.shadowColor = p.color;
    ctx.fill();

    p.x += p.dx; p.y += p.dy;
    if (p.x < 0 || p.x > innerWidth) p.dx *= -1;
    if (p.y < 0 || p.y > innerHeight) p.dy *= -1;
  }

  ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
  ctx.lineWidth = 0.6;
  for (let i = 0; i < networkParticles.length; i++) {
    const p1 = networkParticles[i];
    p1.x += p1.vx;
    p1.y += p1.vy;
    if (p1.x < 0 || p1.x > innerWidth) p1.vx *= -1;
    if (p1.y < 0 || p1.y > innerHeight) p1.vy *= -1;

    ctx.beginPath();
    ctx.arc(p1.x, p1.y, p1.r, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffffcc";
    ctx.fill();

    for (let j = i + 1; j < networkParticles.length; j++) {
      const p2 = networkParticles[j];
      const dx = p1.x - p2.x;
      const dy = p1.y - p2.y;
      const dist = dx * dx + dy * dy;
      if (dist < 90 * 90) {
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(draw);
}
requestAnimationFrame(draw);

// === FPS ===
const fpsEl = document.getElementById('fps');
let last = performance.now(), frames = 0;
function updateFPS() {
  frames++;
  const now = performance.now();
  if (now - last >= 1000) {
    fpsEl.textContent = `FPS: ${frames}`;
    frames = 0;
    last = now;
  }
  requestAnimationFrame(updateFPS);
}
updateFPS();

// === Bộ đếm ngày học code ===
function typeEffect(el, text, speed = 50) {
  let i = 0;
  function typing() {
    if (i < text.length) {
      el.innerHTML += text.charAt(i);
      i++;
      setTimeout(typing, speed);
    }
  }
  typing();
}
function updateCodingDays() {
  const startDate = new Date("2023-09-25");
  const today = new Date();
  const diffDays = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
  const daysText = `${diffDays} days since learning to code`;
  typeEffect(document.getElementById("daysText"), daysText);
}
updateCodingDays();

// === Trình phát nhạc ===
const audio = document.getElementById('audio');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const trackName = document.getElementById('track-name');
const progress = document.getElementById('progress');
const currentEl = document.getElementById('current');
const durationEl = document.getElementById('duration');

const playlist = [
  { src: 'assets/ghequa.mp3', name: 'Ghé Qua' },
  { src: 'assets/nhuanhmo.mp3', name: 'Như Anh Mơ' },
  { src: 'assets/10ngannam.mp3', name: '10 Ngàn Năm' },
  { src: 'assets/langdu.mp3', name: 'Lãng Du' },
  { src: 'assets/comotnguoiluoncuoikhianhden.mp3', name: 'Có Một Người Luôn Cười Khi Anh Đến' },
  { src: 'assets/matbiec.mp3', name: 'Mắt Biếc' },
  { src: 'assets/giacungnhauladuoc.mp3', name: 'Già Cùng Nhau Là Được' },
  { src: 'assets/thoitreroichacanhphaiveday.mp3', name: 'Thôi Trễ Rồi Chắc Anh Phải Về Đây' },
  { src: 'assets/songbien.mp3', name: 'Sóng Biển' },
  { src: 'assets/quanhungtiengve.mp3', name: 'Qua Những Tiếng Ve' },
  { src: 'assets/lacdan.mp3', name: 'Lạc Đàn' },
  { src: 'assets/nhungocuamau.mp3', name: 'Những Ô Cửa Màu' },
  { src: 'assets/mothuothanhbinh.mp3', name: 'Một Thuở Thành Bình' },
  { src: 'assets/huongrung.mp3', name: 'Hương Rừng' },
  { src: 'assets/dungchandunglai.mp3', name: 'Dừng Chân Đứng Lại' },
  { src: 'assets/diquahoacuc.mp3', name: 'Đi Qua Hoa Cúc' },
  { src: 'assets/classiclove.mp3', name: 'Classic Love' },
  
];
let currentTrack = 0;
let isPlaying = false;

function loadTrack(index) {
  const track = playlist[index];
  audio.src = track.src;
  trackName.textContent = track.name;
}

function playTrack() {
  audio.play();
  isPlaying = true;
  playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
  playBtn.classList.add('active');
}
function pauseTrack() {
  audio.pause();
  isPlaying = false;
  playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
  playBtn.classList.remove('active');
}
function prevTrack() {
  currentTrack = (currentTrack - 1 + playlist.length) % playlist.length;
  loadTrack(currentTrack);
  playTrack();
}
function nextTrack() {
  currentTrack = (currentTrack + 1) % playlist.length;
  loadTrack(currentTrack);
  playTrack();
}

playBtn.addEventListener('click', () => (isPlaying ? pauseTrack() : playTrack()));
prevBtn.addEventListener('click', prevTrack);
nextBtn.addEventListener('click', nextTrack);
audio.addEventListener('ended', nextTrack);

// === Thanh thời gian ===
audio.addEventListener('timeupdate', () => {
  if (audio.duration) {
    progress.value = (audio.currentTime / audio.duration) * 100;
    const current = Math.floor(audio.currentTime);
    const duration = Math.floor(audio.duration);
    currentEl.textContent = `${Math.floor(current / 60)}:${String(current % 60).padStart(2, '0')}`;
    durationEl.textContent = `${Math.floor(duration / 60)}:${String(duration % 60).padStart(2, '0')}`;
  }
});
progress.addEventListener('input', () => {
  if (audio.duration) audio.currentTime = (progress.value / 100) * audio.duration;
});

loadTrack(currentTrack);
