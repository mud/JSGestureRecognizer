(function(w) {
  
  var MobileSafari = (function() {
    return /Apple.*Mobile/.test(navigator.userAgent);
  })();

  if (!MobileSafari) {
      JSTouchStart     = 'mousedown',
      JSTouchMove      = 'mousemove',
      JSTouchEnd       = 'mouseup',
      JSTouchCancelled = 'mouseup',
      JSGestureStart   = 'mousedown',
      JSGestureChange  = 'mousemove',
      JSGestureEnd     = 'mouseup';
  }

  var Framework = (function() {
    return {
      Prototype: (typeof w.Prototype != 'undefined'),
      jQuery:    (typeof w.jQuery != 'undefined')
    }
  })();
  
  // class definition using Prototype
  if (Framework.Prototype) {
    
  } else if (Framework.jQuery) {
    // add Mobile Safari touch properties to event object
    $.each(['rotation', 'scale', 'touches', 'targetTouches'], function(i, propName) {
      if ($.inArray(propName, $.event.props) < 0) {
        $.event.props.push(propName);
      }
    });
    Function.prototype.bind = function(context) {
      return jQuery.proxy(this, context);
    }
  } else {
    throw new Error("Required Dependency: you need to include either Prototype.js or jQuery.");
  }
  
  // scope Class here so that it doesn't redefine Prototype's Class definition.
  // we're using John Resig's class inheritance, which is nice and library independent.
  // http://ejohn.org/blog/simple-javascript-inheritance/
  var Class = function(){};
  (function(){ var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/; Class.extend = function(prop) { var _super = this.prototype; initializing = true; var prototype = new this(); initializing = false; for (var name in prop) { prototype[name] = typeof prop[name] == "function" && typeof _super[name] == "function" && fnTest.test(prop[name]) ? (function(name, fn){ return function() { var tmp = this._super; this._super = _super[name]; var ret = fn.apply(this, arguments); this._super = tmp; return ret; }; })(name, prop[name]) : prop[name]; } function Class() { if ( !initializing && this.init ) this.init.apply(this, arguments); } Class.prototype = prototype; Class.constructor = Class; Class.extend = arguments.callee; return Class; };})();

  // -- Event extension -------------------------------------------------------
  var allTouches;
  if (!MobileSafari) {
    allTouches = function() {
      var touches = [this];
      if (this.altKey) {
        touches.push(this);
      }
      return touches;
    }
  } else {
    allTouches = function() {
      return this.targetTouches;
    };
  }
  if (Framework.Prototype) {
    Event.prototype.allTouches = allTouches;
  } else {
    jQuery.extend(jQuery.Event.prototype, { allTouches: allTouches });
  }
