
// Global variables

const RANDOM_BATCH = 100;
const RANDOM_ORG_URL = `https://www.random.org/integers/`;

var randoms;
var stats;

const names = ["rock", "paper", "scisors", "lizard", "Spock"];
const icons = ["icon-rock", "icon-paper", "icon-scisors", "icon-lizard", "icon-spock"];
const fontAwesomeIcon = ["far fa-hand-rock", "far fa-hand-paper", "far fa-hand-scissors",
"far fa-hand-lizard", "far fa-hand-spock"];

// winTable delivers winning throws for key throw
const winTable = {
    0: [1, 4], // rock is bitten by paper & Spock
    1: [2, 3], // paper is bitten by scisors & lizard
    2: [0, 4], // scisors is bitten by rock & Spock
    3: [0, 2], // lizard is bitten by rock & scisors
    4: [3, 1], // and Spock is bitten by paper & lizard
}



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
    for (let i of document.getElementById("decision").children) {
        i.addEventListener("click", gameThrow);
    }
 

    // Pull data from local storage

    randoms = JSON.parse(window.localStorage.getItem('randoms'));
    stats = JSON.parse(window.localStorage.getItem('stats'));

    // If there are no randoms generate local set

    if (randoms === null) {
        randoms = generateLocalRandoms(RANDOM_BATCH)
        areRandomsLocal = true;
    }

    // Create stats array if not in local storage

    if (stats === null) stats = [0, 0, 0, 0, 0];
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

    // Find players throw number
    let playersThrow = icons.indexOf(this.id);
    let oppThrow;
    let outcomeMessage = "";

    // Increase corresponding element of the stats array
    stats[playersThrow] += 1;

    // Find out which opponent was selected for this throw
    // and call oppReply to apply corresponding strategy
    oppThrow = nameToNumber(oppReply(document.getElementById("opp-select-game").value));

    // Display opponent's throw icon
    document.getElementById("icon-opponent").firstChild.classList = fontAwesomeIcon[oppThrow];

    // Find the outcome of throw

    let messageContainer = document.getElementById("throw-outcome");

    if (oppThrow === playersThrow) {
        outcomeMessage = "It's a draw!<br><span>Please play again</span>";
        messageContainer.classList = "result-draw";
    } else if (winTable[playersThrow].includes(oppThrow)) {
        outcomeMessage = `You've lost! <br><span>${numberToName(oppThrow)} beats ${numberToName(playersThrow)}</span>`;
        messageContainer.classList = "result-defeat";
    } else {
        outcomeMessage = `You've won! <br><span>${numberToName(playersThrow)} beats ${numberToName(oppThrow)}</span>`;
        messageContainer.classList = "result-win";
    }

    messageContainer.innerHTML = outcomeMessage;


}

// Make decision on opponent's throw and return decision

function oppReply (selectedOpponent) {

    // Sheldon's logic to always throw Spock
    if (selectedOpponent === "sheldon") {
        return "Spock";
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
                return "Spock";
        
            default:
                return "rock";
        }
    }
    
    // Spock's logic to play agains most common player throw
    else {

        // Find index of most common player's throw
        let mostCommonThrow = stats.indexOf(Math.max(...stats));

        // Select randomly one of the winning throws
        return numberToName(winTable[mostCommonThrow][Math.floor(Math.random() * 2)]);
    }
}

function numberToName (number) {
    if (number < 5) return names[number];
    else return "rock";
}

function nameToNumber (name) {
    let index = names.indexOf(name)
    if (index === -1) return 0;
    else return index;
}