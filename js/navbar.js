// ----------------- Page Loaded After User Sign-in -------------------------//

// ----------------- Firebase Setup & Initialization ------------------------//

// Import the functions you need from the SDKs you need


// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {getDatabase, ref, set, update, child, get, remove} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCe7ou1G1JOX9IageTZpCmejeaB2NyZuWw",
  authDomain: "shoresailing2023.firebaseapp.com",
  databaseURL: "https://shoresailing2023-default-rtdb.firebaseio.com",
  projectId: "shoresailing2023",
  storageBucket: "shoresailing2023.appspot.com",
  messagingSenderId: "99745152338",
  appId: "1:99745152338:web:6ced14170f65d326844e8b"
};

  // Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth  = getAuth(); //Firebase authentication

//Return an instance of the database associated with your app
const db = getDatabase(app) 


    // ------------------------- Set Welcome Message -------------------------
let signOutLink = document.getElementById('signOut') //sign out link
let currentUser = null; //initialize currentUser to null
function getUsername() {
    //Grab value for the 'keep logged in' switch
    let keepLoggedIn = localStorage.getItem('keepLoggedIn')
  
    //Grab user information passed from signIn.js
    if(keepLoggedIn == 'yes'){
      currentUser = JSON.parse(localStorage.getItem('user'))
    }
    else{
      currentUser = JSON.parse(sessionStorage.getItem('user'))
    }
  }

  window.onload = function(){
    getUsername();   //Get current users first name
    if (currentUser == null) {
      signOutLink.innerText = "Sign In";
      signOutLink.href = 'signInTest.html';
    }
  
    else{
      signOutLink.innerText = "Sign Out";
      document.getElementById('signOut').onclick = function () { 
        signOutUser();
      }
  
    }
    function signOutUser(){
        sessionStorage.removeItem('user'); //Clear session storage
        localStorage.removeItem('user'); //Clear local storage
        localStorage.removeItem('keepLoggedIn') 
     
        signOutLink(auth).then(() => {
         //Sign-out successful
        }).catch((error) => {
         //error occured
        });
     
        window.location = 'index.html'
     }
  }