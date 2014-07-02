var mssql  = require( 'mssql' );
var func   = require( 'super-func' );
var string = require( 'useful-string' );

function SQLQuery( table, query, params, returns ) {
	this.table   = table;
	this.query   = query;
	this.params  = params && typeof params === 'object'
				 ? prepare( params )
				 : {};
	this.returns = Array.isArray( returns ) && returns.length
				 ? returns.join( ',' )
				 : '*';
}

module.exports     = SQLQuery;
SQLQuery.prototype = {
	constructor : SQLQuery,
	build       : function( params ) {
		var id, query = [];

		for ( id in params ) {
			if ( Object.prototype.hasOwnProperty.call( params, id ) && Object.prototype.hasOwnProperty.call( this.params, id ) ) {
				query.push( this.params[id].name + ' ' + this.params[id].condition + ' ' + params[id] );
			}
		}

		return string.interpolate( this.query, {
			db     : this.table.db.__name__,
			table  : this.table.id,
			select : this.returns,
			where  : query.join( ' AND ' )
		} );
	}
};

function prepare( params ) {
	for ( var id in params ) {
		if ( Object.prototype.hasOwnProperty.call( params, id ) ) {
			switch ( Object.prototype.toString.call( params[id] ) ) {
				case '[object Object]' :
					if ( !params[id].condition ) {
						params[id].condition = '=';
					}

					break;
				case '[object String]' :
					params[id] = {
						name      : params[id],
						condition : '='
					};

					break;
				default                :
					throw new TypeError( 'su-q: invalid SQL Query params format: ' + JSON.stringify( params[id] ) );
			}
		}
	}

	return params;
}
