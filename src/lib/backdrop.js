import { seededRandom } from './random';

const TAU = Math.PI * 2;
const MAX_DPR = 2;
export const TORAN_HEIGHT = 72;

/** Sizes a canvas to its CSS box, capped at MAX_DPR, and returns a CSS-pixel context. */
export function prepareCanvas(canvas) {
  const dpr = Math.min(MAX_DPR, window.devicePixelRatio || 1);
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, width, height };
}

/** Night sky with a warm glow at the bottom and a far-off horizon of lamps. */
export function drawStars(canvas) {
  const { ctx, width: W, height: H } = prepareCanvas(canvas);
  const sky = ctx.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, '#06040f');
  sky.addColorStop(0.55, '#150a26');
  sky.addColorStop(1, '#2b1126');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H);

  const glow = ctx.createRadialGradient(W / 2, H * 1.08, 0, W / 2, H * 1.08, Math.max(W, H) * 0.75);
  glow.addColorStop(0, 'rgba(255,130,50,.26)');
  glow.addColorStop(1, 'rgba(255,130,50,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  const random = seededRandom(7);
  const stars = Math.round((W * H) / 2400);
  for (let i = 0; i < stars; i++) {
    const radius = Math.pow(random(), 3) * 1.3 + 0.25;
    const alpha = 0.2 + random() * 0.7;
    ctx.fillStyle = random() < 0.2 ? `rgba(255,214,160,${alpha})` : `rgba(255,255,255,${alpha})`;
    ctx.beginPath();
    ctx.arc(random() * W, random() * H * 0.9, radius, 0, TAU);
    ctx.fill();
  }

  const lamps = Math.round(W / 12);
  for (let i = 0; i < lamps; i++) {
    const x = random() * W;
    const y = H - 3 - random() * H * 0.07;
    const halo = ctx.createRadialGradient(x, y, 0, x, y, 7);
    halo.addColorStop(0, 'rgba(255,190,90,.55)');
    halo.addColorStop(1, 'rgba(255,150,50,0)');
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(x, y, 7, 0, TAU);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,236,180,.9)';
    ctx.beginPath();
    ctx.arc(x, y, 0.9, 0, TAU);
    ctx.fill();
  }
}

/** Marigold garland swags with mango leaves, across the top of the page. */
export function drawToran(canvas) {
  const { ctx, width: W } = prepareCanvas(canvas);
  const bead = (x, y, color) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, 4.8, 0, TAU);
    ctx.fill();
    ctx.strokeStyle = 'rgba(120,30,0,.35)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, TAU);
    ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,220,.35)';
    ctx.beginPath();
    ctx.arc(x - 1.4, y - 1.6, 1.3, 0, TAU);
    ctx.fill();
  };
  const leaf = (x, y, rotation) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.fillStyle = '#2f8f3a';
    ctx.beginPath();
    ctx.ellipse(0, 0, 3.6, 9, 0, 0, TAU);
    ctx.fill();
    ctx.strokeStyle = '#1b5a24';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(0, -8);
    ctx.lineTo(0, 8);
    ctx.stroke();
    ctx.restore();
  };

  const swags = Math.max(2, Math.round(W / (W < 520 ? 96 : 130)));
  const swagWidth = W / swags;
  const sag = 28;
  for (let s = 0; s < swags; s++) {
    const x0 = s * swagWidth;
    const x1 = x0 + swagWidth;
    const steps = Math.round(swagWidth / 8.6);
    for (let k = 0; k <= steps; k++) {
      const t = k / steps;
      const x = (1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * (x0 + swagWidth / 2) + t * t * x1;
      const y = (1 - t) * (1 - t) * 4 + 2 * (1 - t) * t * (4 + sag * 2) + t * t * 4;
      bead(x, y, k % 2 ? '#ffc53a' : '#ff7f11');
    }
  }
  for (let s = 0; s <= swags; s++) {
    const x = s * swagWidth;
    leaf(x - 5, 48, -0.45);
    leaf(x + 5, 48, 0.45);
    for (let k = 0; k < 4; k++) bead(x, 8 + k * 8.6, k % 2 ? '#ff7f11' : '#ffc53a');
  }
}
