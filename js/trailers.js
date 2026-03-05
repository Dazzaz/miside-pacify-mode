/* ===================================================
   MISide — Trailers Page JS
   =================================================== */

// ── Trailer database ──
const TRAILERS = [
    {
        id: 1,
        title: 'Trailer Original',
        tag: 'TRAILER OFICIAL',
        meta: 'MiSide — Trailer Original · 2024',
        desc: 'El trailer principal del juego que presentó MiSide al mundo. Aquí comienza todo.',
        src: 'assets/Trailers/MiSide-TrailerOriginal.mp4',
        poster: 'assets/Renders/Promotional Renders/MiSide Zero Promotional Render 1.png',
        dur: '1:48',
    },
    {
        id: 2,
        title: 'Teaser Original',
        tag: 'TEASER',
        meta: 'MiSide — Teaser Original · 2024',
        desc: 'El primer avistamiento del universo MiSide. Misterioso e inquietante desde el primer segundo.',
        src: 'assets/Trailers/MiSide-TeaserOriginal.mp4',
        poster: 'assets/Renders/MiSide Zero Alpha Loading Screen.png',
        dur: '0:58',
    },
    {
        id: 3,
        title: 'Alpha Launch Trailer',
        tag: 'ALPHA',
        meta: 'MiSide Zero Alpha · Launch Trailer',
        desc: 'Trailer de lanzamiento de la versión alpha. El mundo de Mita se expande y oscurece.',
        src: 'assets/Trailers/MiSide Zero Alpha Launch Trailer.mp4',
        poster: 'assets/Renders/Promotional Renders/MiSide Zero Promotional Render 2.png',
        dur: '2:12',
    },
    {
        id: 4,
        title: 'Alpha Announcement Trailer',
        tag: 'ANUNCIO',
        meta: 'MiSide Zero Alpha · Announcement',
        desc: 'El anuncio oficial de la Alpha. La primera vez que el mundo supo que MiSide crecería.',
        src: 'assets/Trailers/MiSide Zero Alpha Announcement Trailer.mp4',
        poster: 'assets/Renders/Announcement Renders/MiSide Zero Alpha Announcement.png',
        dur: '1:30',
    },
    {
        id: 5,
        title: 'Alpha Trailer',
        tag: 'ALPHA',
        meta: 'MiSide Zero Alpha · Gameplay Trailer',
        desc: 'Gameplay y atmósfera de la Alpha. Una mirada más profunda al horror psicológico del juego.',
        src: 'assets/Trailers/MiSide Zero Alpha Trailer.mp4',
        poster: 'assets/Renders/Announcement Renders/MiSide Zero Teaser 1.png',
        dur: '2:05',
    },
];

// ── State ──
let currentIdx = 0;

// ── DOM ──
const featVideo = document.getElementById('featured-video');
const featOverlay = document.getElementById('play-overlay');
const featTitle = document.getElementById('feat-title');
const featMeta = document.getElementById('feat-meta');
const featTag = document.getElementById('feat-tag');
const featPlayTxt = document.getElementById('play-title');
const featPlayMeta = document.getElementById('play-meta');
const grid = document.getElementById('trailers-grid');

// ── Build cards ──
function buildCards() {
    TRAILERS.forEach((t, i) => {
        const card = document.createElement('div');
        card.className = 'trailer-card reveal';
        card.id = `card-${t.id}`;
        card.innerHTML = `
      <div class="card-active-bar"></div>
      <div class="card-thumb">
        <img class="card-thumb-img" src="${t.poster}" alt="${t.title}"
             onerror="this.style.display='none'">
        <div class="card-play">
          <div class="card-play-icon">▶</div>
        </div>
        <span class="card-dur">${t.dur}</span>
        <span class="card-num">0${t.id} ─────</span>
      </div>
      <div class="card-info">
        <div class="card-title">${t.title}</div>
        <div class="card-meta">${t.meta}</div>
        <div class="card-desc">${t.desc}</div>
      </div>
    `;
        card.addEventListener('click', () => selectTrailer(i));
        grid.appendChild(card);

        // Staggered reveal
        setTimeout(() => requestAnimationFrame(() => card.classList.add('visible')), i * 80);
    });
}

// ── Select & load trailer ──
function selectTrailer(idx) {
    currentIdx = idx;
    const t = TRAILERS[idx];

    // Update featured player
    featVideo.pause();
    featVideo.src = t.src;
    featVideo.poster = t.poster;
    featVideo.load();

    // Update info bar
    if (featTitle) featTitle.textContent = t.title;
    if (featMeta) featMeta.textContent = t.meta;
    if (featTag) featTag.textContent = t.tag;
    if (featPlayTxt) featPlayTxt.textContent = t.title;
    if (featPlayMeta) featPlayMeta.textContent = t.meta;

    // Show overlay
    featOverlay?.classList.remove('hidden');

    // Active card
    document.querySelectorAll('.trailer-card').forEach(c => c.classList.remove('active'));
    document.getElementById(`card-${t.id}`)?.classList.add('active');

    // Scroll to player
    document.getElementById('featured')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ── Play overlay click ──
featOverlay?.addEventListener('click', () => {
    featOverlay.classList.add('hidden');
    featVideo.play().catch(() => { });
});

// ── Video ends — show overlay again ──
featVideo?.addEventListener('ended', () => {
    featOverlay?.classList.remove('hidden');
});

// ── Video pause — optional re-show overlay if far from start ──
featVideo?.addEventListener('pause', () => {
    if (featVideo.currentTime < featVideo.duration - 0.5) {
        featOverlay?.classList.remove('hidden');
    }
});
featVideo?.addEventListener('play', () => {
    featOverlay?.classList.add('hidden');
});

// ── Keyboard ──
document.addEventListener('keydown', e => {
    if (e.key === ' ' && document.activeElement.tagName !== 'BUTTON') {
        e.preventDefault();
        if (featVideo?.paused) { featVideo.play(); } else { featVideo?.pause(); }
    }
    if (e.key === 'ArrowRight') selectTrailer((currentIdx + 1) % TRAILERS.length);
    if (e.key === 'ArrowLeft') selectTrailer((currentIdx - 1 + TRAILERS.length) % TRAILERS.length);
});

// ── Navbar scroll ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => { navbar.classList.toggle('scrolled', window.scrollY > 40); }, { passive: true });

// ── Reveal observer ──
const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
}, { threshold: 0.08 });
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

// ── Init — load first trailer ──
buildCards();
selectTrailer(0);
