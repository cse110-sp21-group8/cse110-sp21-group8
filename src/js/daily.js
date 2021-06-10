//Global Variables
let addButton = document.querySelector('#add span');
let text_box = document.querySelector('#text-box');
let data;

let addTagButton = document.getElementById('add-tag').firstElementChild;
let tagTracker = document.getElementById('tracker-box');

// eslint-disable-next-line no-unused-vars
let customForm;
let customTag;
let customInput;

//Add a custom tag
addTagButton.addEventListener('click', ()=>{
  customTag = document.createElement('custom-tag');
  tagTracker.appendChild(customTag);

  customForm = customTag.shadowRoot.getElementById('custom-form');
  let customSubmit = customTag.shadowRoot.getElementById('submit');
  let deleteButton = customTag.shadowRoot.getElementById('delete');
  console.log(deleteButton);


  customInput = customTag.shadowRoot.querySelector("#custom-tags");
  //Delete a tag
  deleteButton.addEventListener('click', (event) => {

  })

  //Submit a tag
  customSubmit.addEventListener('click', (event) =>{
    event.preventDefault();

    //Add the new tag to database
    data = {name: `${customInput.value}`};
    fetch('/addCustomTag', {  
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      }, 
      body: JSON.stringify(data)
      })
      .then(response => response.json())
      .then(data => {
          console.log(data);
          if(data["status"]==200){
              let newTag = data["tags"];
          }else{
          }
      })
      .catch((error) => {
      console.error('Error:', error);
  });
    
    customTag.id = customInput.value;
    let tagList = document.getElementById('text-box').childNodes;
    
    for(let i = 1; i < tagList.length; i++){
      let choices = new Option(`${customTag.id}`, `${customTag.id}`);
      if (tagList[i].nodeName == 'TASK-LIST') {
        tagList[i].shadowRoot.getElementById('tag-select').add(choices);
      }
    }
  });
});

let selectedTask;
document.addEventListener('click', (event) => {
  selectedTask = event.path[0];
  selectedTask.addEventListener('focusout', () => {
    if (selectedTask.id == 'tag-select') {
      let tagType = selectedTask.value;
      selectedTask.task_tag = tagType;

      let dayBtns = document.querySelectorAll('.day');
      let curDay;
      for (let i = 7; i < dayBtns.length; i++) {
        if (dayBtns[i].style.background === 'rgba(90, 168, 151, 0.624)') {
          // eslint-disable-next-line no-unused-vars
          curDay = dayBtns[i].innerHTML;
          break;
        }
      }

      let oldData = data;
      let content = selectedTask.parentElement.querySelector('#tasks').value;
      data = {
        status: 'daily',
        type: 'task',
        content: content,
        date: oldData['date'],
        tag: selectedTask.task_tag
      };
      let newData = data;
      let send_data = {old: oldData, new: newData};
      fetch('/updateTask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(send_data)
      })
        .then((response) => response.json())
        .then((data) => {
          if (data['status'] == 200) {
            //Success;
          } else {
            // alert("Task didn't added");
          }
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  });
});

//Tab Event Listener for adding a subtask
document.addEventListener('keydown', function (e) {
  if (e.key == 'Tab') {
    e.preventDefault();
    //make sure that the active element is a task-list
    if (document.activeElement.nodeName == 'TASK-LIST') {
      //create a subTask and set properties
      let task = document.activeElement;
      let subTask = document.createElement('task-list');
      let subForm = subTask.shadowRoot.querySelector('#form');
      subTask.className = 'subtask';
      subTask.task_id = task.task_id;
      subTask.isNew = true;
      subTask.isSubtask = true;
      //subTask element operations
      task.shadowRoot.querySelector('#subtask-box').append(subTask);
      subTask.shadowRoot.querySelector('#tasks').focus();
      let selection = subTask.shadowRoot.querySelector('#checklist-select');
      let input = subTask.shadowRoot.querySelector('#tasks');

      //prefixes symbol if user selects event, note, or task
      selection.addEventListener('change', () => {
        if (selection.value == 'Task') {
          input.value = '● ';
        } else if (selection.value == 'Note') {
          input.value = '- ';
        } else {
          input.value = '⚬ ';
        }
      });
      input.value = '● ';

      let date = new Date();
      //adding/updating a subtask to page and db by focusing out
      subTask.addEventListener('focusout', () => {
        //if the subtask is new, add it instead of update
        if (subTask.isNew) {
          //create data with the user input
          let content = subTask.shadowRoot.querySelector('#tasks').value;
          data = {
            status: 'daily',
            type: 'task',
            content: content,
            date: date.toDateString(),
            task_id: task.task_id
          };

          //add task in the database
          fetch('/addSubTask', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          })
            .then((response) => response.json())
            .then((data) => {
              if (data['status'] == 200) {
                //Success;
              }
            })
            .catch((error) => {
              console.error('Error:', error);
            });

          //set subTask.isNew to false to prevent duplication of tasks
          subTask.isNew = false;
        } else {
          // grabs user input
          let content = subTask.shadowRoot.querySelector('#tasks').value;

          //oldData is the previous data we store
          let oldData = data;

          //newData stores the updated user input
          let newData = {
            status: 'daily',
            type: 'task',
            content: content,
            date: date.toDateString(),
            task_id: task.task_id
          };

          //send old and new Data to databse for updating
          let send_data = {old: oldData, new: newData};
          fetch('/updateSubTask', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(send_data)
          })
            .then((response) => response.json())
            .then((data) => {
              if (data['status'] == 200) {
                //Success;
              }
            })
            .catch((error) => {
              console.error('Error:', error);
            });
        }
      });

      //Triggers focusout when user enters a task, add/updates task
      subForm.addEventListener('submit', (event) => {
        event.preventDefault();
        input.blur();
      });

      //operational delete button: deletes subtask on page and db
      let del = subTask.shadowRoot.querySelector('#delete');
      del.addEventListener('click', () => {
        let delete_data = data;
        fetch('/deleteSubTask', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(delete_data)
        })
          .then((response) => response.json())
          .then((data) => {
            if (data['status'] == 200) {
              //Success;
            }
          })
          .catch((error) => {
            console.error('Error:', error);
          });
      });

      //Deletes task from page and databse when delete button is clicked
      let deleteButton = task.shadowRoot.querySelector('#delete');

      deleteButton.addEventListener('click', () => {
        let delete_data = data;
        //delete from the db
        fetch('/deleteTask', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(delete_data)
        })
          .then((response) => response.json())
          .then((data) => {
            if (data['status'] == 200) {
              //Success;
            } else {
              alert("Task didn't added");
            }
          })
          .catch((error) => {
            console.error('Error:', error);
          });
        //delete from page
        task.remove();
      });
    }
  }
});

//Adding a new task with the add button on the page
addButton.addEventListener('click', () => {
  console.log('click');
  let task = document.createElement('task-list');

  /* Custom Tag Script */
  let tagList = document.getElementById('text-box').childNodes;
  if (tagList[0] !== undefined && tagList[0].nodeName == 'TASK-LIST') {
    let opts = tagList[0].shadowRoot.getElementById('tag-select').options;

    for (let i = 4; i < opts.length; i++) {
      let choices = new Option(`${opts[i].value}`, `${opts[i].value}`);
      task.shadowRoot.getElementById('tag-select').add(choices);
    }

    if (newTag == true) {
      let tagList = document.getElementById('text-box').childNodes;

      for (let i = 1; i < tagList.length; i++) {
        newTag = false;
        let choices = new Option(`${customTag.id}`, `${customTag.id}`);
        if (tagList[i].nodeName == 'TASK-LIST') {
          tagList[i].shadowRoot.getElementById('tag-select').add(choices);
        }
      }
    }
  } else {
    if (customTag != null) {
      let choices = new Option(`${customTag.id}`, `${customTag.id}`);
      task.shadowRoot.getElementById('tag-select').add(choices);
    }
  }

  //adding task to document
  text_box.append(task);

  //elements of task
  let taskInput = task.shadowRoot.querySelector('#tasks');
  taskInput.value = '● ';

  let selection = task.shadowRoot.querySelector('#checklist-select');

  //prefixes value with correct symbol based on drop down menu
  selection.addEventListener('change', () => {
    if (selection.value == 'Task') {
      taskInput.value = '● ';
    } else if (selection.value == 'Note') {
      taskInput.value = '- ';
    } else {
      taskInput.value = '⚬ ';
    }
  });

  //adds or updates task to database when user focuses out
  taskInput.addEventListener('focusout', (event) => {
    //Sets date to log the task depending on date user selects
    let dayBtns = document.querySelectorAll('.day');
    for (let i = 7; i < dayBtns.length; i++) {
      if (dayBtns[i].style.background === 'rgba(90, 168, 151, 0.624)') {
        var curDay = dayBtns[i].innerHTML;
        break;
      }
    }
    let date = new Date();
    let curDate = new Date(date.getFullYear(), date.getMonth(), curDay);

    //if task is new, then add to backend
    if (task.isNew) {
      event.preventDefault();
      //getting user content
      let content = taskInput.value;

      //create data based on data and user input
      data = {
        status: 'daily',
        type: 'task',
        content: content,
        date: curDate.toDateString()
      };

      //add data to the database
      fetch('/addTask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
        .then((response) => response.json())
        .then((data) => {
          task.date = data.date;
          task.task_id = data.task._id;
          if (data['status'] == 200) {
            //Success;

            //migration
            let migrate = task.shadowRoot.querySelector('#move');
            migrate.addEventListener('click', () => {
              //display the calendar
              let cal = document.getElementById('calendar');
              cal.classList.add('disapper');

              let cal2 = document.getElementById('MigrationCalendar');
              cal2.classList.remove('disapper');
              cal2.setAttribute('task_id', data.task._id);

              console.log(data.task._id);
            });
          } else {
            // alert("Task didn't added");
          }
        })
        .catch((error) => {
          console.error('Error:', error);
        });

      //set task.isNew to false so updating the task does not create a new one
      task.isNew = false;
    } else {
      //update task in the database
      let oldData = data;
      let content = taskInput.value;
      data = {
        status: 'daily',
        type: 'task',
        content: content,
        date: curDate.toDateString()
      };
      let newData = data;
      let send_data = {old: oldData, new: newData};

      //update the task in the backend
      fetch('/updateTask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(send_data)
      })
        .then((response) => response.json())
        .then((data) => {
          if (data['status'] == 200) {
            //Success;
          }
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
                    let task = document.createElement('task-list');
                    let taskInput = task.shadowRoot.querySelector('#tasks');
                    let taskForm = task.shadowRoot.querySelector('#form');
                    let tag = task.shadowRoot.querySelector('#tag-select');
                    task.task_id = tmp._id;
                    taskInput.value = tmp["content"];
                    task.isNew = false;

                    //Load in custom tags
                    fetch('/getCustomTag', {
                      method: 'POST',
                      headers: {
                          "Content-Type": "application/json"
                      },
                      body: JSON.stringify({})
                      })
                      .then(response => response.json())
                      .then(data => {
                          if(data["status"] == 200) {
                              //obtains the task list
                              let tags = data["tags"];              
                              tags.forEach((elem) => {
                                let choices = new Option(`${elem.name}`, `${elem.name}`);
                                tag.appendChild(choices);
                              })
                          }
                      });
                      //Load in the right tag
                      console.log(task);
                      console.log(task.task_tag);
                      for(let i = 1; i < tag.options.length; i++){
                        if(tag.options[i].value == task.task_tag){
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

                    /* Custom Tag */
                    tag.addEventListener('click', (event) => {
                      let selectedTask = tag;
                      selectedTask.addEventListener('focusout', () => {
                        if(selectedTask.id == "tag-select"){
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


                    let selection = task.shadowRoot.querySelector('#checklist-select');
                
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
                        let index = Array.prototype.indexOf.call(text_box.children, task);
                        let oldData = data.task[index];
                        //let inputArr = taskInput.value.split(" ");
                        taskInput.value[0] = change;
                        let content = taskInput.value; //.replace(inputArr[0], change);
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
                    })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  });

  // When user presses enter after entering a task, data is added/updated in the database
  let taskForm = task.shadowRoot.querySelector('#form');
  taskForm.addEventListener('submit', (event) => {
    //setting the data according to user selection
    let dayBtns = document.querySelectorAll('.day');
    let curDay;
    for (let i = 7; i < dayBtns.length; i++) {
      if (dayBtns[i].style.background === 'rgba(90, 168, 151, 0.624)') {
        curDay = dayBtns[i].innerHTML;
        break;
      }
    }
    let date = new Date();
    let curDate = new Date(date.getFullYear(), date.getMonth(), curDay);

    event.preventDefault();

    //adding task to database
    if (task.isNew) {
      console.log('focus out');
      let content = taskInput.value;
      //adding user input to database
      data = {
        status: 'daily',
        type: 'task',
        content: content,
        date: curDate.toDateString()
      };
      fetch('/addTask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
        .then((response) => response.json())
        .then((data) => {
          task.task_id = data.task._id;
          if (data['status'] == 200) {
            //Success;
          } else {
            alert("Task didn't added");
          }
        })
        .catch((error) => {
          console.error('Error:', error);
        });
      task.isNew = false;
    } else {
      //updating database when user updates tasl
      let oldData = data;
      let content = taskInput.value;
      data = {
        status: 'daily',
        type: 'task',
        content: content,
        date: curDate.toDateString()
      };
      let newData = data;
      let send_data = {old: oldData, new: newData};

      //udpating task in database
      fetch('/updateTask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(send_data)
      })
        .then((response) => response.json())
        .then((data) => {
          if (data['status'] == 200) {
            //Success;
          }
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
    document.activeElement.blur();
  });

  //Deleting task from page and  database when user clicks delete button
  let deleteButton = task.shadowRoot.querySelector('#delete');
  deleteButton.addEventListener('click', () => {
    let delete_data = data;
    //delete task from database
    fetch('/deleteTask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(delete_data)
    })
      .then((response) => response.json())
      .then((data) => {
        if (data['status'] == 200) {
          //Success;
        } else {
          alert("Task didn't added");
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });

    task.remove();

    //get all the subtasks associated with deleted task and delete them
    fetch('/getSubTask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({task_id: task.task_id})
    })
      .then((response) => response.json())
      .then((subdata) => {
        if (subdata['status'] == 200) {
          let subtasks = subdata['task'];
          subtasks.forEach((subTemp) => {
            delete_data = subTemp;
            //delete subtasks
            fetch('/deleteSubTask', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(delete_data)
            })
              .then((response) => response.json())
              .then((data) => {
                if (data['status'] == 200) {
                  //Success;
                }
              })
              .catch((error) => {
                console.error('Error:', error);
              });
          });
        }
      });
  });

  taskInput.focus();
});

// eslint-disable-next-line no-unused-vars
let isReflectionNew = true;

//fetching the Daily Tasks and subtasks and appending them to screen
function getDailyTasks() {
  //fetching tasks
  fetch('/getDailyTask', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({date: new Date().toDateString()})
  })
    .then((response) => response.json())
    .then((data) => {
      if (data['status'] == 200) {
        //obtains the task list
        let tasks = data['task'];
        console.log(tasks);
        let text_box = document.getElementById('text-box');
        //add each task into the box
        tasks.forEach((tmp) => {
          // skip reflections
          if (tmp['type'] === 'reflection') {
            return;
          }

          //creating the task-list custom element and associated parts
          let task = document.createElement('task-list');
          let taskInput = task.shadowRoot.querySelector('#tasks');
          let taskForm = task.shadowRoot.querySelector('#form');
          let tag = task.shadowRoot.querySelector('#tag-select');

          //set id, value properties depending on whats stored in db
          task.task_id = tmp._id;
          taskInput.value = tmp['content'];
          task.isNew = false; //not a new task, should be updated

          //migration
          let migrate = task.shadowRoot.querySelector('#move');
          migrate.addEventListener('click', () => {
            //display the calendar
            let cal = document.getElementById('calendar');
            cal.classList.add('disapper');

            let cal2 = document.getElementById('MigrationCalendar');
            cal2.classList.remove('disapper');
            cal2.setAttribute('task_id', tmp._id);

            console.log(tmp._id);
          });

          //Load in the right tag
          console.log(tmp.tag);
          for (let i = 1; i < tag.options.length; i++) {
            if (tag.options[i].value == tmp.tag) {
              tag.selectedIndex = `${i}`;
            }
          }

          //Load in the right task type
          let taskType = task.shadowRoot.querySelector('#checklist-select');
          for (let i = 1; i < taskType.options.length; i++) {
            if (taskType.options[i].value == tmp.type) {
              taskType.selectedIndex = `${i}`;
            }
          }

          //make sure daily task is being added
          if (tmp['status'] == 'daily') {
            text_box.append(task);
          }

          let selection = task.shadowRoot.querySelector('#checklist-select');

          //prefix symbol depending if user selects event, task, note
          selection.addEventListener('change', () => {
            if (selection.value == 'Task') {
              taskInput.value = '● ';
            } else if (selection.value == 'Note') {
              taskInput.value = '- ';
            } else {
              taskInput.value = '⚬ ';
            }
          });

          //updates task when user focuses out of textbox
          taskInput.addEventListener('focusout', (event) => {
            event.preventDefault();
            //getting old data from database
            let index = Array.prototype.indexOf.call(text_box.children, task);
            let oldData = data.task[index];
            //setting new data based on user input
            let content = taskInput.value;
            let date = new Date();
            let newData = {
              status: 'daily',
              type: `${selection.value}`,
              content: content,
              date: date.toDateString()
            };

            //updating on database
            let send_data = {old: oldData, new: newData};
            fetch('/updateTask', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(send_data)
            })
              .then((response) => response.json())
              .then((data) => {
                if (data['status'] == 200) {
                  //Success;
                }
              })
              .catch((error) => {
                console.error('Error:', error);
              });
          });

          //triggers focusout event listener when user enters a task
          taskForm.addEventListener('submit', (event) => {
            event.preventDefault();
            taskInput.blur();
          });

          //deletes task and corresponding subtask from page and database
          let deleteButton = task.shadowRoot.querySelector('#delete');
          deleteButton.addEventListener('click', () => {
            let index = Array.prototype.indexOf.call(text_box.children, task);
            let delete_data = data.task[index];
            fetch('/deleteTask', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(delete_data)
            })
              .then((response) => response.json())
              .then((data) => {
                if (data['status'] == 200) {
                  //Success;
                }
              })
              .catch((error) => {
                console.error('Error:', error);
              });

            //removing task from html page
            task.remove();

            //get associated subTasks from database and delete from db and page
            fetch('/getSubTask', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({task_id: task.task_id})
            })
              .then((response) => response.json())
              .then((subdata) => {
                if (subdata['status'] == 200) {
                  let subtasks = subdata['task'];
                  subtasks.forEach((subTemp) => {
                    delete_data = subTemp;
                    fetch('/deleteSubTask', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json'
                      },
                      body: JSON.stringify(delete_data)
                    })
                      .then((response) => response.json())
                      .then((data) => {
                        if (data['status'] == 200) {
                          //Success;
                        }
                      })
                      .catch((error) => {
                        console.error('Error:', error);
                      });
                  });
                }
              });
          });

          //append subtask to the page
          fetch('/getSubTask', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({task_id: task.task_id})
          })
            .then((response) => response.json())
            .then((subdata) => {
              if (subdata['status'] == 200) {
                console.log(subdata);
                let subtasks = subdata['task'];
                subtasks.forEach((subTemp) => {
                  //creating subtask and setting appropriate properties
                  let subTask = document.createElement('task-list');
                  let subTaskInput = subTask.shadowRoot.querySelector('#tasks');
                  let subTaskForm = subTask.shadowRoot.querySelector('#form');
                  subTask.className = 'subtask';
                  subTaskInput.value = subTemp.content;
                  subTask.task_id = task.task_id;

                  //appending subtask to tasklist
                  task.shadowRoot.querySelector('#subtask-box').append(subTask);
                  subTask.isNew = false;
                  let subDelete = subTask.shadowRoot.querySelector('#delete');

                  let content = subTemp.content;
                  subTask.isSubtask = true;

                  //updating subtask on page and db when user updates subtask
                  subTaskInput.addEventListener('focsout', () => {
                    let oldData = subTemp;
                    let newData = {
                      status: 'daily',
                      type: 'task',
                      content: content,
                      date: date.toDateString(),
                      task_id: subTask.task_id
                    };
                    let send_data = {old: oldData, new: newData};
                    fetch('/updateSubTask', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json'
                      },
                      body: JSON.stringify(send_data)
                    })
                      .then((response) => response.json())
                      .then((data) => {
                        if (data['status'] == 200) {
                          //Success;
                        }
                      })
                      .catch((error) => {
                        console.error('Error:', error);
                      });
                  });

                  //triggers focusout when user enters on a subtask
                  subTaskForm.addEventListener('submit', (event) => {
                    event.preventDefault();
                    subTask.blur();
                  });

                  //delete subtask from page and db when user clicks subtask delete buttom
                  subDelete.addEventListener('click', () => {
                    let delete_data = subTemp;
                    //delete from databse
                    fetch('/deleteSubTask', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json'
                      },
                      body: JSON.stringify(delete_data)
                    })
                      .then((response) => response.json())
                      .then((data) => {
                        if (data['status'] == 200) {
                          //Success;
                        }
                      })
                      .catch((error) => {
                        console.error('Error:', error);
                      });
                    //deleting from page
                    subTask.remove();
                  });
                });
              }
            });
        });
      } else {
        //alert("Task didn't added");
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });

  //updating the calendar UI based on current day
  let dayBtns = document.querySelectorAll('.day');
  let curDay;
  for (let i = 7; i < dayBtns.length; i++) {
    if (dayBtns[i].style.background === 'rgba(90, 168, 151, 0.624)') {
      curDay = dayBtns[i].innerHTML;
      break;
    }
  }
  let date = new Date();
  let curDate = new Date(date.getFullYear(), date.getMonth(), curDay);

  //load reflection
  fetch('/getDailyTask', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({date: curDate.toDateString()})
  })
    .then((response) => response.json())
    .then((data) => {
      if (data['status'] == 200) {
        //obtains the task list
        let tasks = data['task'];

        tasks.forEach((tmp) => {
          if (tmp['type'] === 'reflection') {
            document.getElementById('reflection').append(tmp['content']);
            isReflectionNew = false;
          }
        });
      }
    });
}

//load Task:
window.onload = function () {
  getDailyTasks();
};

//reflection section
let reflection = document.getElementById('reflection');
// eslint-disable-next-line no-unused-vars
let reflectionForm = document.querySelector('#reflect-box form');

//adding reflection when user focuses out
reflection.addEventListener('focusout', () => {
  let dayBtns = document.querySelectorAll('.day');
  let curDay;
  for (let i = 7; i < dayBtns.length; i++) {
    if (dayBtns[i].style.background === 'rgba(90, 168, 151, 0.624)') {
      curDay = dayBtns[i].innerHTML;
      break;
    }
  }
  let date = new Date();
  let curDate = new Date(date.getFullYear(), date.getMonth(), curDay);
  if (document.getElementById('reflection').innerHTML === '') {
    //create new reflection on back end
    let content = reflection.value;
    data = {
      status: 'daily',
      type: 'reflection',
      content: content,
      date: curDate.toDateString()
    };
    fetch('/addTask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then((response) => response.json())
      .then((data) => {
        if (data['status'] == 200) {
          //let newReflection = data['reflection'];
        } else {
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
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({date: curDate.toDateString()})
    })
      .then((response) => response.json())
      .then((data) => {
        if (data['status'] == 200) {
          let tasks = data['task'];
          let oldData;
          tasks.forEach((tmp) => {
            if (tmp['type'] === 'reflection') {
              oldData = tmp;
            }
          });

          //Deleting reflection from the database
          let content = document.getElementById('reflection').value;
          let newData = {
            status: 'daily',
            type: 'reflection',
            content: content,
            date: curDate.toDateString()
          };

          if (newData['content'] === '') {
            let delete_data = oldData;
            fetch('/deleteTask', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(delete_data)
            })
              .then((response) => response.json())
              .then((data) => {
                if (data['status'] == 200) {
                  //let newReflection = data['reflection'];
                }
              })
              .catch((error) => {
                console.error('Error:', error);
              });
          } else {
            let send_data = {old: oldData, new: newData};
            fetch('/updateTask', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(send_data)
            })
              .then((response) => response.json())
              .then((data) => {
                if (data['status'] == 200) {
                  //let newReflection = data['reflection'];
                } else {
                  alert("Reflection didn't add");
                }
              })
              .catch((error) => {
                console.error('Error:', error);
              });
            console.log('reflection updated by change');
          }
        }
      });
  }
});

//migration:
let m_today = new Date();
let m_currentMonth = m_today.getMonth();

let m_months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];
//setting UI
let m_monthName = m_months[m_currentMonth];
document.getElementById('Migratiocal').innerHTML = 'Migration:  ' + m_monthName;

const m_date = new Date();

const migration_monthDays = document.getElementById('cal-bodyM');
let M_cal = document.querySelector('#MigrationCalendar');
let cal = document.getElementById('calendar');

m_date.setDate(1);

const m_lastDay = new Date(
  m_date.getFullYear(),
  m_date.getMonth() + 1,
  0
).getDate();

const m_firstDayIndex = m_date.getDay();

for (let x = m_firstDayIndex; x > 0; x--) {
  let day = document.createElement('div');
  day.classList.add('prev-date1');
  migration_monthDays.appendChild(day);
}

for (let i = 1; i <= m_lastDay; i++) {
  let day = document.createElement('button');
  day.classList.add('day');
  day.innerText = i;
  day.setAttribute('index', i);

  day.addEventListener('mouseenter', () => {
    day.style.background = '#5aa8979f';
  });
  day.addEventListener('mouseleave', () => {
    day.style.background = 'none';
  });

  day.addEventListener('click', () => {
    let cday = new Date();
    cday.setDate(day.getAttribute('index'));
    let send_data = {
      old: {_id: M_cal.getAttribute('task_id')},
      new: {date: cday.toDateString()}
    };
    fetch('/updateTask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(send_data)
    })
      .then((response) => response.json())
      .then((data) => {
        if (data['status'] == 200) {
          cal.classList.remove('disapper');
          M_cal.classList.add('disapper');
          document.getElementById('text-box').innerHTML = '';
          document.getElementById('reflection').innerHTML = '';
          getDailyTasks();
        } else {
          // alert("Task didn't added");
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  });
  migration_monthDays.appendChild(day);
}
