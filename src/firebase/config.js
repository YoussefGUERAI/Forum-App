
// Firebase v8 syntax
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCtt3KQPERyBsO_3qOgilt35c_07Sx30Vg",
  authDomain: "forum-app-abd19.firebaseapp.com",
  projectId: "forum-app-abd19",
  storageBucket: "forum-app-abd19.firebasestorage.app",
  messagingSenderId: "992653024443",
  appId: "1:992653024443:web:62b0afa3afc42b8ed15d9e"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

export { auth, db };
