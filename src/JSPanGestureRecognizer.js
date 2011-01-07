var JSPanGestureRecognizer = Class.create(JSGestureRecognizer, {
  maximumNumberOfTouches: 100000,
  minimumNumberOfTouches: 1,
  
  toString: function() {
    return "JSPanGestureRecognizer";
  },
  
  touchstart: function($super, event) {
    $super(event);
    if (event.targetTouches.length > this.maximumNumberOfTouches ||
        event.targetTouches.length < this.minimumNumberOfTouches) {
      this.touchend(event);
    }
  },
  
  touchmove: function(event) {
    if (this.beganRecognizer == false) {
      this.fire(this.target, JSGestureRecognizerStateBegan, this);
      this.beganRecognizer = true;
      this.translationOrigin = this.getEventPoint(event);
    } else {
      this.fire(this.target, JSGestureRecognizerStateChanged, this);
      var p = this.getEventPoint(event);
      this.translation.x += p.x - this.translationOrigin.x;
      this.translation.y += p.y - this.translationOrigin.y;
    }
    this.stopEvent(event);
  },
  
  touchend: function($super, event) {
    $super(event);
    if (this.beganRecognizer) {
      this.fire(this.target, JSGestureRecognizerStateEnded, this);
    } else {
      this.fire(this.target, JSGestureRecognizerStateFailed, this);
    }
  },
  
  gesturestart: function(event) {
    if (event.targetTouches.length > this.maximumNumberOfTouches) {
      this.fire(this.target, JSGestureRecognizerStateFailed, this);
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
