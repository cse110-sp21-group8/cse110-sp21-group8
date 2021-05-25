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

/*
//Upload picture
const multer = require('multer');
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    let img_url = new Date().toDateString()+currentUser["_id"].toString() +'.jpg'
    cb(null, img_url) //Appending .jpg
  }
})

let upload = multer({ storage: storage });
*/

//setup static files path
app.use('/js',express.static(path.join(__dirname, 'src/js')));
app.use('/css',express.static(path.join(__dirname, 'src/css')));
app.use('/css',express.static(path.join(__dirname, 'src/html')));
app.use('/image',express.static(path.join(__dirname, 'uploads')));
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
  if(currentUser){
    res.sendFile(path.join(__dirname, 'src/html/custom.html'));
  }else{
    res.sendFile(path.join(__dirname, 'src/html/login.html'));
  }
});
app.get('/login', function (req, res) {
  res.sendFile(path.join(__dirname, 'src/html/login.html'));
});
app.get('/signup', function (req, res) {
  res.sendFile(path.join(__dirname, 'src/html/signup.html'));
});

/*
//user upload picture.
app.post('/uploadImg', upload.single('file-to-upload'), (req, res) => {
  console.log("Upload User Picture Successfully");
  let img_url = new Date().toDateString()+currentUser["_id"].toString() +'.jpg?'+new Date().getTime();
  res.send({ status: 200,src: "/image/"+img_url});
});

//user get the current date picture.
app.get('/getImg', function (req, res) {
  let img_url = new Date().toDateString()+currentUser["_id"].toString() +'.jpg?'+new Date().getTime();
  res.send({ status: 200,src: "/image/"+img_url});
})

*/


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
   data["user"] = currentUser["_id"].toString();
   console.log('Got body:', data);
   getDailyTask(data,res);
})

app.post('/getMonthlyTask', function (req, res) {
  let data= req.body;//get the form data
  data["user"] = currentUser["_id"].toString();
  console.log('Got body:', data);
  getMonthlyTask(data,res);
})

//get Custom tasks request
app.post('/getCustomTask', function (req, res) {
  let data= req.body;//get the form data
   console.log('Got body:', data);
   getCustomTask(data,res);
})

app.post('/getFutureTask', function (req, res) {
  let data= req.body;//get the form data
   data["user"] = currentUser["_id"].toString();
   console.log('Got body:', data);
   getDailyTask(data,res);
})

//adding task
app.post('/addTask', function (req, res) {
  let data= req.body;//get the form data
  console.log('Got body:', data);
  //insert data into the database:
  addTask(data,res);
})

//adding task
app.post('/updateTask', function (req, res) {
  let data= req.body;//get the form data
  console.log('Got body:', data);
  //insert data into the database:
  UpdateTask(data,res);
})

//adding task
app.post('/deleteTask', function (req, res) {
  let data= req.body;//get the form data
  console.log('Got body:', data);
  //insert data into the database:
  DeleteTask(data,res);
})

//adding Custom task
app.post('/addCustomTask', function (req, res) {
  let data= req.body;//get the form data
  console.log('Got body:', data);
  //insert data into the database:
  addCustomTask(data,res);
})

//adding Custom task
app.post('/UpdateCustomTask', function (req, res) {
  let data= req.body;//get the form data
  console.log('Got body:', data);
  //insert data into the database:
  UpdateCustomTask(data,res);
})

//deleting Custom task
app.post('/DeleteCustomTask', function (req, res) {
  let data= req.body;//get the form data
  console.log('Got body:', data);
  //insert data into the database:
  DeleteCustomTask(data,res);
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
  //Remote Cloud Database address:
  //Url:mongodb+srv://CSE110:CSE110@cluster0.1sq34.mongodb.net/cse110_group8?retryWrites=true&w=majority
  mongoose.connect('mongodb://localhost/cse110', {useNewUrlParser: true, useUnifiedTopology: true});
  let mongoose_db = mongoose.connection;
  mongoose_db.on('error', console.error.bind(console, 'connection error:'));
  mongoose_db.once('open', function(){
    // insert the ner user or user signup
    let newUser = new User(data);
    //Find if there is any exist username
    User.find({username:data['username']}, function (err, result) {
      if (err) return console.error(err);
      if (result.length > 0){
        console.log("User already exist");
        exist = true;
        res.send({ user_status: 400 });
        mongoose_db.close();
      }else{
        newUser.save(function (err, result) {
          if (err) return console.error(err);
          currentUser = newUser;
          console.log("User signup successfully");
          res.send({ user_status: 200 });
          mongoose_db.close();
        });
      }
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
        currentUser = one[0];
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
  tag: String,
});
let Task = mongoose.model('Task', TaskSchema);

function addTask(data,res){
  mongoose.connect('mongodb://localhost/cse110', {useNewUrlParser: true, useUnifiedTopology: true});
  let mongoose_db = mongoose.connection;
  mongoose_db.on('error', console.error.bind(console, 'connection error:'));
  mongoose_db.once('open', function(){
    // insert new task into the database
    //add the user id into the data
    data["user"] = currentUser["_id"].toString();
    console.log(data);
    let newTask = new Task(data);
    newTask.save(function (err, result) {
      if (err) return console.error(err);
      console.log("Task added successfully");
      res.send({ status: 200, task: result});
      mongoose_db.close();
    });
  });
}

//data formate: {old:old_data,new:new_data}
//Call the UpdateCustomTask functions to update the tasks list
function UpdateTask(data,res){
  mongoose.connect('mongodb://localhost/cse110', {useNewUrlParser: true, useUnifiedTopology: true});
  let mongoose_db = mongoose.connection;
  mongoose_db.on('error', console.error.bind(console, 'connection error:'));
  mongoose_db.once('open', function(){
    // insert new task into the database
    //add the user id into the data
    let old_data = data["old"];
    let new_data = data["new"];

    old_data["user"] = currentUser["_id"].toString();

    Task.updateOne(old_data,new_data,function (err, result) {
      if (err) return console.error(err);
      console.log("Task List Updated successfully");
      res.send({ status: 200, task: data});
      mongoose_db.close();
    });
  });
}

//Call the DeleteTask functions to delete the tasks list
function DeleteTask(data,res){
  mongoose.connect('mongodb://localhost/cse110', {useNewUrlParser: true, useUnifiedTopology: true});
  let mongoose_db = mongoose.connection;
  mongoose_db.on('error', console.error.bind(console, 'connection error:'));
  mongoose_db.once('open', function(){
    // insert new task into the database
    //add the user id into the data
    data["user"] = currentUser["_id"].toString();
    Task.deleteOne(data, function (err, result) {
      if (err) return console.error(err);
      console.log("Tasks list deleted successfully");
      res.send({ status: 200});
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
    Task.find(data, function (err, result) {
      if (err) return console.error(err);
      console.log("get:",result);
      if(result.length>0){
        res.send({ status: 200, task:result });
      }else{
        res.send({ status: 404 });
      }
      mongoose_db.close();
    });
  });
}

function getMonthlyTask(data,res){
  mongoose.connect('mongodb://localhost/cse110', {useNewUrlParser: true, useUnifiedTopology: true});
  let  mongoose_db = mongoose.connection;
  mongoose_db.on('error', console.error.bind(console, 'connection error:'));
  mongoose_db.once('open', function(){
    // insert the ner user or user signup
    Task.find(data, function (err, result) {
      if (err) return console.error(err);
      console.log("get:",result);
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
    Task.find(data, function (err, result) {
      if (err) return console.error(err);
      console.log("get:",result);
      if(result.length>0){
        res.send({ status: 200, task:result });
      }else{
        res.send({ status: 404 });
      }
      mongoose_db.close();
    });
  });
}


//define the schema for the custom log
let CustomSchema = new mongoose.Schema({
  sections: String,
  content: String,
  date:String,
  user: String,
  title:String,
  color:String,
  tags:String,
});
let Custom = mongoose.model('Custom', CustomSchema);

//Call the addCustomTask functions to add the custom logs
function addCustomTask(data,res){
  mongoose.connect('mongodb://localhost/cse110', {useNewUrlParser: true, useUnifiedTopology: true});
  let mongoose_db = mongoose.connection;
  mongoose_db.on('error', console.error.bind(console, 'connection error:'));
  mongoose_db.once('open', function(){
    // insert new task into the database
    //add the user id into the data
    data["user"] = currentUser["_id"];
    let newCustom = new Custom(data);
    newCustom.save(function (err, result) {
      if (err) return console.error(err);
      console.log("Custom Log added successfully");
      res.send({ status: 200, task: data});
      mongoose_db.close();
    });
  });
}

//Call the delete CustomTask functions to delete the custom logs
function DeleteCustomTask(data,res){
  mongoose.connect('mongodb://localhost/cse110', {useNewUrlParser: true, useUnifiedTopology: true});
  let mongoose_db = mongoose.connection;
  mongoose_db.on('error', console.error.bind(console, 'connection error:'));
  mongoose_db.once('open', function(){
    // insert new task into the database
    //add the user id into the data
    data["user"] = currentUser["_id"];
    Custom.deleteOne(data, function (err, result) {
      if (err) return console.error(err);
      console.log("Custom Log deleted successfully");
      res.send({ status: 200});
      mongoose_db.close();
    });
  });
}

//Call the UpdateCustomTask functions to update the custom logs
function UpdateCustomTask(data,res){
  mongoose.connect('mongodb://localhost/cse110', {useNewUrlParser: true, useUnifiedTopology: true});
  let mongoose_db = mongoose.connection;
  mongoose_db.on('error', console.error.bind(console, 'connection error:'));
  mongoose_db.once('open', function(){
    // insert new task into the database
    //add the user id into the data
    let old_data = data["old"];
    let new_data = data["new"];
    old_data["user"] = currentUser["_id"];

    Custom.updateOne(old_data,new_data,function (err, result) {
      if (err) return console.error(err);
      console.log("Custom Log Updated successfully");
      res.send({ status: 200, task: data});
      mongoose_db.close();
    });
  });
}

//get tasks:
//data: specify which date is it:
//for example: {date: 'Sun May 16 2021' }
function getCustomTask(data,res){
  mongoose.connect('mongodb://localhost/cse110', {useNewUrlParser: true, useUnifiedTopology: true});
  let  mongoose_db = mongoose.connection;
  mongoose_db.on('error', console.error.bind(console, 'connection error:'));
  mongoose_db.once('open', function(){
    // insert the ner user or user signup
    data["user"] = currentUser["_id"];
    Custom.find(data, function (err, result) {
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

//##############################################################################
//Subtasks:

let SubTaskSchema = new mongoose.Schema({
  status: String,
  type: String,
  content: String,
  date:String,
  user: String,
  task_id: String,
});
let SubTask = mongoose.model('SubTask', SubTaskSchema);

//get Subtask
app.post('/getSubTask', function (req, res) {
    let data= req.body;//get the form data
    data["user"] = currentUser["_id"].toString();
   console.log('Got Sub task body:', data);
   getSubTask(data,res);
})

//adding Subtask
app.post('/addSubTask', function (req, res) {
  let data= req.body;//get the form data
  data["user"] = currentUser["_id"].toString();
  console.log('Got Sub task body:', data);
  //insert data into the database:
  addSubTask(data,res);
})

//update Subtask
app.post('/updateSubTask', function (req, res) {
  let data= req.body;//get the form data
  console.log('Got Sub task body:', data);
  //insert data into the database:
  UpdateSubTask(data,res);
})

//delete Subtask
app.post('/deleteSubTask', function (req, res) {
  let data= req.body;//get the form data
  data["user"] = currentUser["_id"].toString();
  console.log('Got Sub task body:', data);
  //insert data into the database:
  DeleteSubTask(data,res);
})


function addSubTask(data,res){
  mongoose.connect('mongodb://localhost/cse110', {useNewUrlParser: true, useUnifiedTopology: true});
  let mongoose_db = mongoose.connection;
  mongoose_db.on('error', console.error.bind(console, 'connection error:'));
  mongoose_db.once('open', function(){
    // insert new task into the database
    //add the user id into the data
    let newSubTask = new SubTask(data);
    newSubTask.save(function (err, result) {
      if (err) return console.error(err);
      console.log("SubTask added successfully");
      res.send({ status: 200, Subtask: data});
      mongoose_db.close();
    });
  });
}


//get tasks:
//data: specify which date is it:
//for example: {date: 'Sun May 16 2021' }
function getSubTask(data,res){
  mongoose.connect('mongodb://localhost/cse110', {useNewUrlParser: true, useUnifiedTopology: true});
  let  mongoose_db = mongoose.connection;
  mongoose_db.on('error', console.error.bind(console, 'connection error:'));
  mongoose_db.once('open', function(){
    // insert the ner user or user signup
    SubTask.find(data, function (err, result) {
      if (err) return console.error(err);
      console.log("getSub tasks:",result);
      if(result.length>0){
        console.log(result);
        res.send({ status: 200, task:result });
      }else{
        res.send({ status: 404 });
      }
      mongoose_db.close();
    });
  });
}


//data formate: {old:old_data,new:new_data}
//Call the UpdateSubTask functions to update the sub tasks list
function UpdateSubTask(data,res){
  mongoose.connect('mongodb://localhost/cse110', {useNewUrlParser: true, useUnifiedTopology: true});
  let mongoose_db = mongoose.connection;
  mongoose_db.on('error', console.error.bind(console, 'connection error:'));
  mongoose_db.once('open', function(){
    // insert new task into the database
    //add the user id into the data
    let old_data = data["old"];
    let new_data = data["new"];

    old_data["user"] = currentUser["_id"].toString();

    SubTask.updateOne(old_data,new_data,function (err, result) {
      if (err) return console.error(err);
      console.log("SubTask List Updated successfully");
      res.send({ status: 200, task: data});
      mongoose_db.close();
    });
  });
}


//Call the DeleteTask functions to delete the tasks list
function DeleteSubTask(data,res){
  mongoose.connect('mongodb://localhost/cse110', {useNewUrlParser: true, useUnifiedTopology: true});
  let mongoose_db = mongoose.connection;
  mongoose_db.on('error', console.error.bind(console, 'connection error:'));
  mongoose_db.once('open', function(){
    // insert new task into the database
    //add the user id into the data
    SubTask.deleteOne(data, function (err, result) {
      if (err) return console.error(err);
      console.log("SubTasks deleted successfully");
      res.send({ status: 200});
      mongoose_db.close();
    });
  });
}

//export the module function for testing
module.exports = {app:app,currentUser:currentUser};
