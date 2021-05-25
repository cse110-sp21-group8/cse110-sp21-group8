class TaskList extends HTMLElement {
  constructor() {
    super();
    const template = document.createElement('template');
    template.innerHTML = `
    <style>
      .entry {
        display: grid;
        grid-template-columns: 25% auto;
        width: 100%;
      }
      #text-box {
        width: 100%;
      }
      #form {
        display: grid;
        grid-template-columns: 10% 10% 10% auto;
      }
    </style>
    <div class="entry">
      <select name="Checklist Category" id="checklist-select">
        <option value="">--Please choose an option--</option>
        <option value="Task"> Task </option>
        <option value="Event"> Event </option>
        <option value="Note"> Note </option>
      </select>
      <div id="text-box">
        <form id='form'>
        <button id="delete" >delete</button>
          <input type="text" id="tasks" size="100" placeholder="Click to add tasks!"><br>
        </form>
      </div>
    </div>
    `;
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  isNew = true; 
}
customElements.define('task-list', TaskList);