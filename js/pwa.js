/* ===================================================
   MISide PWA — Install Logic JS
   =================================================== */

(function () {
    'use strict';

    // ── Register Service Worker ────────────────────
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(reg => console.log('[PWA] SW registrado:', reg.scope))
                .catch(err => console.warn('[PWA] SW error:', err));
        });
    }

    // ── Inject install UI into page ────────────────
    const btn = document.createElement('button');
    btn.id = 'pwa-install-btn';
    btn.setAttribute('aria-label', 'Instalar MISide como app');
    btn.innerHTML = `
        <span class="pwa-icon">⬇</span>
        <span class="pwa-label">
            <span class="pwa-label-top">INSTALAR APP</span>
            <span class="pwa-label-main">MISide: Pacify Mode</span>
        </span>
        <button id="pwa-dismiss" aria-label="Cerrar">×</button>
    `;

    const toast = document.createElement('div');
    toast.id = 'pwa-toast';
    toast.innerHTML = `✓ &nbsp; ¡App instalada correctamente!`;

    document.body.appendChild(btn);
    document.body.appendChild(toast);

    // ── BeforeInstallPrompt ───────────────────────
    let deferredPrompt = null;

    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        btn.style.display = 'flex';
    });

    // Click install button
    btn.addEventListener('click', async (e) => {
        // Don't trigger if dismiss × was clicked
        if (e.target.id === 'pwa-dismiss' || e.target.closest('#pwa-dismiss')) return;
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        deferredPrompt = null;
        btn.style.display = 'none';

        if (outcome === 'accepted') {
            toast.style.display = 'flex';
            setTimeout(() => { toast.style.display = 'none'; }, 3500);
        }
    });

    // Dismiss button
    document.addEventListener('click', (e) => {
        if (e.target.id === 'pwa-dismiss' || e.target.closest('#pwa-dismiss')) {
            btn.style.display = 'none';
            deferredPrompt = null;
        }
    });

    // Hide if already installed (standalone mode)
    if (window.matchMedia('(display-mode: standalone)').matches) {
        btn.style.display = 'none';
    }

    // Installed event
    window.addEventListener('appinstalled', () => {
        deferredPrompt = null;
        btn.style.display = 'none';
        toast.style.display = 'flex';
        setTimeout(() => { toast.style.display = 'none'; }, 3500);
    });
})();
