/* ===================================================
   MISide — Legal Banner JS
   Runs on EVERY page — handles cookie consent
   =================================================== */

(function () {
    'use strict';

    const LS_KEY = 'misideCookieConsent'; // 'accepted' | 'rejected'
    const consent = localStorage.getItem(LS_KEY);
    if (consent) return; // already decided

    // ── Inject HTML ──
    const banner = document.createElement('div');
    banner.id = 'cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Aviso de cookies');
    banner.innerHTML = `
    <span class="ck-icon" aria-hidden="true">🍪</span>
    <div class="ck-text">
      <div class="ck-title">◆ AVISO DE COOKIES &amp; PRIVACIDAD</div>
      <div class="ck-body">
        Usamos cookies esenciales para el funcionamiento del sitio. Sin datos de seguimiento ni publicidad.
        <a href="terminos.html" target="_blank">Ver Términos y Privacidad</a>
      </div>
    </div>
    <div class="ck-btns">
      <button class="ck-reject" id="ck-reject-btn" aria-label="Rechazar cookies">RECHAZAR</button>
      <button class="ck-accept" id="ck-accept-btn" aria-label="Aceptar cookies">ACEPTAR &amp; CONTINUAR</button>
    </div>
  `;
    document.body.appendChild(banner);

    // Show after short delay
    setTimeout(() => banner.classList.add('show'), 900);

    function dismiss(value) {
        localStorage.setItem(LS_KEY, value);
        banner.classList.remove('show');
        banner.classList.add('hide');
        setTimeout(() => banner.remove(), 600);
    }

    document.getElementById('ck-accept-btn')?.addEventListener('click', () => dismiss('accepted'));
    document.getElementById('ck-reject-btn')?.addEventListener('click', () => dismiss('rejected'));
})();
