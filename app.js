const express = require('express')
const http = require('http');
const bodyParser = require('body-parser')
const app = express();
const server = http.createServer(app);
const io = require('socket.io').listen(server);
const PORT = 8080;
const cors = require('cors');
const videos = require('./videos');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('dist'));

io.on('connection', (socket) => {

    if (videos.current) {
        socket.emit('playing', videos.current.id, videos.current.user, videos.current.seconds);
    }

    socket.on('set-user', (user, fn) => {
        socket.data = { user };
        fn(true);
    });

    socket.on('paused', (user) => {
        socket.broadcast.emit('paused', user);
    });

    socket.on('playing', (video, user, seconds) => {
        socket.broadcast.emit('playing', video, user, seconds);
    });

    socket.on('add', (video, user) => {
        videos.add(video, user);
        io.emit('playing', video, user, 0);
    })
});

app.get('/videos', (req, res) => {
    res.json(videos.list);
});

app.get('/users', (req, res) => {
    const users = [];
    Object.keys(io.sockets.connected).forEach((socketID) => {
        users.push(io.sockets.connected[socketID].data);
    });
    res.send(users)
});


server.listen(PORT, () => console.log(`Started on port ${PORT}!`));