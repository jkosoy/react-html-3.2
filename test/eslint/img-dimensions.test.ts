import rule from '../../src/eslint/rules/img-dimensions';
import { html32, tester } from './helpers';

tester.run('img-dimensions', rule, {
  valid: [
    { code: '<img src="x" />;' },
    { code: html32('<img src="x" width={10} height={10} />;') },
    { code: html32('<img src="x" width="10" height="10" alt="" />;') },
    { code: html32('<img {...props} />;') },
    { code: html32('<Image src="x" />;') },
  ],
  invalid: [
    { code: html32('<img src="x" />;'), errors: [{ messageId: 'missing' }] },
    { code: html32('<img src="x" width={10} />;'), errors: [{ messageId: 'missing' }] },
    { code: html32('<img src="x" height={10} />;'), errors: [{ messageId: 'missing' }] },
  ],
});
