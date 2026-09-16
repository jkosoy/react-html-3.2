import type { Rule } from 'eslint';
import type { JSXOpeningElement } from 'estree-jsx';
import { isSystemFont, splitFaces } from '../../fonts';
import { isHtml32File, options, optionsSchema } from '../html32File';
import { literalValue, tagName } from '../jsx';

const FONT_TAGS = new Set(['font', 'basefont', 'Font', 'Basefont']);

const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: { description: 'only allow font faces that were installed on a 1997 desktop', recommended: true },
    schema: [optionsSchema],
    messages: {
      unknownFont: '"{{face}}" was not on anybody\'s computer in 1997. Try Arial, Verdana, or Comic Sans MS.',
    },
  },
  create(context) {
    if (!isHtml32File(context)) return {};
    const { fonts = [] } = options(context);

    return {
      JSXOpeningElement(node: JSXOpeningElement) {
        const name = tagName(node);
        if (!name || !FONT_TAGS.has(name)) return;
        for (const attr of node.attributes) {
          if (attr.type !== 'JSXAttribute' || attr.name.type !== 'JSXIdentifier' || attr.name.name !== 'face') continue;
          const value = literalValue(attr);
          if (!value) continue;
          for (const face of splitFaces(value)) {
            if (!isSystemFont(face, fonts)) {
              context.report({ node: attr as never, messageId: 'unknownFont', data: { face } });
            }
          }
        }
      },
    } as Rule.RuleListener;
  },
};

export default rule;
