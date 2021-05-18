//express server setup
const express = require('express');
const app = express();
const port = 8080;
const path = require('path');

// dealth with fetch post json data.
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//used to store the data.
let currentUser;

//setup static files path
app.use('/js',express.static(path.join(__dirname, 'src/js')));
app.use('/css',express.static(path.join(__dirname, 'src/css')));
app.use('/css',express.static(path.join(__dirname, 'src/html')));
//setup the router for post and get request.

//the home page
app.get('/', function (req, res) {
    if(currentUser){
      res.sendFile(path.join(__dirname, 'src/html/index.html'));
    }else{
      res.sendFile(path.join(__dirname, 'src/html/login.html'));
    }
});
//daily log
app.get('/daily', function (req, res) {
  if(currentUser){
    res.sendFile(path.join(__dirname, 'src/html/daily.html'));
  }else{
     res.sendFile(path.join(__dirname, 'src/html/login.html'));
  }
});
app.get('/future', function (req, res) {
  if(currentUser){
    res.sendFile(path.join(__dirname, 'src/html/future.html'));
  }else{
    res.sendFile(path.join(__dirname, 'src/html/login.html'));
  }
});
app.get('/monthly', function (req, res) {
  if(currentUser){
    res.sendFile(path.join(__dirname, 'src/html/monthly.html'));
  }else{
    res.sendFile(path.join(__dirname, 'src/html/login.html'));
  }
});
app.get('/custom', function (req, res) {
  res.sendFile(path.join(__dirname, 'src/html/custom.html'));
});
app.get('/login', function (req, res) {
  res.sendFile(path.join(__dirname, 'src/html/login.html'));
});
app.get('/signup', function (req, res) {
  res.sendFile(path.join(__dirname, 'src/html/signup.html'));
});

//user login
app.post('/user_login', function (req, res) {
  let data= req.body;//get the form data
  console.log('Got body:', data);
  verifyUser(data, res);
})

//user signup
app.post('/user_signup', function (req, res) {
  let data= req.body;//get the form data
  console.log('Got body:', data);
  createUser(data,res);
})


//other request
app.post('/getDailyTask', function (req, res) {
  let data= req.body;//get the form data
    data["user"] = currentUser["_id"];
    data["status"] = "daily";
   console.log('Got body:', data);
   getDailyTask(data,res);
})

app.post('/getFutureTask', function (req, res) {
  let data= req.body;//get the form data
  data["user"] = currentUser["_id"];
  data["status"] = "future";
   console.log('Got body:', data);
   getFutureTask(data,res);
})

//adding task
app.post('/addTask', function (req, res) {
  let data= req.body;//get the form data
  console.log('Got body:', data);
  //insert data into the database:
  addTask(data,res);
})


//listening to the port to let the server start up
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})



//install mongodb at local first
//npm install mongoose
//database:
//mongoose test
//reference: https://mongoosejs.com/docs/index.html
let mongoose = require('mongoose');
let UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  name: String,
});
let User = mongoose.model('User', UserSchema);
//user signup
//assumpt that the database has the collections of User to store user information
function createUser(data,res){
  mongoose.connect('mongodb://localhost/cse110', {useNewUrlParser: true, useUnifiedTopology: true});
  let mongoose_db = mongoose.connection;
  mongoose_db.on('error', console.error.bind(console, 'connection error:'));
  mongoose_db.once('open', function(){
    // insert the ner user or user signup
    let newUser = new User(data);
    newUser.save(function (err, result) {
      if (err) return console.error(err);
      currentUser = new User(data);
      console.log("User signup successfully");
      res.send({ user_status: 200 });
      mongoose_db.close();
    });
  });
}

function verifyUser(data,res){
  mongoose.connect('mongodb://localhost/cse110', {useNewUrlParser: true, useUnifiedTopology: true});
  let  mongoose_db = mongoose.connection;
  mongoose_db.on('error', console.error.bind(console, 'connection error:'));
  mongoose_db.once('open', function(){
    // insert the ner user or user signup
    User.find(data, function (err, one) {
      if (err) return console.error(err);
      console.log(one);
      if(one.length>0){
        currentUser = new User(data);
        console.log(currentUser);
        res.send({ user_status: 200 });
      }else{
        res.send({ user_status: 404 });
      }
      mongoose_db.close();
    });
  });
}

let TaskSchema = new mongoose.Schema({
  status: String,
  type: String,
  content: String,
  date:String,
  user: String,
});
let Task = mongoose.model('Task', TaskSchema);

function addTask(data,res){
  mongoose.connect('mongodb://localhost/cse110', {useNewUrlParser: true, useUnifiedTopology: true});
  let mongoose_db = mongoose.connection;
  mongoose_db.on('error', console.error.bind(console, 'connection error:'));
  mongoose_db.once('open', function(){
    // insert new task into the database
    //add the user id into the data
    data["user"] = currentUser["_id"];
    console.log(data);
    let newTask = new Task(data);
    newTask.save(function (err, result) {
      if (err) return console.error(err);
      console.log("Task added successfully");
      res.send({ status: 200, task: data});
      mongoose_db.close();
    });
  });
}

//get tasks:
//data: specify which date is it:
//for example: {date: 'Sun May 16 2021' }
function getDailyTask(data,res){
  mongoose.connect('mongodb://localhost/cse110', {useNewUrlParser: true, useUnifiedTopology: true});
  let  mongoose_db = mongoose.connection;
  mongoose_db.on('error', console.error.bind(console, 'connection error:'));
  mongoose_db.once('open', function(){
    // insert the ner user or user signup
    data["user"] = currentUser["_id"];
    data["status"] = "daily";
    Task.find(data, function (err, result) {
      if (err) return console.error(err);
      console.log(result);
      if(result.length>0){
        res.send({ status: 200, task:result });
      }else{
        res.send({ status: 404 });
      }
      mongoose_db.close();
    });
  });
}

function getFutureTask(data,res){
  mongoose.connect('mongodb://localhost/cse110', {useNewUrlParser: true, useUnifiedTopology: true});
  let  mongoose_db = mongoose.connection;
  mongoose_db.on('error', console.error.bind(console, 'connection error:'));
  mongoose_db.once('open', function(){
    // insert the ner user or user signup
    data["user"] = currentUser["_id"];
    data["status"] = "future";
    Task.find(data, function (err, result) {
      if (err) return console.error(err);
      console.log(result);
      if(result.length>0){
        res.send({ status: 200, task:result });
      }else{
        res.send({ status: 404 });
      }
      mongoose_db.close();
    });
  });
}