const formatTitle = title => title.replace(/^(.*)$/gm, '<div>$1</div>');

export default class Title extends HTMLElement {
  static get observedAttributes() {
    return ['open'];
  }

  get open() {
    return this.hasAttribute('open');
  }

  set open(val) {
    if (val) this.setAttribute('open', '');
    else this.removeAttribute('open');
  }

  attributeChangedCallback(name) {
    if (name === 'open') {
      this.contentEditable = this.open.toString();
    }
  }

  get innerText() {
    return Array.from(this.children)
      .map(el => el.textContent)
      .join('\n');
  }

  set innerText(title) {
    this.innerHTML = formatTitle(title);
  }

  connectedCallback() {
    this.innerHTML = formatTitle(this.innerHTML);
  }
}

window.customElements.define('ha-title', Title);
