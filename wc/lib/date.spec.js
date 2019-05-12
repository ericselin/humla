/* eslint-disable no-undef */
import { today } from './date.js';

describe('date testing', () => {
  it('returns today', () => {
    expect(today()).toBe('2019-05-12');
  });
});
