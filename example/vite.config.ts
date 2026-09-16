import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const src = (p: string) => fileURLToPath(new URL(p, import.meta.url));

export default defineConfig({
  // Relative asset paths, so the built site works under any subpath — including
  // a GitHub project page at https://<user>.github.io/react-html-3.2/.
  base: './',
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
});
