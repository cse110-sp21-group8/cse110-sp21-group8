class TaskList extends HTMLElement {
  constructor() {
    super();
    const template = document.createElement('template');
    template.innerHTML = `
    <style>
      .entry {
        display: grid;
        grid-template-columns: 20% 20% auto;
        width: 100%;
      }
      #text-box {
        width: 100%;
      }
      #form {
        display: grid;
        grid-template-columns: 10% 10% 10% auto;
      }
      #tag-select {

      }
    </style>
    <div class="entry">
      <select name="Checklist Category" id="checklist-select">
        <option value="">--Please choose an option--</option>
        <option value="Task"> Task </option>
        <option value="Event"> Event </option>
        <option value="Note"> Note </option>
      </select>
      <select name="Tags" id="tag-select">
        <option value="">--Please choose an option--</option>
        <option value="Important"> Important </option>
        <option value="Later"> Later </option>
        <option value="Interesting"> Interesting </option>
      </select>
      <div id="text-box">
        <form id='form'>
          <button id="status"></button>
          <button id="delete"></button>
          <button id="move"></button>
          <input type="text" id="tasks" placeholder="Click to add tasks!"><br>
        </form>
      </div>
      <div id="subtask-box">
      </div>
    </div>
    `;
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  isNew = true; 
  task_id = '';
}
customElements.define('task-list', TaskList);