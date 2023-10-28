const calendar = document.querySelector(".calendar"),
    date = document.querySelector(".date"),
    daysContainer = document.querySelector(".days"),
    prev = document.querySelector(".prev"),
    next = document.querySelector(".next"),
    eventDay = document.querySelector(".event-day"),
    eventDate = document.querySelector(".event-date");
    eventsContainer = document.querySelector(".events");

let today = new Date();
let activeDay;
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
        day: 5,
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
];
//const eventsArr = []; this'll be when automating events
//getEvents();
//console.log(eventsArr)

//function to add days
function initCalendar() {
    //to get prev month days and current month all days and rem next days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const prevLastDay = new Date(year, month, 0);
    const prevDays = prevLastDay.getDate();
    const lastDate = lastDay.getDate();
    const day = firstDay.getDay();
    const nextDays = 7 - lastDay.getDay() - 1;

    //update date top of calendar
    date.innerHTML = months[month] + " " + year;

    //adding days on dom
    let days = "";

    //prev month days

    for (let x = day; x > 0; x--) {
        days += `<div class="day prev-date">${prevDays - x + 1}</div>`;
    }

    //current month days

    for (let i = 1; i <= lastDate; i++) {

        //check if event present on current day

        let event = false; 
        eventsArr.forEach((eventObj) => {
            if (
                eventObj.day == i &&
                eventObj.month == month + 1 &&
                eventObj.year == year
            ) {
                //if event found
                event = true;
            }
        });
        //if day is today add class today
        if ( 
          i == new Date().getDate() && 
          year == new Date().getFullYear() && 
          month == new Date().getMonth()
        ) {

          activeDay = i;
          getActiveDay(i);
          updateEvents(i);
          //if event found also add event class
          if (event) {
            days += `<div class="day today active event" >${i}</div>`;
          } else {
            days += `<div class="day today active" >${i}</div>`;
          }
        }
        //add remaining as it is
        else {
            if (event) {
                days += `<div class="day event" >${i}</div>`;
              } else {
                days += `<div class="day" >${i}</div>`;
              }        
            }
        }
    
    //next month days

    for (let j = 1; j <= nextDays; j++) {
        days += `<div class="day next-date " >${j}</div>`;
    }

    daysContainer.innerHTML = days;
    //add listener after calendar initialized
    addListener();
}

initCalendar();

//prev month

function prevMonth() {
    month--;
    if (month < 0) {
        month = 11;
        year--;
    }
    initCalendar();
}

//next month

function nextMonth() {
    month++;
    if (month > 11) {
        month = 0;
        year++;
    }
    initCalendar();
}

//add eventlistenner on prev and next

prev.addEventListener("click", prevMonth);
next.addEventListener("click", nextMonth);

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


