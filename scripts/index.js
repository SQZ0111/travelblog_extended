const bodyElement = document.querySelector('body')
const navBar = document.querySelector('.navbar');



// dark mode button/white mode button
const modeBtn = document.querySelector('#themeButton');
modeBtn.addEventListener('click', () => {
    console.log('clicked');
    bodyElement.classList.toggle('lightmode');
    bodyElement.classList.toggle('darkmode');
    // Abfrage mit conditional operator statt toggle
    bodyElement.classList.contains('darkmode') ? navBar.classList.add('navbar-darkmode') : navBar.classList.remove('navbar-darkmode');
    const htmlContent = document.querySelector('.themeIcon');
    htmlContent.innerHTML === "🌙" ? htmlContent.innerHTML = "☀️" : htmlContent.innerHTML = "🌙";
});
    