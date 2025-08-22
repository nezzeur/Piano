var context = new AudioContext();
var o = null;
var g = null;

function playPianoNote(frequency, duration = 1) {
    // Arrêter les oscillateurs précédents s'ils existent
    if (o) {
        try { o.stop(); } catch(e) {}
    }
    if (g) {
        try { g.disconnect(); } catch(e) {}
    }

    // Oscillateur principal (fondamentale)
    o = context.createOscillator();
    g = context.createGain();

    // Utiliser une onde sinusoïdale pour la fondamentale
    o.type = 'sine';
    o.frequency.value = frequency;

    // Ajouter des harmoniques pour simuler un piano
    const harmonic2 = context.createOscillator();
    const harmonic3 = context.createOscillator();
    const gain2 = context.createGain();
    const gain3 = context.createGain();

    harmonic2.type = 'sine';
    harmonic2.frequency.value = frequency * 2; // Octave
    harmonic3.type = 'sine';
    harmonic3.frequency.value = frequency * 3; // Quinte

    // Volumes des harmoniques (plus faibles)
    g.gain.value = 0.3; // Volume principal
    gain2.gain.value = 0.1; // Volume harmonique 2
    gain3.gain.value = 0.05; // Volume harmonique 3

    // Connexions
    o.connect(g);
    harmonic2.connect(gain2);
    harmonic3.connect(gain3);

    // Filtre passe-bas pour adoucir le son
    const filter = context.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 2000;
    filter.Q.value = 1;

    g.connect(filter);
    gain2.connect(filter);
    gain3.connect(filter);
    filter.connect(context.destination);

    // Enveloppe ADSR plus réaliste pour piano
    const now = context.currentTime;
    const attackTime = 0.01; // Attaque rapide
    const decayTime = 0.1;   // Décroissance
    const sustainLevel = 0.7; // Niveau de sustain
    const releaseTime = duration * 0.8; // Release progressive

    // Enveloppe pour l'oscillateur principal
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(0.3, now + attackTime);
    g.gain.exponentialRampToValueAtTime(0.2, now + attackTime + decayTime);
    g.gain.exponentialRampToValueAtTime(0.001, now + attackTime + decayTime + releaseTime);

    // Enveloppe pour les harmoniques
    gain2.gain.setValueAtTime(0, now);
    gain2.gain.linearRampToValueAtTime(0.1, now + attackTime);
    gain2.gain.exponentialRampToValueAtTime(0.05, now + attackTime + decayTime);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + attackTime + decayTime + releaseTime);

    gain3.gain.setValueAtTime(0, now);
    gain3.gain.linearRampToValueAtTime(0.05, now + attackTime);
    gain3.gain.exponentialRampToValueAtTime(0.025, now + attackTime + decayTime);
    gain3.gain.exponentialRampToValueAtTime(0.001, now + attackTime + decayTime + releaseTime);

    // Démarrer les oscillateurs
    o.start(now);
    harmonic2.start(now);
    harmonic3.start(now);

    // Arrêter les oscillateurs après la durée
    o.stop(now + attackTime + decayTime + releaseTime + 0.1);
    harmonic2.stop(now + attackTime + decayTime + releaseTime + 0.1);
    harmonic3.stop(now + attackTime + decayTime + releaseTime + 0.1);
}

function playNote(frequency, type) {
    setTimeout(function(){
        playPianoNote(frequency, 1);
    })
}
//  Fréquences des notes
const NOTES = {
    do: 261.6,   // C4
    dos: 277.2,  // C#4
    re: 293.7,   // D4
    res: 311.1,  // D#4
    mi: 329.6,   // E4
    fa: 349.2,   // F4
    fas: 370.0,  // F#4
    sol: 392.0,  // G4
    sols: 415.3, // G#4
    la: 440.0,   // A4
    las: 466.2,  // A#4
    si: 493.9,   // B4
    do2: 523.3,  // C5
    dos2: 554.4, // C#5
    re2: 587.3,  // D5
    res2: 622.3, // D#5
    mi2: 659.3   // E5
};

// Fonction pour jouer une note avec toutes les ondes
function playAllWaves(freq) {
    playNote(freq, 'sine');
    playNote(freq, 'square');
    playNote(freq, 'triangle');
    playNote(freq, 'sawtooth');
}

// Fonction pour ajouter un effet visuel
function highlightKey(element) {
    if (!element) return;
    element.classList.add('playing');
    setTimeout(() => element.classList.remove('playing'), 200);
}

//Clic souris
document.querySelector("#do").addEventListener('click', e => { playAllWaves(NOTES.do); highlightKey(e.target); });
document.querySelector("#re").addEventListener('click', e => { playAllWaves(NOTES.re); highlightKey(e.target); });
document.querySelector("#mi").addEventListener('click', e => { playAllWaves(NOTES.mi); highlightKey(e.target); });
document.querySelector("#fa").addEventListener('click', e => { playAllWaves(NOTES.fa); highlightKey(e.target); });
document.querySelector("#sol").addEventListener('click', e => { playAllWaves(NOTES.sol); highlightKey(e.target); });
document.querySelector("#la").addEventListener('click', e => { playAllWaves(NOTES.la); highlightKey(e.target); });
document.querySelector("#si").addEventListener('click', e => { playAllWaves(NOTES.si); highlightKey(e.target); });
document.querySelector("#do2").addEventListener('click', e => { playAllWaves(NOTES.do2); highlightKey(e.target); });
document.querySelector("#re2").addEventListener('click', e => { playAllWaves(NOTES.re2); highlightKey(e.target); });
document.querySelector("#mi2").addEventListener('click', e => { playAllWaves(NOTES.mi2); highlightKey(e.target); });

document.querySelector('[data-note="C#"]').addEventListener('click', e => { playAllWaves(NOTES.dos); highlightKey(e.target); });
document.querySelector('[data-note="D#"]').addEventListener('click', e => { playAllWaves(NOTES.res); highlightKey(e.target); });
document.querySelector('[data-note="F#"]').addEventListener('click', e => { playAllWaves(NOTES.fas); highlightKey(e.target); });
document.querySelector('[data-note="G#"]').addEventListener('click', e => { playAllWaves(NOTES.sols); highlightKey(e.target); });
document.querySelector('[data-note="A#"]').addEventListener('click', e => { playAllWaves(NOTES.las); highlightKey(e.target); });
document.querySelector('#do2').nextElementSibling.addEventListener('click', e => { playAllWaves(NOTES.dos2); highlightKey(e.target); });
document.querySelector('#re2').nextElementSibling.addEventListener('click', e => { playAllWaves(NOTES.res2); highlightKey(e.target); });

// clavier
document.addEventListener('keydown', (event) => {
    let keyElement = null;
    switch (event.key.toLowerCase()) {
        // Blanches
        case 'q': playAllWaves(NOTES.do); keyElement = document.querySelector("#do"); break;
        case 's': playAllWaves(NOTES.re); keyElement = document.querySelector("#re"); break;
        case 'd': playAllWaves(NOTES.mi); keyElement = document.querySelector("#mi"); break;
        case 'f': playAllWaves(NOTES.fa); keyElement = document.querySelector("#fa"); break;
        case 'g': playAllWaves(NOTES.sol); keyElement = document.querySelector("#sol"); break;
        case 'h': playAllWaves(NOTES.la); keyElement = document.querySelector("#la"); break;
        case 'j': playAllWaves(NOTES.si); keyElement = document.querySelector("#si"); break;
        case 'k': playAllWaves(NOTES.do2); keyElement = document.querySelector("#do2"); break;
        case 'l': playAllWaves(NOTES.re2); keyElement = document.querySelector("#re2"); break;
        case 'm': playAllWaves(NOTES.mi2); keyElement = document.querySelector("#mi2"); break;

        // Noires
        case 'z': playAllWaves(NOTES.dos); keyElement = document.querySelector('[data-note="C#"]'); break;
        case 'e': playAllWaves(NOTES.res); keyElement = document.querySelector('[data-note="D#"]'); break;
        case 't': playAllWaves(NOTES.fas); keyElement = document.querySelector('[data-note="F#"]'); break;
        case 'y': playAllWaves(NOTES.sols); keyElement = document.querySelector('[data-note="G#"]'); break;
        case 'u': playAllWaves(NOTES.las); keyElement = document.querySelector('[data-note="A#"]'); break;
        case 'o': playAllWaves(NOTES.dos2); keyElement = document.querySelector('#do2').nextElementSibling; break;
        case 'p': playAllWaves(NOTES.res2); keyElement = document.querySelector('#re2').nextElementSibling; break;
    }
    highlightKey(keyElement);
});

function playBeethovenElise() {
    const melody = [
        // Partie A - Introduction
        ["mi2", 300], ["res2", 300], ["mi2", 300], ["res2", 300], ["mi2", 300],
        ["si", 300], ["re2", 300], ["do2", 300],
        ["la", 600], [null, 200],
        ["do", 300], ["mi", 300], ["la", 300],
        ["si", 600], [null, 200],
        ["mi", 300], ["sols", 300], ["si", 300],
        ["do2", 600], [null, 200],
        ["mi2", 300], ["res2", 300], ["mi2", 300], ["res2", 300], ["mi2", 300],
        ["si", 300], ["re2", 300], ["do2", 300],
        ["la", 600], [null, 200],
        ["do", 300], ["mi", 300], ["la", 300],
        ["si", 600], [null, 200],
        ["mi", 300], ["do2", 300], ["si", 300],
        ["la", 800],

        // Partie B
        [null, 800],
        ["mi", 300], ["mi2", 300], ["res2", 300], ["mi2", 300],
        ["si", 300], ["la", 300],
        ["sol", 300], ["fa", 300], ["mi", 300],
        ["mi2", 600], [null, 200],
        ["mi", 300], ["mi2", 300], ["res2", 300], ["mi2", 300],
        ["si", 300], ["la", 300],
        ["sol", 300], ["fa", 300], ["mi", 300],
        ["do2", 600], [null, 200],
        ["mi", 300], ["si", 300], ["la", 300], ["si", 300],
        ["la", 300], ["sol", 300], ["fa", 300],
        ["mi", 600], [null, 200],
        ["mi", 300], ["si", 300], ["la", 300], ["si", 300],
        ["la", 300], ["sol", 300], ["fa", 300],
        ["mi", 600], [null, 200],

        // Retour à la Partie A
        ["mi2", 300], ["res2", 300], ["mi2", 300], ["res2", 300], ["mi2", 300],
        ["si", 300], ["re2", 300], ["do2", 300],
        ["la", 600], [null, 200],
        ["do", 300], ["mi", 300], ["la", 300],
        ["si", 600], [null, 200],
        ["mi", 300], ["do2", 300], ["si", 300],
        ["la", 800]
    ];

    let time = 0;
    melody.forEach(([note, duration]) => {
        if (note) {
            setTimeout(() => {
                playAllWaves(NOTES[note]);
                let keyElement = document.querySelector(`#${note}`);
                if (!keyElement) {
                    switch (note) {
                        case "dos": keyElement = document.querySelector('[data-note="C#"]'); break;
                        case "res": keyElement = document.querySelector('[data-note="D#"]'); break;
                        case "fas": keyElement = document.querySelector('[data-note="F#"]'); break;
                        case "sols": keyElement = document.querySelector('[data-note="G#"]'); break;
                        case "las": keyElement = document.querySelector('[data-note="A#"]'); break;
                        case "dos2": keyElement = document.querySelector('#do2').nextElementSibling; break;
                        case "res2": keyElement = document.querySelector('#re2').nextElementSibling; break;
                    }
                }
                highlightKey(keyElement);
            }, time);
        }
        time += duration;
    });
}

document.querySelector("#beethovenelise").addEventListener("click", playBeethovenElise);

function playAuClairDeLaLune() {
    const melody = [
        // "Au clair de la lune, mon ami Pierrot"
        ["do", 500], ["do", 500], ["do", 500], ["re", 500],
        ["mi", 500], ["re", 500], ["do", 500], ["mi", 500],
        ["re", 500], ["re", 500], ["do", 1000], [null, 300],

        // "Prête-moi ta plume, pour écrire un mot"
        ["do", 500], ["do", 500], ["do", 500], ["re", 500],
        ["mi", 500], ["re", 500], ["do", 500], ["mi", 500],
        ["re", 500], ["re", 500], ["do", 1000], [null, 300],

        // "Ma chandelle est morte, je n'ai plus de feu"
        ["re", 500], ["re", 500], ["re", 500], ["re", 500],
        ["la", 500], ["la", 500], ["sol", 1000], [null, 300],

        // "Ouvre-moi ta porte, pour l'amour de Dieu"
        ["do", 500], ["do", 500], ["do", 500], ["re", 500],
        ["mi", 500], ["re", 500], ["do", 500], ["mi", 500],
        ["re", 500], ["re", 500], ["do", 1000]
    ];

    let time = 0;
    melody.forEach(([note, duration]) => {
        if (note) {
            setTimeout(() => {
                playAllWaves(NOTES[note]);

                // Trouver la touche correspondante
                let keyElement = document.querySelector(`#${note}`);
                if (!keyElement) {
                    switch (note) {
                        case "dos": keyElement = document.querySelector('[data-note="C#"]'); break;
                        case "res": keyElement = document.querySelector('[data-note="D#"]'); break;
                        case "fas": keyElement = document.querySelector('[data-note="F#"]'); break;
                        case "sols": keyElement = document.querySelector('[data-note="G#"]'); break;
                        case "las": keyElement = document.querySelector('[data-note="A#"]'); break;
                        case "dos2": keyElement = document.querySelector('#do2').nextElementSibling; break;
                        case "res2": keyElement = document.querySelector('#re2').nextElementSibling; break;
                    }
                }

                highlightKey(keyElement);
            }, time);
        }
        time += duration;
    });
}
// Relier au bouton
document.querySelector("#auclairdelalune").addEventListener("click", playAuClairDeLaLune);


function playThrillerRapide() {
    const thrillerMelody = [
        // === PARTIE 1: INTRO TENSION ===
        ["mi", 100], ["fa", 100], ["mi", 100], ["fa", 100], ["mi", 100], ["fa", 100],
        ["sols", 150], ["la", 150], ["sols", 150], ["la", 150],
        [null, 100],

        // Montée de tension rapide
        ["do", 80], ["re", 80], ["mi", 80], ["fa", 80], ["sol", 80], ["la", 80], ["si", 80], ["do2", 80],
        ["si", 80], ["la", 80], ["sol", 80], ["fa", 80], ["mi", 80], ["re", 80], ["do", 80],
        [null, 50],

        // === PARTIE 2: DÉVELOPPEMENT CHROMATIQUE ===
        ["dos", 120], ["re", 120], ["res", 120], ["mi", 120],
        ["fa", 120], ["fas", 120], ["sol", 120], ["sols", 120],
        ["la", 120], ["las", 120], ["si", 120], ["do2", 120],
        [null, 100],

        // Variation du thème chromatique
        ["do2", 110], ["las", 110], ["la", 110], ["sols", 110],
        ["sol", 110], ["fas", 110], ["fa", 110], ["mi", 110],
        ["res", 110], ["re", 110], ["dos", 110], ["do", 110],
        [null, 80],

        // === PARTIE 3: ACCÉLÉRATIONS BRUTALES ===
        ["la", 60], ["si", 60], ["do2", 60], ["re2", 60],
        ["mi2", 60], ["re2", 60], ["do2", 60], ["si", 60],
        ["la", 60], ["sol", 60], ["fa", 60], ["mi", 60],
        ["re", 60], ["do", 60],
        [null, 50],

        // Double vitesse
        ["mi2", 90], ["res2", 90], ["do2", 90], ["si", 90],
        ["las", 90], ["sols", 90], ["sol", 90], ["fas", 90],
        ["fa", 90], ["mi", 90], ["res", 90], ["re", 90],
        ["dos", 90], ["do", 90],
        [null, 80],

        // === PARTIE 4: OSTINATO MENAÇANT ÉTENDU ===
        ["mi", 70], ["sols", 70], ["si", 70], ["mi2", 70],
        ["si", 70], ["sols", 70], ["mi", 70], ["do", 70],
        ["mi", 70], ["sols", 70], ["si", 70], ["mi2", 70],
        ["si", 70], ["sols", 70], ["mi", 70], ["do", 70],
        [null, 60],

        // Variation de l'ostinato
        ["fa", 70], ["la", 70], ["do2", 70], ["fa2", 70],
        ["do2", 70], ["la", 70], ["fa", 70], ["re", 70],
        ["fa", 70], ["la", 70], ["do2", 70], ["fa2", 70],
        ["do2", 70], ["la", 70], ["fa", 70], ["re", 70],
        [null, 60],

        // === PARTIE 5: SECTION DE POURSUITE FRÉNÉTIQUE ===
        ["do2", 50], ["si", 50], ["las", 50], ["sols", 50],
        ["sol", 50], ["fas", 50], ["fa", 50], ["mi", 50],
        ["res", 50], ["re", 50], ["dos", 50], ["do", 50],
        ["do2", 50], ["si", 50], ["las", 50], ["sols", 50],
        [null, 40],

        // Accélération extrême
        ["do", 40], ["dos", 40], ["re", 40], ["res", 40],
        ["mi", 40], ["fa", 40], ["fas", 40], ["sol", 40],
        ["sols", 40], ["la", 40], ["las", 40], ["si", 40],
        ["do2", 40], ["dos2", 40], ["re2", 40], ["res2", 40],
        [null, 30],

        // === PARTIE 6: TRILLES DE PANIQUE ÉTENDUS ===
        ["la", 40], ["si", 40], ["la", 40], ["si", 40], ["la", 40], ["si", 40],
        ["do2", 40], ["re2", 40], ["do2", 40], ["re2", 40], ["do2", 40], ["re2", 40],
        ["mi2", 40], ["res2", 40], ["mi2", 40], ["res2", 40], ["mi2", 40], ["res2", 40],
        [null, 80],

        // Trilles sur d'autres notes
        ["fa", 35], ["sol", 35], ["fa", 35], ["sol", 35], ["fa", 35], ["sol", 35],
        ["sols", 35], ["las", 35], ["sols", 35], ["las", 35], ["sols", 35], ["las", 35],
        ["si", 35], ["do2", 35], ["si", 35], ["do2", 35], ["si", 35], ["do2", 35],
        [null, 70],

        // === PARTIE 7: NOUVEAU DÉVELOPPEMENT ===
        // Séquence mystérieuse rapide
        ["do", 90], ["mi", 90], ["sols", 90], ["do2", 90],
        ["sols", 90], ["mi", 90], ["do", 90], ["sols", 90],
        ["mi", 90], ["do", 90], ["sols", 90], ["mi", 90],
        [null, 100],

        // Variation en mineur
        ["re", 85], ["fa", 85], ["la", 85], ["re2", 85],
        ["la", 85], ["fa", 85], ["re", 85], ["la", 85],
        ["fa", 85], ["re", 85], ["la", 85], ["fa", 85],
        [null, 100],

        // === PARTIE 8: CONSTRUCTION VERS LE CLIMAX ===
        // Montée progressive
        ["do", 75], ["re", 70], ["mi", 65], ["fa", 60],
        ["sol", 55], ["la", 50], ["si", 45], ["do2", 40],
        ["re2", 35], ["mi2", 30], ["fa2", 25], ["sol2", 20],
        [null, 150],

        // Redescente rapide
        ["mi2", 45], ["re2", 45], ["do2", 45], ["si", 45],
        ["la", 45], ["sol", 45], ["fa", 45], ["mi", 45],
        ["re", 45], ["do", 45], ["si", 45], ["la", 45],
        [null, 80],

        // === PARTIE 9: CLIMAX EXPLOSIF ÉTENDU ===
        ["do", 60], ["mi", 60], ["sol", 60], ["do2", 60],
        ["mi2", 60], ["do2", 60], ["sol", 60], ["mi", 60],
        ["do", 60], ["mi", 60], ["sol", 60], ["do2", 60],
        ["mi2", 120], ["re2", 120], ["do2", 120],
        [null, 100],

        // Climax variation
        ["fa", 55], ["la", 55], ["do2", 55], ["fa2", 55],
        ["do2", 55], ["la", 55], ["fa", 55], ["do2", 55],
        ["la", 55], ["fa", 55], ["do2", 55], ["la", 55],
        ["fa", 110], ["sol", 110], ["la", 110],
        [null, 100],

        // === PARTIE 10: SECTION FINALE ÉTENDUE ===
        // Descente vertigineuse longue
        ["mi2", 70], ["re2", 65], ["do2", 60], ["si", 55],
        ["la", 50], ["sol", 45], ["fa", 40], ["mi", 35],
        ["re", 30], ["do", 25], ["si", 20], ["la", 15],
        ["sol", 10], ["fa", 10], ["mi", 10], ["re", 10],
        ["do", 200],
        [null, 150],

        // Écho du thème principal
        ["mi", 120], ["sols", 120], ["si", 120], ["mi2", 120],
        ["si", 120], ["sols", 120], ["mi", 120], ["do", 120],
        [null, 200],

        // Dernières tensions
        ["do2", 80], ["las", 80], ["sols", 80], ["fa", 80],
        ["mi", 80], ["res", 80], ["do", 80], ["si", 80],
        ["la", 80], ["sol", 80], ["fa", 80], ["mi", 80],
        [null, 100],

        // === FINAL BRUTAL ET ÉTENDU ===
        ["do", 80], ["sols", 80], ["mi2", 80], ["do", 80],
        ["sols", 80], ["mi2", 80], ["do2", 200],
        [null, 100],

        // Derniers accords brutaux
        ["do", 150], ["sol", 150], ["do2", 150],
        ["sol", 150], ["do", 150], ["do2", 300],
        ["do", 600]
    ];

    let time = 0;
    thrillerMelody.forEach(([note, duration]) => {
        if (note) {
            setTimeout(() => {
                playAllWaves(NOTES[note]);

                // Trouver la touche correspondante
                let keyElement = document.querySelector(`#${note}`);
                if (!keyElement) {
                    switch (note) {
                        case "dos": keyElement = document.querySelector('[data-note="C#"]'); break;
                        case "res": keyElement = document.querySelector('[data-note="D#"]'); break;
                        case "fas": keyElement = document.querySelector('[data-note="F#"]'); break;
                        case "sols": keyElement = document.querySelector('[data-note="G#"]'); break;
                        case "las": keyElement = document.querySelector('[data-note="A#"]'); break;
                        case "dos2": keyElement = document.querySelector('#do2').nextElementSibling; break;
                        case "res2": keyElement = document.querySelector('#re2').nextElementSibling; break;
                    }
                }

                highlightKey(keyElement);
            }, time);
        }
        time += duration;
    });
}

// Relier au bouton Thriller Rapide
document.querySelector("#thrillerrapide").addEventListener("click", playThrillerRapide);