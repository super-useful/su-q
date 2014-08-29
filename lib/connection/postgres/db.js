var path = require( 'path' );

var copg = require( 'co-pg' )( require( 'pg' ) );

var DEFAULTS = require( '../../helpers/defaults' )( path.resolve( __dirname, 'config.yaml' ) );

module.exports = function* postgres_connection( config ) {
	var db_name  = config.connection.name   || '';
	var password = config.connection.pwd;
	var port     = config.connection.port   || DEFAULTS.connection.port;
	var server   = config.connection.server || DEFAULTS.connection.server;
	var user     = config.connection.user;

    var connection = 'postgres://';

	if ( typeof user === 'string' && typeof password === 'string' ) {
	    connection += user + ':' + password + '@';
	}

    connection += server + ':' + port + '/' + db_name;

    var db = yield ( new copg.Client( connection ) ).connect_();
	db.__name__ = db_name;

    return db;
};
