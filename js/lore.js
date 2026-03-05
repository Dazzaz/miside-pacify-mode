/* ===================================================
   MISide — Lore Page JS
   =================================================== */

// ── Reading progress bar ──
const readingBar = document.getElementById('reading-bar');
window.addEventListener('scroll', () => {
    const total = document.body.scrollHeight - window.innerHeight;
    const pct = window.scrollY / total;
    if (readingBar) readingBar.style.transform = `scaleX(${pct})`;
}, { passive: true });

// ── Navbar scroll ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => { navbar.classList.toggle('scrolled', window.scrollY > 50); }, { passive: true });

// ── Intersection reveal ──
const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); }
    });
}, { threshold: 0.06, rootMargin: '0px 0px -60px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// ── Parallax hero bg ──
const heroBg = document.querySelector('.hero-bg');
window.addEventListener('scroll', () => {
    if (!heroBg) return;
    heroBg.style.transform = `scale(1.08) translateY(${window.scrollY * .12}px)`;
}, { passive: true });

// ── Timeline dot glow on scroll into view ──
const dotObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
        e.target.style.opacity = e.isIntersecting ? '1' : '0.3';
    });
}, { threshold: 0.5 });
document.querySelectorAll('.t-dot-inner').forEach(d => { d.style.transition = 'opacity .5s'; dotObs.observe(d); });
