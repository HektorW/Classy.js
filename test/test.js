/**
 * KLASS
 */
!function (name, definition) {
  if (typeof define == 'function') define(definition);
  else if (typeof module != 'undefined') module.exports = definition();
  else this[name] = definition();
}('klass', function () {
  var context = this
    , old = context.klass
    , f = 'function'
    , fnTest = /xyz/.test(function () {xyz}) ? /\bsupr\b/ : /.*/
    , proto = 'prototype'

  function klass(o) {
    return extend.call(isFn(o) ? o : function () {}, o, 1);
  }

  function isFn(o) {
    return typeof o === f;
  }

  function wrap(k, fn, supr) {
    return function () {
      var tmp = this.supr;
      this.supr = supr[proto][k];
      var undef = {}.fabricatedUndefined;
      var ret = undef;
      try {
        ret = fn.apply(this, arguments);
      } finally {
        this.supr = tmp;
      }
      return ret;
    };
  }

  function process(what, o, supr) {
    for (var k in o) {
      if (o.hasOwnProperty(k)) {
        what[k] = isFn(o[k])
          && isFn(supr[proto][k])
          && fnTest.test(o[k])
          ? wrap(k, o[k], supr) : o[k]
      }
    }
  }

  function extend(o, fromSub) {
    // must redefine noop each time so it doesn't inherit from previous arbitrary classes
    function noop() {}
    noop[proto] = this[proto]
    var supr = this
      , prototype = new noop()
      , isFunction = isFn(o)
      , _constructor = isFunction ? o : this
      , _methods = isFunction ? {} : o
    function fn() {
      if (this.initialize) this.initialize.apply(this, arguments)
      else {
        fromSub || isFunction && supr.apply(this, arguments)
        _constructor.apply(this, arguments)
      }
    }

    fn.methods = function (o) {
      process(prototype, o, supr);
      fn[proto] = prototype;
      return this;
    };

    fn.methods.call(fn, _methods).prototype.constructor = fn;

    fn.extend = arguments.callee;
    fn[proto].implement = fn.statics = function (o, optFn) {
      o = typeof o == 'string' ? (function () {
        var obj = {};
        obj[o] = optFn;
        return obj;
      }()) : o;
      process(this, o, supr);
      return this;
    };

    return fn;
  }

  klass.noConflict = function () {
    context.klass = old;
    return this;
  };
  context.klass = klass;

  return klass;
});


/* Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 */
// Inspired by base2 and Prototype
(function(){
  var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
 
  // The base Class implementation (does nothing)
  this.Class = function(){};
 
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
    Class.prototype.constructor = Class;
 
    // And make this class extendable
    Class.extend = arguments.callee;
   
    return Class;
  };
})();



if(!String.prototype.format){
    String.prototype.format = function(){
        var args = arguments;
        return this.replace(/{(\d+)}/g, function(match, number){
            return (args[number] !== undefined)? args[number] : match;
        });
    };
}

var LOG = (function(){
    // NODE
    if(this.window === undefined){
        var logTest = function(t, indent){
            indent = indent || 0;

            switch(typeof t){
                case 'object': logObject(t, indent); break;

                default: console.log(new Array(indent).join(' ') + t); break;
            }
        };
        var logObject = function(o, indent, name){
            indent = indent || 0;
            var propIndent = indent + 4;

            console.log(new Array(indent).join(' ') + ((!!name)? name+': ': '') + '{');
            for(var prop in o){
                if(typeof o[prop] === 'object')
                    logObject(o[prop], indent + 4, prop);
                else if(typeof o[prop] === 'function'){
                    console.log('{0}{1}: {2}'.format(new Array(propIndent).join(' '), prop, 'function()'));
                }
                else {
                    console.log('{0}{1}: {2}'.format(new Array(propIndent).join(' '), prop, o[prop]));
                }
            }
            console.log(new Array(indent).join(' ') + '}');
        };

        return function(){
            for(var i = 0, len = arguments.length; i < len; i++){
                logTest(arguments[i]);
            }
        };
    }
    // BROWSER
    else {
        return function(){
            console.log(arguments[0]);
        };
    }
})();


function PrintProto(o){
    LOG('-------------------------');
    LOG('Prototype-chain for ' + o);
    LOG('-------------------------');
    var p = o;
    while(p = Object.getPrototypeOf(p)){
        LOG(p+'');
    }
}


(function(){
    // First decides whether functions get parsed to string correctly
    // Then assigns a regex to use when adding supr to functions
    // Resulting regex checks whether the function contains a reference to 
    // supr() or not
    var fnTest = /xyz/.test(function(){xyz;}) ?
                /\bsupr\b/ : /.*/;

    // Exposed method outside
    function Classy(){}

    function isFn(f){
        return typeof f === 'function';
    }

    Classy.extend = function(obj){
        var supr = this.prototype;

        var new_prototype = new this();

        for(var prop in obj){
            var p = obj[prop];
            var sp = supr[prop];

            if(
                isFn(p) &&  // If the property on the new object is a function
                isFn(sp) /*&& // Property on super is function
                fnTest.test(sp)*/){ // Test if contains ref to supr()

                // Create a wrapper function to fix call of super's function corresponding
                
                new_prototype[prop] = (function(){
                  var fn = function(){
                    var tmp = this.supr;

                    this.supr = supr[prop];

                    var ret = p.apply(this, arguments);

                    this.supr = tmp;

                    return ret;
                  };

                  return fn;
                })();

                // new_prototype[prop] = function(){
                //     // If supr exist on p allready we need to save it temp
                //     var tmp = p.supr;

                //     // Add supr as the function from super-object
                //     p.supr = supr[prop];

                //     // Apply function and store return value
                //     var ret = p.apply(this, arguments);

                //     // Restore temp
                //     p.supr = tmp;

                //     // Return results
                //     return ret;
                // };
            }
            // If not all of the above we just add it
            else {
                new_prototype[prop] = p;
            }
        }

        function F(){
            if(this.__init__)
                this.__init__(arguments);
        }

        F.prototype = new_prototype;

        F.prototype.constructor = F;


        F.extend = this.extend;

        return F;
    };

    this.Classy = Classy;
})();


var Character = Classy.extend({
  name: 'Character',

  walk: function(){
    LOG('Character.walk');
  }
});

var Ninja = Character.extend({
  name: 'Ninja',

  walk: function(){
    this.supr();
    LOG('Ninja.walk');
  }
});

var SuperNinja = Ninja.extend({
  name: 'SuperNinja',

  walk: function(){
    this.supr();
    LOG('SuperNinja.walk');
  }
});

var c = new SuperNinja();

c.walk();

// function Character(){}
// Character.prototype.walk = function() {
//     LOG('Character.walk');
// };

// function Ninja(){}
// Ninja.prototype = new Character();
// Ninja.prototype.constructor = Ninja;
// Ninja.prototype.walk = function() {
//     Object.getPrototypeOf(this).walk();
//     LOG('Ninja.walk');
// };

// function SuperNinja(){}
// SuperNinja.prototype = new Ninja();
// SuperNinja.prototype.constructor = SuperNinja;
// SuperNinja.prototype.walk = function() {
//     Object.getPrototypeOf(this).walk();
//     LOG('SuperNinja.walk');
// };

// var n = new SuperNinja();

// n.walk();