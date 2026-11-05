import { useCallback, useEffect, useRef, useState } from 'react';
import { fireworks } from '../lib/fireworks';
import { prefersReducedMotion, scrollBehavior } from '../lib/motion';
import { showToast } from '../lib/toast';

const SHOWTIME_CLASS = 'showtime';
const BURST_TYPES = ['peony', 'ring', 'willow'];
const NOT_SKY = 'button,a,input,select,label,.card,.stage,form';

/**
 * The shared finale: fireworks spell the name while the page dims, then the result scrolls in.
 * `tapForFireworks` turns off sky taps while another flow on the page owns them.
 */
export function useCelebration({ tapForFireworks = true } = {}) {
  const [celebrated, setCelebrated] = useState(false);
  const timers = useRef([]);

  useEffect(
    () => () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
      document.body.classList.remove(SHOWTIME_CLASS);
      fireworks.cancelScheduled();
    },
    [],
  );

  useEffect(() => {
    if (!celebrated || !tapForFireworks || prefersReducedMotion()) return undefined;
    const onPointerDown = (event) => {
      if (event.target.closest(NOT_SKY)) return;
      const type = BURST_TYPES[Math.floor(Math.random() * BURST_TYPES.length)];
      fireworks.rocket(event.clientX, Math.max(50, event.clientY), { type });
    };
    window.addEventListener('pointerdown', onPointerDown);
    return () => window.removeEventListener('pointerdown', onPointerDown);
  }, [celebrated, tapForFireworks]);

  const celebrate = useCallback((skyText, resultRef) => {
    const reduce = prefersReducedMotion();
    const after = (ms, callback) => timers.current.push(setTimeout(callback, ms));

    setCelebrated(true);
    document.body.classList.add(SHOWTIME_CLASS);
    after(reduce ? 2500 : 4200, () => document.body.classList.remove(SHOWTIME_CLASS));
    fireworks.nameShow(skyText);
    after(reduce ? 200 : 4300, () =>
      resultRef.current?.scrollIntoView({ behavior: scrollBehavior(), block: 'start' }),
    );
    after(6800, () => showToast('Tap the sky to launch more fireworks'));
  }, []);

  /** Scrolls so the diya sits in view with room above it for the name in the sky. */
  const frameStage = useCallback((element) => {
    const { top } = element.getBoundingClientRect();
    window.scrollBy({ top: top - window.innerHeight * 0.3, behavior: scrollBehavior() });
  }, []);

  return { celebrate, frameStage };
}
