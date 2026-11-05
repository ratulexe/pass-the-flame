import { sound } from './audio';
import { prepareCanvas } from './backdrop';
import { prefersReducedMotion } from './motion';

const TAU = Math.PI * 2;
const COLORS = [
  '#ffb238',
  '#ff5e7e',
  '#ffd166',
  '#7ae7ff',
  '#c9a7ff',
  '#ff8a1f',
  '#fff3c4',
  '#7dffb0',
];
const GOLD = ['#ffd27a', '#ffb238', '#fff1c4', '#ffc85a'];
const BURST_TYPES = ['peony', 'peony', 'ring', 'willow'];
const NAME_FONT = '"Yatra One","Tiro Bangla","Mukta",serif';
const FONT_WAIT_MS = 1200;

const SMALL_SCREEN = 520;
const LIMITS = {
  small: { particles: 1400, namePoints: 700 },
  large: { particles: 2600, namePoints: 1000 },
};
const MIN_PARTICLE_BUDGET = 700;
const SLOW_FRAME_MS = 26;

const pick = (list) => list[Math.floor(Math.random() * list.length)];

let canvas = null;
let ctx = null;
let width = 0;
let height = 0;
let parts = [];
let spawned = [];
let frame = 0;
let last = 0;
let idleFrames = 0;
let frameAverage = 16;
let budget = LIMITS.large.particles;
const timers = new Set();

const limits = () => (width < SMALL_SCREEN ? LIMITS.small : LIMITS.large);

function resize() {
  if (!canvas) return;
  ({ ctx, width, height } = prepareCanvas(canvas));
  budget = limits().particles;
}

function start() {
  if (frame || !ctx) return;
  last = performance.now();
  idleFrames = 0;
  frame = requestAnimationFrame(tick);
}

/** Decorative sparks are dropped over budget; name particles and rockets never are. */
function addSpark(particle) {
  if (parts.length + spawned.length < budget) spawned.push(particle);
}

function later(callback, ms) {
  const id = setTimeout(() => {
    timers.delete(id);
    callback();
  }, ms);
  timers.add(id);
}

function rocket(x, targetY, options = {}) {
  const gravity = 0.05;
  const distance = Math.max(80, height + 10 - targetY);
  spawned.push({
    kind: 'rocket',
    x,
    y: height + 10,
    vx: (Math.random() - 0.5) * 0.7,
    vy: -Math.sqrt(2 * gravity * distance),
    gravity,
    color: '#ffe7b0',
    size: 2,
    options,
  });
  sound.launch();
  start();
}

function randomRocket() {
  if (document.hidden) return;
  rocket(width * (0.12 + Math.random() * 0.76), height * (0.1 + Math.random() * 0.34), {
    type: pick(BURST_TYPES),
  });
}

function spark(x, y) {
  addSpark({
    kind: 'spark',
    x,
    y,
    vx: (Math.random() - 0.5) * 1.2,
    vy: Math.random() * 1.2,
    gravity: 0.02,
    drag: 0.97,
    color: pick(GOLD),
    size: 1.3,
    life: 500,
    maxLife: 500,
  });
  start();
}

function radial(x, y, angle, speed, props) {
  addSpark({
    kind: 'spark',
    x,
    y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    ...props,
  });
}

function burst(x, y, type) {
  const small = width < SMALL_SCREEN;
  addSpark({
    kind: 'spark',
    x,
    y,
    vx: 0,
    vy: 0,
    gravity: 0,
    drag: 1,
    color: '#fff4d6',
    size: 30,
    life: 140,
    maxLife: 140,
    flash: true,
  });
  if (type === 'ring') {
    const color = pick(COLORS);
    const count = small ? 48 : 64;
    const speed = 3.6 + Math.random();
    const ring = { gravity: 0.035, drag: 0.975, color, size: 1.8, life: 1300, maxLife: 1300 };
    for (let i = 0; i < count; i++) radial(x, y, (i * TAU) / count, speed, ring);
    const core = {
      gravity: 0.03,
      drag: 0.97,
      color: '#fff3c4',
      size: 1.4,
      life: 1000,
      maxLife: 1000,
    };
    for (let i = 0; i < 18; i++) radial(x, y, Math.random() * TAU, Math.random() * 1.6, core);
  } else if (type === 'willow') {
    const count = small ? 70 : 95;
    for (let i = 0; i < count; i++) {
      radial(x, y, Math.random() * TAU, 0.6 + Math.sqrt(Math.random()) * 3.4, {
        gravity: 0.022,
        drag: 0.985,
        color: pick(GOLD),
        size: 1.4,
        life: 2400 + Math.random() * 500,
        maxLife: 2900,
        flicker: true,
      });
    }
  } else {
    const first = pick(COLORS);
    const second = pick(COLORS);
    const count = small ? 75 : 100;
    for (let i = 0; i < count; i++) {
      radial(x, y, Math.random() * TAU, (0.35 + 0.65 * Math.sqrt(Math.random())) * 4.6, {
        gravity: 0.04,
        drag: 0.975,
        color: i % 3 ? first : second,
        size: 1.8,
        life: 1100 + Math.random() * 500,
        maxLife: 1600,
        flicker: Math.random() < 0.3,
      });
    }
  }
  sound.boom(type === 'willow' ? 1.1 : 0.9);
}

/** Rasterises text off-screen and samples it into at most `maxPoints` particle targets. */
function textPoints(text, maxWidth, maxHeight, maxPoints) {
  const off = document.createElement('canvas');
  const octx = off.getContext('2d', { willReadFrequently: true });
  let fontSize = maxHeight;
  octx.font = `${fontSize}px ${NAME_FONT}`;
  let textWidth = octx.measureText(text).width;
  if (textWidth > maxWidth) fontSize = Math.max(28, (fontSize * maxWidth) / textWidth);
  octx.font = `${fontSize}px ${NAME_FONT}`;
  textWidth = octx.measureText(text).width;
  off.width = Math.ceil(textWidth + 24);
  off.height = Math.ceil(fontSize * 1.7);
  octx.font = `${fontSize}px ${NAME_FONT}`;
  octx.textAlign = 'center';
  octx.textBaseline = 'middle';
  octx.fillStyle = '#fff';
  octx.fillText(text, off.width / 2, off.height / 2);

  const { width: W, height: H } = off;
  const { data } = octx.getImageData(0, 0, W, H);
  let gap = Math.max(3, Math.round(fontSize / 24));
  let points;
  do {
    points = [];
    for (let y = 0; y < H; y += gap) {
      for (let x = 0; x < W; x += gap) {
        if (data[(y * W + x) * 4 + 3] > 128) points.push({ x: x - W / 2, y: y - H / 2 });
      }
    }
    gap++;
  } while (points.length > maxPoints);
  return points;
}

/** Waits for the display font covering this name's script, but never holds up the show. */
function fontsReady(text) {
  const loads = ['"Yatra One"', '"Tiro Bangla"'].map((font) =>
    document.fonts.load(`60px ${font}`, text),
  );
  const timeout = new Promise((resolve) => setTimeout(resolve, FONT_WAIT_MS));
  return Promise.race([Promise.all(loads), timeout]).catch(() => {});
}

function nameParticles(points, centerX, centerY, fromX, fromY, reduce) {
  for (const point of points) {
    const angle = Math.random() * TAU;
    const speed = 2 + Math.random() * 6;
    spawned.push({
      kind: 'name',
      x: reduce ? centerX + point.x : fromX,
      y: reduce ? centerY + point.y : fromY,
      vx: reduce ? 0 : Math.cos(angle) * speed,
      vy: reduce ? 0 : Math.sin(angle) * speed,
      targetX: centerX + point.x,
      targetY: centerY + point.y,
      age: 0,
      hold: 3300 + Math.random() * 600,
      color: pick(GOLD),
      size: 1.5 + Math.random() * 0.6,
      life: 1500 + Math.random() * 700,
      maxLife: 2200,
      phase: Math.random() * 6,
    });
  }
  start();
}

/** Rockets burst into a name written in sparks, followed by a volley of fireworks. */
async function nameShow(text) {
  await fontsReady(text);
  if (!ctx) return;
  const centerX = width / 2;
  const centerY = height * 0.16;
  const points = textPoints(text, width * 0.86, Math.min(height * 0.14, 130), limits().namePoints);
  if (prefersReducedMotion()) {
    nameParticles(points, centerX, centerY, centerX, centerY, true);
    sound.boom(1);
    return;
  }
  rocket(centerX, centerY, {
    onBurst: (x, y) => {
      nameParticles(points, centerX, centerY, x, y, false);
      burst(x, y, 'ring');
    },
  });
  for (let i = 0; i < 6; i++) later(randomRocket, 600 + i * 520);
  for (let i = 0; i < 5; i++) later(randomRocket, 5600 + i * 380);
}

function updateBudget(elapsed) {
  frameAverage += (elapsed - frameAverage) * 0.05;
  if (frameAverage > SLOW_FRAME_MS) budget = Math.max(MIN_PARTICLE_BUDGET, budget * 0.98);
}

function tick(now) {
  const elapsed = Math.min(50, now - last);
  last = now;
  const f = elapsed / 16.667;
  updateBudget(elapsed);

  ctx.globalCompositeOperation = 'destination-out';
  ctx.fillStyle = `rgba(0,0,0,${Math.min(1, 0.22 * f)})`;
  ctx.fillRect(0, 0, width, height);
  ctx.globalCompositeOperation = 'lighter';

  const next = [];
  for (const p of parts) {
    let alpha = 1;
    if (p.kind === 'rocket') {
      p.x += p.vx * f;
      p.y += p.vy * f;
      p.vy += p.gravity * f;
      addSpark({
        kind: 'spark',
        x: p.x,
        y: p.y + 2,
        vx: (Math.random() - 0.5) * 0.6,
        vy: Math.random() * 0.8,
        gravity: 0.02,
        drag: 0.96,
        color: '#ffcf7a',
        size: 1.2,
        life: 380,
        maxLife: 380,
      });
      if (p.vy >= -0.6) {
        if (p.options.onBurst) p.options.onBurst(p.x, p.y);
        else burst(p.x, p.y, p.options.type);
        continue;
      }
    } else if (p.kind === 'name') {
      p.age += elapsed;
      if (p.age < p.hold) {
        const damp = Math.pow(0.86, f);
        p.vx = (p.vx + (p.targetX - p.x) * 0.045 * f) * damp;
        p.vy = (p.vy + (p.targetY - p.y) * 0.045 * f) * damp;
        p.x += p.vx * f;
        p.y += p.vy * f;
        alpha = 0.78 + Math.sin(p.age * 0.012 + p.phase) * 0.22;
      } else {
        p.vy += 0.03 * f;
        p.vx *= 0.99;
        p.x += p.vx * f;
        p.y += p.vy * f;
        p.life -= elapsed;
        if (p.life <= 0) continue;
        alpha = p.life / p.maxLife;
      }
    } else {
      p.x += p.vx * f;
      p.y += p.vy * f;
      const drag = Math.pow(p.drag, f);
      p.vx *= drag;
      p.vy = p.vy * drag + p.gravity * f;
      p.life -= elapsed;
      if (p.life <= 0) continue;
      alpha = p.life / p.maxLife;
      if (p.flicker && Math.random() < 0.3) alpha *= 0.25;
      if (p.flash) alpha *= 0.22;
    }
    ctx.globalAlpha = alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, TAU);
    ctx.fill();
    next.push(p);
  }
  ctx.globalAlpha = 1;
  parts = next.concat(spawned);
  spawned = [];

  if (parts.length) {
    idleFrames = 0;
  } else if (++idleFrames > 45) {
    ctx.clearRect(0, 0, width, height);
    frame = 0;
    return;
  }
  frame = requestAnimationFrame(tick);
}

export const fireworks = {
  resize,
  rocket,
  spark,
  nameShow,

  /** Binds the shared overlay canvas. Returns a function that releases it. */
  attach(element) {
    canvas = element;
    resize();
    return () => {
      cancelAnimationFrame(frame);
      frame = 0;
      parts = [];
      spawned = [];
      canvas = null;
      ctx = null;
    };
  },

  /** Cancels fireworks that are scheduled but have not launched yet. */
  cancelScheduled() {
    timers.forEach(clearTimeout);
    timers.clear();
  },
};
