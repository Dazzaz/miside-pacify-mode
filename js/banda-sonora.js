/* ===================================================
   MISide — Banda Sonora JS
   =================================================== */

// ── Track database ──
const TRACKS = [
    // ── OST (MP3) ──
    {
        id: 1, title: 'Little Shy', album: 'MiSide Zero OST', type: 'ost',
        src: 'assets/Soundtracks/Little Shy - MiSide Zero OST.mp3', dur: '4:27',
        desc: 'Tema principal del juego. Dulce y pegadizo, con un toque de inocencia perturbadora.',
    },
    {
        id: 2, title: 'Brave World', album: 'MiSide Zero OST', type: 'ost',
        src: 'assets/Soundtracks/Brave World - MiSide Zero OST.mp3', dur: '4:08',
        desc: 'Una melodía de aventura que guía al jugador a través del mundo de Mita.',
    },
    {
        id: 3, title: 'Kinder Days', album: 'MiSide Zero OST', type: 'ost',
        src: 'assets/Soundtracks/Kinder Days - MiSide Zero OST.mp3', dur: '4:42',
        desc: 'Nostálgica y evocadora. Recuerda los días más tranquilos del juego.',
    },
    {
        id: 4, title: 'Ambient Zero', album: 'MiSide Zero OST', type: 'ost',
        src: 'assets/Soundtracks/Ambient Zero - MiSide Zero OST.mp3', dur: '4:44',
        desc: 'Ambiente etéreo y tenso, el sonido del mundo en sus momentos más oscuros.',
    },

    // ── Game Audio (WAV) ──
    { id: 5, title: 'Fight Music', album: 'MiSide — Game Audio', type: 'game', src: 'assets/Soundtracks/FightMusic.wav', dur: '?' },
    { id: 6, title: 'Music Alternative', album: 'MiSide — Game Audio', type: 'game', src: 'assets/Soundtracks/Music Alternative.wav', dur: '?' },
    { id: 7, title: 'Music Ambient 1', album: 'MiSide — Game Audio', type: 'game', src: 'assets/Soundtracks/Music Ambient 1.wav', dur: '?' },
    { id: 8, title: 'Music Ambient Day', album: 'MiSide — Game Audio', type: 'game', src: 'assets/Soundtracks/Music Ambient Day.wav', dur: '?' },
    { id: 9, title: 'Music Ambient Scene', album: 'MiSide — Game Audio', type: 'game', src: 'assets/Soundtracks/Music Ambient Scene.wav', dur: '?' },
    { id: 10, title: 'Music Ambient Scene 2', album: 'MiSide — Game Audio', type: 'game', src: 'assets/Soundtracks/Music Ambient scene 2.wav', dur: '?' },
    { id: 11, title: 'Music Ambient Scene 7', album: 'MiSide — Game Audio', type: 'game', src: 'assets/Soundtracks/Music Ambient scene 7.wav', dur: '?' },
    { id: 12, title: 'Ambient Life Scene 7', album: 'MiSide — Game Audio', type: 'game', src: 'assets/Soundtracks/Music AmbientLife scene 7.wav', dur: '?' },
    { id: 13, title: 'Music Menu', album: 'MiSide — Game Audio', type: 'game', src: 'assets/Soundtracks/Music Menu.wav', dur: '?' },
    { id: 14, title: 'Music Scene 8', album: 'MiSide — Game Audio', type: 'game', src: 'assets/Soundtracks/Music Scene 8.wav', dur: '?' },
    { id: 15, title: 'Music', album: 'MiSide — Game Audio', type: 'game', src: 'assets/Soundtracks/Music.wav', dur: '?' },
    { id: 16, title: 'Ambient Night', album: 'MiSide — Game Audio', type: 'game', src: 'assets/Soundtracks/MusicAmbient Night.wav', dur: '?' },
    { id: 17, title: 'Boss Music', album: 'MiSide — Game Audio', type: 'game', src: 'assets/Soundtracks/MusicBoss.wav', dur: '?' },
    { id: 18, title: 'Fight', album: 'MiSide — Game Audio', type: 'game', src: 'assets/Soundtracks/MusicFight.wav', dur: '?' },
    { id: 19, title: 'Game Music', album: 'MiSide — Game Audio', type: 'game', src: 'assets/Soundtracks/MusicGame.wav', dur: '?' },
    { id: 20, title: 'Menu Update', album: 'MiSide — Game Audio', type: 'game', src: 'assets/Soundtracks/MusicMenu Update.wav', dur: '?' },
    { id: 21, title: 'Menu', album: 'MiSide — Game Audio', type: 'game', src: 'assets/Soundtracks/MusicMenu.wav', dur: '?' },
    { id: 22, title: 'Standard Music', album: 'MiSide — Game Audio', type: 'game', src: 'assets/Soundtracks/MusicStandart.wav', dur: '?' },
    { id: 23, title: 'Tamagotchi Music', album: 'MiSide — Game Audio', type: 'game', src: 'assets/Soundtracks/MusicTamagotchi.wav', dur: '?' },
    { id: 24, title: 'Snaker Music', album: 'MiSide — Game Audio', type: 'game', src: 'assets/Soundtracks/Snaker Music.wav', dur: '?' },
];

// ── Audio engine ──
let audio = new Audio();
let currentIdx = null;
let isPlaying = false;
let isShuffle = false;
let isRepeat = false;
let progInterval = null;

// ── DOM ──
const playBtn = document.getElementById('play-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const shuffleBtn = document.getElementById('shuffle-btn');
const repeatBtn = document.getElementById('repeat-btn');
const progressFill = document.getElementById('progress-fill');
const progressBar = document.getElementById('progress-bar');
const timeEl = document.getElementById('time-current');
const durEl = document.getElementById('time-total');
const titleEl = document.getElementById('now-title');
const albumEl = document.getElementById('now-album');
const volSlider = document.getElementById('vol-slider');
const vinyl = document.querySelector('.vinyl');
const miniPlayer = document.querySelector('.mini-player');
const trackListEls = {}; // map id -> DOM element

// ── Build track list ──
function buildTrackList() {
    const ostCol = document.getElementById('list-ost');
    const gameCol = document.getElementById('list-game');

    TRACKS.forEach((t, i) => {
        const el = document.createElement('div');
        el.className = 'track';
        el.id = `track-${t.id}`;
        el.innerHTML = `
      <span class="track-num">${t.id < 10 ? '0' + t.id : t.id}</span>
      <div class="track-play-icon">▶</div>
      <div class="track-info">
        <div class="track-name">${t.title}</div>
        <div class="track-meta">${t.album}</div>
      </div>
      <div class="track-right">
        <div class="track-wave">
          <span></span><span></span><span></span><span></span>
        </div>
        <span class="track-dur">${t.dur}</span>
      </div>
    `;
        el.addEventListener('click', () => playTrack(i));
        trackListEls[t.id] = el;
        (t.type === 'ost' ? ostCol : gameCol).appendChild(el);
    });
}

// ── Play ──
function playTrack(idx) {
    const t = TRACKS[idx];
    if (!t) return;

    // Deactivate previous
    if (currentIdx !== null) trackListEls[TRACKS[currentIdx].id]?.classList.remove('active');

    currentIdx = idx;
    audio.src = t.src;
    audio.volume = volSlider ? volSlider.value / 100 : 0.8;
    audio.play().catch(() => { }); // catch autoplay block

    isPlaying = true;
    updatePlayBtn();
    setActiveTrack(t.id);
    updateNowPlaying(t);
    startProgress();
    vinyl?.classList.add('playing');
    miniPlayer?.classList.add('playing');
}

function setActiveTrack(id) {
    document.querySelectorAll('.track').forEach(el => el.classList.remove('active'));
    trackListEls[id]?.classList.add('active');
    trackListEls[id]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function updateNowPlaying(t) {
    if (titleEl) titleEl.textContent = t.title;
    if (albumEl) albumEl.textContent = t.album;
}

function updatePlayBtn() {
    if (playBtn) playBtn.textContent = isPlaying ? '⏸' : '▶';
}

// ── Progress ──
function startProgress() {
    clearInterval(progInterval);
    progInterval = setInterval(() => {
        if (!audio.duration) return;
        const pct = (audio.currentTime / audio.duration) * 100;
        if (progressFill) progressFill.style.width = pct + '%';
        if (timeEl) timeEl.textContent = formatTime(audio.currentTime);
        if (durEl) durEl.textContent = formatTime(audio.duration);
    }, 300);
}

function formatTime(s) {
    if (!s || isNaN(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
}

// Seek on click
progressBar?.addEventListener('click', e => {
    if (!audio.duration) return;
    const r = progressBar.getBoundingClientRect();
    audio.currentTime = ((e.clientX - r.left) / r.width) * audio.duration;
});

// ── Controls ──
playBtn?.addEventListener('click', () => {
    if (currentIdx === null) { playTrack(0); return; }
    if (isPlaying) { audio.pause(); isPlaying = false; vinyl?.classList.remove('playing'); miniPlayer?.classList.remove('playing'); }
    else { audio.play(); isPlaying = true; vinyl?.classList.add('playing'); miniPlayer?.classList.add('playing'); }
    updatePlayBtn();
});

prevBtn?.addEventListener('click', () => {
    if (currentIdx === null) return;
    const prev = (currentIdx - 1 + TRACKS.length) % TRACKS.length;
    playTrack(prev);
});

nextBtn?.addEventListener('click', () => {
    if (currentIdx === null) return;
    const next = isShuffle
        ? Math.floor(Math.random() * TRACKS.length)
        : (currentIdx + 1) % TRACKS.length;
    playTrack(next);
});

shuffleBtn?.addEventListener('click', () => {
    isShuffle = !isShuffle;
    shuffleBtn.classList.toggle('active', isShuffle);
});

repeatBtn?.addEventListener('click', () => {
    isRepeat = !isRepeat;
    repeatBtn.classList.toggle('active', isRepeat);
});

// Auto-next
audio.addEventListener('ended', () => {
    if (isRepeat) { audio.currentTime = 0; audio.play(); return; }
    const next = isShuffle
        ? Math.floor(Math.random() * TRACKS.length)
        : (currentIdx + 1) % TRACKS.length;
    playTrack(next);
});

audio.addEventListener('pause', () => { isPlaying = false; updatePlayBtn(); });
audio.addEventListener('play', () => { isPlaying = true; updatePlayBtn(); });

// Volume
volSlider?.addEventListener('input', () => { audio.volume = volSlider.value / 100; });

// ── Keyboard shortcuts ──
document.addEventListener('keydown', e => {
    if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
    if (e.key === ' ') { e.preventDefault(); playBtn?.click(); }
    if (e.key === 'ArrowRight') { nextBtn?.click(); }
    if (e.key === 'ArrowLeft') { prevBtn?.click(); }
});

// ── Navbar scroll ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => { navbar.classList.toggle('scrolled', window.scrollY > 40); }, { passive: true });

// ── Reveal ──
const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); } });
}, { threshold: 0.08 });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// ── Init ──
buildTrackList();
