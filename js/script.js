;(function() {
	var CANVAS_WIDTH = 900;
	var CANVAS_HEIGHT = 600;
	var BIRD_HEIGHT = 36;
	var BIRD_WIDTH = 50;
	var TIME_LOOP = 50;
	var OFFSET = 200;
	var OBSTACLE_WIDTH = 96;
	var GAME_LOOP = 25;

	function Bird() {
		this.x = 300;
		this.y = 300;
		this.height= BIRD_HEIGHT;
		this.width = BIRD_WIDTH;
		this.element;
		this.dx = 0;
		this.dy = -2;
		this.init = function(){
			this.element = document.createElement('div');
			this.element.setAttribute('class','bird');
			this.container = document.getElementById('container');
			this.container.appendChild(this.element);
		}
		this.draw = function() {
			this.element.style.top = this.y + 'px';
			this.element.style.left = this.x + 'px';
		}
		this.removeElement = function() {
			this.element.remove();
		}
	}

	function Obstacles() {
		this.x = 900;
		this.y = 0;
		this.height;
		this.width = OBSTACLE_WIDTH;
		this.element;
		this.dx = -1;
		this.dy = 0;
		this.init = function() {
			this.element = document.createElement('div');
			this.element.setAttribute('class','obstacle');
			this.container = document.getElementById('container');
			this.container.appendChild(this.element);
		}
		this.draw = function() {
			this.element.style.top = this.y + 'px';
			this.element.style.left = this.x + 'px';
		}
		this.setObstacleHeight = function(_HEIGHT) {
			this.height = _HEIGHT;
			this.element.style.height = _HEIGHT + "px";
		}
		this.removeElement = function() {
			this.element.remove();
		}
	}

	function Game() {
		var bird = new Bird();
		var obstacles = [];
		var gameStop = false;
		var score = 0;
		var scoreBoard = document.getElementById('scoreBoard');
		var gameStatus = document.getElementById('gameStatus');
		document.addEventListener("keydown",keyDownHandler,false);
		var gameInterval;
		var counter = 0;
		var gravity = 0;
		
		function keyDownHandler(e) {
			console.log(e.keyCode);
		}

		this.init = function() {
			bird.init();
			gameInterval = setInterval(runGame,GAME_LOOP);
		}

		var runGame = function() {
			counter ++;
			console.log(counter);
			if(counter % 100 == 0) {
				console.log("createdObstacle")
				createObstacles();
			}
			moveBird();
			moveBackground();
			moveObstacles();
			leftWallCollision();
			birdWallCollision();
		}

		var moveBird = function() {
			gravity++;
			if(gravity > 10) {
				bird.dy = -3
			}
			if(gravity > 25){
				bird.dy = -5 ;
			}
			if(gravity > 50) {
				bird.dy = -8;
			}
			bird.y -= bird.dy ;
			bird.draw();
		}

		var createObstacles = function() {
			var obstacle1 = new Obstacles();
			var obstacle2 = new Obstacles();
			obstacle1.init();
			obstacle2.init();
			var obs1height = getRandom(0, CANVAS_HEIGHT - OFFSET);
			obstacle2.y = obs1height + OFFSET;
			var obs2height = CANVAS_HEIGHT - obstacle2.y;
			obstacle1.setObstacleHeight(obs1height);
			console.log(obs2height);
			obstacle2.setObstacleHeight(obs2height);                                                                                                    
			obstacle1.draw();
			obstacle2.draw();
			obstacles.push(obstacle1);
			obstacles.push(obstacle2);
		}

		var moveObstacles = function() {
			for(var i =0; i < obstacles.length; i++) {
				var obstacle = obstacles[i];
				obstacle.x = obstacle.x - 5;
				obstacle.draw();	
				birdCollision(i);
			}
		}

		var leftWallCollision = function() {
			for(var i=0; i< obstacles.length; i++){
				if(obstacles[i].x <= 0) {
					obstacles[i].removeElement();
					obstacles.shift();
				}	
			}				
		}

		var birdCollision = function(position) {
			for(var i = 0; i < obstacles.length; i++) {
				if(i != position) {
					if (bird.x < obstacles[i].x + obstacles[i].width && bird.x + bird.width > obstacles[i].x &&
					   bird.y < obstacles[i].y + obstacles[i].height && bird.height + bird.y > obstacles[i].y) {
					    // collision detected!
					  	console.log("collision detected");
					  	stopGame();
					} else if(bird.x == (obstacles[i].x + OBSTACLE_WIDTH -1)) {
							console.log('gameScore',score);
							score++;
							scoreBoard.innerHTML = "SCORE: " + parseInt(score/6);
					}
				}
			}
		}

		var birdWallCollision = function() {
			if(bird.y > CANVAS_HEIGHT - bird.height || bird.y < 0 ) {
				stopGame();
			}
		}

		var stopGame = function() {
			clearInterval(gameInterval);
			gameStop = true;
			gameStatus.innerHTML ="GAME OVER! Press Any Key to continue";
		}

		function keyDownHandler(e) {
			console.log(e.keyCode);
			// keycode for space 32
		  if(e.keyCode == 32 && gameStop != true){
		  	//go right
		    bird.y -=100;
		    gravity = 0;
		    bird.dy = -2;

		  }
		  if(gameStop && e.keyCode != 0) {
		  	gameStop = false;
		  	bird.removeElement();
		  	for(var i=0; i < obstacles.length; i++) {
		  		obstacles[i].removeElement();
		  	}
		  	score = 0;
		  	bird.draw();
		  	gameStatus.innerHTML = "";
		  	delete(bird);
		  	delete(obstacles);
		 	 	delete(gameOBJ);
		 	 	setTimeout(function(){
		 	 		gameOBJ = new Game().init();
		 	 	},1000);
		  }
		 
		}

		function getRandom(min, max) {
    	return Math.floor(Math.random() * (max - min + 1) + min);
		}	

		var moveBackground = function() {
			var background = document.getElementById('background');
			var margin = parseInt(getComputedStyle(background).getPropertyValue('margin-left'));
			margin = margin -1;
			background.style.marginLeft = margin + 'px';
		}

	}

	var gameOBJ = new Game().init();
})();