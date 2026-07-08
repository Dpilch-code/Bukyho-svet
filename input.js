window.BukyInput = {
  pointer: null,
  consumePointer(){
    const p = this.pointer;
    this.pointer = null;
    return p;
  },
  init(canvas){
    canvas.addEventListener("pointerdown", (ev) => {
      const r = canvas.getBoundingClientRect();
      this.pointer = { x: ev.clientX - r.left, y: ev.clientY - r.top };
    });
    window.addEventListener("keydown", (e) => {
      if(e.code === "Space") this.pointer = { x: -1, y: -1, space: true };
    });
  }
};
