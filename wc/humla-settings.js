import './humla-setting-toggle.js';

const template = document.createElement('template');
template.innerHTML = /* html */ `<div>
  <humla-setting-toggle name="projects">
    Projects
  </humla-setting-toggle>
</div>
`;

window.customElements.define(
  'humla-settings',
  class extends HTMLElement {
    constructor() {
      super();
      // Attach a shadow root to the element.
      const shadowRoot = this.attachShadow({ mode: 'open' });
      shadowRoot.appendChild(template.content.cloneNode(true));
    }
  },
);
