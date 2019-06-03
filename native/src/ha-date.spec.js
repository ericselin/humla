import Date from './ha-date.js';
import { set, reset } from './lib/mockdate.js';

describe('ha-date', () => {
  it('parses shorthands set on input blur', () => {
    const t = new Date();
    set('2019-06-03');
    const input = t.querySelector('input');
    input.value = 't';
    input.dispatchEvent(new Event('blur'));
    expect(t.value).toBe('2019-06-03');
    expect(input.value).toBe('2019-06-03');
    reset();
  });

  const tmpl = document.createElement('template');
  tmpl.innerHTML = '<ha-date></ha-date>';

  it('IDL attribute reflects initial content attribute', () => {
    const doc = /** @type {DocumentFragment} */ (tmpl.content.cloneNode(true));
    const el = /** @type {HTMLElement} */ (doc.querySelector('ha-date'));
    el.setAttribute('value', '2019-06-03');
    document.body.appendChild(el);
    expect(/** @type {Date} */ (el).value).toBe('2019-06-03');
    document.body.removeChild(el);
  });
});
