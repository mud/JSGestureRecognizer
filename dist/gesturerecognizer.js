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

var JSSwipeGestureRecognizerDirectionRight = 1 << 0,
    JSSwipeGestureRecognizerDirectionLeft  = 1 << 1,
    JSSwipeGestureRecognizerDirectionUp    = 1 << 2,
    JSSwipeGestureRecognizerDirectionDown  = 1 << 3;(function(w) {
  
  var MobileSafari = (function() {
    return /Apple.*Mobile/.test(navigator.userAgent);
  })();

  if (!MobileSafari) {
      JSTouchStart = 'mousedown';
      JSTouchMove  = 'mousemove';
      JSTouchEnd   = 'mouseup';
  }

  var Framework = (function() {
    return {
      Prototype: (typeof w.Prototype != 'undefined'),
      jQuery:    (typeof w.jQuery != 'undefined')
    }
  })();
  
  // class definition using Prototype
  if (Framework.Prototype) {
    
  } else if (!Framework.Prototype) {
    // ads Mobile Safari touch properties
    $.each(['rotation', 'scale', 'touches', 'targetTouches'], function(i, propName){
      if ( $.inArray(propName, $.event.props) < 0 ) {
        $.event.props.push(propName);
      }
    });
    Function.prototype.bind = function(context) {
      return jQuery.proxy(this, context);
    }
  }
  
  // scope class here so that it doesn't affect Prototype's Class definition.
  // http://ejohn.org/blog/simple-javascript-inheritance/
  var Class = function(){};
  (function(){
    var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
    // Create a new Class that inherits from this class
    Class.extend = function(prop) {
      var _super = this.prototype;

      // Instantiate a base class (but only create the instance,
      // don't run the init constructor)
      initializing = true;
      var prototype = new this();
      initializing = false;

      // Copy the properties over onto the new prototype
      for (var name in prop) {
        // Check if we're overwriting an existing function
        prototype[name] = typeof prop[name] == "function" && 
          typeof _super[name] == "function" && fnTest.test(prop[name]) ?
          (function(name, fn){
            return function() {
              var tmp = this._super;

              // Add a new ._super() method that is the same method
              // but on the super-class
              this._super = _super[name];

              // The method only need to be bound temporarily, so we
              // remove it when we're done executing
              var ret = fn.apply(this, arguments);        
              this._super = tmp;

              return ret;
            };
          })(name, prop[name]) :
          prop[name];
      }

      // The dummy class constructor
      function Class() {
        // All construction is actually done in the init method
        if ( !initializing && this.init )
          this.init.apply(this, arguments);
      }

      // Populate our constructed prototype object
      Class.prototype = prototype;

      // Enforce the constructor to be what we expect
      Class.constructor = Class;

      // And make this class extendable
      Class.extend = arguments.callee;

      return Class;
    };
  })();// -- Abstract Class: JSGestureRecognizer -------------------------------------
var JSGestureRecognizer = Class.extend({
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
  touchstart: function(event, obj) {
    if (this.target && event.target == this.target) {
      this.addObservers();
      this.fire(this.target, JSGestureRecognizerStatePossible, this);
    }
  },
  
  touchmove: function(event) {},
  touchend: function(event) {},
  touchcancelled: function(event) {},
  
  
  // -- Gesture Events --------------------------------------------------------
  gesturestart: function(event) {
    if (this.target && event.target == this.target) {
      this.addGestureObservers();
      this.fire(this.target, JSGestureRecognizerStatePossible, this);
    }
  },
  
  gesturechange: function(event) {},
  gestureend: function(event) {
    if (this.target && event.target == this.target) {
      this.fire(this.target, JSGestureRecognizerStateEnded, this);
    }
  },
  
  
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
      this.removeGestureObservers();
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
      this.removeGestureObservers();
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
      this.removeGestureObservers();
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
JSGestureRecognizer.addGestureRecognizer = function(target, gestureRecognizer) {
  gestureRecognizer.setTarget(target);
}
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
var JSLongPressGestureRecognizer = JSGestureRecognizer.extend({
  minimumPressDuration:    400,
  numberOfTouchesRequired: 1,
  numberOfTapsRequired:    1, // not sure how this works with multiple taps
  allowableMovement:       10, // currently we ignore this
  
  toString: function() {
    return "JSLongPressGestureRecognizer";
  },
  
  touchstart: function(event) {
    if (event.target == this.target) {
      event.preventDefault();
      this._super(event);
      if (this.numberOfTouchesRequired == event.targetTouches.length) {
        this.recognizerTimer = window.setTimeout(function() {
          this.fire(this.target, JSGestureRecognizerStateRecognized, this);
        }.bind(this), this.minimumPressDuration);
      }
    }
  },
  
  touchmove: function(event) {
    if (event.target == this.target) {
      event.preventDefault();
      this.fire(this.target, JSGestureRecognizerStateFailed, this);
    }
  },
  
  touchend: function(event) {
    if (event.target == this.target) {
      event.preventDefault();
      this.fire(this.target, JSGestureRecognizerStateFailed, this);
    }
  },
  
  gesturestart: function(event) {
    if (event.target == this.target) {
      event.preventDefault();
      this.fire(this.target, JSGestureRecognizerStateFailed);
    }
  },
  
  reset: function() {
    if (this.recognizerTimer) {
      window.clearTimeout(this.recognizerTimer);
    }
    this.recognizerTimer = null;
  }
});
var JSPanGestureRecognizer = JSGestureRecognizer.extend({
  maximumNumberOfTouches: 100000,
  minimumNumberOfTouches: 1,
  
  toString: function() {
    return "JSPanGestureRecognizer";
  },
  
  touchstart: function(event) {
    if (event.target == this.target) {
      this._super(event);
      if (event.targetTouches.length > this.maximumNumberOfTouches ||
          event.targetTouches.length < this.minimumNumberOfTouches) {
        this.touchend(event);
      }
    }
  },
  
  touchmove: function(event) {
    if (event.target == this.target) {
      event.preventDefault();
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
    }
  },
  
  touchend: function(event) {
    if (event.target == this.target) {
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
      if (event.targetTouches.length > this.maximumNumberOfTouches) {
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
var JSPinchGestureRecognizer = JSGestureRecognizer.extend({
  toString: function() {
    return "JSPinchGestureRecognizer";
  },
  
  gesturestart: function(event) {
    if (event.target == this.target) {
      if (event.targetTouches.length == 2) {
        event.preventDefault();
        this._super(event);
      }
    }
  },
  
  gesturechange: function(event) {
    if (event.target == this.target) {
      event.preventDefault();
      if (this.beganRecognizer == false) {
        this.fire(this.target, JSGestureRecognizerStateBegan, this);
        this.beganRecognizer = true;
      } else {
        this.fire(this.target, JSGestureRecognizerStateChanged, this);
        this.scale *= event.scale;
      }
    }
  },
  
  // seems like if this isn't included jQuery doesn't run gestureend
  gestureend: function(event) {
    this._super(event);
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
var JSRotationGestureRecognizer = JSGestureRecognizer.extend({
  toString: function() {
    return "JSRotationGestureRecognizer";
  },
  
  gesturestart: function(event) {
    if (event.target == this.target) {
      if (event.targetTouches.length == 2) {
        event.preventDefault();
        this._super(event);
      }
    }
  },
  
  gesturechange: function(event) {
    if (event.target == this.target) {
      event.preventDefault();
      if (this.beganRecognizer == false) {
        this.fire(this.target, JSGestureRecognizerStateBegan, this);
        this.beganRecognizer = true;
      } else {
        this.fire(this.target, JSGestureRecognizerStateChanged, this);
        this.rotation += event.rotation;
      }
    }
  },
  
  // seems like if this isn't included jQuery doesn't run gestureend
  gestureend: function(event) {
    this._super(event);
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
var JSGestureView = Class.extend({
  init: function(element) {
    this.view = document.getElementById(element);
    this.scale = 1;
    this.rotation = this.x = this.y = 0;
  },
  
  setTransform: function(obj) {
    this._x = (obj.x || this._x || this.x);
    this._y = (obj.y || this._y || this.y);
    this._scale = (obj.scale || this._scale || this.scale);
    this._rotation = (obj.rotation || this._rotation || this.rotation);
    this.view.style.webkitTransform = 'translate3d('+
      this._x+'px, '+this._y+'px, 0) '+
      'scale('+this._scale+') '+
      'rotate('+this._rotation+'deg)';
  },
  
  addGestureRecognizer: function(recognizer) {
    JSGestureRecognizer.addGestureRecognizer(this, recognizer);
  }
});

  w.JSGestureRecognizer          = JSGestureRecognizer;
  w.JSLongPressGestureRecognizer = JSLongPressGestureRecognizer;
  w.JSPanGestureRecognizer       = JSPanGestureRecognizer;
  w.JSPinchGestureRecognizer     = JSPinchGestureRecognizer;
  w.JSRotationGestureRecognizer  = JSRotationGestureRecognizer;
  w.JSSwipeGestureRecognizer     = JSSwipeGestureRecognizer;
  w.JSTapGestureRecognizer       = JSTapGestureRecognizer;
  
  w.JSGestureView       = JSGestureView;

})(window);