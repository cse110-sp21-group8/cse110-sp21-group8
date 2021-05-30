const server = require('./server.js');
let app = server["app"];
const PORT = process.env.PORT || 8080;

//listening to the port to let the server start up
app.listen(PORT, () => {
    console.log(`App listening on ${PORT}`)
})
  