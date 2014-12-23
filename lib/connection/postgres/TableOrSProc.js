var thunkify = require( 'thunkify' );
var value    = require( 'useful-value' );

var SQLQuery = require( './SQLQuery' );

function TableOrSProc( id, db, connection ) {
	var params, query, returns;

	if ( typeof id === 'object' ) {
		db      = id.db || db;
        query   = id.query;
		id      = id.name;
	}

	this.id = id;

// supply an individual connect function to not leave any important details exposed...
	this.connect = function* () {
		return yield db.connectPromise( connection );
	};

    this.q = new SQLQuery( this, query );
}

module.exports = TableOrSProc;

TableOrSProc.prototype = {
	constructor : TableOrSProc
};

['find', 'query'].forEach( function( method ) {
	this[method] = function( query ) {
		var me = this;

		return function* () {
			var connectionResults = yield me.connect();
			var client = connectionResults[0];
			var done = connectionResults[1];

			var result = yield client.queryPromise( me.q.build( query ) );

			// call `done()` to release the client back to the pool
			done();

			return result ? result.rows || [] : [];
		};
	};
}, TableOrSProc.prototype );
