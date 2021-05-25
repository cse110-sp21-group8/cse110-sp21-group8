
/* Declaring date variables for each of the boxes */
const date = new Date();
const date2 = new Date(date.getFullYear(), date.getMonth()+1, 1);
const date3 = new Date(date2.getFullYear(), date2.getMonth()+1, 1);
const date4 = new Date(date3.getFullYear(), date3.getMonth()+1, 1);
const date5 = new Date(date4.getFullYear(), date4.getMonth()+1, 1);
const date6 = new Date(date5.getFullYear(), date5.getMonth()+1, 1);
/* */

/* Declaring month variables for each of the boxes */
const monthDays = document.querySelector(".day1");
const monthDays2 = document.querySelector(".day2");
const monthDays3 = document.querySelector(".day3");
const monthDays4 = document.querySelector(".day4");
const monthDays5 = document.querySelector(".day5");
const monthDays6 = document.querySelector(".day6");
/* */

/* Setting the date manually */ 
date.setDate(1);
date2.setDate(1);
date3.setDate(1);
date4.setDate(1);
date5.setDate(1);
date6.setDate(1);
/* */




/* Finding the last day of all the months */ 
const lastDay = new Date(
  date.getFullYear(),
  (date.getMonth() + 1) % 12,
  0
).getDate();
const lastDay2 = new Date(
  date.getFullYear(),
  (date.getMonth() + 2) % 12,
  0
).getDate();
const lastDay3 = new Date(
  date.getFullYear(),
  (date.getMonth() + 3) % 12,
  0
).getDate();
const lastDay4 = new Date(
  date.getFullYear(),
  (date.getMonth() + 4) % 12,
  0
).getDate();
const lastDay5 = new Date(
  date.getFullYear(),
  (date.getMonth() + 5) % 12,
  0
).getDate();
const lastDay6 = new Date(
  date.getFullYear(),
  (date.getMonth() + 6) % 12,
  0
).getDate();
/* */


/* Array of the months */
const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];
/* */

/* Gets the first day of each month */ 
const firstDayIndex = date.getDay();
const firstDayIndex2 = date2.getDay();
const firstDayIndex3 = date3.getDay();
const firstDayIndex4 = date4.getDay();
const firstDayIndex5 = date5.getDay();
const firstDayIndex6 = date6.getDay();
/* */

/*assign each month to a variable for testing purposes*/
let month1 = months[date.getMonth()];
let month2 = months[date.getMonth()+1];
let month3 = months[date.getMonth()+2];
let month4 = months[date.getMonth()+3];
let month5 = months[date.getMonth()+4];
let month6 = months[date.getMonth()+5];
/* */
//window.onload = function(){
document.addEventListener('DOMContentLoaded', () => {



//function init(){
document.querySelector(".whole-cal1 h2").innerHTML = months[date.getMonth()%12];
document.querySelector(".whole-cal2 h2").innerHTML = months[(date.getMonth()+1)%12];
document.querySelector(".whole-cal3 h2").innerHTML = months[(date.getMonth()+2)%12];
document.querySelector(".whole-cal4 h2").innerHTML = months[(date.getMonth()+3)%12];
document.querySelector(".whole-cal5 h2").innerHTML = months[(date.getMonth()+4)%12];
document.querySelector(".whole-cal6 h2").innerHTML = months[(date.getMonth()+5)%12];
//}
//window.onload = init();
/* To be filled with divs of dates in the month */
let days = "";
let days2 = "";
let days3 = "";
let days4 = "";
let days5 = "";
let days6 = "";
/* */



//function init2(){
/* Box 1 */
for (let x = firstDayIndex; x > 0; x--) {
    days += `<div class="prev-date1">${' '}</div>`;
  }

for(let i = 1; i <= lastDay; i++){ 
    days += `<div class = date1${i}>${i}</div>`;
    monthDays.innerHTML = days;

}
/* */

/* Box 2 */
for (let x = firstDayIndex2; x > 0; x--) {
    days2 += `<div class="prev-date2">${' '}</div>`;
  }

for(let i = 1; i <= lastDay2; i++){
    days2 += `<div class = date2${i}>${i}</div>`;
    monthDays2.innerHTML = days2;

}
/* */

/* Box 3 */
for (let x = firstDayIndex3; x > 0; x--) {
    days3 += `<div class="prev-date3">${' '}</div>`;
  }

for(let i = 1; i <= lastDay3; i++){
    days3 += `<div class = date3${i}>${i}</div>`;
    monthDays3.innerHTML = days3;

}
/* */

/* Box 4 */
for (let x = firstDayIndex4; x > 0; x--) {
    days4 += `<div class="prev-date4">${' '}</div>`;
  }

for(let i = 1; i <= lastDay4; i++){
    days4 += `<div class = date4${i}>${i}</div>`;
    monthDays4.innerHTML = days4;

}
/* */

/* Box 5 */
for (let x = firstDayIndex5; x > 0; x--) {
    days5 += `<div class="prev-date5">${' '}</div>`;
  }

for(let i = 1; i <= lastDay5; i++){
    days5 += `<div class = date5${i}>${i}</div>`;
    monthDays5.innerHTML = days5;

}
/* */

/* Box 6 */
for (let x = firstDayIndex6; x > 0; x--) {
    days6 += `<div class="prev-date6">${' '}</div>`;
  }

for(let i = 1; i <= lastDay6; i++){
    days6 += `<div class = date6${i}>${i}</div>`;
    monthDays6.innerHTML = days6;
}
})

/* */


//window.onload = init2();

module.exports={
  firstDayIndex:firstDayIndex,
  firstDayIndex2:firstDayIndex2,
  month1:month1,
  month2:month2,
  month3:month3,
  month4:month4,
  month5:month5,
  month6:month6,
  lastDay:lastDay,
  lastDay2:lastDay2,
  lastDay3:lastDay4,
  lastDay4:lastDay4,
  lastDay5:lastDay5,
  lastDay6:lastDay6,
}