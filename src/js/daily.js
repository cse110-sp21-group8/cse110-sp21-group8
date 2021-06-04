let addButton = document.querySelector('#add span');
let text_box = document.querySelector('#text-box');
let reflect_btn = document.querySelector('#add-reflection');


/* Custom Tag Script */ 
let addTagButton = document.getElementById('add-tag').firstElementChild;
let tagTracker = document.getElementById('tracker-box');

let customTag;
let customForm;
let customInput;
let newTag = false;

addTagButton.addEventListener('click', ()=>{
  customTag = document.createElement('custom-tag');
  tagTracker.appendChild(customTag);

  customForm = customTag.shadowRoot.getElementById('custom-form'); 
  let customSubmit = customTag.shadowRoot.getElementById('submit');
  customInput = customTag.shadowRoot.querySelector("#custom-tags");
  customSubmit.addEventListener('click', (event) =>{
    event.preventDefault();
    newTag = true;
    customTag.id = customInput.value;
    let tagList = document.getElementById('text-box').childNodes;
    
    for(let i = 1; i < tagList.length; i++){
      newTag = false;
      let choices = new Option(`${customTag.id}`, `${customTag.id}`);
      if(tagList[i].nodeName == "TASK-LIST"){
        tagList[i].shadowRoot.getElementById('tag-select').add(choices);
      }
    }
  });

});

let selectedTask;
document.addEventListener('click', (event) => {
  selectedTask = event.path[0];
  selectedTask.addEventListener('focusout', () => {
    if(selectedTask.id == "tag-select"){
      console.log("hola");
      let tagType = selectedTask.value;
      selectedTask.task_tag = tagType;
      

      let parentTask = selectedTask.parentElement.querySelector('#tasks');
      let oldData = {status:"daily",type:"task", content:parentTask.value,date:parentTask.date};
      let content = parentTask.value;
      let date = new Date();
      data = {status:"daily",type:"task", content:content,date:date.toDateString(), tag:selectedTask.task_tag};
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
                  console.log(newTask);
              }else{
                  // alert("Task didn't added");
              }
          })
          .catch((error) => {
          console.error('Error:', error);
      });
    }
  })
});

/* */


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
                    change = "● ";
                } else if (selection.value == "Note"){
                    input.value = "- ";
                    change = "- ";
                } else {
                    input.value = "⚬ ";
                    change = "⚬ ";
                }
            });
            input.value = "● ";


            subTask.addEventListener('focusout', (event)=> {
                if(subTask.isNew) {
                    let content = subTask.shadowRoot.querySelector('#tasks').value;
                    data = {status:"daily",type:"task", content:content,date:date.toDateString(), task_id: task.task_id };
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
                    newData = {status:"daily",type:"task", content:content,date:date.toDateString(), task_id: task.task_id };
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

            let deleteButton = task.shadowRoot.querySelector('#delete');

            deleteButton.addEventListener('click', () => {
                delete_data = data;
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
            })
  
        }
  
    } 
   // if(document.activeElement)
});

addButton.addEventListener('click', ()=> {
    console.log('click')
    let task = document.createElement('task-list');

    /* Custom Tag Script */ 
    let tagList = document.getElementById('text-box').childNodes;
    if(tagList[0] && tagList[0].nodeName == "TASK-LIST"){
      let opts = tagList[0].shadowRoot.getElementById('tag-select').options;

      for(let i = 4; i < opts.length; i++){
        let choices = new Option(`${opts[i].value}`, `${opts[i].value}`);
        task.shadowRoot.getElementById('tag-select').add(choices);
      }

      if(newTag == true){
        let tagList = document.getElementById('text-box').childNodes;

        for(let i = 1; i < tagList.length; i++){
          newTag = false;
          let choices = new Option(`${customTag.id}`, `${customTag.id}`);
          if(tagList[i].nodeName == "TASK-LIST"){
            tagList[i].shadowRoot.getElementById('tag-select').add(choices);
          }
        }
      }
    }
    else {
      if(customTag != null){
        let choices = new Option(`${customTag.id}`, `${customTag.id}`);
        task.shadowRoot.getElementById('tag-select').add(choices);
      }
    }
   /* */

    //adding task to document
    text_box.append(task);

    //elements of task 
    let taskInput = task.shadowRoot.querySelector('#tasks');
    taskInput.value = "● ";

    let selection = task.shadowRoot.querySelector('#checklist-select');
    let change;
    console.log(taskInput); 

    selection.addEventListener('change', () => {
        if(selection.value == "Task"){
            taskInput.value = "● ";
            change = "● ";
        } else if (selection.value == "Note"){
            taskInput.value = "- ";
            change = "- ";
        } else {
            taskInput.value = "⚬ ";
            change = "⚬ ";
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
                    task.date = data.date;
                    task.task_id = data.task._id;
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


    let deleteButton = task.shadowRoot.querySelector('#delete');

    deleteButton.addEventListener('click', () => {
        delete_data = data;
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
                let subtasks = subdata["task"];
                subtasks.forEach((subTemp) => {
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
                    
                })

             } 
        })


    });

    taskInput.focus();
    
})


let form = document.querySelector('form');
let isReflectionNew = true;


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
                console.log(tasks);
                let text_box = document.getElementById("text-box");
                //add each task into the box
                tasks.forEach((tmp)=>{
                    // skip reflections
                    if (tmp["type"] === "reflection") {
                        return;
                    }
                    console.log(tmp);
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

                    //fixed bug where future and monthly tasks were getting mixed up
                    if(tmp["status"] == "daily"){
                        text_box.append(task);
                    }


                    let selection = task.shadowRoot.querySelector('#checklist-select');
                    console.log(taskInput); 
                
                    let change;
                    selection.addEventListener('change', () => {
                        if(selection.value == "Task"){
                            taskInput.value = "● ";
                            change = "● ";
                        } else if (selection.value == "Note"){
                            taskInput.value = "- ";
                            change = "- ";
                        } else {
                            taskInput.value = "⚬ ";
                            change = "⚬ ";
                        }

                        //Update the task type
                        /*let index = Array.prototype.indexOf.call(text_box.children, task);
                        let oldData = data.task[index];
                        //let inputArr = taskInput.value.split(" ");
                        taskInput.value[0] = change;
                        let content = taskInput.value; //.replace(inputArr[0], change);
                        let date = new Date();
                        //TODO: fix the bug that content isnt fully showing
                        let newData = {status:"daily", type:`${selection.value}`, content:content,date:date.toDateString()};
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
                        });*/
                    })

                    taskInput.addEventListener('change', (event)=> {
                        event.preventDefault();
                        let index = Array.prototype.indexOf.call(text_box.children, task);
                        let oldData = data.task[index];
                        let content = taskInput.value;
                        let date = new Date();
                        let newData = {status:"daily", type:`${selection.value}`, content:content,date:date.toDateString()};
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
                                    //alert("Task didn't added");
                                }
                            })
                            .catch((error) => {
                            console.error('Error:', error);
                        });

                        task.remove();

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
                                let subtasks = subdata["task"];
                                subtasks.forEach((subTemp) => {
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
                                    
                                })
                
                             }
                        })
                        

                        
                    });


                    //append subtask;
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

                                    let content = subTemp.content;
                                    subTask.isSubtask = true;
                                    //subTaskInput.value = "● ";
                                    subTaskInput.addEventListener('change', ()=>{
                                        let oldData = subTemp;
                                        newData = {status:"daily",type:"task", content:content,date:date.toDateString(), task_id: subTask.task_id };
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
                //alert("Task didn't added");
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
        if(data["status"] == 200) {
            //obtains the task list
            let tasks = data["task"];
            let reflect_box = document.getElementById("reflect-box");
            
            tasks.forEach((tmp) => {
                if(tmp["type"] === "reflection") {
                    document.getElementById("reflection").append(tmp["content"]);
                    isReflectionNew = false;
                }
            })
        }
    });
}

// reflect_btn.addEventListener('click', (event) => {
//     const content = document.getElementById('reflection').value;
//     document.getElementById('reflection-content').append(content);

//     event.preventDefault();

//     let date = new Date();
//     data = { content: content, date: date.toDateString(), type: "reflection" };
//     console.log(data);
//     fetch('/addDailyTask', {
//         method: 'POST',
//         headers: {
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify(data)
//     })
//     .then(response => response.json())
//     .then(data => {
//         if(data["status"] == 200) {
//             let newReflection = data["reflection"];
//         }
//         else {
//             alert("Reflection didn't add");
//         }
//     })
//     .catch((error) => {
//         console.error('Error:', error);
//     });
//     if (document.getElementById("reflection-content").innerHTML.length > 0) {
//         document.getElementById("add-reflection").disabled = true;
//     }
// });








    //fetch data for daily reflection here
        //change the value of reflection.value = to the saved data
        //set isReflectionNew = false;
    
/*upload picture:
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
    
});*/


//reflection section
let reflection = document.getElementById('reflection');
let reflectionForm = document.querySelector('#reflect-box form')

reflection.addEventListener('change', ()=> {
    if(isReflectionNew == true){
        //create new reflection on back end
        let content = reflection.value;
        let date = new Date();
        data = {status: "daily", type: "reflection", content: content, date: date.toDateString()};
        fetch('/addTask', {
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
        console.log('reflection created by change');
    } else {
        //update reflection on back end 
        fetch('/getDailyTask', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({date: new Date().toDateString()})
        })
        .then(response => response.json())
        .then(data => {
            if(data["status"] == 200) {
                let tasks = data["task"];
                let oldData;
                tasks.forEach((tmp) => {
                    if(tmp["type"] === "reflection") {
                        oldData = tmp;
                    }
                });
                let content = document.getElementById("reflection").value;
                let date = new Date();
                newData = {status: "daily", type: "reflection", content: content, date: date.toDateString()};
                if (newData["content"] === "") {
                    delete_data = oldData;
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
                                let newReflection = data["reflection"];
                            }else{
                                alert("Task didn't added");
                            }
                        })
                        .catch((error) => {
                        console.error('Error:', error);
                    });
                    console.log("successfully deleted reflection");
                }
                else {
                    send_data = {old: oldData, new: newData};
                    fetch('/updateTask', {
                        method: 'POST',
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(send_data)
                    })
                    .then(response => response.json())
                    .then(data => {
                        if(data["status"]  == 200) {
                            let newReflection = data["reflection"];
                        }
                        else {
                            alert("Reflection didn't add");
                        }
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                    });
                    console.log('reflection updated by change');
                }
            }
        })
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



