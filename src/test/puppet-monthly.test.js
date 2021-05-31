
/* global test, expect */
//Puppeter End to End User test.
/*helper array to get months*/
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

/* helper function to get current month*/
var getDaysInMonth = function(month,year) {

   return new Date(year, month, 0).getDate();

  };
/* */ 

describe('Monthly page tests:', () => {
    beforeAll(async () => {
        jest.setTimeout(35000);
        await page.goto('http://localhost:8080');
        const username = await page.$('#email');
        await username.type('test');
  
        const password = await page.$('#password');
        await password.type('123');
        await page.click('button[type="submit"]');
        await page.click('.widget-content button:nth-child(2)');
    });

    // User login and go to daily log page. Verify it is in daily log page
    describe('Testing if the user go to the Monthly page correctly',()=>{
        it('Test1: User login and go to Monthly log page. Verify if it is in Monthly log page', async () => {

            const title = await page.evaluate(() => {
            const elem = document.querySelector('title');
            return elem.innerText;
        });
        expect(title).toBe('Monthly Log');
        });
    })

    // stay on that page and check if each block is showing the correct content
    describe('Testing if the month names are showing correctly',()=>{
        it('Test1: Check if the the 1st month block is showing correctly', async () => {
            const MonthName = await page.evaluate(()=> {                
                const actualShowing = document.getElementById('head1');
                return actualShowing.innerText;
            })
            let firstMonthName = months[new Date().getMonth()];
            let firstDateNum = String(new Date().getDate()).padStart(2, '0');
            let date = new Date(new Date().setDate(new Date().getDate() + 6))
            let SecondMonthName = months[date.getMonth()];
            let SecondDateNum = date.getDate().toString();
            let result = firstMonthName + ' ' + firstDateNum + ' - ' + SecondMonthName + ' ' + SecondDateNum;
            let final = result.toString();
            expect(MonthName).toBe(final);
        });

        it('Test2: Check if the the 2nd month block is showing correctly', async () => {
            const MonthName = await page.evaluate(()=> {                
                const actualShowing = document.getElementById('head2');
                return actualShowing.innerText;
            })
            let datenew = new Date(new Date().setDate(new Date().getDate() + 7));
            let firstMonthName = months[datenew.getMonth()];
            let firstDateNum = Number(datenew.getDate());
            let firstDateNumStr = String(firstDateNum);

            let date = new Date(new Date().setDate(new Date().getDate() + 13))
            let SecondMonthName = months[date.getMonth()];
            let SecondDateNum = Number(date.getDate());
            let SecondDateNumStr = String(SecondDateNum);

            let result = firstMonthName + ' ' + firstDateNumStr + ' - ' + SecondMonthName + ' ' + SecondDateNumStr;
            let final = result.toString();
            expect(MonthName).toBe(final);
        });

        it('Test3: Check if the the 3rd month block is showing correctly', async () => {
            const MonthName = await page.evaluate(()=> {                
                const actualShowing = document.getElementById('head3');
                return actualShowing.innerText;
            })
            let datenew = new Date(new Date().setDate(new Date().getDate() + 14));
            let firstMonthName = months[datenew.getMonth()];
            let firstDateNum = Number(datenew.getDate());
            let firstDateNumStr = String(firstDateNum);

            let date = new Date(new Date().setDate(new Date().getDate() + 20))
            let SecondMonthName = months[date.getMonth()];
            let SecondDateNum = Number(date.getDate());
            let SecondDateNumStr = String(SecondDateNum);

            let result = firstMonthName + ' ' + firstDateNumStr + ' - ' + SecondMonthName + ' ' + SecondDateNumStr;
            let final = result.toString();
            expect(MonthName).toBe(final);
        });

        it('Test4: Check if the the 4th month block is showing correctly', async () => {
            const MonthName = await page.evaluate(()=> {                
                const actualShowing = document.getElementById('head4');
                return actualShowing.innerText;
            })
            let datenew = new Date(new Date().setDate(new Date().getDate() + 21));
            let firstMonthName = months[datenew.getMonth()];
            let firstDateNum = Number(datenew.getDate());
            let firstDateNumStr = String(firstDateNum);

            let date = new Date(new Date().setDate(new Date().getDate() + 27))
            let SecondMonthName = months[date.getMonth()];
            let SecondDateNum = Number(date.getDate());
            let SecondDateNumStr = String(SecondDateNum);

            let result = firstMonthName + ' ' + firstDateNumStr + ' - ' + SecondMonthName + ' ' + SecondDateNumStr;
            let final = result.toString();
            expect(MonthName).toBe(final);
        });
    });


    describe('Testing if the weekdays are showing correctly',()=>{
        it('Test1: Check if the the 1st weekdays block is showing correctly', async () => {
            const WeekName = await page.evaluate(()=> {                
                const actualShowing = document.getElementById('.cal-content div:nth-child(1)');
                return actualShowing.innerText;
            })
            const firstMonthName = months[new Date().getMonth()];
            const firstDateNum = String(new Date().getDate()).padStart(2, '0');
            const date = new Date(new Date().setDate(new Date().getDate() + 6))
            const SecondMonthName = months[date.getMonth()];
            const SecondDateNum = date.getDate().toString();
            const result = firstMonthName + ' ' + firstDateNum + ' - ' + SecondMonthName + ' ' + SecondDateNum;
            const final = result.toString();
            expect(WeekName).toBe('5/31');
        });
    });


})