import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // The full Firestore SDK is over the default 500 kB, and only /sky loads it.
  build: { chunkSizeWarningLimit: 600 },
});
