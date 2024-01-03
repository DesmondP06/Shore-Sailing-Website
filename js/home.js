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

// ---------------------// Get reference values ------------------------------
let userLink = document.getElementById('userLink'); //Username for navbar
let signOutLink = document.getElementById('signOut') //sign out link
let welcome = document.getElementById('welcome'); // welcome header
let currentUser = null; //initialize currentUser to null

// ----------------------- Get User's Name'Name ------------------------------
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

// Sign-out function that will remove user info from local/session storage and
// sign-out from FRD

function signOutUser(){
   sessionStorage.removeItem('user'); //Clear session storage
   localStorage.removeItem('user'); //Clear local storage
   localStorage.removeItem('keepLoggedIn') 

   signOutLink(auth).then(() => {
    //Sign-out successfu
   }).catch((error) => {
    //error occured
   });

   window.location = 'home.html'
}



// ------------------------Set (insert) data into FRD ------------------------
function setData(userId, year, month, day, temperature) {
  set(ref(db, 'users/' + userId + '/data/' + year + '/' + month), {
    [day]: temperature
  }).then(()=>{
    alert("Data stored successfully")
  }).catch((error) => {
    alert("There was an error: " + error)
  })
}

// -------------------------Update data in database --------------------------
function updateData(userId, year, month, day, temperature) {
  update(ref(db, 'users/' + userId + '/data/' + year + '/' + month), {
    [day]: temperature
  }).then(()=>{
    alert("Data stored successfully")
  }).catch((error) => {
    alert("There was an error: " + error)
  })
}

// ----------------------Get a datum from FRD (single data point)---------------
function getData(userId, year, month, day) {
  let yearVal = document.getElementById("yearVal")
  let monthVal = document.getElementById("monthVal")
  let dayVal = document.getElementById("dayVal")
  let tempVal = document.getElementById("tempVal")

  const dbref = ref(db);
  //Pass that into the get function
  get(child(dbref, 'users/' + userId + "/data/" + year + "/" + month))
  .then((snapshot) => {
    if (snapshot.exists){
      yearVal.textContent = year;
      monthVal.textContent = month;
      dayVal.textContent = day;
      //to get specific data value from key:   snapshot.val()[key]
      tempVal.textContent = snapshot.val()[day] //day is key for key value pair of day: temp

    }
    else{
      alert("No data found")
    }
  }).catch((error) => {
    alert("Unsuccessful: " + error.message)
  })

}

// ---------------------------Get a month's data set --------------------------
// Must be an async function because you need to get all the data from FRD
// before you can process it for a table or graph

async function getDataSet(userId, year, month){
  let yearVal = document.getElementById("setYearVal");
  let monthVal = document.getElementById("setMonthVal");

  yearVal.textContent = `Year: ${year}`;
  monthVal.textContent = `Year: ${month}`;

  const days = []; //If you wanted to graph the data, you would attach these arrays as the data for ChartJS
  const temps = [];
  const tbodyEl = document.getElementById("tbody-2"); //Select tbody element

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
  });

  //Dynamically add table rows to HTML using string intepolation 
  tbodyEl.innerHTML = '' //Clears any existing table
  for(let i = 0; i < days.length; i++){
    addItemToTable(days[i], temps[i], tbodyEl)
  }

}

// Add a item to the table of data
function addItemToTable(day, temp, tBody){
  let tRow = document.createElement('tr');
  let td1 = document.createElement('td');
  let td2 = document.createElement('td');

  td1.innerHTML = day;
  td2.innerHTML = temp;

  tRow.appendChild(td1);
  tRow.appendChild(td2);

  tBody.appendChild(tRow);

}


// -------------------------Delete a day's data from FRD ---------------------

function deleteData(userId, year, month, day) {
  remove(ref(db, 'users/' + userId + "/data/" + year + "/" + month + '/' +  day))
  .then(() => {
    alert("Data has been removed from database")
  })
  .catch ((error) =>
  alert("Unsuccessful, error: " + error));
}


// --------------------------- Home Page Loading -----------------------------
window.onload = function(){

  // ------------------------- Set Welcome Message -------------------------
  getUsername();   //Get current users first name
  if (currentUser == null) {
    userLink.innerText = "Create New Account";
    userLink.classList.replace("nav-link", "btn");
    userLink.classList.add("btn-primary");
    userLink.href = 'signup.html';

    signOutLink.innerText = "Sign In";
    signOutLink.classList.replace('nav-link','btn');
    signOutLink.classList.add('btn-success');
    signOutLink.href = 'signIn.html';
  }

  else{
    console.log(currentUser)
    userLink.innerText = currentUser.firstName;
    welcome.innerText = "Welcome " + currentUser.firstName;
    userLink.classList.replace("btn", "nav-link");
    userLink.classList.add("btn-primary");
    userLink.href = '#';

    signOutLink.innerText = "Sign Out";
    signOutLink.classList.replace('btn', 'nav-link');
    signOutLink.classList.add('btn-success');
    document.getElementById('signOut').onclick = function () { 
      signOutUser();
    }

  }
  
  // Get, Set, Update, Delete Sharkriver Temp. Data in FRD
  // Set (Insert) data function call
  document.getElementById('set').onclick = function() {
    const year = document.getElementById('year').value;
    const month = document.getElementById('month').value;
    const day = document.getElementById('day').value;
    const temperature = document.getElementById('temperature').value;
    const userId = currentUser.uid

    setData(userId, year, month, day, temperature)

  }


  // Update data function call
  document.getElementById('update').onclick = function() {
    const year = document.getElementById('year').value;
    const month = document.getElementById('month').value;
    const day = document.getElementById('day').value;
    const temperature = document.getElementById('temperature').value;
    const userId = currentUser.uid

    updateData(userId, year, month, day, temperature)

  }

  // Get a datum function call
  document.getElementById("get").onclick = function(){
    const year = document.getElementById('getYear').value;
    const month = document.getElementById('getMonth').value;
    const day = document.getElementById('getDay').value;
    const userId = currentUser.uid;

    getData(userId, year, month, day);


  }

  // Get a data set function call
  document.getElementById("getDataSet").onclick = function(){

    const year = document.getElementById('getSetYear').value;
    const month = document.getElementById('getSetMonth').value;
    const userId = currentUser.uid;
  
    getDataSet(userId, year, month);
  }
 

  // Delete a single day's data function call
  document.getElementById("delete").onclick = function(){ 

    const year = document.getElementById('delYear').value;
    const month = document.getElementById('delMonth').value;
    const day = document.getElementById('delDay').value;
    const userId = currentUser.uid
    
    deleteData(userId, year, month, day)
  }
}

