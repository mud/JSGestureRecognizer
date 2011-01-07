var JSRotationGestureRecognizer = Class.create(JSGestureRecognizer, {
  toString: function() {
    return "JSRotationGestureRecognizer";
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
      this.rotation += event.rotation;
    }
    this.stopEvent(event);
  },
  
  reset: function() {
    this.beganRecognizer = false;
    this.rotation = 0;
    this.velocity = 0;
  },
  
  setRotation: function(rot) {
    if (typeof rot == 'number') {
      this.rotation = rot;
    }
  }
});
