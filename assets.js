window.BukyAssets = {
  images: {
    ranchPhoto: "assets/images/ranc-photo.jpg",
    menuReference: "assets/images/menu-reference.jpg",
    bukyIdle: "assets/sprites/buky_idle.png",
    bukyWave1: "assets/sprites/buky_wave1.png",
    bukyWave2: "assets/sprites/buky_wave2.png",
    bukyRun1: "assets/sprites/buky_run1.png",
    bukyRun2: "assets/sprites/buky_run2.png",
    bukyJump: "assets/sprites/buky_jump.png",
    bukyBlink: "assets/sprites/buky_blink.png"
  },
  loaded: {},
  loadAll(){
    const entries = Object.entries(this.images);
    return Promise.all(entries.map(([key,src]) => new Promise((resolve) => {
      const img = new Image();
      img.onload = () => { this.loaded[key] = img; resolve(); };
      img.onerror = () => { console.warn("Nepodařilo se načíst", src); resolve(); };
      img.src = src;
    })));
  }
};
