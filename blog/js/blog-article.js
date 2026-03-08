/* =============================================
   MISide Blog — blog-article.js
   Shared by all blog article pages
   ============================================= */

(function () {
    'use strict';

    /* ── Navbar hamburger ── */
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('open');
            navLinks.classList.toggle('open');
        });
        navLinks.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => {
                hamburger.classList.remove('open');
                navLinks.classList.remove('open');
            });
        });
    }

    /* ── Navbar scroll ── */
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });

    /* ── Read progress bar ── */
    const progressBar = document.getElementById('read-progress');
    if (progressBar) {
        window.addEventListener('scroll', () => {
            const body = document.body;
            const html = document.documentElement;
            const total = Math.max(body.scrollHeight, html.scrollHeight) - html.clientHeight;
            const pct = Math.min((window.scrollY / total) * 100, 100);
            progressBar.style.width = pct + '%';
        }, { passive: true });
    }

    /* ── Video lazy load ── */
    document.querySelectorAll('video[data-src]').forEach(video => {
        const io = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    video.src = video.dataset.src;
                    video.load();
                    io.unobserve(video);
                }
            });
        }, { rootMargin: '200px' });
        io.observe(video);
    });

    /* ── Spoiler toggle ── */
    document.querySelectorAll('.spoiler-toggle').forEach(btn => {
        btn.addEventListener('click', () => {
            const box = btn.closest('.spoiler-box');
            if (!box) return;
            const content = box.querySelector('.spoiler-content');
            if (!content) return;
            const isHidden = content.style.display === 'none' || !content.style.display;
            content.style.display = isHidden ? 'block' : 'none';
            btn.textContent = isHidden ? '▲ Ocultar spoiler' : '▼ Mostrar contenido (SPOILERS)';
        });
    });

    /* ── Copy-link button ── */
    const copyBtn = document.getElementById('share-copy');
    if (copyBtn) {
        copyBtn.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(location.href);
                copyBtn.textContent = '✓ ¡Copiado!';
                setTimeout(() => copyBtn.textContent = '🔗 Copiar enlace', 2000);
            } catch (_) { }
        });
    }

    /* ── Init ── */
    // Set first filter as active on blog.html if navigated back
})();
