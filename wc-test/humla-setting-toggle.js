import firebase from './firebase.js';
import load from './html-loader.js';

const html = load('humla-setting-toggle.html');

window.customElements.define(
  'humla-setting-toggle',
  class extends HTMLElement {
    async connectedCallback() {
      // Attach a shadow root to the element.
      const template = document.createElement('template');
      const shadowRoot = this.attachShadow({ mode: 'open' });
      template.innerHTML = await Promise.resolve(html);
      shadowRoot.appendChild(template.content.cloneNode(true));

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
