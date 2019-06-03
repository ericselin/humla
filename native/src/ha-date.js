import { getDate } from './lib/date.js';

export default class HaDate extends HTMLElement {
  constructor() {
    super();
    this.input = document.createElement('input');
    this.input.placeholder = 'No date...';
    this.input.addEventListener('blur', (e) => {
      this.value = /** @type {HTMLInputElement} */ (e.target).value;
    });
    this.input.addEventListener('focus', function focus() {
      this.select();
    });
    this.append(this.input);
  }

  static get observedAttributes() {
    return ['value'];
  }

  get value() {
    return this.getAttribute('value');
  }

  set value(val) {
    this.setAttribute('value', getDate(val));
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'value') {
      this.input.value = newValue;
    }
  }
}

window.customElements.define('ha-date', HaDate);
