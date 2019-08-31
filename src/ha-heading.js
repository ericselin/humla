window.customElements.define(
  'ha-heading',
  class extends HTMLElement {
    connectedCallback() {
      window.addEventListener('navigate', (e) => {
        // @ts-ignore
        this.textContent = e.detail.title;
      });
    }
  },
);
