import rule from '../../src/eslint/rules/no-css';
import { html32, tester } from './helpers';

tester.run('no-css', rule, {
  valid: [
    { code: "import './app.css';\n<style />;" },
    { code: html32("import React from 'react';") },
    { code: html32("import { Font } from 'react-html-3.2';") },
    { code: html32('<link rel="icon" href="favicon.ico" />;') },
    { code: html32('<link rel={rel} />;') },
    { code: html32("import data from './styles.json';") },
  ],
  invalid: [
    { code: html32("import './app.css';"), errors: [{ messageId: 'styleImport', data: { source: './app.css' } }] },
    { code: html32("import styles from './x.module.scss';"), errors: [{ messageId: 'styleImport' }] },
    { code: html32("import styled from 'styled-components';"), errors: [{ messageId: 'styleImport' }] },
    { code: html32("import { css } from '@emotion/react';"), errors: [{ messageId: 'styleImport' }] },
    { code: html32("import clsx from 'clsx';"), errors: [{ messageId: 'styleImport' }] },
    { code: html32('<style>{"b { color: red }"}</style>;'), errors: [{ messageId: 'styleElement' }] },
    { code: html32('<link rel="stylesheet" href="a.css" />;'), errors: [{ messageId: 'stylesheetLink' }] },
    { code: html32('<link rel="preload stylesheet" href="a.css" />;'), errors: [{ messageId: 'stylesheetLink' }] },
  ],
});
