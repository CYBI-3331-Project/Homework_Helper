const calendar = document.querySelector(".calendar"),
    date = document.querySelector(".date"),
    daysContainer = document.querySelector(".days"),
    prev = document.querySelector(".prev"),
    next = document.querySelector(".next"),
    eventDay = document.querySelector(".event-day"),
    eventDate = document.querySelector(".event-date");
    eventsContainer = document.querySelector(".events");

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

//function to add days
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

initCalendar();

//prev month

function prevWeek() {
    activeDay -= 7;
    if (activeDay <= 0) {
        month--;
        if (month < 0) {
            month = 11;
            year--;
        }
        const prevLastDay = new Date(year, month, 0);
        activeDay += prevLastDay.getDate();
    }
    initCalendar();
}

//next month

function nextWeek() {
    const lastDay = new Date(year, month + 1, 0);
    activeDay += 7;
    if (activeDay > lastDay.getDate()) {
        activeDay -= lastDay.getDate();
        month++;
        if (month > 11) {
            month = 0;
            year++;
        }
    }
    initCalendar();
}

//add eventlistenner on prev and next

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

            //if prev month day clicked goto prev month and add active

            if (e.target.classList.contains("prev-date")) {
                prevWeek();

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
                nextWeek();

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
//just something from chat gpt to give us an idea
// This function will fetch events from the Flask backend
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


