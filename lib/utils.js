/* globals DroneDelivery */
(function () {
  if (typeof DroneDelivery === "undefined") {
    window.DroneDelivery = {};
  }

  var Utils = DroneDelivery.Utils = {};

  Utils.inherits = function(childClass, parentClass) {
    var Surrogate = function(){};
    Surrogate.prototype = parentClass.prototype;
    childClass.prototype = new Surrogate();
    childClass.prototype.constructor = childClass;
  };

  Utils.getMousePos = function(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  };
})();
