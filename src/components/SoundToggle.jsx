import { useState } from 'react';
import { sound } from '../lib/audio';

export default function SoundToggle() {
  const [muted, setMuted] = useState(sound.muted);

  const toggle = () => {
    sound.setMuted(!muted);
    sound.unlock();
    setMuted(!muted);
  };

  return (
    <button type="button" className="pill" aria-pressed={!muted} onClick={toggle}>
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <path d="M4 9h4l5-4v14l-5-4H4z" />
        {!muted && <path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11" />}
      </svg>
      {muted ? 'Sound off' : 'Sound on'}
    </button>
  );
}
