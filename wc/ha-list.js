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
    constructor() {
      super();
      this.selected = '';
    }

    async connectedCallback() {
      await waitForAuth();
      const todos = await new Todos().uncompleted().get();

      /** @type {HTMLTemplateElement} */
      const template = this.ownerDocument.querySelector('template#ha-todo');
      this.innerHTML = '';

      todos.forEach((todo) => {
        const doc = /** @type {DocumentFragment} */ (template.content.cloneNode(true));
        const element = /** @type {HTMLElement} */ (doc.querySelector('ha-todo'));
        element.id = todo.id;
        element.addEventListener('click', this.selectTodo.bind(this));
        if (todo.completed) element.setAttribute('completed', '');
        doc.querySelector('ha-title').innerHTML = todo.title;
        doc.querySelector('button').addEventListener('click', completedClick);
        /** @type {HTMLInputElement} */ (doc.querySelector('.ha-date')).value = todo.soft || '';
        if (todo.tags) {
          const detailsElem = doc.querySelector('.details');
          todo.tags.forEach((t) => {
            const tagElem = document.createElement('div');
            tagElem.className = 'tag';
            tagElem.innerText = t;
            detailsElem.appendChild(tagElem);
          });
        }
        this.appendChild(doc);
      });

      if (todos.length === 0) console.log('No todos found.');
    }

    /**
     * @param {MouseEvent} event
     */
    selectTodo(event) {
      const todo = /** @type {HTMLElement} */ (event.currentTarget);
      if (this.selected !== todo.id) {
        if (this.selected) document.getElementById(this.selected).removeAttribute('open');
        todo.setAttribute('open', '');
        this.selected = todo.id;
      }
    }
  },
);
