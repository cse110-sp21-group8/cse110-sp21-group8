//const { nodeInternals } = require("stack-utils");

let addButton = document.querySelector('#add span');
let text_box = document.querySelector('#text-box');

document.addEventListener('keydown', function (e) {
  if (e.key == 'Tab') {
    e.preventDefault();
    console.log(document.activeElement.nodeName);
    if (document.activeElement.nodeName == 'TASK-LIST') {
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
      let subForm = subTask.shadowRoot.querySelector('#form');

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

      subTask.addEventListener('focusout', (event) => {
        if (subTask.isNew) {
          let content = subTask.shadowRoot.querySelector('#tasks').value;
          data = {
            status: 'monthly',
            type: 'goal',
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
            status: 'monthly',
            type: 'goal',
            content: content,
            date: date.getMonth(),
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
    }
  }
});

var i;
for (i = 1; i < 5; i++) {
  let calendar = document.querySelector('#week-day' + i);
  let num = document.querySelector('#week-num' + i);
  var j;
  for (j = 0; j < 7; j++) {
    let day = calendar.children[j];
    let appendArea = num.children[j];
    day.addEventListener('click', () => {
      let appendId = num.id;
      let index = Array.prototype.indexOf.call(day.parentElement.children, day);
      let tagContent = appendId + '_' + index;

      let box = document.createElement('input');
      let del = document.createElement('button');
      box.type = 'input';
      box.className = 'append';
      appendArea.appendChild(box);
      appendArea.appendChild(del);
      box.isNew = true;
      box.addEventListener('focusout', (event) => {
        if (box.isNew) {
          event.preventDefault();
          //Put task, event, note drop down men
          let content = box.value;
          let date = new Date();
          console.log(date.toLocaleString());

          //type: task, events, reminders.
          data = {
            status: 'monthly',
            type: 'note',
            content: content,
            date: date.getMonth(),
            tag: tagContent
          };
          console.log(date.getMonth());
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
                let newTask = data['task'];
              } else {
                alert("Goal didn't add");
              }
            })
            .catch((error) => {
              console.error('Error:', error);
            });
          box.isNew = false;
        } else {
          let oldData = data;
          let content = box.value;
          let date = new Date();
          data = {
            status: 'monthly',
            type: 'note',
            content: content,
            date: date.getMonth(),
            tag: tagContent
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
                alert("Goal didn't add");
              }
            })
            .catch((error) => {
              console.error('Error:', error);
            });
        }
      });

      

      del.addEventListener('click', () => {
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
        box.remove();
        del.remove();
      });
    });
  }
}

addButton.addEventListener('click', () => {
  console.log('click');
  let task = document.createElement('task-list');
  text_box.append(task);
  console.log(task.shadowRoot);
  let taskInput = task.shadowRoot.querySelector('#tasks');
  let selection = task.shadowRoot.querySelector('#checklist-select');
  let taskForm = task.shadowRoot.querySelector('#form');

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
        status: 'monthly',
        type: 'goal',
        content: content,
        date: date.getMonth()
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
            //alert("Goal didn't add");
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
        status: 'monthly',
        type: 'goal',
        content: content,
        date: date.getMonth()
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
            //alert("Goal didn't add");
          }
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }


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
  });

  taskForm.addEventListener('submit', (event) => {
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
        status: 'monthly',
        type: 'goal',
        content: content,
        date: date.getMonth()
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
      data = {
        status: 'monthly',
        type: 'goal',
        content: content,
        date: date.getMonth()
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

//let form = document.querySelector('form');
//load Task:
window.onload = function () {
  console.log('testlog');
  //ask about this later
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
        console.log(data);
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

            selection.addEventListener('change', () => {
              if (selection.value == 'Task') {
                taskInput.value = '● ';
              } else if (selection.value == 'Note') {
                taskInput.value = '- ';
              } else {
                taskInput.value = '⚬ ';
              }
            });

            taskForm.addEventListener('submit', (event) => {
              event.preventDefault();
              taskInput.blur();
            });

            taskInput.addEventListener('focusout', (event) => {
              event.preventDefault();
              let index = Array.prototype.indexOf.call(text_box.children, task);
              let oldData = data.task[index];
              let content = taskInput.value;
              let date = new Date();
              let newData = {
                status: 'monthly',
                type: 'goal',
                content: content,
                date: date.getMonth()
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
                    alert("Task didn't added");
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
              //need to delete the subtasks from database
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
                  console.log(subdata);
                  let subtasks = subdata['task'];
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
                    //subTaskInput.value = "● ";
                    subTaskInput.addEventListener('change', () => {
                      let oldData = subTemp;
                      newData = {
                        status: 'monthly',
                        type: 'goal',
                        content: subTaskInput.value,
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
                          } else {
                            // alert("Task didn't added");
                          }
                        })
                        .catch((error) => {
                          console.error('Error:', error);
                        });
                    });

                    subTaskForm.addEventListener('submit', (event) => {
                      event.preventDefault();
                      subTaskInput.blur();
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
          } else {
            let note = document.createElement('input');
            note.type = 'text';
            note.className = 'append';
            note.value = tmp['content'];
            let info = tmp['tag'].split('_');
            let numId = '#' + info[0];
            let appendNum = document.querySelector(numId).children[info[1]];
            let del = document.createElement('button');
            appendNum.append(note);
            appendNum.append(del);
            note.addEventListener('focusout', (event) => {
              let oldData = tmp;
              let newData = {
                status: 'monthly',
                type: 'note',
                content: note.value,
                date: date.getMonth(),
                tag: data['tag']
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
                    alert("Task didn't added");
                  }
                })
                .catch((error) => {
                  console.error('Error:', error);
                });
            });

            del.addEventListener('click', () => {
              delete_data = tmp;
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
