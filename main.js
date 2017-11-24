// setup canvasBB (canvas Bouncing Balls)
var canvasBB = document.querySelector('.canvasBB');
var ctxBB = canvasBB.getContext('2d');
var widthBB = canvasBB.width = window.innerWidth;
var heightBB = canvasBB.height = window.innerHeight;
// setup canvasP (canvas paddle/ball/bricks)
var canvasP = document.querySelector(".canvasP");
var ctxP = canvasP.getContext('2d');
// paddle 
var paddleWidth = 75;
var paddleHeight = 15;
var paddleX = (canvasP.width-paddleWidth)/2;
var paddleY = canvasP.height;
var rightPressed = false;
var leftPressed = false;
// ball 
var ballRadius = 15;
var x = canvasP.width/2;
var y = canvasP.height - paddleHeight - ballRadius;
var ex = 0;
var ey = 0;
// bricks
var brickWidth = 74;
var brickHeight = 20;
var brickRow = 3;
var brickColumn = 7;
var brickOffsetTop = 40;
var brickOffsetLeft = (canvasP.width - brickColumn * brickWidth)/(brickColumn + 1);
var brickArray = [];
// lives
var livesCount = 3;
var scoreCount = 0;
var startButtonCheck = 0;



///// menu /////

// closes the menu if a link inside is clicked 
var menuLink = document.querySelector(".menuLinks");
var menuToggle = document.querySelector("#menuToggle");

menuLink.addEventListener("click", function() { 
     menuToggle.checked = false;
});



///// bouncing balls  /////

// function to generate random number
function random(min,max) {
  var num = Math.floor(Math.random()*(max-min)) + min;
  return num;
}

// constructor for the balls (velX and velY are horizontal and vertical velocity/speed)
function Ball(x, y, velX, velY, color, size) {
  this.x = x;
  this.y = y;
  this.velX = velX;
  this.velY = velY;
  this.color = color;
  this.size = size;
}

// method that draw the balls(circles) on canvas context (ctx)
Ball.prototype.draw = function() {
  ctxBB.beginPath();
  ctxBB.fillStyle = this.color;
  ctxBB.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctxBB.fill();
};

// method to make the balls change direction when they reach the end of
// the canvas rectangle.
Ball.prototype.update = function() {

	if((this.x + this.size) >= widthBB) {
		this.velX = -(this.velX);
	}

	if((this.x - this.size) <= 0) {
		this.velX = -(this.velX);
	}

	if((this.y + this.size) >= heightBB) {
		this.velY = -(this.velY);
	}

	if((this.y - this.size) <= 0) {
		this.velY = -(this.velY);
	}

	this.x += this.velX;
	this.y += this.velY;
}

// checks collisions between the balls 
Ball.prototype.collisionDetect = function() {
  for (var j = 0; j < balls.length; j++) {
    if (!(this === balls[j])) {
      var dx = this.x - balls[j].x;
      var dy = this.y - balls[j].y;
      var distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.size + balls[j].size) {
        balls[j].color = this.color = 'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) +')';
      }
    }
  }
}

// array to store balls
var balls = [];

// loop to draw the scene over and over again
function loop() {

	ctxBB.fillStyle = 'rgba(0, 0, 0, .25)'; 
	ctxBB.fillRect(0, 0, widthBB, heightBB); // start coordinate (x, y), width and height

  while(balls.length < 25) {
    var ball = new Ball(
      random(0,widthBB),
      random(0,heightBB),
      random(-7,7),
      random(-7,7),
      'rgb(' + random(0,255) + ',' + random(0,255) + ',' + random(0,255) +')',
      random(10,20)
    );
    balls.push(ball);
  }

	for(var i = 0; i < balls.length; i++) {
		balls[i].draw();
		balls[i].update();
		balls[i].collisionDetect();
	}

requestAnimationFrame(loop);

};

loop();



///// paddle, ball and brick game /////

// to handle events keyup and keydown for left and right arrows 
document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);


function keyDownHandler(e){
	if(e.keyCode == 39){
		rightPressed = true;
	}else if(e.keyCode == 37){
		leftPressed = true;
	}
}

function keyUpHandler(e) {
	if(e.keyCode == 39) {
		rightPressed = false;
	}else if(e.keyCode == 37) {
		leftPressed = false;
	}
}

//to handle event when mouse is moved
document.addEventListener('mousemove', mouseMoveHandler, false);

function mouseMoveHandler(e) {
	if(startButtonCheck === 1) { 
		var relativeX = e.clientX - canvasP.offsetLeft;
		if(relativeX > 0 && relativeX < canvasP.width) {
			paddleX = relativeX - paddleWidth/2;
		}
	}
}

// creates a two dimensional brick array. 
for(i=0; i<brickColumn; i++) {
	brickArray[i] = []; 
	for(j=0; j<brickRow; j++) {
		brickX = i * (brickOffsetLeft+ brickWidth) + brickOffsetLeft;
		brickY = j * (brickOffsetTop + brickHeight) + brickOffsetTop;
		brickArray[i][j] = { x: brickX , y: brickY, status: 1 };	
	}
}

function ball() {
	ctxP.beginPath();
	ctxP.fillStyle = "#000";
	ctxP.arc(x, y, ballRadius, 0, 2*Math.PI);
	ctxP.fill();
	ctxP.closePath();
}

function paddle() {
	ctxP.beginPath();
	ctxP.fillStyle = "#000";
	ctxP.rect(paddleX, paddleY-paddleHeight, paddleWidth, paddleHeight);
	ctxP.fill();
	ctxP.closePath();
}

// brick function draws the brick that has status: 1
function brick() {
	for(a=0; a<brickColumn; a++) {	
		for(b=0; b<brickRow; b++) {
			var bA = brickArray[a][b];
			if(bA.status) {
				ctxP.beginPath();
				ctxP.fillStyle = "#f94b3e";
				ctxP.rect(bA.x, bA.y, brickWidth, brickHeight);
				ctxP.fill();
				ctxP.closePath();
			}	
		}
	}
}

function lives() {	
	ctxP.fillStyle = "#000";
	ctxP.font = "20px Arial";
	ctxP.fillText("Lives: " + livesCount, 640, 20);
}

function score() {
	ctxP.fillStyle = "#000";
	ctxP.font = "20px Arial";
	ctxP.fillText("Score: " + scoreCount, 5, 20);
}

// Compares areas for the bricks with the ball's x- and y-coordinates
function collisionDetection() {
	for(a=0; a<brickColumn; a++) {	
		for(b=0; b<brickRow; b++) {
			var bA = brickArray[a][b];
			if(bA.status === 1) {
				if(x > bA.x && x < (bA.x + brickWidth) && y > bA.y && y < (bA.y + brickHeight)) {
					bA.status = 0;
					ey = -ey;
					ex = ex;
					scoreCount++;
					if(scoreCount === brickRow * brickColumn) {
						alert('Congratulations, you win!');
						document.location.reload();
					}
				}
			}
		}
	}
}

function draw() {

	ctxP.clearRect(0, 0, canvasP.width, canvasP.height);

	ball();
	paddle();
	brick();
	lives();
	score();
	collisionDetection();

	// Checks that the ball's x-coordinate is within canvas area,
	// if not the ball's x direction changes to the opposite direction.
	if(x + ex > canvasP.width-ballRadius || x + ex < ballRadius) {
		ex = -ex;
	}
	// If the ball's y-coordinte is outside canvas, the y direction changes to
	// opposite direction. Also checks if the ball is saved by the paddle. If 
	// not, livesCount is reduced by one. 
	if(y + ey < ballRadius) {
		ey = -ey;
	}else if(y + ey > canvasP.height-ballRadius) {
		if(x > paddleX && x < paddleX+paddleWidth) {
			ey = -ey;
		}else{
			livesCount--;
			if(livesCount <= 0) {
    			alert("GAME OVER");
    			document.location.reload();
    		}else {
    			x = canvasP.width/2;
    			y = canvasP.height-paddleHeight;
    			ex = 7;
    			ey = -7;
    			paddleX = (canvasP.width-paddleWidth)/2;
			}
		}
	}

	// to move paddle when right or left arrow is pressed
    if(rightPressed && paddleX < canvasP.width-paddleWidth) {
        paddleX += 7;
    }
    else if(leftPressed && paddleX > 0) {
        paddleX -= 7;
    }

	x += ex;
	y += ey;

	requestAnimationFrame(draw);
}

draw();



////// start game button ///////
var startButton = document.querySelector('button');
startButton.addEventListener('click', startGame , false);

function startGame() {
	startButton.style.display = 'none';
	startButtonCheck = 1;
	ex = 7;
	ey = -7;
}











