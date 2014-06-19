var fs   = require( 'fs' );
var path = require( 'path' );

var co   = require( 'co' );
var iter = require( 'super-iter' );

var connections     = require( '../helpers/requireall' )( path.resolve( __dirname, '..', 'connection' ) );
var collectionProxy = require( './collection' );
var empty           = require( './empty' );

var cache         = new WeakMap;
var proxy_handler = {
		// NOTE: receiver === proxy created in module.exports!!!
		get : function( receiver, property ) {
			var trapped = cache.get( receiver );

			if ( property in trapped.db ) {
				return trapped.db[property];
			}

			if ( property in trapped.collections ) {
				return trapped.collections[property] || empty.func;
			}

			if ( property === 'close' ) {
				return yield* trapped.db.close();
			}

			return empty.object;
		},
		set : function( receiver, property ) {
			return new Error( 'su-q: cannot set a property on a database.' );
		}
	};

module.exports = function* db_connection( config ) {
	if ( !( config.type in connections ) ) {
		return new Error( 'su-q: ' + config.type + ' is not a supported connection type.' );
	}

	var db          = yield connections[config.type].db( config );
	var collections = yield connections[config.type].collection( db, config );

	iter.forEach( collections, function( collection, name ) {
		collections[name] = collectionProxy( collection, connections[config.type].query );
	} );

	var proxy = Proxy.create( proxy_handler );

	cache.set( proxy, { collections : collections, db : db } );

	return proxy;
};
