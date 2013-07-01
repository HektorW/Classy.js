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







var Classy = (function(){
    var CL = function(obj){
        return CL.extend({}, obj);
    };

    CL.extend = function(supr, base){
        var f = function(){
            if(f._super.prototype)
                f._super.prototype.constructor.apply(this, arguments);

            if(f.prototype.__init__)
                f.prototype.__init__.apply(this, arguments);
        };

        f._super = supr;
        f.prototype = Object.create(supr);
        f.prototype.constructor = f;

        f.supr = function(){
            var method_name = arguments.callee.caller.name;
            LOG(method_name);
        };

        for(var prop in base){
            f.prototype[prop] = base[prop];
        }

        return f;
    };

    return CL;
})();








var Character = Classy({
    __init__: function(name){
        LOG('Character.init');
        this.name = name;
    },

    toString: function(){
        return 'Character: ' + this.name;
    }
});


var Ninja = Classy.extend(Character, {
    __init__: function(name){
        LOG('Ninja.init');
    },

    slice: function(){
        LOG('slicing!');
    },

    toString: function(){
        return 'Ninja: ' + this.name;
    }
});


var SuperNinja = Classy.extend(Ninja, {
    __init__: function(name){
        LOG('SuperNinja.init');
    },

    slice: function(){
        this.supr();

        LOG('super slicing!');
    },

    toString: function(){
        return 'SuperNinja: ' + this.name;
    }
});

var UberNinja = Classy.extend(Ninja, {
    __init__: function(name){
        LOG('UberNinja.init');
        this.name = name;
    },

    slice: function(){
        LOG('über slicing!');
    },

    toString: function(){
        return 'UberNinja: ' + this.name;
    }
});


var c = new SuperNinja('Hektor');


LOG(c);

c.slice();




// function Character(){
//     LOG('Character');
//     this.val = 1;
//     this.active = false;
// }
// Character.prototype.activate = function() {
//     LOG('Character.activate');
// };

// Character.prototype.draw = function(ctx) {
//     LOG('Character.draw.' + ctx);
// };

// Character.prototype.toString = function() {
//     return 'Character';
// };















// function Ninja(){
//     LOG('Ninja');
//     this.val *= 3;
// }
// Ninja.prototype = new Character();
// Ninja.prototype.constructor = Ninja;
// Ninja._super_class = Character;
// Ninja.prototype.super = function(){
//     // LOG(arguments.callee.caller);
//     var method_name = arguments[0];

//     var f = Ninja._super_class.prototype[method_name];

//     if(!f)
//         return;

//     var args = [];
//     for(var i = 1, len = arguments.length; i < len; i++){
//         args.push(arguments[i]);
//     }

//     f.apply(this, args);
// };

// Ninja.prototype.activate = function Ninja_activate() {
//     this.super('activate');
//     LOG('Ninja.activate');
// };
// Ninja.prototype.draw = function(ctx) {
//     this.super('draw', ctx);
// };












// function SuperNinja(){
//     LOG('SuperNinja');
// }
// SuperNinja.prototype = new Ninja();
// SuperNinja.prototype.constructor = SuperNinja;
// SuperNinja._super_class = Ninja;
// SuperNinja.prototype.super = function(){
//     var method_name = arguments[0];

//     var f = SuperNinja._super_class.prototype[method_name];

//     if(!f)
//         return;

//     var args = [];
//     for(var i = 1, len = arguments.length; i < len; i++){
//         args.push(arguments[i]);
//     }

//     f.apply(this, args);
// };

// SuperNinja.prototype.activate = function SuperNinja_activate() {
//     this.super('activate');
//     LOG('SuperNinja.activate');
// };











// var n = new SuperNinja();

// n.activate();
// n.draw('Canvas');












// var Character = Classy(function(name){
//     this.name = name;

//     this._title = 'Count';
// }, {
//     update: function(t){

//     },

//     toString: {
//         value: function(){
//             return 'Character.' + this.name;
//         },
//         writable: true,
//         enumerable: false,
//         configurable: true
//     },

//     get fancyName (){ return this._title + ' ' + this.name; },
//     set fancyName (value){ this._title = value; }
// });


