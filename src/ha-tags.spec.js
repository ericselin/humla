import HaTags from './ha-tags.js';

window.customElements.define(HaTags.elementName, HaTags);

describe('ha-tags', () => {
  /** @type {import('./lib/firebase').Todo[]} */
  const todoArr = [
    // @ts-ignore
    {
      tags: ['#tag', '#atag'],
      context: '@ctx',
    },
    // @ts-ignore
    {
      tags: ['#tag'],
      context: '@context',
    },
    // @ts-ignore
    {
      tags: ['#atag'],
      context: '@context',
    },
    // @ts-ignore
    {
      title: 'no context or tag',
    },
  ];

  let listening = false;
  /** @type {import('./lib/firebase').todos} */
  // @ts-ignore
  const todos = () => ({
    uncompleted() {
      return this;
    },
    listen(cb) {
      listening = true;
      cb(todoArr);
      return () => {
        listening = false;
      };
    },
  });

  let authenticated = false;
  const init = async () => {
    authenticated = true;
  };

  it('connects and disconnects', async () => {
    const t = new HaTags(todos, init);
    await t.connectedCallback();
    expect(authenticated).toBe(true);
    expect(listening).toBe(true);
    t.disconnectedCallback();
    expect(listening).toBe(false);
  });

  it('builds correctly connect', async () => {
    const t = new HaTags(todos, init);
    await t.connectedCallback();
    const ctx = t.children.item(0);
    const tag = t.children.item(1);
    expect(ctx.nodeName).toBe('DIV');
    expect(tag.nodeName).toBe('DIV');
    expect(t.children.length).toBe(2);
    expect(ctx.children.length).toBe(2);
    expect(ctx.children.item(0).getAttribute('path')).toBe('/all/@context');
    expect(ctx.children.item(0).innerHTML).toBe('@context');
    expect(ctx.children.item(1).getAttribute('path')).toBe('/all/@ctx');
    expect(ctx.children.item(1).innerHTML).toBe('@ctx');
    expect(tag.children.length).toBe(2);
    expect(tag.children.item(0).getAttribute('path')).toBe('/all/#atag');
    expect(tag.children.item(0).innerHTML).toBe('#atag');
    expect(tag.children.item(1).getAttribute('path')).toBe('/all/#tag');
    expect(tag.children.item(1).innerHTML).toBe('#tag');
  });
});
