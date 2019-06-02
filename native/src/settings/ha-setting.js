import firebase from '../lib/firebase.js';

const settings = () => {
  const { uid } = firebase.auth().currentUser;
  const db = firebase.firestore();
  return db.collection(uid).doc('settings');
};

window.customElements.define(
  'ha-setting',
  class extends HTMLElement {
    async connectedCallback() {
      // create the input element
      const input = document.createElement('input');
      input.addEventListener('change', (ev) => {
        this.updateSetting(/** @type {HTMLInputElement} */ (ev.target).checked);
      });
      input.id = this.name;
      input.type = 'checkbox';
      input.disabled = true;
      // create the label
      const label = document.createElement('label');
      label.setAttribute('for', this.name);
      // attach these
      this.prepend(label);
      this.prepend(input);
      // set as loaded
      this.setAttribute('loaded', '');
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
      console.log(`Setting ${this.name} to ${val}`);
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
      const input = this.querySelector('input');
      if (doc.get(name)) {
        input.setAttribute('checked', '');
      } else {
        input.removeAttribute('checked');
      }
      input.removeAttribute('disabled');
    }
  },
);
