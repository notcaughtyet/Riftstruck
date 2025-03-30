let gold = parseInt(localStorage.getItem("gold")) || 0;
let workers = parseInt(localStorage.getItem("workers")) || 0;
let workerCost = parseInt(localStorage.getItem("workerCost")) || 10;
let lastTime = parseInt(localStorage.getItem("lastTime")) || Date.now();

function updateUI() {
    document.getElementById("gold").innerText = gold;
    document.getElementById("workers").innerText = workers;
    document.getElementById("workerCost").innerText = workerCost;
    localStorage.setItem("gold", gold);
    localStorage.setItem("workers", workers);
    localStorage.setItem("workerCost", workerCost);
    localStorage.setItem("lastTime", Date.now());
}

function earnGold() {
    gold += 1;
    updateUI();
}

function buyWorker() {
    if (gold >= workerCost) {
        gold -= workerCost;
        workers += 1;
        workerCost = Math.ceil(workerCost * 1.5);
        updateUI();
    }
}

function autoMine() {
    gold += workers;
    updateUI();
}

function calculateOfflineEarnings() {
    let currentTime = Date.now();
    let elapsedTime = Math.floor((currentTime - lastTime) / 1000); // Seconds elapsed
    let offlineEarnings = workers * elapsedTime;
    gold += offlineEarnings;
    updateUI();
}

calculateOfflineEarnings(); // Apply offline earnings on load
setInterval(autoMine, 1000); // Workers mine gold every second
updateUI();
