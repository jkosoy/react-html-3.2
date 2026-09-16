import tseslint from 'typescript-eslint';
import html32 from './dist/eslint/index.js';

export default [
  { ignores: ['dist/**', 'node_modules/**'] },
  ...tseslint.configs.recommended,
  // Hold the example app to HTML 3.2 on every file, and fail rather than warn:
  // a stray <div className> or a 4.0 element is an error, no opt-in marker needed.
  { ...html32.configs.all, files: ['example/**/*.{js,jsx,ts,tsx}'] },
];
