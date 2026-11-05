const TOAST_MS = 3200;

let message = '';
let visible = false;
let timer = 0;
let snapshot = { message, visible };
const listeners = new Set();

function publish() {
  snapshot = { message, visible };
  listeners.forEach((listener) => listener());
}

export function showToast(text) {
  message = text;
  visible = true;
  publish();
  clearTimeout(timer);
  timer = setTimeout(() => {
    visible = false;
    publish();
  }, TOAST_MS);
}

export function subscribeToast(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export const getToast = () => snapshot;
