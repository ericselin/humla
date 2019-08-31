import { doc } from './lib/firebase.js';
import { today } from './lib/date.js';

/**
 * @param {EventTarget} target
 * @returns {HaTodo}
 */
const getTodo = (target) => {
  const todo = /** @type {Element} */ (target).closest('ha-todo');
  return /** @type {HaTodo} */ (todo);
};

/**
 * @param {MouseEvent} event
 */
const completedClick = (event) => {
  const todo = getTodo(event.target);
  todo.completed = todo.completed ? '' : today();
  // for now, blur the button to induce a save
  /** @type {HTMLElement} */ (event.target).focus();
  /** @type {HTMLElement} */ (event.target).blur();
};

/**
 * @param {KeyboardEvent} event
 */
const blur = (event) => {
  if ((event.key === 'Enter' && event.ctrlKey) || event.key === 'Escape') {
    /** @type {HTMLElement} */ (event.target).blur();
  }
};

/**
 * @param {FocusEvent} event
 * @returns {any}
 */
const focus = (event) => {
  const todo = getTodo(event.target);
  /* eslint-disable prefer-destructuring */
  const relatedTarget = /** @type {HTMLElement} */ (event.relatedTarget);
  const target = /** @type {HTMLElement} */ (event.target);
  /* eslint-enable prefer-destructuring */
  const within = todo.contains(relatedTarget);

  // cancel if coming from outside into the button
  if (!within && event.type === 'focusin' && target.nodeName === 'BUTTON') return;
  // if we are shifting focus within the todo
  if (within) {
    // ... cancel all focusout events
    if (event.type === 'focusout') return;
    // ... cancel all focusin events except those coming from button
    if (relatedTarget.nodeName !== 'BUTTON') return;
  }

  // explicitly save on focus out / when blurring
  if (event.type === 'focusout') todo.save();

  todo.open = event.type === 'focusin';
};

/**
 * @param {Todo} todo
 * @param {HTMLElement} element
 */
export const render = (todo, element) => {
  if (todo.completed !== (element.getAttribute('completed') || '')) element.setAttribute('completed', todo.completed);
  element.querySelector('button').addEventListener('click', completedClick);
  /* eslint-disable no-param-reassign */
  /** @type {HTMLElement} */ (element.querySelector('ha-title')).innerText = todo.title;
  element.querySelector('ha-date').setAttribute('value', todo.soft || '');
  /* eslint-enable */
  const detailsElem = element.querySelector('.details');
  if (todo.tags) {
    detailsElem.querySelectorAll('*:not(ha-date)').forEach((tagElem) => {
      tagElem.remove();
    });
    todo.tags.forEach((t) => {
      const tagElem = document.createElement('div');
      tagElem.className = 'tag';
      tagElem.innerText = t;
      detailsElem.appendChild(tagElem);
    });
  }
};

class HaTodo extends HTMLElement {
  static get observedAttributes() {
    return ['open'];
  }

  get open() {
    return this.hasAttribute('open');
  }

  set open(val) {
    if (val) this.setAttribute('open', '');
    else this.removeAttribute('open');
  }

  get completed() {
    return this.getAttribute('completed') || '';
  }

  set completed(val) {
    if (val) this.setAttribute('completed', val);
    else this.removeAttribute('completed');
  }

  /**
   * Render a particular todo
   * WARNING: discards changes
   *
   * @param {Todo} todo
   */
  render(todo) {
    render(todo, this);
  }

  save() {
    /** @type {import('./ha-title').default} */
    const title = this.querySelector('ha-title');
    /** @type {HTMLInputElement} */
    const date = this.querySelector('ha-date');
    doc(this.id).update({
      title: title.innerText,
      soft: date.value,
      completed: this.completed,
    });
  }

  attributeChangedCallback(name) {
    if (name === 'open') {
      /** @type {import('./ha-title').default} */
      const title = this.querySelector('ha-title');
      // set title open state
      title.open = this.open;
    }
  }

  connectedCallback() {
    this.addEventListener('focusin', focus);
    this.addEventListener('focusout', focus);
    this.addEventListener('keydown', blur);
  }
}

window.customElements.define('ha-todo', HaTodo);

export default HaTodo;

/** @typedef {import('./lib/types').Todo} Todo */
