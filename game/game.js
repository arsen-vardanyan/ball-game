/* We get the tags link from the INDEX.HTML file. */
const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const loader = document.getElementById("preloader");
//------------------------------------------------------------------------------------------------------------------------------------------------------
/* Loading animation. */
window.addEventListener("load", function() {
    loader.style.display = "none";
})
//======================================================================================================================================================
/* Sounds. */
let hit = new Audio();
hit.src = "../sounds/hit.wav";

let canvasUpCollideSound = new Audio();
canvasUpCollideSound.src = "../sounds/canvas-up-collide.wav";

let boxCollideSound = new Audio();
boxCollideSound.src = "../sounds/box-collide.wav";

let gameOverSound = new Audio();
gameOverSound.src = "../sounds/game-over.wav";
//======================================================================================================================================================
/* Storage of the best scores in the browser. */
let scores = 0;
let bestScore;

function record() {
    if (localStorage.getItem("record")) {
        bestScore = +localStorage.getItem("record");
    } else {
        bestScore = 0;
    }
    if (scores > bestScore) {
        bestScore = scores;
        localStorage.setItem("record", bestScore);
    }
}

bestScore = +localStorage.getItem("record");
//======================================================================================================================================================
/* Random determination. */
function random(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
//------------------------------------------------------------------------------------------------------------------------------------------------------
/* Is responsible for the collision two objects: for user (blue rectangle) and box (orangle square). */
function intersectPoint(a, b) {
    let x = Math.max(a.x, b.x);
    let xW = Math.min(a.x + a.width, b.x + b.width);
    let y = Math.max(a.y, b.y);
    let yH = Math.min(a.y + a.height, b.y + b.height);
    return (xW >= x && yH >= y);
}
//======================================================================================================================================================
/* Objects */
/* User (blue rect) data. */
let userWidth = 100;
let userHeight = 25;
let userSpeed = 5;

let user = {
    x: canvas.width / 2 - userWidth / 2, 
    y: canvas.height - userHeight - 50, 
    width: userWidth, 
    height: userHeight, 
    color: "blue",
    xD: userSpeed
};
//------------------------------------------------------------------------------------------------------------------------------------------------------
/* Ball (silver) data. */
let ballRadius = 10;
let ballSpeed = 3;
let ballIncreasingSpeed = 0.1;

let ball = {
    x: canvas.width / 2, 
    y: user.y, 
    radius: ballRadius, 
    sA: 0,
    eA: 2 * Math.PI, 
    color: "silver", 
    speed: ballSpeed,
    xD: ballSpeed, 
    yD: - ballSpeed
};
//------------------------------------------------------------------------------------------------------------------------------------------------------
/* Enemy (purple rectangle) data. */
let enemyWidth = 100;
let enemyHeight = 25;
let enemySpeed = ballSpeed - 1;
let enemyIncreasingSpeed = 0.05;

let enemy = {
    x: canvas.width / 2 - enemyWidth / 2, 
    y: 0,
    width: enemyWidth, 
    height: enemyHeight, 
    color: "purple", 
    xD: enemySpeed
};
//------------------------------------------------------------------------------------------------------------------------------------------------------
/* Box (orange square) data. */
let boxWidth = 20;
let boxHeight = 20;
let boxSpeed = 1;

let boxFunctionObj = {drawBox: drawBox};

let box = {
    x: random(0 + boxWidth * 2, canvas.width - boxWidth * 2),
    y: -boxHeight * 2,
    width: boxWidth,
    height: boxHeight,
    color: "orange",
    yD: boxSpeed,
    end: true,
    timer: 0,
    interval: random(15000, 25000)
};

/* When the user and box collides with each other, a random number will be selected from here. */
let supriseBallRadius = [
    ballRadius *= random(1.5, 2),
    ballRadius /= random(1.5, 2),
    ballRadius += random(1, 5),
    ballRadius -= random(1, 5),
    ballRadius = 10,
    ballRadius = ballRadius
];
//======================================================================================================================================================
/* Texts data. */
let textFont = "30px Segoe UI"; // Default family
let textRedColor = "red";
let textGreenColor = "green";
let textSilverColor = "silver";

/* Bottom left black number. */
let currentScores = {
    x: 50,
    y: canvas.height - 5,
    color: "black",
    font: textFont
};

/* Bottom right red number. */
let theBestResult = {
    x: canvas.width - 75,
    y: canvas.height - 5,
    color: textRedColor,
    font: textFont
};
//------------------------------------------------------------------------------------------------------------------------------------------------------
/* Time data. */

let timeColor = "brown"; // Default color

let millisecond = 0;   // Invisible

let second1 = 0;    // 0 0 : 0 «0»
let second2 = 0;    // 0 0 : «0» 0

let minute1 = 0;    // 0 «0» : 0 0
let minute2 = 0;    // «0» 0 : 0 0

let millisecondText = {};

let colonPunctuation = ":";

let colonText = {
    x: canvas.width / 2 - 5,
    y: canvas.height - 5,
    color: timeColor,
    font: textFont
};

let secondText = {
    x: canvas.width / 2 + 65,
    y: canvas.height - 5,
    color: timeColor,
    font: textFont
};

let minuteText = {
    x: canvas.width / 2 + 10,
    y: canvas.height - 5,
    color: timeColor,
    font: textFont
};

/* Timer */
function increasingSecond() {
    millisecond++;
    if (millisecond === 60) {
        second1++;
        millisecond = 0;
    }
    if (second1 === 10) {
        second2++;
        second1 = 0;
    };
    if (second2 === 6) {
        minute1++;
        second2 = 0;
    };
    if (minute1 === 10) {
        minute2++;
        minute1 = 0;
    }
}
//======================================================================================================================================================
/* This section is responsible for drawing texts. */
function timeMillisecond(number, numberX, numberY) {
    context.fillStyle = millisecondText.color;
    context.font = millisecondText.font;
    context.fillText(number, numberX, numberY);
}

function timeSecond1(number, numberX, numberY) {
    context.fillStyle = secondText.color;
    context.font = secondText.font;
    context.fillText(number, numberX, numberY);
}

function timeSecond2(number, numberX, numberY) {
    context.fillStyle = secondText.color;
    context.font = secondText.font;
    context.fillText(number, numberX, numberY);
}

function timeMinute1(number, numberX, numberY) {
    context.fillStyle = minuteText.color;
    context.font = minuteText.font;
    context.fillText(number, numberX, numberY);
}

function timeMinute2(number, numberX, numberY) {
    context.fillStyle = minuteText.color;
    context.font = minuteText.font;
    context.fillText(number, numberX, numberY);
}
//------------------------------------------------------------------------------------------------------------------------------------------------------
function colon(string, stringX, stringY) {
    context.fillStyle = colonText.color;
    context.font = colonText.font;
    context.fillText(string, stringX, stringY);
}
//------------------------------------------------------------------------------------------------------------------------------------------------------
function writtenCurrentScores(number, numberX, numberY) {
    context.fillStyle = currentScores.color;
    context.font = currentScores.font;
    context.fillText(number, numberX, numberY);
}

function writtenTheBestResult(number, numberX, numberY) {
    context.fillStyle = theBestResult.color;
    context.font = theBestResult.font;
    context.fillText(number, numberX, numberY);
}
//------------------------------------------------------------------------------------------------------------------------------------------------------
function drawTimeMillisecond() {
    timeMillisecond(millisecond, millisecondText.x, millisecondText.y);
}

function drawTimeSecond1() {
    timeSecond1(second1, secondText.x - 40, secondText.y);
}

function drawTimeSecond2() {
    timeSecond2(second2, secondText.x - 55, secondText.y);
}

function drawTimeMinute1() {
    timeMinute1(minute1, minuteText.x - 40, minuteText.y);
}

function drawTimeMinute2() {
    timeMinute2(minute2, minuteText.x - 55, minuteText.y);
}
//------------------------------------------------------------------------------------------------------------------------------------------------------
function drawColon() {
    colon(colonPunctuation, colonText.x, colonText.y);
}
//------------------------------------------------------------------------------------------------------------------------------------------------------
function drawWrittenCurrentScores() {
    writtenCurrentScores(scores, currentScores.x, currentScores.y);
}

function drawWrittenTheBestResult() {
    writtenTheBestResult(bestScore, theBestResult.x, theBestResult.y);
}
//------------------------------------------------------------------------------------------------------------------------------------------------------
/* This section is responsible for drawing objects. */
function drawUser() {
    context.fillStyle = user.color;
    context.fillRect(user.x, user.y, user.width, user.height);
    context.strokeStyle = "cyan";
    context.strokeRect(user.x, user.y, user.width, user.height);
}

function drawBall() {
    context.beginPath();
    context.fillStyle = ball.color;
    context.arc(ball.x, ball.y, ball.radius, ball.sA, ball.eA);
    context.fill();
}

function drawEnemy() {
    context.fillStyle = enemy.color;
    context.fillRect(enemy.x, enemy.y, enemy.width, enemy.height)
    context.strokeStyle = "pink";
    context.strokeRect(enemy.x, enemy.y, enemy.width, enemy.height);
}

function drawBox(){
    if (box.end === true) {
        box.x = random(0 + box.width, canvas.width - box.width);
        box.end = false;
    }

    context.fillStyle = box.color;
    context.fillRect(box.x, box.y, box.width, box.height);
    context.strokeStyle = "black";
    context.strokeRect(box.x, box.y, box.width, box.height);

    if (box.y + box.height >= canvas.height + box.height) {
        delete boxFunctionObj.drawBox;

        setTimeout(() => {
            box.y = -box.height;
            box.end = true;
            boxFunctionObj.drawBox = drawBox;
        }, box.interval)
    }

    box.y += box.yD;

    if (intersectPoint(user, box)) {
        ball.radius = random(supriseBallRadius[0], supriseBallRadius.length - 1);

        boxCollideSound.currentTime = 0;
        boxCollideSound.play();

        delete boxFunctionObj.drawBox;

        setTimeout(() => {
            box.y = -box.height;
            box.end = true;
            boxFunctionObj.drawBox = drawBox;
        }, box.interval)
    }
    box.y += box.yD;
};
//======================================================================================================================================================
/* This section is responsible for updates objects. */
function updateUser() {
    // User and canvas right and left
    user.x += user.xD;
    if (user.x + user.width > canvas.width || user.x < 0) {
        user.xD *= -1;
    }
    user.x += user.xD;
}



function updateBall() {
    // Ball and canvas right and left
    if ((ball.x + ball.radius) > canvas.width /* Right */ || /* Left */ ball.x - ball.radius < 0) {
        ball.xD *= -1;
        
        hit.currentTime = 0;
        hit.play();
    }

    // Ball and canvas up and down
    if ((ball.y + ball.radius) > canvas.height /* Down */ || /* Up */ ball.y - ball.radius < 0) {
        ball.yD *= -1;
    }

    // Ball and user
    if (ball.y + ball.radius > user.y && ball.y < user.y + user.height && ball.x > user.x && ball.x < user.x + user.width) {
        let collidePoint = ball.x - (user.x + user.width / 2);
        collidePoint /= (user.width / 2);

        let angle = collidePoint * (Math.PI / 3);
        ball.xD = - ball.speed * Math.sin(angle);
        ball.yD = ball.speed * Math.cos(angle);
        ball.yD *= -1;

        hit.currentTime = 0;
        hit.play();

        ball.xD += ballIncreasingSpeed;
        ball.yD += ballIncreasingSpeed;
        ball.speed += ballIncreasingSpeed;
    }

    // Ball and enemy
    if (ball.x + ball.radius > enemy.x && ball.x - ball.radius < enemy.x + enemy.width && ball.y + ball.radius > enemy.y && ball.y - ball.radius < enemy.y + enemy.height) {
        let collidePoint = ball.x - (enemy.x + enemy.width / 2);
        collidePoint /= (enemy.width / 2);

        let angle = collidePoint * (Math.PI / 3);
        ball.xD = - ball.speed * Math.sin(angle);
        ball.yD = - ball.speed * Math.cos(angle);
        ball.yD *= -1;

        hit.currentTime = 0;
        hit.play();
    }

    // Ball and canvas up
    if (ball.y - ball.radius < 0) {
        canvasUpCollideSound.play();
        scores++;
    }

    ball.x += ball.xD;
    ball.y += ball.yD;
}

function updateEnemy() {
    if (ball.x > enemy.x + enemy.width) {
        enemy.x + enemy.xD;
        if (enemy.x + enemy.width > canvas.width || enemy.x < 0) {
            enemy.xD *= -1;
        } else if (enemy.x < 0) {
            enemy.xD *= 1;
        }
        enemy.x += enemy.xD;        
    } else if (ball.x + ball.radius < enemy.x) {
        enemy.x + enemy.xD;
        if (enemy.x + enemy.width > canvas.width || enemy.x < 0) {
            enemy.xD *= 1;
        } else if (enemy.x < 0) {
            enemy.xD *= -1;
        }
        enemy.x -= enemy.xD;
    }

    if (ball.speed === 1) {
        enemy.speed += enemyIncreasingSpeed;
    }
}
//======================================================================================================================================================
/* This section is responsible for to manage the user. */
document.addEventListener("keydown", (event) => {
    if (event.code === "ArrowRight" || event.code === "KeyD") {
        user.xD = userSpeed;
    } else if (event.code === "ArrowLeft" || event.code === "KeyA") {
        user.xD = -userSpeed;
    }
})

document.addEventListener("keyup", () => {
    user.xD = 0;
})
//======================================================================================================================================================
/* Storage of the last scores in the browser. */
function lastScore() { 
    if ((ball.y + ball.radius) > canvas.height) {
        localStorage.setItem("last", scores);
    }
    if (scores >= scores) {
        scores = scores;
    };
    localStorage.setItem("last", scores);
}
//======================================================================================================================================================
/* All objects return to their original position. */
function gameReset() {
    scores = 0;

    millisecond = 0;
    second1 = 0;
    second2 = 0;
    minute1 = 0;
    minute2 = 0;

    user.x = canvas.width / 2 - userWidth / 2;
    user.y = canvas.height - userHeight - 50;

    enemy.x = canvas.width / 2 - enemyWidth / 2;
    enemy.y = 0;
    enemy.xD = enemySpeed;

    ball.x = canvas.width / 2;
    ball.y = user.y - ballRadius;
    ball.speed = ballSpeed;
    ball.xD = ballSpeed * (Math.random() * 2 - 1);
    ball.yD = -ballSpeed;
    ball.radius = ballRadius;

    box.x = -box.width;
    box.y = -box.height;
}
//======================================================================================================================================================
/* This section is responsible for game over. */
function drawGameOverText() {
    context.fillStyle = textRedColor;
    context.font = textFont;
    context.fillText("GAME OVER", canvas.width / 3, 150);
}

function drawNewRecordText() {
    context.fillStyle = textRedColor;
    context.font = textFont;
    context.fillText("NEW RECORD", canvas.width / 3 - 10, 200);
}

function drawYourPointsText() {
    context.fillStyle = textGreenColor;
    context.font = textFont;
    context.fillText(`YOUR POINTS: ${scores}`, canvas.width / 3 - 35, 250);
}

function drawTimeText() {
    context.fillStyle = textGreenColor;
    context.font = textFont;
    context.fillText(`TIME: ${minute2}${minute1}:${second2}${second1}`, canvas.width / 3, 300);
}

function drawNewGameText() {
    context.fillStyle = textSilverColor;
    context.font = textFont;
    context.fillText("«ENTER»", canvas.width / 3 + 20, 350);
}

function allGameOverTexts() {
    drawGameOverText();
    drawYourPointsText();
    drawTimeText();
    drawNewGameText();
    if (scores > bestScore) {
        drawNewRecordText();
    }
}

/* The function that makes game over. */
function isGameOver() {
    let gameOver = false;

    if ((ball.y + ball.radius) > canvas.height) {
        gameOver = true;
    } else {
        gameOver = false;
    }

    if (gameOver) {
        gameOverSound.currentTime = 0;
        gameOverSound.play();
        allGameOverTexts();
        record();
        lastScore();
    }

    return gameOver;
}
//======================================================================================================================================================
/* When you press "space" the game will start, and "escape" for pause. */
function drawPressSpaceText() {
    context.fillStyle = textSilverColor;
    context.font = textFont;
    context.fillText("PRESS «SPACE» TO START", canvas.width / 6, canvas.height / 4);
}

/* To start the game you need to press "Space" */
function pressSpaceForStart() {
    window.onkeydown = (event) => {
        if (event.code === "Space") {
            start();
        }
    }
}
//------------------------------------------------------------------------------------------------------------------------------------------------------
/* When you press "escape" the game will pause. */
function drawPressEscapeText() {
    context.fillStyle = textSilverColor;
    context.font = textFont;
    context.fillText("AND «ESCAPE» FOR PAUSE", canvas.width / 7, canvas.height / 3);
}

/* Functions responsible for pausing the game. */
function drawPressPauseText() {
    context.fillStyle = textSilverColor;
    context.font = textFont;
    context.fillText("PAUSE", canvas.width / 2.4, canvas.height / 2);
}

function pressEscapeForPause() {
    window.onkeydown = (event) => {
        if (event.code === "Escape") {
            cancelAnimationFrame(process);
            drawPressPauseText();
            window.onkeydown = (event) => {
                if (event.code === "Escape") {
                    process = requestAnimationFrame(start);
                }
            }
        }
    }
}
//------------------------------------------------------------------------------------------------------------------------------------------------------
/* Function to refresh the screen 60 times per second. */
let requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || 
window.mozRequestAnimationFrame  || window.msRequestAnimationFrame || window.oRequestAnimationFrame;

/* Is responsible for the course of the game. */
let process;

/* Function responsible for shutting down requestAnimationFrame. */
let cancelAnimationFrame = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || 
window.mozCancelAnimationFrame  || window.msCancelAnimationFrame || window.oCancelAnimationFrame;
//======================================================================================================================================================
/* Is the function that runs the game. */
function start() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    if (isGameOver()) {
        window.onkeydown = (event) => {
            if (event.code === "Enter" || event.code === "NumpadEnter") {
                gameReset();
                start();
            }
        }
        return;
    } else {
        window.onkeydown = false;
    }

    drawUser();
    updateUser();

    drawEnemy();
    updateEnemy();

    drawBall();
    updateBall();

    for (let key in boxFunctionObj) {
        boxFunctionObj[key]();
    }

    drawWrittenCurrentScores();
    drawWrittenTheBestResult();

    timeMillisecond();
    drawTimeMillisecond();

    timeSecond1();
    drawTimeSecond1();

    timeSecond2();
    drawTimeSecond2();

    timeMinute1();
    drawTimeMinute1();

    timeMinute2();
    drawTimeMinute2();

    colon();
    drawColon();

    increasingSecond();
    
    process = requestAnimationFrame(start);

    pressEscapeForPause();
}

/* Anonymus function, drwing game objects cordinates. */
(() => {
    drawPressSpaceText();
    drawPressEscapeText();

    drawUser();

    drawEnemy();

    drawBall();

    drawWrittenCurrentScores();
    drawWrittenTheBestResult();

    timeMillisecond();
    drawTimeMillisecond();

    timeSecond1();
    drawTimeSecond1();

    timeSecond2();
    drawTimeSecond2();

    timeMinute1();
    drawTimeMinute1();

    timeMinute2();
    drawTimeMinute2();

    colon();
    drawColon();

    pressSpaceForStart();
}) ();