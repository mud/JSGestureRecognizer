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
    if (this.target) {
      this.addObservers();
      this.fire(this.target, JSGestureRecognizerStatePossible);
    }
  },
  
  touchmove: function(event) {},
  touchend: function(event) {},
  touchcancelled: function(event) {},
  
  
  // -- Gesture Events --------------------------------------------------------
  gesturestart: function(event) {
    if (this.target) {
      this.addGestureObservers();
      this.fire(this.target, JSGestureRecognizerStatePossible);
    }
  },
  
  gesturechange: function(event) {},
  gestureend: function(event) {
    this.fire(this.target, JSGestureRecognizerStateEnded, this);
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
  
  stopEvent: function(event) {
    Event.stop(event);
  },
  
  getEventPoint: function(event) {
    if (Prototype.Browser.MobileSafari)
      return { x: event.targetTouches[0].clientX, y: event.targetTouches[0].clientY };
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
var JSTapGestureRecognizer = Class.create(JSGestureRecognizer, {
  numberOfTapsRequired:    1,
  numberOfTouchesRequired: 1,
  
  toString: function() {
    return "JSTapGestureRecognizer";
  },
  
  touchstart: function($super, event) {
    $super(event);
    this.numberOfTouches = event.targetTouches.length;
    this.stopEvent(event);
  },
  
  touchmove: function(event) {
    this.removeObservers();
    this.fire(this.target, JSGestureRecognizerStateFailed, this);
  },
  
  touchend: function($super, event) {
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
  },
  
  reset: function() {
    this.taps = 0;
    this.recognizerTimer = null;
  }
});

Object.extend(JSTapGestureRecognizer, {
  TapTimeout: 500
});
var JSLongPressGestureRecognizer = Class.create(JSGestureRecognizer, {
  minimumPressDuration:    400,
  numberOfTouchesRequired: 1,
  numberOfTapsRequired:    1, // not sure how this works with multiple taps
  allowableMovement:       10, // currently we ignore this
  
  toString: function() {
    return "JSLongPressGestureRecognizer";
  },
  
  touchstart: function($super, event) {
    $super(event);
    if (this.numberOfTouchesRequired == event.targetTouches.length) {
      this.recognizerTimer = window.setTimeout(function() {
        this.fire(this.target, JSGestureRecognizerStateRecognized, this);
      }.bind(this), this.minimumPressDuration);
    }
    Event.stop(event);
  },
  
  touchmove: function(event) {
    this.fire(this.target, JSGestureRecognizerStateFailed, this);
  },
  
  touchend: function(event) {
    this.fire(this.target, JSGestureRecognizerStateFailed, this);
  },
  
  gesturestart: function(event) {
    this.fire(this.target, JSGestureRecognizerStateFailed);
  },
  
  reset: function() {
    if (this.recognizerTimer) {
      window.clearTimeout(this.recognizerTimer);
    }
    this.recognizerTimer = null;
  }
});
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
var JSPinchGestureRecognizer = Class.create(JSGestureRecognizer, {
  toString: function() {
    return "JSPinchGestureRecognizer";
  },
  
  gesturestart: function($super, event) {
    if (event.targetTouches.length == 2) {
      $super(event);
    }
  },
  
  gesturechange: function(event) {
    if (this.beganRecognizer == false) {
      this.fire(this.target, JSGestureRecognizerStateBegan, this);
      this.beganRecognizer = true;
    } else {
      this.fire(this.target, JSGestureRecognizerStateChanged, this);
      this.scale *= event.scale;
    }
    this.stopEvent(event);
  },
  
  reset: function() {
    this.beganRecognizer = false;
    this.scale = 1;
    this.velocity = 0;
  },
  
  setScale: function(scale) {
    if (typeof scale == 'number') {
      this.scale = scale;
    }
  }
});
var JSRotationGestureRecognizer = Class.create(JSGestureRecognizer, {
  toString: function() {
    return "JSRotationGestureRecognizer";
  },
  
  gesturestart: function($super, event) {
    if (event.targetTouches.length == 2) {
      $super(event);
    }
  },
  
  gesturechange: function(event) {
    if (this.beganRecognizer == false) {
      this.fire(this.target, JSGestureRecognizerStateBegan, this);
      this.beganRecognizer = true;
    } else {
      this.fire(this.target, JSGestureRecognizerStateChanged, this);
      this.rotation += event.rotation;
    }
    this.stopEvent(event);
  },
  
  reset: function() {
    this.beganRecognizer = false;
    this.rotation = 0;
    this.velocity = 0;
  },
  
  setRotation: function(rot) {
    if (typeof rot == 'number') {
      this.rotation = rot;
    }
  }
});
var JSSwipeGestureRecognizerDirectionRight = 1 << 0,
    JSSwipeGestureRecognizerDirectionLeft  = 1 << 1,
    JSSwipeGestureRecognizerDirectionUp    = 1 << 2,
    JSSwipeGestureRecognizerDirectionDown  = 1 << 3;

var JSSwipeGestureRecognizer = Class.create(JSGestureRecognizer, {
  numberOfTouchesRequired: 1,
  direction:               JSSwipeGestureRecognizerDirectionRight,
  
  toString: function() {
    return "JSSwipeGestureRecognizer";
  },
  
  touchstart: function($super, event) {
    if (this.numberOfTouchesRequired == event.targetTouches.length) {
      $super(event);
      this.startingPos = { x: event.targetTouches[0].pageX, y: event.targetTouches[0].pageY };
      this.distance = { x: 0, y: 0 };
      Event.stop(event);
    } else {
      this.fire(this.target, JSGestureRecognizerStateFailed, this);
    }
  },
  
  touchmove: function(event) {
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
  },
  
  touchend: function(event) {
    this.fire(this.target, JSGestureRecognizerStateFailed, this);
  }
});
var JSGestureView = Class.create({
  initialize: function(element) {
    this.view = $(element);
    this.scale = 1;
    this.rotation = this.x = this.y = 0;
  },
  
  setTransform: function(obj) {
    this._x = (obj.x || this._x || this.x);
    this._y = (obj.y || this._y || this.y);
    this._scale = (obj.scale || this._scale || this.scale);
    this._rotation = (obj.rotation || this._rotation || this.rotation);
    this.view.setStyle({webkitTransform: 'translate3d('+
      this._x+'px, '+this._y+'px, 0) '+
      'scale('+this._scale+') '+
      'rotate('+this._rotation+'deg)'});
  },
  
  addGestureRecognizer: function(recognizer) {
    JSGestureRecognizer.addGestureRecognizer(this, recognizer);
  }
});