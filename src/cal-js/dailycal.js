module.exports = {
  "globals": {
    "document": true
  },
}

let today = new Date();
let currentMonth = today.getMonth();

/* Declarations of months */ 
let months = [ "January", "February", "March", "April", "May", "June", 
"July", "August", "September", "October", "November", "December" ];

let monthName = months[currentMonth];
document.getElementById("cal").innerHTML = monthName;

const date = new Date();

const monthDays = document.querySelector(".cal-body");

/* Gets the last day of the month */ 
date.setDate(1);
const lastDay = new Date(
  date.getFullYear(),
  date.getMonth() + 1,
  0
).getDate();

const firstDayIndex = date.getDay();

/* Creates the calendar */
let days = "";
for (let x = firstDayIndex; x > 0; x--) {
  days += `<div class="prev-date1">${' '}</div>`;
}

for(let i = 1; i <= lastDay; i++){
  days += `<div>${i}</div>`;
  monthDays.innerHTML = days;
}