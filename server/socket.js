const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const socket = require('socket.io');
const io = socket(server, {
  cors: {
    origin: "*", // Replace with your React app's domain
    methods: ["GET", "POST"],
    allowedHeaders: "*",
    // credentials: true
  }
});
const cors = require('cors');
var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200 // For legacy browser support
 }
// Use the cors middleware
app.use(cors(corsOptions));

io.on('connection', onConnection);

function onConnection(socket) {
  socket.on('drawing', (data) => socket.broadcast.emit('drawing', data));
}

const port = 8080;
server.listen(port, '0.0.0.0', () => console.log(`server is running on port ${port}`));
