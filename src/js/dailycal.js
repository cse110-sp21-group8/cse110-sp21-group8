let today = new Date();
let currentMonth = today.getMonth();
let currentDay = parseInt(today.toDateString().slice(8, 10));

let months = [
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

let monthName = months[currentMonth];
document.getElementById('cal').innerHTML = monthName;

const date = new Date();

const monthDays = document.querySelector('.cal-body');

date.setDate(1);

const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

const firstDayIndex = date.getDay();

let days = '';
for (let x = firstDayIndex; x > 0; x--) {
  days += `<div class="prev-date1">${' '}</div>`;
}

for (let i = 1; i <= lastDay; i++) {
  days += `<button class="day">${i}</button>`;
  monthDays.innerHTML = days;
}


let dayBtns = document.querySelectorAll('#calendar  .day');
dayBtns[currentDay + 6].style.background = '#5aa8979f';

let curIdx = currentDay + 6;
for (let i = 7; i < dayBtns.length; i++) {
  dayBtns[i].addEventListener('click', () => {
    // change background color of selected day
    curIdx = i;
    dayBtns[i].style.background = '#5aa8979f';
    for (let j = 7; j < dayBtns.length; j++) {
      if (j != i && dayBtns[j].style.background != 'none') {
        dayBtns[j].style.background = 'none';
      }
    }
    document.getElementById('text-box').innerHTML = '';
    document.getElementById('reflection').innerHTML = '';
    let date = new Date(today.getFullYear(), today.getMonth(), i - 6);
    fetch('/getDailyTask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({date: date.toDateString()})
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
            task.task_id = tmp._id;
            taskInput.value = tmp['content'];
            task.isNew = false;


            //migration
            let migrate = task.shadowRoot.querySelector('#move');
            migrate.addEventListener("click",()=>{
              //display the calendar
              let cal = document.getElementById("calendar");
              cal.classList.add("disapper");
  
              let cal2 = document.getElementById("MigrationCalendar");
              cal2.classList.remove("disapper");
              cal2.setAttribute("task_id",tmp._id);
  
              console.log(tmp._id);
             
            });

            let curDay;
            if (i <= 15) {
              curDay = '0' + (i.toString() - 6);
            } else {
              curDay = i.toString() - 6;
            }
            //fixed bug where future and monthly tasks were getting mixed up
            if (tmp['status'] == 'daily' && tmp['date'].slice(8, 10) == curDay) {
              console.log('in here!!!');
              text_box.append(task);
            }

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

            //fixed bug where future and monthly tasks were getting mixed up
            if (
              tmp['status'] == 'daily' &&
              tmp['date'].slice(8, 10) === curDay
            ) {
              text_box.append(task);
            }

            //let selection = task.shadowRoot.querySelector('#checklist-select');
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

            taskInput.addEventListener('change', (event) => {
              event.preventDefault();
              let index = Array.prototype.indexOf.call(text_box.children, task);
              let oldData = data.task[index];
              let content = taskInput.value;
              let date = new Date();
              let newData = {
                status: 'daily',
                type: 'task',
                content: content,
                date: date.toDateString()
              };
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

            taskForm.addEventListener('submit', (event) => {
              event.preventDefault();
              //update task code here
              document.activeElement.blur();
            });

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
                    //Success
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
                            //Success
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

                    let content = subTemp.content;
                    subTask.isSubtask = true;
                    //subTaskInput.value = "● ";
                    subTaskInput.addEventListener('change', () => {
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
                            //Success
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
                      //update task gere in backend
                      document.activeElement.blur();
                    });

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
    fetch('/getDailyTask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({date: date.toDateString()})
    })
      .then((response) => response.json())
      .then((data) => {
        
        if (data['status'] == 200) {
          //obtains the task list
          let tasks = data['task'];
          // eslint-disable-next-line no-unused-vars
          let reflect_box = document.getElementById('reflect-box');

          let curDay;
          if (i <= 15) {
            curDay = '0' + (i.toString() - 6);
          } else {
            curDay = i.toString() - 6;
          }

          tasks.forEach((tmp) => {
            if (
              tmp['type'] === 'reflection' &&
              tmp['date'].slice(8, 10) == curDay
            ) {
              document.getElementById('reflection').append(tmp['content']);
              // eslint-disable-next-line no-undef
              isReflectionNew = false;
            }
          });

          tasks.forEach((tmp) => {
            if (
              tmp['type'] === 'reflection' &&
              tmp['date'].slice(8, 10) === curDay
            ) {
              document.getElementById('reflection').append(tmp['content']);
              // eslint-disable-next-line no-undef
              isReflectionNew = false;
            }
          });
        }
      });
  });
  dayBtns[i].addEventListener('mouseenter', () => {
    dayBtns[i].style.background = '#5aa8979f';
  });
  dayBtns[i].addEventListener('mouseleave', () => {
    if (curIdx != i) {
      dayBtns[i].style.background = 'none';
    }
  });
}
