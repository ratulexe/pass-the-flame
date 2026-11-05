import { useCallback, useRef, useState } from 'react';
import { saveGreeting } from '../lib/greetings';

const SLOW_SAVE_MS = 8000;
const IDLE = { status: 'idle', draft: null, greeting: null };

/** Saves in the background so the celebration never waits on the network. */
export function useGreetingSave() {
  const [save, setSave] = useState(IDLE);
  const latest = useRef(0);

  const start = useCallback((draft) => {
    const attempt = ++latest.current;
    const update = (next) => {
      if (attempt === latest.current) setSave(next);
    };
    update({ status: 'saving', draft, greeting: null });
    const slow = setTimeout(() => update({ status: 'slow', draft, greeting: null }), SLOW_SAVE_MS);
    saveGreeting(draft)
      .then((greeting) => update({ status: 'saved', draft, greeting }))
      .catch(() => update({ status: 'failed', draft, greeting: null }))
      .finally(() => clearTimeout(slow));
  }, []);

  const reset = useCallback(() => {
    latest.current++;
    setSave(IDLE);
  }, []);

  const retry = () => start(save.draft);

  return { ...save, start, retry, reset };
}
