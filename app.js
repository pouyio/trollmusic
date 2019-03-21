require('dotenv').config()
const express = require('express')
const http = require('http');
const app = express();
const server = http.createServer(app);
const PORT = 8080;
const cors = require('cors');
const admin = require('firebase-admin');

admin.initializeApp({
    credential: admin.credential.cert({
        projectId: process.env.projectid,
        clientEmail: process.env.client_email,
        privateKey: Buffer.from(process.env.private_key, 'base64')
        // privateKey: process.env.private_key
    })
});

const db = admin.firestore();

app.use(cors());
app.use(express.static('dist'));

app.get('/ended', async (req, res) => {
    res.end();
    const id = req.query.id;
    const videoPastSnapshot = await db.collection('video').doc('past').get();
    const videoPast = videoPastSnapshot.data();

    if ((videoPast || {}).video === id) {
        // do nothing, you're late
        return;
    }

    db.collection('video').doc('past').set({ video: id });

    const videosSnapshot = await db.collection('videos').orderBy('order').get();
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

server.listen(PORT, () => console.log(`Started on port ${PORT}!`));