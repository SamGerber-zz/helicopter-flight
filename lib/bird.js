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
