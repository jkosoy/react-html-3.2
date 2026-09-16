import type { Rule } from 'eslint';
import type { JSXOpeningElement } from 'estree-jsx';
import { isHtml32File, optionsSchema } from '../html32File';
import { tagName } from '../jsx';

const rule: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: { description: 'require width and height on <img>, so the page lays out before the picture arrives', recommended: true },
    schema: [optionsSchema],
    messages: {
      missing: '<img> needs width and height. Your visitor is on a 28.8k modem.',
    },
  },
  create(context) {
    if (!isHtml32File(context)) return {};

    return {
      JSXOpeningElement(node: JSXOpeningElement) {
        if (tagName(node) !== 'img') return;
        const names = new Set<string>();
        for (const attr of node.attributes) {
          if (attr.type === 'JSXSpreadAttribute') return;
          if (attr.name.type === 'JSXIdentifier') names.add(attr.name.name.toLowerCase());
        }
        if (!names.has('width') || !names.has('height')) {
          context.report({ node: node.name as never, messageId: 'missing' });
        }
      },
    } as Rule.RuleListener;
  },
};

export default rule;
