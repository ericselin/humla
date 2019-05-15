import { waitForAuth, Todos } from './lib/firebase.js';

/**
 * @param {MouseEvent} event
 */
const completedClick = (event) => {
  const todo = /** @type {HTMLElement} */ (event.target).closest('ha-todo');
  if (todo.hasAttribute('completed')) todo.removeAttribute('completed');
  else todo.setAttribute('completed', '');
};

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
        const doc = /** @type {DocumentFragment} */ (template.content.cloneNode(true));
        const element = /** @type {HTMLElement} */ (doc.querySelector('ha-todo'));
        element.dataset.id = todo.id;
        if (todo.completed) element.setAttribute('completed', '');
        doc.querySelector('ha-title').innerHTML = todo.title;
        doc.querySelector('button').addEventListener('click', completedClick);
        this.appendChild(doc);
      });

      if (todos.length === 0) console.log('No todos found.');
    }
  },
);
