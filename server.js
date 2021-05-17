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
let taskData=[{name:"John"}];

//setup static files path
app.use('/js',express.static(path.join(__dirname, 'src/js')));
app.use('/css',express.static(path.join(__dirname, 'src/css')));
app.use('/css',express.static(path.join(__dirname, 'src/html')));
//setup the router for post and get request.

//the home page
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'src/html/index.html'));
});
//daily log
app.get('/daily', function (req, res) {
  res.sendFile(path.join(__dirname, 'src/html/daily.html'));
});
app.get('/future', function (req, res) {
  res.sendFile(path.join(__dirname, 'src/html/future.html'));
});
app.get('/monthly', function (req, res) {
  res.sendFile(path.join(__dirname, 'src/html/monthly.html'));
});
app.get('/custom', function (req, res) {
  res.sendFile(path.join(__dirname, 'src/html/custom.html'));
});

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
//npm install mongodb
//database:
var mongo = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

//connect database
MongoClient.connect(url, function(err, db) {
  var dbo = db.db("cse110"); //database name,

  //create collection
  /*
  dbo.createCollection("customers", function(err, res) {
    if (err) throw err;
    console.log("Collection created!");
    db.close();
  });
  */
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