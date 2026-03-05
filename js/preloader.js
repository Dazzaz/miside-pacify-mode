/* ===================================================
   MISide: Pacify Mode — Preloader Script v2 "SEXY"
   =================================================== */

(function () {
    'use strict';

    const preloader = document.getElementById('preloader');
    const barFill = document.getElementById('pl-bar-fill');
    const statusText = document.getElementById('pl-status-text');
    const statusPct = document.getElementById('pl-status-pct');
    const logoWrap = document.querySelector('.pl-logo-wrap');

    if (!preloader) return;

    /* ── Lock scroll ── */
    document.body.classList.add('preloading');

    /* ── Loading sequence — game boot style ── */
    const steps = [
        { msg: 'BOOT_SEQUENCE...............OK', pct: 4 },
        { msg: 'LOADING WORLD_DATA', pct: 12 },
        { msg: 'MITA_SYSTEM v2.4.1..........ONLINE', pct: 22 },
        { msg: 'CARGANDO PERSONAJES', pct: 34 },
        { msg: 'SINCRONIZANDO REALIDAD', pct: 46 },
        { msg: 'VERIFICANDO INTEGRIDAD', pct: 58 },
        { msg: 'CARGANDO BANDA SONORA', pct: 68 },
        { msg: 'PACIFY_MODE.EXE...........ACTIVO', pct: 80 },
        { msg: 'AJUSTANDO NIVEL DE DULZURA', pct: 90 },
        { msg: 'ERROR_404: ESCAPE NOT FOUND >_<', pct: 96 },
        { msg: 'BIENVENIDO/A A MISIDE ♥', pct: 100 },
    ];

    /* ── Spawn particles ── */
    (function spawnParticles() {
        const c = preloader.querySelector('.pl-particles');
        if (!c) return;
        // Pink orbs
        for (let i = 0; i < 22; i++) {
            const p = document.createElement('div');
            p.className = 'pl-particle';
            const size = Math.random() * 5 + 2;
            p.style.cssText = `
        left:${Math.random() * 100}%;
        bottom:${Math.random() * -8}%;
        width:${size}px; height:${size}px;
        background:hsl(${320 + Math.random() * 60},90%,${55 + Math.random() * 25}%);
        box-shadow:0 0 ${size * 3}px hsl(${320 + Math.random() * 60},90%,65%);
        animation-duration:${Math.random() * 9 + 5}s;
        animation-delay:${Math.random() * 6}s;
      `;
            c.appendChild(p);
        }
        // Hearts
        const syms = ['♥', '♡', '❤', '✿', '◆', '✦'];
        for (let i = 0; i < 10; i++) {
            const h = document.createElement('span');
            h.className = 'pl-heart';
            h.textContent = syms[Math.floor(Math.random() * syms.length)];
            h.style.cssText = `
        left:${8 + Math.random() * 84}%;
        bottom:${Math.random() * -5}%;
        font-size:${Math.random() * 14 + 7}px;
        animation-duration:${Math.random() * 10 + 7}s;
        animation-delay:${Math.random() * 7}s;
      `;
            c.appendChild(h);
        }
    })();

    /* ── Typewriter ── */
    let typeTimer = null;
    function typeMsg(msg, cb) {
        if (!statusText) { cb?.(); return; }
        clearTimeout(typeTimer);
        statusText.textContent = '';
        let i = 0;
        const isCode = /[_\.]{3,}/.test(msg); // monospace look for system text
        function type() {
            if (i < msg.length) {
                statusText.textContent += msg[i++];
                typeTimer = setTimeout(type, isCode ? 18 + Math.random() * 12 : 22 + Math.random() * 16);
            } else {
                cb?.();
            }
        }
        type();
    }

    /* ── Update bar & pct ── */
    function setProgress(pct) {
        const clamped = Math.min(100, Math.max(0, pct));
        if (barFill) barFill.style.width = clamped + '%';
        if (statusPct) {
            statusPct.textContent = Math.round(clamped) + '%';
            // Glow pulses stronger near 100
            if (clamped > 80) {
                statusPct.style.textShadow = `0 0 ${Math.round(clamped / 5)}px rgba(255,107,157,0.95)`;
            }
        }
        // Update aria
        const track = document.getElementById('pl-bar-track');
        if (track) track.setAttribute('aria-valuenow', Math.round(clamped));
    }

    /* ── Periodic logo glitch hit ── */
    function scheduleGlitch() {
        const delay = 2000 + Math.random() * 4000;
        setTimeout(() => {
            logoWrap?.classList.add('glitch-hit');
            setTimeout(() => logoWrap?.classList.remove('glitch-hit'), 280);
            scheduleGlitch();
        }, delay);
    }

    /* ── HUD clock ── */
    const clockEl = document.getElementById('pl-clock');
    function tickClock() {
        if (!clockEl) return;
        const now = new Date();
        const hh = String(now.getHours()).padStart(2, '0');
        const mm = String(now.getMinutes()).padStart(2, '0');
        const ss = String(now.getSeconds()).padStart(2, '0');
        clockEl.textContent = `${hh}:${mm}:${ss}`;
        setTimeout(tickClock, 1000);
    }

    /* ── Run sequence ── */
    let stepIdx = 0;
    let progCur = 0;
    let animId = null;

    // Smooth interpolation toward target
    function lerpProgress(target) {
        return new Promise(resolve => {
            function tick() {
                const diff = target - progCur;
                if (Math.abs(diff) < 0.3) {
                    progCur = target;
                    setProgress(progCur);
                    resolve();
                    return;
                }
                progCur += diff * 0.07;
                setProgress(progCur);
                animId = requestAnimationFrame(tick);
            }
            tick();
        });
    }

    async function runStep(i) {
        const s = steps[i];
        await lerpProgress(s.pct);
        await new Promise(resolve => typeMsg(s.msg, resolve));
        // Small pause between steps
        await new Promise(r => setTimeout(r, i === steps.length - 1 ? 700 : 320 + Math.random() * 200));
    }

    async function runSequence() {
        for (let i = 0; i < steps.length; i++) {
            await runStep(i);
        }
        dismiss();
    }

    function dismiss() {
        // Brief white flash before exit
        preloader.style.transition = 'none';
        preloader.classList.add('fade-out');
        document.body.classList.remove('preloading');
        preloader.addEventListener('animationend', () => {
            preloader.style.display = 'none';
        }, { once: true });
    }

    /* ── Init ── */
    function init() {
        scheduleGlitch();
        tickClock();
        runSequence();
    }

    // Start after a tiny delay so DOM is painted
    setTimeout(init, 80);

    /* ── Dev: double-click to skip ── */
    preloader.addEventListener('dblclick', () => {
        cancelAnimationFrame(animId);
        clearTimeout(typeTimer);
        dismiss();
    });

})();
