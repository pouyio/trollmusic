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

    if (videos.list.length) {
        socket.emit('queue', '', videos.list);
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
        videos.current = { id: video, user };
        io.emit('playing', video, user, 0);
    });

    socket.on('queue', (video, user) => {
        if (!videos.current) {
            videos.current = { id: video, user };
            io.emit('playing', video, user, 0);
            return;
        }
        videos.queue(video, user);
        io.emit('queue', user, videos.list);
    });

    socket.on('reset', (user) => {
        videos.reset();
        io.emit('queue', user, videos.list);
    });

    socket.on('ended', (video) => {
        videos.removeAndNext(video);
        io.emit('queue', '', videos.list);
        if (videos.current) {
            io.emit('playing', videos.current.id, videos.current.user, 0);
        }
    });
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