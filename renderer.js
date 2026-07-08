window.BukyRender = {
  round(ctx,x,y,w,h,r,fill=true){
    ctx.beginPath();
    ctx.moveTo(x+r,y);
    ctx.arcTo(x+w,y,x+w,y+h,r);
    ctx.arcTo(x+w,y+h,x,y+h,r);
    ctx.arcTo(x,y+h,x,y,r);
    ctx.arcTo(x,y,x+w,y,r);
    fill ? ctx.fill() : ctx.stroke();
  },
  cloud(ctx,x,y,s,a=.8){
    ctx.save(); ctx.globalAlpha=a; ctx.fillStyle="#fff";
    ctx.beginPath();
    ctx.ellipse(x,y,s,s*.32,0,0,Math.PI*2);
    ctx.ellipse(x+s*.35,y-s*.16,s*.46,s*.42,0,0,Math.PI*2);
    ctx.ellipse(x-s*.30,y-s*.10,s*.38,s*.35,0,0,Math.PI*2);
    ctx.fill(); ctx.restore();
  },
  bird(ctx,x,y,s=1){
    ctx.save(); ctx.translate(x,y); ctx.scale(s,s);
    ctx.strokeStyle="#4b2b12"; ctx.lineWidth=3; ctx.lineCap="round";
    ctx.beginPath();
    ctx.arc(-10,0,12,Math.PI*.15,Math.PI*.9);
    ctx.arc(10,0,12,Math.PI*.1,Math.PI*.85);
    ctx.stroke(); ctx.restore();
  },
  woodButton(ctx,b){
    ctx.save();
    ctx.shadowColor="rgba(0,0,0,.35)"; ctx.shadowBlur=12; ctx.shadowOffsetY=6;
    ctx.fillStyle="#3a1706"; this.round(ctx,b.x,b.y+7,b.w,b.h,20,true);
    ctx.shadowBlur=0; ctx.shadowOffsetY=0;
    const g=ctx.createLinearGradient(b.x,b.y,b.x,b.y+b.h);
    g.addColorStop(0,"#a75a20"); g.addColorStop(.5,"#7b3f16"); g.addColorStop(1,"#5a260b");
    ctx.fillStyle=g; this.round(ctx,b.x,b.y,b.w,b.h,20,true);
    ctx.strokeStyle="#2d1104"; ctx.lineWidth=Math.max(3,b.h*.05); this.round(ctx,b.x,b.y,b.w,b.h,20,false);
    ctx.strokeStyle="rgba(255,210,120,.18)"; ctx.lineWidth=2;
    for(let i=1;i<4;i++){ctx.beginPath();ctx.moveTo(b.x+12,b.y+b.h*i/4);ctx.lineTo(b.x+b.w-12,b.y+b.h*i/4);ctx.stroke();}
    ctx.fillStyle="#fff"; ctx.font=`900 ${Math.min(b.h*.43, b.w*.18)}px Arial`;
    ctx.textAlign="center"; ctx.textBaseline="middle";
    ctx.shadowColor="#2d1104"; ctx.shadowOffsetX=3; ctx.shadowOffsetY=3;
    ctx.fillText(b.label,b.x+b.w*.62,b.y+b.h*.52);
    ctx.shadowOffsetX=0; ctx.shadowOffsetY=0;
    ctx.fillStyle="#ffd34d"; ctx.font=`900 ${Math.min(b.h*.52, b.w*.20)}px Arial`;
    ctx.fillText(b.icon,b.x+b.w*.22,b.y+b.h*.52);
    if(b.label==="OBCHOD"){
      ctx.save(); ctx.translate(b.x+b.w*.82,b.y+b.h*.22); ctx.rotate(-.15);
      ctx.fillStyle="#fff0d0"; this.round(ctx,-42,-15,84,30,8,true);
      ctx.fillStyle="#a51e13"; ctx.font="900 12px Arial"; ctx.textAlign="center"; ctx.textBaseline="middle";
      ctx.fillText("BRZY",0,-4); ctx.fillText("DOSTUPNÉ",0,9); ctx.restore();
    }
    ctx.restore();
  },
  title(ctx,W,H){
    ctx.save();
    const x=W*.5, y=H*.055, w=W*.58, h=H*.12;
    ctx.translate(x,y);
    ctx.shadowColor="rgba(0,0,0,.38)"; ctx.shadowBlur=14; ctx.shadowOffsetY=6;
    ctx.fillStyle="#4a2109"; this.round(ctx,-w/2,8,w,h,28,true);
    const g=ctx.createLinearGradient(0,0,0,h);
    g.addColorStop(0,"#9b551f"); g.addColorStop(1,"#552307");
    ctx.fillStyle=g; this.round(ctx,-w/2,0,w,h,28,true);
    ctx.shadowBlur=0; ctx.shadowOffsetY=0;
    ctx.fillStyle="#ffd34d"; ctx.font=`900 ${Math.min(W*.065,H*.082)}px Arial`;
    ctx.textAlign="center"; ctx.textBaseline="middle";
    ctx.shadowColor="#331304"; ctx.shadowOffsetX=4; ctx.shadowOffsetY=4;
    ctx.fillText("Bukyho svět",0,h*.45);
    ctx.shadowOffsetX=0; ctx.shadowOffsetY=0;
    const sw=w*.54, sh=H*.055;
    ctx.fillStyle="#e9c18a"; this.round(ctx,-sw/2,h*.80,sw,sh,14,true);
    ctx.fillStyle="#5c2b0e"; ctx.font=`900 ${Math.min(W*.026,H*.035)}px Arial`;
    ctx.fillText("od Ranče na Křivé",0,h*.80+sh*.52);
    ctx.restore();
  },
  bubble(ctx,text,x,y,w,h){
    ctx.save();
    ctx.fillStyle="#fff"; ctx.shadowColor="rgba(0,0,0,.35)"; ctx.shadowBlur=14;
    this.round(ctx,x,y,w,h,30,true);
    ctx.shadowBlur=0; ctx.fillStyle="#4b230b"; ctx.font=`900 ${Math.min(w*.11,h*.40)}px Arial`;
    ctx.textAlign="center"; ctx.textBaseline="middle"; ctx.fillText(text,x+w/2,y+h/2);
    ctx.restore();
  }
};
