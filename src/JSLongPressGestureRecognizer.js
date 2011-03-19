var JSLongPressGestureRecognizer = JSGestureRecognizer.extend({
  minimumPressDuration:    400,
  numberOfTouchesRequired: 1,
  numberOfTapsRequired:    1, // not sure how this works with multiple taps
  allowableMovement:       10, // currently we ignore this
  
  toString: function() {
    return "JSLongPressGestureRecognizer";
  },
  
  touchstart: function(event) {
    if (event.target == this.target) {
      event.preventDefault();
      this._super(event);
      if (this.numberOfTouchesRequired == event.allTouches().length) {
        this.recognizerTimer = window.setTimeout(function() {
          this.fire(this.target, JSGestureRecognizerStateRecognized, this);
        }.bind(this), this.minimumPressDuration);
      }
    }
  },
  
  touchmove: function(event) {
    if (event.target == this.target && MobileSafari) {
      event.preventDefault();
      this.fire(this.target, JSGestureRecognizerStateFailed, this);
    }
  },
  
  touchend: function(event) {
    if (event.target == this.target) {
      event.preventDefault();
      this.fire(this.target, JSGestureRecognizerStateFailed, this);
    }
  },
  
  gesturestart: function(event) {
    if (event.target == this.target) {
      event.preventDefault();
      this.fire(this.target, JSGestureRecognizerStateFailed);
    }
  },
  
  reset: function() {
    if (this.recognizerTimer) {
      window.clearTimeout(this.recognizerTimer);
    }
    this.recognizerTimer = null;
  }
});
