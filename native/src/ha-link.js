// eslint-disable-next-line jsdoc/require-param
/** @type {EventListener} */
const linkClick = (event) => {
  const link = /** @type {HaLink} */ (event.currentTarget);
  const title = link.innerText;
  history.pushState({ title }, '', link.path);
  window.dispatchEvent(new CustomEvent('navigate', { detail: title }));
};

/** @param {PopStateEvent} e */
const popstate = (e) => {
  window.dispatchEvent(new CustomEvent('navigate', { detail: e.state.title }));
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
