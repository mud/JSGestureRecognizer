var JSGestureView = Class.extend({
  init: function(element) {
    this.view = document.getElementById(element);
    this.scale = 1;
    this.rotation = this.x = this.y = 0;
  },
  
  setTransform: function(obj) {
    this._x = (obj.x || this._x || this.x);
    this._y = (obj.y || this._y || this.y);
    this._scale = (obj.scale || this._scale || this.scale);
    this._rotation = (obj.rotation || this._rotation || this.rotation);
    this.view.style.webkitTransform = 'translate3d('+
      this._x+'px, '+this._y+'px, 0) '+
      'scale('+this._scale+') '+
      'rotate('+this._rotation+'deg)';
  },
  
  addGestureRecognizer: function(recognizer) {
    JSGestureRecognizer.addGestureRecognizer(this, recognizer);
  }
});
