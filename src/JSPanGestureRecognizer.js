var JSPanGestureRecognizer = JSGestureRecognizer.extend({
  maximumNumberOfTouches: 100000,
  minimumNumberOfTouches: 1,
  
  toString: function() {
    return "JSPanGestureRecognizer";
  },
  
  touchstart: function(event) {
    if (event.target == this.target) {
      this._super(event);
      var allTouches = event.allTouches();
      if (allTouches.length > this.maximumNumberOfTouches ||
          allTouches.length < this.minimumNumberOfTouches) {
        this.touchend(event);
      }
    }
  },
  
  touchmove: function(event) {
    var allTouches = event.allTouches();
    if (allTouches.length >= this.minimumNumberOfTouches &&
        allTouches.length <= this.maximumNumberOfTouches) {
      if (MobileSafari) {
        if (event.target != this.target) {
          this.touchend(event);
          return;
        }
      }
      event.preventDefault();
      if (this.beganRecognizer == false) {
        this.fire(this.target, JSGestureRecognizerStateBegan, this);
        this.beganRecognizer = true;
        this.translationOrigin = this.getEventPoint(event);
      } else {
        this.fire(this.target, JSGestureRecognizerStateChanged, this);
        var p = this.getEventPoint(event);
        
        this.velocity.x = p.x - this.translation.x;
        this.velocity.y = p.y - this.translation.y;
        
        this.translation.x += p.x - this.translationOrigin.x;
        this.translation.y += p.y - this.translationOrigin.y;
      }
    }
  },
  
  touchend: function(event) {
    if (event.target == this.target || !MobileSafari) {
      this._super(event);
      if (this.beganRecognizer) {
        this.fire(this.target, JSGestureRecognizerStateEnded, this);
      } else {
        this.fire(this.target, JSGestureRecognizerStateFailed, this);
      }
    }
  },
  
  gesturestart: function(event) {
    if (event.target == this.target) {
      var allTouches = event.allTouches();
      if (allTouches.length > this.maximumNumberOfTouches) {
        this.fire(this.target, JSGestureRecognizerStateFailed, this);
      }
    }
  },
  
  reset: function() {
    this.beganRecognizer = false;
    this.translation = { x: 0, y: 0 };
    this.velocity = { x: 0, y: 0 };
  },
  
  setTranslation: function(translation) {
    if (typeof translation.x != 'undefined' &&
        typeof translation.y != 'undefined') {
      this.translation = { x: translation.x, y: translation.y };
    }
  }
});
