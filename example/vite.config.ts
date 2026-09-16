import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const src = (p: string) => fileURLToPath(new URL(p, import.meta.url));

export default defineConfig({
  // jsxImportSource routes lowercase <blink>, <marquee>, <font>… through the
  // package's runtime, which swaps them for the real components.
  plugins: [react({ jsxImportSource: 'react-html-3.2' })],
  resolve: {
    alias: {
      'react-html-3.2/jsx-dev-runtime': src('../src/jsx-dev-runtime.ts'),
      'react-html-3.2/jsx-runtime': src('../src/jsx-runtime.ts'),
      'react-html-3.2': src('../src/index.ts'),
    },
  },
  // Two pages: index.html is the landing page, demo.html is the GeoCities demo.
  build: {
    rollupOptions: {
      input: {
        index: src('./index.html'),
        demo: src('./demo.html'),
      },
    },
  },
});
