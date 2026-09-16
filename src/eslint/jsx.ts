import type { JSXAttribute, JSXOpeningElement } from 'estree-jsx';

const REACT_ONLY = new Set(['key', 'ref', 'children', 'dangerouslySetInnerHTML', 'suppressHydrationWarning']);

const RENAMED: Record<string, string> = {
  className: 'class',
  htmlFor: 'for',
  httpEquiv: 'http-equiv',
  defaultValue: 'value',
  defaultChecked: 'checked',
  defaultSelected: 'selected',
};

export function isReactOnlyProp(name: string): boolean {
  return REACT_ONLY.has(name);
}

// React spells attributes in camelCase (cellPadding, colSpan); 3.2 doesn't.
export function toHtmlAttribute(prop: string): string {
  return RENAMED[prop] ?? prop.toLowerCase();
}

export function tagName(node: JSXOpeningElement): string | undefined {
  return node.name.type === 'JSXIdentifier' ? node.name.name : undefined;
}

export function isIntrinsic(name: string): boolean {
  return name[0] === name[0].toLowerCase();
}

// Returns the attribute's value when it's a literal we can inspect:
// name="x", name={"x"}, name={3}, name={`x`}, or a bare flag (null).
export function literalValue(attr: JSXAttribute): string | null | undefined {
  const v = attr.value;
  if (v == null) return null;
  if (v.type === 'Literal') return String(v.value);
  if (v.type === 'JSXExpressionContainer') {
    const e = v.expression;
    if (e.type === 'Literal' && (typeof e.value === 'string' || typeof e.value === 'number')) return String(e.value);
    if (e.type === 'TemplateLiteral' && e.expressions.length === 0) return e.quasis[0].value.cooked ?? undefined;
  }
  return undefined;
}
