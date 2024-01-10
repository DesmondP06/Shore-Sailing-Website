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

const signUpLink = document.getElementById('signUpLink');

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


    getUsername();   //Get current users first name
    // If not logged in, send user to sign in page
    if (currentUser == null) {
        signUpLink.href = 'signInTest.html';
    }
    // If user logged in, keep user in events page
    else{
        signUpLink.href = '';
    }


// Boolean for whether user has signed up for event or not
let signedUp = false;

// When Sign Up button clicked, this function runs
document.getElementById("signUpLink").onclick = function(){
  // If user is not signed up, add the event to database
  if (!signedUp){
    set(ref(db, 'users/' + user.uid + '/accountInfo' + '/events'), {
      ['event1']: '0/13/24'
    })
    .then(() => {
      //Data updated successfully
      alert("Successfully signed up for event");
      signUpLink.innerText = 'Remove Event';
      signedUp = true;
    })
    .catch((error) => {
      // Update failed
      alert(error)
    })
  }
  // If user is signed up, remove event from database
  else {
    remove(ref(db, 'users/' + user.uid + '/accountInfo' + '/events/' + event1))
    .then(() => {
      alert("Event removed successfully");
      signUpLink.innerText = 'Sign Up';
      signedUp = false;
    })
    .catch((error) => {
      alert(error);
    })
  }
}
