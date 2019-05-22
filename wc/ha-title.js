const formatTitle = title => (title ? title.replace(/^(.*)$/gm, '<div>$1</div>') : '');

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

  get innerText() {
    return Array.from(this.childNodes)
      .map((el) => {
        // if this is a text node, trim and include only if contains text
        if (el.nodeType === el.TEXT_NODE) {
          const line = el.textContent.trim();
          return line || undefined;
        }
        return el.textContent;
      })
      .filter(l => typeof l !== 'undefined')
      .join('\n');
  }

  set innerText(title) {
    this.innerHTML = formatTitle(title);
  }

  connectedCallback() {
    this.innerHTML = formatTitle(this.innerHTML);
    this.contentEditable = 'true';
  }
}

window.customElements.define('ha-title', Title);
