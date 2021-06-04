/* global test, expect */
//reference: https://www.albertgao.xyz/2017/05/24/how-to-test-expressjs-with-jest-and-supertest/
//Install: npm install --save-dev babel-cli babel-preset-env jest supertest superagent

const server = require('../../server.js');
const app = server['app'];
const request = require('supertest');

describe('Test user signup', () => {
  test('User sign up normally with unique password and username', (done) => {
    //generating random data
    let random_num = Math.floor(Math.random() * 1000);
    let sendData = {
      username: 'user' + random_num,
      password: '123',
      name: 'test'
    };
    //send the request
    request(app)
      .post('/user_signup')
      .send(sendData)
      .set('Accept', 'application/json')
      .then((response) => {
        expect(response.body.user_status).toEqual(200);
        done();
      });
  });

  test('User sign up with existing username, should return status code 400', (done) => {
    //generating random data
    let sendData = {username: 'admin@gmail.com', password: '123', name: 'test'};
    //send the request
    request(app)
      .post('/user_signup')
      .send(sendData)
      .set('Accept', 'application/json')
      .then((response) => {
        expect(response.body.user_status).toEqual(400);
        done();
      });
  });
});

describe('Test user Login', () => {
  test('User login successfully with correct password and username', (done) => {
    //send the request
    let sendData = {username: 'admin@gmail.com', password: '123456'};
    request(app)
      .post('/user_login')
      .send(sendData)
      .set('Accept', 'application/json')
      .then((response) => {
        expect(response.body.user_status).toEqual(200);
        done();
      });
  });

  test('User sign in with incorrect username and password, should return status code 404', (done) => {
    //generating random data
    let sendData = {username: 'adming@gmail.com', password: '12'};
    //send the request
    request(app)
      .post('/user_login')
      .send(sendData)
      .set('Accept', 'application/json')
      .then((response) => {
        expect(response.body.user_status).toEqual(404);
        done();
      });
  });
});
