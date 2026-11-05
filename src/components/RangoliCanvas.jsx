import { useEffect, useRef } from 'react';
import { bloomRangoli } from '../lib/rangoli';

/** Blooms the rangoli for `name`. Change `bloomKey` to replay the bloom on the same name. */
export default function RangoliCanvas({ name, duration = 0, dim = false, bloomKey = 0 }) {
  const canvasRef = useRef(null);

  useEffect(
    () => bloomRangoli(canvasRef.current, name, { duration, dim }),
    [name, duration, dim, bloomKey],
  );

  // Redraw when the stage changes size, or appears after being hidden.
  useEffect(() => {
    const canvas = canvasRef.current;
    let width = canvas.clientWidth;
    const observer = new ResizeObserver(() => {
      if (canvas.clientWidth === width) return;
      width = canvas.clientWidth;
      bloomRangoli(canvas, name, { dim });
    });
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [name, dim]);

  return <canvas ref={canvasRef} className="rangoli" aria-hidden="true" />;
}
