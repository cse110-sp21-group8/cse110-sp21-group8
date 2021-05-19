
/* Gets current day and month */ 
let today = new Date();
let currentMonth = today.getMonth();

/* Array of months and week days to get names */ 
let months = [ "January", "February", "March", "April", "May", "June", 
"July", "August", "September", "October", "November", "December" ];
let weekDay = [ "Sat", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sun"];


/* Gets the last day of this month */
let date = new Date();
date.setDate(1);
const lastDay = new Date(
  date.getFullYear(),
  (date.getMonth() + 1) % 7,
  0
).getDate();

/* Declarations */
let findDay = today.getDay();
let numDay;
let fDay;
let lDay;
let fMonth;
let lMonth;
let currMonth = 0;
let actualDate = today.getDate();

/* Code to get the weekly dates. First day will always be current day. */
for(let i = 1; i <= 4; i++){

  /*Getting the elements of the week-day/week-num/head of calendar */ 
  let divHead = 'head' + i
  let divPart = 'week-day' + i;
  let divNum = 'week-num' + i;
  let wDays = document.getElementById(divPart);
  let wNum = document.getElementById(divNum);
  let wHead = document.getElementById(divHead);

  /* Loops until the last day */ 
  for(let k = today.getDate(); k <= lastDay; k++){
    fDay = actualDate;
    fMonth = months[(currentMonth + currMonth) % 12];

    /* Fills in the week */ 
    for(let j = 0; j < 7; j++){
      let toDay = document.createElement('div');
      let wordDay = weekDay[findDay % 7];
      toDay.innerHTML = wordDay;

      let toNum = document.createElement('div');

      /* If it reaches past the last day then it will go into the next month */ 
      actualDate = actualDate % lastDay;
      if(actualDate == 0){
        actualDate = lastDay;
        numDay = ((currentMonth + currMonth + 1) % 12) + "/" + actualDate;
        currMonth++;
      }
      else{
        numDay = ((currentMonth + currMonth + 1) % 12) + "/" + actualDate;
      }
      lMonth = months[(currentMonth + currMonth) % 12];
      lDay = actualDate;
      toNum.innerHTML = numDay;

      /* Appends the new div sections into the parent div */ 
      wDays.appendChild(toDay);
      wNum.appendChild(toNum);
      actualDate++;
      findDay++;
    }
    k = actualDate;

    /* Filling in the header */
    wHead.innerHTML = fMonth + " " + fDay + " - " +  lMonth + " " + lDay;
    break;
  }

}
