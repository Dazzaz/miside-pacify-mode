/* =========================================
   MISide: Pacify Mode — descarga.js
   ========================================= */

(function () {
    'use strict';

    /* ── Navbar hamburger ── */
    const hamburger = document.querySelector('.hamburger');
    const navLinks  = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('open');
            hamburger.classList.toggle('open');
        });
        // Close on link click
        navLinks.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => {
                navLinks.classList.remove('open');
                hamburger.classList.remove('open');
            });
        });
    }

    /* ── Navbar scroll shrink ── */
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (navbar) {
            navbar.style.background = window.scrollY > 40
                ? 'rgba(6,4,16,.97)'
                : 'rgba(6,4,16,.85)';
        }
    }, { passive: true });

    /* ── Particles in hero ── */
    function spawnParticles() {
        const container = document.querySelector('.hero-particles');
        if (!container) return;
        for (let i = 0; i < 30; i++) {
            const p = document.createElement('span');
            const size = Math.random() * 2.5 + 1;
            p.style.cssText = `
                position:absolute;
                width:${size}px; height:${size}px;
                border-radius:50%;
                background:${Math.random() > .6 ? 'rgba(255,107,157,' : 'rgba(0,212,255,'}${(Math.random() * .35 + .1).toFixed(2)});
                left:${Math.random() * 100}%;
                top:${Math.random() * 100}%;
                animation: float-p ${(Math.random() * 8 + 6).toFixed(1)}s ease-in-out infinite;
                animation-delay:${(Math.random() * 5).toFixed(1)}s;
            `;
            container.appendChild(p);
        }
    }

    // Particle keyframes injection
    if (!document.getElementById('particle-kf')) {
        const style = document.createElement('style');
        style.id = 'particle-kf';
        style.textContent = `
            @keyframes float-p {
                0%,100%{ transform:translateY(0) scale(1); opacity:.7; }
                50%    { transform:translateY(-28px) scale(1.15); opacity:.25; }
            }`;
        document.head.appendChild(style);
    }

    /* ── Scroll reveal ── */
    function initReveal() {
        const els = document.querySelectorAll('.reveal');
        if (!els.length) return;

        const io = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    const delay = e.target.dataset.delay || 0;
                    setTimeout(() => e.target.classList.add('visible'), delay * 120);
                    io.unobserve(e.target);
                }
            });
        }, { threshold: 0.12 });

        els.forEach(el => io.observe(el));
    }

    /* ── Button ripple ── */
    document.querySelectorAll('.dl-card-btn').forEach(btn => {
        btn.addEventListener('click', function (e) {
            const rect   = this.getBoundingClientRect();
            const ripple = document.createElement('span');
            const size   = Math.max(rect.width, rect.height);
            ripple.style.cssText = `
                position:absolute;
                width:${size}px; height:${size}px;
                left:${e.clientX - rect.left - size/2}px;
                top:${e.clientY - rect.top  - size/2}px;
                border-radius:50%;
                background:rgba(255,255,255,.18);
                transform:scale(0);
                animation:ripple .5s ease-out forwards;
                pointer-events:none;
            `;
            if (!document.getElementById('ripple-kf')) {
                const s = document.createElement('style');
                s.id = 'ripple-kf';
                s.textContent = '@keyframes ripple{to{transform:scale(2.5);opacity:0;}}';
                document.head.appendChild(s);
            }
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 500);
        });
    });

    /* ── Init ── */
    document.addEventListener('DOMContentLoaded', () => {
        spawnParticles();
        initReveal();
    });

})();
