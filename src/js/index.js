let addButton = document.querySelector('#add span');
let text_box = document.querySelector('#text-box');

document.addEventListener('keydown', function (e) {
  if (e.key == 'Tab') {
    e.preventDefault();
    console.log('tab key pressed');
    console.log(document.activeElement.nodeName);
    if (document.activeElement.nodeName == 'TASK-LIST') {
      console.log('tasklist selected and pressed tab');
      let task = document.activeElement;
      let subTask = document.createElement('task-list');
      let subForm = subTask.shadowRoot.querySelector('#form');
      subTask.className = 'subtask';
      subTask.task_id = task.task_id;
      subTask.isNew = true;
      subTask.isSubtask = true;

      task.shadowRoot.querySelector('#subtask-box').append(subTask);
      subTask.shadowRoot.querySelector('#tasks').focus();
      let selection = subTask.shadowRoot.querySelector('#checklist-select');
      let input = subTask.shadowRoot.querySelector('#tasks');

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

      subTask.addEventListener('focusout', (event) => {
        if (subTask.isNew) {
          let content = subTask.shadowRoot.querySelector('#tasks').value;
          data = {
            status: 'daily',
            type: 'task',
            content: content,
            date: date.toDateString(),
            task_id: task.task_id
          };
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
              } else {
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
          newData = {
            status: 'daily',
            type: 'task',
            content: content,
            date: date.toDateString(),
            task_id: task.task_id
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
              } else {
                // alert("Task didn't added");
              }
            })
            .catch((error) => {
              console.error('Error:', error);
            });
        }
      });

      // Submit FOrm
      subForm.addEventListener('submit', (event) => {
        event.preventDefault();
        input.blur();
      })

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
    console.log(document.activeElement);
  }
  // if(document.activeElement)
});

/* Custom Tag */
document.addEventListener('click', function (e) {
  if (document.activeElement.nodeName == 'TASK-LIST') {
    let selectedTask = document.activeElement;
    let tagType = selectedTask.shadowRoot.querySelector('#tag-select').value;
    selectedTask.task_tag = tagType;
  }
});
/* */

addButton.addEventListener('click', () => {
  console.log('click');
  let task = document.createElement('task-list');
  text_box.append(task);
  console.log(task.shadowRoot);
  let taskInput = task.shadowRoot.querySelector('#tasks');
  let selection = task.shadowRoot.querySelector('#checklist-select');
  console.log(taskInput);

  selection.addEventListener('change', () => {
    if (selection.value == 'Task') {
      taskInput.value = '● ';
    } else if (selection.value == 'Note') {
      taskInput.value = '- ';
    } else {
      taskInput.value = '⚬ ';
    }
  });

  taskInput.addEventListener('focusout', (event) => {
    let dayBtns = document.querySelectorAll('.day');
    for (let i = 7; i < dayBtns.length; i++) {
      if (dayBtns[i].style.background === 'rgba(90, 168, 151, 0.624)') {
        curDay = dayBtns[i].innerHTML;
        break;
      }
    }
    let date = new Date();
    let curDate = new Date(date.getFullYear(), date.getMonth(), curDay);

    if (task.isNew) {
      console.log('focus out');
      event.preventDefault();
      //Put task, event, note drop down men

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
          task.date = data.date;
          task.task_id = data.task._id;
          if (data['status'] == 200) {
            let newTask = data['task'];
          } else {
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
  });


  let taskForm = task.shadowRoot.querySelector('#form');

  taskForm.addEventListener('submit', (event) => {
    event.preventDefault();
    taskInput.blur();
  });

  let deleteButton = task.shadowRoot.querySelector('#delete');

  deleteButton.addEventListener('click', () => {
    //task.remove();
    console.log(task);
    let index = Array.prototype.indexOf.call(text_box.children, task);
    if (typeof data.task === 'undefined') {
      delete_data = data;
    } else {
      delete_data = data.task[index];
    }

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
          // alert("Task didn't added");
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });

    task.remove();
  });

  taskInput.focus();
});

let form = document.querySelector('form');

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

