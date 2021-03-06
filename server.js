/* eslint-disable */
//get environment variables
require('dotenv').config();

//express server setup
const express = require('express');
const app = express();
const path = require('path');

//session
var session = require('express-session');
var cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use(session({secret: 'Shh, its a secret!'}));

//MD5 Encoding
var Hashes = require('jshashes');
var MD5 = new Hashes.MD5();

// dealth with fetch post json data.
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//setup static files path
app.use('/js', express.static(path.join(__dirname, 'src/js')));
app.use('/css', express.static(path.join(__dirname, 'src/css')));
app.use('/css', express.static(path.join(__dirname, 'src/html')));
app.use('/image', express.static(path.join(__dirname, 'uploads')));
//setup the router for post and get request.

//the home page
app.get('/', function (req, res) {
  if (req.session.uid) {
    res.sendFile(path.join(__dirname, 'src/html/index.html'));
  } else {
    res.sendFile(path.join(__dirname, 'src/html/login.html'));
  }
});
//daily log
app.get('/daily', function (req, res) {
  if (req.session.uid) {
    res.sendFile(path.join(__dirname, 'src/html/daily.html'));
  } else {
    res.sendFile(path.join(__dirname, 'src/html/login.html'));
  }
});
app.get('/future', function (req, res) {
  if (req.session.uid) {
    res.sendFile(path.join(__dirname, 'src/html/future.html'));
  } else {
    res.sendFile(path.join(__dirname, 'src/html/login.html'));
  }
});
app.get('/monthly', function (req, res) {
  if (req.session.uid) {
    res.sendFile(path.join(__dirname, 'src/html/monthly.html'));
  } else {
    res.sendFile(path.join(__dirname, 'src/html/login.html'));
  }
});
app.get('/custom', function (req, res) {
  if (req.session.uid) {
    res.sendFile(path.join(__dirname, 'src/html/custom.html'));
  } else {
    res.sendFile(path.join(__dirname, 'src/html/login.html'));
  }
});
app.get('/login', function (req, res) {
  res.sendFile(path.join(__dirname, 'src/html/login.html'));
});
app.get('/signup', function (req, res) {
  res.sendFile(path.join(__dirname, 'src/html/signup.html'));
});

//user login
app.post('/user_login', function (req, res) {
  let data = req.body; //get the form data
  let encodeData = {
    username: MD5.hex(data['username']),
    password: MD5.hex(data['password'])
  };
  verifyUser(encodeData, res, req);
});

//user signup
app.post('/user_signup', function (req, res) {
  let data = req.body; //get the form data
  let encodeData = {
    name: data['name'],
    username: MD5.hex(data['username']),
    password: MD5.hex(data['password'])
  };
  createUser(encodeData, res, req);
});

//other request
app.post('/getDailyTask', function (req, res) {
  let data = req.body; //get the form data
  console.log('uid:', req.session.uid);
  data['user'] = req.session.uid;
  console.log('Got body:', data);
  getDailyTask(data, res, req);
});

app.post('/getMonthlyTask', function (req, res) {
  let data = req.body; //get the form data
  data['user'] = req.session.uid;
  console.log('Got body:', data);
  getMonthlyTask(data, res, req);
});

//get Custom tasks request
app.post('/getCustomTask', function (req, res) {
  let data = req.body; //get the form data
  console.log('Got body:', data);
  getCustomTask(data, res, req);
});

app.post('/getFutureTask', function (req, res) {
  let data = req.body; //get the form data
  data['user'] = req.session.uid;
  console.log('Got body:', data);
  getFutureTask(data, res, req);
});

//adding task
app.post('/addTask', function (req, res) {
  let data = req.body; //get the form data
  console.log('Got body:', data);
  //insert data into the database:
  addTask(data, res, req);
});

//adding task
app.post('/updateTask', function (req, res) {
  let data = req.body; //get the form data
  console.log('Got body update:', data);
  //insert data into the database:
  UpdateTask(data, res, req);
});

//adding task
app.post('/deleteTask', function (req, res) {
  let data = req.body; //get the form data
  console.log('Got body:', data);
  //insert data into the database:
  DeleteTask(data, res, req);
});

//adding Custom task
app.post('/addCustomTask', function (req, res) {
  let data = req.body; //get the form data
  console.log('Got body:', data);
  //insert data into the database:
  addCustomTask(data, res, req);
});

//adding Custom task
app.post('/UpdateCustomTask', function (req, res) {
  let data = req.body; //get the form data
  console.log('Got body:', data);
  //insert data into the database:
  UpdateCustomTask(data, res, req);
});

//deleting Custom task
app.post('/DeleteCustomTask', function (req, res) {
  let data = req.body; //get the form data
  console.log('Got body:', data);
  //insert data into the database:
  DeleteCustomTask(data, res, req);
});

//install mongodb at local first
//npm install mongoose
//reference: https://mongoosejs.com/docs/index.html
let mongoose = require('mongoose');
let UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  name: String
});
let User = mongoose.model('User', UserSchema);

/**
 * Creates a user with username and password at signup
 * @param {*} data - user data sent for storing 
 * @param {*} res - response sent back by server
 * @param {*} req - request sent from server
 */
function createUser(data, res, req) {
  //Remote Cloud Database address:
  const conn = mongoose.createConnection(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    poolSize: 10
  });
  const Users = conn.model('User', UserSchema);
  conn.on('error', console.error.bind(console, 'connection error:'));
  conn.once('open', function () {
    // insert the ner user or user signup
    let newUser = new Users(data);
    //Find if there is any exist username
    Users.find({username: data['username']}, function (err, result) {
      if (err) return console.error(err);
      if (result.length > 0) {
        console.log('User already exist');
        exist = true;
        res.send({user_status: 400});
        conn.close();
      } else {
        newUser.save(function (err, result) {
          if (err) return console.error(err);
          req.session.uid = result['_id'].toString();
          console.log('User signup successfully');
          res.send({user_status: 200});
          conn.close();
        });
      }
    });
  });
}

/**
 * Verifies username and password at login
 * @param {*} data - user data sent to server for verification
 * @param {*} res - response sent back by server
 * @param {*} req - request sent from server
 */
function verifyUser(data, res, req) {
  const conn = mongoose.createConnection(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    poolSize: 10
  });
  const Users = conn.model('User', UserSchema);
  conn.on('error', console.error.bind(console, 'connection error:'));
  conn.once('open', function () {
    // insert the ner user or user signup
    Users.find(data, function (err, one) {
      if (err) return console.error(err);
      console.log(one);
      if (one.length > 0) {
        req.session.uid = one[0]['_id'].toString();
        res.send({user_status: 200});
      } else {
        res.send({user_status: 404});
      }
      conn.close();
    });
  });
}

let TaskSchema = new mongoose.Schema({
  status: String,
  type: String,
  content: String,
  date: String,
  user: String,
  tag: String
});
let Task = mongoose.model('Task', TaskSchema);

/**
 * Adds a task for a day by a user
 * @param {*} data - data of the task
 * @param {*} res - response sent back by server
 * @param {*} req - request sent from server
 */
function addTask(data, res, req) {
  const conn = mongoose.createConnection(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    poolSize: 10
  });
  const Tasks = conn.model('Task', TaskSchema);
  conn.on('error', console.error.bind(console, 'connection error:'));
  conn.once('open', function () {
    // insert new task into the database
    //add the user id into the data
    data['user'] = req.session.uid;
    console.log(data);
    let newTask = new Tasks(data);
    newTask.save(function (err, result) {
      if (err) return console.error(err);
      console.log('Task added successfully');
      res.send({status: 200, task: result});
      conn.close();
    });
  });
}

/**
 * Updates a task based on new data
 * @param {*} data - data used to update the task
 * @param {*} res - response sent back by server
 * @param {*} req - request sent from server
 */
function UpdateTask(data, res, req) {
  const conn = mongoose.createConnection(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    poolSize: 10
  });
  const Tasks = conn.model('Task', TaskSchema);
  conn.on('error', console.error.bind(console, 'connection error:'));
  conn.once('open', function () {
    // insert new task into the database
    //add the user id into the data
    let old_data = data['old'];
    let new_data = data['new'];

    old_data['user'] = req.session.uid;

    Tasks.updateOne(old_data, new_data, function (err, result) {
      if (err) return console.error(err);
      console.log('Task List Updated successfully');
      res.send({status: 200, task: data});
      conn.close();
    });
  });
}

/**
 * Deletes a task
 * @param {*} data - data used to identify daily task being deleted
 * @param {*} res - response sent back by server
 * @param {*} req - request sent from server
 */
function DeleteTask(data, res, req) {
  const conn = mongoose.createConnection(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    poolSize: 10
  });
  const Tasks = conn.model('Task', TaskSchema);
  conn.on('error', console.error.bind(console, 'connection error:'));
  conn.once('open', function () {
    // insert new task into the database
    //add the user id into the data
    data['user'] = req.session.uid;
    Tasks.deleteOne(data, function (err, result) {
      if (err) return console.error(err);
      console.log('Tasks list deleted successfully');
      res.send({status: 200});
      conn.close();
    });
  });
}

/**
 * Gets a daily task's data
 * @param {*} data - identifier information to fetch a daily task (format: {date: 'Sun May 16 2021'})
 * @param {*} res - response sent back by server
 * @param {*} req - request sent from server
 */
function getDailyTask(data, res, req) {
  const conn = mongoose.createConnection(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    poolSize: 10
  });
  const Tasks = conn.model('Task', TaskSchema);
  conn.on('error', console.error.bind(console, 'connection error:'));
  conn.once('open', function () {
    // insert the ner user or user signup
    Tasks.find(data, function (err, result) {
      if (err) return console.error(err);
      console.log('get:', result);
      if (result.length > 0) {
        res.send({status: 200, task: result});
      } else {
        res.send({status: 404});
      }
      conn.close();
    });
  });
}

/**
 * Gets a monthly task's data
 * @param {*} data - identifier information to fetch a monthly task
 * @param {*} res - response sent back by server
 * @param {*} req - request sent from server
 */
function getMonthlyTask(data, res, req) {
  const conn = mongoose.createConnection(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    poolSize: 10
  });
  const Tasks = conn.model('Task', TaskSchema);
  conn.on('error', console.error.bind(console, 'connection error:'));
  conn.once('open', function () {
    // insert the ner user or user signup
    Tasks.find(data, function (err, result) {
      if (err) return console.error(err);
      console.log('get:', result);
      if (result.length > 0) {
        res.send({status: 200, task: result});
      } else {
        res.send({status: 404});
      }
      conn.close();
    });
  });
}

/**
 * Gets a future task's data
 * @param {*} data - identifier information to fetch a future task
 * @param {*} res - response sent back by server
 * @param {*} req - request sent from server
 */
function getFutureTask(data, res, req) {
  const conn = mongoose.createConnection(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    poolSize: 10
  });
  const Tasks = conn.model('Task', TaskSchema);
  conn.on('error', console.error.bind(console, 'connection error:'));
  conn.once('open', function () {
    // insert the ner user or user signup
    Tasks.find(data, function (err, result) {
      if (err) return console.error(err);
      console.log('get:', result);
      if (result.length > 0) {
        res.send({status: 200, task: result});
      } else {
        res.send({status: 404});
      }
      conn.close();
    });
  });
}

//define the schema for the custom log
let CustomSchema = new mongoose.Schema({
  sections: String,
  content: String,
  date: String,
  user: String,
  title: String,
  color: String,
  tags: String
});
let Custom = mongoose.model('Custom', CustomSchema);

/**
 * Adds a custom task
 * @param {*} data - data of the custom task being added
 * @param {*} res - response sent back by server
 * @param {*} req - request sent from server
 */
function addCustomTask(data, res, req) {
  const conn = mongoose.createConnection(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    poolSize: 10
  });
  const Customs = conn.model('Custom', CustomSchema);
  conn.on('error', console.error.bind(console, 'connection error:'));
  conn.once('open', function () {
    // insert new task into the database
    //add the user id into the data
    data['user'] = req.session.uid;
    let newCustom = new Customs(data);
    newCustom.save(function (err, result) {
      if (err) return console.error(err);
      console.log('Custom Log added successfully');
      res.send({status: 200, task: data});
      conn.close();
    });
  });
}

/**
 * Deletes a custom task
 * @param {*} data - data to identify custom task being deleted
 * @param {*} res - response sent back by server
 * @param {*} req - request sent from server
 */
function DeleteCustomTask(data, res, req) {
  const conn = mongoose.createConnection(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    poolSize: 10
  });
  const Customs = conn.model('Custom', CustomSchema);
  conn.on('error', console.error.bind(console, 'connection error:'));
  conn.once('open', function () {
    // insert new task into the database
    //add the user id into the data
    data['user'] = req.session.uid;
    Customs.deleteOne(data, function (err, result) {
      if (err) return console.error(err);
      console.log('Custom Log deleted successfully');
      res.send({status: 200});
      conn.close();
    });
  });
}

/**
 * Updates a custom task 
 * @param {*} data - data used to update custom task
 * @param {*} res - response sent back by server
 * @param {*} req - request sent from server
 */
function UpdateCustomTask(data, res, req) {
  const conn = mongoose.createConnection(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    poolSize: 10
  });
  const Customs = conn.model('Custom', CustomSchema);
  conn.on('error', console.error.bind(console, 'connection error:'));
  conn.once('open', function () {
    // insert new task into the database
    //add the user id into the data
    let old_data = data['old'];
    let new_data = data['new'];
    old_data['user'] = req.session.uid;

    Customs.updateOne(old_data, new_data, function (err, result) {
      if (err) return console.error(err);
      console.log('Custom Log Updated successfully');
      res.send({status: 200, task: data});
      conn.close();
    });
  });
}

/**
 * Gets a custom task
 * @param {*} data - identifier data to fetch custom task (format: {date: 'Sun May 16 2021'})
 * @param {*} res - response sent back by server
 * @param {*} req - request sent from server
 */
function getCustomTask(data, res, req) {
  const conn = mongoose.createConnection(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    poolSize: 10
  });
  const Customs = conn.model('Custom', CustomSchema);
  conn.on('error', console.error.bind(console, 'connection error:'));
  conn.once('open', function () {
    // insert the ner user or user signup
    data['user'] = req.session.uid;
    Customs.find(data, function (err, result) {
      if (err) return console.error(err);
      console.log(result);
      if (result.length > 0) {
        res.send({status: 200, task: result});
      } else {
        res.send({status: 404});
      }
      conn.close();
    });
  });
}

let SubTaskSchema = new mongoose.Schema({
  status: String,
  type: String,
  content: String,
  date: String,
  user: String,
  task_id: String
});
let SubTask = mongoose.model('SubTask', SubTaskSchema);

//get Subtask
app.post('/getSubTask', function (req, res) {
  let data = req.body; //get the form data
  data['user'] = req.session.uid;
  console.log('Got Sub task body:', data);
  getSubTask(data, res);
});

//adding Subtask
app.post('/addSubTask', function (req, res) {
  let data = req.body; //get the form data
  data['user'] = req.session.uid;
  console.log('Got Sub task body:', data);
  //insert data into the database:
  addSubTask(data, res, req);
});

//update Subtask
app.post('/updateSubTask', function (req, res) {
  let data = req.body; //get the form data
  console.log('Got Sub task body:', data);
  //insert data into the database:
  UpdateSubTask(data, res, req);
});

//delete Subtask
app.post('/deleteSubTask', function (req, res) {
  let data = req.body; //get the form data
  data['user'] = req.session.uid;
  console.log('Got Sub task body:', data);
  //insert data into the database:
  DeleteSubTask(data, res, req);
});

/**
 * Adds a subtask
 * @param {*} data - data of the subtask
 * @param {*} res - response sent back by server
 * @param {*} req - request sent from server
 */
function addSubTask(data, res, req) {
  const conn = mongoose.createConnection(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    poolSize: 10
  });
  const SubTasks = conn.model('SubTask', SubTaskSchema);
  conn.on('error', console.error.bind(console, 'connection error:'));
  conn.once('open', function () {
    // insert new task into the database
    //add the user id into the data
    let newSubTask = new SubTasks(data);
    newSubTask.save(function (err, result) {
      if (err) return console.error(err);
      console.log('SubTask added successfully');
      res.send({status: 200, Subtask: data});
      conn.close();
    });
  });
}

/**
 * Gets a subtask
 * @param {*} data - identifier data to fetch subtask (format: {date: 'Sun May 16 2021'})
 * @param {*} res 
 * @param {*} req 
 */
function getSubTask(data, res, req) {
  const conn = mongoose.createConnection(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    poolSize: 10
  });
  const SubTasks = conn.model('SubTask', SubTaskSchema);
  conn.on('error', console.error.bind(console, 'connection error:'));
  conn.once('open', function () {
    // insert the ner user or user signup
    SubTasks.find(data, function (err, result) {
      if (err) return console.error(err);
      console.log('getSub tasks:', result);
      if (result.length > 0) {
        console.log(result);
        res.send({status: 200, task: result});
      } else {
        res.send({status: 404});
      }
      conn.close();
    });
  });
}

/**
 * Updates a subtask
 * @param {*} data - data used to update subtask (format: {old: old_data, new: new_data})
 * @param {*} res - response sent back by server
 * @param {*} req - request sent from server
 */
function UpdateSubTask(data, res, req) {
  const conn = mongoose.createConnection(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    poolSize: 10
  });
  const SubTasks = conn.model('SubTask', SubTaskSchema);
  conn.on('error', console.error.bind(console, 'connection error:'));
  conn.once('open', function () {
    // insert new task into the database
    //add the user id into the data
    let old_data = data['old'];
    let new_data = data['new'];

    old_data['user'] = req.session.uid;

    SubTasks.updateOne(old_data, new_data, function (err, result) {
      if (err) return console.error(err);
      console.log('SubTask List Updated successfully');
      res.send({status: 200, task: data});
      conn.close();
    });
  });
}

/**
 * Deletes a subtask
 * @param {*} data - data used to identify subtask being deleted
 * @param {*} res - response sent back by server
 * @param {*} req - request sent from server
 */
function DeleteSubTask(data, res, req) {
  const conn = mongoose.createConnection(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    poolSize: 10
  });
  const SubTasks = conn.model('SubTask', SubTaskSchema);
  conn.on('error', console.error.bind(console, 'connection error:'));
  conn.once('open', function () {
    // insert new task into the database
    //add the user id into the data
    SubTasks.deleteOne(data, function (err, result) {
      if (err) return console.error(err);
      console.log('SubTasks deleted successfully');
      res.send({status: 200});
      conn.close();
    });
  });
}

let CustomTagSchema = new mongoose.Schema({
  name: String,
  user: String
});

let CustomTags = mongoose.model('CustomTags', CustomTagSchema);
app.post('/getCustomTag', function (req, res) {
  let data = req.body; //get the form data
  data['user'] = req.session.uid;
  console.log('Got Custom tag body:', data);
  getCustomTag(data, res);
});

//adding Subtask
app.post('/addCustomTag', function (req, res) {
  let data = req.body; //get the form data
  data['user'] = req.session.uid;
  console.log('Got Custom tag body:', data);
  //insert data into the database:
  addCustomTag(data, res, req);
});

/**
 * Gets a custom tag
 * @param {*} data - identifier data to fetch custom tag
 * @param {*} res - response sent back by server
 * @param {*} req - response sent from server
 */
function getCustomTag(data, res, req) {
  const conn = mongoose.createConnection(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    poolSize: 10
  });
  const CustomTags = conn.model('CustomTags', CustomTagSchema);
  conn.on('error', console.error.bind(console, 'connection error:'));
  conn.once('open', function () {
    // insert the ner user or user signup
    CustomTags.find(data, function (err, result) {
      if (err) return console.error(err);
      if (result.length > 0) {
        console.log(result);
        res.send({status: 200, tags: result});
      } else {
        res.send({status: 404});
      }
      conn.close();
    });
  });
}

/**
 * Adds a custom tag
 * @param {*} data - data of custom tag
 * @param {*} res - response sent back by server
 * @param {*} req - request sent from server
 */
function addCustomTag(data, res, req) {
  const conn = mongoose.createConnection(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    poolSize: 10
  });
  const CustomTags = conn.model('CustomTags', CustomTagSchema);
  conn.on('error', console.error.bind(console, 'connection error:'));
  conn.once('open', function () {
    // insert new task into the database
    //add the user id into the data
    let newCustomTag = new CustomTags(data);
    newCustomTag.save(function (err, result) {
      if (err) return console.error(err);
      console.log('SubTask added successfully');
      res.send({status: 200, tags: result});
      conn.close();
    });
  });
}

//export the module function for testing
module.exports = {app: app};
