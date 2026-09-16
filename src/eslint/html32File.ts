import type { Rule } from 'eslint';
import type { Node, Program, VariableDeclaration } from 'estree';

export interface Options {
  always?: boolean;
  strict?: boolean;
  fonts?: string[];
}

export const MARKER = 'html32';

function isMarker(decl: VariableDeclaration): boolean {
  if (decl.kind !== 'const') return false;
  return decl.declarations.some(
    (d) => d.id.type === 'Identifier' && d.id.name === MARKER && d.init?.type === 'Literal' && d.init.value === true,
  );
}

// A file opts in with `const html32 = true` at the top level. `export const`
// counts too.
export function findMarker(program: Program): Node | undefined {
  for (const node of program.body) {
    if (node.type === 'VariableDeclaration' && isMarker(node)) return node;
    if (node.type === 'ExportNamedDeclaration' && node.declaration?.type === 'VariableDeclaration' && isMarker(node.declaration)) {
      return node.declaration;
    }
  }
  return undefined;
}

export function isHtml32File(context: Rule.RuleContext): boolean {
  const options = (context.options[0] ?? {}) as Options;
  if (options.always) return true;
  const program = context.sourceCode.ast;
  if (!findMarker(program)) return false;
  context.sourceCode.markVariableAsUsed(MARKER, program);
  return true;
}

export function options(context: Rule.RuleContext): Options {
  return (context.options[0] ?? {}) as Options;
}

export const optionsSchema = {
  type: 'object',
  properties: {
    always: { type: 'boolean' },
    strict: { type: 'boolean' },
    fonts: { type: 'array', items: { type: 'string' } },
  },
  additionalProperties: false,
} as const;
