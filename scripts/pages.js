const bodyElement = document.querySelector('body')
const navBar = document.querySelector('.navbar');
const cityElement = document.querySelectorAll('.city');
const recipePreview = document.querySelector('.recipe-preview');


function toggleDarkLightMode() {
    localStorage.getItem('darkmode') === 'true' ? localStorage.setItem('darkmode', 'false') : localStorage.setItem('darkmode', 'true');
}


document.addEventListener('DOMContentLoaded', (event) => {
    if (localStorage.getItem('darkmode') == true) {
        // Aktivieren Sie hier den Darkmode
        darkmode();
    } else {
        lightmode();
    }
});

// dark mode button/white mode button
function darkmode() {

        toggleDarkLightMode();
        console.log('clicked');
        bodyElement.classList.add('lightmode');
        bodyElement.classList.add('darkmode');
        navBar.classList.add('navbar-darkmode');
        const htmlContent = document.querySelector('.themeIcon');
        htmlContent.innerHTML === "🌙" ? htmlContent.innerHTML = "☀️" : htmlContent.innerHTML = "🌙";
        cityElement.forEach(element => {
            element.classList.add('city-darkmode');
        });
        recipePreview.classList.add('recipe-preview-darkmode');

}

function lightmode() {

        toggleDarkLightMode();
        bodyElement.classList.remove('darkmode');
        bodyElement.classList.contains('darkmode') ? navBar.classList.add('navbar-darkmode') : navBar.classList.remove('navbar-darkmode');
        const htmlContent = document.querySelector('.themeIcon');
        htmlContent.innerHTML === "🌙" ? htmlContent.innerHTML = "☀️" : htmlContent.innerHTML = "🌙";
        cityElement.forEach(element => {
            element.classList.remove('city-darkmode');
        });
        recipePreview.classList.remove('recipe-preview-darkmode');

}


const modeBtn = document.querySelector('#themeButton');
modeBtn.addEventListener('click', () => {
    if (localStorage.getItem('darkmode') === 'true') {
        lightmode();
    } else {
        darkmode();
    }
});