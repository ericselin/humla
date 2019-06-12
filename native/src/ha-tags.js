import { todos } from './lib/firebase.js';

export default class HaTags extends HTMLElement {
  /** @param {typeof todos} t */
  constructor(t) {
    super();
    this.todos = t || todos;
  }

  connectedCallback() {
    this.todos().uncompleted(); // ?
  }
}

window.customElements.define('ha-tags', HaTags);
