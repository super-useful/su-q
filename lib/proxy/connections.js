var co   = require( 'co' );
var func = require( 'super-func' );

var dbProxy = require( './db' );
var empty   = require( './empty' );

var cache         = new WeakMap;
var proxy_handler = {
		// NOTE: receiver === proxy created in module.exports!!!
		get : function( receiver, property ) {
			var connections = cache.get( receiver );

			return connections[property] || empty.object;
		},
		set : function( receiver, property ) {
			return new Error( 'su-q: cannot set a property on a set of database connections.' );
		}
	};

module.exports = function* ( config ) {
	var connection;
	var connections = {};

	var i = -1;
	var l = config.length;

	while ( ++i < l ) {
		connection = yield dbProxy( config[i] );

		connections[config[i].connection.name] = connection;
	}

	var proxy = Proxy.create( proxy_handler );

	cache.set( proxy, connections );

	return proxy;
};
