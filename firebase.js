import { firebase } from "@firebase/app";
import "@firebase/firestore";

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyAwyK-KMhD7B5Y_arz-4vrMsxciPBsn39M",
    authDomain: "trollmusic-222416.firebaseapp.com",
    databaseURL: "https://trollmusic-222416.firebaseio.com",
    projectId: "trollmusic-222416",
    storageBucket: "trollmusic-222416.appspot.com",
    messagingSenderId: "459238484465"
});

export const db = firebaseApp.firestore();