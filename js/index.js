// Game constants and variables
let inputDir = { x: 0, y: 0 };
const foodSound = new Audio('../music/food.mp3');
const gameOverSound = new Audio('../music/gameover.mp3');
const moveSound = new Audio('../music/move.mp3');
const musicSound = new Audio('../music/music.mp3');
let speed = 5;
let score = 0;
let isGameStarted = false;
let lastPaintTime = 0;
let snakeArr = [
    { x: 13, y: 15 }
]
food = { x: 11, y: 11 }

// Game functions
function main(ctime) {
    window.requestAnimationFrame(main);
    // console.log(ctime);    // current timestamp is automatically passed.

    if ((ctime - lastPaintTime) / 1000 < 1 / speed) {
        return;
    }
    lastPaintTime = ctime;

    gameEngine();
}

function isCollide(snake) {

    // if snake eats itself
    for (let i = 1; i < snakeArr.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }

    // if bump into wall
    if (snake[0].x >= 18 || snake[0].x <= 0 || snake[0].y >= 18 || snake[0].y <= 0) {
        return true;
    }

    return false;
}


function startGame() {
    isGameStarted = true;
    moveSound.play();
    musicSound.play();
}

function gameEngine() {
    // Updating the snake array and food
    if (isCollide(snakeArr)) {
        text.innerHTML = "Game Over, Press Enter key to play again";
        gameOverSound.play();
        musicSound.pause();
        inputDir = { x: 0, y: 0 };
        isGameStarted = false;
        snakeArr = [{ x: 13, y: 15 }];
        musicSound.play();
        score = 0;
    }


    // If food is eaten, increment the score and regenerate the food
    if (snakeArr[0].y === food.y && snakeArr[0].x === food.x) {
        foodSound.play();
        score += 1;
        if (score > hiScoreVal) {
            hiScoreVal = score;
            localStorage.setItem('hiscore', JSON.stringify(hiScoreVal));
            highScoreBox.innerHTML = "High Score: " + hiScoreVal;
        }
        scoreBox.innerHTML = "Score:" + score;
        snakeArr.unshift({ x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y });
        let a = 2;
        let b = 16;
        food = { x: Math.round(a + (b - a) * Math.random()), y: Math.round(a + (b - a) * Math.random()) }
    }

    // Moving the snake
    for (let i = snakeArr.length - 2; i >= 0; i--) {
        snakeArr[i + 1] = { ...snakeArr[i] };
    }
    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;


    // Display the snake and food

    // Part 1: Snake
    const board = document.querySelector(".board"); // no need if id
    board.innerHTML = "";
    snakeArr.forEach((e, index) => {
        snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;
        if (index === 0) {
            snakeElement.classList.add('head');
        }
        else {
            snakeElement.classList.add('snake');
        }
        board.appendChild(snakeElement);
    })

    // Part 2: Food
    foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    board.appendChild(foodElement);



}








// Main logic 
let hiScore = localStorage.getItem('hiScore');
if (hiScore == null) {
    var hiScoreVal = 0;
    localStorage.setItem('hiScore', JSON.stringify(hiScoreVal));
}
else {
    hiScoreVal = JSON.parse(hiScore);
    highScoreBox.innerHTML = "High Score: " + hiScoreVal;
}
window.requestAnimationFrame(main);
window.addEventListener('keydown', e => {
    moveSound.play();

    if (isGameStarted) {
        // Handle movement controls if the game is running
        let newDir = { x: 0, y: 0 };

        switch (e.key) {
            case "ArrowUp":
                newDir.x = 0;
                newDir.y = -1;
                break;
            case "ArrowDown":
                newDir.x = 0;
                newDir.y = 1;
                break;
            case "ArrowLeft":
                newDir.x = -1;
                newDir.y = 0;
                break;
            case "ArrowRight":
                newDir.x = 1;
                newDir.y = 0;
                break;
            default:
                break;
        }

        if (newDir.x !== -inputDir.x || newDir.y !== -inputDir.y) {
            console.log(newDir.x , -inputDir.x);
            inputDir = newDir;
        }

    } else {
        if (e.key === "Enter") {
            startGame();
            text.innerHTML = "";
            window.requestAnimationFrame(main);
        }
    }
})


// for mobile device 
function handleButtonClick(direction) {
    if (isGameStarted) {
        let newDir = { x: 0, y: 0 };
        switch (direction) {
            case "up":
                newDir.x = 0;
                newDir.y = -1;
                break;
            case "down":
                newDir.x = 0;
                newDir.y = 1;
                break;
            case "left":
                newDir.x = -1;
                newDir.y = 0;
                break;
            case "right":
                newDir.x = 1;
                newDir.y = 0;
                break;
            default:
                break;
        }

        if (newDir.x !== -inputDir.x || newDir.y !== -inputDir.y) {
            inputDir = newDir;
        }
    }
    else {
        if (direction === "enter") {
            startGame();
            text.innerHTML = "";
            window.requestAnimationFrame(main);
        }
    }
}


// Add click event listeners to the arrow buttons
const btnUp = document.getElementById("btn-up");
const btnDown = document.getElementById("btn-down");
const btnLeft = document.getElementById("btn-left");
const btnRight = document.getElementById("btn-right");

btnUp.addEventListener('click', () => handleButtonClick("up"));
btnDown.addEventListener('click', () => handleButtonClick("down"));
btnLeft.addEventListener('click', () => handleButtonClick("left"));
btnRight.addEventListener('click', () => handleButtonClick("right"));
enter.addEventListener('click', () => handleButtonClick("enter"));


