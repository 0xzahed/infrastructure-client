// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAX6ZUr1gQZEFkE3mS9hHiOl8-BgF-mDUo",
  authDomain: "citywatch-6f44b.firebaseapp.com",
  projectId: "citywatch-6f44b",
  storageBucket: "citywatch-6f44b.firebasestorage.app",
  messagingSenderId: "882809481616",
  appId: "1:882809481616:web:c55da8802b0932873b2b15",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

export default app;
