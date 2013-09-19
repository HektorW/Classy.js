// /**
//  * KLASS
//  */
// !function (name, definition) {
//   if (typeof define == 'function') define(definition);
//   else if (typeof module != 'undefined') module.exports = definition();
//   else this[name] = definition();
// }('klass', function () {
//   var context = this
//     , old = context.klass
//     , f = 'function'
//     , fnTest = /xyz/.test(function () {xyz}) ? /\bsupr\b/ : /.*/
//     , proto = 'prototype'

//   function klass(o) {
//     return extend.call(isFn(o) ? o : function () {}, o, 1);
//   }

//   function isFn(o) {
//     return typeof o === f;
//   }

//   function wrap(k, fn, supr) {
//     return function () {
//       var tmp = this.supr;
//       this.supr = supr[proto][k];
//       var undef = {}.fabricatedUndefined;
//       var ret = undef;
//       try {
//         ret = fn.apply(this, arguments);
//       } finally {
//         this.supr = tmp;
//       }
//       return ret;
//     };
//   }

//   function process(what, o, supr) {
//     for (var k in o) {
//       if (o.hasOwnProperty(k)) {
//         what[k] = isFn(o[k])
//           && isFn(supr[proto][k])
//           && fnTest.test(o[k])
//           ? wrap(k, o[k], supr) : o[k]
//       }
//     }
//   }

//   function extend(o, fromSub) {
//     // must redefine noop each time so it doesn't inherit from previous arbitrary classes
//     function noop() {}
//     noop[proto] = this[proto]
//     var supr = this
//       , prototype = new noop()
//       , isFunction = isFn(o)
//       , _constructor = isFunction ? o : this
//       , _methods = isFunction ? {} : o
//     function fn() {
//       if (this.initialize) this.initialize.apply(this, arguments)
//       else {
//         fromSub || isFunction && supr.apply(this, arguments)
//         _constructor.apply(this, arguments)
//       }
//     }

//     fn.methods = function (o) {
//       process(prototype, o, supr);
//       fn[proto] = prototype;
//       return this;
//     };

//     fn.methods.call(fn, _methods).prototype.constructor = fn;

//     fn.extend = arguments.callee;
//     fn[proto].implement = fn.statics = function (o, optFn) {
//       o = typeof o == 'string' ? (function () {
//         var obj = {};
//         obj[o] = optFn;
//         return obj;
//       }()) : o;
//       process(this, o, supr);
//       return this;
//     };

//     return fn;
//   }

//   klass.noConflict = function () {
//     context.klass = old;
//     return this;
//   };
//   context.klass = klass;

//   return klass;
// });




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

