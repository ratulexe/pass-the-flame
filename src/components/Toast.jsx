import { useSyncExternalStore } from 'react';
import { getToast, subscribeToast } from '../lib/toast';

export default function Toast() {
  const { message, visible } = useSyncExternalStore(subscribeToast, getToast);

  return (
    <div className={`toast ${visible ? 'toast-visible' : ''}`} role="status" aria-live="polite">
      {message}
    </div>
  );
}
