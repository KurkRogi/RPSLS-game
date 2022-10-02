window.addEventListener("load", mainLoop);

function mainLoop() {

// Attach event handlers to navigation buttons

document.getElementById("game-rules-button").addEventListener( 'click', e => {
    const screen = document.getElementById("rules-screen");
    screen.classList.toggle("visible");
});

document.getElementById("game statistics-button").addEventListener( 'click', e => {
    const screen = document.getElementById("stats-screen");
    screen.classList.toggle("visible");
});

for (let i of document.getElementsByClassName("close-icon")) {
    i.addEventListener('click', e => {
        e.target.parentElement.parentElement.classList.toggle("visible");
    })
}
}