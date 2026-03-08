/* =========================================
   MISide: Pacify Mode — blog.js
   ========================================= */

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

    /* ── Navbar scroll (matches style.css .scrolled) ── */
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });

    /* ── Category filter ── */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const postCards = document.querySelectorAll('.post-card[data-category]');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Active state
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const category = btn.dataset.filter;

            postCards.forEach(card => {
                const match = category === 'all' || card.dataset.category === category;
                card.style.display = match ? '' : 'none';
                if (match) {
                    // Re-trigger reveal
                    card.classList.remove('visible');
                    setTimeout(() => card.classList.add('visible'), 50);
                }
            });

            // Show empty state if nothing matches
            const grid = document.querySelector('.post-grid');
            const visible = [...postCards].filter(c => c.style.display !== 'none');
            const emptyEl = document.getElementById('blog-empty');
            if (emptyEl) {
                emptyEl.style.display = visible.length === 0 ? 'block' : 'none';
            }
        });
    });

    /* ── Scroll reveal ── */
    function initReveal() {
        const els = document.querySelectorAll('.reveal');
        if (!els.length) return;

        const io = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    const delay = +(e.target.dataset.delay || 0);
                    setTimeout(() => e.target.classList.add('visible'), delay * 100);
                    io.unobserve(e.target);
                }
            });
        }, { threshold: 0.1 });

        els.forEach(el => io.observe(el));
    }

    /* ── Newsletter form (placeholder) ── */
    const nlForm = document.querySelector('.nl-form');
    if (nlForm) {
        nlForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = nlForm.querySelector('.nl-input');
            const btn = nlForm.querySelector('.nl-btn');
            if (!input.value.trim()) return;
            btn.textContent = '✓ ¡Suscrito!';
            btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
            input.value = '';
            setTimeout(() => {
                btn.textContent = 'Suscribirse';
                btn.style.background = '';
            }, 3000);
        });
    }

    /* ── Search ── */
    const searchInput = document.getElementById('blog-search');
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const q = searchInput.value.toLowerCase().trim();
            postCards.forEach(card => {
                const title = card.querySelector('.post-title')?.textContent.toLowerCase() || '';
                const excerpt = card.querySelector('.post-excerpt')?.textContent.toLowerCase() || '';
                card.style.display = (!q || title.includes(q) || excerpt.includes(q)) ? '' : 'none';
            });
        });
    }

    /* ── Init ── */
    document.addEventListener('DOMContentLoaded', () => {
        initReveal();
        // Set first filter as active
        const first = document.querySelector('.filter-btn');
        if (first) first.classList.add('active');
    });

})();
