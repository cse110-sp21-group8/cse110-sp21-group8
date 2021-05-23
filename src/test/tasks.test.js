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
        sendData = {status:"daily", date:"Sat May 22 2021"};
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


describe('Test: add tasks', () => {
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

  test('User add their own daily task', done =>{
      //send the request
      sendData = {status:"daily",type:"task",date:new Date().toDateString(),content:"test content"};
      request(app)
      .post("/addTask").send(sendData)
      .set('Accept', 'application/json')
      .then(response => {
        expect(response.body.status).toEqual(200);
        done();
      });
  });

  test('User add their own future task', done =>{
    //send the request
    sendData = {status:"future",type:"task",date:new Date().toDateString(),content:"test content"};
    request(app)
    .post("/addTask").send(sendData)
    .set('Accept', 'application/json')
    .then(response => {
      expect(response.body.status).toEqual(200);
      done();
    });
  });
  test('User add their own monthly task', done =>{
    //send the request
    sendData = {status:"monthly",type:"task",date:new Date().toDateString(),content:"test content"};
    request(app)
    .post("/addTask").send(sendData)
    .set('Accept', 'application/json')
    .then(response => {
      expect(response.body.status).toEqual(200);
      done();
    });
  });

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
        sendData = { old:{status:"daily",type:"task",date:new Date().toDateString(),content:"test content"},new:{
          status:"daily",type:"task",date:new Date().toDateString(),content:"11111"
        }};
        request(app)
        .post("/updateTask").send(sendData)
        .set('Accept', 'application/json')
        .then(response => {
          expect(response.body.status).toEqual(200);
          done();
        });
    });

    test('User edit their own future task', done =>{
      //send the request
      sendData = { old:{status:"future",type:"task",date:new Date().toDateString(),content:"test content"},new:{
        status:"future",type:"task",date:new Date().toDateString(),content:"11111"
      }};
      request(app)
      .post("/updateTask").send(sendData)
      .set('Accept', 'application/json')
      .then(response => {
        expect(response.body.status).toEqual(200);
        done();
      });
    });

    test('User edit their own monthly task', done =>{
      //send the request
      sendData = { old:{status:"monthly",type:"task",date:new Date().toDateString(),content:"test content"},new:{
        status:"monthly",type:"task",date:new Date().toDateString(),content:"11111"
      }};
      request(app)
      .post("/updateTask").send(sendData)
      .set('Accept', 'application/json')
      .then(response => {
        expect(response.body.status).toEqual(200);
        done();
      });
    });
});


describe('Test: delete tasks', () => {
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

  test('User delete their own daily task', done =>{
      //send the request
      sendData = {status:"daily",type:"task",date:new Date().toDateString(),content:"11111"};
      request(app)
      .post("/deleteTask").send(sendData)
      .set('Accept', 'application/json')
      .then(response => {
        expect(response.body.status).toEqual(200);
        done();
      });
  });

  test('User delete their own future task', done =>{
    //send the request
    sendData = {status:"future",type:"task",date:new Date().toDateString(),content:"11111"};
    request(app)
    .post("/deleteTask").send(sendData)
    .set('Accept', 'application/json')
    .then(response => {
      expect(response.body.status).toEqual(200);
      done();
    });
  });
  test('User delete their own monthly task', done =>{
    //send the request
    sendData = {status:"monthly",type:"task",date:new Date().toDateString(),content:"11111"};
    request(app)
    .post("/deleteTask").send(sendData)
    .set('Accept', 'application/json')
    .then(response => {
      expect(response.body.status).toEqual(200);
      done();
    });
  });

});