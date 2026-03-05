/* ===================================================
   MISide — Galería Page JS
   =================================================== */

// ── Kind Mita Portraits ──
const PORTRAITS = [
    'Portrait by Hiromi 1.png',
    'Portrait by Hiromi 2.png',
    'Portrait by Hiromi 3.png',
    'Portrait by Hiromi 4.png',
    'Portrait by Hiromi 5.png',
];

// ── Art Contest Submissions ──
const CONTEST = [
    '6446.webp', 'AusomeGuy13.webp', 'Benitz.webp', 'BonzoMcBonBon.webp',
    'Depikoov.webp', 'EddiBluewords.webp', 'EzmayaM3148.webp', 'Feanor 1.webp',
    'Feanor.webp', 'ImJuztRuby.webp', 'Keina.webp', 'MRFGX 2.webp', 'MRFGX.webp',
    'Marlene_Otter.webp', 'N0umu 2.webp', 'N0umu.webp', 'OneLazyArtist.webp',
    'PENCILSHRIMP.webp', 'Poster 2.webp', 'Sausage.webp', 'ShadowWeaver 2.webp',
    'ShadowWeaver 3.webp', 'ShadowWeaver.webp', 'SnoreDollar.webp', 'Squintem.webp',
    'Wicho.webp', 'alyaksey.webp', 'amitysy. NOT ELIGIBLE.webp', 'banditosaver 2.webp',
    'banditosaver.webp', 'bataabenn.webp', 'blue_hat_..webp', 'bruh_dude4005.webp',
    'caioox70 2.webp', 'caioox70.webp', 'chillthingxx1.webp', 'chrome_tron.webp',
    'dddd_1235.webp', 'depikoov 2.webp', 'devovas.webp', 'diman5735 2.webp',
    'diman5735.webp', 'fabroxxgp.webp', 'foxigator.webp', 'garfiel_shizaki.webp',
    'itsjenott.webp', 'kawaiiartistic.webp', 'ketroooo.webp', 'konekochen.webp',
    'kraxibenco 2.webp', 'kraxibenco.webp', 'kumiko_art.webp', 'lhain.webp',
    'lilithm.webp', 'marilyns.webp', 'michelangelo_art.webp', 'neiro_lulz.webp',
    'notailsartist.webp', 'occultpie 2.webp', 'occultpie.webp', 'overlordnugget.webp',
    'penartist.webp', 'pigeon_wlf.webp', 'rubixkube.webp', 'sealchan 2.webp',
    'sealchan.webp', 'shirakamifubuki.webp', 'skystreak1.webp', 'tizunai.webp',
];

// ── Build full image list ──
function buildImageList() {
    const imgs = [];

    function push(src, cat, prefix) {
        imgs.push({
            src,
            cat,
            idx: imgs.length,
            label: `${prefix}-${String(imgs.length + 1).padStart(3, '0')}`,
        });
    }

    // Gallery folder — JPG batch
    for (let i = 1; i <= 5; i++)
        push(`assets/Gallery/download (${i}).webp`, 'fan-art', 'GLR');

    // Gallery folder — PNG batch
    for (let i = 1; i <= 145; i++)
        push(`assets/Gallery/download (${i}).webp`, detectCat(i), 'GLR');

    // Kind Mita Portraits
    PORTRAITS.forEach(f =>
        push(`assets/2D Art/Kind Mita Portraits/${f}`, '2d-art', '2DA')
    );

    // Art Contest Submissions (spaces encoded for browser src)
    CONTEST.forEach(f =>
        push(
            `assets/2D Art/MiSide Zero Art Contest/Art Contest Submissions/${f.replace(/ /g, '%20')}`,
            '2d-art',
            'ART'
        )
    );

    return imgs;
}

function detectCat(n) {
    if (n <= 20) return 'arte';
    if (n <= 50) return 'fan-art';
    if (n <= 80) return 'personajes';
    if (n <= 110) return 'escenas';
    return 'arte';
}

const ALL_IMAGES = buildImageList();
const PAGE_SIZE = 40;

// ── State ──
let filtered = [...ALL_IMAGES];
let shown = 0;
let currentCat = 'all';
let currentView = 'masonry';
let lbIndex = 0;

// ── DOM ──
const grid = document.getElementById('masonry-grid');
const countEl = document.getElementById('stats-count');
const noResults = document.getElementById('no-results');
const loadMoreBtn = document.getElementById('btn-load-more');
const searchInput = document.getElementById('search-input');

// ── Render items ──
function renderItems(reset = false) {
    if (reset) { grid.innerHTML = ''; shown = 0; }

    const batch = filtered.slice(shown, shown + PAGE_SIZE);
    batch.forEach((img, i) => {
        const item = document.createElement('div');
        item.className = 'gallery-item reveal';
        item.dataset.cat = img.cat;
        item.dataset.idx = img.idx;
        item.innerHTML = `
      <img src="${img.src}" alt="${img.label}" loading="lazy"
           onerror="this.closest('.gallery-item').style.display='none'">
      <div class="item-overlay">
        <div class="item-overlay-icon">⤢</div>
      </div>
      <span class="item-num">${img.label}</span>
    `;
        item.addEventListener('click', () => openLightbox(filtered.indexOf(img)));
        grid.appendChild(item);

        setTimeout(() => {
            requestAnimationFrame(() => item.classList.add('visible'));
        }, i * 20);
    });

    shown += batch.length;
    loadMoreBtn.classList.toggle('hidden', shown >= filtered.length);
    if (countEl) countEl.textContent = `${filtered.length} imágenes`;
    noResults.classList.toggle('show', filtered.length === 0);
}

// ── Filter ──
function applyFilter() {
    const q = searchInput?.value.toLowerCase().trim() || '';
    filtered = ALL_IMAGES.filter(img => {
        const catMatch = currentCat === 'all' || img.cat === currentCat;
        const searchMatch = q === '' || img.label.toLowerCase().includes(q) || img.cat.includes(q);
        return catMatch && searchMatch;
    });
    thumbsBuilt = false; // rebuild thumbs for new filtered set
    renderItems(true);
}

document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentCat = btn.dataset.filter;
        applyFilter();
    });
});

searchInput?.addEventListener('input', () => {
    clearTimeout(searchInput._t);
    searchInput._t = setTimeout(applyFilter, 280);
});

loadMoreBtn?.addEventListener('click', () => renderItems(false));

// ── View toggle ──
document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentView = btn.dataset.view;
        grid.className = `masonry view-${currentView}`;
    });
});

// ── Lightbox ──
const lb = document.getElementById('lightbox');
const lbImg = document.getElementById('lb-img');
const lbClose = document.getElementById('lb-close');
const lbPrev = document.getElementById('lb-prev');
const lbNext = document.getElementById('lb-next');
const lbInfo = document.getElementById('lb-info');
const lbThumbs = document.getElementById('lb-thumbs');
let thumbsBuilt = false;

function openLightbox(idx) {
    lbIndex = idx;
    loadLbImg();
    lb.classList.add('open');
    document.body.classList.add('lb-open');
    if (!thumbsBuilt) buildThumbs();
    scrollThumbToActive();
}

function closeLightbox() {
    lb.classList.remove('open');
    document.body.classList.remove('lb-open');
}

function loadLbImg() {
    const img = filtered[lbIndex];
    if (!img) return;
    lbImg.classList.add('loading');
    lbImg.src = img.src;
    lbImg.onload = () => lbImg.classList.remove('loading');
    if (lbInfo) lbInfo.textContent = `${img.label}  ·  ${lbIndex + 1} / ${filtered.length}`;
    updateActivethumb();
}

function navigate(dir) {
    lbIndex = (lbIndex + dir + filtered.length) % filtered.length;
    loadLbImg();
    scrollThumbToActive();
}

function buildThumbs() {
    if (!lbThumbs) return;
    lbThumbs.innerHTML = '';
    filtered.forEach((img, i) => {
        const t = document.createElement('div');
        t.className = 'lb-thumb';
        t.dataset.i = i;
        t.innerHTML = `<img src="${img.src}" alt="" loading="lazy" onerror="this.parentElement.style.display='none'">`;
        t.addEventListener('click', () => { lbIndex = i; loadLbImg(); updateActivethumb(); scrollThumbToActive(); });
        lbThumbs.appendChild(t);
    });
    thumbsBuilt = true;
}

function updateActivethumb() {
    if (!lbThumbs) return;
    lbThumbs.querySelectorAll('.lb-thumb').forEach((t, i) => t.classList.toggle('active', i === lbIndex));
}

function scrollThumbToActive() {
    const active = lbThumbs?.querySelector('.lb-thumb.active');
    active?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
}

lbClose?.addEventListener('click', closeLightbox);
lbPrev?.addEventListener('click', () => navigate(-1));
lbNext?.addEventListener('click', () => navigate(1));

document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') navigate(1);
    if (e.key === 'ArrowLeft') navigate(-1);
});

// Touch swipe
let touchStartX = 0;
lb?.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
lb?.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) navigate(dx < 0 ? 1 : -1);
}, { passive: true });

// ── Navbar scroll ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => { navbar.classList.toggle('scrolled', window.scrollY > 40); }, { passive: true });

// ── Init ──
renderItems(true);
