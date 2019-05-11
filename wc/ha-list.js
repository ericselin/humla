import { waitForAuth, Todos } from './lib/firebase.js';

window.customElements.define(
  'ha-list',
  class extends HTMLElement {
    async connectedCallback() {
      await waitForAuth();
      const todos = await new Todos().uncompleted().get();

      /** @type {HTMLTemplateElement} */
      const template = this.ownerDocument.querySelector('template#ha-todo');
      this.innerHTML = '';

      todos.forEach((todo) => {
        const el = /** @type {DocumentFragment} */ (template.content.cloneNode(true));
        el.querySelector('ha-title').innerHTML = todo.title;
        this.appendChild(el);
      });

      if (todos.length === 0) console.log('No todos found.');
    }
  },
);
