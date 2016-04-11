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
