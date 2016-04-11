var Game = require('./game');

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
