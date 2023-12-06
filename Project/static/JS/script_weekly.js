// DOM element references for various calendar components
//document.querySelector searches through html/css(?) to find classes named what's
//in the parenthesis
const calendar = document.querySelector(".calendar"),
    date = document.querySelector(".date"),
    daysContainer = document.querySelector(".days"),
    prev = document.querySelector(".prev"),
    next = document.querySelector(".next");

eventDay = document.querySelector(".event-day");  
eventDate = document.querySelector(".event-date");
eventsContainer = document.querySelector(".events");

// Initialize variables related to current date
let today = new Date();//todays date
let dayIndex = today.getDay(); // to determine the current day of the week (0 = Sunday, 6 = Saturday)
let activeDay = today.getDate();//determine current day of month, 0-31
let month = today.getMonth();//determine current month, 0-11
let year = today.getFullYear();//determine current year, regular '2023'
let lastdayofweek;//empty global variable which allows next nav
let firstdayofweek;//empty global variable which allows prev nav
let activeMonth;
let monthDisplay = '';
let activeYear = '';
let increment = false;
//let prevSunday;had these global before, used in prev/next nav
//let nextSunday;think we can leave it commented

const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

//default events array
//this is where events from db should be organized
//have to figure out how to have this automated once db for
//assessments is up and pull from db, possible solution more down
// Function to fetch events from the Flask backend
function fetchEvents() {
    fetch('/Homepage/get_events')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            eventsArr = data;
            // Call the function with the sample data
            sortEventsByDay(eventsArr);
            // Log the sorted events
            console.log('full eventsArr: ', eventsArr);
            initCalendar(activeDay);
        })
        .catch(error => {
            console.error("Error fetching events: ", error);
        });
}


// Call fetchEvents on page load to get events
document.addEventListener("DOMContentLoaded", function() {
    fetchEvents();
});

// Function to sort eventsArr by day, month, and year
function sortEventsByDay(events) {
    // Array to store indices where month or year changes
    events.sort((a, b) => {
        // Compare year first
        if (a[2] !== b[2]) {
            return a[2] - b[2];
        }
        // If years are the same, compare month
        if (a[1] !== b[1]) {
            return a[1] - b[1];
        }
        // If years and months are the same, compare day
        return a[0] - b[0];
    });
}

eventsArr = []; //this'll be when automating events
fetchEvents(); 

//function to display calendar ============================================================================================================================================
function initCalendar(activeDay) {
    
//if active day is 9th of month, dayindex is 4 (thursday of current week)
//9-4 = 5 (sunday of week)
    const firstDayOfWeek = new Date(year, month, activeDay - dayIndex);

//9 + (6-4) = 11, last day of week (saturday)
    const lastDayOfWeek = new Date(year, month, activeDay + (6 - dayIndex));

//global variables used in prev/next nav
//simply stealing the first/last of week
    lastdayofweek = lastDayOfWeek;
    firstdayofweek = firstDayOfWeek;

//Update the displayed date range at the top of the calendar
    date.innerHTML = `${firstDayOfWeek.getDate()} ${months[firstDayOfWeek.getMonth()]}
    ${firstDayOfWeek.getFullYear()} - ${lastDayOfWeek.getDate()} 
    ${months[lastDayOfWeek.getMonth()]} ${lastDayOfWeek.getFullYear()}`;
//adding days on dom

    activeMonth = firstDayOfWeek.getMonth();
    let days = "";
    // Display days for the current week
    for (let i = 0; i < 7; i++) {
        const currentDay = new Date(firstDayOfWeek);
        currentDay.setDate(firstDayOfWeek.getDate() + i);
        let event = false;
        for (let x = 0; x < eventsArr.length; x++) {
            try {
                if (
                    eventsArr[x][0] == currentDay.getDate() &&
                    eventsArr[x][1] == currentDay.getMonth() + 1 &&
                    eventsArr[x][2] == currentDay.getFullYear()
                ) {
                    event = true;
                    console.log('event found at: ', currentDay.getDate(), ': ', eventsArr[x]);
                    console.log('x: ', x);
                    // Handle multiple events on the same day if needed
                }
            } catch (error) {
                console.log('Error checking for events: ', error);
            }
        }
                        
        //if day is today add class today
        if (currentDay.getDate() == new Date().getDate() && currentDay.getFullYear() == new Date().getFullYear() && currentDay.getMonth() == new Date().getMonth()){
            activeDay = currentDay.getDate();
            getActiveDay(currentDay.getDate());//calls function todays date (1-31), updates right side with todays date (active day)
            updateEvents(currentDay.getDate());//calls function with todays date (1-31), updates right side with todays date events (if there is any)
//if event found also add event class, only for current day (not selected/active day, literally todays date irl)
            if (event) {
                days += `<div class="day today active event" >${currentDay.getDate()}</div>`;
            }
            else {//above/below is only for todays (IRL) date, on boot will run bottom, if event runs top
                days += `<div class="day today active" >${currentDay.getDate()}</div>`;
            }
        }
        else {
            if (event) {
                days += `<div class="day event" >${currentDay.getDate()}</div>`;
            }
            else {//for every other day, event top no event bottom
                days += `<div class="day" >${currentDay.getDate()}</div>`;
            }
        }
    }

    daysContainer.innerHTML = days;
//add listener after calendar initialized
    addListener();
}

//============================================================================================================================================
// Initialize the calendar on page load

// Function to navigate to the previous week
function prevWeek() {
    increment = false;
//firstdayofweek var is sunday (see initcal function)
    var prevSunday = new Date(firstdayofweek);
    prevSunday.setDate(prevSunday.getDate() - 1);
//goes back one day (saturday)
    while (prevSunday.getDay() !== 0) {//while Day(0-6)!=0 (sunday), decrement
        // Move to the previous Sunday
        prevSunday.setDate(prevSunday.getDate() - 1);
    }
//if prevsunday month!=currentmonth, change current month/year to prev
//sunday month
    if (prevSunday.getMonth() !== month) {
        month = prevSunday.getMonth();
        year = prevSunday.getFullYear();
    }
//resets dayIndex to 0 so first/lastdayofweek variables don't do subtract anything
    dayIndex = prevSunday.getDay();
    //calls calendar with sundays date, (0-31)
    initCalendar(prevSunday.getDate());
}
// Function to navigate to the next week
function nextWeek() {
    increment = false;
    var nextSunday = new Date(lastdayofweek);
    nextSunday.setDate(nextSunday.getDate()+ 1);

    while (nextSunday.getDay() !== 0) {
        // Move to the next Sunday
        nextSunday.setDate(nextSunday.getDate() + 1);
    }
//notes same as prevWeek function
    if (nextSunday.getMonth() !== month) {
        month = nextSunday.getMonth();
        year = nextSunday.getFullYear();
    }
    dayIndex = nextSunday.getDay();
    initCalendar(nextSunday.getDate());
}

//add eventlistenner on prev and next buttons
prev.addEventListener("click", prevWeek);
next.addEventListener("click", nextWeek);

//create function to add listenor on days after rendered
function addListener() {
    //select all elements with the class "day"
    const days = document.querySelectorAll(".day");
    //iterate over each day element and add a click event listener
    days.forEach((day) => {
        day.addEventListener("click", (e) => {
            //set current day as active day if clicked
            activeDay = Number(e.target.innerHTML);

            if(lastdayofweek.getDate() < 7){
                if(activeDay < 7){
                    increment = true
                }
                else{
                    increment = false
                }
            }
            



            //call getActiveDay to update right with activeDay s day
            getActiveDay(e.target.innerHTML);
            //update events for the newly selected day
            updateEvents(Number(e.target.innerHTML));

            //remove active from  previously active day
            days.forEach((day) => {
                day.classList.remove("active");
            });
            //add active class to clicked day
            e.target.classList.add("active");


            //if prev month day clicked goto prev month and add active

            if (e.target.classList.contains("prev-date")) {
                prevMonth();

                setTimeout(() => {
                    //select all days of that month
                    const days = document.querySelectorAll(".day");

                    //after going to prev month add active to clicked
                    days.forEach((day) => {
                        if (
                            !day.classList.contains("prev-date") &&
                            day.innerHTML == e.target.innerHTML
                        ) {
                            day.classList.add("active");
                        }
                    });
                }, 100);
                //same with next month days
            } else if (e.target.classList.contains("next-date")) {
                nextMonth();

                setTimeout(() => {
                    //select all days of that month
                    const days = document.querySelectorAll(".day");

                    //after going to next month add active to clicked
                    days.forEach((day) => {
                        if (
                            !day.classList.contains("next-date") &&
                            day.innerHTML == e.target.innerHTML
                        ) {
                            day.classList.add("active");
                        }
                    });
                }, 100);
            } else {
                //remaining current month days
                e.target.classList.add("active");
            }
        });
    });
}

//show active days events and date to right
function getActiveDay(day) {
    const date = new Date(year, month, day);
    const dayName = date.toString().split(" ")[0];
    //const activeMonth = date.getMonth(); // Get the month from the selected day
    activeYear = date.getFullYear(); // Get the year from the selected day
    eventDay.innerHTML = dayName;
    if(increment){
        monthDisplay = activeMonth + 1
        if (monthDisplay > 11) {
            monthDisplay = 0;
            activeYear++;
        }
    } else {
        monthDisplay = activeMonth
    }
    eventDate.innerHTML = day + " " + months[monthDisplay] + " " + activeYear; // Use the activeMonth and activeYear
}


//function to show events of that day
function updateEvents(y) {
    let events = "";
    if(eventsArr){
        for(let i = 0; i < eventsArr.length; i++){
            if(eventsArr[i]){
                if(eventsArr[i][0] == y && eventsArr[i][1] == monthDisplay + 1 && eventsArr[i][2] == activeYear) {
                    //show event on document
                    events += `
                    <div class="event">
                        <div class="title">
                            <i class="fas fa-circle"></i>
                            <h3 class="event-title">${eventsArr[i][3]}</h3>
                        </div>
                        <div class="event-description">
                            <span class="event-description">${eventsArr[i][4]}</span>
                        </div>`;
                    var color = '';
                    if (eventsArr[i] [5] === 'Low') {
                        color = 'yellow';
                    } else if (eventsArr[i] [5] === 'Medium') {
                        color = 'orange';
                    } else if (eventsArr[i] [5] === 'High'){
                        color = 'red';
                    } //if N/A it'll just be the same color as the event=descripon and title
                    events += `
                        <div class="event-time" style="color: ${color};">
                            <span class="event-time">${eventsArr[i][5]} Priority</span>
                        </div> 
                    </div>
                    `;
                }
            }
        }
        
    }
    //if nothing found

    if ((events == "")) {
        events = `<div class="no-event">
                <h3>No Events</h3>
            </div>`;
    }
    eventsContainer.innerHTML = events;
}

//everything below


