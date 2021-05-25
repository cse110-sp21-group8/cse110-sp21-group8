let form = document.querySelector('form');
let text_box = document.querySelector('#text-box1');

document.addEventListener('DOMContentLoaded', () => {

  var i; 
  for(i = 1; i<7; i++){
      var j; 
      for(j = 1; j < 32; j++){
        let name = ".whole-cal" + i;
        let cal = document.querySelector(name);
        let geth2 = name + " " +"h2";
        let text = document.querySelector(geth2).textContent;

        let classname = ".date" + i + j;
        let day = document.querySelector(classname);
        if(day != null){
            day.addEventListener('click', (event) => {
                //document.getElementById('tasks2').className="show";
                let task = document.createElement('task-list');
                text_box.append(task);
                console.log(task.shadowRoot);
                let taskInput = task.shadowRoot.querySelector('#tasks');
                let selection = task.shadowRoot.querySelector('#checklist-select');
                console.log(taskInput); 
                let prefixed = text + " " + day.innerHTML+ ": ";
                taskInput.value = prefixed;
                selection.addEventListener('change', () => {
                    if(selection.value == "Task"){
                        taskInput.value = prefixed + "● ";
                    } else if (selection.value == "Note"){
                        taskInput.value = prefixed + "- ";
                    } else {
                        taskInput.value = prefixed + "⚬ ";
                    }
                })

                taskInput.addEventListener('focusout', (event)=> {
                    if(task.isNew){
                        console.log('focus out');
                        event.preventDefault();
                        //Put task, event, note drop down men 
            
                        let content = taskInput.value;
                        let date = new Date();
                        console.log(date.toLocaleString());
                        console.log(content);
                        //type: task, events, reminders.
                        data = {status:"future",type:"task", content:content,date:date.toDateString()};
                        fetch('/addTask', {  
                            method: 'POST',
                            headers: {
                              "Content-Type": "application/json"
                            }, 
                            body: JSON.stringify(data)
                            })
                            .then(response => response.json())
                            .then(data => {
                                if(data["status"]==200){
                                    let newTask = data["task"];
                                }else{
                                    alert("Task didn't added");
                                }
                            })
                            .catch((error) => {
                            console.error('Error:', error);
                            });
                        task.isNew = false;
                    } else {
                        
                        let oldData = data;
                        let content = taskInput.value;
                        let date = new Date();
                        data = {status:"future",type:"task", content:content,date:date.toDateString()};
                        let newData = data;
                        send_data = {old:oldData, new:newData}; 
                        fetch('/updateTask', {  
                            method: 'POST',
                            headers: {
                              "Content-Type": "application/json"
                            }, 
                            body: JSON.stringify(send_data)
                            })
                            .then(response => response.json())
                            .then(data => {
                                if(data["status"]==200){
                                    let newTask = data["task"];
                                }else{
                                    alert("Task didn't added");
                                }
                            })
                            .catch((error) => {
                            console.error('Error:', error);
                        });
            
                    }

                    let deleteButton = task.shadowRoot.querySelector('#delete');

                    deleteButton.addEventListener('click', () => {
                        let index = Array.prototype.indexOf.call(text_box.children, task);
                        delete_data = data.task[index];
                        fetch('/deleteTask', {  
                            method: 'POST',
                            headers: {
                              "Content-Type": "application/json"
                            }, 
                            body: JSON.stringify(delete_data)
                            })
                            .then(response => response.json())
                            .then(data => {
                                if(data["status"]==200){
                                    let newTask = data["task"];
                                }else{
                                    alert("Task didn't added");
                                }
                            })
                            .catch((error) => {
                            console.error('Error:', error);
                        });

                        task.remove();
                    });
                });

            });
        }
      }
  }})

  //load Task:
window.onload = function(event){
    fetch('/getFutureTask', {  
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        }, 
        body: JSON.stringify({date: new Date().toDateString()})
        })
        .then(response => response.json())
        .then(data => {
            if(data["status"]==200){
                //obtains the task list
                let tasks = data["task"];
                let text_box = document.getElementById("text-box1");
                //add each task into the box
                tasks.forEach((tmp)=>{
                    
                    let task = document.createElement('task-list');
                    let taskInput = task.shadowRoot.querySelector('#tasks');
                    let taskForm = task.shadowRoot.querySelector('#form');
                    taskInput.value = tmp["content"];
                    task.isNew = false;
                    
                    if(tmp["status"] == "future"){
                        text_box.appendChild(task);
                    }
        
                    let deleteButton = task.shadowRoot.querySelector('#delete');

                    deleteButton.addEventListener('click', () => {
                        let index = Array.prototype.indexOf.call(text_box.children, task);
                        delete_data = data.task[index];
                        fetch('/deleteTask', {  
                            method: 'POST',
                            headers: {
                              "Content-Type": "application/json"
                            }, 
                            body: JSON.stringify(delete_data)
                            })
                            .then(response => response.json())
                            .then(data => {
                                if(data["status"]==200){
                                    let newTask = data["task"];
                                }else{
                                    alert("Task didn't added");
                                }
                            })
                            .catch((error) => {
                            console.error('Error:', error);
                        });

                        task.remove();
                    });

                    
                });

            }else{
                alert("Task didn't added");
            }
        })
        .catch((error) => {
        console.error('Error:', error);
        });
}