import { todos, init } from './lib/firebase.js';

export default class HaTags extends HTMLElement {
  /**
   * @param {typeof todos} t
   * @param {typeof init} w
   */
  constructor(t, w) {
    super();
    this.todos = t || todos;
    this.waitForAuth = w || init;
  }

  /**
   * @param {import('./lib/firebase').Todo[]} todoArr
   * @returns {any}
   */
  render(todoArr) {
    // create arrays
    const contexts = [];
    const tags = [];
    todoArr.forEach((todo) => {
      // context
      if (todo.context && !contexts.includes(todo.context)) {
        contexts.push(todo.context);
      }
      // tags
      if (todo.tags) {
        todo.tags.forEach((tag) => {
          if (!tags.includes(tag)) {
            tags.push(tag);
          }
        });
      }
    });
    // create contexts
    const ctxEl = document.createElement('div');
    contexts.sort().forEach((c) => {
      const el = document.createElement('ha-link');
      el.setAttribute('path', `/all/${c}`);
      ctxEl.appendChild(el);
    });
    this.appendChild(ctxEl);
    // create tags
    const tagEl = document.createElement('div');
    tags.sort().forEach((t) => {
      const el = document.createElement('ha-link');
      el.setAttribute('path', `/all/${t}`);
      tagEl.appendChild(el);
    });
    this.appendChild(tagEl);
  }

  async connectedCallback() {
    await this.waitForAuth();
    this.listener = this.todos()
      .uncompleted()
      .listen(this.render.bind(this));
  }

  disconnectedCallback() {
    this.listener();
  }
}

window.customElements.define('ha-tags', HaTags);
