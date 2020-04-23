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
    <div list>${renderTodos(contexts[context])}</div>`,
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
    <div list style="
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
 * @param {Todo[]} todos Array of todos (meetings are todos)
 * @param {string} [view] View (i.e. is this week view)
 * @returns {string}
 */
export const renderInner = (todos, view) => (view === 'week' ? renderWeek(todos) : renderList(todos));

/**
 * @param {Todo[]} todos Array of todos (meetings are todos)
 * @param {string} [view] View (i.e. is this week view)
 * @returns {string}
 */
export const render = (todos, view) => `
  <ha-list class="container week-list" view="${view || ''}">${renderInner(todos, view)}</ha-list>
`;

export default class HaList extends HTMLElement {
  /**
   * @param {typeof firebaseReal} [firebaseMock]
   */
  constructor(firebaseMock) {
    super();
    this.navigation = this.navigation.bind(this);
    this.render = this.render.bind(this);
    this.drag = this.drag.bind(this);
    this.leave = this.leave.bind(this);
    this.over = this.over.bind(this);
    this.drop = this.drop.bind(this);
    /** @type {() => any} */
    this.listener = undefined;
    /** @type {HTMLElement} */
    this.dragging = undefined;
    this.firebase = typeof firebaseMock !== 'undefined' ? firebaseMock : firebaseReal;
  }

  get view() {
    return this.getAttribute('view');
  }

  set view(val) {
    this.setAttribute('view', val);
  }

  /**
   * @param {DragEvent} ev
   */
  drag(ev) {
    const targetEl = /** @type {HTMLElement} */(ev.target);
    const todo = /** @type {HTMLElement} */(targetEl.closest('ha-todo'));
    this.dragging = todo;
    ev.dataTransfer.setData('text', todo.innerText);
    // eslint-disable-next-line no-param-reassign
    ev.dataTransfer.effectAllowed = 'move';
    window.requestAnimationFrame(() => {
      this.dragging.classList.add('dragging');
    });
  }

  /**
   * @param {DragEvent} ev
   */
  leave(ev) {
    const targetEl = /** @type {HTMLElement} */(ev.target);
    // only act when exiting item
    if (targetEl.nodeName !== 'HA-TODO') return;
    const targetRect = targetEl.getBoundingClientRect();
    const parent = targetEl.parentElement;
    if (ev.y > targetRect.bottom) {
      parent.insertBefore(this.dragging, targetEl.nextSibling);
    } else {
      parent.insertBefore(this.dragging, targetEl);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  over(ev) {
    ev.preventDefault();
    // eslint-disable-next-line no-param-reassign
    ev.dataTransfer.dropEffect = 'move';
  }

  drop() {
    this.dragging.classList.remove('dragging');
    this.firebase.move(
      this.dragging.id,
      this.dragging.previousElementSibling && this.dragging.previousElementSibling.id,
      this.dragging.nextElementSibling && this.dragging.nextElementSibling.id,
    );
  }

  /**
   * @param {import('./lib/types').Todo[]} todos
   */
  async render(todos) {
    this.innerHTML = renderInner(todos, this.view);
    // attach drag and drop handlers
    this.querySelectorAll('div[list]').forEach((node) => {
      node.addEventListener('dragstart', this.drag);
      node.addEventListener('dragleave', this.leave);
      node.addEventListener('dragover', this.over);
      node.addEventListener('drop', this.drop);
    });

    this.querySelectorAll('ha-todo').forEach((node) => {
      // eslint-disable-next-line no-param-reassign
      /** @type {HTMLElement} */(node).draggable = true;
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
  async navigation(evt) {
    if (this.listener) this.listener();
    const [, view, search] = evt.detail.path.split('/');
    this.view = view;
    const views = ['today', 'week', 'later', 'someday', 'unprocessed'];
    if (views.includes(view)) {
      this.listener = await this.firebase
        .todos()
        .uncompleted()
        // eslint-disable-next-line no-unexpected-multiline
        [view]()
        .listen(this.render);
    } else if (search) {
      this.listener = await this.firebase
        .todos()
        .uncompleted()
        .search(search)
        .listen(this.render);
    } else if (view === 'all') {
      this.listener = await this.firebase
        .todos()
        .uncompleted()
        .listen(this.render);
    } else {
      this.innerHTML = ' ';
    }
  }

  /**
   * Key event to handle sorting
   *
   * @param {KeyboardEvent} e
   */
  keydown(e) {
    if (e.altKey && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      const currentEl = /** @type {HTMLElement} */(e.target).closest('ha-todo');
      if (!currentEl) return;
      let beforeElement;
      let afterElement;
      if (e.key === 'ArrowDown') {
        afterElement = currentEl.nextElementSibling;
        if (!afterElement) return;
        beforeElement = afterElement.nextElementSibling;
      } else {
        beforeElement = currentEl.previousElementSibling;
        if (!beforeElement) return;
        afterElement = beforeElement.previousElementSibling;
      }
      this.firebase.move(
        currentEl.id,
        afterElement && afterElement.id,
        beforeElement && beforeElement.id,
      );
    }
  }

  async connectedCallback() {
    window.addEventListener('navigate', this.navigation);
    this.addEventListener('keydown', this.keydown);
    this.view = 'today';
    this.listener = await this.firebase
      .todos()
      .uncompleted()
      .today()
      .listen(this.render);
  }
}
HaList.elementName = 'ha-list';

/** @typedef {import('./lib/types').Todo} Todo */
