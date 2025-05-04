// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBdTvRhoxmO_O6lS_sykIo4vKWF59TwhMk",
  authDomain: "furia-fan-experience.firebaseapp.com",
  databaseURL: "https://furia-fan-experience-default-rtdb.firebaseio.com",
  projectId: "furia-fan-experience",
  storageBucket: "furia-fan-experience.firebasestorage.app",
  messagingSenderId: "1011669358353",
  appId: "1:1011669358353:web:22b6bcaf70d08d48bf9eb0"
};

const app = initializeApp(firebaseConfig);

export const database = getDatabase(app);

export default app;