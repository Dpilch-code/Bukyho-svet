const intro = document.getElementById('intro');
const startButton = document.getElementById('startButton');
const bukyTap = document.getElementById('bukyTap');
const speech = document.getElementById('speech');
const toast = document.getElementById('toast');

let audioCtx = null;
let audioStarted = false;
let soundOn = true;

function showSpeech(text = 'Ahoj kamaráde!') {
  speech.textContent = text;
  speech.classList.remove('show');
  void speech.offsetWidth;
  speech.classList.add('show');
  speak(text);
}

function showToast(text) {
  toast.textContent = text;
  toast.classList.remove('show');
  void toast.offsetWidth;
  toast.classList.add('show');
}

function beep(freq, time, dur, type = 'sine', gain = 0.035) {
  if (!audioCtx || !soundOn) return;

  const osc = audioCtx.createOscillator();
  const g = audioCtx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, time);
  g.gain.setValueAtTime(0.0001, time);
  g.gain.exponentialRampToValueAtTime(gain, time + 0.03);
  g.gain.exponentialRampToValueAtTime(0.0001, time + dur);

  osc.connect(g).connect(audioCtx.destination);
  osc.start(time);
  osc.stop(time + dur + 0.05);
}

function startAudio() {
  if (audioStarted) return;
  audioStarted = true;
  intro.style.display = 'none';

  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const now = audioCtx.currentTime + 0.05;

  // Úvodní znělka
  [392, 523, 659, 784, 659, 523, 392].forEach((freq, i) => {
    beep(freq, now + i * 0.16, 0.14, 'triangle', 0.055);
  });

  // Ptáci zpívají v menu
  setInterval(() => {
    const t = audioCtx.currentTime;
    beep(1450 + Math.random() * 500, t, 0.07, 'sine', 0.022);
    beep(1850 + Math.random() * 500, t + 0.11, 0.06, 'sine', 0.017);
  }, 1500);

  // Jemná melodie v menu
  const melody = [262, 330, 392, 330, 294, 349, 392, 523];
  let step = 0;
  setInterval(() => {
    beep(melody[step % melody.length], audioCtx.currentTime, 0.18, 'triangle', 0.012);
    step++;
  }, 520);

  setTimeout(() => {
    jumpBuky();
    showSpeech('Ahoj kamaráde!');
  }, 650);
}

function speak(text) {
  if (!soundOn || !('speechSynthesis' in window)) return;

  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'cs-CZ';
  u.rate = 0.95;
  u.pitch = 1.25;
  window.speechSynthesis.speak(u);
}

function jumpBuky() {
  bukyTap.classList.remove('jump');
  void bukyTap.offsetWidth;
  bukyTap.classList.add('jump');
}

startButton.addEventListener('click', startAudio);
document.body.addEventListener('touchstart', startAudio, { once: true });

bukyTap.addEventListener('click', () => {
  jumpBuky();
  showSpeech('Ahoj kamaráde!');
});

document.querySelectorAll('.hotspot').forEach(btn => {
  btn.addEventListener('click', () => {
    const action = btn.dataset.action;

    if (audioCtx) beep(520, audioCtx.currentTime, 0.08, 'square', 0.025);

    if (action === 'play') {
      showToast('Hru spustíme v další verzi 🐂');
    }

    if (action === 'character') {
      showToast('Výběr postavy připravíme');
    }

    if (action === 'shop') {
      showToast('Obchod bude brzy dostupný');
    }

    if (action === 'settings' || action === 'sound') {
      soundOn = !soundOn;
      showToast(soundOn ? 'Zvuk zapnutý 🔊' : 'Zvuk vypnutý 🔇');
    }
  });
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
}
