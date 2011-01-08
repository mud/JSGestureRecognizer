(function(w) {
  
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
  })();