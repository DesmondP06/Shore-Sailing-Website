// Source: https://www.youtube.com/watch?v=OcncrLyddAs 

const monthYearElement = document.getElementById('monthYear');  // Variable for editing inner HTML of month year header for calendar
const datesElement = document.getElementById('dates');          // Variable for editing inner HTML of days for calendar
const prevBtn = document.getElementById('prevBtn');             // Variable for editing inner HTML previous button for calendar
const nextBtn = document.getElementById('nextBtn');             // Variable for editing inner HTML next button for calendar
const eventCards = document.getElementById('event-cards');      // Variable for editing inner HTML event days for calendar


let currentDate = new Date();               // Create new current date

let eventDates = ['Sat Jan 13 2024'];       // Create array for dates with events

// Update calendar function
const updateCalendar = () => {
    const currentYear = currentDate.getFullYear();      //Variable for current year
    const currentMonth = currentDate.getMonth();        //Variable for current month

    const firstDay = new Date(currentYear, currentMonth, 0);        // Variable for first day of current month
    const lastDay = new Date(currentYear, currentMonth + 1, 0);     // Variable for last day of current month
    const totalDays = lastDay.getDate();                            // Variable for total days in current month
    const firstDayIndex = firstDay.getDay();                        // Variable for index of firstDay

    // Create header string for calendar
    const monthYearString = currentDate.toLocaleString      
    ('default', {month: 'long', year: 'numeric'});
    monthYearElement.textContent = monthYearString;

    // Create variable for days for calendar
    let datesHTML = '';

    //Create invisible days before first day of the month
    for (let i = firstDayIndex; i > 0; i--){
        const prevDate = new Date(currentYear,currentMonth, 0 - i + 1);
        datesHTML += `<div class="date inactive">${prevDate.getDate()}</div>`;
    }
    
    for(let i = 1; i <= totalDays; i++) {                                                                       // For loop to create all days of the current month
        const date = new Date(currentYear, currentMonth, i);                                                    // Create new date with each day of the month
        const checkDate = date.toDateString();                                                                  // Create variable for checking whether date is an event date
        const activeClass = date.toDateString() === new Date().toDateString() ? 'active' : '';                  // Create activeClass variable that assigns 'active' to variable if date = current date and '' to variable if not 
        if (eventDates.includes(checkDate)) {                                                                   // Checks whether date is in the eventDate array
            datesHTML += `<div class="date event ${activeClass}" id="event-${currentMonth}-${i}">${i}</div>`    // If so, creates HTML date with class event class 
        }
        else {
            datesHTML += `<div class="date ${activeClass}">${i}</div>`;                                         // If not, creates HTML as a normal date 
        }
        
    }
    
    // Edits inner HTML of id='dates' element in HTML
    datesElement.innerHTML = datesHTML;
}

// Calls updateCalendar function
updateCalendar();

// If previous button is clicked
prevBtn.addEventListener('click', () => {
    // Set month to previous month
    currentDate.setMonth(currentDate.getMonth() - 1);   
    // Call updateCalendar function
    updateCalendar();
})

// If next button is clicked
nextBtn.addEventListener('click', () => {
    // Set month to next month
    currentDate.setMonth(currentDate.getMonth() + 1);
    // Call updateCalendar function
    updateCalendar();
})






/*
// Create variable for event button using id of month and day
const event1 = document.getElementById('0 13');

// If button is clicked
event1.addEventListener('mouseover', () => {
     // Create card for id='event-cards' element
     eventCards.innerHTML = `
     <div class="card" style="width: 18rem;">
         <img src="..." class="card-img-top" alt="...">
             <div class="card-body">
             <h5 class="card-title">Event 1</h5>
             <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
             <a href="#" class="btn btn-primary">Sign up</a>
         </div>
     </div>`;
})

// Create updateEvents function
const updateEvents = () => {
    // If event1 boolean is true
    if (event1Bool){
        // Create card for id='event-cards' element
        eventCards.innerHTML = `
        <div class="card" style="width: 18rem;">
            <img src="..." class="card-img-top" alt="...">
                <div class="card-body">
                <h5 class="card-title">Event 1</h5>
                <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                <a href="#" class="btn btn-primary">Sign up</a>
            </div>
        </div>`;
    }
    else{
        // If event1 boolean is false, clear id='event-cards' element
        eventCards.innerHTML = ``
    }
}
*/
/*eventCards.innerHTML = `
        <div class="card" style="width: 18rem;">
            <img src="..." class="card-img-top" alt="...">
                <div class="card-body">
                <h5 class="card-title">Event 1</h5>
                <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                <a href="#" class="btn btn-primary">Sign up</a>
            </div>
        </div>`;*/







