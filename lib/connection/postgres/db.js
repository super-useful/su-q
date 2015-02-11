var path = require( 'path' );
var getenv = require('getenv');
//var copg = require( 'co-pg' )( require( 'pg' ) );
var pg = require( 'pg' );

var DEFAULTS = require( '../../helpers/defaults' )( path.resolve( __dirname, 'config.yaml' ) );

module.exports = function* postgres_connection( config ) {
	var db_name  = getenv('PG_DB_NAME', config.connection.name);
	var password = encodeURIComponent(getenv('PG_PASS', config.connection.pwd));
	var port     = getenv('POSTGRES_PORT_5432_TCP_PORT', config.connection.port || DEFAULTS.connection.port);
	var server   = getenv('POSTGRES_PORT_5432_TCP_ADDR', config.connection.server || DEFAULTS.connection.server);
	var user     = getenv('PG_USER', config.connection.user);

    var connection = 'postgres://';

	if ( typeof user === 'string' && typeof password === 'string' ) {
	    connection += user + ':' + password + '@';
	}

    connection += server + ':' + port + '/' + db_name;

    //var db = yield ( new copg.Client( connection ) ).connect_();
    var db = require( 'co-pg' )( pg );
	config.__connection__ = connection;
	db.__name__ = db_name;

    return db;
};
