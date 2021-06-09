class CustomTag extends HTMLElement {
  constructor() {
    super();
    const template = document.createElement('template');
    template.innerHTML = `
    <style> 
    </style> 

    <div> 
      <form id="custom-form">
        <button id="submit"> Submit </button>
        <button id="delete"> Delete </button>
        <input type="text" id="custom-tags" placeholder="Click to add your own tags!"><br>
      </form>
    </div>

    `;
    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}
customElements.define('custom-tag', CustomTag);
