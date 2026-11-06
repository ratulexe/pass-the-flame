import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DeepmalaCanvas from '../components/DeepmalaCanvas';
import { VISIBLE_DIYAS, watchSky } from '../lib/sky';

const formatCount = (value) => (value ?? 0).toLocaleString('en-IN');

function Stat({ value, label }) {
  return (
    <div className="flex flex-col">
      <span className="font-display text-[2rem] leading-tight text-glow">
        {value === null ? '…' : formatCount(value)}
      </span>
      <span className="text-[0.9rem] text-muted">{label}</span>
    </div>
  );
}

export default function SkyPage() {
  const [diyas, setDiyas] = useState(null);
  const [stats, setStats] = useState(null);
  const [failed, setFailed] = useState(false);
  const total = stats?.totalDiyas ?? null;
  const passed = stats ? (stats.flamesPassed ?? 0) : null;

  useEffect(() => {
    window.scrollTo(0, 0);
    return watchSky({ onDiyas: setDiyas, onStats: setStats, onError: () => setFailed(true) });
  }, []);

  return (
    <section className="flex flex-col gap-[22px]" aria-label="The Deepmala sky">
      <DeepmalaCanvas diyas={diyas} />
      <div className="flex flex-col gap-2">
        <h1>The Deepmala sky</h1>
        <p className="text-[1.05rem] text-muted">
          Every glowing diya is a flame someone lit for someone they love. Watch new ones appear
          live, and tap one to hear it sing.
        </p>
      </div>

      <div className="card">
        {failed ? (
          <p role="status">The sky is resting for now. Please check back in a little while.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <Stat value={total} label={total === 1 ? 'diya lit' : 'diyas lit'} />
            <Stat value={passed} label={passed === 1 ? 'flame passed on' : 'flames passed on'} />
          </div>
        )}
      </div>

      {!failed && total > VISIBLE_DIYAS && (
        <p className="-mt-1.5 text-center text-[0.9rem] text-muted">
          Showing the latest {VISIBLE_DIYAS} diyas.
        </p>
      )}
      {!failed && total === 0 && (
        <p className="-mt-1.5 text-center text-[0.9rem] text-muted">
          The sky is waiting for its first diya. It could be yours.
        </p>
      )}

      <div className="min-h-[38vh]" />
      <Link to="/" className="btn btn-primary btn-big text-center">
        Light a diya
      </Link>
    </section>
  );
}
