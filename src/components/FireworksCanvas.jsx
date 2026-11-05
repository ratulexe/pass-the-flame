import { useEffect, useRef } from 'react';
import { fireworks } from '../lib/fireworks';

export default function FireworksCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const detach = fireworks.attach(canvas);
    const observer = new ResizeObserver(() => fireworks.resize());
    observer.observe(canvas);
    return () => {
      observer.disconnect();
      detach();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed top-0 left-0 z-[6] h-screen w-full"
      aria-hidden="true"
    />
  );
}
