var mssql = require( 'mssql' );

function Schema( config ) {
	this.properties = [];

	for ( var k in config ) {
		if ( Object.prototype.hasOwnProperty.call( config, k ) ) {
			this.properties.push( {
				id : k,
				type : ( typeof config[k] === 'string'
					? mssql[config[k]]
					: mssql[config[k].type]( mssql[config[k].value] ) )
			} );
		}
	}
}

module.exports   = Schema;
Schema.prototype = {
	constructor : Schema,
	input       : function( request, params ) {
		if ( params && typeof params === 'object' && Object.keys( params ).length ) {
			this.properties.forEach( function( prop ) {
				request.input( prop.id, prop.type, params[prop.id] );
			} );
		}

		return this;
	}
};
