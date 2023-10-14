var screenDimmed = false

function sayHello() {
    alert("Hello World")
 }

 function toggleDimness() {
    var bg = document.body.style.background;
    var bgColor = getComputedStyle(document.body).backgroundColor
    if(screenDimmed) screenDimmed = false;
    else screenDimmed = true;

    if(screenDimmed)
    {
        document.body.style.background = "#e2ebec";
    }
    else
    {
        document.body.style.background = "#596566";
    }
 }