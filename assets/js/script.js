window.addEventListener("load", mainLoop);

function mainLoop() {
    const ifResult = document.getElementById("if-result");
    const switchResult = document.getElementById("switch-result");
    let time = 0;
    let variable = 0
    let randomNumber = 0

    console.log(Math.floor(Math.random() * 5))

    time = performance.now();

    for (let i = 0; i < 10000; i++) {
        randomNumber = Math.floor(Math.random() * 5);
        if (randomNumber == 0) {
            variable += randomNumber;
        } else if (randomNumber == 1) {
            variable += randomNumber;
        } else if (randomNumber == 2) {
            variable += randomNumber;
        } else if (randomNumber == 3) {
            variable += randomNumber;
        } else if (randomNumber == 4) {
            variable += randomNumber;
        } else if (randomNumber == 5) {
            variable += randomNumber;
        } else {
            variable += randomNumber;
        }
    }

    console.log("if: " + variable);

    ifResult.textContent = performance.now() - time;

    variable = 0;

    time = performance.now();

    for (let i = 0; i < 10000; i++) {
        randomNumber = Math.floor(Math.random() * 5);
        switch (randomNumber) {
            case 0:
                variable += randomNumber;
                break;
            case 1:
                variable += randomNumber;
                break;
            case 2:
                variable += randomNumber;
                break;
            case 3:
                variable += randomNumber;
                break;
            case 4:
                variable += randomNumber;
                break;
            case 5:
                variable += randomNumber;
                break;
           default:
                variable += randomNumber;
                break;
        }
    }

    console.log("switch: " + variable);

    switchResult.textContent = performance.now() - time;
}