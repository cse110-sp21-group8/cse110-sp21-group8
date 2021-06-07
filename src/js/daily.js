//Global Variables
let addButton = document.querySelector('#add span');
let text_box = document.querySelector('#text-box');
let reflect_btn = document.querySelector('#add-reflection');


let addTagButton = document.getElementById('add-tag').firstElementChild;
let tagTracker = document.getElementById('tracker-box');

let customTag;
let customForm;
let customInput;
let newTag = false;

// Custom Tag Script 
addTagButton.addEventListener('click', () => {
  customTag = document.createElement('custom-tag');
  tagTracker.appendChild(customTag);

  customForm = customTag.shadowRoot.getElementById('custom-form');
  let customSubmit = customTag.shadowRoot.getElementById('submit');
  customInput = customTag.shadowRoot.querySelector('#custom-tags');
  customSubmit.addEventListener('click', (event) => {
    event.preventDefault();
    newTag = true;
    customTag.id = customInput.value;
    let tagList = document.getElementById('text-box').childNodes;

    for (let i = 1; i < tagList.length; i++) {
      newTag = false;
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
      console.log('hola');
      let tagType = selectedTask.value;
      selectedTask.task_tag = tagType;

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

      let data;
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
      send_data = {old: oldData, new: newData};
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
            let newTask = data['task'];
            console.log(newTask);
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
    
    //make sure that the active element is a task-;ost 
    if (document.activeElement.nodeName == 'TASK-LIST') {
      //create a subTask
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

      //drop down menu for task, note, event 
      selection.addEventListener('change', () => {
        if (selection.value == 'Task') {
          input.value = '● ';
          change = '● ';
        } else if (selection.value == 'Note') {
          input.value = '- ';
          change = '- ';
        } else {
          input.value = '⚬ ';
          change = '⚬ ';
        }
      });
      input.value = '● ';

      //adding a subtask by focusing out 
      subTask.addEventListener('focusout', (event) => {
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
                let newTask = data['task'];
              } 
            })
            .catch((error) => {
              console.error('Error:', error);
            });
          //set subTask.isNew to false to signal that we will update at task now
          subTask.isNew = false;
        } else {
          // grabs user input 
          let content = subTask.shadowRoot.querySelector('#tasks').value;

          //oldData is the previous data we store 
          let oldData = data;

          //newData stores the updated user input 
          newData = {
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
                let newTask = data['task'];
              } 
            })
            .catch((error) => {
              console.error('Error:', error);
            });
        }
      });

      //Triggers focusout when user clicks enter
      subForm.addEventListener('submit', (event) => {
        event.preventDefault();
        input.blur();
      })

      //operational delete button: deletes subtask on page and databse
      let del = subTask.shadowRoot.querySelector('#delete');
      del.addEventListener('click', () => {
        delete_data = data;
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
              let newTask = data['task'];
            } else {
              //alert("Task didn't added");
            }
          })
          .catch((error) => {
            console.error('Error:', error);
          });
      });

      //Deletes task from page and databse when delete button is clicked
      let deleteButton = task.shadowRoot.querySelector('#delete');

      deleteButton.addEventListener('click', () => {
        delete_data = data;
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
              let newTask = data['task'];
            } else {
              alert("Task didn't added");
            }
          })
          .catch((error) => {
            console.error('Error:', error);
          });

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
  let change;
  console.log(taskInput);

  //prefixes value with correct symbol based on drop down menu
  selection.addEventListener('change', () => {
    if (selection.value == 'Task') {
      taskInput.value = '● ';
      change = '● ';
    } else if (selection.value == 'Note') {
      taskInput.value = '- ';
      change = '- ';
    } else {
      taskInput.value = '⚬ ';
      change = '⚬ ';
    }
  });

  //adds and updates task to database when user focuses out 
  taskInput.addEventListener('focusout', (event) => {
    //Sets date to log the task depending on date user selects
    let dayBtns = document.querySelectorAll('.day');
    for (let i = 7; i < dayBtns.length; i++) {
      if (dayBtns[i].style.background === 'rgba(90, 168, 151, 0.624)') {
        curDay = dayBtns[i].innerHTML;
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
      let date = new Date();
      
      //create data based on data and user input 
      data = {
        status: 'daily',
        type: 'task',
        content: content,
        date: curDate.toDateString()
      };

      //add data to the databse 
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
            let newTask = data['task'];
          }
        })
        .catch((error) => {
          console.error('Error:', error);
        });

      //set task.isNew to false so task is not duplicated 
      task.isNew = false;
    } else {
      //update task in the databse 
      let oldData = data;
      let content = taskInput.value;
      let date = new Date();
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
            let newTask = data['task'];
          } else {
            // alert("Task didn't added");
          }
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  });

  //
  let taskForm = task.shadowRoot.querySelector('#form');

  taskForm.addEventListener('submit', (event) => {
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
    if (task.isNew) {
      console.log('focus out');
      //Put task, event, note drop down menu
      let content = taskInput.value;
      let date = new Date();
      console.log(date.toLocaleString());
      console.log(content);
      //type: task, events, reminders.
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
            let newTask = data['task'];
          } else {
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
      data = {
        status: 'daily',
        type: 'task',
        content: content,
        date: curDate.toDateString()
      };
      let newData = data;
      send_data = {old: oldData, new: newData};
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
            let newTask = data['task'];
          } else {
            // alert("Task didn't added");
          }
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
    document.activeElement.blur();
  });

  let deleteButton = task.shadowRoot.querySelector('#delete');

  deleteButton.addEventListener('click', () => {
    delete_data = data;
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
          let newTask = data['task'];
        } else {
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
                  let newTask = data['task'];
                } else {
                  //alert("Task didn't added");
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

let form = document.querySelector('form');
let isReflectionNew = true;

//load Task:
window.onload = function (event) {
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
          console.log(tmp);
          let task = document.createElement('task-list');
          let taskInput = task.shadowRoot.querySelector('#tasks');
          let taskForm = task.shadowRoot.querySelector('#form');
          let tag = task.shadowRoot.querySelector('#tag-select');
          task.task_id = tmp._id;
          taskInput.value = tmp['content'];
          task.isNew = false;


          //migration
          let migrate = task.shadowRoot.querySelector('#move');
          migrate.addEventListener("click",()=>{
            $('#dateSpan').toggle();
            let oldData = tmp;
            let currContent = task.shadowRoot.querySelector('#tasks').value;
            let newDate = new Date();
            newDate.setDate(newDate.getDate()+1);
            data = {status:"daily",type:"task", content:currContent,date:newDate.toDateString()};
            let newData = data;
            send_data = {old:oldData, new:newData};
            console.log(oldData);
            console.log(newDate.toDateString());
            console.log(send_data);
            fetch('/updateTask',{
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

          //fixed bug where future and monthly tasks were getting mixed up
          if (tmp['status'] == 'daily') {
            text_box.append(task);
          }

          let selection = task.shadowRoot.querySelector('#checklist-select');
          console.log(taskInput);

          let change;
          selection.addEventListener('change', () => {
            if (selection.value == 'Task') {
              taskInput.value = '● ';
              change = '● ';
            } else if (selection.value == 'Note') {
              taskInput.value = '- ';
              change = '- ';
            } else {
              taskInput.value = '⚬ ';
              change = '⚬ ';
            }
          });

          taskInput.addEventListener('focusout', (event) => {
            event.preventDefault();
            let index = Array.prototype.indexOf.call(text_box.children, task);
            let oldData = data.task[index];
            let content = taskInput.value;
            let date = new Date();
            let newData = {
              status: 'daily',
              type: `${selection.value}`,
              content: content,
              date: date.toDateString()
            };
            send_data = {old: oldData, new: newData};
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
                  let newTask = data['task'];
                } else {
                  //alert("Task didn't added");
                }
              })
              .catch((error) => {
                console.error('Error:', error);
              });
          });

          taskForm.addEventListener('submit', (event) => {
            event.preventDefault();
            taskInput.blur();
          })


          let deleteButton = task.shadowRoot.querySelector('#delete');

          deleteButton.addEventListener('click', () => {
            let index = Array.prototype.indexOf.call(text_box.children, task);
            delete_data = data.task[index];
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
                  let newTask = data['task'];
                } else {
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
                          let newTask = data['task'];
                        } else {
                          //alert("Task didn't added");
                        }
                      })
                      .catch((error) => {
                        console.error('Error:', error);
                      });
                  });
                }
              });
          });

          //append subtask;
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
                  let subTask = document.createElement('task-list');
                  let subTaskInput = subTask.shadowRoot.querySelector('#tasks');
                  let subTaskForm = subTask.shadowRoot.querySelector('#form');
                  subTask.className = 'subtask';
                  subTaskInput.value = subTemp.content;
                  subTask.task_id = task.task_id;
                  task.shadowRoot.querySelector('#subtask-box').append(subTask);
                  subTask.isNew = false;
                  let subDelete = subTask.shadowRoot.querySelector('#delete');

                  let content = subTemp.content;
                  subTask.isSubtask = true;
                  //subTaskInput.value = "● ";
                  subTaskInput.addEventListener('focsout', () => {
                    let oldData = subTemp;
                    newData = {
                      status: 'daily',
                      type: 'task',
                      content: content,
                      date: date.toDateString(),
                      task_id: subTask.task_id
                    };
                    send_data = {old: oldData, new: newData};
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
                          let newTask = data['task'];
                        } 
                      })
                      .catch((error) => {
                        console.error('Error:', error);
                      });
                  });

                  subTaskForm.addEventListener('submit',  (event) => {
                    event.preventDefault();
                    subTask.blur();
                  });

                  subDelete.addEventListener('click', () => {
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
                          let newTask = data['task'];
                        } else {
                          //alert("Task didn't added");
                        }
                      })
                      .catch((error) => {
                        console.error('Error:', error);
                      });

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
        let reflect_box = document.getElementById('reflect-box');

        tasks.forEach((tmp) => {
          if (tmp['type'] === 'reflection') {
            document.getElementById('reflection').append(tmp['content']);
            isReflectionNew = false;
          }
        });
      }
    });
};

//reflection section
let reflection = document.getElementById('reflection');
let reflectionForm = document.querySelector('#reflect-box form');

reflection.addEventListener('change', () => {
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
    let date = new Date();
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
          let newReflection = data['reflection'];
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
          let content = document.getElementById('reflection').value;
          let date = new Date();
          newData = {
            status: 'daily',
            type: 'reflection',
            content: content,
            date: curDate.toDateString()
          };
          if (newData['content'] === '') {
            delete_data = oldData;
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
                  let newReflection = data['reflection'];
                } else {
                  alert("Task didn't added");
                }
              })
              .catch((error) => {
                console.error('Error:', error);
              });
            console.log('successfully deleted reflection');
          } else {
            send_data = {old: oldData, new: newData};
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
                  let newReflection = data['reflection'];
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
