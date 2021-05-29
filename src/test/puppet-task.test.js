/* global test, expect */
//Puppeter End to End User test.
describe('Daily Tasks tests:', () => {
    beforeAll(async () => {
      jest.setTimeout(35000);
      await page.goto('http://localhost:8080');
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
        const expected_length = old_entries.length+1;
        await page.click('#add');
        const new_entries = await page.$$('task-list');
        const new_length = new_entries.length;
        expect(new_length).toBe(expected_length);
    });


});