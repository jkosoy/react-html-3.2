import type { Rule } from 'eslint';
import type { ImportDeclaration } from 'estree';
import type { JSXOpeningElement } from 'estree-jsx';
import { isHtml32File, optionsSchema } from '../html32File';
import { literalValue, tagName } from '../jsx';

const STYLE_FILE = /\.(css|scss|sass|less|styl|pcss)$/;
const STYLE_PACKAGES = [
  'styled-components',
  '@emotion/',
  'styled-jsx',
  'stitches',
  '@stitches/',
  'vanilla-extract',
  '@vanilla-extract/',
  'linaria',
  '@linaria/',
  'tailwindcss',
  'goober',
  'aphrodite',
  'jss',
  'react-jss',
  'glamor',
  'radium',
  'clsx',
  'classnames',
  'panda',
  '@pandacss/',
];

function isStyleImport(source: string): boolean {
  if (STYLE_FILE.test(source)) return true;
  return STYLE_PACKAGES.some((p) => source === p || source.startsWith(p) || source.startsWith(`${p}/`));
}

const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: { description: 'disallow style sheets in any form', recommended: true },
    schema: [optionsSchema],
    messages: {
      styleElement: '<style> is reserved in HTML 3.2 and does nothing. Layout is tables; type is <font>.',
      stylesheetLink: '<link rel="stylesheet"> is not HTML 3.2. There are no style sheets.',
      styleImport: 'Importing "{{source}}" brings in CSS. HTML 3.2 has none.',
    },
  },
  create(context) {
    if (!isHtml32File(context)) return {};

    return {
      ImportDeclaration(node: ImportDeclaration) {
        const source = String(node.source.value);
        if (isStyleImport(source)) context.report({ node, messageId: 'styleImport', data: { source } });
      },
      JSXOpeningElement(node: JSXOpeningElement) {
        const name = tagName(node);
        if (name === 'style') {
          context.report({ node: node.name as never, messageId: 'styleElement' });
          return;
        }
        if (name !== 'link') return;
        for (const attr of node.attributes) {
          if (attr.type !== 'JSXAttribute' || attr.name.type !== 'JSXIdentifier' || attr.name.name !== 'rel') continue;
          const rel = literalValue(attr);
          if (rel && /\bstylesheet\b/i.test(rel)) context.report({ node: node.name as never, messageId: 'stylesheetLink' });
        }
      },
    } as Rule.RuleListener;
  },
};

export default rule;
