/*const date = new Date();
var now = new Date();
current = new Date(now.getFullYear(), now.getMonth()+1, 1);

date.setDate(2);
console.log(date.getDay());
console.log(current);*/


const date = new Date();
const date2 = new Date(date.getFullYear(), date.getMonth()+1, 1);
const date3 = new Date(date2.getFullYear(), date2.getMonth()+1, 1);
const date4 = new Date(date3.getFullYear(), date3.getMonth()+1, 1);
const date5 = new Date(date4.getFullYear(), date4.getMonth()+1, 1);
const date6 = new Date(date5.getFullYear(), date5.getMonth()+1, 1);

date.setDate(1);
date2.setDate(1);
date3.setDate(1);
date4.setDate(1);
date5.setDate(1);
date6.setDate(1);


const firstDayIndex = date.getDay();
const firstDayIndex2 = date2.getDay();
const firstDayIndex3 = date3.getDay();
const firstDayIndex4 = date4.getDay();
const firstDayIndex5 = date5.getDay();
const firstDayIndex6 = date6.getDay();
console.log(firstDayIndex);
console.log(firstDayIndex2);
console.log(firstDayIndex3);
console.log(firstDayIndex4);
console.log(firstDayIndex5);
console.log(firstDayIndex6);

