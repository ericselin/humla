/* eslint-disable no-extend-native */
// @ts-nocheck
/* eslint-disable no-global-assign */
/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
const _Date = Date;

const _getTimezoneOffset = Date.prototype.getTimezoneOffset;

let now = null;
function MockDate(y, m, d, h, M, s, ms) {
  let date;

  switch (arguments.length) {
    case 0:
      if (now !== null) {
        date = new _Date(now);
      } else {
        date = new _Date();
      }
      break;

    case 1:
      date = new _Date(y);
      break;

    default:
      d = typeof d === 'undefined' ? 1 : d;
      h = h || 0;
      M = M || 0;
      s = s || 0;
      ms = ms || 0;
      date = new _Date(y, m, d, h, M, s, ms);
      break;
  }

  return date;
}

MockDate.UTC = _Date.UTC;

MockDate.now = function () {
  return new MockDate().valueOf();
};

MockDate.parse = function (dateString) {
  return _Date.parse(dateString);
};

MockDate.toString = function () {
  return _Date.toString();
};

MockDate.prototype = _Date.prototype;

export function set(date, timezoneOffset) {
  const dateObj = new Date(date);
  // eslint-disable-next-line no-restricted-globals
  if (isNaN(dateObj.getTime())) {
    throw new TypeError(`mockdate: The time set is an invalid date: ${date}`);
  }

  if (typeof timezoneOffset === 'number') {
    MockDate.prototype.getTimezoneOffset = function () {
      return timezoneOffset;
    };
  }

  Date = MockDate;
  if (date.valueOf) {
    date = date.valueOf();
  }

  now = dateObj.valueOf();
}

export function reset() {
  Date = _Date;
  Date.prototype.getTimezoneOffset = _getTimezoneOffset;
}
