import HaTags from './ha-tags.js';

/** @type {import('./lib/firebase').Todo[]} */
const todoArr = [
  // @ts-ignore
  {
    tags: ['#tag'],
    context: '@ctx',
  },
];

let called = false;

/** @type {import('./lib/firebase').todos} */
// @ts-ignore
const todos = () => ({
  uncompleted() {
    called = true;
    return this;
  },
  listen(cb) {
    cb(todoArr);
    return () => undefined;
  },
});

describe('ha-title', () => {
  it('gets uncompleted todos', () => {
    const t = new HaTags(todos);
    t.connectedCallback();
    expect(called).toBe(true);
  });
});
