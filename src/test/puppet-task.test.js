/* global test, expect */
//Puppeter End to End User test.
describe('Daily Tasks tests:', () => {
  beforeAll(async () => {
    jest.setTimeout(35000);
    await page.goto('http://localhost:8080');
    const username = await page.$('#email');
    await username.type('admin');

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

    expect(actual_task).toBe('Note');
    expect(actual_task_text).toBe('test content');
    expect(actual_task_tag).toBe('Later');
  });

  //User add custom tag
  it('Test2: User add custom tag', async () => {
    let random_num = Math.floor(Math.random() * 1000);
    let tagName = 'Random Tag ' + random_num;

    const custom_tag = await page.evaluate(() => {
      let lists = document.getElementsByTagName('task-list').length;
      const elem = document
        .querySelector('task-list:nth-child(' + lists + ')')
        .shadowRoot.querySelector('.entry #tasks');
      elem.value = 'test content';
      elem.blur();
      return elem.value;
    });
  });
});
