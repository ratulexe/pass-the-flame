import { seededRandom } from '../lib/random';

const LANTERNS = [
  { left: '7%', width: 20, seconds: 34, delay: -3 },
  { left: '26%', width: 14, seconds: 46, delay: -27 },
  { left: '52%', width: 18, seconds: 40, delay: -14 },
  { left: '74%', width: 12, seconds: 52, delay: -38 },
  { left: '90%', width: 22, seconds: 36, delay: -22 },
];

const random = seededRandom(23);
const TWINKLES = Array.from({ length: 14 }, () => ({
  left: `${random() * 100}%`,
  top: `${random() * 80}%`,
  seconds: 2.5 + random() * 3.5,
  delay: -random() * 6,
}));

/** Gentle movement over the painted night sky. */
export default function SkyLife() {
  return (
    <div className="sky-life" aria-hidden="true">
      {TWINKLES.map(({ left, top, seconds, delay }) => (
        <span
          key={`${left}-${top}`}
          className="twinkle"
          style={{ left, top, animationDuration: `${seconds}s`, animationDelay: `${delay}s` }}
        />
      ))}
      {LANTERNS.map(({ left, width, seconds, delay }) => (
        <span
          key={left}
          className="lantern"
          style={{
            left,
            width,
            height: width * 1.25,
            animationDuration: `${seconds}s`,
            animationDelay: `${delay}s`,
          }}
        />
      ))}
    </div>
  );
}
