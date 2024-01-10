// ------------- This JS file is for displaying a pie chart for the data -------------//

// ----------------- Firebase Setup & Initialization ------------------------//

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {getDatabase, ref, set, update, child, get, remove, push} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// Our web app's Firebase configuration
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

// Initialize Firebase Authentication
const auth  = getAuth();

//Return an instance of the database associated with your app
const db = getDatabase(app) 

// Firebase parameter for getting data
const dbref = ref(db); 

// ------------------------- Get reference values -------------------------
let donateButton = document.getElementById("donate_button") // Donate with paypal.me button
let signOutLink = document.getElementById('signOut') // Sign out link
let currentUser = null; // Initializes currentUser to null
// ----------------------- Get User's Name --------------------------------
function getUsername() {
    // Grab value for the 'keep logged in' switch
    let keepLoggedIn = localStorage.getItem('keepLoggedIn')
  
    // Grab user information passed from signIn.js
    if(keepLoggedIn == 'yes'){
      currentUser = JSON.parse(localStorage.getItem('user'))
    }
    else{
      currentUser = JSON.parse(sessionStorage.getItem('user'))
    }
  }
  // Execeutes once the window is loaded
  window.onload = function(){
    setupChart();
    getUsername();   // Get current user's first name
    
    // Check if the user is signed in
    if (currentUser == null) {
      signOutLink.innerText = "Sign In";
      signOutLink.href = 'signIn.html';
      donateButton.href = 'signIn.html';
      donateButton.innerText = "Sign in to donate"
      }
    else{
      signOutLink.innerText = "Sign Out";
      donateButton.href = 'https://www.paypal.me/';
      donateButton.target = "_blank";
      donateButton.innerText = "Donate with paypal.me";

      // Functionality for the donate button
      donateButton.onclick = function(){
        let inputElem = document.getElementById("input");
        let value = parseFloat(inputElem.value);
        // Push the donation data to the user's record in the database
        push(ref(db, 'users/' + currentUser.uid + '/accountInfo/data/donations'), {
          amount: value
        }).then(()=>{
          alert("Donation Processed Successfully")
        }).catch((error) => {
          alert("There was an error: " + error)
        });
        //Updates total amount a user has donated in firebase
        updateUserTotalDonations(currentUser.uid)
      }
      
      // Functionality for the sign-out button
      document.getElementById('signOut').onclick = function () { 
        signOutUser();
      }
    }  
      // Fetch all donation records from all users and print to console
      fetchAllDonations();

      // Searches for event in database for Events page
      // If event exists, insert it into Your Events modal in HTML
      // If not, tell user that they aren't signed up for any events
      get(child(dbref, '/users/' + currentUser.uid + '/accountInfo/events/eventName'))
      .then((snapshot) => {
        if (snapshot.exists()){
          document.getElementById('signedUpEventsCard').innerText = `
          Name: ${snapshot.val()}`;
          get(child(dbref, '/users/' + currentUser.uid + '/accountInfo/events/eventDate'))
          .then((snapshot) => {
            document.getElementById('signedUpEventsCard').innerText += `
            Date: ${snapshot.val()}`;
          })
        }
        else {
          document.getElementById('signedUpEventsCard').innerText = `You aren't signed up for any events`;
        }
    })
    }

    // Function to sign out the current user
    function signOutUser(){
        sessionStorage.removeItem('user'); // Clear session storage
        localStorage.removeItem('user');   // Clear local storage
        localStorage.removeItem('keepLoggedIn') 
     
        signOutLink(auth).then(() => {
         // Sign-out successful
        }).catch((error) => {
         // Error occured
        });
     
        window.location = 'index.html'  // Reidrect to the index/home page
     }
  
// Function that fetches the donations of all users
async function fetchAllDonations() {
  // Return a new promise
  return new Promise((resolve, reject) => {
    // Reference to the 'users' node in the database
    var donationsRef = ref(db, 'users/');
    // Retrieve the data at the reference
    get(donationsRef).then((snapshot) => {
      // Check if the snapshot has data
      if (snapshot.exists()) {
        let sumOfDonations = 0;
        // Iterate over each user's snapshot
        snapshot.forEach((userSnapshot) => {
          // For each user, iterate over the donations data
          userSnapshot.child('accountInfo/data/donations').forEach((donationSnapshot) => {
            // Get the donation amount
            var donationValue = donationSnapshot.val();
            // Add the donation amount to the total sum
            sumOfDonations += donationValue.amount;
          });
        });
        // Resolve the promise with the total sum of donations
        resolve(sumOfDonations);
      } else {
        // If no data exists, resolve the promise with 0
        resolve(0);
      }
    }).catch((error) => {
      // Log and reject the promise if there is an error fetching the data
      console.error("Error fetching donations: ", error);
      reject(error);
    });
  });
}

// Function that creates a pie chart based on donation progress
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
      responsive: true,           // Re-size based on screen size
      title: {
        display: true,            // Display the chart title
        text: "Donation Goal Progress" 
      },
      tooltips: {
        callbacks: {
          // label function for tooltips, executed when hovering over chart elements
          label: function(tooltipItem, data) {
            var label = data.labels[tooltipItem.index] || ''; // Get the label for the hovered data point
            if (label) {
              label += ': ';  // Add a colon if there is a label
            }
            label += Math.round(data.datasets[0].data[tooltipItem.index]) + '%';
            return label; // Return the formatted label that is displayed in the tooltip
          }
        }
      }
    }
  });
  // Update the percentage in the HTML for the element that has the id 'percentage'
  const percentageElement = document.getElementById('percentage');
  percentageElement.textContent = donatedPercentage;

  const contribution = document.getElementById('contribution');
  getUserTotalDonations(currentUser.uid, contribution)
  
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

async function updateUserTotalDonations(userId) {
  // Reference to the user's donations
  const userDonationsRef = ref(db, 'users/' + userId + '/accountInfo/data/donations');
  
  // Get the current donations and calculate the sum
  get(userDonationsRef).then((snapshot) => {
    if (snapshot.exists()) {
      let totalAmount = 0;
      snapshot.forEach((donationSnapshot) => {
        const donation = donationSnapshot.val();
        totalAmount += donation.amount;
      });

      // Update the total donations for the user
      const totalDonationsRef = ref(db, 'users/' + userId + '/accountInfo/data/totalDonations');
      const updates = {};
      updates['/totalAmount'] = totalAmount;

      update(totalDonationsRef, updates).then(() => {
        console.log("Total donations updated successfully");
      }).catch((error) => {
        console.error("Error updating total donations: ", error);
      });
    } else {
      console.log("No donations to update");
    }
  }).catch((error) => {
    console.error("Error fetching donations: ", error);
  });
}

function getUserTotalDonations(userId, totalDonationsElement) {
  // Reference to the user's total donations
  const totalDonationsRef = ref(db, 'users/' + userId + '/accountInfo/data/totalDonations/totalAmount');
  
  // Retrieve the total donations amount
  get(totalDonationsRef).then((snapshot) => {
    if (snapshot.exists()) {
      const totalAmount = snapshot.val();
      // Update the HTML element with the total amount
      totalDonationsElement.textContent = totalAmount;
    } else {
      // If the total donations amount doesn't exist, set the content to '0'
      totalDonationsElement.textContent = '0';
    }
  }).catch((error) => {
    console.error("Error retrieving total donations: ", error);
  });
}


