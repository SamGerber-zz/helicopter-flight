var Drone = require('./drone');
var FuelCan = require('./fuelCan');
var FuelGauge = require('./fuelGauge');
var Coin = require('./coin');
var Bird = require('./bird');
var Cursor = require('./cursor');

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
