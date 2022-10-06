
// Global variables

const RANDOM_BATCH = 100;
const RANDOM_ORG_URL = `https://www.random.org/integers/`;

var randoms;
var stats;

const names = ["rock", "paper", "scisors", "lizard", "spock"];

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

/*
Function generates given number of random numbers 0-4
and returns an array
*/

function generateLocalRandoms(number) {
    let array = [];
    
    for (let i = 0; i < number; i++) {
        array.push(Math.floor(Math.random() * 5))
    }
    return array;
}

/*
Main game logic routine called from Event Handler on icons
in game decision section, receives event object
*/

function gameThrow (e) {
    
    // Find out which opponent was selected for this throw
    // and call oppReply to apply corresponding strategy
    console.log(oppReply(document.getElementById("opp-select-game").value));    
}

// Make decision on opponent's throw and return decision

function oppReply (selectedOpponent) {

    // Sheldon's logic to always throw spock
    if (selectedOpponent === "sheldon") {
        return "spock";
    }
    
    // Random throw logic
    else if (selectedOpponent === "random") {
        
        switch (Math.floor(Math.random() * 5)) {
            case 0:
                return "rock";
            case 1:
            return "paper";
            case 2:
                return "scisors";
            case 3:
            return "lizard";
            case 4:
                return "spock";
        
            default:
                return "rock";
        }
    }
    
    // Spock's logic to play agains most common player throw
    else {
        return "lizard"
    }
}

function numberToName (number) {
    if (number < 4) return names[number];
    else return "rock";
}

function nameToNumber (name) {
    let index = names.indexOf(name)
    if (index === -1) return 0;
    else return index;
}