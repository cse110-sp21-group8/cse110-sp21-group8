const server = require('./server.js');
let app = server["app"];
const port = 8080;

//listening to the port to let the server start up
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
  