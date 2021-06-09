//global variables
let addButton = document.querySelector('#add span');
let text_box = document.querySelector('#text-box');
let data;

//adding subtask to page and database when user tabs on task
document.addEventListener('keydown', function (e) {
  if (e.key == 'Tab') {
    e.preventDefault();
    console.log(document.activeElement.nodeName);
    //make sure that the active element is a task-list
    if (document.activeElement.nodeName == 'TASK-LIST') {
      //create a subTask and set properties
      let task = document.activeElement;
      let subTask = document.createElement('task-list');
      subTask.className = 'subtask';
      subTask.task_id = task.task_id;
      subTask.isNew = true;
      subTask.isSubtask = true;

      //subTask element operations
      task.shadowRoot.querySelector('#subtask-box').append(subTask);
      subTask.shadowRoot.querySelector('#tasks').focus();
      let selection = subTask.shadowRoot.querySelector('#checklist-select');
      let input = subTask.shadowRoot.querySelector('#tasks');
      let subForm = subTask.shadowRoot.querySelector('#form');

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

      //adding/updating a subtask to page and db by focusing out
      subTask.addEventListener('focusout', () => {
        //if the subtask is new, add it instead of update
        if (subTask.isNew) {
          //create data with the user input
          let content = subTask.shadowRoot.querySelector('#tasks').value;
          let date = new Date();
          data = {
            status: 'monthly',
            type: 'goal',
            content: content,
            date: date.toDateString(),
            task_id: task.task_id
          };

          //add subtask in the database
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
            status: 'monthly',
            type: 'goal',
            content: content,
            date: date.getMonth(),
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

      //Triggers focusout when user clicks enter
      subForm.addEventListener('submit', (event) => {
        event.preventDefault();
        input.blur();
      });

      //operational delete button: deletes subtask on page and database
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
    }
  }
});

//CRUD application for notes to the calendar section of page
//iterating through week divs
var i;
for (i = 1; i < 5; i++) {
  //grabbing correct calendar
  let calendar = document.querySelector('#week-day' + i);
  let num = document.querySelector('#week-num' + i);

  //iterating over the 7 days of the week
  var j;
  for (j = 0; j < 7; j++) {
    //if user selects a certain day div, then add a note
    let day = calendar.children[j];
    let appendArea = num.children[j];
    //event listener for adding a note
    day.addEventListener('click', () => {
      //storing information for loading
      let appendId = num.id;
      let index = Array.prototype.indexOf.call(day.parentElement.children, day);
      let tagContent = appendId + '_' + index;

      //create the note and delete button
      let box = document.createElement('input');
      let del = document.createElement('button');
      let calTaskDiv = document.createElement('div');
      calTaskDiv.className = 'calTask';
      box.type = 'input';
      box.className = 'append';
      del.className = 'delete';
      del.innerHTML = '\u274C';

      //append to the calendar div
      calTaskDiv.appendChild(box);
      calTaskDiv.appendChild(del);
      appendArea.appendChild(calTaskDiv);

      box.isNew = true;

      //when user focuses out, add/update in database
      box.addEventListener('focusout', (event) => {
        if (box.isNew) {
          event.preventDefault();
          let content = box.value;
          let date = new Date();

          //data based on user input
          data = {
            status: 'monthly',
            type: 'note',
            content: content,
            date: date.getMonth(),
            tag: tagContent
          };
          //add to db
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
                //Success
              } else {
                alert("Goal didn't add");
              }
            })
            .catch((error) => {
              console.error('Error:', error);
            });
          //signal note is not new, so we update next time
          box.isNew = false;
        } else {
          //updating task
          let oldData = data;
          let content = box.value;
          let date = new Date();
          //updating data based on user input
          data = {
            status: 'monthly',
            type: 'note',
            content: content,
            date: date.getMonth(),
            tag: tagContent
          };
          //updating note in the db
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
              } else {
                alert("Goal didn't add");
              }
            })
            .catch((error) => {
              console.error('Error:', error);
            });
        }
      });

      //deleting note from page and db
      del.addEventListener('click', () => {
        //delete from db
        let delete_data = data;
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
        //delete from page
        box.remove();
        del.remove();
      });
    });
  }
}

//When user clicks add button, add/update a task
addButton.addEventListener('click', () => {
  //create a task and add it to the page
  let task = document.createElement('task-list');
  text_box.append(task);
  let taskInput = task.shadowRoot.querySelector('#tasks');
  let selection = task.shadowRoot.querySelector('#checklist-select');
  let taskForm = task.shadowRoot.querySelector('#form');

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
    //if task is new, then add to backend
    if (task.isNew) {
      event.preventDefault();
      //getting user content
      let content = taskInput.value;
      let date = new Date();

      //create data based on data and user input
      data = {
        status: 'monthly',
        type: 'goal',
        content: content,
        date: date.getMonth()
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
          task.task_id = data.task._id;
          if (data['status'] == 200) {
            //Success
          }
        })
        .catch((error) => {
          console.error('Error:', error);
        });

      //set task.isNew to false so task is not duplicated
      task.isNew = false;
    } else {
      //update task in the database depending on user input
      let oldData = data;
      let content = taskInput.value;
      let date = new Date();

      data = {
        status: 'monthly',
        type: 'goal',
        content: content,
        date: date.getMonth()
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
            //Success
          } else {
            //alert("Goal didn't add");
          }
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }

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
  });

  //User enters a task with key, add/update on task list
  taskForm.addEventListener('submit', (event) => {
    event.preventDefault();
    //if task is new, then add to backend
    if (task.isNew) {
      //create data based on user input
      let content = taskInput.value;
      let date = new Date();
      data = {
        status: 'monthly',
        type: 'goal',
        content: content,
        date: date.getMonth()
      };

      //add data to the backend
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
            //Success
          }
        })
        .catch((error) => {
          console.error('Error:', error);
        });
      //set task.isNew to false to prevent duplicate tasks
      task.isNew = false;
    } else {
      //update task in database based on user input
      let oldData = data;
      let content = taskInput.value;
      let date = new Date();
      data = {
        status: 'monthly',
        type: 'goal',
        content: content,
        date: date.getMonth()
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
            //Success
          } else {
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

//load Task:
window.onload = function () {
  //fetch the tasks and append them
  let date = new Date();
  fetch('/getMonthlyTask', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({date: date.getMonth().toString()})
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('get monthly data:', data);
      if (data['status'] == 200) {
        //obtains the task list
        let tasks = data['task'];
        let text_box = document.getElementById('text-box');

        //add each task into the box
        tasks.forEach((tmp) => {
          if (tmp['type'] == 'goal') {
            let task = document.createElement('task-list');
            let taskInput = task.shadowRoot.querySelector('#tasks');
            let taskForm = task.shadowRoot.querySelector('#form');
            taskInput.value = tmp['content'];
            task.isNew = false;
            text_box.append(task);
            let selection = task.shadowRoot.querySelector('#checklist-select');
            task.task_id = tmp._id;

            //prefix the task value depending on user selection of event, note, task
            selection.addEventListener('change', () => {
              if (selection.value == 'Task') {
                taskInput.value = '● ';
              } else if (selection.value == 'Note') {
                taskInput.value = '- ';
              } else {
                taskInput.value = '⚬ ';
              }
            });

            //trigger focsout out when user enters
            taskForm.addEventListener('submit', (event) => {
              event.preventDefault();
              taskInput.blur();
            });

            //update task on the database
            taskInput.addEventListener('focusout', (event) => {
              event.preventDefault();
              //get old data from fetching
              let index = Array.prototype.indexOf.call(text_box.children, task);
              let oldData = data.task[index];
              //new data from new user input
              let content = taskInput.value;
              let date = new Date();
              let newData = {
                status: 'monthly',
                type: 'goal',
                content: content,
                date: date.getMonth()
              };
              let send_data = {old: oldData, new: newData};
              //update the task on the  database
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
                    alert("Task didn't added");
                  }
                })
                .catch((error) => {
                  console.error('Error:', error);
                });
            });

            //delete task and subtask from page and database
            let deleteButton = task.shadowRoot.querySelector('#delete');
            deleteButton.addEventListener('click', () => {
              let index = Array.prototype.indexOf.call(text_box.children, task);
              let delete_data = data.task[index];
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
                  } else {
                    alert("Task didn't added");
                  }
                })
                .catch((error) => {
                  console.error('Error:', error);
                });
              //remove taks from page
              task.remove();

              //delete associated subtasks from page and database
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
                      //delete subtasks from database
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

            //display subtasks on window
            let id_data = {task_id: task.task_id};
            fetch('/getSubTask', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(id_data)
            })
              .then((response) => response.json())
              .then((subdata) => {
                if (subdata['status'] == 200) {
                  let subtasks = subdata['task'];
                  //append subtask
                  subtasks.forEach((subTemp) => {
                    let subTask = document.createElement('task-list');
                    let subTaskInput =
                      subTask.shadowRoot.querySelector('#tasks');
                    let subTaskForm = subTask.shadowRoot.querySelector('#form');
                    subTask.className = 'subtask';
                    subTaskInput.value = subTemp.content;
                    subTask.task_id = task.task_id;
                    task.shadowRoot
                      .querySelector('#subtask-box')
                      .append(subTask);
                    subTask.isNew = false;
                    let subDelete = subTask.shadowRoot.querySelector('#delete');

                    subTask.isSubtask = true;
                    //even listener for updating pre-existing subtask
                    subTaskInput.addEventListener('focusout', () => {
                      let oldData = subTemp;
                      let newData = {
                        status: 'monthly',
                        type: 'goal',
                        content: subTaskInput.value,
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
                            //Success
                          }
                        })
                        .catch((error) => {
                          console.error('Error:', error);
                        });
                    });

                    // trigger focusout to update data on enter
                    subTaskForm.addEventListener('submit', (event) => {
                      event.preventDefault();
                      subTaskInput.blur();
                    });

                    //delete subtask on page and db when delete button is pressed
                    subDelete.addEventListener('click', () => {
                      let delete_data = subTemp;
                      //delete on the db
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

                      //delete subtask on the page
                      subTask.remove();
                    });
                  });
                }
              });
          } else {
            //appending the notes on the calendar onload
            let note = document.createElement('input');
            note.type = 'text';
            note.className = 'append';
            note.value = tmp['content'];
            //get the right id, to append to correct calendar spit
            let info = tmp['tag'].split('_');
            let numId = '#' + info[0];
            let appendNum = document.querySelector(numId).children[info[1]];
            let del = document.createElement('button');
            let calTaskDiv = document.createElement('div');
            calTaskDiv.className = 'calTask';
            del.className = 'delete';
            del.innerHTML = '\u274C';
            calTaskDiv.append(note);
            calTaskDiv.append(del);
            appendNum.append(calTaskDiv);

            //when user focuses out, update note in db
            note.addEventListener('focusout', () => {
              let oldData = tmp;
              let newData = {
                status: 'monthly',
                type: 'note',
                content: note.value,
                date: date.getMonth(),
                tag: data['tag']
              };
              //updating data in db
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
                    alert("Task didn't added");
                  }
                })
                .catch((error) => {
                  console.error('Error:', error);
                });
            });

            //delete note from page and db onclick of delete button
            del.addEventListener('click', () => {
              let delete_data = tmp;
              //delete from db
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
              //remove from page
              note.remove();
              del.remove();
            });
          }
        });
      } else {
        // alert("Task didn't added");
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
};
