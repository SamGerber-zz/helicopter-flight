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
