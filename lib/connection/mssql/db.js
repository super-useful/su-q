var path     = require( 'path' );

var thunkify = require( 'thunkify' );
var mssql    = require( 'mssql' );

var DEFAULTS = require( '../../helpers/defaults' )( path.resolve( __dirname, 'config.yaml' ) );

mssql.Connection.prototype._connect = mssql.Connection.prototype.connect;
mssql.Connection.prototype.connect  = thunkify( function( done ) {
	var me = this;
	me._connect( function( err ) {
		done( err, me );
	} );
} );
//mssql.Request.prototype.execute = thunkify( mssql.Request.prototype.execute );

module.exports = function* mssql_connection( config ) {
	var db_name   = config.connection.name;
	var port      = config.connection.port   || null;
	var server    = config.connection.server || null;
	var user      = config.connection.user;
	var password  = config.connection.pwd    || process.env[config.connection.PASSWORD_ENVVAR] || process.env.SUQ_MSSQL_PASSWORD;
	var options   = config.options           || {}; // { encrypt : true }; // for windows azure

	if ( port ) {
		options.port = port;
	}

	var db_config = {
			options  : options,
			server   : server,// + ( port ? ':' + port : '' ),
			timeout  : 1000 * 60,
			pool     : {
				idleTimeoutMillis : 1000 * 60,
				max               : 10000,
				min               : 0
			}
		};

	if ( db_name ) {
		db_config.database = db_name;
	}

	if ( user ) {
		db_config.password = password;
		db_config.user     = user;
	}

	var db      = yield ( new mssql.Connection( db_config ) ).connect();
	db.__name__ = db_name;

	return db;
};
