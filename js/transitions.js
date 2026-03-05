/* ===================================================
   MISide — Page Transitions JS
   Intercepts internal link clicks → glitch exit → navigate
   On load → glitch enter animation
   =================================================== */

(function () {
    'use strict';

    const GLITCH_TEXTS = [
        'CARGANDO NIVEL...',
        'INICIANDO SISTEMA...',
        'ACCESO CONCEDIDO...',
        'MISide ONLINE...',
        'CONECTANDO...',
    ];

    // ── Create overlay ────────────────────────────────
    const overlay = document.createElement('div');
    overlay.id = 'page-transition';
    overlay.innerHTML = `<span class="pt-glitch"></span>`;
    document.body.appendChild(overlay);

    const glitchEl = overlay.querySelector('.pt-glitch');

    function randomGlitch() {
        return GLITCH_TEXTS[Math.floor(Math.random() * GLITCH_TEXTS.length)];
    }

    // ── ENTER: fade out overlay on page load ──────────
    window.addEventListener('DOMContentLoaded', () => {
        glitchEl.textContent = randomGlitch();
        overlay.classList.add('pt-enter');
        overlay.addEventListener('animationend', () => {
            overlay.classList.remove('pt-enter');
            overlay.style.opacity = '0';
        }, { once: true });
    });

    // ── EXIT: intercept internal link clicks ──────────
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a[href]');
        if (!link) return;

        const href = link.getAttribute('href');

        // Skip: external, hash-only, mailto/tel, target=_blank, mapa.html (3D — no transition needed)
        if (!href
            || href.startsWith('http')
            || href.startsWith('//')
            || href.startsWith('#')
            || href.startsWith('mailto:')
            || href.startsWith('tel:')
            || link.target === '_blank'
            || href === 'mapa.html'
        ) return;

        e.preventDefault();

        // Play exit animation
        glitchEl.textContent = randomGlitch();
        overlay.classList.remove('pt-enter');
        overlay.classList.add('pt-exit');

        // Navigate after animation completes (~350ms)
        setTimeout(() => {
            window.location.href = href;
        }, 360);
    });
})();
