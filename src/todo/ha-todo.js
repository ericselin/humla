import { doc, getConfig } from '../lib/firebase.js';
import { today, getDate } from '../lib/date.js';

/**
 * @param {Todo} todo
 * @returns {string}
 */
export const render = (todo) => `
<ha-todo id="${todo.id}" ${todo.completed ? ` completed=${todo.completed}` : ''}>
  <button></button>
  <ha-title>${todo.title}</ha-title>
  <div class="details">
    <input placeholder="No date..." value="${todo.soft}" />
    ${getConfig('projects') && todo.project ? '<div class="tag tag--project">Project</div>' : ''}
    ${todo.tags ? todo.tags.map((tag) => `<div class="tag">${tag}</div>`).join('') : ''}
  </div>
</ha-todo>
`;

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

export default class HaTodo extends HTMLElement {
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

  save() {
    /** @type {import('./ha-title').default} */
    const title = this.querySelector('ha-title');
    /** @type {HTMLInputElement} */
    const date = this.querySelector('input');
    // bail if firebase not set
    // @ts-ignore
    if (!window.firebase) return;
    // save
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
    const completedBtn = this.querySelector('button');
    // meetings don't have a button
    if (completedBtn) {
      completedBtn.addEventListener('click', completedClick);
    }
    this.addEventListener('focusin', focus);
    this.addEventListener('focusout', focus);
    this.addEventListener('keydown', blur);
    const dateInput = this.querySelector('input');
    // on week view, we don't have an input, so check it exists
    if (dateInput) {
      dateInput.addEventListener('focus', function dateFocus() {
        this.select();
      });
      dateInput.addEventListener('blur', function dateBlur() {
        this.value = getDate(this.value);
      });
    }
  }
}
HaTodo.elementName = 'ha-todo';

/** @typedef {import('../lib/types').Todo} Todo */
