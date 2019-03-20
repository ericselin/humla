import test from 'ava';

const mockdate = require('mockdate');
const { getDate, today, sunday } = require('./date');

test.afterEach(() => {
  mockdate.reset();
});

test('exports correct today', (t) => {
  mockdate.set('2019-03-20');
  t.is(today(), '2019-03-20');
});
