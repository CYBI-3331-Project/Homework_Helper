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
let today = new Date(); //todays date
let activeDay; //empty variable
let month = today.getMonth(); //gets month from today variable (0-11)
let year = today.getFullYear(); //gets year from today variable
let lastDate = ''


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

eventsArr = []; //this'll be when automating events
fetchEvents(); 
//function to display calendar
function initCalendar() {
    //to get prev month days and current month all days and rem next days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const prevLastDay = new Date(year, month, 0);
    const prevDays = prevLastDay.getDate();
    lastDate = lastDay.getDate();
    const day = firstDay.getDay();
    const nextDays = 7 - lastDay.getDay() - 1;
    let eventIndex = 0

    //Calculate total number of events present
    if(eventsArr[0]){
        eventsArr.forEach(existingEvent => {
            console.log(eventIndex, ': ', eventsArr)
            eventIndex++;
        });
    }
    console.log("Total events present: ", eventIndex)


    //update date top of calendar
    date.innerHTML = months[month] + " " + year;

    //adding days on dom
    let days = "";

    //prev month days

    for (let x = day; x > 0; x--) {
        days += `<div class="day prev-date">${prevDays - x + 1}</div>`;
    }

    //current month days
    var l = 0;
    for (let i = 1; i <= lastDate; i++) {//1st day of month, increment by 1 until <= last day of month

        //check if event present on current day

        let event = false; 
        if(eventsArr[l]){
            console.log("Comparing event day: ", eventsArr[l][0], "  to calendar day: ", i)
            if(eventsArr[l][0] == i && eventsArr[l][1] == month + 1 && eventsArr[l][2] == year){
                event = true
                console.log("Event found on day ", i, ": ", eventsArr[l])
                l = l + 1;
            }
            else{
                if(i == lastDate)
                console.log("Event not found in calendar: ", eventsArr[l])
            }
        }

        if ( //simply gets todays date (day, month, year
          i == new Date().getDate() && 
          year == new Date().getFullYear() && 
          month == new Date().getMonth()
        ) {
          activeDay = i;
          getActiveDay(i);//calls function with i variable (todays date), updates right side with selected days date (active day)
          updateEvents(i);//calls function with i variable (todays date), updates right side with selected days events (if there is any)
          //if event found also add event class, only for current day (not selected/active day, literally todays date irl)
          if (event) {
            days += `<div class="day today active event" >${i}</div>`;//if today (irl today) is selected/active also has an event, updates days displays on calendar
          } else {
            days += `<div class="day today active" >${i}</div>`;//if today (irl today) is selected/active, updates days display on calendar
          }
        }
        //add remaining as it is
        else {
            if (event) {
                days += `<div class="day event" >${i}</div>`;//
              } else {
                days += `<div class="day" >${i}</div>`;//
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
// Initialize the calendar on page load
initCalendar();

//prev month logic
function prevMonth() {
    month--;
    if (month < 0) {
        month = 11;
        year--;
    }
    initCalendar();
}

//next month logic
function nextMonth() {
    month++;
    if (month > 11) {
        month = 0;
        year++;
    }
    initCalendar();
}

//add eventlistenner on prev and next buttons
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
                            getActiveDay(e.target.innerHTML);
                            updateEvents(Number(e.target.innerHTML));
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
                            getActiveDay(e.target.innerHTML);
                            updateEvents(Number(e.target.innerHTML));
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
    if(eventsArr){
        for(i = 0; i < lastDate; i++){
            if(eventsArr[i]){
                if(eventsArr[i][0] == date && eventsArr[i][1] == month + 1 && eventsArr[i][2] == year){
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
                            <span class="event-time">${eventsArr[i][5]}</span>
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
    console.log(events);
    eventsContainer.innerHTML = events;
}


