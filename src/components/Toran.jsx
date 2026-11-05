import { useEffect, useRef } from 'react';
import { drawToran, TORAN_HEIGHT } from '../lib/backdrop';

export default function Toran() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const observer = new ResizeObserver(() => drawToran(canvas));
    observer.observe(canvas);
    return () => observer.disconnect();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute top-0 left-0 z-[3] w-full"
      style={{ height: TORAN_HEIGHT }}
      aria-hidden="true"
    />
  );
}
