//Global Variables
let text_box = document.querySelector('#text-box1');
let data;
//DOMContentLoaded for Testing 
document.addEventListener('DOMContentLoaded', () => {
  //adding subtask when user tabs 
  document.addEventListener('keydown', function (e) {
    if (e.key == 'Tab') {
      e.preventDefault();
      //check we're tabbing on valid task 
      if (document.activeElement.nodeName == 'TASK-LIST') {
        //create task list and set properties
        let task = document.activeElement;
        let subTask = document.createElement('task-list');
        subTask.className = 'subtask';
        subTask.task_id = task.task_id;
        subTask.isNew = true;
        subTask.isSubtask = true;

        //append the task and get selection and user input 
        task.shadowRoot.querySelector('#subtask-box').append(subTask);
        subTask.shadowRoot.querySelector('#tasks').focus();
        let selection = subTask.shadowRoot.querySelector('#checklist-select');
        let input = subTask.shadowRoot.querySelector('#tasks');

        //prefix symbol based on user choice 
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

        //when user focuses out add or update subtask in db 
        subTask.addEventListener('focusout', () => {
          let date = new Date();
          if (subTask.isNew) {
            //get user input
            let content = subTask.shadowRoot.querySelector('#tasks').value;
            data = {
              status: 'future',
              type: 'task',
              content: content,
              date: date.toDateString(),
              task_id: task.task_id
            };
            //add data to db 
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
                } else {
                  alert("Task didn't added");
                }
              })
              .catch((error) => {
                console.error('Error:', error);
              });
            //prevent duplicates
            subTask.isNew = false;  
          } else {
            //update task 

            //get new data and replace it with previous task's data 
            let content = subTask.shadowRoot.querySelector('#tasks').value;
            let oldData = data;
            let newData = {
              status: 'future',
              type: 'task',
              content: content,
              date: date.toDateString(),
              task_id: task.task_id
            };

            //update task in the database 
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
                } else {
                  alert("Task didn't added");
                }
              })
              .catch((error) => {
                console.error('Error:', error);
              });
          }
        });

        //trigger focusout event listener when user enters (entering a subtask)
        let subForm = subTask.shadowRoot.querySelector('#form');
        subForm.addEventListener('submit', (event) => {
            event.preventDefault();
            input.blur();
        });

        //deleting subtask from page and db
        let del = subTask.shadowRoot.querySelector('#delete');
        del.addEventListener('click', () => {
          //delete from db
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
              } else {
                alert("Task didn't added");
              }
            })
            .catch((error) => {
              console.error('Error:', error);
            });
            //remove from page 
            subTask.remove();
        });
      }
    }

  });

  //Iterate through the calendars on the side and add event listeners for each da
  var i;
  for (i = 1; i < 7; i++) {
    var j;
    for (j = 1; j < 32; j++) {
      //prefills the value depending on which day of month user selects
      let name = '.whole-cal' + i;
      let geth2 = name + ' ' + 'h2';
      let text = document.querySelector(geth2).textContent;

      let classname = '.date' + i + j;
      let day = document.querySelector(classname);

      if (day != null) {

        //when user selects a day, add or update task 
        day.addEventListener('click', () => {
          //create new task to append to page 
          let task = document.createElement('task-list');
          text_box.append(task);
          let taskInput = task.shadowRoot.querySelector('#tasks');
          let taskForm = task.shadowRoot.querySelector('#form');
          let selection = task.shadowRoot.querySelector('#checklist-select');
          //prefix the day user selects along with month
          let prefixed = text + ' ' + day.innerHTML + ': ';
          taskInput.value = prefixed;
          //change the drop down menu
          selection.addEventListener('change', () => {
            if (selection.value == 'Task') {
              taskInput.value = prefixed + '● ';
            } else if (selection.value == 'Note') {
              taskInput.value = prefixed + '- ';
            } else {
              taskInput.value = prefixed + '⚬ ';
            }
          });

          //triggers focus out when user enters, add/updates tasks
          taskForm.addEventListener('submit', (event) =>{
                event.preventDefault();
                taskInput.blur();
           })

           //when user focuses out, add/updates task on db and page
          taskInput.addEventListener('focusout', (event) => {
            //add a task 
            if (task.isNew) {
              event.preventDefault();
              //get user input 
              let content = taskInput.value;
              let date = new Date();
              data = {
                status: 'future',
                type: 'task',
                content: content,
                date: date.toDateString()
              };
              //add task in the db 
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
                    task.task_id = data.task._id;
                  } else {
                    alert("Task didn't added");
                  }
                })
                .catch((error) => {
                  console.error('Error:', error);
                });
              
              //prevent duplicates 
              task.isNew = false;
            } else {
              //update tasks 
              let oldData = data;
              let content = taskInput.value;
              let date = new Date();
              //get new daya
              data = {
                status: 'future',
                type: 'task',
                content: content,
                date: date.toDateString()
              };
              let newData = data;
              let send_data = {old: oldData, new: newData};
              //update data in the db 
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

            //delete tasks from db and page when the user clicks the delete button
            let deleteButton = task.shadowRoot.querySelector('#delete');
            deleteButton.addEventListener('click', () => {
              //delete data from the db 
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
              
              //remove the page 
              task.remove();
            });
          });
        });
      }
    }
  }
});

//load Task:
window.onload = function () {
  fetch('/getFutureTask', {
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
        let text_box = document.getElementById('text-box1');
        //add each task into the window
        tasks.forEach((tmp) => {
          //create a new task based on the data
          let task = document.createElement('task-list');
          let taskInput = task.shadowRoot.querySelector('#tasks');
          let taskForm = task.shadowRoot.querySelector('#form');
          let selection = task.shadowRoot.querySelector('#checklist-select')
          taskInput.value = tmp['content'];
          task.isNew = false;

          //make sure the data is from future log 
          if (tmp['status'] == 'future') {
            text_box.appendChild(task);
          }

          //updating task when focusout
          taskInput.addEventListener('focusout', (event) => {
            event.preventDefault();
            //updating the data based on new input
            let index = Array.prototype.indexOf.call(text_box.children, task);
            let oldData = data.task[index];
            let content = taskInput.value;
            let date = new Date();
            let newData = {
                status: 'future',
                type: `${selection.value}`,
                content: content,
                date: date.toDateString()
            };

            //update the data in the db 
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
         });

         //trigger focusout when user enters, adds/updates subtask
         taskForm.addEventListener('submit', (event) => {
             event.preventDefault();
             taskInput.blur();
         })

          //delete button 
          let deleteButton = task.shadowRoot.querySelector('#delete');

          // on clicking the delete button, delete from db and page
          deleteButton.addEventListener('click', () => {
            //get data from db 
            let index = Array.prototype.indexOf.call(text_box.children, task);
            let delete_data = data.task[index];
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

            //remove the task from the page 
            task.remove();

            //delete the subtasks associated with deleted task 
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
                    //delete the subtasks
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
                        } else {
                          alert("Task didn't added");
                        }
                      })
                      .catch((error) => {
                        console.error('Error:', error);
                      });
                  });
                }
              });
          });

          //append the subtasks to the window 
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
                //add the subtasks to the page 
                subtasks.forEach((subTemp) => {
                  //create the subtasks and the appropriate properties 
                  let subTask = document.createElement('task-list');
                  let subTaskInput = subTask.shadowRoot.querySelector('#tasks');
                  let subTaskForm = subTask.shadowRoot.querySelector('#form');
                  subTask.className = 'subtask';
                  subTaskInput.value = subTemp.content;
                  subTask.task_id = task.task_id;
                  task.shadowRoot.querySelector('#subtask-box').append(subTask);
                  subTask.isNew = false;
                  let subDelete = subTask.shadowRoot.querySelector('#delete');
                  subTask.isSubtask = true;
                  
                  let date = new Date();
                  //updating subtask when user focusesout
                  subTaskInput.addEventListener('focusout', () => {
                    //get new data from user 
                    let content = subTaskInput.value;
                    let oldData = subTemp;
                    let newData = {
                      status: 'future',
                      type: 'task',
                      content: content,
                      date: date.toDateString(),
                      task_id: subTask.task_id
                    };
                    let send_data = {old: oldData, new: newData};
                    
                    //update the subtask in the db 
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
                        } else {
                          alert("Task didn't added");
                        }
                      })
                      .catch((error) => {
                        console.error('Error:', error);
                      });
                  });

                  //when user enters, trigger focus on to add/update subtask
                  subTaskForm.addEventListener('submit', (event) => {
                    event.preventDefault();
                    subTask.blur();
                  });

                  //clicking the subtask delete button, delete subtask from db and window 
                  subDelete.addEventListener('click', () => {
                    //delete from db
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
                        } else {
                          alert("Task didn't added");
                        }
                      })
                      .catch((error) => {
                        console.error('Error:', error);
                      });
                    //delete from page 
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
};
