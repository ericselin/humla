export default class HaHeading extends HTMLElement {
  connectedCallback() {
    window.addEventListener('navigate', (e) => {
      // @ts-ignore
      this.textContent = e.detail.title;
    });
  }
}
HaHeading.elementName = 'ha-heading';
