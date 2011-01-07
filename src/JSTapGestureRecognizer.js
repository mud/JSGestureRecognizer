var JSTapGestureRecognizer = Class.create(JSGestureRecognizer, {
  numberOfTapsRequired:    1,
  numberOfTouchesRequired: 1,
  
  toString: function() {
    return "JSTapGestureRecognizer";
  },
  
  touchstart: function($super, event) {
    if (event.target == this.target) {
      event.preventDefault();
      $super(event);
      this.numberOfTouches = event.targetTouches.length;
    }
  },
  
  touchmove: function(event) {
    if (event.target == this.target) {
      event.preventDefault();
      this.removeObservers();
      this.fire(this.target, JSGestureRecognizerStateFailed, this);
    }
  },
  
  touchend: function($super, event) {
    if (event.target == this.target) {
      if (this.numberOfTouches == this.numberOfTouchesRequired) {
        $super(event);
        this.taps++;
        if (this.recognizerTimer) {
          window.clearTimeout(this.recognizerTimer);
          this.recognizerTimer = null;
        }
        this.recognizerTimer = window.setTimeout(function() {
          if (this.taps == this.numberOfTapsRequired) {
            this.fire(this.target, JSGestureRecognizerStateRecognized, this);
          } else {
            this.fire(this.target, JSGestureRecognizerStateFailed, this);
          }
        }.bind(this), JSTapGestureRecognizer.TapTimeout);
      } else {
        this.fire(this.target, JSGestureRecognizerStateFailed, this);
      }
    }
  },
  
  reset: function() {
    this.taps = 0;
    this.recognizerTimer = null;
  }
});

Object.extend(JSTapGestureRecognizer, {
  TapTimeout: 500
});
