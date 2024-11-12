  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyDBaB4qJvBEF7XpgjyGjI63phbuSm5HLnc",
    authDomain: "metodologias-d20d9.firebaseapp.com",
    projectId: "metodologias-d20d9",
    storageBucket: "metodologias-d20d9.firebasestorage.app",
    messagingSenderId: "1010841761580",
    appId: "1:1010841761580:web:6442c8d679676b6c45de89",
    measurementId: "G-0ZKNCC7BLC"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
