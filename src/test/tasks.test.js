/* global test: testing user login and signup */
//reference: https://www.albertgao.xyz/2017/05/24/how-to-test-expressjs-with-jest-and-supertest/
//Install: npm install --save-dev babel-cli babel-preset-env jest supertest superagent

const app = require('../../server.js');
const request = require("supertest");


describe('Test: fetch/get tasks', () => {
    test('User login successfully with correct password and username', done =>{
        //send the request
        let sendData={username:"admin@gmail.com",password:"123456"};
        request(app)
        .post("/user_login").send(sendData)
        .set('Accept', 'application/json')
        .then(response => {
          expect(response.body.user_status).toEqual(200);
          done();
        });
    });

    test('User get their own daily task', done =>{
        //send the request
        sendData = {status:"daily", date:"Fri May 21 2021"};
        request(app)
        .post("/getDailyTask").send(sendData)
        .set('Accept', 'application/json')
        .then(response => {
          expect(response.body.status).toEqual(200);
          done();
        });
    });

    /*
    test('User get their own future task', done =>{
        //send the request
        sendData = {status:"future"};
        request(app)
        .post("/getDailyTask").send(sendData)
        .set('Accept', 'application/json')
        .then(response => {
          expect(response.body.status).toEqual(200);
          done();
        });
    });

    test('User get their own monthly task', done =>{
        //send the request
        sendData = {status:"monthly"};
        request(app)
        .post("/getDailyTask").send(sendData)
        .set('Accept', 'application/json')
        .then(response => {
          expect(response.body.status).toEqual(200);
          done();
        });
    });
    */
});

describe('Test: edit tasks', () => {
    test('User login successfully with correct password and username', done =>{
        //send the request
        let sendData={username:"admin@gmail.com",password:"123456"};
        request(app)
        .post("/user_login").send(sendData)
        .set('Accept', 'application/json')
        .then(response => {
          expect(response.body.user_status).toEqual(200);
          done();
        });
    });

    test('User edit their own daily task', done =>{
        //send the request
        sendData = {status:"daily", date:"Fri May 21 2021"};
        request(app)
        .post("/getDailyTask").send(sendData)
        .set('Accept', 'application/json')
        .then(response => {
          expect(response.body.status).toEqual(200);
          done();
        });
    });

    /*
    test('User get their own future task', done =>{
        //send the request
        sendData = {status:"future"};
        request(app)
        .post("/getDailyTask").send(sendData)
        .set('Accept', 'application/json')
        .then(response => {
          expect(response.body.status).toEqual(200);
          done();
        });
    });

    test('User get their own monthly task', done =>{
        //send the request
        sendData = {status:"monthly"};
        request(app)
        .post("/getDailyTask").send(sendData)
        .set('Accept', 'application/json')
        .then(response => {
          expect(response.body.status).toEqual(200);
          done();
        });
    });
    */
});
