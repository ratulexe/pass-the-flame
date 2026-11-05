import { prefersReducedMotion } from './motion';
import { hashString, seededRandom } from './random';

const TAU = Math.PI * 2;
const MAX_DPR = 2;
const CHALK = 'rgba(255,247,232,.92)';
const PALETTES = [
  ['#e23d5b', '#ff8a1f', '#ffd166', '#2ec4b6', '#f7f1e3'],
  ['#c2185b', '#ff6f00', '#ffca28', '#9c4dcc', '#26a69a'],
  ['#ff5e7e', '#ffb238', '#8ee3c8', '#5b8cff', '#fff1c9'],
  ['#d7263d', '#f46036', '#f9c80e', '#1b998b', '#ececf0'],
  ['#ff7a00', '#ffd23f', '#ee4266', '#8f5bd6', '#3bceac'],
];
const SYMMETRIES = [6, 8, 8, 10, 12, 12, 16];
const LAYER_TYPES = ['petals', 'dots', 'scallop', 'diamonds', 'star', 'wave', 'petals'];

/** Turns a name into a rangoli pattern. The same name always gives the same pattern. */
function buildRangoli(name) {
  const random = seededRandom(hashString((name || '').trim().toLowerCase() || 'diwali'));
  const palette = PALETTES[Math.floor(random() * PALETTES.length)].slice();
  for (let i = palette.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [palette[i], palette[j]] = [palette[j], palette[i]];
  }
  const symmetry = SYMMETRIES[Math.floor(random() * SYMMETRIES.length)];
  const layers = [];
  let radius = 0.2;
  let index = 0;
  let previous = '';
  while (radius < 0.84) {
    const width = 0.075 + random() * 0.08;
    let type = LAYER_TYPES[Math.floor(random() * LAYER_TYPES.length)];
    if (type === previous) type = type === 'petals' ? 'dots' : 'petals';
    previous = type;
    layers.push({
      type,
      r0: radius,
      r1: Math.min(0.88, radius + width),
      color: palette[index % palette.length],
      color2: palette[(index + 2) % palette.length],
      offset: random() < 0.5,
      multiplier: 1 + Math.floor(random() * 2),
    });
    radius += width + 0.012;
    index++;
  }
  layers.push({
    type: 'border',
    r0: 0.9,
    r1: 0.99,
    color: palette[0],
    color2: palette[1],
    multiplier: 1,
  });
  return { symmetry, layers };
}

const LAYER_PAINTERS = {
  petals(ctx, { layer, n, r0, r1, mid, band, lw }) {
    const count = n * layer.multiplier;
    const petal = Math.min(band * 0.55, Math.sin(Math.PI / count) * r1 * 0.95);
    for (let j = 0; j < count; j++) {
      ctx.save();
      ctx.rotate((j * TAU) / count + (layer.offset ? Math.PI / count : 0));
      ctx.beginPath();
      ctx.moveTo(r0, 0);
      ctx.quadraticCurveTo(mid, petal * 1.1, r1, 0);
      ctx.quadraticCurveTo(mid, -petal * 1.1, r0, 0);
      ctx.fillStyle = layer.color;
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(r0 + band * 0.22, 0);
      ctx.quadraticCurveTo(mid, petal * 0.45, r1 - band * 0.16, 0);
      ctx.quadraticCurveTo(mid, -petal * 0.45, r0 + band * 0.22, 0);
      ctx.fillStyle = layer.color2;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(r1 + lw * 2.2, 0, lw * 1.4, 0, TAU);
      ctx.fillStyle = CHALK;
      ctx.fill();
      ctx.restore();
    }
  },

  dots(ctx, { layer, n, mid, band }) {
    const count = n * (layer.multiplier + 1);
    const dot = Math.min(band * 0.34, ((Math.PI * mid) / count) * 0.72);
    for (let j = 0; j < count; j++) {
      const angle = (j * TAU) / count;
      const x = Math.cos(angle) * mid;
      const y = Math.sin(angle) * mid;
      ctx.beginPath();
      ctx.arc(x, y, dot, 0, TAU);
      ctx.fillStyle = j % 2 ? layer.color : layer.color2;
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x, y, dot * 0.3, 0, TAU);
      ctx.fillStyle = CHALK;
      ctx.fill();
    }
  },

  scallop(ctx, { layer, n, r0, band, lw }) {
    const count = n * 2;
    const arc = Math.min(band * 0.6, ((Math.PI * r0) / count) * 1.05);
    ctx.beginPath();
    for (let j = 0; j < count; j++) {
      const t = (j * TAU) / count;
      ctx.arc(Math.cos(t) * r0, Math.sin(t) * r0, arc, t - Math.PI / 2, t + Math.PI / 2);
    }
    ctx.closePath();
    ctx.moveTo(r0 * 0.97, 0);
    ctx.arc(0, 0, r0 * 0.97, 0, TAU, true);
    ctx.fillStyle = layer.color;
    ctx.fill('evenodd');
    ctx.stroke();
    for (let j = 0; j < count; j++) {
      const t = (j * TAU) / count;
      ctx.beginPath();
      ctx.arc(Math.cos(t) * (r0 + arc * 0.55), Math.sin(t) * (r0 + arc * 0.55), lw * 1.5, 0, TAU);
      ctx.fillStyle = layer.color2;
      ctx.fill();
    }
  },

  diamonds(ctx, { layer, n, mid, band }) {
    const count = n * 2;
    const size = Math.min(band * 0.5, ((Math.PI * mid) / count) * 0.9);
    for (let j = 0; j < count; j++) {
      ctx.save();
      ctx.rotate((j * TAU) / count + (layer.offset ? Math.PI / count : 0));
      ctx.beginPath();
      ctx.moveTo(mid - size, 0);
      ctx.lineTo(mid, size * 0.62);
      ctx.lineTo(mid + size, 0);
      ctx.lineTo(mid, -size * 0.62);
      ctx.closePath();
      ctx.fillStyle = j % 2 ? layer.color : layer.color2;
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }
  },

  star(ctx, { layer, n, r0, r1 }) {
    const count = n * layer.multiplier;
    ctx.beginPath();
    for (let j = 0; j <= count * 2; j++) {
      const radius = j % 2 ? r0 : r1;
      const angle = (j * Math.PI) / count;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      if (j) ctx.lineTo(x, y);
      else ctx.moveTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
    ctx.moveTo(r0 * 0.9, 0);
    ctx.arc(0, 0, r0 * 0.9, 0, TAU, true);
    ctx.fillStyle = layer.color;
    ctx.fill('evenodd');
  },

  wave(ctx, { layer, n, r0, r1, mid, band, lw }) {
    ctx.save();
    ctx.globalAlpha *= 0.5;
    ctx.beginPath();
    ctx.arc(0, 0, r1, 0, TAU);
    ctx.moveTo(r0, 0);
    ctx.arc(0, 0, r0, 0, TAU, true);
    ctx.fillStyle = layer.color;
    ctx.fill('evenodd');
    ctx.restore();
    ctx.beginPath();
    for (let t = 0; t <= TAU + 0.01; t += TAU / 360) {
      const radius = mid + band * 0.32 * Math.sin(n * 2 * t);
      const x = Math.cos(t) * radius;
      const y = Math.sin(t) * radius;
      if (t) ctx.lineTo(x, y);
      else ctx.moveTo(x, y);
    }
    ctx.strokeStyle = layer.color2;
    ctx.lineWidth = lw * 2.4;
    ctx.stroke();
    ctx.strokeStyle = CHALK;
    ctx.lineWidth = lw * 0.8;
    ctx.stroke();
  },

  border(ctx, { layer, n, r0, mid, band }) {
    ctx.beginPath();
    ctx.arc(0, 0, r0, 0, TAU);
    ctx.stroke();
    const count = n * 4;
    const dot = Math.min(band * 0.3, ((Math.PI * mid) / count) * 0.75);
    for (let j = 0; j < count; j++) {
      const angle = (j * TAU) / count;
      ctx.beginPath();
      ctx.arc(Math.cos(angle) * mid, Math.sin(angle) * mid, j % 2 ? dot * 0.55 : dot, 0, TAU);
      ctx.fillStyle = j % 2 ? CHALK : layer.color;
      ctx.fill();
    }
  },
};

function drawLayer(ctx, layer, n, R, lw) {
  const r0 = layer.r0 * R;
  const r1 = layer.r1 * R;
  ctx.lineWidth = lw;
  ctx.strokeStyle = CHALK;
  LAYER_PAINTERS[layer.type](ctx, {
    layer,
    n,
    r0,
    r1,
    mid: (r0 + r1) / 2,
    band: r1 - r0,
    lw,
  });
}

/** Draws the rangoli with its layers opened up to `progress` (0 to 1). */
function drawRangoli(canvas, model, progress, dim) {
  const dpr = Math.min(MAX_DPR, window.devicePixelRatio || 1);
  const size = canvas.clientWidth;
  if (!size) return;
  const pixels = Math.round(size * dpr);
  if (canvas.width !== pixels) canvas.width = canvas.height = pixels;
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, size, size);
  paintRangoli(ctx, model, size, progress, dim);
}

function paintRangoli(ctx, model, size, progress, dim) {
  const R = size / 2;
  const count = model.layers.length;
  const lw = Math.max(1, size / 320);
  ctx.lineJoin = 'round';
  model.layers.forEach((layer, i) => {
    let q = Math.max(0, Math.min(1, (progress * (count + 1.5) - i) / 1.5));
    if (q <= 0) return;
    q = 1 - Math.pow(1 - q, 3);
    ctx.save();
    ctx.globalAlpha = q * (dim ? 0.3 : 1);
    ctx.translate(R, R);
    const scale = 0.72 + 0.28 * q;
    ctx.scale(scale, scale);
    ctx.rotate((1 - q) * 0.6 * (i % 2 ? 1 : -1));
    drawLayer(ctx, layer, model.symmetry, R, lw);
    ctx.restore();
  });
}

/** Paints a name's finished rangoli into a `size` square at the context's origin. */
export function paintFullRangoli(ctx, name, size) {
  paintRangoli(ctx, buildRangoli(name), size, 1, false);
}

/** Blooms a name's rangoli over `duration` ms. Returns a function that cancels the bloom. */
export function bloomRangoli(canvas, name, { duration = 0, dim = false } = {}) {
  const model = buildRangoli(name);
  if (prefersReducedMotion() || !duration) {
    drawRangoli(canvas, model, 1, dim);
    return () => {};
  }
  const start = performance.now();
  let frame = 0;
  const step = (now) => {
    const progress = Math.min(1, (now - start) / duration);
    drawRangoli(canvas, model, progress, dim);
    if (progress < 1) frame = requestAnimationFrame(step);
  };
  frame = requestAnimationFrame(step);
  return () => cancelAnimationFrame(frame);
}
