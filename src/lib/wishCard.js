import { seededRandom } from './random';
import { paintFullRangoli } from './rangoli';
import { cardLines } from './wishes';

const WIDTH = 1080;
const HEIGHT = 1350;
const TAU = Math.PI * 2;
const MARGIN = 80;
const TEXT_WIDTH = WIDTH - MARGIN * 2;
const DISPLAY_FONT = '"Yatra One","Tiro Bangla",Georgia,serif';
const BODY_FONT = '"Mukta","Hind Siliguri",system-ui,sans-serif';
const FILE_NAME = 'pass-the-flame-diwali.jpg';

const RANGOLI_SIZE = 700;
const CENTER_Y = 530;
const WISH_TOP = 930;
const WISH_BOTTOM = 1210;

function loadFonts(text) {
  const fonts = ['"Yatra One"', '"Tiro Bangla"', 'Mukta', '"Hind Siliguri"'];
  return Promise.all(fonts.map((font) => document.fonts.load(`40px ${font}`, text))).catch(
    () => {},
  );
}

function paintSky(ctx) {
  const sky = ctx.createLinearGradient(0, 0, 0, HEIGHT);
  sky.addColorStop(0, '#06040f');
  sky.addColorStop(0.55, '#150a26');
  sky.addColorStop(1, '#2b1126');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  const random = seededRandom(7);
  for (let i = 0; i < 260; i++) {
    ctx.fillStyle = `rgba(255,240,215,${0.2 + random() * 0.7})`;
    ctx.beginPath();
    ctx.arc(random() * WIDTH, random() * HEIGHT, Math.pow(random(), 3) * 2.6 + 0.6, 0, TAU);
    ctx.fill();
  }
}

/** The lit diya, drawn from the same shapes as the Diya component's SVG. */
function paintDiya(ctx) {
  const scale = 2.5;
  const bodyWidth = 120 * scale;
  ctx.save();
  ctx.translate((WIDTH - bodyWidth) / 2, CENTER_Y - 68);
  ctx.scale(scale, scale);

  const clay = ctx.createLinearGradient(0, 26, 0, 68);
  clay.addColorStop(0, '#e57a3c');
  clay.addColorStop(0.55, '#a63c18');
  clay.addColorStop(1, '#5a1b0a');
  ctx.fillStyle = clay;
  ctx.fill(new Path2D('M6 26 C10 54 34 68 60 68 C86 68 110 54 114 26 Z'));

  ctx.fillStyle = '#e23d5b';
  ctx.beginPath();
  ctx.arc(60, 54, 4.6, 0, TAU);
  ctx.fill();
  ctx.fillStyle = '#ffd166';
  ctx.beginPath();
  ctx.arc(60, 54, 1.9, 0, TAU);
  ctx.fill();

  const rim = ctx.createLinearGradient(0, 16, 0, 36);
  rim.addColorStop(0, '#f6a466');
  rim.addColorStop(1, '#c2552a');
  ctx.fillStyle = rim;
  ctx.beginPath();
  ctx.ellipse(60, 26, 54, 10, 0, 0, TAU);
  ctx.fill();
  ctx.fillStyle = '#4a2208';
  ctx.beginPath();
  ctx.ellipse(60, 25.5, 45, 6.5, 0, 0, TAU);
  ctx.fill();
  ctx.restore();

  const wickY = CENTER_Y - 68 + 22.5 * scale;
  const halo = ctx.createRadialGradient(WIDTH / 2, wickY - 40, 0, WIDTH / 2, wickY - 40, 240);
  halo.addColorStop(0, 'rgba(255,200,110,.6)');
  halo.addColorStop(1, 'rgba(255,120,30,0)');
  ctx.fillStyle = halo;
  ctx.fillRect(WIDTH / 2 - 240, wickY - 280, 480, 480);

  const flameHeight = 120;
  const flame = ctx.createRadialGradient(
    WIDTH / 2,
    wickY - flameHeight * 0.3,
    0,
    WIDTH / 2,
    wickY - flameHeight * 0.3,
    flameHeight * 0.7,
  );
  flame.addColorStop(0, '#fffdf0');
  flame.addColorStop(0.35, '#ffe48e');
  flame.addColorStop(0.65, '#ffb02e');
  flame.addColorStop(1, '#ff5414');
  ctx.fillStyle = flame;
  ctx.beginPath();
  ctx.moveTo(WIDTH / 2, wickY - flameHeight);
  ctx.bezierCurveTo(WIDTH / 2 + 46, wickY - 50, WIDTH / 2 + 34, wickY, WIDTH / 2, wickY);
  ctx.bezierCurveTo(
    WIDTH / 2 - 34,
    wickY,
    WIDTH / 2 - 46,
    wickY - 50,
    WIDTH / 2,
    wickY - flameHeight,
  );
  ctx.fill();
}

function wrapLines(ctx, text, maxWidth) {
  const lines = [];
  let line = '';
  for (const word of text.split(/\s+/)) {
    const candidate = line ? `${line} ${word}` : word;
    if (line && ctx.measureText(candidate).width > maxWidth) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  return lines;
}

/** Largest font size at which the wish fits between the rangoli and the signature. */
function fitWish(ctx, text) {
  const space = WISH_BOTTOM - WISH_TOP;
  for (let size = 48; size > 26; size -= 2) {
    ctx.font = `${size}px ${BODY_FONT}`;
    const lines = wrapLines(ctx, text, TEXT_WIDTH);
    const lineHeight = size * 1.4;
    if (lines.length * lineHeight <= space) return { lines, lineHeight };
  }
  return { lines: wrapLines(ctx, text, TEXT_WIDTH), lineHeight: 36 };
}

/** Draws the greeting as a portrait image suited to WhatsApp Status and stories. */
async function drawCard(greeting) {
  const { title, sign } = cardLines(greeting);
  await loadFonts(`${title}${greeting.message}${sign}`);

  const canvas = document.createElement('canvas');
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext('2d');
  paintSky(ctx);

  ctx.save();
  ctx.translate((WIDTH - RANGOLI_SIZE) / 2, CENTER_Y - RANGOLI_SIZE / 2);
  paintFullRangoli(ctx, greeting.to, RANGOLI_SIZE);
  ctx.restore();
  paintDiya(ctx);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';

  ctx.fillStyle = '#ffe6ae';
  ctx.shadowColor = 'rgba(255,160,50,.6)';
  ctx.shadowBlur = 30;
  ctx.font = `64px ${DISPLAY_FONT}`;
  const titleWidth = ctx.measureText(title).width;
  if (titleWidth > TEXT_WIDTH) {
    ctx.font = `${Math.floor((64 * TEXT_WIDTH) / titleWidth)}px ${DISPLAY_FONT}`;
  }
  ctx.fillText(title, WIDTH / 2, 130);
  ctx.shadowBlur = 0;

  const { lines, lineHeight } = fitWish(ctx, greeting.message);
  const blockHeight = lines.length * lineHeight;
  const firstLine = WISH_TOP + (WISH_BOTTOM - WISH_TOP - blockHeight) / 2 + lineHeight * 0.75;
  ctx.fillStyle = '#f8ecd8';
  lines.forEach((line, i) => ctx.fillText(line, WIDTH / 2, firstLine + i * lineHeight));

  ctx.fillStyle = '#c3b2cf';
  ctx.font = `36px ${BODY_FONT}`;
  ctx.fillText(sign, WIDTH / 2, 1262);
  ctx.fillStyle = '#ffb238';
  ctx.font = `30px ${DISPLAY_FONT}`;
  ctx.fillText('Pass the Flame', WIDTH / 2, 1316);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Card could not be drawn'))),
      'image/jpeg',
      0.92,
    );
  });
}

function download(blob) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = FILE_NAME;
  link.click();
  URL.revokeObjectURL(url);
}

/** Opens the share sheet where images can be shared, otherwise downloads. */
export async function shareWishCard(greeting) {
  const blob = await drawCard(greeting);
  const file = new File([blob], FILE_NAME, { type: blob.type });
  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file] });
      return 'shared';
    } catch (error) {
      if (error.name === 'AbortError') return 'cancelled';
    }
  }
  download(blob);
  return 'saved';
}
