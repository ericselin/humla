import * as firebaseReal from './lib/firebase.js';
import { render as renderTodo } from './todo/ha-todo.js';

/**
 * @param {Todo[]} todos
 * @returns {string}
 */
const renderTodos = (todos) => todos.map(renderTodo).join('');

/**
 * @param {Todo[]} todos
 * @returns {string} HTML
 */
export const renderList = (todos) => {
  const contexts = todos.reduce(firebaseReal.contextReducer, {});
  return Object.keys(contexts)
    .map(
      (context) => `
    <ha-context>${context}<button></button></ha-context>
    <div>${renderTodos(contexts[context])}</div>`,
    )
    .join('');
};

/**
 * @param {Todo[]} todos
 * @returns {string} HTML
 */
export const renderWeek = (todos) => {
  // create array of all contexts
  const contexts = todos.reduce(
    (arr, t) => (!arr.includes(t.context) ? arr.concat(t.context) : arr),
    [],
  );
  contexts.push('no context');
  const week = todos.reduce(firebaseReal.weekReducer, firebaseReal.week);
  const mapped = Object.keys(week).reduce((obj, day) => {
    const todosOnDay = week[day];
    const todosByContext = todosOnDay.reduce(firebaseReal.contextReducer, {});
    return { ...obj, [day]: todosByContext };
  }, week);
  return Object.keys(mapped)
    .map(
      (day, dayIndex) => `
    <h2 class="text-heading2" style="grid-column: ${dayIndex + 1}">${day}</h2>
    ${Object.keys(mapped[day])
    .map(
      (context) => `
    <div class="text-subheading" style="
      grid-column: ${dayIndex + 1};
      grid-row: ${contexts.indexOf(context) * 2 + 2}
    ">${context}</div>
    <div style="
      grid-column: ${dayIndex + 1};
      grid-row: ${contexts.indexOf(context) * 2 + 3}
    ">${renderTodos(mapped[day][context])}</div>
    `,
    )
    .join('')}
  `,
    )
    .join('');
};

/**
 * @param {Todo[]} todos
 * @param {string} [view]
 * @returns {string}
 */
export const render = (todos, view) => `
  <link rel="stylesheet" href="ha-list.css" />
  <ha-list class="container week-list" view="${view || ''}">${
  view === 'week' ? renderWeek(todos) : renderList(todos)
}</ha-list>
`;

export default class HaList extends HTMLElement {
  /**
   * @param {typeof firebaseReal} [firebaseMock]
   */
  constructor(firebaseMock) {
    super();
    this.navigation = this.navigation.bind(this);
    this.render = this.render.bind(this);
    /** @type {() => any} */
    this.listener = undefined;
    this.firebase = typeof firebaseMock !== 'undefined' ? firebaseMock : firebaseReal;
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
    this.innerHTML = this.view === 'week' ? renderWeek(todos) : renderList(todos);
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
    // only init and add listeners if firebase loaded (useful for design testing)
    // @ts-ignore
    if (window.firebase) {
      await this.firebase.init();
      this.listener = this.firebase
        .todos()
        .uncompleted()
        .today()
        .listen(this.render);
    }
  }
}
HaList.elementName = 'ha-list';

/** @typedef {import('./lib/types').Todo} Todo */
