import * as firebaseReal from './lib/firebase.js';
import { render } from './ha-todo.js';

export default class HaCompleted extends HTMLElement {
  /**
   * @param {typeof firebaseReal} firebaseMock
   * @param {Window} windowMock
   */
  constructor(firebaseMock, windowMock) {
    super();
    this.render = this.render.bind(this);
    this.navigator = this.navigator.bind(this);
    /** @type {() => any} */
    this.listener = undefined;
    this.firebase = firebaseMock || firebaseReal;
    this.window = windowMock || window;
  }

  get view() {
    return this.getAttribute('view');
  }

  set view(val) {
    this.setAttribute('view', val);
  }

  /**
   * @param {import('./lib/types').Todo[]} todos
   */
  render(todos) {
    /** @type {HTMLTemplateElement} */
    const template = this.ownerDocument.querySelector('template#ha-todo');
    this.innerHTML = '';

    if (this.view === 'week') {
      const todoList = todos.reduce(this.firebase.completedThisWeek, []);
      this.innerHTML = '';

      for (let i = 0; i < todoList.length; i += 1) {
        const dayTodos = todoList[i];
        // create weekday wrapping div
        const wrapperDiv = document.createElement('div');
        // create todos
        if (dayTodos) {
          dayTodos.forEach((todo) => {
            const todoDoc = /** @type {DocumentFragment} */ (template.content.cloneNode(true));
            const element = /** @type {HTMLElement} */ (todoDoc.querySelector('ha-todo'));
            element.id = todo.id;
            render(todo, element);
            wrapperDiv.appendChild(todoDoc);
          });
        }
        this.appendChild(wrapperDiv);
      }
    } else {
      todos.forEach((todo) => {
        const todoDoc = /** @type {DocumentFragment} */ (template.content.cloneNode(true));
        const element = /** @type {HTMLElement} */ (todoDoc.querySelector('ha-todo'));
        element.id = todo.id;
        render(todo, element);
        this.appendChild(todoDoc);
      });
    }
  }

  /**
   * @param {CustomEvent} evt
   */
  navigator(evt) {
    // unsubscribe if subscribed
    if (this.listener) this.listener();
    const [, view] = evt.detail.path.split('/');
    this.view = view;
    switch (view) {
      case 'today':
        this.listener = this.firebase
          .todos()
          .completed.today()
          .listen(this.render);
        break;
      case 'week':
        this.listener = this.firebase
          .todos()
          .completed.week()
          .listen(this.render);
        break;
      default:
        this.render([]);
        break;
    }
  }

  async connectedCallback() {
    this.window.addEventListener('navigate', this.navigator);
    await this.firebase.init();
    this.listener = this.firebase
      .todos()
      .completed.today()
      .listen(this.render);
  }
}

window.customElements.define('ha-completed', HaCompleted);
