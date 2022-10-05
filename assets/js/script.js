
// Global variables

const RANDOM_BATCH = 100;
const RANDOM_ORG_URL = `https://www.random.org/integers/`;

var areRandomsLocal;
var randoms;
var stats;

window.addEventListener("load", initLoop);

function initLoop() {

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

    // Attach event handler to players decision buttons

    document.getElementById("decision").addEventListener("click", gameThrow);

    // Pull data from local storage

    randoms = JSON.parse(window.localStorage.getItem('randoms'));
    stats = JSON.parse(window.localStorage.getItem('stats'));

    // If there are no randoms generate local set

    if (randoms === null) {
        randoms = generateLocalRandoms(RANDOM_BATCH)
        areRandomsLocal = true;
    }
}