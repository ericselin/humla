import { isAuth, signIn, signOut } from '../lib/auth.js';

export default class HaLogin extends HTMLElement {
  showLogin() {
    /** @type {import('./ha-overlay').default} */
    const overlay = this.closest('ha-overlay');
    overlay.open = true;
    this.querySelector('button').addEventListener('click', async () => {
      await signIn();
      overlay.open = false;
    });
  }

  async navigation(evt) {
    if (evt.detail.path === '/logout') {
      await signOut();
      this.showLogin();
    }
  }

  async connectedCallback() {
    // add logout navigation listener
    window.addEventListener('navigate', this.navigation.bind(this));
    // check for auth and show login accordingly
    const auth = await isAuth();
    if (!auth) {
      this.showLogin();
    }
  }
}
HaLogin.elementName = 'ha-login';
