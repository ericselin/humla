/** @param {Event} event */
const linkClick = (event) => {
  const link = /** @type {HaLink} */ (event.currentTarget);
  const title = link.innerText;
  const state = { title, path: link.path };
  history.pushState(state, '', link.path);
  window.dispatchEvent(new CustomEvent('navigate', { detail: state }));
};

/** @param {PopStateEvent} event */
const popstate = (event) => {
  window.dispatchEvent(new CustomEvent('navigate', { detail: event.state }));
};

class HaLink extends HTMLElement {
  static get observedAttributes() {
    return ['path'];
  }

  get path() {
    return this.getAttribute('path');
  }

  set path(val) {
    this.setAttribute('path', val);
  }

  connectedCallback() {
    this.addEventListener('click', linkClick);
    window.addEventListener('popstate', popstate);
    this.setAttribute('role', 'link');
    if (this.hasAttribute('shortcut')) {
      const key = this.getAttribute('shortcut');
      window.addEventListener('keydown', (e) => {
        if (e.altKey && e.key === key) {
          this.dispatchEvent(new Event('click'));
        }
      });
    }
  }
}

window.customElements.define('ha-link', HaLink);
