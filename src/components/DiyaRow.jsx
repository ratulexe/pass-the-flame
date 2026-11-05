import { useEffect, useState } from 'react';
import { sound } from '../lib/audio';
import { fireworks } from '../lib/fireworks';

const DIYA_COUNT = 7;

/** A row of diyas to light by hand. Each one plays a note, and a full row sets off a finale. */
export default function DiyaRow() {
  const [lit, setLit] = useState(() => Array(DIYA_COUNT).fill(false));
  const complete = lit.every(Boolean);

  useEffect(() => {
    if (!complete) return;
    sound.flourish();
    fireworks.volley();
  }, [complete]);

  const tap = (index) => {
    sound.unlock();
    sound.note(index);
    setLit((current) => current.map((isLit, i) => isLit || i === index));
  };

  return (
    <div className="card">
      <h2 className="card-title">Light up the whole row</h2>
      <div className="diya-keys">
        {lit.map((isLit, index) => (
          <button
            key={index}
            type="button"
            className="diya-key"
            aria-label={`Diya ${index + 1}`}
            aria-pressed={isLit}
            onClick={() => tap(index)}
          >
            <span className={`mini-diya ${isLit ? 'mini-diya-lit' : ''}`} />
          </button>
        ))}
      </div>
      <p className="text-[0.95rem] text-muted" role="status">
        {complete
          ? 'The whole row is glowing. Tap any diya to keep playing.'
          : 'Tap each diya. Every flame sings a note of raag Bhupali.'}
      </p>
    </div>
  );
}
