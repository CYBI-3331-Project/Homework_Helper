// DOM element references for various calendar components
const calendar = document.querySelector(".calendar"),
    date = document.querySelector(".date"),
    daysContainer = document.querySelector(".days"),
    prev = document.querySelector(".prev"),
    next = document.querySelector(".next"),
    eventDay = document.querySelector(".event-day"),
    eventDate = document.querySelector(".event-date");
    eventsContainer = document.querySelector(".events");

// Initialize variables related to current date
let today = new Date();
let dayIndex = today.getDay(); // to determine the current day of the week (0 = Sunday, 6 = Saturday)
let activeDay = today.getDate();
let month = today.getMonth();
let year = today.getFullYear();

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
const eventsArr = [
    {
        day: 26,
        month: 10,
        year: 2023,
        events: [
            {
                title: "Assessment 1",
                description: "Study chapters 5-9 for this assessment",
                time: "11:59 PM",
            },
            {
                title: "Exam 1",
                description: "Study chapters 1-5 for this exam",
                time: "11:59 PM",
            },
        ],
    },
    {
        day: 31,
        month: 10,
        year: 2023,
        events: [
            {
                title: "HALLOWEEN Party",
                description: "Will be at friends house",
                time: "08:00 PM",
            },
            {
                title: "Exam 1",
                description: "Study chapters 1-5 for this exam",
                time: "11:59 PM",
            },
        ],
    },
];
//const eventsArr = []; this'll be when automating events
//getEvents();
//console.log(eventsArr)

//function to display calendar
function initCalendar() {
    const firstDayOfWeek = new Date(year, month, activeDay - dayIndex);
    const lastDayOfWeek = new Date(year, month, activeDay + (6 - dayIndex));

    // Update the displayed date range at the top of the calendar
    date.innerHTML = `${firstDayOfWeek.getDate()} ${months[firstDayOfWeek.getMonth()]}
    ${firstDayOfWeek.getFullYear()} - ${lastDayOfWeek.getDate()} 
    ${months[lastDayOfWeek.getMonth()]} ${lastDayOfWeek.getFullYear()}`;

    let days = "";

    // Display days for the current week
    for (let i = 0; i < 7; i++) {
        const currentDay = new Date(firstDayOfWeek);
        currentDay.setDate(firstDayOfWeek.getDate() + i);

        let event = false;
        eventsArr.forEach((eventObj) => {
            if (
                eventObj.day == currentDay.getDate() &&
                eventObj.month == currentDay.getMonth() + 1 &&
                eventObj.year == currentDay.getFullYear()
            ) {
                event = true;
            }
        });

        if (
            currentDay.getDate() == new Date().getDate() &&
            currentDay.getFullYear() == new Date().getFullYear() &&
            currentDay.getMonth() == new Date().getMonth()
        ) {
            activeDay = currentDay.getDate();
            getActiveDay(currentDay.getDate());
            updateEvents(currentDay.getDate());
            if (event) {
                days += `<div class="day today active event" >${currentDay.getDate()}</div>`;
            } else {
                days += `<div class="day today active" >${currentDay.getDate()}</div>`;
            }
        } else {
            if (event) {
                days += `<div class="day event" >${currentDay.getDate()}</div>`;
            } else {
                days += `<div class="day" >${currentDay.getDate()}</div>`;
            }
        }
    }

    daysContainer.innerHTML = days;
    addListener();
}
// Initialize the calendar on page load
initCalendar();

//prev week logic
function prevWeek() {
    activeDay -= 7;
    if (activeDay <= 0) {
        month--;
        if (month < 0) {
            month = 11;
            year--;
        }
        const prevLastDay = new Date(year, month + 1, 0);
        activeDay += prevLastDay.getDate();
    }
    initCalendar();
}

//next week logic
function nextWeek() {
    const lastDay = new Date(year, month + 1, 0);
    activeDay += 7;

    if (activeDay > lastDay.getDate()) {
        const daysInCurrentMonth = lastDay.getDate();
        const daysRemainingInCurrentMonth = daysInCurrentMonth - activeDay + 7;
        
        if (month === 11) {
            year++;
            month = 0;
        } else {
            if (activeDay > daysInCurrentMonth) {
                month++;
                activeDay = daysRemainingInCurrentMonth;
            } else {
                activeDay += 7;
            }
        }
    }

    initCalendar();
}



//add eventlistenner on prev and next buttons
prev.addEventListener("click", prevWeek);
next.addEventListener("click", nextWeek);

//create function to add listenor on days after rendered
function addListener() {
    const days = document.querySelectorAll(".day");
    days.forEach((day) => {
        day.addEventListener("click", (e) => {
            //set current day as active day
            activeDay = Number(e.target.innerHTML);

            //call active day after click
            getActiveDay(e.target.innerHTML);
            updateEvents(Number(e.target.innerHTML));

            //remove active from already active day

            days.forEach((day) => {
                day.classList.remove("active");
            });
        });
    });
}

//show active days events and date to right
function getActiveDay(date) {
    const day = new Date(year, month, date);
    const dayName = day.toString().split(" ")[0];
    eventDay.innerHTML = dayName;
    eventDate.innerHTML = date + " " + months[month] + " " + year;
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
// This function will fetch events from the Flask backend
//work in progress
function fetchEvents() {
    fetch('/get_events')
    .then(response => response.json())
    .then(data => {
        // Once data is fetched, update the eventsArr with this data
        eventsArr = data;
        // Re-initialize the calendar with the new events data
        initCalendar();
    })
    .catch(error => {
        console.error("Error fetching events: ", error);
    });
}

// Call fetchEvents on page load to get events
document.addEventListener("DOMContentLoaded", function() {
    fetchEvents();
});


