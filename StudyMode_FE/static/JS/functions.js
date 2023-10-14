var screenDimmed = false

function sayHello() {
    alert("Hello World")
 }

 function toggleDimness() {
    if(screenDimmed) screenDimmed = false;
    else screenDimmed = true;

    if(screenDimmed)
    {
        document.body.style.background = "#596566";

        elements = document.getElementsByClassName("Container")
        for(var i = 0; i < elements.length; i++)
        {
            elements[i].style.backgroundColor = "#a8c2b8"
        }

        document.getElementById("TimerButton").textContent = "Resume"

    }
    else
    {
        document.body.style.background = "#e2ebec";

        elements = document.getElementsByClassName("Container")
        for(var i = 0; i < elements.length; i++)
        {
            elements[i].style.backgroundColor = "#C3D5CE"
        }

        document.getElementById("TimerButton").textContent = "Pause"
    }
 }