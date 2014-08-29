var path = require( 'path' );

var DEFAULTS          = require( '../../helpers/defaults' )( path.resolve( __dirname, 'config.yaml' ) );
var accessibleMethods = require( '../../helpers/accessibleMethods' );
var TableOrSProc      = require( './TableOrSProc' );

module.exports = function* ( db, config ) {
	if ( !config.collections || typeof config.collections !== 'object'  ) {
		throw new Error( 'su-q: please specify which collections/tables you require access to in your configuration.' );
	}

	var collection, i = -1, k, l;
	var collections = {};

	if ( !Array.isArray( config.collections ) ) {
		k = Object.keys( config.collections );
		l = k.length;

		while ( ++i < l ) {
			collection                      = k[i];
			collections[collection]         = new TableOrSProc( config.collections[collection], db );
			collections[collection].methods = accessibleMethods( collection, config.access, DEFAULTS.access );
		}
	}
	else {
		l = config.collections.length;

		while ( ++i < l ) {
			collection                      = config.collections[i];
			collections[collection]         = new TableOrSProc( collection, db );
			collections[collection].methods = accessibleMethods( collection, config.access, DEFAULTS.access );
		}
	}

	return collections;
};
