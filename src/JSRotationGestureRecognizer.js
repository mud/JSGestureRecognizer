var JSRotationGestureRecognizer = Class.create(JSGestureRecognizer, {
  toString: function() {
    return "JSRotationGestureRecognizer";
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
        this.rotation += event.rotation;
      }
    }
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
