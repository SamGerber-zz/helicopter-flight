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
