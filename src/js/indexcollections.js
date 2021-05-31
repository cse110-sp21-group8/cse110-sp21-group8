class TagButtons extends HTMLElement {
  constructor() {
    super();
    const template = document.createElement('template');
    template.innerHTML = `
    <style> 
      #tag{
        background: #f8f5f1;
        border-bottom-left-radius: 50px;
        border-bottom-right-radius: 50px;
      }
    </style> 
    <div id="tag">
    </div>
    `;
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

}
customElements.define('tag-buttons', TagButtons);