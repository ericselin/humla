import { doc } from './lib/firebase.js';
import { today } from './lib/date.js';

/**
 * @param {MouseEvent} event
 */
const completedClick = (event) => {
  const todo = /** @type {HaTodo} */ /** @type {HTMLElement} */ (event.target).closest('ha-todo');
  todo.completed = todo.completed ? '' : today();
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
  /** @type {HTMLInputElement} */ (element.querySelector('.ha-date')).value = todo.soft || '';
  /* eslint-enable */
  const detailsElem = element.querySelector('.details');
  if (todo.tags) {
    detailsElem.querySelectorAll('*:not(input)').forEach((tagElem) => {
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
    return ['open', 'completed'];
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
    const date = this.querySelector('.ha-date');
    const todo = doc(this.id).update({
      title: title.innerText,
      soft: date.value,
      completed: this.completed,
    });
    this.render(todo);
  }

  attributeChangedCallback(name) {
    if (name === 'open') {
      /** @type {import('./ha-title').default} */
      const title = this.querySelector('ha-title');
      // set title open state
      title.open = this.open;
      // save if now not open
      if (!this.open) {
        this.save();
      }
    } else if (name === 'completed') {
      this.save();
    }
  }
}

window.customElements.define('ha-todo', HaTodo);

export default HaTodo;

/** @typedef {import('./lib/types').Todo} Todo */
