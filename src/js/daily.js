let addButton = document.querySelector('#add span');
let text_box = document.querySelector('#text-box');

addButton.addEventListener('click', ()=> {
    console.log('click')
    let task = document.createElement('task-list')
    text_box.appendChild(task);
    console.log(task.shadowRoot);
    let taskInput = task.shadowRoot.querySelector('#tasks');
    console.log(taskInput);
    taskInput.addEventListener('focusout', (event)=> {
        console.log('focus out');
        event.preventDefault();
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
                    
                    //added component to the html
    
    
                }else{
                    alert("Task didn't added");
                }
            })
            .catch((error) => {
            console.error('Error:', error);
            });
    })

    let taskForm = task.shadowRoot.querySelector('#form');

    taskForm.addEventListener('submit', (event)=>{
        event.preventDefault();
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
                    
                    //added component to the html
    
    
                }else{
                    alert("Task didn't added");
                }
            })
            .catch((error) => {
            console.error('Error:', error);
        });
        document.activeElement.blur();
    })
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
                    let item = document.createElement('task-list');
                    let itemTextInput = item.shadowRoot.querySelector('#tasks');
                    itemTextInput.value = tmp["content"];
                    text_box.appendChild(item);
                });

            }else{
                alert("Task didn't added");
            }
        })
        .catch((error) => {
        console.error('Error:', error);
        });
}











//add tasks:
form.addEventListener('submit', (event)=>{
    event.preventDefault();
    let content = document.getElementById('tasks').value;
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
                
                //added component to the html
                let text_box = document.getElementById("text-box");
                let item = document.createElement('div');
                item.innerText = newTask["content"];
                text_box.appendChild(item);


            }else{
                alert("Task didn't added");
            }
        })
        .catch((error) => {
        console.error('Error:', error);
        });
    form.reset();
});

