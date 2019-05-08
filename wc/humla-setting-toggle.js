import firebase from './firebase.js';
import load from './html-loader.js';

const html = load('humla-setting-toggle.html');

const settings = () => {
  const { uid } = firebase.auth().currentUser;
  const db = firebase.firestore();
  return db.collection(uid).doc('settings');
};

window.customElements.define(
  'humla-setting-toggle',
  class extends HTMLElement {
    async connectedCallback() {
      // Attach a shadow root to the element.
      const template = document.createElement('template');
      const shadowRoot = this.attachShadow({ mode: 'open' });
      template.innerHTML = await Promise.resolve(html);
      shadowRoot.appendChild(template.content.cloneNode(true));
      shadowRoot.querySelector('input').addEventListener('change', (ev) => {
        /** @type {HTMLInputElement} */
        const el = ev.target;
        this.updateSetting(el.checked);
      });
    }

    static get observedAttributes() {
      return ['name'];
    }

    get name() {
      return this.getAttribute('name');
    }

    set name(val) {
      this.setAttribute('name', val);
    }

    /**
     * @param {string} name
     * @param {string} oldValue
     * @param {string} newValue
     */
    attributeChangedCallback(name, oldValue, newValue) {
      switch (name) {
        case 'name':
          this.loadSetting(newValue);
          break;
        default:
          console.error('Not implemented');
          break;
      }
    }

    /**
     * @param {boolean} val
     */
    async updateSetting(val) {
      console.log('Setting setting', val);
      const doc = await settings().get();
      if (doc.exists) {
        await settings().update(this.name, val);
      } else {
        await settings().set({
          [this.name]: val,
        });
      }
    }

    async loadSetting(name) {
      const doc = await settings().get();
      const input = this.shadowRoot.querySelector('input');
      if (doc.get(name)) {
        input.setAttribute('checked', '');
      } else {
        input.removeAttribute('checked');
      }
      input.removeAttribute('disabled');
    }
  },
);
