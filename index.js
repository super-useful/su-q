var url     = require( 'url' );
var co      = require( 'co' );

var connectionsProxy = require( './lib/proxy/connections' );

module.exports = function* db_connections( connections ) {
	if ( !Array.isArray( connections ) ) {
		connections = [connections];
	}

	var proxy = yield connectionsProxy( connections );

	return proxy;
};
