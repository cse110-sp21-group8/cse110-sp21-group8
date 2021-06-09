/*
const server = require('./server.js');
let app = server["app"];
let currentUser = server["currentUser"];

let mongoose = require('mongoose');

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
     console.log('Got body:', data);
     getSubTask(data,res);
})

//adding task
app.post('/addSubTask', function (req, res) {
    let data= req.body;//get the form data
    data["user"] = currentUser["_id"].toString();
    console.log('Got Sub task body:', data);
    //insert data into the database:
    addSubTask(data,res);
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
        console.log("Task added successfully");
        res.send({ status: 200, Subtask: data});
        mongoose_db.close();
      });
    });
  }

  */