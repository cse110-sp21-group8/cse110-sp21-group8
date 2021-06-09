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

describe('Monthly page tests:', () => {
  beforeAll(async () => {
    jest.setTimeout(35000);
    await page.goto('http://localhost:8080/login');
    const username = await page.$('#email');
    await username.type('test');

    const password = await page.$('#password');
    await password.type('123');
    await page.click('button[type="submit"]');
  });

  // User login and go to daily log page. Verify it is in daily log page
  describe('Testing if the user go to the Monthly page correctly', () => {
    it('Test1: User login and go to Monthly log page. Verify if it is in Monthly log page', async () => {
      await page.waitFor(500);
      await page.click('#index > div.widget-content > button:nth-child(2)');
      const title = await page.evaluate(() => {
        const elem = document.querySelector('title');
        return elem.innerText;
      });
      expect(title).toBe('Monthly Log');
    });
  });

  // stay on that page and check if each block is showing the correct content
  describe('Testing if the month names are showing correctly', () => {
    it('Test1: Check if the the 1st month block is showing correctly', async () => {
      const MonthName = await page.evaluate(() => {
        const actualShowing = document.getElementById('head1');
        return actualShowing.innerText;
      });
      let datenew = new Date(new Date().setDate(new Date().getDate()));
      let firstMonthName = months[datenew.getMonth()];
      let firstDateNum = Number(datenew.getDate());
      let firstDateNumStr = String(firstDateNum);

      let date = new Date(new Date().setDate(new Date().getDate() + 6));
      let SecondMonthName = months[date.getMonth()];
      let SecondDateNum = Number(date.getDate());
      let SecondDateNumStr = String(SecondDateNum);

      let result =
        firstMonthName +
        ' ' +
        firstDateNumStr +
        ' - ' +
        SecondMonthName +
        ' ' +
        SecondDateNumStr;
      let final = result.toString();
      expect(MonthName).toBe(final);
    });

    it('Test2: Check if the the 2nd month block is showing correctly', async () => {
      const MonthName = await page.evaluate(() => {
        const actualShowing = document.getElementById('head2');
        return actualShowing.innerText;
      });
      let datenew = new Date(new Date().setDate(new Date().getDate() + 7));
      let firstMonthName = months[datenew.getMonth()];
      let firstDateNum = Number(datenew.getDate());
      let firstDateNumStr = String(firstDateNum);

      let date = new Date(new Date().setDate(new Date().getDate() + 13));
      let SecondMonthName = months[date.getMonth()];
      let SecondDateNum = Number(date.getDate());
      let SecondDateNumStr = String(SecondDateNum);

      let result =
        firstMonthName +
        ' ' +
        firstDateNumStr +
        ' - ' +
        SecondMonthName +
        ' ' +
        SecondDateNumStr;
      let final = result.toString();
      expect(MonthName).toBe(final);
    });

    it('Test3: Check if the the 3rd month block is showing correctly', async () => {
      const MonthName = await page.evaluate(() => {
        const actualShowing = document.getElementById('head3');
        return actualShowing.innerText;
      });
      let datenew = new Date(new Date().setDate(new Date().getDate() + 14));
      let firstMonthName = months[datenew.getMonth()];
      let firstDateNum = Number(datenew.getDate());
      let firstDateNumStr = String(firstDateNum);

      let date = new Date(new Date().setDate(new Date().getDate() + 20));
      let SecondMonthName = months[date.getMonth()];
      let SecondDateNum = Number(date.getDate());
      let SecondDateNumStr = String(SecondDateNum);

      let result =
        firstMonthName +
        ' ' +
        firstDateNumStr +
        ' - ' +
        SecondMonthName +
        ' ' +
        SecondDateNumStr;
      let final = result.toString();
      expect(MonthName).toBe(final);
    });

    it('Test4: Check if the the 4th month block is showing correctly', async () => {
      const MonthName = await page.evaluate(() => {
        const actualShowing = document.getElementById('head4');
        return actualShowing.innerText;
      });
      let datenew = new Date(new Date().setDate(new Date().getDate() + 21));
      let firstMonthName = months[datenew.getMonth()];
      let firstDateNum = Number(datenew.getDate());
      let firstDateNumStr = String(firstDateNum);

      let date = new Date(new Date().setDate(new Date().getDate() + 27));
      let SecondMonthName = months[date.getMonth()];
      let SecondDateNum = Number(date.getDate());
      let SecondDateNumStr = String(SecondDateNum);

      let result =
        firstMonthName +
        ' ' +
        firstDateNumStr +
        ' - ' +
        SecondMonthName +
        ' ' +
        SecondDateNumStr;
      let final = result.toString();
      expect(MonthName).toBe(final);
    });
  });

  describe('Testing if the weekdays are showing correctly', () => {
    it('Test1: Check if the the 1st weekdays block is showing correctly', async () => {
      const WeekName = await page.evaluate(() => {
        const actualShowing = document.querySelector(
          '#week-num1 > div:nth-child(1)'
        );
        return actualShowing.innerText;
      });
      let datenew = new Date(new Date().setDate(new Date().getDate()));
      let firstMonthName = String(datenew.getMonth() + 1);
      let firstDateNum = datenew.getDate();
      let result = firstMonthName + '/' + firstDateNum;
      expect(WeekName).toBe(result);
    });

    it('Test2: Check if the the 2nd weekdays block is showing correctly', async () => {
      const WeekName = await page.evaluate(() => {
        const actualShowing = document.querySelector(
          '#week-num2 > div:nth-child(1)'
        );
        return actualShowing.innerText;
      });
      let datenew = new Date(new Date().setDate(new Date().getDate() + 7));
      let firstMonthName = String(datenew.getMonth() + 1);
      let firstDateNum = datenew.getDate();
      let result = firstMonthName + '/' + firstDateNum;
      expect(WeekName).toBe(result);
    });

    it('Test3: Check if the the 3rd weekdays block is showing correctly', async () => {
      const WeekName = await page.evaluate(() => {
        const actualShowing = document.querySelector(
          '#week-num3 > div:nth-child(1)'
        );
        return actualShowing.innerText;
      });
      let datenew = new Date(new Date().setDate(new Date().getDate() + 14));
      let firstMonthName = String(datenew.getMonth() + 1);
      let firstDateNum = datenew.getDate();
      let result = firstMonthName + '/' + firstDateNum;
      expect(WeekName).toBe(result);
    });

    it('Test4: Check if the the 4rd weekdays block is showing correctly', async () => {
      const WeekName = await page.evaluate(() => {
        const actualShowing = document.querySelector(
          '#week-num4 > div:nth-child(1)'
        );
        return actualShowing.innerText;
      });
      let datenew = new Date(new Date().setDate(new Date().getDate() + 21));
      let firstMonthName = String(datenew.getMonth() + 1);
      let firstDateNum = datenew.getDate();
      let result = firstMonthName + '/' + firstDateNum;
      expect(WeekName).toBe(result);
    });
  });

  describe('Testing user interaction', () => {
    it('Test1: User clicks the plus button, a window would pop up properly', async () => {
      const old_entries = await page.$$('task-list');
      const expected_length = old_entries.length + 1;
      await page.click('#add');
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
        elem.selectedIndex = 2;
        return elem.value;
      });
      expect(actual_task).toBe('Note');
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

    it('Test4: After the textbox pops up, test if the delete button works properly', async () => {
      /*const old_entries = await page.$$('task-list');
      const expected_length = old_entries.length - 2;
      //let shadow = document.querySelector("task-list").shadowRoot;
      //let delete_btn = shadow.querySelector('#delete');
      //await page.click(delete_btn);
      await page.$eval("task-list", tasklist => {tasklist.shadowRoot.querySelector("#delete").click()});
      const new_entries = await page.$$('task-list');
      const new_length = new_entries.length;
      expect(new_length).toBe(expected_length);*/
    });
  });

  //console.timer()
  //trace
  //running forever

  describe('Monthly Page Navigation Test', () => {
    it('Test1: User click the Home button and go to the Home page:', async () => {
      /*await page.click('body > div > div > button:nth-child(1)');

      const title = await page.evaluate(() => {
        const elem = document.querySelector('.nav-bar > .log');
        return elem.innerText;
      });
      expect(title).toBe('Home Page');*/
    });

    it('Test2: User click the Monthly Log button and go back to the Mongthly page:', async () => {
      //await page.click('#index > div.widget-content > button:nth-child(2)');
      /*await page.goBack();
      const title = await page.evaluate(() => {
        const elem = document.querySelector('.nav-bar > .log');
        return elem.innerText;
      });
      expect(title).toBe('Monthly Log');*/
    });

    it('Test3: User click the Daily Log button and go to the Daily Log page:', async () => {
      /*await page.click('body > div > div > button:nth-child(2)');

      const title = await page.evaluate(() => {
        const elem = document.querySelector('.nav-bar > .log');
        return elem.innerText;
      });
      expect(title).toBe('Daily Log');*/
    });

    it('Test4: User click the Monthly Log button and go back to the Mongthly page:', async () => {
      /* await page.goBack();
      const title = await page.evaluate(() => {
        const elem = document.querySelector('.nav-bar > .log');
        return elem.innerText;
      });
      expect(title).toBe('Monthly Log');*/
    });

    it('Test5: User click the Future Log button and go to the Future page:', async () => {
      /*await page.click('body > div > div > button:nth-child(3)');

      const title = await page.evaluate(() => {
        const elem = document.querySelector('body > div.nav-bar > h1');
        return elem.innerText;
      });
      expect(title).toBe('Future Log');*/
    });

    it('Test6: User click the back button and go back to the Monthly page:', async () => {
      /*await page.goBack();

      const title = await page.evaluate(() => {
        const elem = document.querySelector('.nav-bar > .log');
        return elem.innerText;
      });
      expect(title).toBe('Monthly Log');*/
    });
  });
});
