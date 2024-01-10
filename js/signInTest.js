// ------------- This JS file is for switching between the sign in and sign up section on the Sign In page -------------//

// Get references to the sign-in and sign-up switch buttons
const signInBtn = document.getElementById("signInSwitch");
const signUpBtn = document.getElementById("signUpSwitch");

// Get references to the first and second forms
const fistForm = document.getElementById("form1");
const secondForm = document.getElementById("form2");

// Get references to the container div
const container = document.querySelector(".container");

// Event listener for when the sign-in switch button is clicked
signInBtn.addEventListener("click", () => {
	container.classList.remove("right-panel-active");	// Remove the right-panel-active class to show the sign-in form
});

// Event listener for when the sign-in switch button is clicked 
signUpBtn.addEventListener("click", () => {
	container.classList.add("right-panel-active");	// Add the right-panel-active class to show the sign-up form
});

// Prevent the default form submission for both forms
fistForm.addEventListener("submit", (e) => e.preventDefault());
secondForm.addEventListener("submit", (e) => e.preventDefault());
