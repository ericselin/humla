const template = document.createElement('template');
template.innerHTML = /* html */ `
<style>
  main {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  [state=in] {
    display: none;
  }
  [state=out] {
    display: none;
  }
</style>
<main state="out">
  <button id="btn">Hello</button>
</main>
<main state="in">
  <slot></slot>
</main>
<main state="loading">
  Loading...
</main>
`;

const { firebase } = window;

window.customElements.define(
  'humla-login',
  class extends HTMLElement {
    /**
     * @param view {string}
     */
    setView(view) {
      this.shadowRoot.querySelectorAll('[state]').forEach((/** @type {HTMLElement} */ element) => {
        // eslint-disable-next-line no-param-reassign
        element.style.display = element.getAttribute('state') === view ? 'block' : 'none';
      });
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

      const btn = this.shadowRoot.querySelector('#btn');
      btn.addEventListener('click', () => {
        const provider = new window.firebase.auth.GoogleAuthProvider();
        window.firebase
          .auth()
          .signInWithPopup(provider)
          .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            console.log(result.credential.accessToken);
            // The signed-in user info.
            console.log(result.user);
          })
          .catch((error) => {
            console.error(error);
          });
      });
    }
  },
);
