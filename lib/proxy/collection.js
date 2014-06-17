var func    = require( 'super-func' );
var empty   = require( './empty' );

var cache         = new WeakMap;
var proxy_handler = {
		// NOTE: receiver === proxy created in module.exports!!!
		get : function( receiver, property ) {
			var trapped = cache.get( receiver );

			if ( property in trapped.methods ) {
				return func.partial( query, trapped, property );
			}

			return empty.func;
		},
		set : function( receiver, property ) {
			return new Error( 'su-q: cannot set a property on a collection/table.' );
		}
	};

module.exports = function( collection, query ) {
	var methods = collection.methods || {};
	var proxy  = Proxy.create( proxy_handler );

	delete collection.methods;

	if ( typeof query !== 'function' ) {
		query = function( method ) {
			return Array.prototype.slice.call( arguments, 1 );
		};
	}

	cache.set( proxy, { collection : collection, methods : methods, query : query } );

	return proxy;
};

function* query( trapped, method ) {
	var callback;

//	if ( typeof method === 'object' ) {
//		callback = method.cb;
//		method   = method.aliased;
//	}

	var query  = trapped.query.apply( null, Array.prototype.slice.call( arguments, 1 ) );
	var result = trapped.collection[method].apply( trapped.collection, query );

	return typeof result === 'function'
		 ? yield result
		 : typeof callback === 'function'
		 ? callback( result )
		 : result;
}
