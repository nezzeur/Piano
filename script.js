var context = new AudioContext();
var o = null;
var g = null;

function playNote(frequency, type) {
    setTimeout(function(){
        o = context.createOscillator();
        g = context.createGain();
        o.type = type;
        o.connect(g);
        o.frequency.value = frequency;
        g.connect(context.destination);
        o.start(0);
        g.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + 1);
    })
}

// 🎵 Fréquences des notes
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

// --- Clic souris ---
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

// --- Clavier ---
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
