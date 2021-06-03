/**
 * @jest-environment jsdom
 */
/* global test, expect */
//reference: https://www.albertgao.xyz/2017/05/24/how-to-test-expressjs-with-jest-and-supertest/
//Install: npm install --save-dev babel-cli babel-preset-env jest supertest superagent
const server = require('../../server.js');
const app = server['app'];
const request = require('supertest');
//const firstDayIndex = require('../js/futurecal.js');
//const firstDayIndex2 = require('../js/futurecal.js');
//const { firstDayIndex } = require('../js/futurecal.js');
//const tt = require('../js/futurecal.js');
//window.document.body.innerHTML = tt.readFileSync("./futurecal.html");
describe('CRUD test for future page:', () => {
  describe('Test: add Subtasks', () => {
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
    test('User add their own Sub task', (done) => {
      //send the request
      //task_id: parent task id
      sendData = {
        status: 'future',
        content: 'SubTask Content',
        date: new Date().toDateString(),
        type: 'task',
        task_id: '60aad95c93b4e511484c5333'
      };
      request(app)
        .post('/addSubTask')
        .send(sendData)
        .set('Accept', 'application/json')
        .then((response) => {
          expect(response.body.status).toEqual(200);
          done();
        });
    });

    test('User update their own Sub task', (done) => {
      //send the request
      //task_id: parent task id
      sendData = {
        old: {
          status: 'future',
          content: 'SubTask Content',
          date: new Date().toDateString(),
          type: 'task',
          task_id: '60aad95c93b4e511484c5333'
        },
        new: {
          status: 'future',
          content: 'SubTask Content Modification',
          date: new Date().toDateString(),
          type: 'task',
          task_id: '60aad95c93b4e511484c5333'
        }
      };
      request(app)
        .post('/updateSubTask')
        .send(sendData)
        .set('Accept', 'application/json')
        .then((response) => {
          expect(response.body.status).toEqual(200);
          done();
        });
    });

    test('User delete their own Sub task', (done) => {
      //send the request
      //task_id: parent task id
      sendData = {
        status: 'future',
        content: 'SubTask Content Modification',
        date: new Date().toDateString(),
        type: 'task',
        task_id: '60aad95c93b4e511484c5333'
      };
      request(app)
        .post('/deleteSubTask')
        .send(sendData)
        .set('Accept', 'application/json')
        .then((response) => {
          expect(response.body.status).toEqual(200);
          done();
        });
    });

    test('User get Sub task for one upper task', (done) => {
      //send the request
      sendData = {task_id: '60aad95c93b4e511484c5333'};
      request(app)
        .post('/getSubTask')
        .send(sendData)
        .set('Accept', 'application/json')
        .then((response) => {
          let tasks = response.body.task;
          expect(response.body.status).toEqual(200);
          expect(tasks.length).toEqual(3);
          done();
        });
    });
  });
});
