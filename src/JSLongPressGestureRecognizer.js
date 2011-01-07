var JSLongPressGestureRecognizer = Class.create(JSGestureRecognizer, {
  minimumPressDuration:    400,
  numberOfTouchesRequired: 1,
  numberOfTapsRequired:    1, // not sure how this works with multiple taps
  allowableMovement:       10, // currently we ignore this
  
  toString: function() {
    return "JSLongPressGestureRecognizer";
  },
  
  touchstart: function($super, event) {
    $super(event);
    if (this.numberOfTouchesRequired == event.targetTouches.length) {
      this.recognizerTimer = window.setTimeout(function() {
        this.fire(this.target, JSGestureRecognizerStateRecognized, this);
      }.bind(this), this.minimumPressDuration);
    }
    Event.stop(event);
  },
  
  touchmove: function(event) {
    this.fire(this.target, JSGestureRecognizerStateFailed, this);
  },
  
  touchend: function(event) {
    this.fire(this.target, JSGestureRecognizerStateFailed, this);
  },
  
  gesturestart: function(event) {
    this.fire(this.target, JSGestureRecognizerStateFailed);
  },
  
  reset: function() {
    if (this.recognizerTimer) {
      window.clearTimeout(this.recognizerTimer);
    }
    this.recognizerTimer = null;
  }
});
