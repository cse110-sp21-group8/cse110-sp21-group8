let form = document.querySelector('form');
form.addEventListener('submit', (event) => {
  event.preventDefault();
  let name = document.getElementById('name').value;
  let password = document.getElementById('password').value;
  let username = document.getElementById('email').value;
  let confirmPassword = document.getElementById('confirmPassword').value;

  //if password is different from confirmPassword
  if (password != confirmPassword) {
    alert('Password is different from confirm password!');
    return false;
  }

  data = {username: username, password: password, name: name};
  fetch('/user_signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then((response) => response.json())
    .then((data) => {
      if (data['user_status'] == 200) {
        window.location = '/';
      } else {
        alert('Username do not match password');
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
});
