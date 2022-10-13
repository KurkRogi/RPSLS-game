
// Global variables

const RANDOM_BATCH = 100; // Holds number of random numbers to fetch from random.org
const RANDOM_ORG_URL = `https://www.random.org/integers/`;

var randoms;                // Array holding real random numbers from random.org
var stats;                  // Holds previous players throws for Spock's game logic
var outcomes;               // Holds all game outcomes for game statistics
var chartsReady = false;    // Flags if google charts are loaded and ready to drwa


// Utility arrays to convert indexes to strings used in various functions

const names = ["rock", "paper", "scisors", "lizard", "Spock"];
const icons = ["icon-rock", "icon-paper", "icon-scisors", "icon-lizard", "icon-spock"];
const fontAwesomeIcon = ["far fa-hand-rock", "far fa-hand-paper", "far fa-hand-scissors",
"far fa-hand-lizard", "far fa-hand-spock"];

// winTable delivers winning throws agains throw as a key
const winTable = {
    0: [1, 4], // rock is beaten by paper & Spock
    1: [2, 3], // paper is beaten by scisors & lizard
    2: [0, 4], // scisors is beaten by rock & Spock
    3: [0, 2], // lizard is beaten by rock & scisors
    4: [3, 1], // and Spock is beaten by paper & lizard
}

window.addEventListener("load", initLoop);

function initLoop() {

    // Attach event handlers to navigation buttons

    document.getElementById("game-rules-button").addEventListener( 'click', e => {
        const screen = document.getElementById("rules-screen");
        screen.classList.toggle("visible");
    });

    document.getElementById("game-statistics-button").addEventListener( 'click', e => {
        const screen = document.getElementById("stats-screen");
        drawWinsChart();
        drawThrowsChart();
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

    // Attach event handler to chart selection feature
    document.getElementById('opp-select-stats').addEventListener('input', drawThrowsChart);
 

    // Pull data from local storage

    randoms = JSON.parse(window.localStorage.getItem('randoms'));
    stats = JSON.parse(window.localStorage.getItem('stats'));
    outcomes = JSON.parse(window.localStorage.getItem('outcomes'));

    // If there are no randoms in local storage fetch some
    if (randoms === null) {aquireRandoms(RANDOM_BATCH);}
   
    // Create stats array if not in local storage
    if (stats === null) {stats = [0, 0, 0, 0, 0];}

    // Create new outcomes if not in storage
    if (outcomes === null) outcomes = {
        wins: {
            Spock: [0, 0, 0, 0, 0],
            Sheldon: [0, 0, 0, 0, 0],
            Random: [0, 0, 0, 0, 0]},
        defeats: {
            Spock: [0, 0, 0, 0, 0],
            Sheldon: [0, 0, 0, 0, 0],
            Random: [0, 0, 0, 0, 0]},
        draws: {
            Spock: [0, 0, 0, 0, 0],
            Sheldon: [0, 0, 0, 0, 0],
            Random: [0, 0, 0, 0, 0]}
    };

    // Google Charts code:
    // Load the Visualization API and the corechart package.
    google.charts.load('current', {'packages':['corechart']});

    // Set a flag indicating that the google charts API is loaded.
    google.charts.setOnLoadCallback(() => chartsReady = true);
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

function gameThrow () {

    // Find players throw number
    let playersThrow = icons.indexOf(this.id);
    let oppThrow;
    let outcomeMessage = "";

    // Increase corresponding element of the stats array
    stats[playersThrow] += 1;

    // Find out which opponent was selected for this throw
    // and call oppReply to apply corresponding strategy
    let oppName = document.getElementById("opp-select-game").value;
    oppThrow = nameToNumber(oppReply(oppName));

    // Display opponent's throw icon
    document.getElementById("icon-opponent").firstChild.classList = fontAwesomeIcon[oppThrow];

    // Find the outcome of throw

    let messageContainer = document.getElementById("throw-outcome");

    console.log("\n%c--- Player throws " + names[playersThrow] + "---", "font-weight: bold;");
    console.log("Opponent "+ oppName + " throws " + names[oppThrow]);

    if (oppThrow === playersThrow) {
        outcomeMessage = "It's a draw!<br><span>Please play again</span>";
        console.log("It's a draw! Please play again.");
        messageContainer.classList = "result-draw";
        outcomes['draws'][oppName][playersThrow] += 1;
    } else if (winTable[playersThrow].includes(oppThrow)) {
        outcomeMessage = `You've lost! <br><span>${numberToName(oppThrow)} beats ${numberToName(playersThrow)}</span>`;
        console.log(`You've lost! ${numberToName(oppThrow)} beats ${numberToName(playersThrow)}`)
        messageContainer.classList = "result-defeat";
        outcomes['defeats'][oppName][playersThrow] += 1;
    } else {
        outcomeMessage = `You've won! <br><span>${numberToName(playersThrow)} beats ${numberToName(oppThrow)}</span>`;
        console.log(`You've won! ${numberToName(playersThrow)} beats ${numberToName(oppThrow)}`)
        messageContainer.classList = "result-win";
        // Increase array element corresponding to players decision
        // for the opponent played against
        outcomes['wins'][oppName][playersThrow] += 1;
    }

    messageContainer.innerHTML = outcomeMessage;
    console.log("Arrays for this opponent are:");
    console.log("Wins: " + outcomes['wins'][oppName]);
    console.log("Draws: " + outcomes['draws'][oppName]);
    console.log("Defeats: " + outcomes['defeats'][oppName]);

    // Store game data
    storeData();
}

// Make decision on opponent's throw and return decision

function oppReply (selectedOpponent) {

    // Sheldon's logic to always throw Spock
    if (selectedOpponent === "Sheldon") {
        return "Spock";
    }
    
    // Random throw logic
    else if (selectedOpponent === "Random") {
        
        return numberToName(getRealRandom());
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

// Aquire a batch of random numbers from random.org

function aquireRandoms (numberToGet) {
    
    request = new XMLHttpRequest();

    request.addEventListener("load", processResponse);
    request.open("GET", `${RANDOM_ORG_URL}?num=${numberToGet}&min=0&max=4&col=1&base=10&format=plain&rnd=new`);
    
    // Calling random.org for a batch of random numbers
    request.send();

    console.log(`*** Calling ${RANDOM_ORG_URL}?num=${numberToGet}&min=0&max=4&col=1&base=10&format=plain&rnd=new`);

    function processResponse() {
        if (this.status === 200) {
            // remove white spaces from the response text, covert to array
            // and convert array elements to integers (from strings)
            randoms = this.responseText.trim().split("\n").map( rNumber => parseInt(rNumber));
            localRandoms = false;
        } else {
            console.log("Failed to get randoms. Status " + this.status);
        }
    }
}

// Return number from array

function getRealRandom() {
    
    if (randoms.length > 1) {
        
        // Plenty of real randoms in storage so return one
        return randoms.pop();

    } else if (randoms.length = 1) {

        // last real random about to be used so fetch some
        // now for the next trow
        aquireRandoms(RANDOM_BATCH);
        return randoms.pop();

    } else {

        // So the randoms array is empty and new randoms
        // havent arived yet? Go with a local one for now
        aquireRandoms(RANDOM_BATCH);
        return Math.floor(Math.random() * 5);
    }
}

function storeData() {
    console.log ("Storing game data");

    window.localStorage.setItem("stats", JSON.stringify(stats));
    window.localStorage.setItem("randoms", JSON.stringify(randoms));
    window.localStorage.setItem("outcomes", JSON.stringify(outcomes));
}

function drawWinsChart() {

    if (!chartsReady) return;

    // Calculate data for chart one
    let percentSpock = calculatePercentage('Spock');
    let percentSheldon = calculatePercentage('Sheldon');
    let percentRandom = calculatePercentage('Random');

    // Create the data table for chart one
    var chartOneData = new google.visualization.DataTable();
    chartOneData.addColumn('string', 'Opponents');
    chartOneData.addColumn('number', 'Wins');
    chartOneData.addColumn({role: 'style'});
    chartOneData.addColumn({role: 'annotation'});
    chartOneData.addRows([
      ['Mr Spock', percentSpock, '#924f55','Mr Spock'],
      ['Dr Cooper', percentSheldon, '#3c6f72', 'Dr Cooper'],
      ['Prof. Randomius', percentRandom, '#284b62', 'Prof. Randomius']
    ]);

    // Set chart options for chart one
    var chartOneOptions = {
      titlePosition: 'none',
      backgroundColor: '#d9d9d9',
      chartArea: {
        // left: '5%',
        top: '10%',
        width:'80%',
        height:'70%'},
      fontName: 'Inter Tight',
      fontSize: 16,
      legend: {
        position: 'none'
      },
      vAxis: {
        textPosition: 'none'
      },
      hAxis: {
        maxValue: 1,
        textPosition: 'out',
        format:'percent',
        ticks: [0, 0.25, 0.50, 0.75, 1]
      }
    };

    // Instantiate and draw chart one, passing in data & options.
    var chart = new google.visualization.BarChart(document.getElementById('wins-chart'));
    chart.draw(chartOneData, chartOneOptions);
}

function drawThrowsChart() {

    if (!chartsReady) return;

    // Calculate data for chart two
    let opponent = document.getElementById('opp-select-stats').value;
    let totalWins = outcomes['wins'][opponent].reduce((accu, value) => accu + value);
    
    let colorsForChart = ['#924f55', '#3c6f72', '#ff7733', '#284b62', '#4d4d4d']
    
    let targetForLegend = document.getElementById('chart-two-legend');
    targetForLegend.innerHTML = "";

    // Create data table for chart two
    let chartTwoData = new google.visualization.DataTable();
    chartTwoData.addColumn('string', 'Throws');
    chartTwoData.addColumn('number', 'Wins');
    
    for (let i = 0; i <5; i++) {
        
        // outcomes['wins'][opponent][i] is how many wins with this throw
        let percentage = totalWins > 0 ? outcomes['wins'][opponent][i] / totalWins : 0;

        // Insert data for chart two
        // names[i] is the name of throw
        chartTwoData.addRow([names[i], percentage]);

        // Add legend below chart two
        if(percentage) {
            newIElement = document.createElement('i');
            newIElement.classList = fontAwesomeIcon[i];
            newIElement.setAttribute("style", `background-color: ${colorsForChart[i]}`);
            targetForLegend.appendChild(newIElement);
        }

    };

    // Set chart options for chart two
    var chartTwoOptions = {
      height: 280,
      titlePosition: 'none',
      backgroundColor: '#d9d9d9',
      chartArea: {
          width:'90%',
          height: '90%'
      },
      fontName: 'Arial',
      fontSize: 16,
      legend: {
        position: 'none',
      },
      colors: colorsForChart
    };

    // Instantiate and draw chart two, passing in data & options.
    var chartTwo = new google.visualization.PieChart(document.getElementById('throws-chart'));
    chartTwo.draw(chartTwoData, chartTwoOptions);
}

  function calculatePercentage(opponent) {
    let total = 0, wins = 0;
   
    // Toatal of won games
    for (let i of outcomes.wins[opponent]) wins += i;

    // Total of all games played
    for (let i of outcomes.wins[opponent]) total += i;
    for (let i of outcomes.defeats[opponent]) total += i;
    for (let i of outcomes.draws[opponent]) total += i;

    return wins / total;
  }