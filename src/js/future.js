let form = document.querySelector('form');


//load Task:
window.onload = function(event){
    fetch('/getFutureTask', {  
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
                let text_box = document.getElementById("text-box2");
                //add each task into the box
                tasks.forEach((tmp)=>{
                    console.log(tmp);
                    let item = document.createElement('div');
                    item.innerText = tmp["content"];
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
    let content = document.getElementById('tasks2').value;
    let date = new Date();
    console.log(date.toLocaleString());
    console.log(content);
    //type: task, events, reminders.
    data = {status:"future",type:"task", content:content,date:date.toDateString()};
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
                let text_box = document.getElementById("text-box2");
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
});

/*function pop() {
    document.getElementById('textInput').className="show";
}*/

/*document.addEventListener("DOMContentLoaded", function() {
    let num_answers = 0;
    let mcAnswer = document.getElementById("myPopup");
    mcAnswer.addEventListener("click", function() {
      let elem = document.createElement("input");
      elem.name = "answer";
      //document.getElementById("answer_input").appendChild(elem);
      // inserts elem after mcAnswer
      mcAnswer.parentNode.insertBefore(elem, myPopup.nextSibling);
      num_answers++;
    });
  });*/

  function onButtonClick(){
    document.getElementById('tasks2').className="show";
    var x = document.getElementById("tasks2").defaultValue;
    document.getElementById("tasks2").innerHTML = x;

    
    var d = new Date();
    var n = d.getMonth();
    document.getElementById("demo").innerHTML = n;

    



  }