import test from 'ava';

const mockdate = require('mockdate');
const { getDate, today, sunday } = require('./date');

test.afterEach(() => {
  mockdate.reset();
});

test('returns correct today', (t) => {
  mockdate.set('2019-03-20');
  t.is(today(), '2019-03-20');
});

test('returns correct sunday today', (t) => {
  mockdate.set('2019-03-20');
  t.is(sunday(), '2019-03-24');
});
