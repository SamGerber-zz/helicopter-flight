/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var Game = __webpack_require__(1);
	
	(function () {
	
	  var GameView = GameView = function(game, ctx, canvas) {
	    this.ctx = ctx;
	    this.game = game;
	    this.drone = this.game.addDrone();
	    this.cursor = this.game.addCursor(canvas);
	    this.game.addFuelCan(canvas);
	    this.game.addCoin(canvas);
	    this.game.addBird(canvas);
	    this.fuelGauge = this.game.addFuelGauge(canvas);
	  };
	
	  GameView.prototype.start = function (ctx) {
	    this.lastTime = 0;
	    requestAnimationFrame(this.animate.bind(this));
	  };
	
	  GameView.prototype.animate = function(time){
	    var timeDelta = time - this.lastTime;
	    // this.game.step(timeDelta);
	    this.game.update();
	    if (this.game.isOver) {
	      // requestAnimationFrame(this.gameOver.bind(this));
	      this.gameOver();
	    } else {
	      this.game.draw(this.ctx);
	      this.lastTime = time;
	      //every call to animate requests causes another call to animate
	      requestAnimationFrame(this.animate.bind(this));
	    }
	  };
	
	  GameView.prototype.gameOver = function(){
	    this.ctx.fillStyle = 'rgba(0, 0, 0, .8)';
	    this.ctx.fillRect(0,0,this.game.width,this.game.cHeight);
	    var phrase = '';
	    var drone = this.game.drone;
	    if (drone.fuel <= 0 && !drone.crashed){
	      phrase = 'You ran out of fuel and landed.';
	    } else if (drone.fuel <= 0 && drone.crashed) {
	      phrase = 'You ran out of fuel and crashed.';
	    } else if (drone.disabled && drone.crashed) {
	      phrase = 'You crashed after hitting a bird.';
	    } else {
	      phrase = 'You lost control and crashed.';
	    }
	    this.ctx.fillStyle = 'rgba(255, 0, 0, 1)';
	    this.ctx.font = "48px sans-serif";
	    this.ctx.fillText("GAME OVER", this.game.width / 2 - 140, this.game.cHeight / 2);
	    this.ctx.fillText(("Score: " + this.game.score + " points"), this.game.width / 2 - 140, this.game.cHeight / 2 + 80);
	    this.ctx.font = "24px sans-serif";
	    this.ctx.fillText(phrase, this.game.width / 2 - 140, this.game.cHeight / 2 - 80);
	    this.ctx.fillText("Click anywhere to play again", this.game.width / 2 - 140, this.game.cHeight / 2 + 160);
	    var canvas = document.getElementById("game-canvas");
	
	    canvas.addEventListener('click', handleClick);
	  };
	
	  var clickHandlerToken;
	
	  var handleClick = function(e) {
	    var canvas = document.getElementById("game-canvas");
	
	    canvas.removeEventListener('click', handleClick);
	    startNewGame();
	  };
	
	  var startNewGame = function() {
	    var canvas = document.getElementById("game-canvas");
	
	    var ctx = canvas.getContext("2d");
	    window.game = new Game();
	    canvas.width = window.game.width;
	    canvas.height = window.game.cHeight;
	    new GameView(window.game, ctx, canvas).start();
	  };
	
	  startNewGame();
	})();


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var Drone = __webpack_require__(2);
	var FuelCan = __webpack_require__(3);
	var FuelGauge = __webpack_require__(7);
	var Coin = __webpack_require__(4);
	var Bird = __webpack_require__(5);
	var Cursor = __webpack_require__(6);
	
	var Game = function() {
	    this.cHeight = window.innerHeight;
	    this.height = window.innerHeight * 0.95;
	    this.width = window.innerWidth;
	    this.score = 0;
	    this.isOver = false;
	    this.groundTile = new Image();
	    this.groundTile.src =  "images/tile.png";
	    this.background1 = new Image();
	    this.background1.src =  "images/layer_1.png";
	    this.background2 = new Image();
	    this.background2.src =  "images/layer_2.png";
	    this.birds = [];
	  };
	
	  Game.prototype.draw = function (ctx) {
	    ctx.clearRect(0, 0, this.width, this.height);
	    var groundPattern = ctx.createPattern(this.groundTile,'repeat');
	    ctx.fillStyle = groundPattern;
	    ctx.fillRect(0,this.height,this.width,this.height/19);
	    var width = Math.min(3072, 1536 * this.width / this.height);
	    var height = Math.min(1536, 3072 * this.height / this.width);
	    ctx.drawImage(this.background1,
	                  0, 0, width, height,
	                  0, 0, this.width, this.height
	                );
	    ctx.drawImage(this.background2,
	                  0, 0, width, height,
	                  0, 0, this.width, this.height
	                );
	    this.cursor.render(ctx);
	    this.drone.crashed ? this.drone.renderExplosion(ctx) : this.drone.render(ctx);
	    this.fuelCan.render(ctx);
	    this.coin.render(ctx);
	    this.birds.forEach(function(bird){
	      bird.render(ctx);
	    }, this);
	    this.fuelGauge.render(ctx);
	    this.drawScore(ctx);
	    if (!this.drone.hasFlown){
	      this.drawInstructions(ctx);
	    }
	  };
	
	  Game.prototype.drawScore = function (ctx) {
	    ctx.font = "24px sans-serif";
	    ctx.fillStyle = 'rgba(0, 0, 0, 1)';
	    ctx.fillText("Score: " + this.score, this.width - 140, 50);
	  };
	
	  Game.prototype.drawInstructions = function (ctx) {
	    ctx.font = "48px sans-serif";
	    ctx.fillStyle = 'rgba(0, 0, 0, 1)';
	    ctx.fillText("Welcome to Helicopter Flight!", this.width / 2 - 320, 250);
	    ctx.font = "24px sans-serif";
	    ctx.fillText("Collect the coins and fuel!", this.width / 2 - 120, 290);
	    ctx.fillText("Don't crash into the edges!", this.width / 2 - 120, 320);
	    ctx.fillText("Birds will jam your rotor!", this.width / 2 - 120, 350);
	    ctx.fillText("Click to control throttle and pitch!", this.width / 2 - 120, 380);
	  };
	
	  Game.prototype.update = function () {
	    this.drone.update(this);
	    this.birds.forEach(function(bird){
	      bird.update(this);
	    }, this);
	    this.birds = this.birds.filter(function(bird){
	      return bird.x >= 0 && bird.x <= this.width;
	    }, this);
	    this.fuelGauge.update(this.drone);
	    if (this.drone.crashed && this.drone.stage > 13 || (this.drone.landed && this.drone.fuel == 0 && Math.abs(this.drone.pitch) < 0.01)) {
	      this.isOver = true;
	    }
	    if (this.fuelCan.colliding) {
	      this.addFuelCan();
	    } else {
	      this.fuelCan.update(this);
	    }
	    if (this.coin.colliding) {
	      this.addCoin();
	    } else {
	      this.coin.update(this);
	    }
	  };
	
	  Game.prototype.addDrone = function () {
	    this.drone = Drone.initialize(this.width, this.height);
	    var maxHeightScale = this.height / (10 * this.drone.height);
	    var maxWidthScale = this.width / (10 * this.drone.width);
	    this.maxScale = Math.min(maxHeightScale, maxWidthScale);
	    return this.drone;
	  };
	
	  Game.prototype.addFuelCan = function () {
	    this.fuelCan = FuelCan.random(this.width, this.height);
	    return this.fuelCan;
	  };
	
	  Game.prototype.addCoin = function () {
	    this.coin = Coin.random(this.width, this.height);
	    return this.coin;
	  };
	
	  Game.prototype.addBird = function () {
	    this.birds.push(Bird.random(this.width, this.height));
	    return this.birds.last;
	  };
	
	  Game.prototype.addCursor = function (canvas) {
	    this.cursor = Cursor.initialize(canvas, this);
	    return this.cursor;
	  };
	
	  Game.prototype.addFuelGauge = function (canvas) {
	    this.fuelGauge = new FuelGauge(50);
	    return this.fuelGauge;
	  };
	
	module.exports = Game;


/***/ },
/* 2 */
/***/ function(module, exports) {

	  var Drone = function (pos, vel, radius, maxX, maxY) {
	    this.fuel = 50;
	    this.hasFlown = false;
	    this.landed = 1;
	    this.crashed = false;
	    this.x = pos[0];
	    this.y = pos[1];
	    this.width = 96;
	    this.height = 46;
	    this.dx = vel[0];
	    this.dy = vel[1];
	    this.dx2 = 0;
	    this.dy2 = 0;
	    this.thrust = 0;
	    this.pitch = 0;
	    this.minPitch = -Math.PI / 4;
	    this.maxPitch = Math.PI / 4;
	    this.desiredPitch = 0;
	    this.dPitch = 0;
	    this.gravity = 0.5;
	    this.maxX = maxX;
	    this.maxY = maxY;
	    this.minDX = -100;
	    this.minDY = -100;
	    this.maxDX = 100;
	    this.maxDY = 100;
	    this.radius = (this.width) / 2;
	    this.color = "#00FF00";
	    this.thrusting = false;
	    this.image = new Image();
	    this.image.src =  "images/helicol.png";
	    this.explosion = new Image();
	    this.explosion.src =  "images/explosion.png";
	    this.stage = 0;
	    this.disabled = false;
	   };
	
	   Drone.initialize = function (maxX, maxY) {
	    var pos = [ 100, maxY];
	    var vel = [ 0, 0 ];
	    return new Drone( pos, vel, 20, maxX, maxY);
	  };
	
	  Drone.prototype.translate = function () {
	    this.x = Math.min(this.maxX, (this.x + (this.dx * 0.1)));
	    this.x = Math.max(this.width, this.x);
	    this.y = Math.min(this.maxY, (this.y + (this.dy * 0.1)));
	    this.y = Math.max(this.height, this.y);
	  };
	
	  Drone.prototype.disable = function (time) {
	    this.disabled = true;
	    window.setTimeout(this.enable.bind(this), 1000);
	  };
	  Drone.prototype.enable = function () {
	    this.disabled = false;
	  };
	
	  Drone.prototype.refuel = function (amount) {
	    this.fuel = Math.max(0, Math.min(this.fuel + amount*.5, 100));
	  };
	
	  Drone.prototype.rotate = function () {
	    this.pitch = Math.min(this.maxPitch, (this.pitch + (this.thrust + 5*this.landed)*(this.dPitch * 0.05)));
	    this.pitch = Math.max(this.minPitch, this.pitch);
	  };
	
	  Drone.prototype.accelerate = function () {
	    this.dx = Math.min(this.maxDX, (this.dx + (this.dx2 * this.radius * 0.05)));
	    this.dx = Math.max(this.minDX, this.dx);
	    this.dy = Math.min(this.maxDY, (this.dy + (this.dy2 * this.radius * 0.05)));
	    this.dy = Math.max(this.minDY, this.dy);
	  };
	
	  Drone.prototype.getAcceleration = function (cursor) {
	    var delX = cursor.x - this.x;
	    var delY = cursor.y - this.y;
	    var del = Math.sqrt(delX*delX + delY*delY);
	    this.dPitch = (this.desiredPitch - this.pitch);
	    this.dx2 = - this.thrust * Math.sin(this.pitch);
	    this.dy2 = this.gravity - this.thrust * Math.cos(this.pitch);
	  };
	
	  Drone.prototype.getThrust = function (cursor) {
	    this.thrust = (this.thrusting) ? 1 : 0;
	    this.thrust *= (this.disabled) ? 0.5 : 1;
	  };
	
	  Drone.prototype.handleCollision = function () {
	    if (this.x <= this.width) {
	      if (this.dx < -50) {
	        this.crashed = true;
	      } else {
	        this.dx *= -1;
	      }
	    }
	    if (this.x >= this.maxX) {
	      if (this.dx > 50) {
	        this.crashed = true;
	      } else {
	        this.dx *= -1;
	      }
	    }
	    if (this.y <= this.height) {
	      if (this.dy < -50) {
	        this.crashed = true;
	      } else {
	        this.dy *= -1;
	      }
	    }
	    if (this.y >= this.maxY) {
	      if (this.dy > 50) {
	        this.crashed = true;
	      } else {
	        this.landed = 1;
	        this.desiredPitch = 0;
	        this.dx2 = -0.03*this.dx;
	        if(this.dy > 0) {
	          this.dy = 0;
	        }
	      }
	    } else {
	      this.landed = false;
	      this.hasFlown = true;
	    }
	  };
	
	  Drone.prototype.getDesiredPitch = function (cursor) {
	    var delX = cursor.x - this.x + Math.floor(this.width / 2);
	    var delY = cursor.y - this.y + Math.floor(this.height / 2);
	    var del = Math.sqrt(delX*delX + delY*delY);
	    this.desiredPitch = Math.atan(-delX/Math.abs(delY));
	  };
	
	
	  Drone.prototype.setColor = function (cursor) {
	    this.color = (this.thrusting) ? "#FF0000" : "#00FF00";
	  };
	
	  Drone.prototype.update = function (game) {
	    if (this.crashed) { return; }
	    this.cursor = game.cursor;
	    this.maxX = game.width;
	    this.maxY = game.height;
	    this.thrusting = this.cursor.status && this.cursor.status === "down" && this.fuel;
	    this.getAcceleration(this.cursor);
	    this.getThrust(this.cursor);
	    if (this.thrusting) {
	      this.refuel(-0.5);
	    }
	    this.getDesiredPitch(this.cursor);
	    this.setColor(this.cursor);
	    if (this.maxY - this.y === 0){
	      this.landed = 1;
	      this.desiredPitch = 0;
	      this.dx2 = -0.03*this.dx;
	      if(this.dy > 0) {
	        this.dy = 0;
	      }
	    } else {
	      this.landed = 0;
	    }
	    if (this.y <= this.height){
	      if(this.dy < 0) {
	        this.dy = 0;
	      }
	    }
	    this.accelerate();
	    this.translate();
	    this.handleCollision();
	    this.rotate();
	  };
	
	  Drone.prototype.render = function (ctx) {
	    var x = this.x - ( this.width / 2 );
	    var y = this.y - ( this.height / 2 );
	    ctx.save();
	    ctx.translate(x, y);
	    // ctx.rotate( - this.desiredPitch);
	    // ctx.globalAlpha = 0.2;
	    // ctx.drawImage(this.image,
	    //               0, 0, 96, 46,
	    //               -this.width / 2, -this.height / 2, this.width, this.height
	    //             );
	    // ctx.rotate( this.desiredPitch);
	    ctx.rotate( - this.pitch);
	    ctx.globalAlpha = (this.disabled) ? 0.4 : 1.0;
	    ctx.drawImage(this.image,
	                  0, 0, 96, 46,
	                  -this.width / 2, -this.height / 2, this.width, this.height
	                );
	    ctx.restore();
	    if (this.disabled) {
	      ctx.fillStyle = 'rgba(255, 0, 0, 1)';
	      ctx.font = "24px sans-serif";
	      ctx.fillText("BIRD STRIKE!", 125, 50);
	    }
	  };
	
	  Drone.prototype.renderExplosion = function (ctx) {
	    ctx.drawImage(this.explosion,
	                  this.stage * 196, 0, 190, 190,
	                  this.x-95, this.y-95, 190, 190
	                );
	    this.stage += Math.round(Math.random());
	  };
	
	module.exports = Drone;


/***/ },
/* 3 */
/***/ function(module, exports) {

	var FuelCan = function (pos) {
	    this.x = pos[0];
	    this.y = pos[1];
	    this.colliding = false;
	    this.width = 35;
	    this.height = 41;
	    this.radius = (this.width + this.height) / 4;
	    this.image = new Image();
	    this.image.src =  "images/gascan.png";
	    this.stage = 0;
	   };
	
	  FuelCan.random = function (maxX, maxY) {
	    var x = maxX * (0.2 + 0.6*Math.random());
	    var y = maxY * (0.2 + 0.6*Math.random());
	    var pos = [x, y];
	    return new FuelCan(pos);
	  };
	
	
	  FuelCan.prototype.update = function (game) {
	    this.drone = game.drone;
	    if (this.contains(this.drone)){
	      var amount = 70;
	      this.drone.refuel(amount);
	      game.addBird();
	      this.colliding = true;
	    } else {
	      this.colliding = false;
	    }
	    this.stage = (this.stage + 0.2)%16;
	  };
	
	  FuelCan.prototype.contains = function (object) {
	    var dX = (object.x - object.width/2) - (this.x + this.width/2);
	    var dY = (object.y - object.height/2) - (this.y + this.height/2);
	    var dist = Math.sqrt(dX*dX + dY*dY);
	    return dist < object.radius + this.radius;
	  },
	
	  FuelCan.prototype.render = function (ctx) {
	    var y = this.y - Math.abs(Math.floor(9 - this.stage));
	
	    ctx.drawImage(this.image,
	                  0, 0, this.width, this.height,
	                  this.x, y, this.width, this.height
	                );
	  };
	
	module.exports = FuelCan;


/***/ },
/* 4 */
/***/ function(module, exports) {

	var Coin = function (pos) {
	    this.x = pos[0];
	    this.y = pos[1];
	    this.colliding = false;
	    this.width = 40;
	    this.height = 42;
	    this.radius = (this.width + this.height) / 4;
	    this.image = new Image();
	    this.image.src =  "images/coin.png";
	    this.stage = 0;
	   };
	
	  Coin.random = function (maxX, maxY) {
	    var x = maxX * (0.2 + 0.6*Math.random());
	    var y = maxY * (0.2 + 0.6*Math.random());
	    var pos = [x, y];
	    return new Coin(pos);
	  };
	
	
	  Coin.prototype.update = function (game) {
	    this.drone = game.drone;
	    if (this.contains(this.drone)){
	      game.score += 1;
	      this.colliding = true;
	    } else {
	      this.colliding = false;
	    }
	  };
	
	  Coin.prototype.contains = function (object) {
	    var dX = (object.x - object.width/2) - (this.x + this.width/2);
	    var dY = (object.y - object.height/2) - (this.y + this.height/2);
	    var dist = Math.sqrt(dX*dX + dY*dY);
	    return dist < object.radius + this.radius;
	  },
	
	  Coin.prototype.render = function (ctx) {
	    ctx.drawImage(this.image,
	                  Math.floor(this.stage)*40, 0, this.width, this.height,
	                  this.x, this.y, this.width, this.height
	                );
	    this.stage = (this.stage + 0.25)%6;
	  };
	
	module.exports = Coin;


/***/ },
/* 5 */
/***/ function(module, exports) {

	var Bird = function (pos, color, dx) {
	    this.x = pos[0];
	    this.y = pos[1];
	    this.colliding = false;
	    this.width = 32;
	    this.height = 31;
	    this.radius = (this.width + this.height) / 4;
	    this.image = new Image();
	    this.image.src =  "images/bird.png";
	    this.color = this.height * color;
	    this.stage = 0;
	    this.dx = dx;
	   };
	
	  Bird.random = function (maxX, maxY) {
	    var x = maxX;
	    var y = maxY * (0.1 + 0.8*Math.random());
	    var pos = [x, y];
	    var color = 0;
	    var dx = 3*(-1 + Math.random());
	    return new Bird(pos, color, dx);
	  };
	
	
	  Bird.prototype.update = function (game) {
	    this.drone = game.drone;
	    this.x += this.dx;
	    if (this.x <= 0 /*&& this.drone.landed*/){
	      this.dx *= -1;
	      this.x = 0 + this.dx;
	    } else if (this.x >= game.width /*&& this.drone.landed*/){
	      this.dx *= -1;
	      this.x = game.width + this.dx;
	    }
	    if (this.contains(this.drone)){
	      this.drone.disable(1000);
	      this.x = -100;
	    } else {
	      this.colliding = false;
	    }
	  };
	
	  Bird.prototype.contains = function (object) {
	    var dX = (object.x - object.width/2) - (this.x + this.width/2);
	    var dY = (object.y - object.height/2) - (this.y + this.height/2);
	    var dist = Math.sqrt(dX*dX + dY*dY);
	    return dist < object.radius;
	  },
	
	  Bird.prototype.render = function (ctx) {
	    var x = this.x - ( this.width / 2 );
	    var y = this.y - ( this.height / 2 );
	    ctx.save();
	    ctx.translate(x, y);
	    var flip = (this.dx < 0) ? 1 : -1;
	    ctx.scale(flip, 1);
	    ctx.drawImage(this.image,
	                  Math.floor(4 - Math.abs(this.stage - 4))*32, 0, this.width, this.height,
	                  0, 0, this.width, this.height
	                );
	    this.stage = (this.stage + 0.2)%8;
	    ctx.restore();
	  };
	
	module.exports = Bird;


/***/ },
/* 6 */
/***/ function(module, exports) {

	var Cursor = function (canvas, radius, game) {
	    canvas.addEventListener ("mousemove", this.getMousePos.bind(this, canvas));
	    canvas.addEventListener ("mousedown", this.setStatusDown.bind(this));
	    canvas.addEventListener ("mouseup", this.setStatusUp.bind(this));
	    this.radius = radius;
	    this.color = "#FF0000";
	    this.game = game;
	    this.x = Math.floor(game.width / 2);
	    this.y = Math.floor(game.height / 2);
	  };
	
	  Cursor.initialize = function (canvas, game) {
	    return new Cursor(canvas, 5, game);
	  };
	
	  Cursor.prototype.render = function (ctx) {
	    if (this.status){
	      this.color = (this.status === "up") ? "#FF0000" : "#00FF00";
	    }
	    ctx.fillStyle = this.color;
	    ctx.beginPath();
	    ctx.arc(
	      this.x,
	      this.y,
	      this.radius,
	      0,
	      2 * Math.PI,
	      false
	    );
	    ctx.fill();
	  };
	
	  Cursor.prototype.setStatusDown = function(e) {
	    this.status = "down";
	  };
	  Cursor.prototype.setStatusUp = function(e) {
	    this.status = "up";
	  };
	
	  Cursor.prototype.getMousePos = function(canvas, e) {
	    var rect = canvas.getBoundingClientRect();
	    this.x = (e.clientX - rect.left) * canvas.width / rect.width || 0;
	    this.y = (e.clientY - rect.top) * canvas.height / rect.height || 0;
	  };
	
	module.exports = Cursor;


/***/ },
/* 7 */
/***/ function(module, exports) {

	var FuelGauge = function (percent) {
	    this.percent = percent;
	    this.minAngle = Math.PI;
	    this.maxAngle = 0;
	    this.currentAngle = (100-this.percent) / 100 * (this.maxAngle - this.minAngle);
	    this.gauge = new Image();
	    this.gauge.src =  "images/fuel.png";
	    this.needle = new Image();
	    this.needle.src =  "images/needle.png";
	   };
	
	  FuelGauge.prototype.update = function (drone) {
	    this.percent = drone.fuel;
	    this.currentAngle = (100-this.percent) / 100 * (this.maxAngle - this.minAngle);
	  };
	
	  FuelGauge.prototype.render = function (ctx) {
	    var x = 50;
	    var y = 50;
	    ctx.save();
	    ctx.translate(x, y);
	    ctx.drawImage(this.gauge,
	                  0, 0, 100, 100,
	                  -x, -y, 100, 100
	                );
	    ctx.rotate(this.currentAngle);
	    ctx.drawImage(this.needle,
	      0, 0, 100, 100,
	      -x, -y, 100, 100
	    );
	    ctx.rotate( - this.currentAngle);
	    ctx.restore();
	    ctx.fillStyle = 'rgba(255, 0, 0, 1)';
	    ctx.font = "24px sans-serif";
	    if (this.percent <= 0) {
	      ctx.fillText("OUT OF FUEL!", 125, 100);
	    } else if (this.percent <= 20) {
	      ctx.fillText("LOW FUEL!", 125, 100);
	    }
	  };
	
	module.exports = FuelGauge;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map