window.BukyAudio = {
  ctx: null,
  enabled: true,
  started: false,
  start(){
    if(this.started) return;
    this.started = true;
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    this.intro();
  },
  beep(freq, time, dur, type="sine", gain=.03){
    if(!this.ctx || !this.enabled) return;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, time);
    g.gain.setValueAtTime(.0001, time);
    g.gain.exponentialRampToValueAtTime(gain, time+.025);
    g.gain.exponentialRampToValueAtTime(.0001, time+dur);
    osc.connect(g).connect(this.ctx.destination);
    osc.start(time);
    osc.stop(time+dur+.04);
  },
  intro(){
    if(!this.ctx) return;
    const now = this.ctx.currentTime + .04;
    [392,523,659,784,659,523,392].forEach((f,i)=>this.beep(f, now+i*.16, .14, "triangle", .055));
  },
  birds(){
    if(!this.ctx || !this.enabled) return;
    const t = this.ctx.currentTime;
    this.beep(1450+Math.random()*450, t, .07, "sine", .014);
    this.beep(1850+Math.random()*550, t+.10, .06, "sine", .012);
  },
  coin(){
    if(this.ctx) this.beep(880, this.ctx.currentTime, .06, "triangle", .025);
  },
  jump(){
    if(this.ctx) this.beep(660, this.ctx.currentTime, .08, "square", .022);
  },
  hit(){
    if(this.ctx) this.beep(140, this.ctx.currentTime, .16, "sawtooth", .035);
  },
  speak(text){
    if(!this.enabled || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "cs-CZ";
    u.rate = .95;
    u.pitch = 1.18;
    window.speechSynthesis.speak(u);
  }
};
