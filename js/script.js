/* ===================================================
   MISide: Pacify Mode — Main Script v2
   =================================================== */

/* ── Navbar scroll ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ── Hamburger ── */
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
});
navLinks?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    hamburger?.classList.remove('open');
    navLinks.classList.remove('open');
}));

/* ── Hero Parallax ── */
(function initParallax() {
    const heroBg = document.querySelector('.hero-bg');
    const heroChar = document.querySelector('.hero-character');
    if (!heroBg) return;
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const y = window.scrollY;
                heroBg.style.transform = `scale(1.08) translateY(${y * 0.22}px)`;
                if (heroChar) heroChar.style.transform = `translateY(${y * 0.08}px)`;
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
})();

/* ── Hero Particles ── */
(function initParticles() {
    const c = document.querySelector('.hero-particles');
    if (!c) return;
    for (let i = 0; i < 30; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        const size = Math.random() * 4 + 1.5;
        p.style.cssText = `
      left:${Math.random() * 100}%;
      bottom:${Math.random() * -20}%;
      width:${size}px; height:${size}px;
      background:hsl(${320 + Math.random() * 60},90%,${65 + Math.random() * 20}%);
      box-shadow:0 0 ${size * 4}px hsl(${320 + Math.random() * 60},90%,65%);
      animation-duration:${Math.random() * 9 + 5}s;
      animation-delay:${Math.random() * 7}s;
    `;
        c.appendChild(p);
    }
})();

/* ── Reveal on scroll ── */
const revealObs = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
        if (e.isIntersecting) {
            // Stagger siblings
            const siblings = [...e.target.parentElement.querySelectorAll('.reveal')];
            const idx = siblings.indexOf(e.target);
            e.target.style.transitionDelay = `${idx * 0.07}s`;
            e.target.classList.add('visible');
            revealObs.unobserve(e.target);
        }
    });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* ── 3D Tilt on character cards ── */
(function initTilt() {
    document.querySelectorAll('.char-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const r = card.getBoundingClientRect();
            const x = ((e.clientX - r.left) / r.width - 0.5) * 18;
            const y = ((e.clientY - r.top) / r.height - 0.5) * -18;
            card.style.transform = `translateY(-14px) scale(1.03) perspective(600px) rotateY(${x}deg) rotateX(${y}deg)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.transition = 'transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94)';
            setTimeout(() => { card.style.transition = ''; }, 600);
        });
    });
})();

/* ── Periodic glitch on section titles ── */
(function initGlitchTitles() {
    const titles = document.querySelectorAll('.section-title.glitch');
    titles.forEach(el => {
        el.dataset.text = el.textContent;
        let timeout;
        function scheduleGlitch() {
            timeout = setTimeout(() => {
                el.classList.add('glitching');
                setTimeout(() => {
                    el.classList.remove('glitching');
                    scheduleGlitch();
                }, 400);
            }, 3000 + Math.random() * 5000);
        }
        scheduleGlitch();
    });
})();

/* ── Video tabs ── */
(function initTrailer() {
    const videoEl = document.getElementById('main-video');
    const overlay = document.getElementById('video-overlay');
    const infoBar = document.getElementById('vid-info-bar');
    const vovTitle = document.getElementById('vov-title');
    const vovMeta = document.getElementById('vov-meta');
    const vibTitle = document.getElementById('vib-title');
    const vibYear = document.getElementById('vib-year');
    if (!videoEl) return;

    const tabs = document.querySelectorAll('#video-tabs-wrap .vtab');
    if (!tabs.length) return;

    function loadTab(tab) {
        // Mark active
        tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');

        const src = tab.dataset.src;
        const title = tab.dataset.title;
        const year = tab.dataset.year;

        // Update overlay text
        if (vovTitle) vovTitle.textContent = title;
        if (vovMeta) vovMeta.textContent = `MiSide — ${year}`;
        if (vibTitle) vibTitle.textContent = title;
        if (vibYear) vibYear.textContent = year;

        // FIX: set src FIRST, then load()
        videoEl.pause();
        videoEl.src = src;
        videoEl.load();

        // Show overlay, hide info bar
        if (overlay) { overlay.style.opacity = '1'; overlay.style.pointerEvents = 'all'; }
        if (infoBar) infoBar.classList.remove('visible');
    }

    // Init first tab
    loadTab(tabs[0]);

    // Tab clicks
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            loadTab(tab);
            // If we click the already-active one, just replay
            videoEl.currentTime = 0;
        });
    });

    // Overlay click → play (wait for canplay if not buffered yet)
    overlay?.addEventListener('click', () => {
        const doPlay = () => {
            videoEl.play().catch(() => { });
            overlay.style.opacity = '0';
            overlay.style.pointerEvents = 'none';
            if (infoBar) infoBar.classList.add('visible');
        };
        if (videoEl.readyState >= 2) {
            doPlay();
        } else {
            videoEl.addEventListener('canplay', doPlay, { once: true });
        }
    });
    overlay?.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') overlay.click(); });

    // On end → show overlay again + advance to next
    videoEl.addEventListener('ended', () => {
        if (overlay) { overlay.style.opacity = '1'; overlay.style.pointerEvents = 'all'; }
        if (infoBar) infoBar.classList.remove('visible');
        const activeIdx = [...tabs].findIndex(t => t.classList.contains('active'));
        const nextTab = tabs[(activeIdx + 1) % tabs.length];
        loadTab(nextTab);
    });

    // Pause → show overlay
    videoEl.addEventListener('pause', () => {
        if (videoEl.ended) return;
        if (overlay) { overlay.style.opacity = '1'; overlay.style.pointerEvents = 'all'; }
    });
    videoEl.addEventListener('play', () => {
        if (overlay) { overlay.style.opacity = '0'; overlay.style.pointerEvents = 'none'; }
        if (infoBar) infoBar.classList.add('visible');
    });
})();


/* ── Lightbox ── */
(function initLightbox() {
    const lb = document.getElementById('lightbox');
    const lbImg = document.getElementById('lightbox-img');
    const lbClose = document.getElementById('lightbox-close');
    document.querySelectorAll('.gallery-item img').forEach(img => {
        img.addEventListener('click', () => {
            lbImg.src = img.src;
            lb.classList.add('open');
            document.body.style.overflow = 'hidden';
        });
    });
    const close = () => { lb.classList.remove('open'); document.body.style.overflow = ''; };
    lbClose?.addEventListener('click', close);
    lb?.addEventListener('click', e => { if (e.target === lb) close(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
})();

/* ── Soundtrack player ── */
(function initPlayer() {
    const tracks = [
        { name: 'Little Shy', album: 'MiSide Zero OST', src: 'assets/Soundtracks/Little Shy - MiSide Zero OST.mp3', dur: '4:27' },
        { name: 'Brave World', album: 'MiSide Zero OST', src: 'assets/Soundtracks/Brave World - MiSide Zero OST.mp3', dur: '4:08' },
        { name: 'Kinder Days', album: 'MiSide Zero OST', src: 'assets/Soundtracks/Kinder Days - MiSide Zero OST.mp3', dur: '4:42' },
        { name: 'Ambient Zero', album: 'MiSide Zero OST', src: 'assets/Soundtracks/Ambient Zero - MiSide Zero OST.mp3', dur: '4:44' },
    ];
    const list = document.getElementById('track-list');
    const vinyl = document.querySelector('.soundtrack-vinyl');
    if (!list) return;

    let audio = new Audio();
    let currentIdx = null;
    let currentLi = null;

    tracks.forEach((t, i) => {
        const li = document.createElement('div');
        li.className = 'track-item';
        li.setAttribute('role', 'listitem');
        li.innerHTML = `
      <span class="track-num">${i + 1}</span>
      <div class="track-play-icon"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></div>
      <div class="track-info">
        <div class="track-name">${t.name}</div>
        <div class="track-album">${t.album}</div>
      </div>
      <div class="audio-wave"><span></span><span></span><span></span><span></span></div>
      <span class="track-dur">${t.dur}</span>`;

        li.addEventListener('click', () => {
            if (currentIdx === i) {
                if (audio.paused) { audio.play(); li.classList.add('playing'); vinyl?.classList.add('playing'); }
                else { audio.pause(); li.classList.remove('playing'); vinyl?.classList.remove('playing'); }
                return;
            }
            currentLi?.classList.remove('playing');
            vinyl?.classList.remove('playing');
            audio.pause();
            currentIdx = i; currentLi = li;
            audio = new Audio(t.src);
            audio.play();
            li.classList.add('playing');
            vinyl?.classList.add('playing');
            audio.addEventListener('ended', () => {
                li.classList.remove('playing');
                vinyl?.classList.remove('playing');
                currentIdx = null; currentLi = null;
            });
        });
        list.appendChild(li);
    });
})();

/* ── Marquee clone for seamless loop ── */
(function initMarquee() {
    const marquee = document.querySelector('.art-marquee');
    if (!marquee) return;
    marquee.appendChild(marquee.cloneNode(true));
})();

/* ── Active nav section highlight ── */
(function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const links = document.querySelectorAll('.nav-links a[href^="#"]');
    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                links.forEach(l => {
                    const isActive = l.getAttribute('href') === '#' + e.target.id;
                    l.style.color = isActive ? 'var(--pink-light)' : '';
                });
            }
        });
    }, { threshold: 0.35 });
    sections.forEach(s => obs.observe(s));
})();
