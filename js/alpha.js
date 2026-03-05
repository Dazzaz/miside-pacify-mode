/* ===================================================
   MISide — Alpha Page JS
   =================================================== */

// ── Navbar scroll ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => { navbar.classList.toggle('scrolled', window.scrollY > 50); }, { passive: true });

// ── Reveal observer ──
const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
}, { threshold: 0.07, rootMargin: '0px 0px -50px 0px' });
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

// ── Hero bg fade-in ──
window.addEventListener('load', () => {
    document.getElementById('hero')?.classList.add('loaded');
});

// ── Trailer tabs ──
const TRAILERS = [
    { label: 'Alpha Launch', src: 'assets/Trailers/MiSide Zero Alpha Launch Trailer.mp4', poster: 'assets/Renders/Promotional Renders/MiSide Zero Promotional Render 2.png' },
    { label: 'Announcement', src: 'assets/Trailers/MiSide Zero Alpha Announcement Trailer.mp4', poster: 'assets/Renders/Announcement Renders/MiSide Zero Alpha Announcement.png' },
    { label: 'Alpha Trailer', src: 'assets/Trailers/MiSide Zero Alpha Trailer.mp4', poster: 'assets/Renders/Announcement Renders/MiSide Zero Teaser 1.png' },
];
let currentTrl = 0;
const trlVideo = document.getElementById('trl-video');
const trlOverlay = document.getElementById('trl-overlay');

function loadTrailer(idx) {
    currentTrl = idx;
    const t = TRAILERS[idx];
    trlVideo.pause();
    trlVideo.src = t.src;
    trlVideo.poster = t.poster;
    trlVideo.load();
    trlOverlay?.classList.remove('hidden');
    document.querySelectorAll('.trl-tab').forEach((tab, i) => tab.classList.toggle('active', i === idx));
}

document.querySelectorAll('.trl-tab').forEach((tab, i) => {
    tab.addEventListener('click', () => loadTrailer(i));
});

trlOverlay?.addEventListener('click', () => {
    trlOverlay.classList.add('hidden');
    trlVideo?.play().catch(() => { });
});

trlVideo?.addEventListener('ended', () => trlOverlay?.classList.remove('hidden'));
trlVideo?.addEventListener('pause', () => { if (trlVideo.currentTime < trlVideo.duration - .5) trlOverlay?.classList.remove('hidden'); });
trlVideo?.addEventListener('play', () => trlOverlay?.classList.add('hidden'));

// ── Concept art lightbox (simple) ──
const lbOverlay = document.getElementById('lb-alpha');
const lbImg = document.getElementById('lb-alpha-img');

document.querySelectorAll('.concept-card[data-src]').forEach(card => {
    card.addEventListener('click', () => {
        if (lbImg) lbImg.src = card.dataset.src;
        lbOverlay?.classList.add('open');
        document.body.style.overflow = 'hidden';
    });
});
lbOverlay?.addEventListener('click', () => {
    lbOverlay.classList.remove('open');
    document.body.style.overflow = '';
});

// ── Keyboard shortcuts ──
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { lbOverlay?.classList.remove('open'); document.body.style.overflow = ''; }
    if (e.key === ' ' && document.activeElement.tagName !== 'BUTTON') {
        e.preventDefault();
        if (trlVideo?.paused) trlVideo.play(); else trlVideo?.pause();
    }
});

// ── Parallax hero bg ──
const heroBg = document.querySelector('.hero-video-bg');
window.addEventListener('scroll', () => {
    if (heroBg && window.scrollY < window.innerHeight) {
        heroBg.style.transform = `scale(1.08) translateY(${window.scrollY * .15}px)`;
    }
}, { passive: true });

// ── Init trailer ──
loadTrailer(0);
