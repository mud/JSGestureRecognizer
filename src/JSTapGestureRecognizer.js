var JSTapGestureRecognizer = JSTouchRecognizer.extend({
  numberOfTapsRequired:    1,
  numberOfTouchesRequired: 1,
  moveTolerance:           40,
  
  toString: function() {
    return "JSTapGestureRecognizer";
  },
  
  touchstart: function(event) {
    if (event.target == this.target) {
      event.preventDefault();
      this._super(event);
      this.numberOfTouches = event.allTouches().length;
      this.distance = 0;
      this.translationOrigin = this.getEventPoint(event);
    }
  },
  
  touchmove: function(event) {
    // move events fire even if there's no move on desktop browsers
    // the idea of a "tap" with mouse should ignore movement anyway...
    if (event.target == this.target && !MobileSafari) {
      event.preventDefault();
      this.removeObservers();
      this.fire(this.target, JSGestureRecognizerStateFailed, this);
    }
    var p = this.getEventPoint(event);
    var dx = p.x - this.translationOrigin.x,
        dy = p.y - this.translationOrigin.y;
    this.distance += Math.sqrt(dx*dx + dy*dy);
    if (this.distance > this.moveTolerance) {
      this.touchend();
    }
  },
  
  touchend: function(event) {
    if (event && event.target == this.target) {
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
    } else {
      this.fire(this.target, JSGestureRecognizerStateFailed, this);
    }
  },
  
  reset: function() {
    this.taps = 0;
    this.recognizerTimer = null;
  }
});

JSTapGestureRecognizer.TapTimeout = 500;
