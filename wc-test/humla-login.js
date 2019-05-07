import firebase from './firebase.js';

const views = {
  loading: () => /* html */ `
  <style>
    main {
      display: flex;
      height: 100vh;
      align-items: center;
      justify-content: center;
    }
  </style>
  <main state="loading">
  Loading...
  </main>`,
  out: () => /* html */ `
  <style>
    main {
      display: flex;
      height: 100vh;
      align-items: center;
      justify-content: center;
    }
  </style>
  <main state="out">
  <button id="btn">Hello</button>
  </main>
  `,
  in: element => /* html */ `
    <main state="in">
    <${element}></${element}>
    </main>
    `,
};
const template = document.createElement('template');
template.innerHTML = views.loading();

window.customElements.define(
  'humla-login',
  class extends HTMLElement {
    /**
     * @param view {string}
     */
    setView(view) {
      console.log('Setting view', view);
      this.shadowRoot.innerHTML = views[view](this.getAttribute('logged-in'));
      if (view === 'out') {
        const btn = this.shadowRoot.querySelector('#btn');
        btn.addEventListener('click', () => {
          const provider = new firebase.auth.GoogleAuthProvider();
          firebase
            .auth()
            .signInWithPopup(provider)
            .then((result) => {
              // The signed-in user info.
              console.log(result.user);
            })
            .catch((error) => {
              console.error(error);
            });
        });
      }
    }

    constructor() {
      super();
      // Attach a shadow root to the element.
      const shadowRoot = this.attachShadow({ mode: 'open' });
      shadowRoot.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          console.log('Logged in', user.email, user.uid);
          this.setView('in');
        } else {
          console.log('Logged out');
          this.setView('out');
        }
      });
    }
  },
);
