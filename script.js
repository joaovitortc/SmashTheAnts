
let hitbox = document.getElementById("hitbox");
const insect = document.getElementById("insect");
const score = document.getElementById("score");
const gameOver = document.getElementById("gameOver");
const scoreMessage = document.getElementById("scoreMessage");
const restart = document.getElementById("restart");
let timeLeft = 60;

let restartSnd = new Audio('restart.mp3');
let bombSnd = new Audio('explosion.mp3');


let isKilling = false; //variable to avoid double/triple killing the same insect
let scoreCount = 0;
let bomb = false;

hitbox.addEventListener("click", () => {
    
    if(!isKilling) {
        isKilling = true;
        killInsect()
    }

});

function killInsect() {
    sound();
    insect.style.backgroundImage = "url('smashed_ant.png')";

        setTimeout(() => {
            moveInsect();

            isKilling = false;
        } , (Math.random() + 0.2) * 600); // minimum 0.12s - maximum 0.72s of transition
        updateScore();    
    
}

function moveInsect() {
    //random position 
    let x = Math.random() * (window.innerWidth - 100);
    let y = Math.random() * (window.innerHeight - 150);
    //random angle to rotate
    let ang = Math.random() * 360;
    //random size
    let size = Math.random() + 0.2;

    bomb = Math.random() < 0.24;

    if (bomb) {
        insect.style.backgroundImage = "url('bomb.png')";
    } else {
        insect.style.backgroundImage = "url('regular_ant.png')";
    }

    insect.style.transform = `translate(${x}px, ${y}px) rotate(${ang}deg) scale(${size})`;
    
    if (bomb) {
        insect.addEventListener("click", handleBombClick);
        setTimeout(() => {
            // Remove the click event listener after 2 seconds
            insect.removeEventListener("click", handleBombClick);
            insect.style.backgroundImage = "url('regular_ant.png')";
            bomb = false;
            return;
        }, (Math.random() + 0,5) * 500);

    } else {
        insect.removeEventListener("click", handleBombClick);
    }
}

function handleBombClick() {
    bombSound();
    insect.style.backgroundImage = "url('explosion.png')";
    insect.removeEventListener("click", handleBombClick);
    setTimeout(() => {
    finishGame();
}, 240)
    
}

function restartGame() {
    restart.addEventListener("click", () => {
        restartSound();
        insect.style.backgroundImage = "url('regular_ant.png')";
        insect.style.display = "block";
        gameOver.style.display = "none";
        timeLeft = 60; //reset timer
        scoreCount = 0; // reset score
        finalMessage.textContent = "Game Over" // reset final message
        score.textContent = `Insects killed: ${scoreCount}`; //reset score message

    })

}

function finishGame() {
    insect.style.display = "none";
    scoreMessage.textContent = `Your score was: ${scoreCount}`;
    gameOver.style.display = "block";
    restartGame();
}


function updateScore() {
    if (!bomb) {
        scoreCount += 1;
    }
    score.textContent = `Insects killed: ${scoreCount}`;
}

// Function to update the countdown timer
function updateTimer() {
    const timer = document.getElementById('timer');
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    
    // Display the time in the "mm:ss" format
    timer.textContent = `Time remaining: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    
    // Check if the timer has reached 0
    if (timeLeft === 0) {
        finishGame();
        const finalMessage = document.getElementById('finalMessage');
        finalMessage.textContent = "Time's up"
    } else {
        timeLeft--;
    }
}

// Call the updateTimer function every 1000 milliseconds (1 second)
const interval = setInterval(updateTimer, 1000);

function sound() {
    let random = Math.random();
    let snd;
    if ( random > 0.5) {
        snd = new Audio('splash_1.mp3');
    } else {
        snd = new Audio('splash_2.mp3');
    }
    snd.play();
}

function bombSound() {
    bombSnd.play();
}

function restartSound() {
    restartSnd.play();
}


// scoreboard with 3 best results
// is it too high of a dream to think that we could do a multiplayer scoreboard? keep track of all user? HOW??



