import test from 'ava';

const mockdate = require('mockdate');
const {
  getDate, today, sunday, thisMonday,
} = require('./date');

test.afterEach(() => {
  mockdate.reset();
});

test('returns correct today', (t) => {
  mockdate.set('2019-03-20');
  t.is(today(), '2019-03-20');
});

test('returns correct this monday', (t) => {
  mockdate.set('2019-03-29');
  t.is(thisMonday(), '2019-03-25');
  mockdate.set('2019-03-18');
  t.is(thisMonday(), '2019-03-18');
});

const sundayMacro = (t, input, expected) => {
  mockdate.set(input);
  t.is(sunday(), expected);
};

test('sunday correct today', sundayMacro, '2019-03-20', '2019-03-24');
test('sunday today on sunday', sundayMacro, '2019-03-24', '2019-03-24');
test('sunday correct on monday', sundayMacro, '2019-03-25', '2019-03-31');
test('sunday correct across month', sundayMacro, '2019-02-28', '2019-03-03');

const date = (t, input, expected) => {
  mockdate.set('2019-03-20');
  t.is(getDate(input), expected);
};
date.title = (providedTitle = '', input, expected) => `${providedTitle} ${input} = ${expected}`.trim();

test(date, 't', '2019-03-20');
test(date, 'today', '2019-03-20');
test(date, 'tm', '2019-03-21');
test(date, 'tomorrow', '2019-03-21');
test(date, 'tw', '2019-03-24');
test(date, 'nw', '2019-03-31');
test(date, 'l', 'later');
test(date, 's', 'someday');
test(date, '1.5', '2019-05-01');

test(date, 'something', 'something');
