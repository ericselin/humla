import * as firebaseReal from './lib/firebase.js';
import { render as renderTodo } from './todo/ha-todo.js';

/**
 * @param {Todo[]} todos
 * @returns {string}
 */
const renderWeek = (todos) => {
  const todosByDay = todos.reduce(firebaseReal.completedThisWeek, [[], [], [], [], [], []]);
  return todosByDay
    .map((todosForDay) => `<div>${todosForDay.map(renderTodo).join('')}</div>`)
    .join('');
};

/**
 * @param {Todo[]} todos
 * @param {string} [view]
 * @returns {string}
 */
const renderInner = (todos, view) => (view === 'week' ? renderWeek(todos) : todos.map(renderTodo).join(''));

/**
 * @param {Todo[]} todos
 * @param {string} [view]
 * @returns {string}
 */
export const render = (todos, view = '') => `
  <ha-completed view="${view}" class="container week-list">
    ${renderInner(todos, view)}
  </ha-completed>
`;

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
   * @param {Todo[]} todos
   */
  render(todos) {
    this.innerHTML = renderInner(todos, this.view);
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
    // @ts-ignore
    if (this.window.firebase) {
      await this.firebase.init();
      this.listener = this.firebase
        .todos()
        .completed.today()
        .listen(this.render);
    }
  }
}
HaCompleted.elementName = 'ha-completed';

/** @typedef {import('./lib/types').Todo} Todo */
