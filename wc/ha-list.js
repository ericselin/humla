import { waitForAuth, todos, contextReducer } from './lib/firebase.js';
import { render } from './ha-todo.js';

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
      const todoList = (await getPromise).reduce(contextReducer, {});

      /** @type {HTMLTemplateElement} */
      const template = this.ownerDocument.querySelector('template#ha-todo');
      /** @type {HTMLTemplateElement} */
      const contextTemplate = this.ownerDocument.querySelector('template#context');
      this.innerHTML = '';

      Object.keys(todoList).forEach((context) => {
        // create context header
        /** @type {DocumentFragment} */
        const contextDoc = (contextTemplate.content.cloneNode(true));
        contextDoc.querySelector('div').innerText = context;
        // create todos
        todoList[context].forEach((todo) => {
          const todoDoc = /** @type {DocumentFragment} */ (template.content.cloneNode(true));
          const element = /** @type {HTMLElement} */ (todoDoc.querySelector('ha-todo'));
          element.id = todo.id;
          element.addEventListener('click', this.todoClick);
          render(todo, element);
          contextDoc.appendChild(todoDoc);
        });
        this.appendChild(contextDoc);
      });
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
