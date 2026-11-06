import { useEffect, useRef } from 'react';
import { sound } from '../lib/audio';
import { createDeepmala } from '../lib/deepmala';
import { showToast } from '../lib/toast';

export default function DeepmalaCanvas({ diyas }) {
  const canvasRef = useRef(null);
  const deepmalaRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const deepmala = createDeepmala(canvas);
    deepmalaRef.current = deepmala;
    deepmala.start();
    const observer = new ResizeObserver(() => deepmala.resize());
    observer.observe(canvas);
    const onPointerDown = (event) => {
      if (event.target.closest('a,button,input,.card')) return;
      sound.unlock();
      deepmala.tapAt(event.clientX, event.clientY);
    };
    window.addEventListener('pointerdown', onPointerDown);
    return () => {
      window.removeEventListener('pointerdown', onPointerDown);
      observer.disconnect();
      deepmala.stop();
    };
  }, []);

  // `diyas` is null until the first load, which must not count as new diyas being lit.
  useEffect(() => {
    if (diyas && deepmalaRef.current.setDiyas(diyas)) showToast('A new diya was just lit');
  }, [diyas]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed top-0 left-0 -z-10 h-screen w-full"
      aria-hidden="true"
    />
  );
}
