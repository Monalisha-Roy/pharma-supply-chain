import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
    apiKey: "AIzaSyDcys3vovHJJUycKnwidczIadPNYgTha9s",
    authDomain: "pharma-supply-chain-2e77e.firebaseapp.com",
    projectId: "pharma-supply-chain-2e77e",
    storageBucket: "pharma-supply-chain-2e77e.firebasestorage.app",
    messagingSenderId: "467719490884",
    appId: "1:467719490884:web:4d70f3b1f98fd61d971b11"
  };

// Initialize Firebase
const app = getApps().length? getApp() : initializeApp(firebaseConfig);
const auth = getAuth();
const analytics = getStorage(app);

export { app, auth, analytics }