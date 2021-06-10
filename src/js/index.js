//Global Variables
let addButton = document.querySelector('#add span');
let text_box = document.querySelector('#text-box');
let data;

//Tab Event Listener for adding a subtask
document.addEventListener('keydown', function (e) {
  if (e.key == 'Tab') {
    e.preventDefault();

    //make sure that the active element is a task-list
    if (document.activeElement.nodeName == 'TASK-LIST') {
      //create a subTask and set properties
      console.log('tasklist selected and pressed tab');
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

      // adding/updating a subtask to page and db by focusing out
      subTask.addEventListener('focusout', () => {
        //if the subtask is new, add it instead of update
        if (subTask.isNew) {
          //create data with the user input
          let content = subTask.shadowRoot.querySelector('#tasks').value;
          let date = new Date();
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
                //Success
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
          let date = new Date();
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
                //Success
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
              //Success
            }
          })
          .catch((error) => {
            console.error('Error:', error);
          });
        subTask.remove();
      });

      //Deletes task from page and database when delete button is clicked
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
              //Success
            } else {
              alert("Task didn't added");
            }
          })
          .catch((error) => {
            console.error('Error:', error);
          });
        //delete from the page
        task.remove();

        //get corresponding subTasks from database and delete from db and page
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
                //delete the subtask from the db
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
                      //Success
                    }
                  })
                  .catch((error) => {
                    console.error('Error:', error);
                  });
              });
            }
          });
      });
    }
  }
});

/* Custom Tag */
document.addEventListener('click', function () {
  if (document.activeElement.nodeName == 'TASK-LIST') {
    let selectedTask = document.activeElement;
    let tagType = selectedTask.shadowRoot.querySelector('#tag-select').value;
    selectedTask.task_tag = tagType;
  }
});

//Adding a new task with the add button on the page
addButton.addEventListener('click', () => {
  //create task and get elements of task
  let task = document.createElement('task-list');
  text_box.append(task);
  let taskInput = task.shadowRoot.querySelector('#tasks');
  let selection = task.shadowRoot.querySelector('#checklist-select');
  taskInput.value = '● ';

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
            //Success
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
      //update the task in the backend
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
            //Success
          }
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  });

  // When user presses enter after entering a task, data is added/updated in the database
  let taskForm = task.shadowRoot.querySelector('#form');
  taskForm.addEventListener('submit', (event) => {
    event.preventDefault();
    taskInput.blur();
  });

  //Deleting task from page and database when user clicks delete button
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
          //Success
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });

    //remove task from the the page
    task.remove();
  });
});

//load Task:
window.onload = function () {
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
          //creates task based on data
          console.log(tmp);
          let task = document.createElement('task-list');
          let taskInput = task.shadowRoot.querySelector('#tasks');
          let taskForm = task.shadowRoot.querySelector('#form');
          let tag = task.shadowRoot.querySelector('#tag-select');
          task.task_id = tmp._id;
          taskInput.value = tmp['content'];
          task.isNew = false;

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

          //ensure daily task is being appended
          if (tmp['status'] == 'daily') {
            text_box.append(task);
          }

          //prefix symbol depending if user selects event, task, note
          let selection = task.shadowRoot.querySelector('#checklist-select');
          selection.addEventListener('change', () => {
            if (selection.value == 'Task') {
              taskInput.value = '● ';
            } else if (selection.value == 'Note') {
              taskInput.value = '- ';
            } else {
              taskInput.value = '⚬ ';
            }
          });

          //updates task when user focus out of textbox
          taskInput.addEventListener('focusout', (event) => {
            //getting old data from database
            event.preventDefault();
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
                  //Success
                } else {
                  //alert("Task didn't added");
                }
              })
              .catch((error) => {
                console.error('Error:', error);
              });
          });

          //triggers focusout event listener when user enters a task, adds/updates
          taskForm.addEventListener('submit', (event) => {
            event.preventDefault();
            taskInput.blur();
          });

          //deletes task and corresponding subtask from page and database
          let deleteButton = task.shadowRoot.querySelector('#delete');
          deleteButton.addEventListener('click', () => {
            let index = Array.prototype.indexOf.call(text_box.children, task);
            let delete_data = data.task[index];
            //delete from database
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
                  //Success
                }
              })
              .catch((error) => {
                console.error('Error:', error);
              });

            //remove from page
            task.remove();

            //get corresponding subtasks from databse
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
                    //delete subtasks from db
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
                          //Success
                        }
                      })
                      .catch((error) => {
                        console.error('Error:', error);
                      });
                  });
                }
              });
          });

          //append subtask to page
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
                  //create the subtasks and set properties
                  let subTask = document.createElement('task-list');
                  let subTaskInput = subTask.shadowRoot.querySelector('#tasks');
                  let subTaskForm = subTask.shadowRoot.querySelector('#form');
                  subTask.className = 'subtask';
                  subTaskInput.value = subTemp.content;
                  subTask.task_id = task.task_id;
                  task.shadowRoot.querySelector('#subtask-box').append(subTask);
                  subTask.isNew = false;
                  let subDelete = subTask.shadowRoot.querySelector('#delete');

                  //get new user input
                  let content = subTemp.content;
                  subTask.isSubtask = true;

                  //update subtask in database
                  subTaskInput.addEventListener('focusout', () => {
                    let oldData = subTemp;
                    let date = new Date();
                    let newData = {
                      status: 'daily',
                      type: 'task',
                      content: content,
                      date: date.toDateString(),
                      task_id: subTask.task_id
                    };
                    //new data to update in db
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
                          //Success
                        }
                      })
                      .catch((error) => {
                        console.error('Error:', error);
                      });
                  });

                  //when user enters, triggers focusout to add/update subtasks
                  subTaskForm.addEventListener('submit', (event) => {
                    event.preventDefault();
                    subTask.blur();
                  });

                  //delete subtasks when clicking subtask delete button
                  subDelete.addEventListener('click', () => {
                    let delete_data = subTemp;
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
                          //Success
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

      /* Custom Tag */
      let tmp = data['task'][0];
      let task = document.createElement('task-list');
      let taskInput = task.shadowRoot.querySelector('#tasks');
      taskInput.value = tmp['content'];
      let tagOpts = task.shadowRoot.querySelector('#tag-select').options;
      let buttonDiv = document.getElementById('tag-button');
      for (let i = 1; i < tagOpts.length; i++) {
        let button = document.createElement('button');
        button.type = 'button';
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
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({date: new Date().toDateString()})
          })
            .then((response) => response.json())
            .then((data) => {
              if (data['status'] == 200) {
                //obtains the task list
                let tasks = data['task'];
                tasks.forEach((tmp) => {
                  if (tmp.tag == button.value) {
                    let task = document.createElement('task-list');
                    let taskInput = task.shadowRoot.querySelector('#tasks');
                    // eslint-disable-next-line no-unused-vars
                    let taskForm = task.shadowRoot.querySelector('#form');
                    let tag = task.shadowRoot.querySelector('#tag-select');
                    task.task_id = tmp._id;
                    taskInput.value = tmp['content'];
                    task.isNew = false;

                    //Load in the right tag
                    console.log(tmp.tag);
                    for (let i = 1; i < tag.options.length; i++) {
                      if (tag.options[i].value == tmp.tag) {
                        tag.selectedIndex = `${i}`;
                      }
                    }

                    //Load in the right task type
                    let taskType =
                      task.shadowRoot.querySelector('#checklist-select');
                    for (let i = 1; i < taskType.options.length; i++) {
                      if (taskType.options[i].value == tmp.type) {
                        taskType.selectedIndex = `${i}`;
                      }
                    }
                    collections.append(task);
                  }
                });
              }
            });
        });
      }

      //Go Back to Collections
      let header = document.getElementById('collect-h');
      header.addEventListener('click', () => {
        let collections = document.getElementById('tag-button');
        while (collections.firstChild) {
          collections.removeChild(collections.firstChild);
        }
        collections.className = 'widget-content';
        for (let i = 1; i < tagOpts.length; i++) {
          let button = document.createElement('button');
          button.type = 'button';
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
