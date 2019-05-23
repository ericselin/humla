import { waitForAuth, todos } from './lib/firebase.js';

window.customElements.define(
  'ha-list',
  class extends HTMLElement {
    constructor() {
      super();
      this.navigation = this.navigation.bind(this);
      this.todoClick = this.todoClick.bind(this);
    }

    static get observedAttributes() {
      return ['selected'];
    }

    get selected() {
      return this.getAttribute('selected');
    }

    set selected(val) {
      this.setAttribute('selected', val);
    }

    // eslint-disable-next-line class-methods-use-this
    attributeChangedCallback(name, oldValue, newValue) {
      if (name === 'selected' && oldValue !== newValue) {
        if (oldValue) document.getElementById(oldValue).removeAttribute('open');
        if (newValue) document.getElementById(newValue).setAttribute('open', '');
      }
    }

    /**
     * @param {Promise<import('./lib/types').Todo[]>} getPromise
     * @returns {Promise}
     */
    async get(getPromise) {
      const todoList = await getPromise;

      /** @type {HTMLTemplateElement} */
      const template = this.ownerDocument.querySelector('template#ha-todo');
      /** @type {HTMLTemplateElement} */
      const contextTemplate = this.ownerDocument.querySelector('template#context');
      this.innerHTML = '';

      todoList.forEach((todo, i, arr) => {
        // create context header if needed
        if (i === 0 || todo.context !== arr[i - 1].context) {
          const doc = /** @type {DocumentFragment} */ (contextTemplate.content.cloneNode(true));
          doc.querySelector('div').innerText = todo.context;
          this.appendChild(doc);
        }
        // render the todo
        const doc = /** @type {DocumentFragment} */ (template.content.cloneNode(true));
        const element = /** @type {HTMLElement} */ (doc.querySelector('ha-todo'));
        element.id = todo.id;
        element.addEventListener('click', this.todoClick);
        this.appendChild(doc);
        /** @type {import('./ha-todo').default} */ (element).render(todo);
      });

      if (todoList.length === 0) console.log('No todos found.');
    }

    navigation() {
      if (location.pathname === '/today') {
        this.get(
          todos()
            .uncompleted()
            .today()
            .get(),
        );
      } else {
        this.get(
          todos()
            .uncompleted()
            .get(),
        );
      }
    }

    async connectedCallback() {
      window.addEventListener('navigate', this.navigation);
      this.addEventListener('keydown', (e) => {
        if ((e.key === 'Enter' && e.ctrlKey) || e.key === 'Escape') {
          this.selected = '';
        }
      });
      await waitForAuth();
      this.get(
        todos()
          .uncompleted()
          .get(),
      );
    }

    /**
     * @param {MouseEvent} event
     */
    todoClick(event) {
      const todo = /** @type {HTMLElement} */ (event.currentTarget);
      this.selected = todo.id;
    }
  },
);
