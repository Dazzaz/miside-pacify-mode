/* =====================================================
   MISide — Background Music JS
   Persists across page navigation via sessionStorage.
   The navigation click = user gesture → autoplay works.
   ===================================================== */

(function () {
    'use strict';

    /* ── Track list ── */
    const TRACKS = [
        { name: 'Little Shy', file: 'assets/Soundtracks/Little Shy - MiSide Zero OST.mp3' },
        { name: 'Brave World', file: 'assets/Soundtracks/Brave World - MiSide Zero OST.mp3' },
        { name: 'Kinder Days', file: 'assets/Soundtracks/Kinder Days - MiSide Zero OST.mp3' },
        { name: 'Ambient Zero', file: 'assets/Soundtracks/Ambient Zero - MiSide Zero OST.mp3' },
        { name: 'Music Ambient', file: 'assets/Soundtracks/Music Ambient 1.wav' },
        { name: 'Ambient Day', file: 'assets/Soundtracks/Music Ambient Day.wav' },
        { name: 'Ambient Scene', file: 'assets/Soundtracks/Music Ambient Scene.wav' },
        { name: 'Ambient Night', file: 'assets/Soundtracks/MusicAmbient Night.wav' },
        { name: 'Menu Theme', file: 'assets/Soundtracks/Music Menu.wav' },
        { name: 'Menu Update', file: 'assets/Soundtracks/MusicMenu Update.wav' },
        { name: 'Tamagotchi', file: 'assets/Soundtracks/MusicTamagotchi.wav' },
        { name: 'Standard', file: 'assets/Soundtracks/MusicStandart.wav' },
    ];

    const SESSION_KEY = 'misideMusicState';   // sessionStorage — persists across navigation
    const ALBUM = 'MiSide Zero OST';
    const BASE_URL = getBaseUrl();

    /* ── Helpers ── */
    function getBaseUrl() {
        const parts = location.pathname.split('/');
        parts.pop();
        return location.origin + parts.join('/') + '/';
    }

    function saveState(extra) {
        try {
            const current = loadState();
            sessionStorage.setItem(SESSION_KEY, JSON.stringify({ ...current, ...extra }));
        } catch (_) { }
    }

    function loadState() {
        try { return JSON.parse(sessionStorage.getItem(SESSION_KEY)) || {}; } catch (_) { return {}; }
    }

    /* ── Build DOM ── */
    function buildPlayer() {
        const btn = document.createElement('button');
        btn.id = 'mb-btn';
        btn.setAttribute('aria-label', 'Música de fondo');
        btn.innerHTML = `
            <span class="mb-icon">🎵</span>
            <span id="mb-bars" aria-hidden="true">
                <span></span><span></span><span></span><span></span><span></span>
            </span>`;

        const panel = document.createElement('div');
        panel.id = 'mb-panel';
        panel.setAttribute('role', 'dialog');
        panel.setAttribute('aria-label', 'Reproductor de música de fondo');
        panel.innerHTML = `
            <div class="mb-panel-header">
                <span class="mb-panel-dot"></span>
                <span class="mb-panel-label">Música de fondo</span>
            </div>
            <div class="mb-track-name" id="mb-track-name">— Selecciona una pista —</div>
            <div class="mb-track-album">${ALBUM}</div>
            <div class="mb-progress-wrap" id="mb-progress-wrap" title="Progreso">
                <div class="mb-progress-fill" id="mb-progress-fill"></div>
            </div>
            <div class="mb-controls">
                <button class="mb-ctrl" id="mb-prev" title="Anterior" aria-label="Pista anterior">⏮</button>
                <button class="mb-ctrl mb-play-btn" id="mb-play" title="Play / Pausa" aria-label="Play / Pausa">▶</button>
                <button class="mb-ctrl" id="mb-next" title="Siguiente" aria-label="Siguiente pista">⏭</button>
                <button class="mb-ctrl" id="mb-shuffle" title="Aleatorio" aria-label="Aleatorio">⇆</button>
                <button class="mb-ctrl" id="mb-repeat" title="Repetir" aria-label="Repetir pista">↻</button>
            </div>
            <div class="mb-volume-row">
                <span class="mb-vol-ico">🔈</span>
                <input type="range" class="mb-vol-slider" id="mb-vol" min="0" max="100" value="60" aria-label="Volumen">
                <span class="mb-vol-ico">🔊</span>
            </div>
            <div class="mb-tracklist-row">
                <button class="mb-tracklist-toggle" id="mb-tl-toggle">▾ LISTA DE PISTAS</button>
                <div class="mb-tracklist" id="mb-tracklist"></div>
            </div>`;

        document.body.appendChild(btn);
        document.body.appendChild(panel);
        return { btn, panel };
    }

    /* ── Player Logic ── */
    function init() {
        const { btn, panel } = buildPlayer();

        const audio = new Audio();
        audio.preload = 'none';

        // State
        let currentIndex = 0;
        let playing = false;
        let shuffle = false;
        let repeat = false;
        let panelOpen = false;

        // ── Restore from sessionStorage ──────────────
        const saved = loadState();
        if (typeof saved.index === 'number') currentIndex = Math.min(saved.index, TRACKS.length - 1);
        if (typeof saved.shuffle === 'boolean') shuffle = saved.shuffle;
        if (typeof saved.repeat === 'boolean') repeat = saved.repeat;
        audio.loop = repeat;

        // DOM refs
        const playBtn = panel.querySelector('#mb-play');
        const prevBtn = panel.querySelector('#mb-prev');
        const nextBtn = panel.querySelector('#mb-next');
        const shuffleBtn = panel.querySelector('#mb-shuffle');
        const repeatBtn = panel.querySelector('#mb-repeat');
        const volSlider = panel.querySelector('#mb-vol');
        const progressWrap = panel.querySelector('#mb-progress-wrap');
        const progressFill = panel.querySelector('#mb-progress-fill');
        const trackName = panel.querySelector('#mb-track-name');
        const tlToggle = panel.querySelector('#mb-tl-toggle');
        const tracklist = panel.querySelector('#mb-tracklist');

        // Volume
        const savedVol = typeof saved.volume === 'number' ? saved.volume : 60;
        volSlider.value = savedVol;
        audio.volume = savedVol / 100;

        /* ── Build tracklist ── */
        function buildTracklist() {
            tracklist.innerHTML = '';
            TRACKS.forEach((t, i) => {
                const item = document.createElement('div');
                item.className = 'mb-track-item' + (i === currentIndex ? ' active' : '');
                item.innerHTML = `<span class="mb-ti-num">${String(i + 1).padStart(2, '0')}</span>${t.name}`;
                item.addEventListener('click', () => { loadTrack(i); playAudio(); });
                tracklist.appendChild(item);
            });
        }

        /* ── Load track (without playing) ── */
        function loadTrack(index, seekTo) {
            currentIndex = ((index % TRACKS.length) + TRACKS.length) % TRACKS.length;
            audio.src = BASE_URL + TRACKS[currentIndex].file;
            trackName.textContent = TRACKS[currentIndex].name;
            progressFill.style.width = '0%';

            if (seekTo) {
                // Seek once metadata is available
                audio.addEventListener('loadedmetadata', function onMeta() {
                    audio.currentTime = seekTo;
                    audio.removeEventListener('loadedmetadata', onMeta);
                }, { once: true });
            }

            // Update tracklist active state
            tracklist.querySelectorAll('.mb-track-item').forEach((el, i) => {
                el.classList.toggle('active', i === currentIndex);
            });

            persistState();
        }

        /* ── Play / Pause ── */
        function playAudio() {
            audio.play()
                .then(() => setPlaying(true))
                .catch(err => {
                    // Autoplay blocked (first visit, no gesture yet)
                    console.warn('[MISide Music] Autoplay blocked:', err.message);
                    setPlaying(false);
                });
        }

        function pauseAudio() {
            audio.pause();
            setPlaying(false);
        }

        function setPlaying(state) {
            playing = state;
            playBtn.textContent = state ? '⏸' : '▶';
            btn.classList.toggle('is-playing', state);
            persistState();
        }

        /* ── Persist full state ── */
        function persistState() {
            saveState({
                index: currentIndex,
                time: audio.currentTime || 0,
                volume: +volSlider.value,
                playing: playing,
                shuffle: shuffle,
                repeat: repeat,
            });
        }

        /* ── Save time periodically ── */
        setInterval(() => {
            if (playing) {
                saveState({ time: audio.currentTime });
            }
        }, 1000);

        /* ── Save state before navigating away ── */
        window.addEventListener('beforeunload', () => {
            saveState({
                index: currentIndex,
                time: audio.currentTime || 0,
                volume: +volSlider.value,
                playing: playing,
                shuffle: shuffle,
                repeat: repeat,
            });
        });

        /* ── Next / Prev ── */
        function nextTrack() {
            const idx = shuffle
                ? Math.floor(Math.random() * TRACKS.length)
                : currentIndex + 1;
            loadTrack(idx);
            if (playing) playAudio();
        }

        function prevTrack() {
            if (audio.currentTime > 3) {
                audio.currentTime = 0;
            } else {
                loadTrack(currentIndex - 1);
                if (playing) playAudio();
            }
        }

        /* ── Controls ── */
        playBtn.addEventListener('click', () => {
            if (!audio.src || audio.src === window.location.href) {
                loadTrack(currentIndex);
            }
            playing ? pauseAudio() : playAudio();
        });

        prevBtn.addEventListener('click', prevTrack);
        nextBtn.addEventListener('click', nextTrack);

        shuffleBtn.addEventListener('click', () => {
            shuffle = !shuffle;
            shuffleBtn.style.color = shuffle ? 'var(--mb-pink)' : '';
            persistState();
        });

        repeatBtn.addEventListener('click', () => {
            repeat = !repeat;
            audio.loop = repeat;
            repeatBtn.style.color = repeat ? 'var(--mb-pink)' : '';
            persistState();
        });

        volSlider.addEventListener('input', () => {
            audio.volume = volSlider.value / 100;
            persistState();
        });

        // Auto-next on end
        audio.addEventListener('ended', () => {
            if (!repeat) nextTrack();
        });

        // Progress bar update
        audio.addEventListener('timeupdate', () => {
            if (!audio.duration) return;
            progressFill.style.width = (audio.currentTime / audio.duration * 100) + '%';
        });

        // Seek on click
        progressWrap.addEventListener('click', (e) => {
            if (!audio.duration) return;
            const rect = progressWrap.getBoundingClientRect();
            audio.currentTime = ((e.clientX - rect.left) / rect.width) * audio.duration;
        });

        // Panel toggle
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            panelOpen = !panelOpen;
            panel.classList.toggle('open', panelOpen);
        });

        document.addEventListener('click', (e) => {
            if (panelOpen && !panel.contains(e.target) && e.target !== btn) {
                panelOpen = false;
                panel.classList.remove('open');
            }
        });

        // Track list toggle
        tlToggle.addEventListener('click', () => {
            tracklist.classList.toggle('open');
            tlToggle.textContent = tracklist.classList.contains('open')
                ? '▴ LISTA DE PISTAS'
                : '▾ LISTA DE PISTAS';
        });

        // Media keys
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT') return;
            if (e.key === 'MediaPlayPause') playing ? pauseAudio() : playAudio();
            if (e.key === 'MediaTrackNext') nextTrack();
            if (e.key === 'MediaTrackPrevious') prevTrack();
        });

        /* ── Init: build UI, load track, restore state ── */
        buildTracklist();

        // Restore shuffle/repeat visual
        if (shuffle) shuffleBtn.style.color = 'var(--mb-pink)';
        if (repeat) repeatBtn.style.color = 'var(--mb-pink)';

        // Load track at saved time
        loadTrack(currentIndex, saved.time || 0);

        // ── KEY PART: auto-play if was playing on previous page ──
        // The link click that caused navigation IS a user gesture,
        // so browsers allow autoplay here without blocking.
        if (saved.playing) {
            playAudio();
        }
    }

    /* ── Ready ── */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
