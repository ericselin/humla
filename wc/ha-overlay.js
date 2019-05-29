class HaOverlay extends HTMLElement {
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
   * @param {MouseEvent} e
   */
  closing(e) {
    /** @type {HTMLElement} */
    const t = (e.target);
    if (t === e.currentTarget || t.tagName === 'HA-LINK') this.open = false;
  }

  onKey(e) {
    if (e.key === 'Escape') this.open = false;
  }

  connectedCallback() {
    this.addEventListener('click', this.closing.bind(this));
    this.addEventListener('keydown', this.onKey.bind(this));
  }
}

window.customElements.define('ha-overlay', HaOverlay);

export default HaOverlay;
