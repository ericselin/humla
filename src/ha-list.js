import * as firebaseReal from './lib/firebase.js';
import { render } from './ha-todo.js';

export default class HaList extends HTMLElement {
  /**
   * @param {typeof firebaseReal} firebaseMock
   */
  constructor(firebaseMock) {
    super();
    this.navigation = this.navigation.bind(this);
    this.render = this.render.bind(this);
    /** @type {() => any} */
    this.listener = undefined;
    this.firebase = firebaseMock || firebaseReal;
  }

  get view() {
    return this.getAttribute('view');
  }

  set view(val) {
    this.setAttribute('view', val);
  }

  /**
   * @param {import('./lib/types').Todo[]} todoArr
   */
  render(todoArr) {
    const todoList = this.view === 'week'
      ? todoArr.reduce(this.firebase.weekReducer, this.firebase.week)
      : todoArr.reduce(this.firebase.contextReducer, {});
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

  /**
   * @param {CustomEvent} evt
   */
  navigation(evt) {
    if (this.listener) this.listener();
    const [, view, search] = evt.detail.path.split('/');
    this.view = view;
    const views = ['today', 'week', 'later', 'someday', 'unprocessed'];
    if (views.includes(view)) {
      this.listener = this.firebase
        .todos()
        .uncompleted()
        // eslint-disable-next-line no-unexpected-multiline
        [view]()
        .listen(this.render);
    } else if (search) {
      this.listener = this.firebase
        .todos()
        .uncompleted()
        .search(search)
        .listen(this.render);
    } else {
      this.listener = this.firebase
        .todos()
        .uncompleted()
        .listen(this.render);
    }
  }

  async connectedCallback() {
    window.addEventListener('navigate', this.navigation);
    await this.firebase.init();
    this.listener = this.firebase
      .todos()
      .uncompleted()
      .today()
      .listen(this.render);
  }
}

window.customElements.define('ha-list', HaList);
