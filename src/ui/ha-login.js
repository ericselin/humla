import { isAuth, signIn } from '../lib/auth.js';

export default class HaLogin extends HTMLElement {
  async connectedCallback() {
    const auth = await isAuth();
    if (!auth) {
      /** @type {import('./ha-overlay').default} */
      const overlay = this.closest('ha-overlay');
      overlay.open = true;
      this.querySelector('button').addEventListener('click', async () => {
        await signIn();
        overlay.open = false;
      });
    }
  }
}
HaLogin.elementName = 'ha-login';
