window.customElements.define(
  'ha-overlay-button',
  class extends HTMLElement {
    click() {
      const overlay = this.getAttribute('overlay');
      /** @type {import('./ha-overlay').default} */
      const el = (document.getElementById(overlay));
      el.open = true;
      // focus if attribute set on a child
      /** @type {HTMLElement} */
      const focusable = (el.querySelector('[focus]'));
      if (focusable) focusable.focus();
    }

    connectedCallback() {
      const bound = this.click.bind(this);
      this.addEventListener('click', bound);
      this.role = 'button';
      this.tabIndex = 0;
    }
  },
);
