require('dotenv').config();
const http = require('http');
const mongoose = require('mongoose');
const app = require('./app.js');

const server = http.createServer(app);
const io = require('socket.io')(server);

const port = process.env.PORT || 8080;
server.listen(port, () => {
  console.log(`Listening on port ${port}.`);
});

io.on('connection', (socket) => {
  console.log('Connection established!');
});

mongoose
  .connect(process.env.MONGO_CON_STRING)
  .then(() => console.log('Connected to the database.'))
  .catch(() => console.log('Unable to connect to the database.'));
