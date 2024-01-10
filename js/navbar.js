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
    setupChart();
    getUsername();   //Get current users first name
    if (currentUser == null) {
      signOutLink.innerText = "Sign In";
      signOutLink.href = 'signInTest.html';
      donateButton.href = 'signInTest.html';
      donateButton.innerText = "Sign in to donate"
      }

    else{
      signOutLink.innerText = "Sign Out";
      donateButton.href = 'https://www.paypal.me/';
      donateButton.target = "_blank";
      donateButton.innerText = "Donate with paypal.me";
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
      document.getElementById('signOut').onclick = function () { 
        signOutUser();
      }
      // Fetch all donation records and print to console
      fetchUserDonations(currentUser.uid);
    }  
      // Fetch all donation records from all users and print to console
      fetchAllDonations();

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
  
//Fetches the donations of an individual user
async function fetchUserDonations(userId) {
  var userDonationsRef = ref(db, 'users/' + userId + '/accountInfo/data/donations');

  get(userDonationsRef).then((snapshot) => {
    if (snapshot.exists()) {
      snapshot.forEach((donationSnapshot) => {
        var donationKey = donationSnapshot.key;
        var donationValue = donationSnapshot.val();

        // Process each donation here
        console.log("Donation key: " + donationKey + ", Amount: " + donationValue.amount);
      });
    } else {
      console.log("No donations found for user " + userId);
    }
  }).catch((error) => {
    console.error("Error fetching user donations: ", error);
  });
}
//Fetches the donations of all users
async function fetchAllDonations() {
  return new Promise((resolve, reject) => {
    var donationsRef = ref(db, 'users/');
    get(donationsRef).then((snapshot) => {
      if (snapshot.exists()) {
        let sumOfDonations = 0;
        snapshot.forEach((userSnapshot) => {
          userSnapshot.child('accountInfo/data/donations').forEach((donationSnapshot) => {
            var donationValue = donationSnapshot.val();
            sumOfDonations += donationValue.amount;
          });
        });
        resolve(sumOfDonations);
      } else {
        resolve(0);
      }
    }).catch((error) => {
      console.error("Error fetching donations: ", error);
      reject(error);
    });
  });
}

async function createChart (totalDonated) {
  const ctx = document.getElementById('myChart');

  const donationGoal = 1000; // Example donation goal
  
  // Calculate percentages
  const donatedPercentage = (totalDonated / donationGoal) * 100;
  const remainingPercentage = 100 - donatedPercentage;

  const xValues = ["Donated", "Remaining"];
  const yValues = [donatedPercentage, remainingPercentage];
  const barColors = ["#1100FF", "#FF0011"];

  const myChart = new Chart(ctx, {
    type: "pie", 
    data: {
      labels: xValues,
      datasets: [{
        backgroundColor: barColors,
        data: yValues
      }]
    },
    options: {
      title: {
        display: true,
        text: "Donation Goal Progress"
      },
      tooltips: {
        callbacks: {
          label: function(tooltipItem, data) {
            var label = data.labels[tooltipItem.index] || '';
            if (label) {
              label += ': ';
            }
            label += Math.round(data.datasets[0].data[tooltipItem.index]) + '%';
            return label;
          }
        }
      }
    }
  });
}
async function setupChart() {
  try {
    const totalDonated = await fetchAllDonations();
    // Use totalDonated to set up your chart here
    createChart(totalDonated);
  } catch (error) {
    console.error("Error in setting up chart: ", error);
    // Handle any errors here
  }
}



