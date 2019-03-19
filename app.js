const express = require('express')
const http = require('http');
const bodyParser = require('body-parser')
const app = express();
const server = http.createServer(app);
const io = require('socket.io').listen(server);
const PORT = 8080;
const cors = require('cors');
const videos = require('./videos');
const admin = require('firebase-admin');

var serviceAccount = require('./keys.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('dist'));

app.get('/ended', async (req, res) => {
    res.end();
    const id = req.query.id;
    const videoPastSnapshot = await db.collection('video').doc('past').get();
    const videoPast = videoPastSnapshot.data();

    if ((videoPast || {}).video === id) {
        // no hacer nada, incoherencia
        return;
    }

    db.collection('video').doc('past').set({ video: id });

    const videosSnapshot = await db.collection('videos').get();
    const videos = [];
    videosSnapshot.forEach(doc => videos.push({ ...doc.data(), key: doc.id }));
    const nextVideo = videos.shift();
    if (!nextVideo) {
        db.collection('video').doc('current').set({});
    } else {
        db.collection('videos').doc(nextVideo.key).delete();
        db.collection('video').doc('current').set({ ...nextVideo, playing: true });
    }
});

let ended = 0;

io.on('connection', (socket) => {


    socket.emit('users', getUsers());

    socket.on('set-user', (user) => {
        socket.data = { user };
        io.emit('users', getUsers());
    });

    socket.on('initial-playing', () => {
        if (videos.current) {
            socket.emit('playing', videos.current);
        }
    });

    socket.on('initial-queue', () => {
        if (videos.list.length) {
            socket.emit('queue', '', videos.list);
        }
    });

    socket.on('paused', (user) => {
        socket.broadcast.emit('paused', user);
    });

    socket.on('playing', ({ video, user, title, seconds }) => {
        socket.broadcast.emit('playing', { video, user, title, seconds });
    });

    socket.on('add', ({ video, title, user }) => {
        videos.add({ video, title, user });
        io.emit('playing', { video, title, user, seconds: 0 });
    });

    socket.on('reorder', (videosArr, user) => {
        videos.list = videosArr;
        socket.broadcast.emit('reorder', videos.list);
    });

    socket.on('queue', ({ video, title, user }) => {
        if (!videos.current) {
            videos.current = { video, title, user };
            io.emit('playing', { video, title, user, seconds: 0 });
            return;
        }
        videos.queue({ video, title, user });
        io.emit('queue', user, videos.list);
    });

    socket.on('remove', (user, videoId) => {
        videos.remove(videoId);
        io.emit('queue', user, videos.list);
    });

    socket.on('message', ({ user, message }) => {
        io.emit('message', { user, message });
    })

    socket.on('ended', (video, user) => {
        ++ended;
        const users = getUsers();
        if (ended >= users.length) {
            videos.removeAndNext(video);
            io.emit('queue', '', videos.list);
            if (videos.current) {
                io.emit('playing', videos.current);
            }
            ended = 0;
        }
    });

    socket.on('disconnect', () => {
        io.emit('users', getUsers());
    });
});

function getUsers() {
    const users = [];
    Object.keys(io.sockets.connected).forEach((socketID) => {
        users.push(io.sockets.connected[socketID].data);
    });
    return users.filter(e => e);
}

server.listen(PORT, () => console.log(`Started on port ${PORT}!`));