
let change = document.querySelector(".theme");
change.addEventListener("click", darkModeHandler);

if(localStorage.getItem("darkmode")){
    darkModeHandler();
    localStorage.setItem("darkmode", true)
}

function darkModeHandler() {
    let mainBackground = document.body
    mainBackground.classList.toggle("dark-mode")

    let navBar = document.getElementsByClassName("light");
    let contentBox = document.getElementsByClassName("light-box");

    for(i = 0; i < navBar.length; i++){
        navBar[i].classList.toggle("dark-mode-nav")
    }

    for(i = 0; i < contentBox.length; i++){
        contentBox[i].classList.toggle("dark-box")
    }
    if(localStorage.getItem("darkmode")) {
        localStorage.removeItem("darkmode");
    }
    else {
        localStorage.setItem("darkmode", true);
    }
}

