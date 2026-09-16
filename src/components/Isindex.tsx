import { createElement } from 'react';

export interface IsindexProps {
  prompt?: string;
  action?: string;
}

// Rendered the way the HTML5 parser rewrites a legacy <isindex>.
export function Isindex({ prompt = 'This is a searchable index. Enter search keywords: ', action }: IsindexProps) {
  return createElement(
    'form',
    { action },
    createElement('hr'),
    createElement('label', null, prompt, createElement('input', { type: 'text', name: 'isindex' })),
    createElement('hr'),
  );
}
