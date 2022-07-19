import firebase from 'firebase/app';

import 'firebase/analytics';
import 'firebase/auth';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDLhopsvduKngIoj915ViR5J6YXpqNaK0g",
  authDomain: "chatt-app-7b9d8.firebaseapp.com",
  projectId: "chatt-app-7b9d8",
  storageBucket: "chatt-app-7b9d8.appspot.com",
  messagingSenderId: "623223877318",
  appId: "1:623223877318:web:485f9344fb4a6f7ed3f1c7",
  measurementId: "G-EGJLWNK6WY"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

const auth = firebase.auth();
const db = firebase.firestore();

  

auth.useEmulator('http://localhost:9099');
if (window.location.hostname === 'localhost') {
  db.useEmulator('localhost', '8080');
}

export { db, auth };
export default firebase;
  //export default firebase;

  // const firebaseConfig = {
  //   apiKey: "AIzaSyDLhopsvduKngIoj915ViR5J6YXpqNaK0g",
  //   authDomain: "chatt-app-7b9d8.firebaseapp.com",
  //   projectId: "chatt-app-7b9d8",
  //   storageBucket: "chatt-app-7b9d8.appspot.com",
  //   messagingSenderId: "623223877318",
  //   appId: "1:623223877318:web:485f9344fb4a6f7ed3f1c7",
  //   measurementId: "G-EGJLWNK6WY"
  // };