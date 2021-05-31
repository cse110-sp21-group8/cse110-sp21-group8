class TaskList extends HTMLElement {
  constructor() {
    super();
    const template = document.createElement('template');
    template.innerHTML = `
    <style>
      .entry {
        display: flex;
        width: 100%;
        flex-wrap: wrap;
        align-items: center;
      }
      #text-box {
        flex-grow: 3;
      }
      #form {
        display: flex;
        align-items: center;
      }
      #tag-select {

      }
      #checklist-select {

      }
      #text-box button{
        background: none;
        border: none;
        height: 100%;
        padding: .5rem;
        font-size: medium;
        border-box
      }

      #text-box button:hover{
        background: grey;
        border: none;
      }

      #subtask-box {
        width:100%
      }

      #tasks {
        flex-grow: 3;
        border: none;
        font-size: medium;
        padding-left:1rem;
      }

      #tasks:hover {
        background: lightgrey;
        border: black;
      }

      .break {
        flex-basis: 100%;
        height: 0;
      }

      #subtask-box {
        padding-left: 2rem;
      }

    </style>
    <div class="entry">
      <select name="Checklist Category" id="checklist-select">
        <option value="Task"> Task </option>
        <option value="Event"> Event </option>
        <option value="Note"> Note </option>
      </select>
      <select name="Tags" id="tag-select">
        <option value="">Tag</option>
        <option value="Important"> Important </option>
        <option value="Later"> Later </option>
        <option value="Interesting"> Interesting </option>
      </select>
      <div id="text-box">
        <form id='form'>
          <button id="status">\u26AA</button>
          <button id="delete">\u274C</button>
          <button id="move">\u27A1\uFE0F</button>
          <input type="text" id="tasks" placeholder="Click to add tasks!"><br>
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
  task_tag = '';

  set isSubtask(value){
    this.shadowRoot.querySelector('#tag-select').style.display = 'none';
    console.log(this.shadowRoot.querySelector('#tag-select'));
  }
}
customElements.define('task-list', TaskList);