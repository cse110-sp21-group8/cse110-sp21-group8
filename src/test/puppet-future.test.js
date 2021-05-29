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

describe('Future page tests:', () => {
    beforeAll(async () => {
      jest.setTimeout(35000);
      await page.goto('http://localhost:8080');
      const username = await page.$('#email');
      await username.type('test');

      const password = await page.$('#password');
      await password.type('123');
      await page.click('button[type="submit"]');
      await page.click('.widget-content button:nth-child(3)');
    });

    // User login and go to daily log page. Verify it is in daily log page
    describe('Testing if the user go to the future page correctly',()=>{
        it('Test1: User login and go to future log page. Verify it is in future log page', async () => {

            const title = await page.evaluate(() => {
            const elem = document.querySelector('title');
            return elem.innerText;
        });
        expect(title).toBe('Future Log');
        });
    })

    // stay on that page and check if each block is showing the correct content
    describe('Testing if the month names are showing correctly',()=>{
        it('Test1: Check if the the 1st month block is showing correctly', async () => {
            const monthnum = await page.evaluate(() => {
            const a = document.getElementById('month1');
            return a.innerText;
            });
            expect(monthnum).toBe(months[(new Date().getMonth())%12]);

        });

        it('Test2: Check if the the 2nd month block is showing correctly', async () => {
            const monthnum = await page.evaluate(() => {
            const a = document.getElementById('month2');
            return a.innerText;
            });
            expect(monthnum).toBe(months[(new Date().getMonth()+1)%12]);

        });

        it('Test3: Check if the the 3rd month block is showing correctly', async () => {
            const monthnum = await page.evaluate(() => {
            const a = document.getElementById('month3');
            return a.innerText;
            });
            expect(monthnum).toBe(months[(new Date().getMonth()+2)%12]);

        });

        it('Test4: Check if the the 4th month block is showing correctly', async () => {
            const monthnum = await page.evaluate(() => {
            const a = document.getElementById('month4');
            return a.innerText;
            });
            expect(monthnum).toBe(months[(new Date().getMonth()+3)%12]);

        });

        it('Test5: Check if the the 5th month block is showing correctly', async () => {
            const monthnum = await page.evaluate(() => {
            const a = document.getElementById('month5');
            return a.innerText;
            });
            expect(monthnum).toBe(months[(new Date().getMonth()+4)%12]);

        });

        it('Test6: Check if the the 6th month block is showing correctly', async () => {
            const monthnum = await page.evaluate(() => {
            const a = document.getElementById('month6');
            return a.innerText;
            });
            expect(monthnum).toBe(months[(new Date().getMonth()+5)%12]);

        });
    })

    //Check the month days
    describe('Testing if each month block has the right days',()=>{
        it('Test1: Check if the current month have correct days', async () => {
            const monthnum = await page.evaluate(() => {
                var getDaysInMonth = function(month,year) {

                    return new Date(year, month, 0).getDate();
                 
                   };
            let monthdays = getDaysInMonth((new Date().getMonth()+1)%12, new Date().getFullYear());
            //let monthdays = 31;
            let a = '1';
            let b = 'date'     
            let c = b+a+monthdays;   //c should be date131
            const d = document.getElementsByClassName(c);    
            return d[0].innerText;
            });
            expect(monthnum).toBe("31");

        });

        it('Test2: Check if the 2nd month have correct days', async () => {
            
            const monthnum = await page.evaluate(() => {
                var getDaysInMonth = function(month,year) {

                    return new Date(year, month, 0).getDate();
                 
                   };
            let monthdays = getDaysInMonth((new Date().getMonth()+2)%12, new Date().getFullYear());
            let a = '2';
            let b = 'date'     
            let c = b+a+monthdays;  //c should be date230          
            const d = document.getElementsByClassName(c);
            return d[0].innerText;
            });
            expect(monthnum).toBe('30');

        });

        it('Test3: Check if the 3rd month have correct days', async () => {
            
            const monthnum = await page.evaluate(() => {
                var getDaysInMonth = function(month,year) {

                    return new Date(year, month, 0).getDate();
                 
                   };
            let monthdays = getDaysInMonth((new Date().getMonth()+3)%12, new Date().getFullYear());
            let a = '3';
            let b = 'date'     
            let c = b+a+monthdays;            
            const d = document.getElementsByClassName(c);
            return d[0].innerText;
            });
            expect(monthnum).toBe('31');

        });

        it('Test4: Check if the 4th month have correct days', async () => {
            
            const monthnum = await page.evaluate(() => {
                var getDaysInMonth = function(month,year) {

                    return new Date(year, month, 0).getDate();
                 
                   };
            let monthdays = getDaysInMonth((new Date().getMonth()+4)%12, new Date().getFullYear());
            let a = '4';
            let b = 'date'     
            let c = b+a+monthdays;            
            const d = document.getElementsByClassName(c);
            return d[0].innerText;
            });
            expect(monthnum).toBe('31');

        });

        it('Test5: Check if the 5th month have correct days', async () => {
            
            const monthnum = await page.evaluate(() => {
                var getDaysInMonth = function(month,year) {

                    return new Date(year, month, 0).getDate();
                 
                   };
            let monthdays = getDaysInMonth((new Date().getMonth()+5)%12, new Date().getFullYear());
            let a = '5';
            let b = 'date'     
            let c = b+a+monthdays;            
            const d = document.getElementsByClassName(c);
            return d[0].innerText;
            });
            expect(monthnum).toBe('30');

        });

        it('Test6: Check if the 6th month have correct days', async () => {
            
            const monthnum = await page.evaluate(() => {
                var getDaysInMonth = function(month,year) {

                    return new Date(year, month, 0).getDate();
                 
                   };
            let monthdays = getDaysInMonth((new Date().getMonth()+6)%12, new Date().getFullYear());
            let a = '6';
            let b = 'date'     
            let c = b+a+monthdays;            
            const d = document.getElementsByClassName(c);
            return d[0].innerText;
            });
            expect(monthnum).toBe('31');

        });
    })
});