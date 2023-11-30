const eventsContainer = document.querySelector(".event2");

// Initialize variables related to current date
let today = new Date(); //todays date
let activeDay; //empty variable
let month = today.getMonth(); //gets month from today variable (0-11)
let year = today.getFullYear(); //gets year from today variable
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
            updateEvents(eventsArr);
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

// ... (previous code) ...

// Function to show events of that day
function updateEvents(date) {
    // ... (previous code) ...

    // Dynamically populate event containers based on priority
    updateEventContainer('High', eventsArr, date, month, year, 'highPriorityEvents');
    updateEventContainer('Medium', eventsArr, date, month, year, 'mediumPriorityEvents');
    updateEventContainer('Low', eventsArr, date, month, year, 'lowPriorityEvents');
    updateEventContainer('N/A', eventsArr, date, month, year, 'naPriorityEvents');
}

// Function to show events of that day
// Function to show events of that day
let l = 0;
let x = 3;
function updateEventContainer(priority, eventsArr, date, month, year, containerId) {
    const priorityEvents = eventsArr.filter(event =>
        event && event[5] === priority
    );

    let events = "";
    if (priorityEvents.length > 0) {
        // Show events for the current priority
        var color = '';
        if (priority === 'Low') {
            color = 'yellow';
            x = 2;
            l = 0;
        } else if (priority === 'Medium') {
            color = 'orange';
            x = 1;
            l = 0;
        } else if (priority === 'High'){
            color = 'red';
            x = 0;
            l = 0;
        } else if (priority === 'N/A') {
            x = 3;
            l = 0;
        }
            //if N/A it'll just be the same color as the event=descripon and title
        events += `
            <div class="event1">
                <span class="label" style="color: ${color};">${priority} Priority Assessments</span>
                <div class="event2">
        `;
        console.log('priority events: ', priorityEvents);
        priorityEvents.forEach(event => {
            // Use the correct variable name here (e.g., priorityEvent)
            const assignmentId = l // Assuming the assignment ID is in the first position of the array
            l = l + 1;
            // Your encoded URL string
            var deleteAssessmentUrl = "/Homepage/Assignment_dash/{{url_for('delete_assessment')}}";

            // Decode the URL
            events += `
                <div class="bullet">
                    <y class="fas fa-circle"></y>
                </div>
                <div class="assessment">
                    <span class="value">${event[3]}</span>
                </div>
                <div class="actions">
                    <span class="options">
                        <a href="/Homepage/Assignment_dash/Edit_Assessment/${assignmentId}${x}"><i class="fas fa-edit"></i></a>
                        <a href="/Homepage/Assignment_dash/Delete_Assessment/${assignmentId}${x}"><i class="fas fa-trash-alt"></i></a>
                    </span>
                </div>
            `;
        });

        events += `
                </div>
            </div>
        `;
    }

    // If nothing found
    if (events === "") {
        events = `<div class="no-event">
            <h3>No Events with ${priority} priority</h3>
        </div>`;
    }

    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = events;
    }
}
