var func   = require( 'super-func' );
var string = require( 'useful-string' );

function SQLQuery( table, query ) {
	this.table = table;
	this.query = query;
}

module.exports     = SQLQuery;
SQLQuery.prototype = {
	constructor : SQLQuery,
	build       : function( params ) {
		params.__name__ = this.table.id;

		return string.interpolate( this.query, params );
	}
};
