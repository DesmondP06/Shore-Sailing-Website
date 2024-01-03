// ----------------- User Sign-In Page --------------------------------------//

// ----------------- Firebase Setup & Initialization ------------------------//
// Import the functions you need from the SDKs you need


// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {getDatabase, ref, set, update, child, get} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
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

const auth = getAuth(app); //Firebase authentication

//Return an instance of the database associated with your app
const db = getDatabase(app) 

// ---------------------- Sign-In User ---------------------------------------//
document.getElementById('signIn').onclick = function(){
    //get user's email and password for sign in
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;
 
    //console.log(email, password)

    //Attempt to sign user in 
    signInWithEmailAndPassword(auth, email, password)
    .then(
    (userCredential) => {
        //Create user credential and store user Id
        const user = userCredential.user;
        //alert(user.uid)

        //Log the sign in date in database
        //'Update' will only add the last log in info. Will not overwrite everything else
        let logDate = new Date();
        update(ref(db, 'users/' + user.uid + '/accountInfo'), {
            last_login: logDate,
        })
        .then( () => {
            //User signed in succesfully
            alert("Signed in successfully")
            //get snapshot of all the user info (including uid) that will be 
            //passed into login() function function and stored in session or local storage
            get(ref(db, 'users/' + user.uid + '/accountInfo')).then((snapshot) => {
                if (snapshot.exists()){
                    console.log(snapshot.val());
                    logIn(snapshot.val());
                } else {
                    console.log("User does not exist")
                    
                }
            }).catch((error) => {console.log(error);})
        })
        .catch( (error) => {
            //Sign in failed
            alert(error)})
    })
    .catch((error) =>
    {
        const errorCode = error.code; //Not used for now. Error message more preferable
        const errorMessage = error.message
        alert(errorMessage)
    }

    );
}


// ---------------- Keep User Logged In ----------------------------------//
function logIn(user){
    let keepLoggedIn = document.getElementById('keepLoggedInSwitch').ariaChecked;
    //Session storage is temporary (only while session active)
    //Info. saved as a string (must convert the JS object to a string to save)
    //Session storage will be cleared with a signOut() function in the home.js file
    if (!keepLoggedIn){
        sessionStorage.setItem('user',JSON.stringify(user));
        window.location = "home.html"
    }

    //local storage is permenant (keeps user logged in if browser is closed)
    //local storage will be cleared with signOut() function

    else{
        localStorage.setItem('keepLoggedIn' , 'yes');
        localStorage.setItem('user', JSON.stringify(user));
        window.location = 'home.html'
    }

}
