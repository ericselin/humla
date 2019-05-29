import { doc } from './lib/firebase.js';

/**
 * @param {MouseEvent} event
 */
const completedClick = (event) => {
  const todo = /** @type {HTMLElement} */ (event.target).closest('ha-todo');
  if (todo.hasAttribute('completed')) todo.removeAttribute('completed');
  else todo.setAttribute('completed', '');
};

/**
 * @param {Todo} todo
 * @param {HTMLElement} element
 */
export const render = (todo, element) => {
  if (todo.completed) element.setAttribute('completed', '');
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
    return ['open'];
  }

  get open() {
    return this.hasAttribute('open');
  }

  set open(val) {
    if (val) this.setAttribute('open', '');
    else this.removeAttribute('open');
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

  attributeChangedCallback(name) {
    if (name === 'open') {
      /** @type {import('./ha-title').default} */
      const title = this.querySelector('ha-title');
      // set title open state
      title.open = this.open;
      // save if now not open
      if (!this.open) {
        // @ts-ignore
        const todo = doc(this.id).update({ title: title.innerText });
        this.render(todo);
      }
    }
  }
}

window.customElements.define('ha-todo', HaTodo);

export default HaTodo;

/** @typedef {import('./lib/types').Todo} Todo */
