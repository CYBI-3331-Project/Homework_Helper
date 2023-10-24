//Script for JS functions to be used in the webapp

//Vars
var screenDimmed = false;


//Test Function
function sayHello() {
    alert("Hello World");
 }

 //Toggle Study Mode screen dimness
 function toggleDimness() {
    if(screenDimmed) screenDimmed = false;
    else screenDimmed = true;

    
    if(screenDimmed) //If screen is to be dimmed
    {
        //Change the background color  of the body to a darker version of itself
        document.body.style.background = "#596566";

        //Find every element with the 'Container' class, and put them into an array called 'elements'
        elements = document.getElementsByClassName("Container");

        //For loop to iterate through each element within the array
        for(var i = 0; i < elements.length; i++)
        {
            //For each element within the array, change it's color to a darker version
            elements[i].style.backgroundColor = "#a8c2b8";
        }

        //Change the text of the button from 'Resume' to 'Pause'
        document.getElementById("TimerButton").textContent = "Pause";

    }
    else //Otherwise, if screen is to be undimmed
    {
        //Change the background color  of the body to a lighter version of itself
        document.body.style.background = "#e2ebec";

        //Find every element with the 'Container' class, and put them into an array called 'elements'
        elements = document.getElementsByClassName("Container");

        //For loop to iterate through each element within the array
        for(var i = 0; i < elements.length; i++)
        {
            //For each element within the array, change it's color to a lighter version
            elements[i].style.backgroundColor = "#C3D5CE";
        }

        //Change the text of the button from 'Pause' to 'Resume'
        document.getElementById("TimerButton").textContent = "Resume";
    }
 }

 var hours = 0;
 var minutes = 15;
 var seconds = 3;
 var paused = true;
 //Initialize the Study Mode Timer
 function initTimer(){
    hourText = document.getElementById('Hours');
    minuteText = document.getElementById('Minutes');
    secondText = document.getElementById('Seconds');

    if(hours > 9){
        hourText.textContent = hours;
    }
    else if(hours < 0){ 
        //Pass
    }
    else{
        hourText.textContent = '0' + hours.toString(10);
    }
    
    if(minutes > 9){
        minuteText.textContent = minutes;
    }
    else if(minutes < 0){ 
        //Pass
    }
    else{
        minuteText.textContent = '0' + minutes.toString(10);
    }

    if(seconds > 9){
        secondText.textContent = seconds;
    }
    else if(seconds < 0){ 
        //Pass
    }
    else{
        secondText.textContent = '0' + seconds.toString(10);
    }

    if(paused){
        //Pass
    }
    else{
        countDown();
    }
    
 }
 
 //Timer countdown function
 function countDown (){
    setTimeout(function(){
    hourText = document.getElementById('Hours');
    minuteText = document.getElementById('Minutes');
    secondText = document.getElementById('Seconds');
    if(seconds == 0){
        if(minutes > 0){
            minutes -= 1
            seconds = 59
        }
        else if(hours > 0){
            hours -= 1
            minutes = 59
            seconds = 59
        }
        else{
            pauseTimer()
        }

    }
    else
    seconds -= 1;
    initTimer();
 }, 1000);
}
 function startTimer(){
    paused = false;
    initTimer();
    disableButton(1000)
 }

  //Pause the timer
 function pauseTimer(){
    paused = true;
    disableButton(1000)
  }


 //Pause/Resume the Study Mode Timer
 function toggleTimer(){
    toggleDimness();
    if(paused){
        startTimer();
    }
    else{
        pauseTimer();
    }
  }

  function disableButton(time) {
    document.getElementById("TimerButton").disabled = true;
    setTimeout(function() {
        document.getElementById("TimerButton").disabled = false;
    }, time);
}