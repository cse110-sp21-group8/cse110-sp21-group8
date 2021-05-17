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
app.get('/info', function (req, res) {
  res.send(taskData);
})

app.post('/addTask', function (req, res) {
  let data= req.body;//get the form data
  console.log('Got body:', data);
  taskData.push(data);
  res.send('Got a PUT request at /user')
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
        res.send({ user_status: 200 });
      }else{
        res.send({ user_status: 404 });
      }
      mongoose_db.close();
    });
  });
}



//sample codes
//connect database
/*
MongoClient.connect(url, function(err, db) {
  var dbo = db.db("cse110"); //database name,

  //create collection
  /*
  dbo.createCollection("customers", function(err, res) {
    if (err) throw err;
    console.log("Collection created!");
    db.close();
  });
 
  //insert collection
  var myobj = { name: "Company Inc", address: "Highway 37" };
  dbo.collection("customers").insertOne(myobj, function(err, res) {
    if (err) throw err;
    console.log("1 document inserted");
    db.close();
  });

  //futhur instruction:
  //https://www.w3schools.com/nodejs/nodejs_mongodb_insert.asp
});
 */