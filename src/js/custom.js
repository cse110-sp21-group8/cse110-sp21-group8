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
        let tags = document.getElementById("tags");
        tags.value = current_log["tags"];
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
        Updating.innerText="Update Custom Log";
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
               // alert("Task didn't Deleted");
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
                        currentCustom = item.getAttribute("index");
                        //remove the old content
                        let log_content = document.querySelector(".log-content");
                        log_content.remove();
                        //add the new content
                        let new_content = document.createElement("div");
                        new_content.classList.add("log-content");

                        //subitems:
                        //1) title:
                        let c_title = document.createElement("span");
                        c_title.innerText = "Title:";
                        let c_title_content = document.createElement("span");
                        c_title_content.innerText = CustomsList[item.getAttribute("index")]["content"];
                        
                        //2) color:
                        let c_color = document.createElement("span");
                        c_color.innerText = "Color:";
                        let c_color_content = document.createElement("span");
                        c_color_content.innerText = CustomsList[item.getAttribute("index")]["color"];

                        //3) section:
                        let c_section = document.createElement("span");
                        c_section.innerText = "section:";
                        let c_section_content = document.createElement("span");
                        c_section_content.innerText = CustomsList[item.getAttribute("index")]["sections"];

                          //4) content:
                          let c_content = document.createElement("span");
                          c_content.innerText = "content:";
                          let c_content_content = document.createElement("span");
                          c_content_content.innerText = CustomsList[item.getAttribute("index")]["content"];

                          //4) tags:
                          let c_tags = document.createElement("span");
                          c_tags.innerText = "tags:";
                          let c_tags_content = document.createElement("span");
                          c_tags_content.innerText = CustomsList[item.getAttribute("index")]["tags"];

                        new_content.appendChild(c_title);
                        new_content.appendChild(c_title_content);
                        new_content.appendChild(document.createElement("br"));
                        new_content.appendChild(c_tags);
                        new_content.appendChild(c_tags_content);
                        new_content.appendChild(document.createElement("br"));
                        new_content.appendChild(c_color);
                        new_content.appendChild(c_color_content);
                        new_content.appendChild(document.createElement("br"));
                        new_content.appendChild(c_section);
                        new_content.appendChild(c_section_content);
                        new_content.appendChild(document.createElement("br"));
                        new_content.appendChild(c_content);
                        new_content.appendChild(c_content_content);
                        log.appendChild(new_content);
                    });

                    log_bar.appendChild(item);
                    index++;
                });

            }else{
                //("Task didn't added");
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
    let tags = document.getElementById("tags").value;
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
        let data={title:title,tags:tags,color:color,sections:sections,content:content, date: new Date().toDateString()};
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
                        item.classList.add("customs-buttons");
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
 
                         //subitems:
                         //1) title:
                         let c_title = document.createElement("span");
                         c_title.innerText = "Title:";
                         let c_title_content = document.createElement("span");
                         c_title_content.innerText = CustomsList[item.getAttribute("index")]["content"];
                         
                         //2) color:
                         let c_color = document.createElement("span");
                         c_color.innerText = "Color:";
                         let c_color_content = document.createElement("span");
                         c_color_content.innerText = CustomsList[item.getAttribute("index")]["color"];
 
                         //3) section:
                         let c_section = document.createElement("span");
                         c_section.innerText = "section:";
                         let c_section_content = document.createElement("span");
                         c_section_content.innerText = CustomsList[item.getAttribute("index")]["sections"];
 
                           //4) content:
                           let c_content = document.createElement("span");
                           c_content.innerText = "content:";
                           let c_content_content = document.createElement("span");
                           c_content_content.innerText = CustomsList[item.getAttribute("index")]["content"];
 
                         new_content.appendChild(c_title);
                         new_content.appendChild(c_title_content);
                         new_content.appendChild(document.createElement("br"));
                         new_content.appendChild(c_color);
                         new_content.appendChild(c_color_content);
                         new_content.appendChild(document.createElement("br"));
                         new_content.appendChild(c_section);
                         new_content.appendChild(c_section_content);
                         new_content.appendChild(document.createElement("br"));
                         new_content.appendChild(c_content);
                         new_content.appendChild(c_content_content);
                         log.appendChild(new_content);
                    });

                    log_bar.appendChild(item);

                    //return
                    Adding.click();

                }else{
                    //alert("Task didn't added");
                }
            })
            .catch((error) => {
            console.error('Error:', error);
        });
    }

    //status = 2: updating
    if(status == 2){
        let update_data={new:{title:title,tags:tags,color:color,sections:sections,content:content, date: new Date().toDateString()},
        old:CustomsList[currentCustom]
        };
        fetch('/UpdateCustomTask', {  
            method: 'POST',
            headers: {
            "Content-Type": "application/json"
            }, 
            body: JSON.stringify(update_data)
            })
            .then(response => response.json())
            .then(data => {
                if(data["status"]==200){
                    //update the CustomsList first
                    CustomsList[currentCustom] = update_data["new"];
                
                    let c_index = parseInt(currentCustom)+1;
                    //update the tags:
                    let tmp = "button:nth-child("+c_index+")";
                    console.log(tmp);
                    let item = document.querySelector(tmp);
                    item.innerText = (CustomsList[currentCustom])["title"];
                    item.style.backgroundColor =  (CustomsList[currentCustom])["color"];
                    

                    //return
                    Updating.click();

                }else{
                    //alert("Task didn't added");
                }
            })
            .catch((error) => {
            console.error('Error:', error);
        });
    }
 });

 
 //Update Custom Log Content:
 
