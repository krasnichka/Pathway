// src/config/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics"; // Можно раскомментировать позже

const firebaseConfig = {
  apiKey: "AIzaSyBWnxIH_oKnxEFWbLk3jvrT9iqr48hnqCE",
  authDomain: "pathway-59a9d.firebaseapp.com",
  projectId: "pathway-59a9d",
  storageBucket: "pathway-59a9d.firebasestorage.app",
  messagingSenderId: "925289991486",
  appId: "1:925289991486:web:2749852ae6fbcee100706f",
  measurementId: "G-B6XKF8JFT5"
};

// Инициализация Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app); // Раскомментируй, если нужен Analytics

// Экспортируем сервисы
export const auth = getAuth(app);
export const db = getFirestore(app);
// export { analytics }; // Раскомментируй, если нужен Analytics