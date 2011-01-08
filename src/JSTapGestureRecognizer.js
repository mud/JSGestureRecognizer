var JSTapGestureRecognizer = JSGestureRecognizer.extend({
  numberOfTapsRequired:    1,
  numberOfTouchesRequired: 1,
  
  toString: function() {
    return "JSTapGestureRecognizer";
  },
  
  touchstart: function(event) {
    if (event.target == this.target) {
      event.preventDefault();
      this._super(event);
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
  
  touchend: function(event) {
    if (event.target == this.target) {
      if (this.numberOfTouches == this.numberOfTouchesRequired) {
        this._super(event);
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

JSTapGestureRecognizer.TapTimeout = 500;
