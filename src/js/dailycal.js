
let today = new Date();
let currentMonth = today.getMonth();

let months = [ "January", "February", "March", "April", "May", "June", 
"July", "August", "September", "October", "November", "December" ];

let monthName = months[currentMonth];
document.getElementById("cal").innerHTML = monthName;

const date = new Date();

const monthDays = document.querySelector(".cal-body");

date.setDate(1);

const lastDay = new Date(
  date.getFullYear(),
  date.getMonth() + 1,
  0
).getDate();

const firstDayIndex = date.getDay();

let days = "";
for (let x = firstDayIndex; x > 0; x--) {
  days += `<div class="prev-date1">${' '}</div>`;
}

for(let i = 1; i <= lastDay; i++){
  days += `<div class="day">${i}</div>`;
  monthDays.innerHTML = days;
}