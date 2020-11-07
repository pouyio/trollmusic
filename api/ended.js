require("dotenv").config();
const admin = require("firebase-admin");

admin.initializeApp();

const db = admin.firestore();

module.exports = async (req, res) => {
  res.end("ok");
  const id = req.query.id;
  const videoPastSnapshot = await db
    .collection("video")
    .doc("past")
    .get();
  const videoPast = videoPastSnapshot.data();

  if (videoPast?.video === id) {
    // do nothing, you're late
    return;
  }

  db.collection("video")
    .doc("past")
    .set({ video: id });

  const videosSnapshot = await db
    .collection("videos")
    .orderBy("order")
    .get();
  const videos = [];
  videosSnapshot.forEach((doc) => videos.push({ ...doc.data(), key: doc.id }));
  const nextVideo = videos.shift();
  if (!nextVideo) {
    db.collection("video")
      .doc("current")
      .set({});
  } else {
    db.collection("videos")
      .doc(nextVideo.key)
      .delete();
    db.collection("video")
      .doc("current")
      .set({ ...nextVideo, playing: true });
  }
};
