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

  var i; 
  for(i = 1; i<7; i++){
      var j; 
      for(j = 1; j < 32; j++){
        let name = ".whole-cal" + i;
        let cal = document.querySelector(name);
        let geth2 = name + " " +"h2";
        let text = document.querySelector(geth2).textContent;

        let classname = ".date" + i + j;
        let day = document.querySelector(classname);
        if(day != null){
            day.addEventListener('click', (event) => {
                document.getElementById('tasks2').className="show";
                console.log(day.innerHTML);
                document.getElementById("tasks2").value = text + " " + day.innerHTML+ ": ";
            });
        }
      }
  }

  /*var i;
  var content;
  for(i = 1; i<7; i++){
    let name = ".whole-cal" + i;
    let cal = document.querySelector(name);
    cal.addEventListener('click', (event) => {
         //document.getElementById("tasks2").value = "";
         let geth2 = name + " " +"h2";
         let text = document.querySelector(geth2).textContent;
         //document.getElementById("tasks2").value = text + ": ";
         content = text;
    });

    var j;
    for(j = 1; j < 32; j++){
        let classname = ".date" + i + j;
        let day = document.querySelector(classname);
        if(day != null){
            day.addEventListener('click', (event) => {
                document.getElementById('tasks2').className="show";
                console.log(day.innerHTML);
                document.getElementById("tasks2").value = content + day.innerHTML;
            });
        }
        
    }
  }*/