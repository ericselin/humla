// eslint-disable-next-line jsdoc/require-param
/** @type {EventListener} */
const linkClick = (event) => {
  history.pushState({}, '', /** @type {HaLink} */ (event.currentTarget).path);
  window.dispatchEvent(new Event('navigate'));
};

const popstate = () => {
  window.dispatchEvent(new Event('navigate'));
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
  }
}

window.customElements.define('ha-link', HaLink);
