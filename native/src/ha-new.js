import { add } from './lib/firebase.js';

window.customElements.define(
  'ha-new',
  class extends HTMLElement {
    constructor() {
      super();
      this.shortcut = this.shortcut.bind(this);
    }

    /**
     * @param {KeyboardEvent} e
     */
    onKeyDown(e) {
      if (e.key === 'Enter' && e.ctrlKey) {
        /** @type {HTMLElement} */
        const titleEl = (this.querySelector('ha-title'));
        add({ title: titleEl.innerText, completed: '', soft: '' });
        if (!e.shiftKey) this.closest('ha-overlay').removeAttribute('open');
        titleEl.innerText = '';
      }
    }

    /**
     * @param {KeyboardEvent} e
     */
    shortcut(e) {
      if (e.altKey && e.key === 'n') {
        this.closest('ha-overlay').setAttribute('open', '');
      }
    }

    connectedCallback() {
      this.addEventListener('keydown', this.onKeyDown.bind(this));
      window.addEventListener('keydown', this.shortcut);
    }

    disconnectedCallback() {
      document.removeEventListener('keydown', this.shortcut);
    }
  },
);
