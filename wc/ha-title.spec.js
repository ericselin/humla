import Title from './ha-title.js';

describe('ha-title', () => {
  it('returns correctly with text nodes', () => {
    const t = new Title();
    t.innerHTML = 'line 1<div>line 2</div>';
    expect(t.innerText).toBe('line 1\nline 2');
  });

  it('returns correctly with line breaks', () => {
    const t = new Title();
    t.innerHTML = '<div>line 1</div>\n<div>line 2</div>';
    expect(t.innerText).toBe('line 1\nline 2');
  });

  it('returns correctly with line breaks', () => {
    const t = new Title();
    t.innerHTML = '<div>moi there</div>\n<div>there</div><div><br></div>\n<div>here</div>';
    expect(t.innerText).toBe('moi there\nthere\n\nhere');
  });

  it('builds correctly from innerText', () => {
    const t = new Title();
    t.innerText = 'moi\nline 2\n\nline 4';
    expect(t.innerHTML).toBe('<div>moi</div>\n<div>line 2</div>\n<div></div>\n<div>line 4</div>');
  });

  const tmpl = document.createElement('template');
  tmpl.innerHTML = '<ha-title></ha-title>';

  it('builds correctly from textContent on connect', () => {
    const doc = /** @type {DocumentFragment} */ (tmpl.content.cloneNode(true));
    const el = /** @type {HTMLElement} */ (doc.querySelector('ha-title'));
    el.innerText = 'moi\nline 2\n\nline 4';
    document.body.appendChild(el);
    expect(el.innerHTML).toBe('<div>moi</div>\n<div>line 2</div>\n<div></div>\n<div>line 4</div>');
    document.body.removeChild(el);
  });
});
