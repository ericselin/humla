import firebase from '../lib/firebase.js';

window.customElements.define(
  'ha-login',
  class extends HTMLElement {
    addLoginButtonListener() {
      const btn = this.shadowRoot.querySelector('button');
      btn.addEventListener('click', () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase
          .auth()
          .signInWithPopup(provider)
          .then(result => {
            // The signed-in user info.
            console.log(result.user);
          })
          .catch(error => {
            console.error(error);
          });
      });
    }

    connectedCallback() {
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          console.log('Logged in', user.email, user.uid);
          this.setView('in');
        } else {
          console.log('Logged out');
          this.setView('out');
        }
      });
    }

    /**
     * @param {string} view
     */
    async setView(view) {
      this.querySelectorAll(':scope > main').forEach(el => {
        el.removeAttribute('active');
      });
      const active = this.querySelector(`main[state=${view}]`);

      if (active.hasAttribute('import')) {
        await import(active.getAttribute('import'));
      }

      active.setAttribute('active', '');
    }
  },
);
