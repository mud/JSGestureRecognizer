/*  JSGestureRecognizer, Version 1.0
 *  (c) 2011 Takashi Okamoto - BuzaMoto
 *
 *  JSGestureRecognizer is a JavaScript implementation of 
 *  UIGestureRecognizer on iOS
 *
 *  http://developer.apple.com/library/ios/#documentation/EventHandling/Conceptual/EventHandlingiPhoneOS/GestureRecognizers/GestureRecognizers.html
 *--------------------------------------------------------------------------*/

var JSGestureRecognizerStatePossible   = 'JSGestureRecognizer:possible',
    JSGestureRecognizerStateBegan      = 'JSGestureRecognizer:began',
    JSGestureRecognizerStateChanged    = 'JSGestureRecognizer:changed',
    JSGestureRecognizerStateEnded      = 'JSGestureRecognizer:ended',
    JSGestureRecognizerStateCancelled  = 'JSGestureRecognizer:cancelled',
    JSGestureRecognizerStateFailed     = 'JSGestureRecognizer:failed',
    JSGestureRecognizerStateRecognized = JSGestureRecognizerStateEnded;

var JSTouchStart     = 'touchstart',
    JSTouchMove      = 'touchmove',
    JSTouchEnd       = 'touchend',
    JSTouchCancelled = 'touchcancelled',
    JSGestureStart   = 'gesturestart',
    JSGestureChange  = 'gesturechange',
    JSGestureEnd     = 'gestureend';

if (!Prototype.Browser.MobileSafari) {
    JSTouchStart = 'mousedown';
    JSTouchMove  = 'mousemove';
    JSTouchEnd   = 'mouseup';
}

// -- Abstract Class: JSGestureRecognizer -------------------------------------
var JSGestureRecognizer = Class.create({
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
    return "JSGestureRecognizer";
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

    this.gesturechangeHandler = this.gesturechange.bind(this);
    this.gestureendHandler = this.gestureend.bind(this);

    this.observe(this.target, JSTouchStart, this.touchstart.bind(this));
    this.observe(this.target, JSTouchStart, this.gesturestart.bind(this));
    this.observe(this.target, JSGestureRecognizerStatePossible, this.possible.bind(this));
    this.observe(this.target, JSGestureRecognizerStateBegan, this.began.bind(this));
    this.observe(this.target, JSGestureRecognizerStateEnded, this.ended.bind(this));
    this.observe(this.target, JSGestureRecognizerStateCancelled, this.cancelled.bind(this));
    this.observe(this.target, JSGestureRecognizerStateFailed, this.failed.bind(this));
    this.observe(this.target, JSGestureRecognizerStateChanged, this.changed.bind(this));
  },
  
  reset: function() { },
  
  
  // -- Touch Events ----------------------------------------------------------
  touchstart: function(event) {
    if (this.target && event.target == this.target) {
      this.addObservers();
      this.fire(this.target, JSGestureRecognizerStatePossible);
    }
  },
  
  touchmove: function(event) {},
  touchend: function(event) {},
  touchcancelled: function(event) {},
  
  
  // -- Gesture Events --------------------------------------------------------
  gesturestart: function(event) {
    if (this.target && event.target == this.target) {
      this.addGestureObservers();
      this.fire(this.target, JSGestureRecognizerStatePossible);
    }
  },
  
  gesturechange: function(event) {},
  gestureend: function(event) {
    if (this.target && event.target == this.target) {
      this.fire(this.target, JSGestureRecognizerStateEnded, this);
    }
  },
  
  
  // -- Event Handlers --------------------------------------------------------
  possible: function(event) {
    if (event.memo == this) {
      this.state = JSGestureRecognizerStatePossible;
      if (this.callback) {
        this.callback(this);
      }
    }
  },
  
  began: function(event) {
    if (event.memo == this) {
      this.state = JSGestureRecognizerStateBegan;
      if (this.callback) {
        this.callback(this);
      }
    }
  },
  
  ended: function(event) {
    if (event.memo == this) {
      this.state = JSGestureRecognizerStateEnded;
      if (this.callback) {
        this.callback(this);
      }
      this.removeObservers();
      this.removeGestureObservers();
      this.reset();
    }
  },
  
  cancelled: function(event) {
    if (event.memo == this) {
      this.state = JSGestureRecognizerStateCancelled;
      if (this.callback) {
        this.callback(this);
      }
      this.removeObservers();
      this.removeGestureObservers();
      this.reset();
    }
  },
  
  failed: function(event) {
    if (event.memo == this) {
      this.state = JSGestureRecognizerStateFailed;
      if (this.callback) {
        this.callback(this);
      }
      this.removeObservers();
      this.removeGestureObservers();
      this.reset();
    }
  },
  
  changed: function(event) {
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
  
  addGestureObservers: function() {
    this.observe(document, JSGestureChange, this.gesturechangeHandler);
    this.observe(document, JSGestureEnd, this.gestureendHandler);
  },
  
  removeGestureObservers: function() {
    this.stopObserving(document, JSGestureChange, this.gesturechangeHandler);
    this.stopObserving(document, JSGestureEnd, this.gestureendHandler);
  },
  
  
  // -- Utility methods -------------------------------------------------------
  // make this section library independent
  fire: function(target, eventName, obj) {
    Event.fire(target, eventName, obj);
  },
  
  observe: function(target, eventName, handler) {
    target.observe(eventName, handler);
  },
  
  stopObserving: function(target, eventName, handler) {
    target.stopObserving(eventName, handler);
  },
  
  getEventPoint: function(event) {
    if (Prototype.Browser.MobileSafari)
      return { x: event.targetTouches[0].pageX, y: event.targetTouches[0].pageY };
    return Event.pointer(event);
  }
});
$_ = (function() {
  return {
    
  }
})();

// -- Class Methods -----------------------------------------------------------
Object.extend(JSGestureRecognizer, {
  addGestureRecognizer: function(target, gestureRecognizer) {
    gestureRecognizer.setTarget(target);
  }
});
