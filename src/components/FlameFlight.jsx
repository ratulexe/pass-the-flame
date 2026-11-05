import { useEffect, useRef } from 'react';
import { fireworks } from '../lib/fireworks';

const FLIGHT_MS = 2100;
const SPARK_INTERVAL_MS = 35;
const FLAME_WIDTH = 24;
const FLAME_HEIGHT = 44;

/** Flies the sender's flame down from the top of the screen to `targetRef`. */
export default function FlameFlight({ targetRef, onArrive }) {
  const flameRef = useRef(null);

  useEffect(() => {
    const flame = flameRef.current;
    const target = targetRef.current.getBoundingClientRect();
    const startX = window.innerWidth / 2;
    const startY = -60;
    const position = (x, y) => `translate(${x - FLAME_WIDTH / 2}px,${y - FLAME_HEIGHT}px)`;
    const animation = flame.animate(
      [
        { transform: `${position(startX, startY)} scale(.6)` },
        {
          transform: `${position(
            startX + (target.left - startX) * 0.5 + 90,
            startY + (target.top - startY) * 0.45,
          )} scale(1.15)`,
          offset: 0.5,
        },
        { transform: `${position(target.left, target.top)} scale(1)` },
      ],
      { duration: FLIGHT_MS, easing: 'cubic-bezier(.45,0,.25,1)', fill: 'forwards' },
    );
    const sparks = setInterval(() => {
      const box = flame.getBoundingClientRect();
      fireworks.spark(box.left + box.width / 2, box.top + box.height * 0.8);
    }, SPARK_INTERVAL_MS);
    animation.onfinish = onArrive;
    return () => {
      clearInterval(sparks);
      animation.cancel();
    };
  }, [targetRef, onArrive]);

  return (
    <div ref={flameRef} className="flying-flame" aria-hidden="true">
      <div className="flame-core" />
    </div>
  );
}
