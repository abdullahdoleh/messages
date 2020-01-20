import firebase from "firebase/app";
import "firebase/firestore";

// Initialize Cloud Firestore through Firebase
firebase.initializeApp({
  apiKey: "AIzaSyAonpmCP7pmCHPYuP-eEybymvkxbr3tGfM",
  authDomain: "messages-cd92f.firebaseapp.com",
  databaseURL: "https://messages-cd92f.firebaseio.com",
  projectId: "messages-cd92f",
  storageBucket: "messages-cd92f.appspot.com",
  messagingSenderId: "625944970530",
  appId: "1:625944970530:web:f1203581b6d4e19c19d17b",
  measurementId: "G-M33BQGJPQQ"
});

export default firebase.firestore();
