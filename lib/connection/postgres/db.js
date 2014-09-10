var path = require( 'path' );
var getenv = require('getenv');
var copg = require( 'co-pg' )( require( 'pg' ) );

module.exports = function* postgres_connection( config ) {
	var db_name  = getenv('PG_DB_NAME', config.connection.name);
	var password = getenv('PG_PASS', config.connection.pwd);
	var port     = getenv('PG_PORT', config.connection.port);
	var server   = getenv('PG_HOST', config.connection.server);
	var user     = getenv('PG_USER', config.connection.user);

    var connection = 'postgres://';

	if ( typeof user === 'string' && typeof password === 'string' ) {
	    connection += user + ':' + password + '@';
	}

    connection += server + ':' + port + '/' + db_name;

    var db = yield ( new copg.Client( connection ) ).connect_();
	db.__name__ = db_name;

    return db;
};
