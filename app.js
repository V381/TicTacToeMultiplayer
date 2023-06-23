const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/views/index.html');
});

io.on('connection', socket => {
    console.log('A user connected');
    socket.on('move', moveData => {
        console.log('Received move:', moveData);
        socket.broadcast.emit('move', moveData);
    });
    socket.on('gameEnded', winner => {
        console.log('Game ended:', winner ? `Player ${winner} wins!` : "It's a draw!");
        io.emit('gameEnded', winner); 
    });

    socket.on('gameStarted', () => {
        console.log('Game started');
        io.emit('gameStarted');
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

app.use(express.static(__dirname + '/public'))
app.use(express.static(__dirname + '/public/views/css'))
app.use(express.static(__dirname + '/public/logic'))

const port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});