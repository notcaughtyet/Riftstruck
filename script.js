let gold = 0;
let workers = 0;
let fighters = 0;
let storyStage = 1;
let storyCost = 5;
let workerCost = 10;
let fighterCost = 15;
let enemyHP = 30;
let enemyName = "Wild Beast";

function saveGame() {
    const gameState = {
        gold: game.gold,
        workers: game.workers,
        fighters: game.fighters,
        storyStage: game.storyStage,
        storyCost: game.storyCost,
        workerCost: game.workerCost,
        fighterCost: game.fighterCost,
        enemyName: game.enemy.name,
        enemyHP: game.enemy.hp
    };
    localStorage.setItem("gameState", JSON.stringify(gameState));
}
setInterval(saveGame, 5000); // Save every 5 seconds

function loadGame() {
    const savedState = localStorage.getItem("gameState");
    if (savedState) {
        const data = JSON.parse(savedState);
        game.gold = data.gold;
        game.workers = data.workers;
        game.fighters = data.fighters;
        game.storyStage = data.storyStage;
        game.storyCost = data.storyCost;
        game.workerCost = data.workerCost;
        game.fighterCost = data.fighterCost;
        game.enemy = new Enemy(data.enemyName, data.enemyHP);
    }
    UI.update();
}
window.onload = loadGame;

function resetGame() {
    localStorage.removeItem("gameState");
    location.reload();
}

function earnGold() {
    gold++;
    updateUI();
}

function buyWorker() {
    if (gold >= workerCost) {
        gold -= workerCost;
        workers++;
        workerCost = Math.floor(workerCost * 1.5);
        setInterval(earnGold, 3000); // Workers auto-earn gold
        updateUI();
    }
}

function trainFighter() {
    if (gold >= fighterCost) {
        gold -= fighterCost;
        fighters++;
        fighterCost = Math.floor(fighterCost * 1.5);
        setInterval(() => attackEnemy('strike', true), 5000); // Fighters auto-attack
        updateUI();
    }
}

function attackEnemy(move, auto = false) {
    let damage = 0;
    let weaknessMultiplier = 1;
    
    if (move === 'strike') damage = 5;
    else if (move === 'slash') damage = 7;
    else if (move === 'blast') damage = 10;
    
    if (enemyName === "Armored Beast" && move === 'slash') weaknessMultiplier = 1.5;
    if (enemyName === "Heavy Golem" && move === 'blast') weaknessMultiplier = 2;
    
    damage *= weaknessMultiplier;
    enemyHP -= damage;
    
    if (!auto) alert(`You used ${move}! It dealt ${damage} damage.`);
    
    if (enemyHP <= 0) {
        gold += 20;
        nextEnemy();
    }
    updateUI();
}

function nextEnemy() {
    let enemies = ["Wild Beast", "Armored Beast", "Heavy Golem"];
    enemyName = enemies[Math.floor(Math.random() * enemies.length)];
    enemyHP = 30 + Math.floor(Math.random() * 20);
    updateUI();
}

function advanceStory() {
    if (gold >= storyCost) {
        gold -= storyCost;
        storyStage++;
        storyCost = Math.floor(storyCost * 1.8);
        document.getElementById("story").innerText = `Chapter ${storyStage}: A new mystery unfolds...`;
        updateUI();
    }
}

function updateUI() {
    document.getElementById("gold").innerText = gold;
    document.getElementById("workers").innerText = workers;
    document.getElementById("fighters").innerText = fighters;
    document.getElementById("storyStage").innerText = storyStage;
    document.getElementById("storyCost").innerText = storyCost;
    document.getElementById("workerCost").innerText = workerCost;
    document.getElementById("fighterCost").innerText = fighterCost;
    document.getElementById("enemyHP").innerText = enemyHP;
    document.getElementById("enemyName").innerText = enemyName;
}

class Enemy {
    constructor(name, hp) {
        this.name = name;
        this.hp = hp;
    }
    takeDamage(amount) {
        this.hp -= amount;
        if (this.hp <= 0) checkChapterProgress();
    }
}

const chapters = [
    { id: 1, title: "Prologue: The Awakening", description: "You wake up in a desolate battlefield, with no memory of how you got here.", mainCharacter: "Kai, the Wandering Soldier", scene: "battlefield", availableMoves: ["Strike", "Block", "Charge"], enemies: [{ name: "Lost Warrior", hp: 20, weakness: "Strike" }] },
    { id: 2, title: "Chapter 1: The Hidden City", description: "You arrive at a hidden city where secrets of the past await.", mainCharacter: "Lena, the Rebel Leader", scene: "hidden-city", availableMoves: ["Slash", "Fireball", "Dodge"], enemies: [{ name: "City Guard", hp: 25, weakness: "Fireball" }] }
];

class Game {
    constructor() {
        this.currentChapterIndex = 0;
        this.gold = 0;
        this.loadChapter();
    }
    loadChapter() {
        const chapter = chapters[this.currentChapterIndex];
        this.currentChapter = chapter;
        UI.updateChapter(chapter);
    }
    advanceChapter() {
        if (this.currentChapterIndex < chapters.length - 1) {
            this.currentChapterIndex++;
            this.loadChapter();
        } else {
            alert("You've reached the end of the current story!");
        }
    }
}

const UI = {
    updateChapter(chapter) {
        document.getElementById("chapterTitle").innerText = chapter.title;
        document.getElementById("sceneDescription").innerText = chapter.description;
        document.getElementById("mainCharacter").innerText = "Playing as: " + chapter.mainCharacter;
        document.body.className = chapter.scene;
        const movesContainer = document.getElementById("battle-buttons");
        movesContainer.innerHTML = "";
        chapter.availableMoves.forEach(move => {
            let button = document.createElement("button");
            button.innerText = move;
            button.onclick = () => game.enemy.takeDamage(move === "Fireball" ? 10 : 5);
            movesContainer.appendChild(button);
        });
        const enemy = chapter.enemies[0];
        game.enemy = new Enemy(enemy.name, enemy.hp);
    }
};

function checkChapterProgress() {
    if (game.enemy.hp <= 0 && game.currentChapterIndex < chapters.length - 1) {
        game.advanceChapter();
    }
}

function saveGame() {
    const gameState = { currentChapterIndex: game.currentChapterIndex, gold: game.gold };
    localStorage.setItem("gameState", JSON.stringify(gameState));
}
function loadGame() {
    const savedState = localStorage.getItem("gameState");
    if (savedState) {
        const data = JSON.parse(savedState);
        game.currentChapterIndex = data.currentChapterIndex;
        game.gold = data.gold;
        game.loadChapter();
    }
}
window.onload = loadGame;

const game = new Game();

