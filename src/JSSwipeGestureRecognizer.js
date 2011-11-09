var JSSwipeGestureRecognizer = JSTouchRecognizer.extend({
  numberOfTouchesRequired: 1,
  direction:               JSSwipeGestureRecognizerDirectionRight,
  minimumDistance:         100,
  
  toString: function() {
    return "JSSwipeGestureRecognizer";
  },
  
  touchstart: function(event) {
    var allTouches = event.allTouches();
    if (event.target == this.target) {
      if (this.numberOfTouchesRequired == allTouches.length) {
        event.preventDefault();
        this._super(event);
        this.startingPos = { x: allTouches[0].pageX, y: allTouches[0].pageY };
        this.distance = { x: 0, y: 0 };
      } else {
        this.fire(this.target, JSGestureRecognizerStateFailed, this);
      }
    }
  },
  
  touchmove: function(event) {
    var allTouches = event.allTouches();
    if (event.target == this.target && this.numberOfTouchesRequired == allTouches.length) {
      event.preventDefault();
      var allTouches = event.allTouches();
      this.distance.x = allTouches[0].pageX - this.startingPos.x;
      this.distance.y = allTouches[0].pageY - this.startingPos.y;

      if (this.direction & JSSwipeGestureRecognizerDirectionRight) {
        if (this.distance.x > this.minimumDistance) {
          this.fire(this.target, JSGestureRecognizerStateRecognized, this);
        }
      }

      if (this.direction & JSSwipeGestureRecognizerDirectionLeft) {
        if (this.distance.x < -this.minimumDistance) {
          this.fire(this.target, JSGestureRecognizerStateRecognized, this);
        }
      }

      if (this.direction & JSSwipeGestureRecognizerDirectionUp) {
        if (this.distance.y < -this.minimumDistance) {
          this.fire(this.target, JSGestureRecognizerStateRecognized, this);
        }
      }

      if (this.direction & JSSwipeGestureRecognizerDirectionDown) {
        if (this.distance.y > this.minimumDistance) {
          this.fire(this.target, JSGestureRecognizerStateRecognized, this);
        }
      }
    } else {
      this.fire(this.target, JSGestureRecognizerStateFailed, this);
    }
  },
  
  touchend: function(event) {
    if (event.target == this.target) {
      this.fire(this.target, JSGestureRecognizerStateFailed, this);
    }
  }
});
