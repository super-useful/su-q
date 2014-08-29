var thunkify = require( 'thunkify' );
var value    = require( 'useful-value' );

var SQLQuery = require( './SQLQuery' );

function TableOrSProc( id, db ) {
	var params, query, returns;

	if ( typeof id === 'object' ) {
		db      = id.db || db;
        query   = id.query;
		id      = id.name;
	}

	this.id     = id;
	this.db     = db;

    this.q = new SQLQuery( this, query );
}

module.exports = TableOrSProc;

TableOrSProc.prototype = {
	constructor : TableOrSProc
};

['find', 'query'].forEach( function( method ) {
	this[method] = thunkify( function( query, done ) {
	// for reasons — as yet — un-researched the copg.query_ shit don't work!!!
	    this.db.query( this.q.build( query ), function( err, data ) {
			done( err, data ? data.rows || [] : [] );
	    } );
	} );
}, TableOrSProc.prototype );
