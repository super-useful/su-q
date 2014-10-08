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

		var re_jsonparams = /\$?\{{2}([^\}'"]+)\}{2}/g;

		var jsonParsedQuery = String( this.query ).replace( re_jsonparams, function( m, p ) {
			var newKey = '__' + p + ':as_json' + '__';
			params[newKey] = JSON.stringify( params[p] );
			return '{' + newKey + '}';
		} );

		return string.interpolate( jsonParsedQuery, params );
	}
};
