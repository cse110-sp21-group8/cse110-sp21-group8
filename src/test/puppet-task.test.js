/* global test, expect */
//Puppeter End to End User test.
describe('Daily Tasks tests:', () => {
    beforeAll(async () => {
      jest.setTimeout(35000);
      await page.goto('http://localhost:8080/login');
      const username = await page.$('#email');
      await username.type('test');

    const password = await page.$('#password');
    await password.type('123');
    await page.click('button[type="submit"]');
    await page.click('.widget-content button:nth-child(1)');
  });
  // User login and go to daily log page. Verify it is in daily log page
  it('Test1: User login and go to daily log page. Verify it is in daily log page', async () => {
    const title = await page.evaluate(() => {
      const elem = document.querySelector('title');
      return elem.innerText;
    });
    expect(title).toBe('Daily Log');
  });

  // User click on the add button and would add one shadow elements under today's note
  it('Test2: User click on the add button and would add one shadow elements under today note', async () => {
    const old_entries = await page.$$('task-list');
    const expected_length = old_entries.length + 1;
    await page.click('#add');
    const new_entries = await page.$$('task-list');
    const new_length = new_entries.length;
    expect(new_length).toBe(expected_length);

    //change the task type
    const actual_task = await page.evaluate(() => {
      let lists = document.getElementsByTagName('task-list').length;
      const elem = document
        .querySelector('task-list:nth-child(' + lists + ')')
        .shadowRoot.querySelector('.entry #checklist-select');
      elem.selectedIndex = 2;
      return elem.value;
    });

    //change the task tag
    const actual_task_tag = await page.evaluate(() => {
      let lists = document.getElementsByTagName('task-list').length;
      const elem = document
        .querySelector('task-list:nth-child(' + lists + ')')
        .shadowRoot.querySelector('.entry #tag-select');
      elem.selectedIndex = 2;
      return elem.value;
    });

    //change the task content
    const actual_task_text = await page.evaluate(() => {
      let lists = document.getElementsByTagName('task-list').length;
      const elem = document
        .querySelector('task-list:nth-child(' + lists + ')')
        .shadowRoot.querySelector('.entry #tasks');
      elem.value = 'test content';
      elem.blur();
      return elem.value;
    });

    //User add custom tag
    it('Test3: User add custom tag and check if it appears on the tag list', async () => {
      await page.click('#add-tag');

      const custom_tag= await page.evaluate(() => {
        let random_num = Math.floor(Math.random() * 1000); 
        let tagName = "Random Tag "+random_num;
        let lists = document.getElementsByTagName("custom-tag").length;
        const elem = document.querySelector("custom-tag:nth-child("+lists+")").shadowRoot.querySelector("#custom-tags");
        elem.value = tagName;

        let tagBt = document.querySelector("custom-tag:nth-child("+lists+")").shadowRoot.querySelector("#submit");
        tagBt.click();
        return elem.value;
      });

      //change the task type
      const tagCheck = await page.evaluate(() => {
        let lists = document.getElementsByTagName("task-list").length;
        const elem = document.querySelector("task-list:nth-child("+lists+")").shadowRoot.querySelector(".entry #tag-select option:last-child");
        return elem.value;
      });

      expect(tagCheck).toBe(custom_tag);
    });

    //User add refelction on today
    it('Test4: User add refelction on today', async () => {
      const old_Reflect = await page.evaluate(() => {
        let elem = document.getElementById("reflection");
        return elem.value;
      });

      const reflection = await page.$('#reflection');
      await reflection.type(new Date().toDateString());
      //change the task content
      const Reflect = await page.evaluate(() => {
        let elem = document.getElementById("reflection");
        return elem.value;
      });
      expect(Reflect).toBe(new Date().toDateString()+old_Reflect);

    });

    //User click on the calendar and it shows the tasks correctly
    it('Test5: User click on the calendar and it shows the tasks correctly', async () => {
      

    });
  });
});
