export default class HaContext extends HTMLElement {
  get closed() {
    return this.hasAttribute('closed');
  }

  set closed(val) {
    if (val) this.setAttribute('closed', '');
    else this.removeAttribute('closed');
  }

  connectedCallback() {
    const btn = this.querySelector('button');
    if (btn) {
      btn.addEventListener('click', () => {
        this.closed = !this.closed;
      });
    }
  }
}
HaContext.elementName = 'ha-context';
