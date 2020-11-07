import { firebase } from "@firebase/app";
import "@firebase/firestore";

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyC8oGIv3wTmfr1YS4ZfPB79PjR8yw5DLsQ",
    authDomain: "trollmusic.firebaseapp.com",
    databaseURL: "https://trollmusic.firebaseio.com",
    projectId: "trollmusic",
    storageBucket: "trollmusic.appspot.com",
    messagingSenderId: "87381461519",
    appId: "1:87381461519:web:465e56ab49d2a1868bf17a",
    measurementId: "G-JC5BJ0FQT6"
});

export const db = firebaseApp.firestore();