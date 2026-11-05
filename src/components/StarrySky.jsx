import { useEffect, useRef } from 'react';
import { drawStars } from '../lib/backdrop';

export default function StarrySky() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const observer = new ResizeObserver(() => drawStars(canvas));
    observer.observe(canvas);
    return () => observer.disconnect();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed top-0 left-0 z-0 h-screen w-full"
      aria-hidden="true"
    />
  );
}
