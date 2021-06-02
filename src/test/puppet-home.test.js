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

describe('Monthly page tests:', () => {
    beforeAll(async () => {
        jest.setTimeout(35000);
        await page.goto('http://localhost:8080');
        const username = await page.$('#email');
        await username.type('test');
  
        const password = await page.$('#password');
        await password.type('123');
        await page.click('button[type="submit"]');
    });

    describe('Testing if the user go to the Home page correctly',()=>{
        it('Test1: User login and stay. Verify if it is in Home page', async () => {

            const title = await page.evaluate(() => {
            const elem = document.querySelector('title');
            return elem.innerText;
        });
        expect(title).toBe('Home Page');
        });
    })

    describe('Testing if the HTML/CSS elements are showing correctly',()=>{
        it('Test1: Check if the the calendar is showing the correct Month name', async () => {
            const monthnum = await page.evaluate(() => {
            const a = document.querySelector('#cal');
            return a.innerText;
            });
            expect(monthnum).toBe(months[(new Date().getMonth())%12]);

        });

        it('Test2: Check if that calendar has correct days', async () => {
            const monthnum = await page.evaluate(() => {
            const numdays = document.querySelector('#calendar > div.widget-content > div > button:nth-child(32)');
            return numdays.innerText;
            });
            let date = new Date();
            let dayNum = new Date(date.getFullYear(), date.getMonth()+1, 0);
            let dayNums = dayNum.getDate();
            let dayNumStr = String(dayNums);
            expect(monthnum).toBe(dayNumStr);

        });

        it('Test3: User add tasks in Daily Log page, what they add will show on Todays Notes', async()=>{
            await page.click('#index > div.widget-content > button:nth-child(1)');
            await page.click('#add');
            
            await page.evaluate(() => {
            let lists = document.getElementsByTagName("task-list").length;
            const elem = document.querySelector("task-list:nth-child("+lists+")").shadowRoot.querySelector(".entry #checklist-select");
            elem.selectedIndex = 2; //Task type to be Note
            
            const elem2 = document.querySelector("task-list:nth-child("+lists+")").shadowRoot.querySelector(".entry #tag-select");
            elem2.selectedIndex = 2; //Tag to be Later*/

            const elem3 = document.querySelector("task-list:nth-child("+lists+")").shadowRoot.querySelector(".entry #tasks");
            elem3.value = "test homepage";
            elem3.blur(); //Input to be "test homepage"
            });
            
            await page.click('.nav-buttons > button:nth-child(1)');
            await new Promise((r) => setTimeout(r,10000));
            const actual_task_text = await page.evaluate(() => {
                let lists = document.getElementsByTagName("task-list").length;
                const elem = document.querySelector("task-list:nth-child("+lists+")").shadowRoot.querySelector(".entry #tasks");
                elem.value = "test homepage";
                elem.blur();
                return elem.value;
              });
      
            expect(actual_task_text).toBe("test homepage");


        })

        it('Test4: Check if the the collections showing tags correctly', async () => {
            const important = await page.evaluate(() => {
                const firstButton = document.querySelector('#tag-button > button:nth-child(1)');
                return firstButton.innerText;
            })
            expect(important).toBe('Important');

            const later = await page.evaluate(() => {
                const secondButton = document.querySelector('#tag-button > button:nth-child(2)');
                return secondButton.innerText;
            })
            expect(later).toBe('Later');

            const interesting = await page.evaluate(() => {
                const thirdButton = document.querySelector('#tag-button > button:nth-child(3)');
                return thirdButton.innerText;
            })
            expect(interesting).toBe('Interesting');
        })
    })
})