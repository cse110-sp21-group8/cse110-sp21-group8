let today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();

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

const prevLastDay = new Date(
  date.getFullYear(),
  date.getMonth(),
  0
).getDate();

const firstDayIndex = date.getDay();

let days = "";
//document.querySelector(".cal-body").innerHTML = months[date.getMonth()];
for (let x = firstDayIndex; x > 0; x--) {
  days += `<div class="prev-date1">${' '}</div>`;
}

for(let i = 1; i <= lastDay; i++){
  days += `<div>${i}</div>`;
  monthDays.innerHTML = days;
}