import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "five-ais.firebaseapp.com",
  projectId: "five-ais",
  storageBucket: "five-ais.appspot.com",
  messagingSenderId: "605314854129",
  appId: "1:605314854129:web:0244e7cd181ffacf23cd50",
  measurementId: "G-PWZ0NCZL3V"
};
 
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage }