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
console.log('today: ', today);
let dayIndex = today.getDay(); // to determine the current day of the week (0 = Sunday, 6 = Saturday)
let activeDay = today.getDate();//determine current day of month, 0-31
let month = today.getMonth();//determine current month, 0-11
let year = today.getFullYear();//determine current year, regular '2023'
let lastdayofweek;//empty global variable which allows next nav
let firstdayofweek;//empty global variable which allows prev nav
let activeMonth;
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

eventsArr = []; //this'll be when automating events
fetchEvents(); 
console.log(eventsArr)

//function to display calendar
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
        //this just proof, when you run weekly calendar, page inspect
        //console, shows that days being rendered are correct, even
        //if month changes, just after it's rendered, that's the problem
        //work in progress
        //for(var i = 0; i < keys.length; i++){
          //  obj[keys[i]] = values[i];
        //}
         //add days to list, pick from list, bam boom
        // Printing object
        //for (var key of Object.keys(obj)) {
          //  document.write(key + " => " + obj[key] + "</br>")
        //}
        //work in progress

        //check if event present on current day
        let event = false;
        eventsArr.forEach((eventObj) => {
            if (
                eventObj.day == currentDay.getDate() &&
                eventObj.month == currentDay.getMonth() + 1 &&
                eventObj.year == currentDay.getFullYear()
            ) {
                //if event found
                event = true;//if day and month and year from eventsArr 
            } //(list of events top of code) match days in month, event = true

        });
        //if day is today add class today
        if ( //simply gets todays date (day, month, year
            currentDay.getDate() == new Date().getDate() &&
            currentDay.getFullYear() == new Date().getFullYear() &&
            currentDay.getMonth() == new Date().getMonth()
        ) {
            activeDay = currentDay.getDate();
            getActiveDay(currentDay.getDate());//calls function todays date (1-31), updates right side with todays date (active day)
            updateEvents(currentDay.getDate());//calls function with todays date (1-31), updates right side with todays date events (if there is any)
//if event found also add event class, only for current day (not selected/active day, literally todays date irl)
            if (event) {
                days += `<div class="day today active event" >${currentDay.getDate()}</div>`;
            } else {//above/below is only for todays (IRL) date, on boot will run bottom, if event runs top
                days += `<div class="day today active" >${currentDay.getDate()}</div>`;
            }
        } else {
            if (event) {
                days += `<div class="day event" >${currentDay.getDate()}</div>`;
            } else {//for every other day, event top no event bottom
                days += `<div class="day" >${currentDay.getDate()}</div>`;
            }
        }
    }

    daysContainer.innerHTML = days;
//add listener after calendar initialized
    addListener();
}

// Initialize the calendar on page load
initCalendar(activeDay);

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
    var activeYear = date.getFullYear(); // Get the year from the selected day
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

function updateEvents(date) {
    let events = "";
    eventsArr.forEach((event) => {
        //get events of active day only
        if (
            date == event.day &&
            month + 1 == event.month &&
            year == event.year
        ) {
            //show event on document
            event.events.forEach((event) => {
                events += `
                <div class="event">
                    <div class="title">
                        <i class="fas fa-circle"></i>
                        <h3 class="event-title">${event.title}</h3>
                    </div>
                    <div class="event-description">
                        <span class="event-description">${event.description}</span>
                    </div> 
                    <div class="event-time">
                        <span class="event-time">${event.time}</span>
                    </div>
                </div>
                `;
            });
        }
    });

    //if nothing found

    if ((events == "")) {
        events = `<div class="no-event">
                <h3>No Events</h3>
            </div>`;
    }
    console.log(events);
    eventsContainer.innerHTML = events;
}

//everything below


