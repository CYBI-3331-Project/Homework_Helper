const prevWeekButton = document.getElementById('prevWeek');
const nextWeekButton = document.getElementById('nextWeek');
const currentWeekRangeElem = document.getElementById('currentWeekRange');
const daysContainer = document.querySelector('.days');

let startOfWeek = new Date();
startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

function updateCalendar() {
  daysContainer.innerHTML = '';
  let days = [];
  let endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 6);

  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(startOfWeek);
    currentDate.setDate(startOfWeek.getDate() + i);
    days.push(currentDate.toDateString());
  }
  
  days.forEach(day => {
    const dayDiv = document.createElement('div');
    dayDiv.classList.add('day');
    dayDiv.textContent = day;
    daysContainer.appendChild(dayDiv);
  });

  currentWeekRangeElem.textContent = `${startOfWeek.toDateString()} - ${endOfWeek.toDateString()}`;
}

prevWeekButton.addEventListener('click', () => {
  startOfWeek.setDate(startOfWeek.getDate() - 7);
  updateCalendar();
});

nextWeekButton.addEventListener('click', () => {
  startOfWeek.setDate(startOfWeek.getDate() + 7);
  updateCalendar();
});

// Initialize the calendar on page load
updateCalendar();

//function to show events of that day
//pulled from script_calendar.js
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