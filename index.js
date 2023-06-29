// index.js
const Server = require('./server');

const port = process.env.PORT || 3000;
const server = new Server();
server.start(port);
