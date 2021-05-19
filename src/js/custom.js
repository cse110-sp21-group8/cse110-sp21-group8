let Adding = document.getElementById("Adding");
let Updating = document.getElementById("Updating");
let Deleting = document.getElementById("Deleting");
let add_section = document.getElementById("addForm");
let log = document.getElementById("log");
let form = document.querySelector("form");

let status = 0;
let CustomsList;
let currentCustom = 0;
//changing the display content
//Status = 0: display the adding form
//Status = 1: display the log
//Status = 2: Update the log
Adding.addEventListener("click", ()=>{
    if(status == 0){
        log.style.display="none";
        add_section.style.display = "block";
        Adding.innerText="Return to Custom Log";
        status = 1;
    }else{
        log.style.display="block";
        add_section.style.display = "none";
        Adding.innerText="Add New Custom Log";
        status = 0;
    }
});

Updating.addEventListener("click", ()=>{
    if(status == 0){
        log.style.display="none";
        add_section.style.display = "block";
        Updating.innerText="Return to Custom Log";
        status = 2;

        //obtain the current log and show it in the form
        let current_log = CustomsList[currentCustom];

        let title = document.getElementById("title");
        title.value = current_log["title"];
        let content = document.getElementById("content");
        content.value = current_log["content"];

        //update the color checked value
        let colors_radio = document.getElementsByName('Color');           
        for(let i = 0; i < colors_radio.length; i++) {
            colors_radio[i].checked = false;
            if(colors_radio[i].value == current_log["color"]){
                colors_radio[i].checked = true;
            } 
        }

        //update the Sections checked value
        let sections_radio = document.getElementsByName('sections');           
        for(let i = 0; i < sections_radio.length; i++) {
            sections_radio[i].checked = false;
            if(sections_radio[i].value == current_log["sections"]) {
                sections_radio[i].checked = true;
            }
        }

    }else{
        log.style.display="block";
        add_section.style.display = "none";
        Adding.innerText="Update Custom Log";
        status = 0;
    }
});

Deleting.addEventListener("click", ()=>{
    let data = CustomsList[currentCustom];
    fetch('/DeleteCustomTask', {  
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        }, 
        body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            if(data["status"]==200){
                //delete the custom log from the array
                let delete_item = CustomsList[currentCustom];
                CustomsList = CustomsList.filter(item => item !== delete_item);

                //delete the button
                let customs_bts = document.getElementsByClassName("customs-buttons");
                customs_bts[currentCustom].remove();

                currentCustom=0;


            }else{
                alert("Task didn't Deleted");
            }
        })
        .catch((error) => {
        console.error('Error:', error);
        });
});

//load Task:
window.onload = function(event){

    fetch('/getCustomTask', {  
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        }, 
        body: JSON.stringify({})
        })
        .then(response => response.json())
        .then(data => {
            if(data["status"]==200){
                //obtains the task list
                let tasks = data["task"];
                CustomsList=tasks;
                let log_bar = document.getElementById("log-bar");
                let index = 0;
                //add each task into the box
                tasks.forEach((tmp)=>{
                    let item = document.createElement('button');
                    item.classList.add("buttons");
                    item.classList.add("customs-buttons");
                    item.innerText = tmp["title"];
                    item.style.backgroundColor=tmp["color"];
                    item.setAttribute("index",index);

                    //add event listern to display the content
                    item.addEventListener("click", ()=>{
                        //remove the old content
                        let log_content = document.querySelector(".log-content");
                        log_content.remove();
                        //add the new content
                        let new_content = document.createElement("div");
                        new_content.classList.add("log-content");
                        new_content.innerText = CustomsList[item.getAttribute("index")]["content"];
                        currentCustom = item.getAttribute("index");
                        log.appendChild(new_content);
                    });

                    log_bar.appendChild(item);
                    index++;
                });

            }else{
                alert("Task didn't added");
            }
        })
        .catch((error) => {
        console.error('Error:', error);
        });
}



//adding the custom logs
form.addEventListener("submit",(event)=>{
    event.preventDefault();
    //obtain data
    let title = document.getElementById("title").value;
    let color;
    let sections;
    let content = document.getElementById("content").value;

    //get the color checked value
    let colors_radio = document.getElementsByName('Color');           
    for(let i = 0; i < colors_radio.length; i++) {
        if(colors_radio[i].checked) color = colors_radio[i].value;
    }

     //get the Sections checked value
     let sections_radio = document.getElementsByName('sections');           
     for(let i = 0; i < sections_radio.length; i++) {
         if(sections_radio[i].checked) sections = sections_radio[i].value;
     }

    //status = 1: adding
    if(status == 1){
        let data={title:title,color:color,sections:sections,content:content, date: new Date().toDateString()};
        fetch('/addCustomTask', {  
            method: 'POST',
            headers: {
            "Content-Type": "application/json"
            }, 
            body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(data => {
                if(data["status"]==200){
                    let log_bar = document.getElementById("log-bar");
                    let newTask = data["task"];
                    let index = CustomsList.length;
                    CustomsList.push(newTask);

                    //added component to the html
                    let item = document.createElement('button');
                        item.classList.add("buttons");
                        item.innerText = newTask["title"];
                        item.style.backgroundColor=newTask["color"];
                        item.setAttribute("index",index);

                    //add event listern to display the content
                    item.addEventListener("click", ()=>{
                        //remove the old content
                        let log_content = document.querySelector(".log-content");
                        log_content.remove();
                        //add the new content
                        let new_content = document.createElement("div");
                        new_content.classList.add("log-content");
                        new_content.innerText = CustomsList[item.getAttribute("index")]["content"];
                        currentCustom = item.getAttribute("index");
                        log.appendChild(new_content);
                    });

                    log_bar.appendChild(item);

                }else{
                    alert("Task didn't added");
                }
            })
            .catch((error) => {
            console.error('Error:', error);
        });
    }

    //status = 2: updating
    if(status == 2){
        let data={new:{title:title,color:color,sections:sections,content:content, date: new Date().toDateString()},
        old:CustomsList[currentCustom]
        };
        fetch('/UpdateCustomTask', {  
            method: 'POST',
            headers: {
            "Content-Type": "application/json"
            }, 
            body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(data => {
                if(data["status"]==200){
                    

                }else{
                    alert("Task didn't added");
                }
            })
            .catch((error) => {
            console.error('Error:', error);
        });
    }
 });

 
 //Update Custom Log Content:
 
