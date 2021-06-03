const server = require('./server.js');
let app = server["app"];
const port = process.env.PORT || 8080;

//listening to the port to let the server start up
app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
})
  