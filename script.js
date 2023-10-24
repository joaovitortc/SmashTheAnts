
let hitbox = document.getElementById("hitbox");
const insect = document.getElementById("insect");
const score = document.getElementById("score");
const gameOver = document.getElementById("gameOver");
const scoreMessage = document.getElementById("scoreMessage");
const bestScoreMessage = document.getElementById("bestScoreMessage");
const restart = document.getElementById("restart");
const startScreen = document.getElementById("startGame");
const startButton = document.getElementById("start");
const menu = document.getElementById("menu");

let timeLeft = 60;

let restartSnd = new Audio('restart.mp3');
let bombSnd = new Audio('explosion.mp3');
let scoreValue;

let isKilling = false; //variable to avoid double/triple killing the same insect
let scoreCount = 0; //keep tracks of score
let bestScore = 0; // keep track of user best score
let bomb = false; //flag to identify if the current insect is actually a bomb
let gameStarted = false; //flag to identify if the game has started -> used to start the timer

startGame();// entry point

function startGame() {
        startButton.addEventListener("click", () => {
            buttonSound();
            insect.style.backgroundImage = "url('regular_ant.png')";
            insect.style.display = "block";
            startScreen.style.display = "none";
            menu.style.display = "block";
            timeLeft = 59; //reset timer
            scoreCount = 0; // reset score
            finalMessage.textContent = "Game Over" // reset final message
            score.textContent = `Score: ${scoreCount}`; //reset score message
            moveInsect();
            createFly();
            gameStarted = true;
        })

}


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
        scoreValue = 1;
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

    bomb = Math.random() < 0.24; //24% chance of being a bomb -> just a good amount

    if (bomb) {
        insect.style.backgroundImage = "url('bomb.png')";
    } else {
        insect.style.backgroundImage = "url('regular_ant.png')";
    }

    insect.style.transform = `translate(${x}px, ${y}px) rotate(${ang}deg) scale(${size})`;
    
    if (bomb) {
        insect.addEventListener("click", handleBombClick);
        setTimeout(() => {
            // Remove the click event listener after a random number of miliseconds
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
        buttonSound();
        insect.style.backgroundImage = "url('regular_ant.png')";
        insect.style.display = "block";
        fly.style.display = "block";
        gameOver.style.display = "none";
        timeLeft = 60; //reset timer
        scoreCount = 0; // reset score
        finalMessage.textContent = "Game Over" // reset final message
        score.textContent = `Score: ${scoreCount}`; //reset score message

        //fly
        fly.style.display = "none";
        resetFlyVariables();
        findStartPointFly();
    })
}

function finishGame() {
    insect.style.display = "none";
    fly.style.display = "none";
    scoreMessage.textContent = `Your score was: ${scoreCount}`;
    bestScoreMessage.textContent= `Your best score so far is: ${findBestScore()}`;
    gameOver.style.display = "block";
    restartGame();
}


function updateScore() {
    if (!bomb) {
        scoreCount += scoreValue;
    }
    score.textContent = `Score: ${scoreCount}`;
}

function findBestScore() {
    if (scoreCount > bestScore) {
        bestScore = scoreCount;
    }
    return bestScore;
}

// Function to update the countdown timer
function updateTimer() {
    if ( gameStarted) {
        const timer = document.getElementById('timer');
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        
        // Display the time in the "mm:ss" format
        timer.textContent = `Time: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        
        // Check if the timer has reached 0
        if (timeLeft === 0) {
            finishGame();
            const finalMessage = document.getElementById('finalMessage');
            finalMessage.textContent = "Time's up"
        } else {
            timeLeft--;
        }
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

function buttonSound() {
    restartSnd.play();
}


const fly = document.getElementById("fly");
const hitboxFly = document.getElementById("hitboxFly");

function createFly() {
    fly.style.backgroundImage = "url('fly.png')";
    let flyAlive = true;
    fly.style.display = "block";
    fly.style.opacity= "1";

    moveFly();
    
    fly.addEventListener("transitionend", moveFly);
    //fly.removeEventListener("transitionend",moveFly);
    hitboxFly.addEventListener("click", killFly); 
}

let x = 0;
let y = 0;
let newX, newY;
let directionX = 1;
let directionY = 1;
let currentAngle = 0;
let flyMovement;
let isDirectionInverted = false;

function moveFly() {
    const maxX = window.innerWidth - fly.clientWidth;
    const maxY = window.innerHeight - fly.clientHeight;

    if(!newX) {
        newX = Math.random() * 100;
        newY = Math.random() * 100;
    } else {
        newX += Math.random() * 4 * directionX;
        newY += Math.random() * 3 * directionY;
    }

    // Check if the new position is within the screen boundaries
    if (newX < 0 || newX > maxX) {

        if(!isDirectionInverted) {
        // Change direction when reaching the screen border
        directionX *= -1;
        }

        newX += Math.random() * 4 * directionX;
    } 

    if (newY < 0 || newY > maxY) {
        directionY *= -1;
        newY += Math.random() * 4 * directionY;
    }

     // Calculate position for new angle
     var angleRadians = Math.atan2(newY - y, newX - x);
     var angleDegrees = (angleRadians * 45) + 90; 

     currentAngle += (angleDegrees - currentAngle) * 0.2;

    x = newX;
    y = newY;

    fly.style.transform = `translate(${newX}px, ${newY}px) rotate(${currentAngle}deg)`;

    // Use requestAnimationFrame for smooth animation
    flyMovement = requestAnimationFrame(moveFly);
}

function killFly() {
    
    sound(); 
    fly.removeEventListener("transitionend",moveFly);
    hitboxFly.removeEventListener("click", killFly);

    //increase score
    scoreValue = 5;
    updateScore(); 

    transitionBetweenFlies();

}

function transitionBetweenFlies() {
    cancelAnimationFrame(flyMovement);
    fly.style.backgroundImage = "url('smashed_fly.png')";
    
    fly.style.opacity = "1";

    fly.classList.add("fade-out-animation");

    fly.addEventListener("animationend", function () {
        fly.style.display = "none";     

        // Remove the animation class to reset it for the next fly
        fly.classList.remove("fade-out-animation");

        resetFlyVariables();
        findStartPointFly();
    });
       
}

function resetFlyVariables() {
    //reset all variables
    x = 0;
    y = 0;
    newY = 0;
    newX = 0;
    directionX = 1;
    directionY = 1;
    currentAngle = 0;
    fly.style.transition = "transform 0.03s";

}

function findStartPointFly() {

    let randomNumber = Math.random();
    let randomNumber2 = Math.random();

    if ( randomNumber > 0.5) {
        newX = window.innerWidth - 10;
    } else {
        newX = -20;
    }

   newY = randomNumber * window.innerHeight ;

    setTimeout(() => {

        fly.addEventListener("transitionend", moveFly);
        hitboxFly.addEventListener("click", killFly); 
        fly.style.backgroundImage = "url('fly.png')";
        moveFly();
        
        //first move the fly and THEN display it
      
        fly.style.display = "block";
        fly.style.opacity= "1";
        
    
    }, Math.random() * 10000)
}

// start game page

/*
start the fly!
Fly should -> appear in a larger set of time (should be out of the screen for some time)
Fly should travel trough the screen (fly) -> improve this
Fly will never be a bomb -> OK
Fly will be smaller than the ant (with probability -> the biggest fly will be bigger than the smallest ant)
Fly will increase 5 of the score


FIX BUGS:
-> fly won't reach the top of the page (css styling probably heigh push body/div to the top?) - fixed " but doesnt work recursively" - FIXED
-> kill the fly doesnt reset properly the variables? fly gets faster LIKE FASTER - fixed

-> fly transiton is wrong - the transition between flies it's showed to the player 
-> code embedded inside the fly makes it LAG. the code is heavy for a single div.

*/




// ------------- after
// is it too high of a dream to think that we could do a multiplayer scoreboard? keep track of all user? HOW??
// -> sql database, user data...




