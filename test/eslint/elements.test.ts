import rule from '../../src/eslint/rules/elements';
import { html32, tester } from './helpers';

tester.run('elements', rule, {
  valid: [
    { code: '<section><span /></section>;' },
    { code: 'const html32 = false;\n<section />;' },
    { code: 'let html32 = true;\n<section />;' },
    { code: 'function f() { const html32 = true; return <section />; }' },
    { code: html32('<table border="1"><tr><td>x</td></tr></table>;') },
    { code: html32('<font color="red"><blink>hi</blink></font>;') },
    { code: html32('<map name="n"><area shape="rect" coords="0,0,1,1" href="#" /></map>;') },
    { code: html32('<Section><Video /></Section>;') },
    { code: html32('<xmp>&lt;b&gt;</xmp>;') },
    { code: 'export const html32 = true;\n<center />;' },
  ],
  invalid: [
    {
      code: html32('<span />;'),
      errors: [{ messageId: 'unknownHint', data: { name: 'span', replacement: 'font' } }],
    },
    {
      code: html32('<div><iframe /><label /></div>;'),
      errors: [{ messageId: 'unknownHint' }, { messageId: 'unknownHint' }],
    },
    {
      code: html32('<ruby />;'),
      errors: [{ messageId: 'unknown', data: { name: 'ruby' } }],
    },
    {
      code: '<section />;',
      options: [{ always: true }],
      errors: [{ messageId: 'unknownHint' }],
    },
    {
      code: html32('<marquee><blink /></marquee>;'),
      options: [{ strict: true }],
      errors: [{ messageId: 'vendor', data: { name: 'marquee' } }, { messageId: 'vendor', data: { name: 'blink' } }],
    },
  ],
});
