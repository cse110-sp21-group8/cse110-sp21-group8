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
        <option value="Important">Important</option>
        <option value="Later">Later</option>
        <option value="Interesting">Interesting</option>
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
    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.isNew = true;
    this.task_id = '';
    this.task_tag = '';
    this.task_date = '';

    this.status = 1;

    this.shadowRoot.querySelector('#status').addEventListener('click', () => {
      this.changeStatus();
    });
  }

  set isSubtask(value) {
    this.shadowRoot.querySelector('#tag-select').style.display = 'none';
  }

  set status(value) {
    this._status = value;
    if (value == 1) {
      this.shadowRoot.querySelector('#status').innerHTML = '\u26AA';
    } else if (value == 2) {
      this.shadowRoot.querySelector('#status').innerHTML = '\u{1F7E1}';
    } else if (value == 3) {
      this.shadowRoot.querySelector('#status').innerHTML = '\u{1F7E2}';
    }
  }

  get status() {
    return this._status;
  }

  changeStatus() {
    if (this._status < 3) {
      this.status = this.status + 1;
    } else {
      this.status = 1;
    }
  }
}
customElements.define('task-list', TaskList);
