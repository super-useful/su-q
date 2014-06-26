var thunkify = require( 'thunkify' );
var mssql    = require( 'mssql' );
var value    = require( 'useful-value' );

var Schema   = require( './Schema' );

function TableOrSProc( id, schema, db ) {
	if ( typeof id === 'object' ) {
		db     = schema;
		schema = id.schema;
		id     = id.name;
	}

	this.id     = id;
	this.db     = db;
	this.schema = new Schema( schema );
}

module.exports = TableOrSProc;

TableOrSProc.prototype = {
	constructor : TableOrSProc
};

['find', 'query'].forEach( function( method ) {
	this[method] = thunkify( function( query, done ) {
		var req = new mssql.Request( this.db );

		this.schema.input( req, query );

		req.execute( this.id, function( err, data ) {
			done( err, data ? value( data, '0' ) || data : data );
		} );
	} );
}, TableOrSProc.prototype );
