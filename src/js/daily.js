let addButton = document.querySelector('#add span');
let text_box = document.querySelector('#text-box');
let reflect_btn = document.querySelector('#add-reflection');


addButton.addEventListener('click', ()=> {
    console.log('click')
    let task = document.createElement('task-list')
    text_box.prepend(task);
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
            data = {status:"daily",type:"task", content:content,date:date.toDateString()};
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
            data = {status:"daily",type:"task", content:content,date:date.toDateString()};
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
            data = {status:"daily",type:"task", content:content,date:date.toDateString()};
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
            // Update Log Code here
        }
        document.activeElement.blur();
    });

    let deleteButton = task.shadowRoot.querySelector('#delete');

    deleteButton.addEventListener('click', () => {
        //task.remove();
        // delete back end code here      
         let index = Array.prototype.indexOf.call(text_box.children, task);
         if(typeof(data.task) === 'undefined'){
             delete_data = data;
         } else {
            delete_data = data.task[index];
         }

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

    taskInput.focus();
})


let form = document.querySelector('form');


//load Task:
window.onload = function(event){
    fetch('/getDailyTask', {  
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
                let text_box = document.getElementById("text-box");
                //add each task into the box
                tasks.forEach((tmp)=>{
                    if (tmp["type"] === "task") {
                        console.log(tmp);
                        let task = document.createElement('task-list');
                        let taskInput = task.shadowRoot.querySelector('#tasks');
                        let taskForm = task.shadowRoot.querySelector('#form');
                        taskInput.value = tmp["content"];
                        task.isNew = false;

                        taskInput.addEventListener('focusout', (event)=> {
                            event.preventDefault();
                            //update task code here
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
                    }
                });

            }else{
                alert("Task didn't added");
            }
        })
        .catch((error) => {
        console.error('Error:', error);
        });

    //load reflection
    fetch('/getDailyTask', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({date: new Date().toDateString()})
    })
    .then(response => response.json())
    .then(data => {
        if(data["status"]  == 200) {
            let tasks = data["task"];
            let content = document.getElementById("reflection-content");
    
            tasks.forEach((tmp) => {
                if (tmp["type"] === "reflection") {
                    content.append(tmp["content"]);
                }
            });
            if (document.getElementById("reflection-content").innerHTML.length > 0) {
                document.getElementById("add-reflection").disabled = true;
            }
        }
    });
}

reflect_btn.addEventListener('click', (event) => {
    const content = document.getElementById('reflection').value;
    document.getElementById('reflection-content').append(content);

    event.preventDefault();

    let date = new Date();
    data = { content: content, date: date.toDateString(), type: "reflection" };
    console.log(data);
    fetch('/addDailyTask', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if(data["status"] == 200) {
            let newReflection = data["reflection"];
        }
        else {
            alert("Reflection didn't add");
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
    if (document.getElementById("reflection-content").innerHTML.length > 0) {
        document.getElementById("add-reflection").disabled = true;
    }
});













//add tasks:
// form.addEventListener('submit', (event)=>{
//     event.preventDefault();
//     let content = document.getElementById('tasks').value;
//     let date = new Date();
//     console.log(date.toLocaleString());
//     console.log(content);
//     //type: task, events, reminders.
//     data = {status:"daily",type:"task", content:content,date:date.toDateString()};
//     fetch('/addTask', {  
//         method: 'POST',
//         headers: {
//           "Content-Type": "application/json"
//         }, 
//         body: JSON.stringify(data)
//         })
//         .then(response => response.json())
//         .then(data => {
//             if(data["status"]==200){
//                 let newTask = data["task"];
                
//                 //added component to the html
//                 let text_box = document.getElementById("text-box");
//                 let item = document.createElement('div');
//                 item.innerText = newTask["content"];
//                 text_box.appendChild(item);


//             }else{
//                 alert("Task didn't added");
//             }
//         })
//         .catch((error) => {
//         console.error('Error:', error);
//         });
//     form.reset();
// });

