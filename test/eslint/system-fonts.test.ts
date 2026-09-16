import rule from '../../src/eslint/rules/system-fonts';
import { html32, tester } from './helpers';

tester.run('system-fonts', rule, {
  valid: [
    { code: '<font face="Inter" />;' },
    { code: html32('<font face="Arial" />;') },
    { code: html32('<font face="Comic Sans MS, Chicago, Geneva" />;') },
    { code: html32('<basefont face="verdana" />;') },
    { code: html32('<Font face="Times New Roman" />;') },
    { code: html32('<Basefont face="Courier New" />;') },
    { code: html32('<font face={family} />;') },
    { code: html32('<font face="Inter" />;'), options: [{ fonts: ['Inter'] }] },
    { code: html32('<div face="Inter" />;') },
  ],
  invalid: [
    {
      code: html32('<font face="Inter" />;'),
      errors: [{ messageId: 'unknownFont', data: { face: 'Inter' } }],
    },
    {
      code: html32('<font face="Arial, Helvetica, sans-serif" />;'),
      errors: [{ messageId: 'unknownFont', data: { face: 'sans-serif' } }],
    },
    {
      code: html32('<Font face="Roboto, Segoe UI" />;'),
      errors: [{ messageId: 'unknownFont' }, { messageId: 'unknownFont' }],
    },
    {
      code: html32('<Basefont face="Calibri" />;'),
      errors: [{ messageId: 'unknownFont' }],
    },
  ],
});
