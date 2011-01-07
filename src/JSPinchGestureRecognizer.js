var JSPinchGestureRecognizer = Class.create(JSGestureRecognizer, {
  toString: function() {
    return "JSPinchGestureRecognizer";
  },
  
  gesturestart: function($super, event) {
    if (event.targetTouches.length == 2) {
      $super(event);
    }
  },
  
  gesturechange: function(event) {
    if (this.beganRecognizer == false) {
      this.fire(this.target, JSGestureRecognizerStateBegan, this);
      this.beganRecognizer = true;
    } else {
      this.fire(this.target, JSGestureRecognizerStateChanged, this);
      this.scale *= event.scale;
    }
    this.stopEvent(event);
  },
  
  reset: function() {
    this.beganRecognizer = false;
    this.scale = 1;
    this.velocity = 0;
  },
  
  setScale: function(scale) {
    if (typeof scale == 'number') {
      this.scale = scale;
    }
  }
});
