//Script for JS functions to be used in the webapp

//Vars
var screenDimmed = false


//Test Function
function sayHello() {
    alert("Hello World")
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
        elements = document.getElementsByClassName("Container")

        //For loop to iterate through each element within the array
        for(var i = 0; i < elements.length; i++)
        {
            //For each element within the array, change it's color to a darker version
            elements[i].style.backgroundColor = "#a8c2b8"
        }

        //Change the text of the button from 'Resume' to 'Pause'
        document.getElementById("TimerButton").textContent = "Pause"

    }
    else //Otherwise, if screen is to be undimmed
    {
        //Change the background color  of the body to a lighter version of itself
        document.body.style.background = "#e2ebec";

        //Find every element with the 'Container' class, and put them into an array called 'elements'
        elements = document.getElementsByClassName("Container")

        //For loop to iterate through each element within the array
        for(var i = 0; i < elements.length; i++)
        {
            //For each element within the array, change it's color to a lighter version
            elements[i].style.backgroundColor = "#C3D5CE"
        }

        //Change the text of the button from 'Pause' to 'Resume'
        document.getElementById("TimerButton").textContent = "Resume"
    }
 }

 //Initialize the Study Mode Timer
 function initTimer(studyTime){
    timer = getElementById('TimerButton')
    timer.textContent = studyTime

    


 }

  //Pause/Resume the Study Mode Timer
  function toggleTimer(){

  }