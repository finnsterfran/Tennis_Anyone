let canvas;
let canvasContext;

let ballX = 50;
let ballY = 50
let ballSpeedX = 10;
let ballSpeedY = 4;

let playerOneScore = 0;
let playerTwoScore = 0;
const winningScore = 3;

let winScreen = false;

let paddleLeft = 250;
let paddleRight = 250;
const paddleHeight = 100;
const paddleThickness = 10;

function calculateMousePosition(event) {
    let rect = canvas.getBoundingClientRect(); // tennis court
    let root = document.documentElement; // html document
    // pinpointing the playable space
    let mouseX = event.clientX - rect.left - root.scrollLeft;
    let mouseY = event.clientY - rect.top - root.scrollTop;
    return {
        x:mouseX,
        y:mouseY
    };
}

function handleMouseClick(event) {
    if(winScreen) {
        playerOneScore = 0;
        playerTwoScore = 0;
        winScreen = false;
    }
}

window.onload = function() {
    // sets up the canvas or tennis court
    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');
    // every one second the page loads, it calls the drawEverything function
    let framesPerSecond = 30;
    setInterval(function() {
        moveEverything();
        drawEverything();
    }, 1000/framesPerSecond);

    canvas.addEventListener('mousedown', handleMouseClick);
    // mousemove fires off this function, to calculate coordinates of paddleLeft
    canvas.addEventListener('mousemove', function(event) {
        let mousePosition = calculateMousePosition(event);
        // to get the cursor to point exactly in the center of the paddle, we need to subtract from the top to get the middle
        paddleLeft = mousePosition.y - (paddleHeight/2);
    });
}

function ballReset() {
    if (playerOneScore >= winningScore || playerTwoScore >= winningScore) {
          winScreen = true;
    }

    ballSpeedX = -ballSpeedX;

    ballX = canvas.width/2;
    ballY = canvas.height/2;
}

function computerMovement() {
    let paddleRightCenter = paddleRight + (paddleHeight/2);
    if(paddleRightCenter < ballY - 35) {
        paddleRight += 6;
    } else if (paddleRightCenter > ballY + 35) {
        paddleRight -= 6;
    }
}

function moveEverything() {
    if(winScreen) {
        return;
    }
    computerMovement();

    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if(ballX < 0) {
        if(ballY > paddleLeft && ballY < paddleLeft+paddleHeight) {
            ballSpeedX = -ballSpeedX;
            let deltaY = ballY - (paddleLeft+paddleHeight/2);
            ballSpeedY = deltaY * 0.35;

        } else {
            // scores must be adjusted before reset to see if game has reached its win condition
            playerTwoScore++;
            ballReset();
        };
    }
    if(ballX > canvas.width) {
        if(ballY > paddleRight && ballY < paddleRight+paddleHeight) {
          ballSpeedX = -ballSpeedX;
          let deltaY = ballY - (paddleRight+paddleHeight/2);
          ballSpeedY = deltaY * 0.35;

        } else {
            playerOneScore++;
            ballReset();
        };
    }
    if(ballY < 0) {
      ballSpeedY = -ballSpeedY;
    }
    if(ballY > canvas.height) {
      ballSpeedY = -ballSpeedY;
    }
}

function drawNet() {
    for(let i=0; i < canvas.height; i+=40) {
        colorRectangle(canvas.width/2-1, i, 2, 20, 'white');
    }
}

function drawEverything() {

    // this is the canvas
    colorRectangle(0, 0, canvas.width, canvas.height, 'black');

    if(winScreen) {
        canvasContext.fillStyle = "white";
        if (playerOneScore >= winningScore) {
            canvasContext.fillText("The Left Player Won!", 350, 200);
        } else if(playerTwoScore >= winningScore) {
            canvasContext.fillText("The Right Player Won!", 350, 200);
        }
        canvasContext.fillText("Click to Play", 350, 500);
        return;
    }

    drawNet();
    // this is left player paddle
    colorRectangle(0, paddleLeft, paddleThickness, paddleHeight, 'white');
    // this is right player paddle
    colorRectangle(canvas.width - paddleThickness, paddleRight,
                   paddleThickness, paddleHeight, 'green');
    // this is the ball
    colorCircle(ballX, ballY, 10, 'white');
    // creates a score board
    canvasContext.fillText(playerOneScore, 100, 100);
    canvasContext.fillText(playerTwoScore, canvas.width - 100, 100);
}

// function to draw a circle (ball)
function colorCircle(centerX, centerY, radius, drawColor) {
    canvasContext.fillStyle = drawColor;
    canvasContext.beginPath();
    canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true);
    canvasContext.fill();
}

// function to draw a rectangle (paddles)
function colorRectangle(leftX, topY, width, height, drawColor) {
    canvasContext.fillStyle = drawColor;
    canvasContext.fillRect(leftX, topY, width, height);
}
