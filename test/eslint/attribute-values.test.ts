import rule from '../../src/eslint/rules/attribute-values';
import { html32, tester } from './helpers';

tester.run('attribute-values', rule, {
  valid: [
    { code: '<p align="justify" />;' },
    { code: html32('<p align="center" />;') },
    { code: html32('<p align="CENTER" />;') },
    { code: html32('<ol type="I" start={4} />;') },
    { code: html32('<ul type="square" compact="" />;') },
    { code: html32('<body bgcolor="#000080" text="white" />;') },
    { code: html32('<font size="+2" color="fuchsia" />;') },
    { code: html32('<table width="80%" border={0} />;') },
    { code: html32('<img src="x" width={`40`} height={40} />;') },
    { code: html32('<td nowrap />;') },
    { code: html32('<td nowrap="nowrap" />;') },
    { code: html32('<input type="image" src="x" />;') },
    { code: html32('<caption align="bottom" />;') },
    { code: html32('<p align={dynamic} />;') },
    { code: html32('<marquee behavior="slide" loop={3} />;') },
  ],
  invalid: [
    {
      code: html32('<p align="justify" />;'),
      errors: [{ messageId: 'invalid', data: { value: 'justify', attribute: 'align', element: 'p', expected: 'left | center | right' } }],
    },
    {
      code: html32('<ol type="b" />;'),
      errors: [{ messageId: 'invalid' }],
    },
    {
      code: html32('<body bgcolor="orange" text="#fff" />;'),
      errors: [{ messageId: 'invalid' }, { messageId: 'invalid' }],
    },
    {
      code: html32('<font size="8" />;'),
      errors: [{ messageId: 'invalid', data: { value: '8', attribute: 'size', element: 'font', expected: '1 to 7, or +n / -n' } }],
    },
    {
      code: html32('<table width="80em" cellPadding="4px" />;'),
      errors: [{ messageId: 'invalid' }, { messageId: 'invalid' }],
    },
    {
      code: html32('<input type="email" />;'),
      errors: [{ messageId: 'invalid' }],
    },
    {
      code: html32('<hr noshade="yes" />;'),
      errors: [{ messageId: 'flagValue', data: { attribute: 'noshade', element: 'hr' } }],
    },
    {
      code: html32('<img src="x" width="auto" />;'),
      errors: [{ messageId: 'invalid' }],
    },
    {
      code: html32('<area shape="default" />;'),
      errors: [{ messageId: 'invalid' }],
    },
  ],
});
