var empty = module.exports;

empty.func   = function() {};
empty.object = Object.create( null );

Object.freeze( empty.object );
Object.freeze( empty );
