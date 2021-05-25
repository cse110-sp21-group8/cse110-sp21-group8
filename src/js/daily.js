let addButton = document.querySelector('#add span');
let text_box = document.querySelector('#text-box');

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
            task.after(subTask);
            subTask.shadowRoot.querySelector('#tasks').focus();
        }
        console.log(document.activeElement);
    } 
   // if(document.activeElement)
});

addButton.addEventListener('click', ()=> {
    console.log('click')
    let task = document.createElement('task-list');
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

    taskInput.addEventListener('change', (event)=> {
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
                       // alert("Task didn't added");
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
                       // alert("Task didn't added");
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
                       // alert("Task didn't added");
                    }
                })
                .catch((error) => {
                console.error('Error:', error);
            });
        }
        document.activeElement.blur();
    });

    /*
    let deleteButton = task.shadowRoot.querySelector('#delete');

    deleteButton.addEventListener('click', () => {
              
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
        
    });*/

    taskInput.focus();
})


let form = document.querySelector('form');


//load Task:
window.onload = function(event){

    //added by Jinhao Zhou
    //get the user image of that day
    fetch('/getImg', {  
        method: 'GET',
        headers: {
          "Content-Type": "application/json"
        }
        })
        .then(response => response.json())
        .then(data => {
            if(data["status"]==200){
                let image = document.querySelector(".tracker-image");
                image.src = data["src"];
            }else{
                alert("no image data exist");
            }
        })
        .catch((error) => {
        console.error('Error:', error);
    });


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
                    console.log(tmp);
                    let task = document.createElement('task-list');
                    let taskInput = task.shadowRoot.querySelector('#tasks');
                    let taskForm = task.shadowRoot.querySelector('#form');
                    taskInput.value = tmp["content"];
                    task.isNew = false;
                    text_box.append(task);

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

                    taskInput.addEventListener('change', (event)=> {
                        event.preventDefault();
                        let index = Array.prototype.indexOf.call(text_box.children, task);
                        let oldData = data.task[index];
                        let content = taskInput.value;
                        let date = new Date();
                        let newData = {status:"daily", type:"task", content:content,date:date.toDateString()};
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
                                    //alert("Task didn't added");
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
                        console.log(data);
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
                                    //alert("Task didn't added");
                                }
                            })
                            .catch((error) => {
                            console.error('Error:', error);
                        });

                        task.remove();
                    });
                    
                });

            }else{
                //alert("Task didn't added");
            }
        })
        .catch((error) => {
        console.error('Error:', error);
        });

    //fetch data for daily reflection here
        //change the value of reflection.value = to the saved data
        //set isReflectionNew = false;
    
}
//upload picture:
let upload = document.getElementById('tracker-form');
upload.addEventListener("submit", (event)=>{
    event.preventDefault();
    
    let input = document.querySelector('input[type="file"]')
    let data = new FormData()
    data.append('file-to-upload', input.files[0]);

    fetch('/uploadImg', {
    method: 'POST',
    body: data
    }).then(response => response.json())
    .then(data => {
        if(data["status"]==200){
            let image = document.querySelector(".tracker-image");
            image.src = data["src"];
        }
    })
    .catch((error) => {
    console.error('Error:', error);
    });
    
});


//reflection section
let reflection = document.getElementById('reflection');
let reflectionForm = document.querySelector('#reflect-box form')
let isReflectionNew = true;

reflection.addEventListener('change', ()=> {
    if(isReflectionNew == true){
        //create new reflection on back end
        console.log('reflection created by change');
        isReflectionNew = false;
    } else {
        //update reflection on back end 
        console.log('reflection updated by change');
    }
})





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

