import { useEffect, useRef } from 'react';
import { sound } from '../lib/audio';

const REST_ROTATION = 'rotate(-28deg)';
const LIGHT_DISTANCE = 38;

/**
 * Draggable lit match. `onLight` runs when its head reaches `targetRef`, and returns false to
 * send the match back. It is decorative for assistive tech: pages also offer a real button.
 */
export default function Matchstick({ targetRef, onLight, gone }) {
  const matchRef = useRef(null);
  const headRef = useRef(null);
  const drag = useRef(null);

  // Return to the resting place when the form is reset for another diya.
  useEffect(() => {
    if (!gone) matchRef.current.style.transform = '';
  }, [gone]);

  const goBack = () => {
    const match = matchRef.current;
    match.classList.remove('match-dragging');
    match.classList.add('match-back');
    match.style.transform = '';
  };

  const onPointerDown = (event) => {
    if (gone) return;
    sound.unlock();
    drag.current = { x: event.clientX, y: event.clientY };
    const match = matchRef.current;
    match.setPointerCapture(event.pointerId);
    match.classList.add('match-dragging');
    match.classList.remove('match-back');
    event.preventDefault();
  };

  const onPointerMove = (event) => {
    if (!drag.current) return;
    const dx = event.clientX - drag.current.x;
    const dy = event.clientY - drag.current.y;
    matchRef.current.style.transform = `translate(${dx}px,${dy}px) ${REST_ROTATION}`;

    const head = headRef.current.getBoundingClientRect();
    const target = targetRef.current.getBoundingClientRect();
    const distance = Math.hypot(
      head.left + head.width / 2 - target.left,
      head.top + 2 - target.top,
    );
    if (distance < LIGHT_DISTANCE) {
      drag.current = null;
      if (!onLight()) goBack();
    }
  };

  const onPointerEnd = () => {
    if (!drag.current) return;
    drag.current = null;
    goBack();
  };

  return (
    <div
      ref={matchRef}
      className={`match ${gone ? 'match-gone' : ''}`}
      aria-hidden="true"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerEnd}
      onPointerCancel={onPointerEnd}
    >
      <div className="match-stick" />
      <div className="match-head" ref={headRef} />
      <div className="match-flame">
        <div className="flame-core" />
      </div>
    </div>
  );
}
