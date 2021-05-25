let addButton = document.querySelector('#add span');
let text_box = document.querySelector('#text-box');


var i;
for(i = 1; i < 5; i++){
    let calendar = document.querySelector('#week-day' + i);
    let num = document.querySelector('#week-num'+i);
    var j; 
    for(j = 0; j < 7; j++){
        let day = calendar.children[j];
        let appendArea = num.children[j];
        day.addEventListener('click', () => {
            let appendId = num.id;
            let index = Array.prototype.indexOf.call(day.parentElement.children, day);
            let tagContent = appendId + "_" + index;

            let box = document.createElement('input');
            let del = document.createElement('button');
            box.type = "input";
            box.className = "append";
            appendArea.appendChild(box);
            appendArea.appendChild(del);
            box.isNew = true;
            box.addEventListener('focusout', (event)=> {
                if(box.isNew){
                    event.preventDefault();
                    //Put task, event, note drop down men 
                    let content = box.value;
                    let date = new Date();
                    console.log(date.toLocaleString());
                    
                    //type: task, events, reminders.
                    data = {status:"monthly", type:"note", content:content, date:date.getMonth(), tag: tagContent};
                    console.log(date.getMonth());
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
                                alert("Goal didn't add");
                            }
                        })
                        .catch((error) => {
                        console.error('Error:', error);
                        });
                    box.isNew = false;
                } else {
                    let oldData = data;
                    let content = box.value;
                    let date = new Date();
                    data = {status:"monthly",type:"note", content:content,date:date.getMonth(), tag: tagContent};
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
                                alert("Goal didn't add");
                            }
                        })
                        .catch((error) => {
                        console.error('Error:', error);
                    });
               }
               
            });

        })
    }
}



addButton.addEventListener('click', ()=> {
    console.log('click')
    let task = document.createElement('task-list')
    text_box.append(task);
    console.log(task.shadowRoot);
    let taskInput = task.shadowRoot.querySelector('#tasks');
    let selection = task.shadowRoot.querySelector('#checklist-select');
    console.log(taskInput); 
    selection.addEventListener('change', () => { 
        if(selection.value == "Task"){
            taskInput.value = "● ";
        } else if (selection.value == "Note"){
            taskInput.value = "- ";
        } else {
            taskInput.value = "⚬ ";
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
            data = {status:"monthly", type:"goal", content:content, date:date.getMonth()};
            console.log(date.getMonth());
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
                        alert("Goal didn't add");
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
            data = {status:"monthly",type:"goal", content:content,date:date.getMonth()};
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
                        alert("Goal didn't add");
                    }
                })
                .catch((error) => {
                console.error('Error:', error);
            });
        }
    });
    let taskForm = task.shadowRoot.querySelector('#form');
    taskForm.addEventListener('submit', (event)=>{
        event.preventDefault();
        if(task.isNew){
            console.log('focus out');
            //Put task, event, note drop down menu
            let content = taskInput.value;
            let date = new Date();
            console.log(date.toLocaleString());
            console.log(content);
            //type: task, events, reminders.
            data = {status:"monthly", type:"goal", content:content,date:date.getMonth()};
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
            data = {status:"monthly",type:"goal", content:content,date:date.getMonth()};
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
        document.activeElement.blur();
    });
});

let form = document.querySelector('form');
//load Task:
window.onload = function() {
    console.log("testlog");
    //ask about this later
    fetch('/getMonthlyTask', {  
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        }, 
        body: JSON.stringify({date:date.getMonth().toString()})
        })
        .then(response => response.json())
        .then(data => {
            console.log("get monthly data:",data);
            if(data["status"]==200){
                //obtains the task list
                console.log(data);
                let tasks = data["task"];
                let text_box = document.getElementById("text-box");
                //add each task into the box            
                tasks.forEach((tmp)=>{
                    if(tmp["type"] == "goal"){
                        let task = document.createElement('task-list');
                        let taskInput = task.shadowRoot.querySelector('#tasks');
                        let taskForm = task.shadowRoot.querySelector('#form');     
                        taskInput.value = tmp["content"];
                        task.isNew = false;
                        let selection = task.shadowRoot.querySelector('#checklist-select');
                        console.log(taskInput); 
                    
                        selection.addEventListener('change', () => {
                            if(selection.value == "Task"){
                                taskInput.value = "● ";
                            } else if (selection.value == "Note"){
                                taskInput.value = "- ";
                            } else {
                                taskInput.value = "⚬ ";
                            }
                        })

                        taskInput.addEventListener('focusout', (event)=> {
                            event.preventDefault();
                            let index = Array.prototype.indexOf.call(text_box.children, task);
                            let oldData = data.task[index];
                            let content = taskInput.value;
                            let date = new Date();
                            let newData = {status:"monthly", type:"goal", content:content,date:date.getMonth()};
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

                        });
                        taskForm.addEventListener('submit', (event)=>{
                            event.preventDefault();
                            //update task code here
                            document.activeElement.blur();
                        })
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
                        text_box.appendChild(task);
                    } else { 
                        let note = document.createElement('input');
                        note.type =  "text"; 
                        note.className = "append";
                        note.value = tmp['content']; 
                        let info = tmp['tag'].split("_");
                        let numId = "#" + info[0];
                        let appendNum = document.querySelector(numId).children[info[1]]; 
                        appendNum.append(note);
                    }
                });
                
            }else{
                alert("Task didn't added");
            }
        })
        .catch((error) => {
        console.error('Error:', error);
        });
};
