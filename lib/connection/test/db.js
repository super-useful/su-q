var path = require( 'path' );

var DEFAULTS = require( '../../helpers/defaults' )( path.resolve( __dirname, 'config.yaml' ) );

function test_db( options ) {
	return function( done ) {
		setTimeout( function() {
			done( null, options );
		}, 10 );
	};
}

module.exports = function* test_connection( config ) {
	var db_name = config.connection.name;
	var port    = config.connection.port   || DEFAULTS.connection.port;
	var server  = config.connection.server || DEFAULTS.connection.server;

	var db      = yield test_db( {
		name   : db_name,
		port   : port,
		server : server
	} );

	db.__name__ = db_name;

	return db;
};
