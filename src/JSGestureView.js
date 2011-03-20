var JSGestureView = Class.extend({
  init: function(element) {
    this.view = (typeof element == 'string') ? document.getElementById(element) : element;
    this.scale = 1;
    this.rotation = this.x = this.y = this.z = 0;
    this.setTransform({}); // forces mobile safari to set object as accelerated.
  },
  
  setTransform: function(obj) {
    this._x        = this.getDefined(obj.x,        this._x,        this.x);
    this._y        = this.getDefined(obj.y,        this._y,        this.y);
    this._z        = this.getDefined(obj.z,        this._z,        this.z);
    this._scale    = this.getDefined(obj.scale,    this._scale,    this.scale);
    this._rotation = this.getDefined(obj.rotation, this._rotation, this.rotation);
    this.view.style.webkitTransform = 'translate3d('+
      this._x+'px, '+this._y+'px, '+this._z+') '+
      'scale('+this._scale+') '+
      'rotate('+this._rotation+'deg)';
  },
  
  addGestureRecognizer: function(recognizer) {
    JSTouchRecognizer.addGestureRecognizer(this, recognizer);
  },
  
  getDefined: function() {
    for (var i = 0; i < arguments.length; i++) {
      if (typeof arguments[i] != 'undefined') return arguments[i];
    }
    return arguments[arguments.length-1];
  }
});
