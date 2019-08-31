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

  /**
   * @param {import('./lib/types').Todo[]} todos
   */
  render(todos) {
    /** @type {HTMLTemplateElement} */
    const template = this.ownerDocument.querySelector('template#ha-todo');
    this.innerHTML = '';

    todos.forEach((todo) => {
      const todoDoc = /** @type {DocumentFragment} */ (template.content.cloneNode(true));
      const element = /** @type {HTMLElement} */ (todoDoc.querySelector('ha-todo'));
      element.id = todo.id;
      render(todo, element);
      this.appendChild(todoDoc);
    });
  }

  /**
   * @param {CustomEvent} evt
   */
  navigator(evt) {
    // unsubscribe if subscribed
    if (this.listener) this.listener();
    const { path } = evt.detail;
    if (path.startsWith('/today')) {
      this.listener = this.firebase
        .todos()
        .completed.today()
        .listen(this.render);
    } else if (path.startsWith('/week')) {
      this.listener = this.firebase
        .todos()
        .completed.week()
        .listen(this.render);
    } else {
      // clear if not today or week
      this.render([]);
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
