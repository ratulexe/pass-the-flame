import { useCallback, useRef, useState } from 'react';
import { generateWish } from '../lib/gemini';
import { saveGreeting } from '../lib/greetings';

const SLOW_SAVE_MS = 8000;
const IDLE = { status: 'idle', draft: null, greeting: null };

/** Writes the wish, then saves, all in the background so the celebration never waits. */
export function useGreetingCreation() {
  const [creation, setCreation] = useState(IDLE);
  const latest = useRef(0);

  const save = useCallback((draft, attempt) => {
    const update = (next) => {
      if (attempt === latest.current) setCreation(next);
    };
    update({ status: 'saving', draft, greeting: null });
    const slow = setTimeout(() => update({ status: 'slow', draft, greeting: null }), SLOW_SAVE_MS);
    saveGreeting(draft)
      .then((greeting) => update({ status: 'saved', draft, greeting }))
      .catch(() => update({ status: 'failed', draft, greeting: null }))
      .finally(() => clearTimeout(slow));
  }, []);

  const start = useCallback(
    async (draft) => {
      const attempt = ++latest.current;
      setCreation({ status: 'writing', draft, greeting: null });
      const message = await generateWish(draft);
      // The sender may have started over while the wish was being written.
      if (attempt === latest.current) save({ ...draft, message }, attempt);
    },
    [save],
  );

  const reset = useCallback(() => {
    latest.current++;
    setCreation(IDLE);
  }, []);

  const retry = () => save(creation.draft, ++latest.current);

  return { ...creation, start, retry, reset };
}
