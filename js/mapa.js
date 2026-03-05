/* ===================================================
   MISide — Mapa 3D JS (FPS + Map Picker)
   =================================================== */

import * as THREE from 'https://esm.sh/three@0.160.0';
import { GLTFLoader } from 'https://esm.sh/three@0.160.0/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'https://esm.sh/three@0.160.0/examples/jsm/loaders/DRACOLoader.js';
import { PointerLockControls } from 'https://esm.sh/three@0.160.0/examples/jsm/controls/PointerLockControls.js';

// ── Constants ────────────────────────────────────
const EYE_HEIGHT = 8.6; // ← cambia para ajustar altura del jugador
const SPEED = 1.0; // ← velocidad normal
const SPRINT = 2.5; // ← velocidad con Shift

// ── DOM ──────────────────────────────────────────
const canvas = document.getElementById('map-canvas');
const mapPicker = document.getElementById('map-picker');
const loaderEl = document.getElementById('map-loader');
const loaderBar = document.getElementById('loader-bar');
const loaderPct = document.getElementById('loader-pct');
const loaderName = document.getElementById('loader-map-name');
const enterOverlay = document.getElementById('enter-overlay');
const crosshair = document.getElementById('crosshair');
const hudBadge = document.getElementById('hud-badge');
const hudMapName = document.getElementById('hud-map-name');
const btnBack = document.getElementById('btn-back-picker');
const navbar = document.getElementById('navbar');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

// ── Detect mobile ─────────────────────────────────
const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) || window.innerWidth < 768;

// ── Navbar ───────────────────────────────────────
window.addEventListener('scroll', () => navbar?.classList.toggle('scrolled', window.scrollY > 40), { passive: true });
hamburger?.addEventListener('click', () => { hamburger.classList.toggle('open'); navLinks?.classList.toggle('open'); });

// ── Disclaimer modal ──────────────────────────────
const discModal = document.getElementById('disclaimer-modal');
document.getElementById('disc-accept')?.addEventListener('click', () => {
    discModal?.classList.add('hidden');
    setTimeout(() => discModal?.remove(), 500);
});

// ── Three.js setup (done once, reused per map) ────
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x050312);
scene.fog = new THREE.FogExp2(0x050312, 0.025);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.05, 200);
camera.position.set(0, EYE_HEIGHT, 0);

// Lights
const ambient = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambient);
const dirLight = new THREE.DirectionalLight(0xfff0fa, 1.4);
dirLight.position.set(10, 20, 10);
dirLight.castShadow = true;
dirLight.shadow.mapSize.set(1024, 1024);
scene.add(dirLight);
const pointPink = new THREE.PointLight(0xff6b9d, 0.8, 20);
scene.add(pointPink);

// DRACO
const draco = new DRACOLoader();
draco.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(draco);

// FPS Controls
const fpControls = new PointerLockControls(camera, renderer.domElement);
scene.add(fpControls.getObject());

// ── State ─────────────────────────────────────────
let modelLoaded = false;
let currentModel = null;
let currentEyeHeight = EYE_HEIGHT; // updated per-map after load

// ═══════════════════════════════════════════════════
// MAP PICKER LOGIC
// ═══════════════════════════════════════════════════
document.querySelectorAll('.map-card').forEach(card => {
    card.addEventListener('click', () => {
        const glbPath = card.dataset.glb;
        const mapName = card.dataset.name;
        const eyeH = parseFloat(card.dataset.eyeheight) || EYE_HEIGHT;
        const exposure = parseFloat(card.dataset.exposure) || 1.0;
        const ambInt = parseFloat(card.dataset.ambient) || 0.5;
        startMap(glbPath, mapName, eyeH, exposure, ambInt);
    });
});

function startMap(glbPath, mapName, eyeH = EYE_HEIGHT, exposure = 1.0, ambInt = 0.5) {
    // Apply per-map renderer settings immediately
    renderer.toneMappingExposure = exposure;
    ambient.intensity = ambInt;
    // Hide picker, show loader
    mapPicker.classList.add('hidden');
    loaderEl.classList.remove('hidden');
    if (loaderName) loaderName.textContent = mapName;
    canvas.style.display = 'block';
    setProgress(0);

    // Remove previous model if any
    if (currentModel) {
        scene.remove(currentModel);
        currentModel = null;
    }
    modelLoaded = false;

    // Reset camera
    camera.position.set(0, EYE_HEIGHT, 0);
    fpControls.getObject().position.set(0, EYE_HEIGHT, 0);

    gltfLoader.load(
        glbPath,
        (gltf) => {
            currentModel = gltf.scene;
            currentModel.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    if (child.material) child.material.envMapIntensity = 0.4;
                }
            });

            // Centre at Y=0
            const box = new THREE.Box3().setFromObject(currentModel);
            const centre = box.getCenter(new THREE.Vector3());
            currentModel.position.sub(new THREE.Vector3(centre.x, box.min.y, centre.z));
            scene.add(currentModel);

            // Set spawn using per-map eye height from data-eyeheight
            currentEyeHeight = eyeH;
            camera.position.set(0, eyeH, 0);
            fpControls.getObject().position.set(0, eyeH, 0);

            // Update HUD
            if (hudMapName) hudMapName.textContent = mapName;

            modelLoaded = true;
            setProgress(100);

            setTimeout(() => {
                loaderEl.classList.add('hidden');
                if (isMobile) {
                    document.getElementById('joystick-zone').style.display = 'flex';
                    document.getElementById('look-hint').style.display = 'block';
                    hudBadge.style.display = 'block';
                    btnBack.style.display = 'block';
                } else {
                    enterOverlay.style.display = 'flex';
                }
            }, 500);
        },
        (xhr) => { if (xhr.lengthComputable) setProgress(Math.round(xhr.loaded / xhr.total * 100)); },
        (err) => {
            console.error(err);
            if (loaderPct) loaderPct.textContent = 'ERROR AL CARGAR';
        }
    );
}

function setProgress(pct) {
    if (loaderBar) loaderBar.style.width = pct + '%';
    if (loaderPct) loaderPct.textContent = pct + '%';
}

// ── Back to picker ────────────────────────────────
function backToPicker() {
    fpControls.unlock();
    mapPicker.classList.remove('hidden');
    canvas.style.display = 'none';
    enterOverlay.style.display = 'none';
    crosshair.style.display = 'none';
    hudBadge.style.display = 'none';
    btnBack.style.display = 'none';
    navbar.style.opacity = '1';
    navbar.style.pointerEvents = 'all';
    document.getElementById('joystick-zone').style.display = 'none';
    document.getElementById('look-hint').style.display = 'none';
}
btnBack?.addEventListener('click', backToPicker);

// ═══════════════════════════════════════════════════
// DESKTOP — PointerLockControls
// ═══════════════════════════════════════════════════
enterOverlay?.addEventListener('click', () => { if (modelLoaded) fpControls.lock(); });
canvas.addEventListener('click', () => { if (modelLoaded && !isMobile && !fpControls.isLocked) fpControls.lock(); });

fpControls.addEventListener('lock', () => {
    enterOverlay.style.display = 'none';
    crosshair.style.display = 'block';
    hudBadge.style.display = 'block';
    btnBack.style.display = 'block';
    navbar.style.opacity = '0';
    navbar.style.pointerEvents = 'none';
});
fpControls.addEventListener('unlock', () => {
    if (!mapPicker.classList.contains('hidden')) return; // went back to picker
    enterOverlay.style.display = 'flex';
    crosshair.style.display = 'none';
    navbar.style.opacity = '1';
    navbar.style.pointerEvents = 'all';
});

const keys = {};
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
document.addEventListener('keydown', (e) => {
    keys[e.code] = true;
    if (e.code === 'Escape' && mapPicker.classList.contains('hidden') && !fpControls.isLocked) {
        // ESC released pointer lock → show back btn already, handled above
    }
});
document.addEventListener('keyup', (e) => { keys[e.code] = false; });

function updateDesktopMovement(delta) {
    if (!fpControls.isLocked) return;
    const speed = keys['ShiftLeft'] || keys['ShiftRight'] ? SPRINT : SPEED;
    velocity.x -= velocity.x * 10 * delta;
    velocity.z -= velocity.z * 10 * delta;
    const fwd = (keys['KeyW'] || keys['ArrowUp']) ? 1 : 0;
    const bwd = (keys['KeyS'] || keys['ArrowDown']) ? 1 : 0;
    const left = (keys['KeyA'] || keys['ArrowLeft']) ? 1 : 0;
    const rgt = (keys['KeyD'] || keys['ArrowRight']) ? 1 : 0;
    direction.z = fwd - bwd;
    direction.x = rgt - left;
    direction.normalize();
    if (fwd || bwd) velocity.z -= direction.z * speed * 50 * delta;
    if (left || rgt) velocity.x -= direction.x * speed * 50 * delta;
    fpControls.moveRight(-velocity.x * delta);
    fpControls.moveForward(-velocity.z * delta);
    fpControls.getObject().position.y = currentEyeHeight;
}

// ═══════════════════════════════════════════════════
// MOBILE — Virtual Joystick + Touch Look
// ═══════════════════════════════════════════════════
const joyKnob = document.getElementById('joystick-knob');
let joyActive = false, joyId = null;
let joyOrigin = { x: 0, y: 0 };
let joyDelta = { x: 0, y: 0 };
let lookId = null, lookLast = { x: 0, y: 0 };
const lookSens = 0.003;
let yaw = 0, pitch = 0;
const mobileEuler = new THREE.Euler(0, 0, 0, 'YXZ');

document.addEventListener('touchstart', (e) => {
    for (const t of e.changedTouches) {
        if (t.clientX < window.innerWidth / 2) {
            if (joyId === null) { joyId = t.identifier; joyActive = true; joyOrigin = { x: t.clientX, y: t.clientY }; }
        } else {
            if (lookId === null) { lookId = t.identifier; lookLast = { x: t.clientX, y: t.clientY }; }
        }
    }
}, { passive: true });

document.addEventListener('touchmove', (e) => {
    for (const t of e.changedTouches) {
        if (t.identifier === joyId) {
            const dx = t.clientX - joyOrigin.x, dy = t.clientY - joyOrigin.y;
            const dist = Math.min(Math.sqrt(dx * dx + dy * dy), 40);
            const angle = Math.atan2(dy, dx);
            joyDelta = { x: Math.cos(angle) * dist / 40, y: Math.sin(angle) * dist / 40 };
            if (joyKnob) joyKnob.style.transform = `translate(calc(-50% + ${Math.cos(angle) * dist}px), calc(-50% + ${Math.sin(angle) * dist}px))`;
        }
        if (t.identifier === lookId) {
            yaw -= (t.clientX - lookLast.x) * lookSens;
            pitch -= (t.clientY - lookLast.y) * lookSens;
            pitch = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, pitch));
            lookLast = { x: t.clientX, y: t.clientY };
        }
    }
}, { passive: true });

document.addEventListener('touchend', (e) => {
    for (const t of e.changedTouches) {
        if (t.identifier === joyId) { joyId = null; joyActive = false; joyDelta = { x: 0, y: 0 }; if (joyKnob) joyKnob.style.transform = 'translate(-50%,-50%)'; }
        if (t.identifier === lookId) lookId = null;
    }
}, { passive: true });

function updateMobileMovement(delta) {
    if (!modelLoaded || !isMobile) return;
    mobileEuler.set(pitch, yaw, 0);
    camera.quaternion.setFromEuler(mobileEuler);
    if (joyActive && (joyDelta.x !== 0 || joyDelta.y !== 0)) {
        const ms = 1.5 * delta;
        const fwd = new THREE.Vector3(-Math.sin(yaw), 0, -Math.cos(yaw)).multiplyScalar(-joyDelta.y * ms);
        const side = new THREE.Vector3(-Math.cos(yaw), 0, Math.sin(yaw)).multiplyScalar(-joyDelta.x * ms);
        camera.position.add(fwd).add(side);
    }
    camera.position.y = currentEyeHeight;
}

// ── Resize ───────────────────────────────────────
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// ── Render loop ──────────────────────────────────
const clock = new THREE.Clock();
(function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    if (modelLoaded) {
        updateDesktopMovement(delta);
        updateMobileMovement(delta);
        pointPink.position.copy(camera.position);
    }
    renderer.render(scene, camera);
})();
