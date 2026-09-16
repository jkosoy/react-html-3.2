import type { Rule } from 'eslint';
import type { JSXOpeningElement } from 'estree-jsx';
import { isHtml32Element, isVendorElement, REPLACEMENTS } from '../../spec';
import { isHtml32File, options, optionsSchema } from '../html32File';
import { isIntrinsic, tagName } from '../jsx';

const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: { description: 'disallow elements that are not in HTML 3.2', recommended: true },
    schema: [optionsSchema],
    messages: {
      unknown: '<{{name}}> is not an HTML 3.2 element.',
      unknownHint: '<{{name}}> is not an HTML 3.2 element. Try <{{replacement}}>.',
      vendor: '<{{name}}> is a Netscape/IE extension, not HTML 3.2.',
    },
  },
  create(context) {
    if (!isHtml32File(context)) return {};
    const { strict = false } = options(context);

    return {
      JSXOpeningElement(node: JSXOpeningElement) {
        const name = tagName(node);
        if (!name || !isIntrinsic(name)) return;
        if (isHtml32Element(name, { strict })) return;

        if (isVendorElement(name)) {
          context.report({ node: node.name as never, messageId: 'vendor', data: { name } });
          return;
        }
        const replacement = REPLACEMENTS[name];
        context.report({
          node: node.name as never,
          messageId: replacement ? 'unknownHint' : 'unknown',
          data: { name, replacement: replacement ?? '' },
        });
      },
    } as Rule.RuleListener;
  },
};

export default rule;
