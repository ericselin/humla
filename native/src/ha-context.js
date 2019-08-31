window.customElements.define(
  'ha-context',
  class extends HTMLElement {
    get closed() {
      return this.hasAttribute('closed');
    }

    set closed(val) {
      if (val) this.setAttribute('closed', '');
      else this.removeAttribute('closed');
    }

    connectedCallback() {
      this.querySelector('button').addEventListener('click', () => {
        this.closed = !this.closed;
      });
    }
  },
);