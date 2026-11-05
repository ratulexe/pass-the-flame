import { sound } from './audio';
import { prepareCanvas } from './backdrop';
import { prefersReducedMotion } from './motion';
import { hashString, seededRandom } from './random';

const TAU = Math.PI * 2;
const FRAME_MS = 33;
const BORN_MS = 1400;
const SPRITE_SIZE = 96;
const SMALL_SCREEN = 520;
const NOTES = 8;

/** Paints the lamp once, so a frame only copies images however many diyas there are. */
function makeLampSprite() {
  const sprite = document.createElement('canvas');
  sprite.width = sprite.height = SPRITE_SIZE;
  const ctx = sprite.getContext('2d');
  const center = SPRITE_SIZE / 2;

  const body = new Path2D('M26 54 C28 70 40 76 48 76 C56 76 68 70 70 54 Z');
  const clay = ctx.createLinearGradient(0, 54, 0, 76);
  clay.addColorStop(0, '#e57a3c');
  clay.addColorStop(1, '#6a2410');
  ctx.fillStyle = clay;
  ctx.fill(body);
  ctx.fillStyle = '#f6a466';
  ctx.beginPath();
  ctx.ellipse(center, 54, 22, 4.5, 0, 0, TAU);
  ctx.fill();

  const flame = ctx.createRadialGradient(center, 44, 0, center, 44, 16);
  flame.addColorStop(0, '#fffdf0');
  flame.addColorStop(0.45, '#ffe48e');
  flame.addColorStop(1, '#ff8a1f');
  ctx.fillStyle = flame;
  ctx.beginPath();
  ctx.moveTo(center, 26);
  ctx.bezierCurveTo(center + 11, 40, center + 8, 53, center, 53);
  ctx.bezierCurveTo(center - 8, 53, center - 11, 40, center, 26);
  ctx.fill();
  return sprite;
}

function makeGlowSprite() {
  const sprite = document.createElement('canvas');
  sprite.width = sprite.height = SPRITE_SIZE;
  const ctx = sprite.getContext('2d');
  const center = SPRITE_SIZE / 2;
  const glow = ctx.createRadialGradient(center, center, 0, center, center, center);
  glow.addColorStop(0, 'rgba(255,190,90,.6)');
  glow.addColorStop(1, 'rgba(255,140,40,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, SPRITE_SIZE, SPRITE_SIZE);
  return sprite;
}

/** Each diya's place comes from its id, so everyone sees the same sky. */
function placeDiya({ id, passed }) {
  const random = seededRandom(hashString(id));
  return {
    id,
    x: 0.05 + random() * 0.9,
    y: 0.3 + random() * 0.62,
    phase: random() * TAU,
    speed: 0.0016 + random() * 0.0022,
    scale: (passed ? 1.2 : 1) * (0.8 + random() * 0.3),
    born: 0,
  };
}

/** Draws the live night sky of diyas onto `canvas`. */
export function createDeepmala(canvas) {
  const lamp = makeLampSprite();
  const glow = makeGlowSprite();
  let view = prepareCanvas(canvas);
  let diyas = [];
  let frame = 0;
  let lastDraw = 0;
  let firstSet = true;

  function draw(now) {
    const { ctx, width, height } = view;
    const base = width < SMALL_SCREEN ? 30 : 38;
    ctx.clearRect(0, 0, width, height);
    for (const diya of diyas) {
      const age = diya.born ? Math.min(1, (now - diya.born) / BORN_MS) : 1;
      const grow = 1 - Math.pow(1 - age, 3);
      const size = base * diya.scale * grow;
      if (size > 0) {
        const x = diya.x * width;
        const y = diya.y * height;
        // A new diya flares brightly, then settles to the same flicker as the rest.
        const flare = 2.2 - 1.2 * age;
        ctx.globalAlpha = Math.min(
          1,
          (0.62 + 0.28 * Math.sin(now * diya.speed + diya.phase)) * flare,
        );
        const glowSize = size * 2.4 * (age < 1 ? flare : 1);
        ctx.drawImage(glow, x - glowSize / 2, y - glowSize / 2, glowSize, glowSize);
        ctx.globalAlpha = 1;
        ctx.drawImage(lamp, x - size / 2, y - size / 2, size, size);
      }
    }
  }

  function tick(now) {
    if (now - lastDraw >= FRAME_MS) {
      lastDraw = now;
      draw(now);
    }
    frame = requestAnimationFrame(tick);
  }

  function drawStill() {
    draw(0);
  }

  return {
    /** Shows these diyas, and returns how many just appeared. */
    setDiyas(list) {
      const known = new Map(diyas.map((diya) => [diya.id, diya]));
      const reduce = prefersReducedMotion();
      let added = 0;
      diyas = list.map((item) => {
        const existing = known.get(item.id);
        if (existing) return existing;
        const diya = placeDiya(item);
        if (!firstSet) {
          added++;
          if (!reduce) diya.born = performance.now();
          sound.note(hashString(item.id) % NOTES);
        }
        return diya;
      });
      firstSet = false;
      if (reduce) drawStill();
      return added;
    },

    start() {
      if (prefersReducedMotion()) drawStill();
      else frame = requestAnimationFrame(tick);
    },

    resize() {
      view = prepareCanvas(canvas);
      if (prefersReducedMotion()) drawStill();
    },

    stop() {
      cancelAnimationFrame(frame);
    },
  };
}
