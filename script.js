(() => {
const canvas = document.getElementById('gameCanvas');
const ctx2 = canvas.getContext('2d');
const menuScreen = document.getElementById('menuScreen');
const tapOverlay = document.getElementById('tapOverlay');
const tapStart = document.getElementById('tapStart');
const bukyMenu = document.getElementById('bukyMenu');
const bubble = document.getElementById('bubble');
const toast = document.getElementById('menuToast');
const hud = document.getElementById('hud');
const coinsHud = document.getElementById('coinsHud');
const scoreHud = document.getElementById('scoreHud');
const gameOver = document.getElementById('gameOver');
const finalScore = document.getElementById('finalScore');
const finalCoins = document.getElementById('finalCoins');
const simplePanel = document.getElementById('simplePanel');
const panelTitle = document.getElementById('panelTitle');
const panelText = document.getElementById('panelText');

const bukyImg = new Image();
bukyImg.src = 'buky.png';

let audio = null, soundOn = true, menuAudioStarted = false;
let W = 0, H = 0, DPR = 1;
let state = 'menu';
let last = 0;
let groundY = 0;
let player, coins, obstacles, particles, score, collected, speed, spawnCoin, spawnObs, gameTime;

function resize(){
  DPR = Math.min(window.devicePixelRatio || 1, 2);
  W = window.innerWidth; H = window.innerHeight;
  canvas.width = Math.floor(W * DPR); canvas.height = Math.floor(H * DPR);
  canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
  ctx2.setTransform(DPR,0,0,DPR,0,0);
  groundY = H * 0.79;
}
window.addEventListener('resize', resize);
resize();

function beep(freq, time, dur, type='sine', gain=.035){
  if(!audio || !soundOn) return;
  const o = audio.createOscillator(), g = audio.createGain();
  o.type = type; o.frequency.setValueAtTime(freq, time);
  g.gain.setValueAtTime(.0001, time);
  g.gain.exponentialRampToValueAtTime(gain, time+.025);
  g.gain.exponentialRampToValueAtTime(.0001, time+dur);
  o.connect(g).connect(audio.destination); o.start(time); o.stop(time+dur+.04);
}
function speak(text){
  if(!soundOn || !('speechSynthesis' in window)) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'cs-CZ'; u.rate = .96; u.pitch = 1.2;
  speechSynthesis.speak(u);
}
function showBubble(text){
  bubble.textContent = text;
  bubble.classList.remove('show'); void bubble.offsetWidth; bubble.classList.add('show');
  speak(text);
}
function showToast(text){
  toast.textContent = text;
  toast.classList.remove('show'); void toast.offsetWidth; toast.classList.add('show');
}
function startAudio(){
  if(menuAudioStarted) return;
  menuAudioStarted = true;
  tapOverlay.style.display = 'none';
  audio = new (window.AudioContext || window.webkitAudioContext)();
  const now = audio.currentTime + .05;
  [392,523,659,784,659,523,392].forEach((f,i)=>beep(f, now+i*.16, .14, 'triangle', .055));
  setInterval(()=>{ if(state === 'menu'){ const t=audio.currentTime; beep(1450+Math.random()*500,t,.07,'sine',.018); beep(1850+Math.random()*500,t+.11,.06,'sine',.014); }}, 1500);
  setInterval(()=>{ if(state === 'menu'){ const mel=[262,330,392,330,294,349,392,523]; startAudio.step=(startAudio.step||0)+1; beep(mel[startAudio.step%mel.length], audio.currentTime, .18, 'triangle', .01); }}, 520);
  bukyMenu.classList.remove('runIn','wave'); void bukyMenu.offsetWidth; bukyMenu.classList.add('runIn');
  setTimeout(()=>{bukyMenu.classList.add('wave'); showBubble('Ahoj kamaráde!')}, 700);
}
tapStart.addEventListener('click', startAudio);
document.body.addEventListener('touchstart', startAudio, {once:true});

function initGame(){
  state = 'game';
  menuScreen.classList.add('hidden');
  gameOver.classList.add('hidden');
  simplePanel.classList.add('hidden');
  hud.classList.remove('hidden');

  player = {x: W*0.17, y: groundY-150, w: 92, h: 150, vy: 0, onGround: true, anim:0};
  coins = []; obstacles = []; particles = [];
  score = 0; collected = 0; speed = 280; spawnCoin = 0; spawnObs = 0; gameTime = 0;
  last = performance.now();
}
function endGame(){
  state = 'over';
  hud.classList.add('hidden');
  gameOver.classList.remove('hidden');
  finalScore.textContent = Math.floor(score);
  finalCoins.textContent = collected;
  const best = Math.max(Number(localStorage.getItem('bukyBest')||0), Math.floor(score));
  localStorage.setItem('bukyBest', best);
  localStorage.setItem('bukyCoins', Number(localStorage.getItem('bukyCoins')||0)+collected);
}
function jump(){
  if(state !== 'game') return;
  if(player.onGround){
    player.vy = -720;
    player.onGround = false;
    if(audio) beep(660, audio.currentTime, .08, 'square', .025);
  }
}
canvas.addEventListener('pointerdown', jump);
document.addEventListener('keydown', e => { if(e.code === 'Space') jump(); });

function showPanel(title,text){
  panelTitle.textContent = title; panelText.textContent = text;
  simplePanel.classList.remove('hidden');
}
document.getElementById('btnPlay').onclick = () => { startAudio(); setTimeout(initGame, 100); };
document.getElementById('btnCharacter').onclick = () => showPanel('Postava', 'Zatím je vybraný Buky. Další postavy přidáme později.');
document.getElementById('btnShop').onclick = () => showPanel('Obchod', 'Za mince půjde kupovat oblečení, klobouky a odměny.');
document.getElementById('btnSettings').onclick = () => { soundOn = !soundOn; showToast(soundOn ? 'Zvuk zapnutý 🔊' : 'Zvuk vypnutý 🔇'); };
document.getElementById('panelClose').onclick = () => simplePanel.classList.add('hidden');
document.getElementById('againBtn').onclick = initGame;
document.getElementById('menuBtn').onclick = () => { state='menu'; gameOver.classList.add('hidden'); menuScreen.classList.remove('hidden'); };
document.getElementById('pauseBtn').onclick = () => { if(state==='game'){state='pause'; showPanel('Pauza','Hra je pozastavená.');} else if(state==='pause'){state='game'; simplePanel.classList.add('hidden'); last=performance.now();} };
bukyMenu.onclick = () => { bukyMenu.classList.remove('wave'); void bukyMenu.offsetWidth; bukyMenu.classList.add('wave'); showBubble('Ahoj kamaráde!'); };

function spawnCoinObj(){
  coins.push({x: W+40, y: groundY - 115 - Math.random()*145, r: 16, spin: 0});
}
function spawnObstacleObj(){
  const type = Math.random() < .55 ? 'barrel' : 'rock';
  obstacles.push({x: W+60, y: groundY - (type==='barrel'?62:42), w: type==='barrel'?44:62, h: type==='barrel'?62:42, type});
}
function rectsOverlap(a,b){return a.x < b.x+b.w && a.x+a.w > b.x && a.y < b.y+b.h && a.y+a.h > b.y}
function drawBackground(t){
  const g = ctx2.createLinearGradient(0,0,0,H);
  g.addColorStop(0,'#7ed7ff'); g.addColorStop(.55,'#b7ecff'); g.addColorStop(1,'#86c95d');
  ctx2.fillStyle=g; ctx2.fillRect(0,0,W,H);

  // mountains/forest
  ctx2.fillStyle='#75b96e';
  for(let i=0;i<7;i++){ let x=(i*240 - (t*20)%240); ctx2.beginPath(); ctx2.moveTo(x,H*.48); ctx2.lineTo(x+140,H*.26); ctx2.lineTo(x+300,H*.48); ctx2.fill(); }
  ctx2.fillStyle='#2c7a3f';
  for(let i=0;i<30;i++){ let x=(i*85 - (t*60)%85); ctx2.beginPath(); ctx2.moveTo(x,groundY-115); ctx2.lineTo(x+35,groundY-210); ctx2.lineTo(x+70,groundY-115); ctx2.fill(); }
  // ground
  ctx2.fillStyle='#c68642'; ctx2.fillRect(0,groundY,W,H-groundY);
  ctx2.fillStyle='#7fc35f'; ctx2.fillRect(0,groundY-24,W,30);
  // path stones
  ctx2.fillStyle='rgba(90,55,25,.25)';
  for(let i=0;i<18;i++){ let x=(i*110 - (t*speed*.45)%110); ctx2.beginPath(); ctx2.ellipse(x, groundY+42+(i%3)*22, 20, 8, 0,0,Math.PI*2); ctx2.fill(); }
}
function drawCoin(c){
  c.spin += .1;
  ctx2.save(); ctx2.translate(c.x,c.y); ctx2.scale(Math.abs(Math.cos(c.spin))*.35+.65,1);
  ctx2.fillStyle='#ffc928'; ctx2.beginPath(); ctx2.arc(0,0,c.r,0,Math.PI*2); ctx2.fill();
  ctx2.strokeStyle='#8a4a0b'; ctx2.lineWidth=3; ctx2.stroke();
  ctx2.fillStyle='#fff0a5'; ctx2.beginPath(); ctx2.arc(-4,-5,5,0,Math.PI*2); ctx2.fill();
  ctx2.restore();
}
function drawObstacle(o){
  if(o.type==='barrel'){
    ctx2.fillStyle='#8a4518'; ctx2.fillRect(o.x,o.y,o.w,o.h);
    ctx2.fillStyle='#b56825'; ctx2.fillRect(o.x+5,o.y,o.w-10,o.h);
    ctx2.strokeStyle='#3b1b09'; ctx2.lineWidth=4; ctx2.strokeRect(o.x,o.y,o.w,o.h);
    ctx2.strokeStyle='#e0a45a'; ctx2.beginPath(); ctx2.moveTo(o.x,o.y+16); ctx2.lineTo(o.x+o.w,o.y+16); ctx2.moveTo(o.x,o.y+46); ctx2.lineTo(o.x+o.w,o.y+46); ctx2.stroke();
  } else {
    ctx2.fillStyle='#777'; ctx2.beginPath(); ctx2.ellipse(o.x+o.w/2,o.y+o.h/2,o.w/2,o.h/2,0,0,Math.PI*2); ctx2.fill();
    ctx2.fillStyle='#999'; ctx2.beginPath(); ctx2.ellipse(o.x+o.w*.35,o.y+o.h*.35,o.w*.18,o.h*.14,0,0,Math.PI*2); ctx2.fill();
  }
}
function drawPlayer(){
  const wobble = player.onGround ? Math.sin(player.anim)*4 : 0;
  ctx2.save();
  ctx2.translate(player.x, player.y + wobble);
  // Use the real approved Buky crop
  ctx2.drawImage(bukyImg, 0, 0, player.w, player.h);
  ctx2.restore();
}
function update(dt){
  gameTime += dt; score += dt*18; speed += dt*5;
  player.anim += dt*12;
  player.vy += 1500*dt; player.y += player.vy*dt;
  if(player.y + player.h >= groundY){player.y = groundY-player.h; player.vy=0; player.onGround=true;}

  spawnCoin -= dt; spawnObs -= dt;
  if(spawnCoin <= 0){ spawnCoinObj(); spawnCoin = .55 + Math.random()*.45; }
  if(spawnObs <= 0){ spawnObstacleObj(); spawnObs = 1.35 + Math.random()*.9; }

  for(const c of coins) c.x -= speed*dt;
  for(const o of obstacles) o.x -= speed*dt;
  coins = coins.filter(c=>c.x>-40); obstacles = obstacles.filter(o=>o.x>-80);

  const pbox = {x:player.x+15,y:player.y+25,w:player.w-30,h:player.h-35};
  for(const c of [...coins]){
    const cbox={x:c.x-c.r,y:c.y-c.r,w:c.r*2,h:c.r*2};
    if(rectsOverlap(pbox,cbox)){
      coins.splice(coins.indexOf(c),1); collected++; score += 30;
      if(audio) beep(880, audio.currentTime, .06, 'triangle', .02);
    }
  }
  for(const o of obstacles){
    const obox={x:o.x,y:o.y,w:o.w,h:o.h};
    if(rectsOverlap(pbox,obox)){
      if(audio) beep(140, audio.currentTime, .18, 'sawtooth', .035);
      endGame(); break;
    }
  }
  coinsHud.textContent = collected;
  scoreHud.textContent = Math.floor(score);
}
function draw(){
  const t = gameTime || 0;
  drawBackground(t);
  for(const c of coins) drawCoin(c);
  for(const o of obstacles) drawObstacle(o);
  drawPlayer();
  // Instructions
  ctx2.fillStyle='rgba(75,35,10,.85)';
  ctx2.font='bold 18px Arial';
  ctx2.fillText('Ťukni pro skok', 18, H-22);
}
function loop(now){
  const dt = Math.min((now-last)/1000, .033); last=now;
  if(state==='game'){ update(dt); draw(); }
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
})();