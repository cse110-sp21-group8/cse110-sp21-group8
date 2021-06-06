class TaskList extends HTMLElement {
  constructor() {
    super();
    const template = document.createElement('template');
    template.innerHTML = `
    <style>
      .entry {
        display: grid;
        grid-template-columns: 25% 75%;
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
      <button id="delete" >delete</button>
        <form id='form'>
          <input type="text" id="tasks" size="100" placeholder="Click to add tasks!"><br>
        </form>
      </div>
      <div class="break"></div> 
      <div id="subtask-box">
      </div>
    </div>
    `;
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  isNew = true; 
  task_id = '';

  /*set isSubtask(value){
    this.shadowRoot.querySelector('#tag-select').style.display = 'none';
    console.log(this.shadowRoot.querySelector('#tag-select'));
  }*/
}
customElements.define('task-list', TaskList);