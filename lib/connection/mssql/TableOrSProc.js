var thunkify = require( 'thunkify' );
var mssql    = require( 'mssql' );
var value    = require( 'useful-value' );

var SQLQuery = require( './SQLQuery' );
var Schema   = require( './Schema' );

function TableOrSProc( id, schema, db ) {
	var params, query, returns;

	if ( typeof id === 'object' ) {
		db     = schema;
		schema = id.schema;

		if ( id.query ) {
			params  = id.params;
			query   = id.query;
			returns = id.returns;
		}

		id     = id.name;
	}

	this.id     = id;
	this.db     = db;

	if ( schema && typeof schema === 'object' ) {
		this.schema = new Schema( schema );
	}
	else {
		this.query = new SQLQuery( this, query, params, returns );
	}
}

module.exports = TableOrSProc;

TableOrSProc.prototype = {
	constructor : TableOrSProc
};

['find', 'query'].forEach( function( method ) {
	this[method] = thunkify( function( query, done ) {
		var req = new mssql.Request( this.db );

		if ( this.schema instanceof Schema ) {
			this.schema.input( req, query );

			req.execute( this.id, function( err, data ) {
				done( err, data ? value( data, '0' ) || data : data );
			} );
		}
		else {
			req.query( this.query.build( query ), function( err, data ) {
				done( err, data ? value( data, '0' ) || data : data );
			} );
		}

	} );
}, TableOrSProc.prototype );
