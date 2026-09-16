import type { Rule } from 'eslint';
import type { JSXOpeningElement } from 'estree-jsx';
import { attributesFor, describeValueType, isValidValue } from '../../spec';
import { isHtml32File, options, optionsSchema } from '../html32File';
import { literalValue, tagName, toHtmlAttribute } from '../jsx';

const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: { description: 'check literal attribute values against what HTML 3.2 allows', recommended: true },
    schema: [optionsSchema],
    messages: {
      invalid: '"{{value}}" is not a valid {{attribute}} on <{{element}}>. Expected {{expected}}.',
      flagValue: '{{attribute}} on <{{element}}> takes no value. Write {{attribute}}="" instead.',
    },
  },
  create(context) {
    if (!isHtml32File(context)) return {};
    const { strict = false } = options(context);

    return {
      JSXOpeningElement(node: JSXOpeningElement) {
        const element = tagName(node);
        if (!element) return;
        const allowed = attributesFor(element, { strict });
        if (!allowed) return;

        for (const attr of node.attributes) {
          if (attr.type !== 'JSXAttribute' || attr.name.type !== 'JSXIdentifier') continue;
          const attribute = toHtmlAttribute(attr.name.name);
          const type = allowed[attribute];
          if (!type || type === 'text') continue;

          const value = literalValue(attr);
          if (value === undefined) continue;

          if (type === 'flag') {
            if (value !== null && value !== '' && value.toLowerCase() !== attribute) {
              context.report({ node: attr as never, messageId: 'flagValue', data: { attribute, element } });
            }
            continue;
          }
          if (value === null || !isValidValue(type, value)) {
            context.report({
              node: attr as never,
              messageId: 'invalid',
              data: { value: value ?? '', attribute, element, expected: describeValueType(type) },
            });
          }
        }
      },
    } as Rule.RuleListener;
  },
};

export default rule;
