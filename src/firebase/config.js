import firebase from 'firebase/app';

import 'firebase/analytics';
import 'firebase/auth';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDDxLqaKss3uQlJ-7vY4ilp5GLmntxq8nk",
  authDomain: "chat-app3-b25f6.firebaseapp.com",
  projectId: "chat-app3-b25f6",
  storageBucket: "chat-app3-b25f6.appspot.com",
  messagingSenderId: "969173077387",
  appId: "1:969173077387:web:118a51f9862512bcc8f38e",
  measurementId: "G-8D9BKSPZD0"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics(); 

const auth = firebase.auth();
const db = firebase.firestore(); // database

// auth.useEmulator('http://localhost:9099');
// if(window.location.hostname === 'localhost'){
//   db.useEmulator('localhost','8080');
// }

export { db, auth };
export default firebase;
  

   