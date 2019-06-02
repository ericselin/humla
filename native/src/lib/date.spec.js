import {
  today, thisMonday, getDate, sunday,
} from './date.js';
import { set, reset } from './mockdate.js';

describe('date testing', () => {
  it('returns today', () => {
    set('2019-03-20');
    expect(today()).toBe('2019-03-20');
  });

  it('returns correct this monday', () => {
    set('2019-03-29');
    expect(thisMonday()).toBe('2019-03-25');
    set('2019-03-18');
    expect(thisMonday()).toBe('2019-03-18');
  });

  const sundayMacro = (input, expected) => () => {
    set(input);
    expect(sunday()).toBe(expected);
  };

  it('sunday correct today', sundayMacro('2019-03-20', '2019-03-24'));
  it('sunday today on sunday', sundayMacro('2019-03-24', '2019-03-24'));
  it('sunday correct on monday', sundayMacro('2019-03-25', '2019-03-31'));
  it('sunday correct across month', sundayMacro('2019-02-28', '2019-03-03'));

  const date = (input, expected) => () => {
    set('2019-03-20');
    expect(getDate(input)).toBe(expected);
  };

  it('parses t', date('t', '2019-03-20'));
  it('parses today', date('today', '2019-03-20'));
  it('parses tm', date('tm', '2019-03-21'));
  it('parses tomorrow', date('tomorrow', '2019-03-21'));
  it('parses tw', date('tw', '2019-03-24'));
  it('parses nw', date('nw', '2019-03-31'));
  it('parses l', date('l', 'later'));
  it('parses s', date('s', 'someday'));
  it('parses 1.5', date('1.5', '2019-05-01'));

  it('returns string if not parsable', date('something', 'something'));

  afterEach(() => {
    reset();
  });
});
