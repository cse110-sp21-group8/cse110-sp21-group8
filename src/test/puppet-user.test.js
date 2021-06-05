/* global expect */
//Puppeter End to End User test.
describe('User test:', () => {
  beforeAll(async () => {
    //jest.setTimeout(35000);
    await page.goto('http://localhost:8080/login');
  });
  // User login by entering the correct password and password: verify by the home page title
  it('Test1: User login by entering the correct password and password', async () => {
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

  // User go to signup page: verify with title to be sign up
  it('Test2: User go to signup page', async () => {
    await page.goto('http://localhost:8080/signup');
    const title = await page.evaluate(() => {
      const elem = document.querySelector('title');
      return elem.innerText;
    });
    expect(title).toBe('Sign Up');
  });

  // User signup: verify with matched Home page title
  it('Test3: User signup', async () => {
    let random_num = Math.floor(Math.random() * 1000);
    const name = await page.$('#name');
    await name.type('test user' + random_num);

    const username = await page.$('#email');
    await username.type('user' + random_num);

    const password = await page.$('#password');
    await password.type('123');

    const confirmPassword = await page.$('#confirmPassword');
    await confirmPassword.type('123');

    await page.click('button[type="submit"]');

    const title = await page.evaluate(() => {
      const elem = document.querySelector('title');
      return elem.innerText;
    });
    expect(title).toBe('Home Page');
  });
});

describe('Home Page Navigation testing', () => {
  // User click the Daily Log button and go to the daily log page:
  it('Test4: User click the Daily Log button and go to the daily log page:', async () => {
    await page.click('#index > div.widget-content > button:nth-child(1)');

    const title = await page.evaluate(() => {
      const elem = document.querySelector('title');
      return elem.innerText;
    });
    expect(title).toBe('Daily Log');
  });

  // User click the Home button and would go back to the home page from daily log:
  it('Test5: User click the Home button and go back to the home page from daily log:', async () => {
    //await page.click('.home-button button:nth-child(1)');
    await page.click('body > div.nav-bar > div > button:nth-child(1)');
    const title = await page.evaluate(() => {
      const elem = document.querySelector('title');
      return elem.innerText;
    });
    expect(title).toBe('Home Page');
  });

  // User click the Monthly Log button and go to the Monthly Log page:
  it('Test6: User click the Monthly Log button and go to the Monthly Log page:', async () => {
    //await page.click('.widget-content button:nth-child(2)');
    await page.click('#index > div.widget-content > button:nth-child(2)');
    const title = await page.evaluate(() => {
      const elem = document.querySelector('title');
      return elem.innerText;
    });
    expect(title).toBe('Monthly Log');
  });

  // User click the Home button and would go back to the home page from monthly log:
  it('Test7: User click the Home button and go back to the home page from monthly log:', async () => {
    await page.click('body > div.nav-bar > div > button:nth-child(1)');

    const title = await page.evaluate(() => {
      const elem = document.querySelector('title');
      return elem.innerText;
    });
    expect(title).toBe('Home Page');
  });

  // User click the Future Log button and go to the Future Log page:
  it('Test8: User click the Future Log button and go to the Future Log page:', async () => {
    await page.click('#index > div.widget-content > button:nth-child(3)');

    const title = await page.evaluate(() => {
      const elem = document.querySelector('title');
      return elem.innerText;
    });
    expect(title).toBe('Future Log');
  });

  // User click the Home button and would go back to the home page from Future Log:
  it('Test9: User click the Home button and go back to the home page from Future Log:', async () => {
    //await page.click('.home-button button:nth-child(1)');
    await page.click('body > div.nav-bar > div > button:nth-child(1)');
    const title = await page.evaluate(() => {
      const elem = document.querySelector('title');
      return elem.innerText;
    });
    expect(title).toBe('Home Page');
  });

  // User click the Custom log button and go to the Custom log page:
  it('Test10: User click the Custom log button and go to the Custom log page:', async () => {
    await page.click('#index > div.widget-content > button:nth-child(4)');

    const title = await page.evaluate(() => {
      const elem = document.querySelector('title');
      return elem.innerText;
    });
    expect(title).toBe('Custom Log');
  });

  // User click the back button and would go back to the home page from Custom log:
  it('Test11: User click back button and go back to the home page from Custom log:', async () => {
    await page.goBack();

    const title = await page.evaluate(() => {
      const elem = document.querySelector('title');
      return elem.innerText;
    });
    expect(title).toBe('Home Page');
  });
});
