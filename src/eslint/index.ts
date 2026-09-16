import type { ESLint, Linter } from 'eslint';
import attributeValues from './rules/attribute-values';
import attributes from './rules/attributes';
import elements from './rules/elements';
import imgDimensions from './rules/img-dimensions';
import noCss from './rules/no-css';
import systemFonts from './rules/system-fonts';

export { findMarker, isHtml32File, MARKER } from './html32File';
export { toHtmlAttribute } from './jsx';

const plugin = {
  meta: { name: 'react-html-3.2', version: '0.1.0' },
  rules: {
    elements,
    attributes,
    'attribute-values': attributeValues,
    'no-css': noCss,
    'system-fonts': systemFonts,
    'img-dimensions': imgDimensions,
  },
  configs: {} as {
    recommended: Linter.Config;
    strict: Linter.Config;
    error: Linter.Config;
    all: Linter.Config;
  },
} satisfies ESLint.Plugin;

const names = Object.keys(plugin.rules).map((r) => `react-html-3.2/${r}`);

interface ConfigOptions {
  level?: Linter.RuleSeverity;
  opts?: Record<string, unknown>;
}

function config(name: string, { level = 'warn', opts }: ConfigOptions = {}): Linter.Config {
  return {
    name: `react-html-3.2/${name}`,
    files: ['**/*.{js,jsx,mjs,cjs,ts,tsx,mts,cts}'],
    plugins: { 'react-html-3.2': plugin },
    languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
    rules: Object.fromEntries(names.map((r) => [r, opts ? [level, opts] : level])) as Linter.RulesRecord,
  };
}

// recommended/strict warn on opt-in files (`const html32 = true`). error is the
// same, at error severity. all checks every file, no marker needed.
plugin.configs.recommended = config('recommended');
plugin.configs.strict = config('strict', { opts: { strict: true } });
plugin.configs.error = config('error', { level: 'error' });
plugin.configs.all = config('all', { level: 'error', opts: { always: true } });

export default plugin;
