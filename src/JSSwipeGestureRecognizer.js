var JSSwipeGestureRecognizer = JSGestureRecognizer.extend({
  numberOfTouchesRequired: 1,
  direction:               JSSwipeGestureRecognizerDirectionRight,
  
  toString: function() {
    return "JSSwipeGestureRecognizer";
  },
  
  touchstart: function(event) {
    if (event.target == this.target) {
      if (this.numberOfTouchesRequired == event.targetTouches.length) {
        event.preventDefault();
        this._super(event);
        this.startingPos = { x: event.targetTouches[0].pageX, y: event.targetTouches[0].pageY };
        this.distance = { x: 0, y: 0 };
      } else {
        this.fire(this.target, JSGestureRecognizerStateFailed, this);
      }
    }
  },
  
  touchmove: function(event) {
    if (event.target == this.target) {
      event.preventDefault();
      this.distance.x = event.targetTouches[0].pageX - this.startingPos.x;
      this.distance.y = event.targetTouches[0].pageY - this.startingPos.y;

      if (this.direction & JSSwipeGestureRecognizerDirectionRight) {
        if (this.distance.x > 100) {
          this.fire(this.target, JSGestureRecognizerStateRecognized, this);
        }
      }

      if (this.direction & JSSwipeGestureRecognizerDirectionLeft) {
        if (this.distance.x < -100) {
          this.fire(this.target, JSGestureRecognizerStateRecognized, this);
        }
      }

      if (this.direction & JSSwipeGestureRecognizerDirectionUp) {
        if (this.distance.y < -100) {
          this.fire(this.target, JSGestureRecognizerStateRecognized, this);
        }
      }

      if (this.direction & JSSwipeGestureRecognizerDirectionDown) {
        if (this.distance.y > 100) {
          this.fire(this.target, JSGestureRecognizerStateRecognized, this);
        }
      }
    }
  },
  
  touchend: function(event) {
    if (event.target == this.target) {
      this.fire(this.target, JSGestureRecognizerStateFailed, this);
    }
  }
});
