var path = require( 'path' );

var DEFAULTS = require( '../../helpers/defaults' )( path.resolve( __dirname, 'config.yaml' ) );

var accessibleMethods = require( '../../helpers/accessibleMethods' );

module.exports = function* ( db, config ) {
	if ( !Array.isArray( config.collections ) ) {
		throw new Error( 'su-q: please specify which collections/tables you require access to in your configuration.' );
	}

	var collection;
	var collections = {};

	var i = -1;
	var l = config.collections.length;

	while ( ++i < l ) {
		collection                      = config.collections[i];
		collections[collection]         = yield db.collection( collection );
		collections[collection].methods = accessibleMethods( collection, config.access, DEFAULTS.access );
	}

	return collections;
};
