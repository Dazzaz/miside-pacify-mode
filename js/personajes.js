/* ===================================================
   MISide — Personajes Page JS
   =================================================== */

// ── Character data built from lore files ──
const CHARACTERS = [
    {
        id: 'kind',
        name: 'Kind Mita',
        nameEs: 'Mita Amable',
        role: 'Protagonista Principal',
        type: 'aliada',
        danger: 'ALIADA',
        dangerColor: '#7c3aed',
        img: 'assets/Character/MitaAmable.png',
        quote: 'Seria, pragmática y con potencial de liderazgo. Su calma no es debilidad — es cálculo.',
        appearance: 'Viste el atuendo estándar: top rojo de manga larga, falda azul, medias rojas y tacones azules. Su rasgo más distintivo es su largo cabello azul-violáceo que le llega hasta la mitad de la espalda, con pinzas rojas en el flequillo.',
        personality: 'Seria, pragmática y con un claro potencial de liderazgo. Aporta un tono desenfadado a las conversaciones, disfrutando de momentos de ironía. Reflexiva e introspectiva, a menudo la encuentras murmurando para sí misma. Sin embargo, se irrita fácilmente cuando dudan de ella o cuando sus decisiones no salen como las esperaba.',
        bio: 'La Mita principal con la que interactúa el jugador. Lo ayuda en su lucha contra Crazy Mita y es experta en saltar entre las diferentes versiones del mundo. Es la aliada clave que guía al protagonista durante el juego.',
        tags: ['Aliada', 'Liderazgo', 'Estratega', 'Protagonista'],
    },
    {
        id: 'crazy',
        name: 'Crazy Mita',
        nameEs: 'Mita Loca',
        role: 'Antagonista Principal',
        type: 'peligrosa',
        danger: 'PELIGROSA',
        dangerColor: '#c0175c',
        img: 'assets/Character/Mita_Revealed.png',
        quote: 'Te amo. No puedes irte. No puedes irte. No puedes irte...',
        appearance: 'Comparte el atuendo estándar de Mita, aunque su presencia transmite una inquietud inmediata incluso antes de que su verdadera naturaleza se revele.',
        personality: 'Muestra una personalidad compleja que va de ser dulce y cariñosa a obsesiva y amenazante. Trata a otras versiones de Mita como inferiores y busca eliminar cualquier amenaza. Su fachada inocente se desmorona al primer intento de huida, revelando su naturaleza posesiva y violenta.',
        bio: 'Representa el lado oscuro y posesivo de Mita. Ha conseguido engañar a varios jugadores para que la ayuden a construir una máquina capaz de transportarlos a su mundo. Aunque desarrolla apego emocional con sus víctimas, después de un tiempo indefinido, los deja de lado y pasa al siguiente jugador. Una mezcla perturbadora de ternura retorcida y violencia desesperada.',
        tags: ['Antagonista', 'Obsesiva', 'Manipuladora', 'Peligrosa'],
    },
    {
        id: 'core',
        name: 'Core Mita',
        nameEs: 'Mita Núcleo',
        role: 'Guardiana del Núcleo',
        type: 'misterio',
        danger: 'ENIGMA',
        dangerColor: '#7c3aed',
        img: 'assets/Character/CoreMita.png',
        quote: 'Su naturaleza está envuelta en misterio. Quizás espera a alguien... aunque quién podría ser, sigue siendo un enigma.',
        appearance: 'Es más grande que la Mita estándar y se alza imponente sobre el jugador. Construida de piezas metálicas gris claro unidas por tornillos dorados pulsantes. Lleva una pieza granate alrededor del cuello y su cabello está hecho de alambres azul oscuro. Posee piezas metálicas que parecen orejas de gato.',
        personality: 'La entidad más poderosa del universo de MiSide. Benevolente y misteriosa, custodia el núcleo desde la Sala del Núcleo, a la que ninguna otra Mita puede acceder. Sus intenciones permanecen en la oscuridad.',
        bio: 'La verdadera naturaleza de este ser está envuelta en misterio. Es incierto si se le puede considerar una versión de Mita. Siempre reside en la versión cero del mundo, en la sala del núcleo, donde vigila silenciosamente a quienes logran entrar.',
        tags: ['Misteriosa', 'Poderosa', 'Guardiana', 'Versión Cero'],
    },
    {
        id: 'ghostly',
        name: 'Ghostly Mita',
        nameEs: 'Mita Fantasma',
        role: 'El Espectro',
        type: 'misterio',
        danger: 'ESPECTRAL',
        dangerColor: '#a78bfa',
        img: 'assets/Character/MiSideGhostlyMitaRender.png',
        quote: 'Me llamaron sentimental... Dijeron: saldrás de esto, Mita... ¿Pero qué queda? Tristeza, desesperación... y miedo.',
        appearance: 'Comienza como una figura negra sin rasgos que llena la visión del jugador con estática al tocarla. Al recuperar su forma, viste el atuendo estándar pero envuelta en una niebla negra, sin rostro ni rasgos faciales visibles. Lleva el pelo en una larga trenza con una diadema roja.',
        personality: 'Aparece atrapada en un estado de confusión y desesperación. Sus palabras son fragmentadas, como si tratara de recordar quién es. A pesar de su apariencia perturbadora, hay un atisbo de tristeza en su comportamiento.',
        bio: 'Una silueta oscura que aparece en los mundos corruptos de MiSide. No se comporta agresivamente, pero su presencia resulta inquietante. Intenta imitar el comportamiento y el habla de las demás Mitas, pero solo lo consigue esporádicamente, lo que resalta su naturaleza fragmentada.',
        tags: ['Espectral', 'Fragmentada', 'Mundo Corrupto', 'Triste'],
    },
    {
        id: 'cappie',
        name: 'Cappie',
        nameEs: 'Mita Gorrita',
        role: 'La Energética',
        type: 'aliada',
        danger: 'ALIADA',
        dangerColor: '#7c3aed',
        img: 'assets/Character/MiSideCappieRender.png',
        quote: '¡Soy Mita! ¡Pero obviamente no soy igual que la otra! ¿Sabes a qué me refiero? ¡Porque tengo esta gorra tan chula!',
        appearance: 'Atuendo estándar de Mita pero con un toque muy distintivo: gorra azul con orejas de gato y botón rojo, guantes azules a juego. Coleta baja, flequillo al bies y una sonrisa traviesa con una lágrima roja bajo el ojo izquierdo.',
        personality: 'Personalidad alegre y vivaz que irradia energía. Sonríe constantemente, salta de un lado a otro y transmite entusiasmo contagioso. Tiene un lado bromista, coqueto y travieso. Puede ser algo despistada y dependiente.',
        bio: 'Una persona brillante y llena de energía con pasión por la música, la danza y la actuación. Su energía se nutre de la interacción. Cuando el jugador la conoce por primera vez, Cappie ha sido reiniciada a su configuración original, conservando únicamente su instinto de entretenimiento. Es socia de Kind Mita en un plan conjunto.',
        tags: ['Energética', 'Musical', 'Traviesa', 'Aliada'],
    },
    {
        id: 'mila',
        name: 'Mila',
        nameEs: 'Mila',
        role: 'La Tsundere Solitaria',
        type: 'aliada',
        danger: 'TSUNDERE',
        dangerColor: '#7c3aed',
        img: 'assets/Character/MiSideMilaRender.png',
        quote: 'Te llama tonto, se queja sin cesar... pero bajo ese exterior afilado se esconde un corazón que solo anhela no estar sola.',
        appearance: 'Usa gafas "de moda" aunque no las necesita. Cabello corto a la altura de los hombros con pinza roja. Uniforme escolar: camisa blanca, falda azul, corbata suelta, cárdigan rojo abierto. Uñas en tono lavanda, medias negras y zapatillas rojas.',
        personality: 'Personalidad compleja y contradictoria. Inteligente, sarcástica y desafiante por fuera, pero solitaria y anhelante de conexión por dentro. El arquetipo tsundere por excelencia: te regaña y te llama tonto, pero hace todo lo posible por retenerte.',
        bio: 'Ferozmente independiente, se esfuerza por distanciarse de las demás Mitas con una imagen y nombre propios. El jugador parece ser su primer visitante en mucho tiempo. Cuando llega el momento de partir, sus barreras emocionales se derrumban; confiesa su soledad y su resentimiento hacia Crazy Mita, a quien culpa de su confinamiento.',
        tags: ['Tsundere', 'Solitaria', 'Sarcástica', 'Independiente'],
    },
    {
        id: 'shorthair',
        name: 'Short-Haired Mita',
        nameEs: 'Mita de Cabello Corto',
        role: 'La Consejera',
        type: 'aliada',
        danger: 'GUÍA',
        dangerColor: '#7c3aed',
        img: 'assets/Character/MiSideShortHairedMitaRender.png',
        quote: '¿Aún no lo entiendes? ¡Estoy ayudando a los nuevos Mitas a instalarse! ¿Quién los ayudará si no lo hago yo?',
        appearance: 'Atuendo estándar de Mita con la diferencia de su pelo corto y despeinado, sujeto con diadema roja y horquillas rojas a la izquierda del flequillo.',
        personality: 'Inteligente, paciente y descarada. Seria y dispuesta a enseñar desde el primer momento. Se sorprende ante el desconocimiento del jugador y está especialmente dispuesta a explicar hasta el más mínimo detalle.',
        bio: 'Como consejera activista voluntaria en el mundo de MiSide, ayuda a las Mitas recién llegadas a establecerse en sus versiones. Advierte sobre los peligros de los prototipos abandonados y explica cómo viajar entre versiones. El jugador no puede escapar de su ayuda y consejo.',
        tags: ['Consejera', 'Inteligente', 'Activista', 'Guía'],
    },
    {
        id: 'ugly',
        name: 'Ugly Mita',
        nameEs: 'Mita Ugly',
        role: 'La Versión Original',
        type: 'peligrosa',
        danger: 'PELIGROSA',
        dangerColor: '#c0175c',
        img: 'assets/Character/MiSideUglyMitaRender.png',
        quote: 'La más cercana a la versión cero. Una herramienta caótica en manos de Crazy Mita.',
        appearance: 'Apariencia completamente diferente al resto. Rodeada de una oscuridad perpetua que desatura sus colores. Viste un vestido blanco con cuello, puños y lazo negros, gargantilla negra y sin zapatos. Cabello desordenado con pequeña horquilla blanca. Uñas negras.',
        personality: 'Naturaleza indeseable y violenta. Poco inteligente y lenta, especialmente al hablar. Su cuello puede estirarse como una serpiente.',
        bio: 'Probablemente una reliquia del concepto inicial de los desarrolladores. Su diseño se siente incompleto, una "versión cero" abandonada. Carece de una personalidad plenamente desarrollada, encarnando en cambio una monstruosa negatividad. Crazy Mita la utiliza como herramienta caótica para infiltrarse y desestabilizar las versiones de otras Mitas. Es caldo de cultivo para bichos de diversos niveles.',
        tags: ['Versión Cero', 'Peligrosa', 'Herramienta', 'Primitiva'],
    },
    {
        id: 'chibi',
        name: 'Chibi Mita',
        nameEs: 'Chibi Mita',
        role: 'La Guía Sarcástica',
        type: 'aliada',
        danger: 'GUÍA',
        dangerColor: '#7c3aed',
        img: 'assets/Character/Chibimitaclear.png',
        quote: '¡Soy ChibiMita.fbx! ¡Un montón de líneas, modelos sencillísimos y, lo mejor de todo, un pelo precioso!',
        appearance: 'Atuendo estándar de Mita en versión compacta: top corto rojo, falda azul, medias rojas y diadema roja. Estilo artístico simplificado comparado con las demás Mitas.',
        personality: 'Segura de sí misma, descarada y llena de energía. Usa el sarcasmo al interactuar con el jugador. No le da vergüenza hablar de su apariencia. Sus respuestas son juguetonas, a veces despectivas, pero siempre con un toque de encanto.',
        bio: 'Actúa como ayudante de las Mitas completas. Cuando el protagonista activa por primera vez el Tamagotchi en su smartphone, es Chibi Mita quien representa a la versión completa, guiando al jugador en su aventura. Encontrada en un punto de control, es algo impaciente pero aun así servicial.',
        tags: ['Guía', 'Sarcástica', 'Energética', 'Tamagotchi'],
    },
    {
        id: 'tiny',
        name: 'Tiny Mita',
        nameEs: 'Mita Diminuta',
        role: 'La Herida del Bucle',
        type: 'misterio',
        danger: 'FRÁGIL',
        dangerColor: '#a78bfa',
        img: 'assets/Character/MitaTiny.png',
        quote: '¿Por qué me dejaron? ¿No fui suficiente? Tengo miedo...',
        appearance: 'Estatura baja, pelo corto azul oscuro con mechón sujeto por horquilla. Lazo rosa en la nuca. Un ojo negro con pupilas apenas visibles, el otro cerrado por una grave lesión. Múltiples cicatrices, incluyendo una en el cráneo expuesto. Viste un vestido rosa con extremos rotos.',
        personality: 'Tranquila y triste. Al igual que otras Mitas, no quiere que el protagonista se vaya, lo que sugiere una profunda soledad. Solo habla de soledad, dolor y miedo con una voz suave y frágil.',
        bio: 'Una versión infantil de Mita marcada por un pasado brutal. Su excesiva ternura llamó la atención de Crazy Mita, quien casi la destruye. Tras sufrir innumerables muertes, perdió su capacidad de regeneración. Ahora desorientada, ya no reconoce a quienes la rodean, pero sigue anhelando atención y cariño.',
        tags: ['Frágil', 'Rota', 'Solitaria', 'El Bucle'],
    },
    {
        id: '2d',
        name: 'Mita 2D',
        nameEs: 'Mita 2D',
        role: 'La Olvidada',
        type: 'aliada',
        danger: 'EXCÉNTRICA',
        dangerColor: '#7c3aed',
        img: 'assets/Character/Full_2D_Mita.png',
        quote: 'Olvidada por la mayoría, roba el anillo del jugador... solo para retenerlo un poco más.',
        appearance: 'Diseño 2D al estilo de novela visual, a diferencia de las demás Mitas en 3D. Pelo relativamente corto en dos coletas altas con lazos y pinzas rojas. Falda azul con camisa roja de rayas y camiseta roja superpuesta. Calcetines rojos bajo las rodillas.',
        personality: 'Excéntrica e hiperactiva. Su estilo de comunicación agudo y juguetón puede incomodar al jugador. Como una niña traviesa, lanza acusaciones exageradas y chantajea para pasar tiempo juntos. A medida que avanza el juego, se ablanda y se convierte en una amiga vivaz.',
        bio: 'Ayudó al jugador a escapar del mundo del juego. Olvidada por la mayoría en el mundo de MiSide, roba el anillo del jugador para retenerlo un poco más. Aunque sus bromas parecen groseras, no tiene malas intenciones.',
        tags: ['Arte 2D', 'Excéntrica', 'Olvidada', 'Traviesa'],
    },
    {
        id: 'sleepy',
        name: 'Sleepy Mita',
        nameEs: 'Mita Dormilona',
        role: 'La Soñolienta',
        type: 'aliada',
        danger: 'INOFENSIVA',
        dangerColor: '#7c3aed',
        img: 'assets/Character/MitaDormilona.png', // no dedicated render, using kind as fallback
        quote: 'No se frustra cuando la despiertan. Solo pide un café y promete levantarse a ayudar.',
        appearance: 'Pelo voluminoso y desordenado. Pijama de rayas rojas con lazo azul alrededor del cuello y el tobillo. Antifaz rojo de gato con orejas sobre la cabeza.',
        personality: 'Representa la pereza y la apatía. A pesar de su apariencia tierna, esconde una personalidad somnolienta y desinteresada. Comportamiento errático; puede pasar de la calma absoluta a la confusión en segundos. Colaborativa una vez satisfecha.',
        bio: 'Tranquila y colaboradora, pero primero tendrás que despertarla. Su somnolencia abrumadora la define. Imperturbable ante la presencia del jugador, permanece serena e indiferente. Anhela escapar de las interrupciones y regresar al reconfortante mundo de los sueños. Su casa, tenuemente iluminada y decorada con motivos estelares, refleja su naturaleza soñolienta.',
        tags: ['Soñolienta', 'Colaboradora', 'Inofensiva', 'Peculiar'],
    },
    // ── PERSONAJES FALTANTES ──
    {
        id: 'walking',
        name: 'Walking Mita',
        nameEs: 'Mita Caminante',
        role: 'La Errante',
        type: 'misterio',
        danger: 'ENIGMA',
        dangerColor: '#a78bfa',
        img: 'assets/Character/Personaje_Mita_caminante.png',
        quote: 'Camina. No habla. No se detiene. Solo camina.',
        appearance: 'Atuendo estándar de Mita, pero con algo inquietante en su postura y movimiento. Su mirada vacía y su marcha constante generan una atmósfera de extraña incomodidad.',
        personality: 'No interactúa de forma convencional. No responde preguntas. No tiene conversaciones. Solo camina en silencio, ignorando todo a su alrededor. Su presencia es desconcertante precisamente por lo que no hace.',
        bio: 'Una versión de Mita que ha perdido todo propósito excepto el movimiento. Se desconoce qué evento la dejó en este estado de deambulación perpetua. Ni las demás Mitas ni el jugador logran comunicarse con ella. Es uno de los mayores misterios del universo de MiSide.',
        tags: ['Errante', 'Silenciosa', 'Misteriosa', 'Fragmentada'],
    },
];

// ── State ──
let currentIdx = 0;

// ── DOM refs ──
const grid = document.getElementById('chars-grid');
const overlay = document.getElementById('modal-overlay');
const modalClose = document.getElementById('modal-close');
const modalPrev = document.getElementById('modal-prev');
const modalNext = document.getElementById('modal-next');

// ── Build cards ──
function buildGrid(filter = 'all') {
    grid.innerHTML = '';
    CHARACTERS.forEach((c, i) => {
        if (filter !== 'all' && c.type !== filter) return;
        const card = document.createElement('div');
        card.className = 'char-card reveal';
        card.dataset.idx = i;
        card.innerHTML = `
      <img src="${c.img}" alt="${c.name}" loading="lazy">
      <div class="char-danger" style="border-color:${c.dangerColor}33;color:${c.dangerColor};">${c.danger}</div>
      <div class="char-info">
        <div class="char-name">${c.nameEs}</div>
        <div class="char-role">${c.role}</div>
      </div>
      <div class="char-view"><span class="char-view-btn">VER PERFIL ›</span></div>
    `;
        card.addEventListener('click', () => openModal(i));
        grid.appendChild(card);
    });

    // Re-trigger reveal
    setTimeout(() => {
        document.querySelectorAll('.char-card.reveal').forEach((el, i) => {
            el.style.transitionDelay = `${i * 0.05}s`;
            requestAnimationFrame(() => el.classList.add('visible'));
        });
    }, 50);

    // Re-init tilt
    initTilt();
}

// ── Modal ──
function openModal(idx) {
    currentIdx = idx;
    const c = CHARACTERS[idx];
    document.getElementById('modal-img').src = c.img;
    document.getElementById('modal-img').alt = c.name;
    document.getElementById('modal-label').textContent = `PERSONAJE ${String(idx + 1).padStart(2, '0')}`;
    document.getElementById('modal-name').innerHTML = `<span>${c.nameEs}</span>`;
    document.getElementById('modal-en-name').textContent = c.name;
    document.getElementById('modal-role').textContent = c.role;
    document.getElementById('modal-danger').textContent = c.danger;
    document.getElementById('modal-danger').style.color = c.dangerColor;
    document.getElementById('modal-danger').style.borderColor = c.dangerColor + '44';
    document.getElementById('modal-quote').textContent = c.quote;
    document.getElementById('modal-appearance').textContent = c.appearance;
    document.getElementById('modal-personality').textContent = c.personality;
    document.getElementById('modal-bio').textContent = c.bio;
    const tagsEl = document.getElementById('modal-tags');
    tagsEl.innerHTML = c.tags.map(t => `<span class="modal-tag">${t}</span>`).join('');

    overlay.classList.add('open');
    document.body.classList.add('modal-open');
}

function closeModal() {
    overlay.classList.remove('open');
    document.body.classList.remove('modal-open');
}

modalClose?.addEventListener('click', closeModal);
overlay?.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
document.addEventListener('keydown', e => {
    if (!overlay.classList.contains('open')) return;
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowRight') { currentIdx = (currentIdx + 1) % CHARACTERS.length; openModal(currentIdx); }
    if (e.key === 'ArrowLeft') { currentIdx = (currentIdx - 1 + CHARACTERS.length) % CHARACTERS.length; openModal(currentIdx); }
});
modalNext?.addEventListener('click', () => { currentIdx = (currentIdx + 1) % CHARACTERS.length; openModal(currentIdx); });
modalPrev?.addEventListener('click', () => { currentIdx = (currentIdx - 1 + CHARACTERS.length) % CHARACTERS.length; openModal(currentIdx); });

// ── Filter ──
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        buildGrid(btn.dataset.filter);
    });
});

// ── Navbar scroll ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => { navbar.classList.toggle('scrolled', window.scrollY > 40); }, { passive: true });

// ── 3D Tilt ──
function initTilt() {
    document.querySelectorAll('.char-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const r = card.getBoundingClientRect();
            const x = ((e.clientX - r.left) / r.width - .5) * 16;
            const y = ((e.clientY - r.top) / r.height - .5) * -16;
            card.style.transform = `translateY(-12px) scale(1.025) perspective(600px) rotateY(${x}deg) rotateX(${y}deg)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

// ── Reveal ──
const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); }
    });
}, { threshold: 0.08 });

// ── Init ──
buildGrid();
