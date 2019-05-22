import { doc } from './lib/firebase.js';

window.customElements.define(
  'ha-todo',
  class extends HTMLElement {
    static get observedAttributes() {
      return ['open'];
    }

    get open() {
      return this.hasAttribute('open');
    }

    set open(val) {
      if (val) this.setAttribute('open', '');
      else this.removeAttribute('open');
    }

    attributeChangedCallback(name) {
      if (name === 'open') {
        /** @type {import('./ha-title').default} */
        const title = this.querySelector('ha-title');
        // set title open state
        title.open = this.open;
        // save if now not open
        if (!this.open) {
          // @ts-ignore
          doc(this.id).update({ title: title.innerText });
        }
      }
    }
  },
);
