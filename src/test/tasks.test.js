/* global test, expect */
//reference: https://www.albertgao.xyz/2017/05/24/how-to-test-expressjs-with-jest-and-supertest/
//Install: npm install --save-dev babel-cli babel-preset-env jest supertest superagent

const server = require('../../server.js');
const app = server["app"];
const request = require("supertest");


describe('Test: add Subtasks', () => {
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
  test('User add their own Sub task', done =>{
    //send the request
    //task_id: parent task id
    sendData = {status:"daily", content:"SubTask Content", date:new Date().toDateString(),type:"task",task_id:"60aad95c93b4e511484c5333"};
    request(app)
    .post("/addSubTask").send(sendData)
    .set('Accept', 'application/json')
    .then(response => {
      expect(response.body.status).toEqual(200);
      done();
    });
  });

  test('User update their own Sub task', done =>{
    //send the request
    //task_id: parent task id
    sendData = {old:{status:"daily", content:"SubTask Content", date:new Date().toDateString(),type:"task",task_id:"60aad95c93b4e511484c5333"},
                new:{status:"daily", content:"SubTask Content Modification", date:new Date().toDateString(),type:"task",task_id:"60aad95c93b4e511484c5333"}};
    request(app)
    .post("/updateSubTask").send(sendData)
    .set('Accept', 'application/json')
    .then(response => {
      expect(response.body.status).toEqual(200);
      done();
    });
  });

  test('User delete their own Sub task', done =>{
    //send the request
    //task_id: parent task id
    sendData = {status:"daily", content:"SubTask Content Modification", date:new Date().toDateString(),type:"task",task_id:"60aad95c93b4e511484c5333"};
    request(app)
    .post("/deleteSubTask").send(sendData)
    .set('Accept', 'application/json')
    .then(response => {
      expect(response.body.status).toEqual(200);
      done();
    });
  });

  test('User get Sub task for one upper task', done =>{
    //send the request
    sendData = {task_id:"60aad95c93b4e511484c5333"};
    request(app)
    .post("/getSubTask").send(sendData)
    .set('Accept', 'application/json')
    .then(response => {
      let tasks = response.body.task;
      expect(response.body.status).toEqual(200);
      expect(tasks.length).toEqual(3);
      done();
    });
  });
});

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

    
    test('User get their own future task', done =>{
        //send the request
        sendData = {status:"future"};
        request(app)
        .post("/getFutureTask").send(sendData)
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
        .post("/getMonthlyTask").send(sendData)
        .set('Accept', 'application/json')
        .then(response => {
          expect(response.body.status).toEqual(200);
          done();
        });
    });

    test('User get their own Custom task', done =>{
      //send the request
      sendData = {};
      request(app)
      .post("/getCustomTask").send(sendData)
      .set('Accept', 'application/json')
      .then(response => {
        expect(response.body.status).toEqual(200);
        done();
      });
    });
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

  test('User add their own custom task', done =>{
    //send the request
    sendData = {sections:"monthly",title:"custome test",color:"Blue",tags:"important",date:new Date().toDateString(),content:"test content"};
    request(app)
    .post("/addCustomTask").send(sendData)
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

    test('User edit their own custom task', done =>{
      //send the request
      sendData = {old:{sections:"monthly",title:"custome test",color:"Blue",tags:"important",date:new Date().toDateString(),content:"test content"},
        new:{sections:"Daily",title:"custome test 2",color:"Blue",tags:"important",date:new Date().toDateString(),content:"test content"}};
      request(app)
      .post("/UpdateCustomTask").send(sendData)
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

  test('User delete their own custom task', done =>{
    //send the request
    sendData = {sections:"Daily",title:"custome test 2",color:"Blue",tags:"important",date:new Date().toDateString(),content:"test content"};
    request(app)
    .post("/DeleteCustomTask").send(sendData)
    .set('Accept', 'application/json')
    .then(response => {
      expect(response.body.status).toEqual(200);
      done();
    });
  })
})

describe('Test: Custom Tags', () => {
  test('User create custom tags', done =>{
      //send the request
      let sendData={name:"love"};
      request(app)
      .post("/addCustomTag").send(sendData)
      .set('Accept', 'application/json')
      .then(response => {
        expect(response.body.user_status).toEqual(200);
        done();
      });
  });

  test('User get their custom tags', done =>{
    //send the request
    let sendData={};
    request(app)
    .post("/addCustomTag").send(sendData)
    .set('Accept', 'application/json')
    .then(response => {
      expect(response.body.user_status).toEqual(200);
      done();
    });
});
});
