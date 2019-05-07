import firebase from './firebase.js';

const template = document.createElement('template');
template.innerHTML = /* html */ `
<style>
  b {
    color: red;
  }
</style>
<b>Hello</b>
`;

window.customElements.define(
  'humla-setting-toggle',
  class extends HTMLElement {
    constructor() {
      super(); // always call super() first in the constructor.

      // Attach a shadow root to the element.
      const shadowRoot = this.attachShadow({ mode: 'open' });
      shadowRoot.appendChild(template.content.cloneNode(true));
    }

    async connectedCallback() {
      const { uid } = firebase.auth().currentUser;
      const db = firebase.firestore();
      const qs = await db
        .collection('todos')
        .where('owner', '==', uid)
        .get();
      console.log(qs);
      this.shadowRoot.querySelector('b').innerText = `${qs.size} todos`;
    }
  },
);
