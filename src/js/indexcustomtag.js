class ShowTag extends HTMLElement {
  constructor() {
    super();
    const template = document.createElement('template');
    template.innerHTML = `
    <style> 
      background: #f8f5f1;
      border-bottom-left-radius: 50px;
      border-bottom-right-radius: 50px;
    </style> 
    <task-list></task-list>
    `;
    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}
customElements.define('show-tag', ShowTag);
