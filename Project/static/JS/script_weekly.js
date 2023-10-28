const date = new Date();

function renderCalendar(lastdayofweek)
  {
  var lastofweek = lastdayofweek;
  date.setDate(1);

  const monthDays     = document.querySelector(".days");
  var   lastDay       = new Date( date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const prevLastDay   = new Date( date.getFullYear(), date.getMonth(), 0 ).getDate();
  const firstDayIndex = date.getDay();
  const lastDayIndex  = new Date( date.getFullYear(), date.getMonth() + 1, 0 ).getDay();
  const nextDays      = 7 - lastDayIndex - 1;

  const months = 
    [ 'January', 'February', 'March', 'April', 'May', 'June'
    , 'July', 'August', 'September', 'October', 'November', 'December'
    ];

  document.querySelector(".date h1").innerHTML = months[date.getMonth()];
  document.querySelector(".date p").innerHTML  = new Date().toDateString();

  let days  = '' 
    , count = 0
    ;
  if (lastofweek+7 >= lastDay)
    {
    for (let x = firstDayIndex; x > 0; x--)
      {
      days      += `<div class="prev-date">${prevLastDay - x + 1}</div>`;
      count      = count+1;
      lastofweek = prevLastDay - x + 1;
      lastDay    = lastofweek;
      }
    }

  const nxtDay = 7 - count - 1;

  if (lastofweek == undefined)
    {
    for (let i = 1; i <= nxtDay+1; i++)
      {
      if (i === new Date().getDate() && date.getMonth() === new Date().getMonth()) 
        {
        days += `<div class="today">${i}</div>`;
        } 
      else 
        {
        days += `<div>${i}</div>`;
        lastDayOfWeek = i;
        }
      count = count+1;
      monthDays.innerHTML = days;
      }
    }
  else
    {
    if (lastofweek+1 > lastDay)
      {
      lastofweek = 0;
      }   
    var forCount = 0;

    for (let i = lastofweek+1; i <= lastofweek+7; i++)
      {
      if(lastDay >= i && forCount <= nxtDay)
        {
        if (i === new Date().getDate() && date.getMonth() === new Date().getMonth())
          {
          days += `<div class="today">${i}</div>`;
          } 
        else 
          {
          days += `<div>${i}</div>`;
          lastDayOfWeek = i;
          }
        count    = count+1;
        forCount = forCount + 1;
        monthDays.innerHTML = days;
        }
      } 
    }

  if (count < 7)
    {
    for (let j = 1; j <= nextDays; j++) 
      {
      days += `<div class="next-date">${j}</div>`;
      monthDays.innerHTML = days;
      }
    }
  }


document.querySelector(".prev").addEventListener("click", () => 
  {
  date.setMonth(date.getMonth());
  renderCalendar();
  });

const lastDay = new Date( date.getFullYear(), date.getMonth() + 1, 0 ).getDate();

document.querySelector(".next").addEventListener("click", () =>
  {
  if(lastDayOfWeek+7 > lastDay)
    {
    date.setMonth(date.getMonth()+1);
    renderCalendar(lastDayOfWeek);
    }
  else
    {
    date.setMonth(date.getMonth());
    renderCalendar(lastDayOfWeek);
    }
  });

renderCalendar();