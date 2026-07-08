window.MenuScene = {
  intro: 0,
  introDone: false,
  wave: 0,
  bubble: 0,
  birdTimer: 0,
  msg: "",
  msgTimer: 0,
  buttons: {},
  start(){
    this.intro = .001;
    this.introDone = false;
    this.wave = 0;
    this.bubble = 0;
    setTimeout(() => {
      this.wave = 1.4;
      this.bubble = 2.2;
      BukyAudio.speak("Ahoj kamaráde!");
    }, 1250);
  },
  layout(W,H){
    this.buttons = {
      play: {x:W*.67,y:H*.33,w:W*.28,h:H*.12,label:"HRÁT",icon:"▶"},
      character: {x:W*.66,y:H*.47,w:W*.29,h:H*.11,label:"POSTAVA",icon:"👤"},
      shop: {x:W*.66,y:H*.61,w:W*.29,h:H*.11,label:"OBCHOD",icon:"🛒"},
      settings: {x:W*.66,y:H*.76,w:W*.29,h:H*.11,label:"NASTAVENÍ",icon:"⚙"}
    };
  },
  inside(p,b){ return p.x>=b.x && p.x<=b.x+b.w && p.y>=b.y && p.y<=b.y+b.h; },
  message(text){ this.msg=text; this.msgTimer=1.8; },
  update(dt, game){
    const p = BukyInput.consumePointer();
    if(p){
      if(this.inside(p,this.buttons.play)){ game.changeScene("runner"); return; }
      if(this.inside(p,this.buttons.character)){ this.message("Postava: Buky"); return; }
      if(this.inside(p,this.buttons.shop)){ this.message("Obchod brzy dostupný"); return; }
      if(this.inside(p,this.buttons.settings)){
        BukyAudio.enabled = !BukyAudio.enabled;
        this.message(BukyAudio.enabled ? "Zvuk zapnutý" : "Zvuk vypnutý");
        return;
      }
      this.wave=1.2; this.bubble=1.8; BukyAudio.speak("Ahoj kamaráde!");
    }
    if(BukyAudio.ctx){
      this.birdTimer -= dt;
      if(this.birdTimer<=0){
        BukyAudio.birds();
        this.birdTimer = 1.3 + Math.random()*.7;
      }
    }
  },
  drawRanch(ctx,W,H){
    // Use real photo as base, softly blended, then add game objects over it
    const photo = BukyAssets.loaded.ranchPhoto;
    if(photo){
      ctx.save();
      ctx.globalAlpha = .88;
      const scale = Math.max(W/photo.width, H/photo.height);
      const sw = photo.width*scale, sh = photo.height*scale;
      ctx.drawImage(photo, (W-sw)/2, (H-sh)/2, sw, sh);
      ctx.globalAlpha = .18;
      ctx.fillStyle = "#7ed7ff";
      ctx.fillRect(0,0,W,H);
      ctx.restore();
    } else {
      ctx.fillStyle="#f1c982"; ctx.fillRect(W*.22,H*.42,W*.43,H*.25);
    }

    // path/fence overlay
    ctx.fillStyle="rgba(198,134,66,.75)";
    ctx.beginPath();
    ctx.moveTo(W*.38,H*.63); ctx.quadraticCurveTo(W*.47,H*.80,W*.45,H);
    ctx.lineTo(W*.24,H); ctx.quadraticCurveTo(W*.31,H*.80,W*.36,H*.63); ctx.fill();
    ctx.strokeStyle="rgba(115,64,18,.9)"; ctx.lineWidth=5;
    for(let i=0;i<13;i++){ const x=W*.33+i*22; ctx.beginPath(); ctx.moveTo(x,H*.62); ctx.lineTo(x,H*.76); ctx.stroke(); }
  },
  draw(ctx,W,H,dt,time){
    const sky=ctx.createLinearGradient(0,0,0,H);
    sky.addColorStop(0,"#0da2f2"); sky.addColorStop(.58,"#9de5ff"); sky.addColorStop(1,"#74c75c");
    ctx.fillStyle=sky; ctx.fillRect(0,0,W,H);

    for(let i=0;i<4;i++) BukyRender.cloud(ctx,(i*W*.32+(time*18)%(W+240))-120,H*(.11+i*.05),55+i*10,.65);
    BukyRender.bird(ctx,W*.12,H*.16,1);
    BukyRender.bird(ctx,W*.88,H*.18,1.1);

    this.drawRanch(ctx,W,H);
    BukyRender.title(ctx,W,H);

    Object.values(this.buttons).forEach(b => BukyRender.woodButton(ctx,b));

    // stats
    ctx.fillStyle="#5a260b";
    BukyRender.round(ctx,W*.30,H*.895,W*.20,H*.065,12,true);
    BukyRender.round(ctx,W*.52,H*.895,W*.22,H*.065,12,true);
    ctx.fillStyle="#fff"; ctx.font=`900 ${H*.019}px Arial`; ctx.textAlign="center";
    ctx.fillText("CELKEM MINCÍ: 0",W*.40,H*.934);
    ctx.fillText("NEJLEPŠÍ SKÓRE: "+(localStorage.getItem("bukyBest")||0),W*.63,H*.934);
    ctx.fillText("Verze 0.1 Alpha",W*.5,H*.982);

    const startX=W*.48,startY=H*.49,targetX=W*.30,targetY=H*.69;
    let bx=targetX, by=targetY, s=Math.min(W,H)/520, frame=BukyAssets.loaded.bukyIdle;
    if(this.intro>0 && this.intro<1){
      this.intro=Math.min(1,this.intro+dt*.75);
      const e=1-Math.pow(1-this.intro,3);
      bx=startX+(targetX-startX)*e;
      by=startY+(targetY-startY)*e;
      s=Math.min(W,H)/520*(.22+.78*e);
      frame = Math.floor(time*12)%2 ? BukyAssets.loaded.bukyRun1 : BukyAssets.loaded.bukyRun2;
      if(this.intro>=1){ this.introDone=true; this.wave=1.4; this.bubble=2.2; }
    } else if(this.wave>0){
      frame = Math.floor(time*10)%2 ? BukyAssets.loaded.bukyWave1 : BukyAssets.loaded.bukyWave2;
      this.wave -= dt;
    } else if(Math.sin(time*.9)>.96){
      frame = BukyAssets.loaded.bukyBlink;
    }
    if(frame) ctx.drawImage(frame,bx-120*s,by-150*s,240*s,280*s);

    if(this.bubble>0){
      this.bubble-=dt;
      BukyRender.bubble(ctx,"Ahoj kamaráde!",W*.10,H*.31,W*.23,H*.075);
    }
    if(this.msgTimer>0){
      this.msgTimer-=dt;
      BukyRender.bubble(ctx,this.msg,W*.36,H*.50,W*.28,H*.075);
    }
  }
};
