let form = document.querySelector('form');
let text_box = document.querySelector('#text-box1');
 
document.addEventListener('DOMContentLoaded', () => {

    document.addEventListener('keydown', function(e){
        if(e.key == 'Tab'){
            e.preventDefault();
            console.log("tab key pressed");
            console.log(document.activeElement.nodeName);
            if(document.activeElement.nodeName == "TASK-LIST"){
                console.log('tasklist selected and pressed tab');
                let task = document.activeElement;
                let subTask = document.createElement('task-list');
                subTask.className = 'subtask';
                subTask.task_id = task.task_id;
                subTask.isNew = true;
                subTask.isSubtask = true;
                
                task.shadowRoot.querySelector('#subtask-box').append(subTask);
                subTask.shadowRoot.querySelector('#tasks').focus();
                let selection = subTask.shadowRoot.querySelector('#checklist-select');
                let input = subTask.shadowRoot.querySelector('#tasks');
    
                selection.addEventListener('change', () => {
                    if(selection.value == "Task"){
                        input.value = "● ";
                    } else if (selection.value == "Note"){
                        input.value = "- ";
                    } else {
                        input.value = "⚬ ";
                    }
                });
                input.value = "● ";
    
    
                subTask.addEventListener('focusout', (event)=> {
                    if(subTask.isNew) {
                        let content = subTask.shadowRoot.querySelector('#tasks').value;
                        data = {status:"future",type:"task", content:content,date:date.toDateString(), task_id: task.task_id };
                        fetch('/addSubTask', {  
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
                                // alert("Task didn't added");
                                }
                            })
                            .catch((error) => {
                            console.error('Error:', error);
                        });
                        subTask.isNew = false;
                    } else { 
                        let content = subTask.shadowRoot.querySelector('#tasks').value;
                        let oldData = data;
                        newData = {status:"future",type:"task", content:content,date:date.toDateString(), task_id: task.task_id };
                        send_data = {old:oldData, new:newData}; 
                        fetch('/updateSubTask', {  
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
                                   // alert("Task didn't added");
                                }
                            })
                            .catch((error) => {
                            console.error('Error:', error);
                        });
    
                    }
                })
    
                let del = subTask.shadowRoot.querySelector('#delete');
                del.addEventListener('click',()=> { 
                    delete_data = data;
                    fetch('/deleteSubTask', {  
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
                                //alert("Task didn't added");
                            }
                        })
                        .catch((error) => {
                        console.error('Error:', error);
                    });   
                })
                
            }
        } 
       // if(document.activeElement)
    });
    
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
                                    task.task_id = data.task._id;
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
    }
})

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

                    fetch('/getSubTask', {  
                        method: 'POST',
                        headers: {
                          "Content-Type": "application/json"
                        }, 
                        body: JSON.stringify({task_id: task.task_id})
                        })
                        .then(response => response.json())
                        .then(subdata => {
                            if(subdata["status"]==200){
                                console.log(subdata);
                                let subtasks = subdata["task"];
                                subtasks.forEach((subTemp) => {
                                    let subTask = document.createElement('task-list');
                                    let subTaskInput = subTask.shadowRoot.querySelector('#tasks');
                                    let subTaskForm = subTask.shadowRoot.querySelector('#form');
                                    subTask.className = 'subtask';
                                    subTaskInput.value = subTemp.content;
                                    subTask.task_id = task.task_id;
                                    task.shadowRoot.querySelector('#subtask-box').append(subTask);
                                    subTask.isNew = false;
                                    let subDelete = subTask.shadowRoot.querySelector("#delete");


                                    subTask.isSubtask = true;
                                    //subTaskInput.value = "● ";
                                    subTaskInput.addEventListener('change', ()=>{
                                        let oldData = subTemp;
                                        newData = {status:"future",type:"task", content:content,date:date.toDateString(), task_id: subTask.task_id };
                                        send_data = {old:oldData, new:newData}; 
                                        fetch('/updateSubTask', {  
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
                                                   // alert("Task didn't added");
                                                }
                                            })
                                            .catch((error) => {
                                            console.error('Error:', error);
                                        });
                                    });
                        
                                    subTaskForm.addEventListener('submit', (event) => {
                                        event.preventDefault();
                                        //update task gere in backend
                                        document.activeElement.blur();                     
                                    })

                                    subDelete.addEventListener('click',() => {
                                        delete_data = subTemp;
                                        fetch('/deleteSubTask', {  
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
                                                    //alert("Task didn't added");
                                                }
                                            })
                                            .catch((error) => {
                                            console.error('Error:', error);
                                        });

                                        subTask.remove();

                                    })
                                    
                                })
                            }
                        })
                });

            }else{
                alert("Task didn't added");
            }
        })
        .catch((error) => {
        console.error('Error:', error);
    });
}