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

/* Custom Tag */ 
document.addEventListener('click', function(e) {
  if(document.activeElement.nodeName == "TASK-LIST"){
    let selectedTask = document.activeElement;
    let tagType = selectedTask.shadowRoot.querySelector('#tag-select').value;
    selectedTask.task_tag = tagType;  
  }
});
/* */ 

addButton.addEventListener('click', ()=> {
    console.log('click')
    let task = document.createElement('task-list');
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
                        //alert("Task didn't added");
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
                        //("Task didn't added");
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
                       // alert("Task didn't added");
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
         console.log(task);    
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
                   // alert("Task didn't added");
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
                              // alert("Task didn't added");
                          }
                      })
                      .catch((error) => {
                      console.error('Error:', error);
                  });

                  task.remove();
              });
              if(tmp["status"] == "daily" && tmp["type"] != "reflection"){
                  text_box.append(task);
              }
              
          })

      }else{
          // alert("Task didn't added");
      }

      /* Custom Tag */ 
      let tmp = data["task"][0];
      let task = document.createElement('task-list');
      let taskInput = task.shadowRoot.querySelector('#tasks');
      taskInput.value = tmp["content"];
      let tagOpts = task.shadowRoot.querySelector('#tag-select').options;
      let buttonDiv = document.getElementById('tag-button');
      for (let i = 1; i < tagOpts.length; i++){
        let button = document.createElement('button');
        button.type = "button";
        button.innerHTML = tagOpts[i].innerHTML;
        button.value = tagOpts[i].innerHTML;
        buttonDiv.appendChild(button);
        button.addEventListener('click', () => {
          let collections = document.getElementById('tag-button');
          while (collections.firstChild) {
            collections.removeChild(collections.firstChild);
          }
          collections.className = 'show-tag';

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
              tasks.forEach((tmp)=>{
                if(tmp.tag == button.value){
                  let task = document.createElement('task-list');
                  let taskInput = task.shadowRoot.querySelector('#tasks');
                  let taskForm = task.shadowRoot.querySelector('#form');
                  let tag = task.shadowRoot.querySelector('#tag-select');
                  task.task_id = tmp._id;
                  taskInput.value = tmp["content"];
                  task.isNew = false;

                  //Load in the right tag
                  console.log(tmp.tag);
                  for(let i = 1; i < tag.options.length; i++){
                    if(tag.options[i].value == tmp.tag){
                      tag.selectedIndex = `${i}`;
                    }
                  }

                  //Load in the right task type
                  let taskType = task.shadowRoot.querySelector('#checklist-select');
                  for(let i = 1; i < taskType.options.length; i++){
                    if(taskType.options[i].value == tmp.type){
                      taskType.selectedIndex = `${i}`;
                    }
                  }
                  collections.append(task);
                }
              }); 
            }
          });

          //});
        })
      }

      //Go Back to Collections
      let header = document.getElementById('collect-h');
      header.addEventListener('click', () => {
        let collections = document.getElementById('tag-button');
        while (collections.firstChild) {
          collections.removeChild(collections.firstChild);
        }
        collections.className = 'widget-content';
        for (let i = 1; i < tagOpts.length; i++){
          let button = document.createElement('button');
          button.type = "button";
          button.innerHTML = tagOpts[i].innerHTML;
          button.value = tagOpts[i].innerHTML;
          buttonDiv.appendChild(button);
        }
      });
      /* */
    })
    .catch((error) => {
      console.error('Error:', error);
    });
};

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

