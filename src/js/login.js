
let form = document.querySelector('form');
form.addEventListener('submit', (event)=>{
    event.preventDefault();
    let username = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    data = {username:username,password:password};
    fetch('/user_login', {  
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        }, 
        body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            if(data["user_status"]==200){
                window.location = "/";
            }else{
                alert("Username do not match password");
            }
        })
        .catch((error) => {
        console.error('Error:', error);
        });
});