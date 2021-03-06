export default class HaOverlay extends HTMLElement {
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

  get modal() {
    return this.hasAttribute('modal');
  }

  set modal(val) {
    if (val) this.setAttribute('modal', '');
    else this.removeAttribute('modal');
  }

  attributeChangedCallback(name) {
    if (name === 'open' && this.open) {
      // focus if attribute set on a child
      /** @type {HTMLElement} */
      const focusable = (this.querySelector('[focus]'));
      if (focusable) focusable.focus();
    }
  }

  /**
   * @param {MouseEvent} e
   */
  closing(e) {
    /** @type {HTMLElement} */
    const t = (e.target);
    if (!this.modal && (t === e.currentTarget || t.tagName === 'HA-LINK')) this.open = false;
  }

  onKey(e) {
    if (!this.modal && e.key === 'Escape') this.open = false;
  }

  connectedCallback() {
    this.addEventListener('click', this.closing.bind(this));
    this.addEventListener('keydown', this.onKey.bind(this));
  }
}
HaOverlay.elementName = 'ha-overlay';
