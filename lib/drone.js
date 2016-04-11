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
