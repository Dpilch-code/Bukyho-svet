const BukyGame = {
  canvas:null, ctx:null, W:0, H:0, DPR:1, scene:"menu", time:0, last:performance.now(), overData:null,
  init(){
    this.canvas = document.getElementById("game");
    this.ctx = this.canvas.getContext("2d");
    BukyInput.init(this.canvas);
    this.resize();
    window.addEventListener("resize", () => this.resize());
    document.getElementById("start-button").addEventListener("click", () => {
      BukyAudio.start();
      document.getElementById("start-overlay").classList.add("hidden");
      MenuScene.start();
    });
    BukyAssets.loadAll().then(() => {
      MenuScene.start();
      requestAnimationFrame((t)=>this.loop(t));
    });
  },
  resize(){
    this.DPR = Math.min(window.devicePixelRatio || 1, 2);
    this.W = window.innerWidth; this.H = window.innerHeight;
    this.canvas.width = Math.floor(this.W*this.DPR);
    this.canvas.height = Math.floor(this.H*this.DPR);
    this.ctx.setTransform(this.DPR,0,0,this.DPR,0,0);
    MenuScene.layout(this.W,this.H);
  },
  changeScene(name, data=null){
    if(name==="runner"){
      this.scene="runner";
      RunnerScene.start(this);
    } else if(name==="menu"){
      this.scene="menu";
      MenuScene.start();
    } else if(name==="over"){
      this.scene="over";
      this.overData=data || {score:0, coins:0};
      const best = Math.max(Number(localStorage.getItem("bukyBest") || 0), this.overData.score);
      localStorage.setItem("bukyBest", best);
      localStorage.setItem("bukyCoins", Number(localStorage.getItem("bukyCoins") || 0) + this.overData.coins);
    }
  },
  drawOver(dt){
    RunnerScene.draw(this.ctx,this.W,this.H,0,this.time);
    this.ctx.fillStyle="rgba(0,0,0,.45)";
    this.ctx.fillRect(0,0,this.W,this.H);
    this.ctx.fillStyle="#fff7e6";
    BukyRender.round(this.ctx,this.W*.24,this.H*.26,this.W*.52,this.H*.40,26,true);
    this.ctx.strokeStyle="#7b3f16"; this.ctx.lineWidth=6;
    BukyRender.round(this.ctx,this.W*.24,this.H*.26,this.W*.52,this.H*.40,26,false);
    this.ctx.fillStyle="#4b230b"; this.ctx.font=`900 ${this.H*.055}px Arial`;
    this.ctx.textAlign="center"; this.ctx.textBaseline="middle";
    this.ctx.fillText("Konec hry",this.W*.5,this.H*.34);
    this.ctx.font=`900 ${this.H*.032}px Arial`;
    this.ctx.fillText("Skóre: "+this.overData.score,this.W*.5,this.H*.43);
    this.ctx.fillText("Mince: "+this.overData.coins,this.W*.5,this.H*.49);
    BukyRender.woodButton(this.ctx,{x:this.W*.31,y:this.H*.56,w:this.W*.16,h:this.H*.07,label:"ZNOVU",icon:""});
    BukyRender.woodButton(this.ctx,{x:this.W*.53,y:this.H*.56,w:this.W*.16,h:this.H*.07,label:"MENU",icon:""});
    const p = BukyInput.consumePointer();
    if(p){
      if(p.x>this.W*.31 && p.x<this.W*.47 && p.y>this.H*.56 && p.y<this.H*.63) this.changeScene("runner");
      if(p.x>this.W*.53 && p.x<this.W*.69 && p.y>this.H*.56 && p.y<this.H*.63) this.changeScene("menu");
    }
  },
  loop(now){
    const dt = Math.min((now-this.last)/1000,.033);
    this.last=now; this.time+=dt;
    this.ctx.clearRect(0,0,this.W,this.H);
    if(this.scene==="menu"){
      MenuScene.update(dt,this);
      MenuScene.draw(this.ctx,this.W,this.H,dt,this.time);
    } else if(this.scene==="runner"){
      RunnerScene.update(dt,this);
      RunnerScene.draw(this.ctx,this.W,this.H,dt,this.time);
    } else if(this.scene==="over"){
      this.drawOver(dt);
    }
    requestAnimationFrame((t)=>this.loop(t));
  }
};

BukyGame.init();
