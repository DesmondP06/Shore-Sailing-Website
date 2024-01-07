// Source: https://www.youtube.com/watch?v=OcncrLyddAs 

const monthYearElement = document.getElementById('monthYear');
const datesElement = document.getElementById('dates');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const eventCards = document.getElementById('event-cards');

let currentDate = new Date();

let eventDates = ['Sat Jan 13 2024', 'Sat Jan 20 2024'];

const updateCalendar = () => {
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    const firstDay = new Date(currentYear, currentMonth, 0);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const totalDays = lastDay.getDate();
    const firstDayIndex = firstDay.getDay();
    const lastDayIndex = lastDay.getDay();

    const monthYearString = currentDate.toLocaleString
    ('default', {month: 'long', year: 'numeric'});
    monthYearElement.textContent = monthYearString;

    let datesHTML = '';

    for (let i = firstDayIndex; i > 0; i--){
        const prevDate = new Date(currentYear,currentMonth, 0 - i + 1);
        datesHTML += `<div class="date inactive">${prevDate.getDate()}</div>`;
    }
    
    for(let i = 1; i <= totalDays; i++) {
        const date = new Date(currentYear, currentMonth, i);
        const checkDate = date.toDateString();
        const activeClass = date.toDateString() === new Date().toDateString() ? 'active' : '';
        if (eventDates.includes(checkDate)) {
            datesHTML += `<btn class="date event ${activeClass}" id="${currentMonth} ${i}">${i}</btn>`
        }
        else {
            datesHTML += `<div class="date ${activeClass}">${i}</div>`;
        }
        
    }
    
    for (let i = 1; i <= 7-lastDayIndex; i++) {
        const nextDate = new Date(currentYear, currentMonth + 1, i);
        datesHTML += `<div class="date inactive">${nextDate.getDate()}</div>`;
    }
    
    datesElement.innerHTML = datesHTML;
}

updateCalendar();

prevBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    /*eventCards.innerHTML = ``;*/
    updateCalendar();
})

nextBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    /*eventCards.innerHTML = ``;*/
    updateCalendar();
})

const updateEvents = () => {
    if (event1Bool){
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
    else if (event2Bool){
        eventCards.innerHTML = `
        <div class="card" style="width: 18rem;">
            <img src="..." class="card-img-top" alt="...">
                <div class="card-body">
                <h5 class="card-title">Event 2</h5>
                <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                <a href="#" class="btn btn-primary">Sign up</a>
            </div>
        </div>`;
    }
    else{
        eventCards.innerHTML = ``
    }
}

const event1Btn = document.getElementById('0 13');
const event2Btn = document.getElementById('0 20');



let event1Bool = false;
let event2Bool = false;

event1Btn.addEventListener('click', () => {
    event1Bool = !event1Bool;
    if (event1Bool){
        event2Bool = false;
    }
    updateEvents();
})

event2Btn.addEventListener('click', () => {
    event2Bool = !event2Bool;
    if (event2Bool){
        event1Bool = false;
    }
    updateEvents();
})

