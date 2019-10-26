import { add } from './lib/firebase.js';

export default class HaNew extends HTMLElement {
  constructor() {
    super();
    this.shortcut = this.shortcut.bind(this);
  }

  /**
   * @param {boolean} keepOpen Whether to keep the new box open after saving
   */
  save(keepOpen) {
    /** @type {HTMLElement} */
    const titleEl = (this.querySelector('ha-title'));
    if (titleEl.innerText) {
      add({ title: titleEl.innerText, completed: '', soft: '' });
      titleEl.innerText = '';
      titleEl.focus();
    }
    if (!keepOpen) this.closest('ha-overlay').removeAttribute('open');
  }

  /**
   * @param {KeyboardEvent} e
   */
  onKeyDown(e) {
    if (e.key === 'Enter' && e.ctrlKey) {
      this.save(e.shiftKey);
    }
  }

  /**
   * @param {MouseEvent} e
   */
  onClick(e) {
    this.save(/** @type {HTMLButtonElement} */ (e.currentTarget).hasAttribute('keep-open'));
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
    Array.from(this.querySelectorAll('button')).forEach((elem) => {
      elem.addEventListener('click', this.onClick.bind(this));
    });
    window.addEventListener('keydown', this.shortcut);
  }

  disconnectedCallback() {
    window.removeEventListener('keydown', this.shortcut);
  }
}
HaNew.elementName = 'ha-new';
