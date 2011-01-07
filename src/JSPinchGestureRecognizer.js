var JSPinchGestureRecognizer = Class.create(JSGestureRecognizer, {
  toString: function() {
    return "JSPinchGestureRecognizer";
  },
  
  gesturestart: function($super, event) {
    if (event.target == this.target) {
      if (event.targetTouches.length == 2) {
        event.preventDefault();
        $super(event);
      }
    }
  },
  
  gesturechange: function(event) {
    if (event.target == this.target) {
      event.preventDefault();
      if (this.beganRecognizer == false) {
        this.fire(this.target, JSGestureRecognizerStateBegan, this);
        this.beganRecognizer = true;
      } else {
        this.fire(this.target, JSGestureRecognizerStateChanged, this);
        this.scale *= event.scale;
      }
    }
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
