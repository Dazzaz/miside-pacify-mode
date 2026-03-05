/* ===================================================
   MISide — 404 Page JS
   =================================================== */

// ── Navbar scroll ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar?.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ── Hamburger ──
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
});
navLinks?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    hamburger?.classList.remove('open');
    navLinks?.classList.remove('open');
}));

// ── Back button ──
document.getElementById('btn-back')?.addEventListener('click', () => {
    if (document.referrer && document.referrer !== window.location.href) {
        history.back();
    } else {
        window.location.href = 'index.html';
    }
});

// ── Terminal typing effect ──
const lines = [
    { prefix: 'SYS', text: 'Error 404 — Ruta no encontrada', color: 'pink' },
    { prefix: 'MEM', text: 'Mita no detectada en esta versión', color: '' },
    { prefix: 'LOG', text: 'Redirigiendo al mundo principal...', color: 'green' },
];
const termEl = document.getElementById('term-output');
let lineIdx = 0;

function typeLine(line) {
    if (!termEl) return;
    const el = document.createElement('div');
    const prefix = document.createElement('span');
    prefix.className = line.color === 'pink' ? 't-pink' : line.color === 'green' ? 't-green' : '';
    prefix.textContent = `[${line.prefix}] `;
    el.appendChild(prefix);
    termEl.appendChild(el);

    let charIdx = 0;
    const interval = setInterval(() => {
        if (charIdx < line.text.length) {
            el.appendChild(document.createTextNode(line.text[charIdx]));
            charIdx++;
        } else {
            clearInterval(interval);
            lineIdx++;
            if (lineIdx < lines.length) {
                setTimeout(() => typeLine(lines[lineIdx]), 400);
            }
        }
    }, 28);
}

// Start typing after half a second
setTimeout(() => typeLine(lines[lineIdx]), 500);

// ── Periodic glitch on image ──
const errImg = document.querySelector('.err-img');
function doGlitch() {
    if (!errImg) return;
    errImg.style.filter = `drop-shadow(0 0 40px rgba(192,23,92,.35)) drop-shadow(0 0 80px rgba(124,58,237,.2)) hue-rotate(${Math.random() * 30 - 15}deg) saturate(${1.2 + Math.random() * .4})`;
    setTimeout(() => {
        errImg.style.filter = 'drop-shadow(0 0 40px rgba(192,23,92,.35)) drop-shadow(0 0 80px rgba(124,58,237,.2))';
    }, 120);
}
setInterval(doGlitch, 3200 + Math.random() * 1800);

// ── Floating particles ──
(function initParticles() {
    const wrap = document.getElementById('particles-404');
    if (!wrap) return;
    for (let i = 0; i < 22; i++) {
        const p = document.createElement('div');
        p.className = 'p404';
        const size = Math.random() * 3.5 + 1;
        Object.assign(p.style, {
            position: 'absolute',
            borderRadius: '50%',
            pointerEvents: 'none',
            left: Math.random() * 100 + '%',
            bottom: Math.random() * -10 + '%',
            width: size + 'px',
            height: size + 'px',
            background: `hsl(${320 + Math.random() * 60},90%,${65 + Math.random() * 20}%)`,
            boxShadow: `0 0 ${size * 4}px hsl(${320 + Math.random() * 60},90%,65%)`,
            animation: `floatP ${Math.random() * 8 + 5}s ${Math.random() * 6}s linear infinite`,
            opacity: String(Math.random() * .6 + .2),
        });
        wrap.appendChild(p);
    }
    // inject keyframes once
    if (!document.getElementById('p404kf')) {
        const st = document.createElement('style');
        st.id = 'p404kf';
        st.textContent = `@keyframes floatP{0%{transform:translateY(0) scale(1);opacity:.6}100%{transform:translateY(-110vh) scale(.4);opacity:0}}`;
        document.head.appendChild(st);
    }
})();
