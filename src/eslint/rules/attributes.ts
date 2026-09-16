import type { Rule } from 'eslint';
import type { JSXOpeningElement } from 'estree-jsx';
import { attributesFor, isVendorAttribute } from '../../spec';
import { isHtml32File, options, optionsSchema } from '../html32File';
import { isReactOnlyProp, tagName, toHtmlAttribute } from '../jsx';

const CSS_HOOKS = new Set(['style', 'class', 'id']);

const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: { description: 'disallow attributes HTML 3.2 does not define for an element', recommended: true },
    schema: [optionsSchema],
    messages: {
      unknown: '{{attribute}} is not an HTML 3.2 attribute on <{{element}}>.',
      css: '{{attribute}} is not an HTML 3.2 attribute. There is no CSS; use tables and <font>.',
      event: '{{attribute}} is not an HTML 3.2 attribute. There are no event handlers; use a link, a form, or an image map.',
      vendor: '{{attribute}} on <{{element}}> is a Netscape/IE extension, not HTML 3.2.',
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
          const prop = attr.name.name;
          if (isReactOnlyProp(prop)) continue;
          const attribute = toHtmlAttribute(prop);
          if (attribute in allowed) continue;

          let messageId = 'unknown';
          if (CSS_HOOKS.has(attribute)) messageId = 'css';
          else if (/^on[a-z]/.test(attribute)) messageId = 'event';
          else if (isVendorAttribute(element, attribute)) messageId = 'vendor';
          context.report({ node: attr.name as never, messageId, data: { attribute, element } });
        }
      },
    } as Rule.RuleListener;
  },
};

export default rule;
