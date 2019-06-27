import { init, todos, contextReducer } from './lib/firebase.js';
import { render } from './ha-todo.js';

window.customElements.define(
  'ha-list',
  class extends HTMLElement {
    constructor() {
      super();
      this.navigation = this.navigation.bind(this);
      this.render = this.render.bind(this);
      /** @type {() => any} */
      this.listener = undefined;
    }

    /**
     * @param {import('./lib/types').Todo[]} todoArr
     */
    render(todoArr) {
      const todoList = todoArr.reduce(contextReducer, {});
      /** @type {HTMLTemplateElement} */
      const template = this.ownerDocument.querySelector('template#ha-todo');
      /** @type {HTMLTemplateElement} */
      const contextTemplate = this.ownerDocument.querySelector('template#context');
      this.innerHTML = '';

      Object.keys(todoList).forEach((context) => {
        // create context header
        /** @type {DocumentFragment} */
        const contextDoc = (contextTemplate.content.cloneNode(true));
        const contextEl = contextDoc.querySelector('ha-context');
        /** @type {HTMLDivElement} */ (contextEl.querySelector('[title]')).innerText = context;
        // create todos
        todoList[context].forEach((todo) => {
          const todoDoc = /** @type {DocumentFragment} */ (template.content.cloneNode(true));
          const element = /** @type {HTMLElement} */ (todoDoc.querySelector('ha-todo'));
          element.id = todo.id;
          render(todo, element);
          contextEl.appendChild(todoDoc);
        });
        this.appendChild(contextEl);
      });
    }

    /**
     * @param {Promise<import('./lib/types').Todo[]>} getPromise
     * @returns {Promise}
     */
    async get(getPromise) {
      this.render(await getPromise);
    }

    navigation() {
      if (this.listener) this.listener();
      const view = location.pathname.substr(1);
      switch (view) {
        case 'today':
        case 'week':
        case 'later':
        case 'someday':
        case 'unprocessed':
          this.listener = todos()
            .uncompleted()
            // eslint-disable-next-line no-unexpected-multiline
            [view]()
            .listen(this.render);
          break;

        default:
          this.listener = todos()
            .uncompleted()
            .listen(this.render);
          break;
      }
    }

    async connectedCallback() {
      window.addEventListener('navigate', this.navigation);
      await init();
      this.listener = todos()
        .uncompleted()
        .today()
        .listen(this.render);
    }
  },
);
