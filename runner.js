window.RunnerScene = {
  start(game){
    this.ground = game.H*.80;
    this.player = {x:game.W*.16,y:this.ground-135,w:95,h:135,vy:0,on:true,anim:0};
    this.coins=[]; this.obstacles=[];
    this.score=0; this.coinCount=0; this.speed=300;
    this.coinTimer=.2; this.obsTimer=1.2; this.over=false;
  },
  update(dt, game){
    const p = BukyInput.consumePointer();
    if(p) this.jump();

    this.score += dt*20;
    this.speed += dt*5;
    const pl = this.player;
    pl.anim += dt*12;
    pl.vy += 1550*dt;
    pl.y += pl.vy*dt;
    if(pl.y+pl.h>=this.ground){ pl.y=this.ground-pl.h; pl.vy=0; pl.on=true; }

    this.coinTimer-=dt; this.obsTimer-=dt;
    if(this.coinTimer<=0){
      this.coins.push({x:game.W+30,y:this.ground-105-Math.random()*150,r:16,spin:0});
      this.coinTimer=.45+Math.random()*.55;
    }
    if(this.obsTimer<=0){
      const type=Math.random()<.6?"barrel":"rock";
      this.obstacles.push({x:game.W+70,y:this.ground-(type==="barrel"?60:42),w:type==="barrel"?45:62,h:type==="barrel"?60:42,type});
      this.obsTimer=1.1+Math.random()*.9;
    }
    for(const c of this.coins){c.x-=this.speed*dt;c.spin+=dt*8;}
    for(const o of this.obstacles)o.x-=this.speed*dt;
    this.coins=this.coins.filter(c=>c.x>-50);
    this.obstacles=this.obstacles.filter(o=>o.x>-80);

    const pb={x:pl.x+25,y:pl.y+12,w:pl.w-50,h:pl.h-22};
    for(const c of [...this.coins]){
      const cb={x:c.x-c.r,y:c.y-c.r,w:c.r*2,h:c.r*2};
      if(this.hit(pb,cb)){
        this.coins.splice(this.coins.indexOf(c),1);
        this.coinCount++; this.score+=35; BukyAudio.coin();
      }
    }
    for(const o of this.obstacles){
      if(this.hit(pb,o)){
        BukyAudio.hit();
        game.changeScene("over", {score:Math.floor(this.score), coins:this.coinCount});
      }
    }
  },
  jump(){
    const p=this.player;
    if(p.on){ p.vy=-720; p.on=false; BukyAudio.jump(); }
  },
  hit(a,b){ return a.x<b.x+b.w && a.x+a.w>b.x && a.y<b.y+b.h && a.y+a.h>b.y; },
  draw(ctx,W,H,dt,time){
    const sky=ctx.createLinearGradient(0,0,0,H);
    sky.addColorStop(0,"#7ed7ff"); sky.addColorStop(.62,"#b7ecff"); sky.addColorStop(1,"#86c95d");
    ctx.fillStyle=sky; ctx.fillRect(0,0,W,H);

    ctx.fillStyle="#2c7a3f";
    for(let i=0;i<32;i++){
      const x=i*85-(time*70%85);
      ctx.beginPath(); ctx.moveTo(x,H*.72); ctx.lineTo(x+40,H*.50); ctx.lineTo(x+80,H*.72); ctx.fill();
    }

    ctx.fillStyle="#c68642"; ctx.fillRect(0,this.ground,W,H-this.ground);
    ctx.fillStyle="#7fc35f"; ctx.fillRect(0,this.ground-25,W,32);

    for(const c of this.coins){
      ctx.save(); ctx.translate(c.x,c.y); ctx.scale(Math.abs(Math.cos(c.spin))*.35+.65,1);
      ctx.fillStyle="#ffc928"; ctx.beginPath(); ctx.arc(0,0,c.r,0,Math.PI*2); ctx.fill();
      ctx.strokeStyle="#8a4a0b"; ctx.lineWidth=3; ctx.stroke(); ctx.restore();
    }

    for(const o of this.obstacles){
      if(o.type==="barrel"){
        ctx.fillStyle="#8a4518"; ctx.fillRect(o.x,o.y,o.w,o.h);
        ctx.fillStyle="#b56825"; ctx.fillRect(o.x+5,o.y,o.w-10,o.h);
        ctx.strokeStyle="#3b1b09"; ctx.lineWidth=4; ctx.strokeRect(o.x,o.y,o.w,o.h);
      }else{
        ctx.fillStyle="#777"; ctx.beginPath(); ctx.ellipse(o.x+o.w/2,o.y+o.h/2,o.w/2,o.h/2,0,0,Math.PI*2); ctx.fill();
      }
    }

    const p=this.player;
    const img = p.on ? (Math.floor(time*10)%2 ? BukyAssets.loaded.bukyRun1 : BukyAssets.loaded.bukyRun2) : BukyAssets.loaded.bukyJump;
    if(img) ctx.drawImage(img,p.x,p.y,p.w,p.h);

    ctx.fillStyle="rgba(82,39,10,.9)";
    BukyRender.round(ctx,12,12,120,42,12,true);
    BukyRender.round(ctx,145,12,150,42,12,true);
    ctx.fillStyle="#fff"; ctx.font=`900 ${H*.025}px Arial`; ctx.textAlign="left"; ctx.textBaseline="middle";
    ctx.fillText("🪙 "+this.coinCount,28,34);
    ctx.fillText("🏆 "+Math.floor(this.score),160,34);
    ctx.fillStyle="rgba(75,35,10,.85)";
    ctx.font=`900 ${H*.022}px Arial`;
    ctx.fillText("Ťukni pro skok",18,H-22);
  }
};
