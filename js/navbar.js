// ----------------- Page Loaded After User Sign-in -------------------------//

// ----------------- Firebase Setup & Initialization ------------------------//

// Import the functions you need from the SDKs you need


// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {getDatabase, ref, set, update, child, get, remove, push} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
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
let donateButton = document.getElementById("donate_button")
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
      donateButton.href = 'signInTest.html';
      }
      if (currentUser != null)
      {
      var donationsRef = ref(db, 'users/' + currentUser.uid + '/accountInfo/data/donations');

      // Fetch all donation records and print to console
      get(donationsRef).then((snapshot) => {
        
        if (snapshot.exists()) {
          snapshot.forEach((childSnapshot) => {
            var donationKey = childSnapshot.key;
            var donationValue = childSnapshot.val();

            // Process each donation here
            console.log("Donation key: " + donationKey + ", Amount: " + donationValue.amount);
          });
        } else {
          console.log("No donations found");
        }
      }).catch((error) => {
        console.error("Error fetching donations: ", error);
      });

      
      

    }
  
    else{
      signOutLink.innerText = "Sign Out";
      donateButton.href = 'https://www.paypal.me/';
      donateButton.target = "_blank"
      donateButton.onclick = function(){
        let inputElem = document.getElementById("input");
        let value = parseFloat(inputElem.value);
        push(ref(db, 'users/' + currentUser.uid + '/accountInfo/data/donations'), {
          amount: value
        }).then(()=>{
          alert("Data stored successfully")
        }).catch((error) => {
          alert("There was an error: " + error)
        });
      }
      



      }
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
  

  
  
  /*async function getDataSet(userId, year, month){
      let yearVal = document.getElementById("setYearVal");
      let monthVal = document.getElementById("setMonthVal");
    
      yearVal.textContent = `Year: ${year}`;
      monthVal.textContent = `Year: ${month}`;
    
      const days = []; //If you wanted to graph the data, you would attach these arrays as the data for ChartJS
      const temps = [];
    
      const dbref = ref(db); //Firebase parameter for requesting data
    
      //Wait for all data to be pulled from FRD
      //Must provide the path thrugh the nodes to the data
    
      await get(child(dbref, 'users/' + userId + '/data/' + year + '/' + month))
      .then((snapshot) => {
        if (snapshot.exists()){
          console.log(snapshot.val())
    
          snapshot.forEach(child => {
            console.log(child.key, child.val())
            //Push values to corresponding arrays
            days.push(child.key);
            temps.push(child.val());
          })
        }
        else {
          alert("No data found");
        }
      }).catch ((error) => {
        alert("Error: " + error)
      }); */
    
    
    