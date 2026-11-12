import assert from 'node:assert/strict';
import { test } from 'node:test';
import { toCss } from '../public/js/utils/color.js';

test('toCss converts hex numbers to CSS colours', () => {
  assert.equal(toCss(0xff8a4c), '#ff8a4c');
  assert.equal(toCss(0x19e3ff), '#19e3ff');
});

test('toCss pads dark colours to six digits', () => {
  assert.equal(toCss(0x0000ff), '#0000ff');
  assert.equal(toCss(0), '#000000');
});
