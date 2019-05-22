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
});
