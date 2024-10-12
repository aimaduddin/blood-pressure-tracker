import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDCMKfMperfmxQdmQZnYYzYp48GmouL9dI",
    authDomain: "react-bloodpressuretracker.firebaseapp.com",
    projectId: "react-bloodpressuretracker",
    storageBucket: "react-bloodpressuretracker.appspot.com",
    messagingSenderId: "896903679451",
    appId: "1:896903679451:web:ab23d398bee9b021c2abfe"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };

