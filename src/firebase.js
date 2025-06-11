import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD2SFOy3svupb77FTTlJxfgox88cvracKw",
  authDomain: "apexorder-5ec26.firebaseapp.com",
  projectId: "apexorder-5ec26",
  storageBucket: "apexorder-5ec26.appspot.com",
  messagingSenderId: "624282900955",
  appId: "1:624282900955:web:4bc2b028364c7ac88aeffe",
  measurementId: "G-T67D8V3ZKR"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
