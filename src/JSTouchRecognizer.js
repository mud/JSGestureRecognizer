// -- Abstract Class: JSTouchRecognizer -------------------------------------
var JSTouchRecognizer = Class.extend({
  initWithCallback: function(callback) {
    if (typeof callback == 'function') {
      this.callback = callback;
    } else {
      throw new Error("Callback must be set otherwise this won't do anything!");
    }
  },
  
  // sets the target and sets up recognizer by running initRecognizer()
  setTarget: function(_target) {
    var target = (_target.view) ? _target.view : _target;
    if (target !== null && this.target != target) {
      this.target = target;
      this.view = _target;
      this.initRecognizer();
    }
  },
  
  toString: function() {
    return "JSTouchRecognizer";
  },
  
  // -- Subclass Implementation Methods ---------------------------------------
  // initRecognizer - called when target and action are set (init)
  initRecognizer: function() {
    if (this.target === null) {
      throw new Error("this.target is null, must be a DOM element.");
    }
    this.reset();
    this.state = JSGestureRecognizerStatePossible;

    this.touchmoveHandler = this.touchmove.bind(this);
    this.touchendHandler = this.touchend.bind(this);

    this.observe(this.target, JSTouchStart, this.touchstart.bind(this));
    this.observe(this.target, JSGestureRecognizerStatePossible, this.possible.bind(this));
    this.observe(this.target, JSGestureRecognizerStateBegan, this.began.bind(this));
    this.observe(this.target, JSGestureRecognizerStateEnded, this.ended.bind(this));
    this.observe(this.target, JSGestureRecognizerStateCancelled, this.cancelled.bind(this));
    this.observe(this.target, JSGestureRecognizerStateFailed, this.failed.bind(this));
    this.observe(this.target, JSGestureRecognizerStateChanged, this.changed.bind(this));
  },
  
  reset: function() { },
  
  
  // -- Touch Events ----------------------------------------------------------
  touchstart: function(event, obj) {
    if (this.target && event.target == this.target) {
      this.addObservers();
      this.fire(this.target, JSGestureRecognizerStatePossible, this);
    }
  },
  
  touchmove: function(event) {},
  touchend: function(event) {},
  touchcancelled: function(event) {},
  
  
  // -- Event Handlers --------------------------------------------------------
  possible: function(event, memo) {
    if (!event.memo) event.memo = memo;
    if (event.memo == this) {
      this.state = JSGestureRecognizerStatePossible;
      if (this.callback) {
        this.callback(this);
      }
    }
  },
  
  began: function(event, memo) {
    if (!event.memo) event.memo = memo;
    if (event.memo == this) {
      this.state = JSGestureRecognizerStateBegan;
      if (this.callback) {
        this.callback(this);
      }
    }
  },
  
  ended: function(event, memo) {
    if (!event.memo) event.memo = memo;
    if (event.memo == this) {
      this.state = JSGestureRecognizerStateEnded;
      if (this.callback) {
        this.callback(this);
      }
      this.removeObservers();
      this.reset();
    }
  },
  
  cancelled: function(event, memo) {
    if (!event.memo) event.memo = memo;
    if (event.memo == this) {
      this.state = JSGestureRecognizerStateCancelled;
      if (this.callback) {
        this.callback(this);
      }
      this.removeObservers();
      this.reset();
    }
  },
  
  failed: function(event, memo) {
    if (!event.memo) event.memo = memo;
    if (event.memo == this) {
      this.state = JSGestureRecognizerStateFailed;
      if (this.callback) {
        this.callback(this);
      }
      this.removeObservers();
      this.reset();
    }
  },
  
  changed: function(event, memo) {
    if (!event.memo) event.memo = memo;
    if (event.memo == this) {
      this.state = JSGestureRecognizerStateChanged;
      if (this.callback) {
        this.callback(this);
      }
    }
  },
  
  addObservers: function() {
    this.observe(document, JSTouchMove, this.touchmoveHandler);
    this.observe(document, JSTouchEnd, this.touchendHandler);
  },
  
  removeObservers: function() {
    this.stopObserving(document, JSTouchMove, this.touchmoveHandler);
    this.stopObserving(document, JSTouchEnd, this.touchendHandler);
  },
  
  
  // -- Utility methods -------------------------------------------------------
  // make this section library independent
  fire: function(target, eventName, obj) {
    if (Framework.Prototype) {
      Event.fire(target, eventName, obj);
    } else if (Framework.jQuery) {
      $(target).trigger(eventName, obj);
    }
  },
  
  observe: function(target, eventName, handler) {
    if (Framework.Prototype) {
      target.observe(eventName, handler);
    } else if (Framework.jQuery) {
      $(target).bind(eventName, handler);
    }
  },
  
  stopObserving: function(target, eventName, handler) {
    if (Framework.Prototype) {
      target.stopObserving(eventName, handler);
    } else if (Framework.jQuery) {
      $(target).unbind(eventName, handler);
    }
  },
  
  getEventPoint: function(event) {
    if (MobileSafari)
      return { x: event.targetTouches[0].pageX, y: event.targetTouches[0].pageY };
    if (Framework.Prototype) return Event.pointer(event);
    if (Framework.jQuery) return { x: event.pageX, y: event.pageY };
  }
});

// -- Class Methods -----------------------------------------------------------
JSTouchRecognizer.addGestureRecognizer = function(target, gestureRecognizer) {
  gestureRecognizer.setTarget(target);
}
