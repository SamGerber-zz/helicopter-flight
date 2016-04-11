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
