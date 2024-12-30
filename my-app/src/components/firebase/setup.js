import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDDj-FuWJynlHXTXpce1eFrw-N3EmAflzc",
  authDomain: "deen-114f0.firebaseapp.com",
  projectId: "deen-114f0",
  storageBucket: "deen-114f0.appspot.com",
  messagingSenderId: "883484276224",
  appId: "1:883484276224:web:19345597c40db1e70f0ae5"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);