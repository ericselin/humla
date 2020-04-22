import { todos } from './lib/firebase.js';
import auth from './lib/auth.js';

export default class HaTags extends HTMLElement {
  /**
   * @param {typeof todos} [t]
   * @param {typeof auth} [w]
   */
  constructor(t, w) {
    super();
    this.todos = t || todos;
    this.waitForAuth = w || auth;
  }

  /**
   * @param {import('./lib/firebase').Todo[]} todoArr
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
    // clear contents
    this.innerHTML = '';
    // create contexts
    const ctxEl = document.createElement('div');
    contexts.sort().forEach((c) => {
      const el = document.createElement('ha-link');
      el.setAttribute('path', `/all/${c}`);
      el.innerText = c;
      ctxEl.appendChild(el);
    });
    this.appendChild(ctxEl);
    // create tags
    const tagEl = document.createElement('div');
    tags.sort().forEach((t) => {
      const el = document.createElement('ha-link');
      el.setAttribute('path', `/all/${t}`);
      el.innerText = t;
      tagEl.appendChild(el);
    });
    this.appendChild(tagEl);
  }

  async connectedCallback() {
    await this.waitForAuth();
    this.listener = await this.todos()
      .uncompleted()
      .listen(this.render.bind(this));
  }

  disconnectedCallback() {
    this.listener();
  }
}
HaTags.elementName = 'ha-tags';
