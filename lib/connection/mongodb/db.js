var path = require( 'path' );

var comongo = require( 'co-mongo' );

var DEFAULTS = require( '../../helpers/defaults' )( path.resolve( __dirname, 'config.yaml' ) );

module.exports = function* mongodb_connection( config ) {
	var db_name = config.connection.name;
	var port    = config.connection.port   || DEFAULTS.connection.port;
	var server  = config.connection.server || DEFAULTS.connection.server;

	var db      = yield comongo.connect( 'mongodb://' + server + ':' + port + '/' + db_name );
	db.__name__ = db_name;

	return db;
};
