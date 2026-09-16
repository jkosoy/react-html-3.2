import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'eslint/index': 'src/eslint/index.ts',
    'jsx-runtime': 'src/jsx-runtime.ts',
    'jsx-dev-runtime': 'src/jsx-dev-runtime.ts',
  },
  format: ['esm', 'cjs'],
  clean: true,
  external: ['react', 'react/jsx-runtime', 'react/jsx-dev-runtime', 'eslint'],
});
