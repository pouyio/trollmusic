const express = require('express')
const http = require('http');
const bodyParser = require('body-parser')
const app = express();
const server = http.createServer(app);
const io = require('socket.io').listen(server);
const PORT = 8080;
const cors = require('cors');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname));

io.on('connection', (socket) => {
    socket.on('set-user', (user, fn) => {
        socket.data = { user };
        fn(true);
    })
});

app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'));

app.get('/videos', (req, res) => {
    res.json({ videos: true });
});

app.post('/video', (req, res) => {
    io.emit('video-added', req.body.user, req.body.video);
    res.end();
});

app.get('/users', (req, res) => {
    const users = [];
    Object.keys(io.sockets.connected).forEach((socketID) => {
        users.push(io.sockets.connected[socketID].data);
    });
    res.send(users)
});


server.listen(PORT, () => console.log(`Started on port ${PORT}!`));