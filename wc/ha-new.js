import { add } from './lib/firebase.js';

window.customElements.define(
  'ha-new',
  class extends HTMLElement {
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

    connectedCallback() {
      this.addEventListener('keydown', this.onKeyDown.bind(this));
    }
  },
);
