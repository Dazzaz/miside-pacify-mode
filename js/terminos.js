/* ===================================================
   MISide — Términos & Privacidad JS
   =================================================== */

// ── Reveal ──
const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
}, { threshold: 0.06 });
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

// ── Smooth TOC scroll ──
document.querySelectorAll('.toc-list a').forEach(a => {
    a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// ── Cookie preferences manager ──
const LS_KEY = 'misideCookieConsent';

function loadPrefs() {
    const saved = localStorage.getItem(LS_KEY);
    const analyticsToggle = document.getElementById('ck-analytics');
    const functionalToggle = document.getElementById('ck-functional');
    if (saved === 'accepted') {
        if (analyticsToggle) analyticsToggle.checked = true;
        if (functionalToggle) functionalToggle.checked = true;
    }
}
loadPrefs();

const saveBtn = document.getElementById('btn-save-prefs');
saveBtn?.addEventListener('click', () => {
    const analytics = document.getElementById('ck-analytics')?.checked;
    const functional = document.getElementById('ck-functional')?.checked;
    // If either is checked, mark as accepted; otherwise rejected
    localStorage.setItem(LS_KEY, (analytics || functional) ? 'accepted' : 'rejected');
    saveBtn.textContent = '✔ PREFERENCIAS GUARDADAS';
    saveBtn.classList.add('saved');
    setTimeout(() => { saveBtn.textContent = 'GUARDAR PREFERENCIAS'; saveBtn.classList.remove('saved'); }, 2500);
});

// Sticky highlight active TOC item
const sections = document.querySelectorAll('.legal-section[id]');
const tocLinks = document.querySelectorAll('.toc-list a');

const secObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            tocLinks.forEach(a => {
                a.style.color = a.getAttribute('href') === '#' + e.target.id ? 'var(--pink-light)' : '';
                a.style.borderColor = a.getAttribute('href') === '#' + e.target.id ? 'rgba(255,107,157,.3)' : '';
                a.style.background = a.getAttribute('href') === '#' + e.target.id ? 'rgba(255,107,157,.06)' : '';
            });
        }
    });
}, { threshold: 0.4 });
sections.forEach(s => secObs.observe(s));

// ── Last updated date displayed ──
const lastUpdated = document.getElementById('last-updated');
if (lastUpdated) lastUpdated.textContent = new Date('2026-03-03').toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
