/**
 * @jest-environment jsdom
 */
/* global test: testing user login and signup */
//reference: https://www.albertgao.xyz/2017/05/24/how-to-test-expressjs-with-jest-and-supertest/
//Install: npm install --save-dev babel-cli babel-preset-env jest supertest superagent

//const firstDayIndex = require('../js/futurecal.js');
//const firstDayIndex2 = require('../js/futurecal.js');
//const { firstDayIndex } = require('../js/futurecal.js');
const index = require('../js/futurecal.js');
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

var getDaysInMonth = function(month,year) {

   return new Date(year, month, 0).getDate();

  };

describe('Test future page', () => {
    /*test1*/
    describe('Testing the first day index of each calendar',()=>{
    test('first day index should of May be 6', done =>{
        let a = index["firstDayIndex"];
        expect(a).toEqual(6);
        done();
    })

    test('first day index should of June be 2', done =>{
        let a = index["firstDayIndex2"];
        expect(a).toEqual(2);
        done();
    })
    })
    /* */


    /*test2*/
    describe('Testing if the months showing correctly',()=>{
    test('the current month should be '+ months[(new Date().getMonth())%12], done =>{
        let a = index["month1"];
        expect(a).toBe(months[(new Date().getMonth())%12]);
        done();
    })

    test('the 2nd month should be '+ months[(new Date().getMonth()+1)%12], done =>{
        let a = index["month2"];
        expect(a).toBe(months[(new Date().getMonth()+1)%12]);
        done();
    })

    test('the 3rd month should be '+months[(new Date().getMonth()+2)%12], done =>{
        let c = index["month3"];
        expect(c).toBe(months[(new Date().getMonth()+2)%12]);
        done();
    })

    test('the 4th month should be '+months[(new Date().getMonth()+3)%12], done =>{
        let c = index["month4"];
        expect(c).toBe(months[(new Date().getMonth()+3)%12]);
        done();
    })

    test('the 5th month should be '+months[(new Date().getMonth()+4)%12], done =>{
        let c = index["month5"];
        expect(c).toBe(months[(new Date().getMonth()+4)%12]);
        done();
    })

    test('the 6th month should be '+months[(new Date().getMonth()+5)%12], done =>{
        let c = index["month6"];
        expect(c).toBe(months[(new Date().getMonth()+5)%12]);
        done();
    })
    })
    /* */

    /* test3*/
    describe('Testing if the months have right days',()=>{
    test('the current month should have '+ getDaysInMonth((new Date().getMonth()+1)%12, new Date().getFullYear()) + ' days', done =>{
        let a = index["lastDay"];
        expect(a).toBe(getDaysInMonth((new Date().getMonth()+1)%12, new Date().getFullYear()));
        done();
    })

    test('the next month should have '+ getDaysInMonth((new Date().getMonth()+2)%12, new Date().getFullYear()) + ' days', done =>{
        let a = index["lastDay2"];
        expect(a).toBe(getDaysInMonth((new Date().getMonth()+2)%12, new Date().getFullYear()));
        done();
    })

    test('the 3rd month should have '+ getDaysInMonth((new Date().getMonth()+3)%12, new Date().getFullYear()) + ' days', done =>{
        let a = index["lastDay3"];
        expect(a).toBe(getDaysInMonth((new Date().getMonth()+3)%12, new Date().getFullYear()));
        done();
    })
    
    test('the 4th month should have '+ getDaysInMonth((new Date().getMonth()+4)%12, new Date().getFullYear()) + ' days', done =>{
        let a = index["lastDay4"];
        expect(a).toBe(getDaysInMonth((new Date().getMonth()+4)%12, new Date().getFullYear()));
        done();
    })

    test('the 5th month should have '+ getDaysInMonth((new Date().getMonth()+5)%12, new Date().getFullYear()) + ' days', done =>{
        let a = index["lastDay5"];
        expect(a).toBe(getDaysInMonth((new Date().getMonth()+5)%12, new Date().getFullYear()));
        done();
    })

    test('the 6th month should have '+ getDaysInMonth((new Date().getMonth()+6)%12, new Date().getFullYear()) + ' days', done =>{
        let a = index["lastDay6"];
        expect(a).toBe(getDaysInMonth((new Date().getMonth()+6)%12, new Date().getFullYear()));
        done();
    })
    })
    /* */
})