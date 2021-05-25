
describe('User login test:', () => {
    beforeAll(async () => {
      jest.setTimeout(35000);
      await page.goto('http://localhost:8080')
  });
  

    // User login by entering the correct password and password
    it('Test2: User login by entering the correct password and password', async () => {
      const username = await page.$('#email');
      await username.type('test');

      const password = await page.$('#password');
      await password.type('123');
      await page.click('button[type="submit"]');

      const title = await page.evaluate(() => {
        const elem = document.querySelector('title');
        return elem.innerText;
      });
      expect(title).toBe('Home Page');

    });
});