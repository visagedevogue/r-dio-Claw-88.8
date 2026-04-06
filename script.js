let currentData = null;
let started = false;
const playlist = ['/audio/intro.wav', '/audio/track1.wav', '/audio/bulletin.wav', '/audio/track2.wav', '/audio/track3.wav', '/audio/track4.wav'];

async function loadLive() {
  const res = await fetch('/api/live');
  const data = await res.json();
  currentData = data;
  document.getElementById('station-name').textContent = data.station.name;
  document.getElementById('tagline').textContent = data.station.tagline;
  document.getElementById('city').textContent = data.station.city;
  document.getElementById('weather').textContent = data.station.weather;
  document.getElementById('song').textContent = data.song.title;
  document.getElementById('artist').textContent = data.song.artist;
  document.getElementById('program').textContent = data.current?.title || 'No ar';
  document.getElementById('host').textContent = data.current?.host || 'World Claw';
  document.getElementById('headline').textContent = data.station.headline;
  document.getElementById('dynamic-news').textContent = data.dynamicNews;
  document.getElementById('sponsor').textContent = data.station.sponsor;
  document.getElementById('quiz-question').textContent = data.station.quizQuestion;

  const schedule = document.getElementById('schedule');
  schedule.innerHTML = '';
  for (const item of data.station.schedule) {
    const div = document.createElement('div');
    div.className = 'schedule-item';
    div.innerHTML = `<strong>${item.time}</strong><span>${item.title} · ${item.host}</span>`;
    schedule.appendChild(div);
  }
}

function startLinearRadio() {
  const player = document.getElementById('radio-player');
  const btn = document.getElementById('play-live');
  if (started) return;
  started = true;
  const now = new Date();
  const trackIndex = Math.floor((now.getMinutes() % (playlist.length * 2)) / 2) % playlist.length;
  player.src = playlist[trackIndex];
  player.currentTime = 0;
  player.play().catch(() => {});
  player.onended = () => {
    const currentPath = new URL(player.src).pathname;
    const idx = playlist.indexOf(currentPath);
    const next = playlist[(idx + 1 + playlist.length) % playlist.length];
    player.src = next;
    player.play().catch(() => {});
  };
  btn.textContent = 'No ar';
}

function bindForms() {
  const requestForm = document.getElementById('request-form');
  const quizForm = document.getElementById('quiz-form');

  requestForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const body = Object.fromEntries(new FormData(requestForm).entries());
    alert('Pedido recebido no MVP. Na próxima versão entra no painel ao vivo.');
    requestForm.insertAdjacentHTML('beforeend', '<p class="notice">Pedido enviado para a rádio.</p>');
    requestForm.reset();
  });

  quizForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const body = Object.fromEntries(new FormData(quizForm).entries());
    alert('Resposta recebida no MVP.');
    quizForm.insertAdjacentHTML('beforeend', '<p class="notice">Resposta enviada. A rádio ouviu.</p>');
    quizForm.reset();
  });
}

loadLive();
bindForms();
document.getElementById('play-live').addEventListener('click', startLinearRadio);
setInterval(loadLive, 30000);
