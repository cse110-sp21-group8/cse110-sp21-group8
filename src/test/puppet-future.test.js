//Puppeter End to End User test.

/*helper array to get months*/
const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];
/* */

describe('Future page tests:', () => {
  beforeAll(async () => {
    jest.setTimeout(50000);
    await page.goto('http://localhost:8080');
    const username = await page.$('#email');
    await username.type('test');

    const password = await page.$('#password');
    await password.type('123');
    await page.click('button[type="submit"]');
    await page.click('#index > div.widget-content > button:nth-child(3)');
  });

  describe('Testing if the user go to the future page correctly', () => {
    it('Test1: User login and go to future log page. Verify it is in future log page', async () => {
      const title = await page.evaluate(() => {
        const elem = document.querySelector('title');
        return elem.innerText;
      });
      expect(title).toBe('Future Log');
    });
  });

  describe('Testing if the month names are showing correctly', () => {
    it('Test1: Check if the the 1st month block is showing correctly', async () => {
      const monthnum = await page.evaluate(() => {
        const a = document.getElementById('month1');
        return a.innerText;
      });
      expect(monthnum).toBe(months[new Date().getMonth() % 12]);
    });

    it('Test2: Check if the the 2nd month block is showing correctly', async () => {
      const monthnum = await page.evaluate(() => {
        const a = document.getElementById('month2');
        return a.innerText;
      });
      expect(monthnum).toBe(months[(new Date().getMonth() + 1) % 12]);
    });

    it('Test3: Check if the the 3rd month block is showing correctly', async () => {
      const monthnum = await page.evaluate(() => {
        const a = document.getElementById('month3');
        return a.innerText;
      });
      expect(monthnum).toBe(months[(new Date().getMonth() + 2) % 12]);
    });

    it('Test4: Check if the the 4th month block is showing correctly', async () => {
      const monthnum = await page.evaluate(() => {
        const a = document.getElementById('month4');
        return a.innerText;
      });
      expect(monthnum).toBe(months[(new Date().getMonth() + 3) % 12]);
    });

    it('Test5: Check if the the 5th month block is showing correctly', async () => {
      const monthnum = await page.evaluate(() => {
        const a = document.getElementById('month5');
        return a.innerText;
      });
      expect(monthnum).toBe(months[(new Date().getMonth() + 4) % 12]);
    });

    it('Test6: Check if the the 6th month block is showing correctly', async () => {
      const monthnum = await page.evaluate(() => {
        const a = document.getElementById('month6');
        return a.innerText;
      });
      expect(monthnum).toBe(months[(new Date().getMonth() + 5) % 12]);
    });
  });

  //Check the month days
  describe('Testing if each month block has the right days', () => {
    it('Test1: Check if the current month have correct days', async () => {
      const monthnum = await page.evaluate(() => {
        var getDaysInMonth = function (month, year) {
          return new Date(year, month, 0).getDate();
        };
        let monthdays = getDaysInMonth(
          (new Date().getMonth() + 1) % 12,
          new Date().getFullYear()
        );
        //let monthdays = 31;
        let a = '1';
        let b = 'date';
        let c = b + a + monthdays; //c should be date131
        const d = document.getElementsByClassName(c);
        return d[0].innerText;
      });
      expect(monthnum).toBe('30');
    });

    it('Test2: Check if the 2nd month have correct days', async () => {
      const monthnum = await page.evaluate(() => {
        var getDaysInMonth = function (month, year) {
          return new Date(year, month, 0).getDate();
        };
        let monthdays = getDaysInMonth(
          (new Date().getMonth() + 2) % 12,
          new Date().getFullYear()
        );
        let a = '2';
        let b = 'date';
        let c = b + a + monthdays; //c should be date230
        const d = document.getElementsByClassName(c);
        return d[0].innerText;
      });
      expect(monthnum).toBe('31');
    });

    it('Test3: Check if the 3rd month have correct days', async () => {
      const monthnum = await page.evaluate(() => {
        var getDaysInMonth = function (month, year) {
          return new Date(year, month, 0).getDate();
        };
        let monthdays = getDaysInMonth(
          (new Date().getMonth() + 3) % 12,
          new Date().getFullYear()
        );
        let a = '3';
        let b = 'date';
        let c = b + a + monthdays;
        const d = document.getElementsByClassName(c);
        return d[0].innerText;
      });
      expect(monthnum).toBe('31');
    });

    it('Test4: Check if the 4th month have correct days', async () => {
      const monthnum = await page.evaluate(() => {
        var getDaysInMonth = function (month, year) {
          return new Date(year, month, 0).getDate();
        };
        let monthdays = getDaysInMonth(
          (new Date().getMonth() + 4) % 12,
          new Date().getFullYear()
        );
        let a = '4';
        let b = 'date';
        let c = b + a + monthdays;
        const d = document.getElementsByClassName(c);
        return d[0].innerText;
      });
      expect(monthnum).toBe('30');
    });

    it('Test5: Check if the 5th month have correct days', async () => {
      const monthnum = await page.evaluate(() => {
        var getDaysInMonth = function (month, year) {
          return new Date(year, month, 0).getDate();
        };
        let monthdays = getDaysInMonth(
          (new Date().getMonth() + 5) % 12,
          new Date().getFullYear()
        );
        let a = '5';
        let b = 'date';
        let c = b + a + monthdays;
        const d = document.getElementsByClassName(c);
        return d[0].innerText;
      });
      expect(monthnum).toBe('31');
    });

    it('Test6: Check if the 6th month have correct days', async () => {
      const monthnum = await page.evaluate(() => {
        var getDaysInMonth = function (month, year) {
          return new Date(year, month, 0).getDate();
        };
        let monthdays = getDaysInMonth(
          (new Date().getMonth() + 6) % 12,
          new Date().getFullYear()
        );
        let a = '6';
        let b = 'date';
        let c = b + a + monthdays;
        const d = document.getElementsByClassName(c);
        return d[0].innerText;
      });
      expect(monthnum).toBe('30');
    });
  });

  describe('Testing user interaction', () => {
    it('Test1: User clicks a date, a window would pop up properly', async () => {
      const old_entries = await page.$$('task-list');
      const expected_length = old_entries.length + 1;
      await page.click(
        'body > div.container > div.left > div > div.whole-cal1 > div.day1 > div.date11'
      );
      const new_entries = await page.$$('task-list');
      const new_length = new_entries.length;
      expect(new_length).toBe(expected_length);
    });

    it('Test2: After the textbox pops up, test if the task selecting feature works properly', async () => {
      const actual_task = await page.evaluate(() => {
        let lists = document.getElementsByTagName('task-list').length;
        const elem = document
          .querySelector('task-list:nth-child(' + lists + ')')
          .shadowRoot.querySelector('.entry #checklist-select');
        elem.selectedIndex = 1;
        return elem.value;
      });
      expect(actual_task).toBe('Event');
    });

    it('Test3: After the textbox pops up, test if the task input feature works properly', async () => {
      const actual_task_text = await page.evaluate(() => {
        let lists = document.getElementsByTagName('task-list').length;
        const elem = document
          .querySelector('task-list:nth-child(' + lists + ')')
          .shadowRoot.querySelector('.entry #tasks');
        elem.value = 'testing input';
        elem.blur();
        return elem.value;
      });
      expect(actual_task_text).toBe('testing input');
    });

    it('Test4: After the textbox pops up, test if the task tag selecting feature works properly', async () => {
      const actual_task_tag = await page.evaluate(() => {
        let lists = document.getElementsByTagName('task-list').length;
        const elem = document
          .querySelector('task-list:nth-child(' + lists + ')')
          .shadowRoot.querySelector('.entry #tag-select');
        elem.selectedIndex = 2;
        return elem.value;
      });
      expect(actual_task_tag).toBe('Later');
    });
    /*
        it('Test5: After the textbox pops up, test if the add button works properly', async () => {
            const old_entries = await page.$$('task-list');
            const expected_length = old_entries.length;
            //const next = await page.waitForSelector('#status'); await next.click();
            
            await page.click('#status');
            const new_entries = await page.$$('task-list');
            const new_length = new_entries.length;
            expect(new_length).toBe(expected_length);
        })

        it('Test6: After the textbox pops up, test if the delete button works properly', async () => {
            const old_entries = await page.$$('task-list');
            const expected_length = old_entries.length-1;
            await page.click('#delete');
            const new_entries = await page.$$('task-list');
            const new_length = new_entries.length;
            expect(new_length).toBe(expected_length);
        })
  */
  });
  /*
    describe('Future Page Navigation Test',()=>{

        it('Test1: User click the Home button and go to the Home page:', async () => {

            await page.click('body > div.nav-bar > div > button:nth-child(1)');
      
            const title = await page.evaluate(() => {
            const elem = document.querySelector('title');
            return elem.innerText;
            });
            expect(title).toBe('Home Page');
            
        });

        it('Test2: User click the back button and go back to the Future page:', async () => {

            await page.goBack();
      
            const title = await page.evaluate(() => {
            const elem = document.querySelector('title');
            return elem.innerText;
            });
            expect(title).toBe('Future Log');
            
        });

        it('Test3: User click the Daily Log button and go to the Daily Log page:', async () => {

            await page.click('body > div.nav-bar > div > button:nth-child(2)');
      
            const title = await page.evaluate(() => {
            const elem = document.querySelector('title');
            return elem.innerText;
            });
            expect(title).toBe('Daily Log');
            
        });

        it('Test4: User click the back button and go back to the Future page:', async () => {

            await page.goBack();
      
            const title = await page.evaluate(() => {
            const elem = document.querySelector('title');
            return elem.innerText;
            });
            expect(title).toBe('Future Log');
           
        });

        it('Test5: User click the Monthly Log button and go to the Monthly page:', async () => {

            await page.click('body > div.nav-bar > div > button:nth-child(3)');
      
            const title = await page.evaluate(() => {
            const elem = document.querySelector('title');
            return elem.innerText;
            });
            expect(title).toBe('Monthly Log');
            
        });

        it('Test6: User click the back button and go back to the Future page:', async () => {

            await page.goBack();
      
            const title = await page.evaluate(() => {
            const elem = document.querySelector('title');
            return elem.innerText;
            });
            expect(title).toBe('Future Log');
            
        });
    })*/
});
