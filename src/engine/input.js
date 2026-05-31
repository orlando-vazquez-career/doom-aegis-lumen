// input.js — teclado + mouse con pointer lock. Sin dependencias de framework.
// Controles: WASD mover/strafe · mouse o flechas mirar · click/Ctrl disparar ·
// Space/E usar · Shift correr · 1-6 armas · Esc pausa · Tab mapa.

export class Input {
  constructor() {
    this.down = new Set();      // codes mantenidos
    this.pressed = new Set();   // edge: presionados este frame
    this.mouseDX = 0;           // acumulado de pointer-lock
    this.firing = false;        // boton izq mantenido
    this.anyKey = false;        // edge para pantallas title/dead/victory
    this.locked = false;
    this.canvas = null;
  }

  attach(canvas) {
    this.canvas = canvas;
    const PREVENT = new Set(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', 'Tab']);

    addEventListener('keydown', (e) => {
      if (e.repeat) return;
      if (!this.down.has(e.code)) this.pressed.add(e.code);
      this.down.add(e.code);
      this.anyKey = true;
      if (PREVENT.has(e.code)) e.preventDefault();
    });
    addEventListener('keyup', (e) => this.down.delete(e.code));
    addEventListener('blur', () => { this.down.clear(); this.firing = false; });

    canvas.addEventListener('mousedown', (e) => { if (e.button === 0) { this.firing = true; this.anyKey = true; } });
    addEventListener('mouseup', (e) => { if (e.button === 0) this.firing = false; });
    document.addEventListener('mousemove', (e) => { if (this.locked) this.mouseDX += e.movementX; });
    document.addEventListener('pointerlockchange', () => { this.locked = document.pointerLockElement === canvas; });
    canvas.addEventListener('click', () => { if (!this.locked && this.canvas) this.canvas.requestPointerLock(); });
  }

  held(...codes) { return codes.some((c) => this.down.has(c)); }
  hit(...codes) { return codes.some((c) => this.pressed.has(c)); }

  takeMouseDX() { const d = this.mouseDX; this.mouseDX = 0; return d; }
  consumeAnyKey() { const a = this.anyKey; this.anyKey = false; return a; }

  /** Limpia los edges al final del frame. Llamar tras update(). */
  endFrame() { this.pressed.clear(); this.anyKey = false; }

  // --- acciones semanticas ---
  get forward() { return this.held('KeyW', 'ArrowUp'); }
  get back() { return this.held('KeyS', 'ArrowDown'); }
  get strafeL() { return this.held('KeyA'); }
  get strafeR() { return this.held('KeyD'); }
  get turnL() { return this.held('ArrowLeft'); }
  get turnR() { return this.held('ArrowRight'); }
  get run() { return this.held('ShiftLeft', 'ShiftRight'); }
  get use() { return this.hit('Space', 'KeyE'); }
  get fire() { return this.firing || this.held('ControlLeft', 'ControlRight'); }
  get pausePressed() { return this.hit('Escape'); }
  get mapToggle() { return this.hit('Tab'); }
  weaponDigit() { for (let i = 1; i <= 6; i++) if (this.hit('Digit' + i)) return i; return 0; }
  requestLock() { if (this.canvas && !this.locked) this.canvas.requestPointerLock(); }
}
