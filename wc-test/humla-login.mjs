const template = document.createElement('template');
template.innerHTML = /* html */ `
<button id="btn">Hello</button>
`;

window.customElements.define(
  'humla-login',
  class extends HTMLElement {
    constructor() {
      super(); // always call super() first in the constructor.

      // Attach a shadow root to the element.
      const shadowRoot = this.attachShadow({ mode: 'open' });
      shadowRoot.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {
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
