

// If month is January (month with an event), create event card below calendar
if (currentMonth == 0) {
    // If user is signed in, make sign up link bring user to index page
    if (signedIn) {
        eventCards.innerHTML = `
        <div class="card" style="width: 18rem;" id="card-1">
            <img src="img/420BackgroundImage.jpeg" class="card-img-top" alt="...">
                <div class="card-body">
                <h5 class="card-title">Sailing Day</h5>
                <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                <a class="btn btn-primary" src="index.html">Sign up</a>
            </div>
        </div>`
    }
    // If user is signed in, make sign up link bring user to signin/signup page
    else {
        eventCards.innerHTML = `
        <div class="card" style="width: 18rem;" id="card-1">
            <img src="img/420BackgroundImage.jpeg" class="card-img-top" alt="...">
                <div class="card-body">
                <h5 class="card-title">Sailing Day</h5>
                <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                <a class="btn btn-primary" src="signInTest.html">Sign up</a>
            </div>
        </div>` 
    }
}
// If month doesn't have any events, leave event-cards section empty
else {
    eventCards.innerHTML = '';
}